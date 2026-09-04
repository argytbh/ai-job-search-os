"""Distribution invariants; these do not certify AI host behavior."""
import hashlib
import io
from html.parser import HTMLParser
import json
from pathlib import Path
import shutil
import struct
import sys
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from build_release import build_artifacts
from build_portable import REFERENCE_ORDER


class DistributionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = json.loads((ROOT / "manifest.json").read_text())
        cls.artifacts = build_artifacts(ROOT)

    def workspace(self):
        return zipfile.ZipFile(io.BytesIO(self.artifacts[self.manifest["starter_archive"]]))

    def test_build_is_reproducible(self):
        self.assertEqual(self.artifacts, build_artifacts(ROOT))

    def test_personal_workspace_contains_runtime_and_local_state(self):
        with self.workspace() as zf:
            for name in ("MULAI_DI_SINI.md", "BUKA_DASHBOARD.html", "AGENTS.md", "CLAUDE.md", "GEMINI.md", "VERSION", "data/tracker.json", "data/tracker.config.json", "system/tracker-config.schema.json", "reports/DASHBOARD.md", "dashboard/index.html", "dashboard/dashboard.css", "dashboard/dashboard.js"):
                self.assertIn(name, zf.namelist())
            tracker = json.loads(zf.read("data/tracker.json"))
            self.assertEqual(tracker["jobs"], [])
            self.assertEqual(tracker["contacts"], [])
            self.assertEqual(tracker["activity"], [])
            tracker_config = json.loads(zf.read("data/tracker.config.json"))
            self.assertEqual(tracker_config["mode"], "local_json")
            self.assertIsNone(tracker_config["google_sheet_url"])
            for name in REFERENCE_ORDER:
                expected = (ROOT / "skill/ai-job-search-os/references" / name).read_text(encoding="utf-8").strip()
                self.assertEqual(expected, zf.read("system/ai-job-search-os/references/" + name).decode().strip())

    def test_every_packaged_payload_has_a_valid_checksum(self):
        with self.workspace() as zf:
            checked = set()
            for line in zf.read("SHA256SUMS.txt").decode().splitlines():
                checksum, name = line.split("  ", 1)
                self.assertEqual(checksum, hashlib.sha256(zf.read(name)).hexdigest())
                checked.add(name)
            self.assertEqual(checked, set(zf.namelist()) - {"SHA256SUMS.txt"})

    def test_native_import_archive_equals_workspace_skill(self):
        with self.workspace() as workspace, zipfile.ZipFile(io.BytesIO(self.artifacts[self.manifest["skill_archive"]])) as native:
            for member in native.namelist():
                self.assertEqual(native.read(member), workspace.read("system/" + member))

    def test_bootstrap_embeds_full_setup_without_network_dependency(self):
        bootstrap = self.artifacts["starter/SYSTEM.md"].decode()
        self.assertIn((ROOT / "INSTALL.md").read_text(encoding="utf-8").strip(), bootstrap)
        self.assertIn("/" + self.manifest["source_ref"] + "/manifest.json", bootstrap)
        self.assertEqual(self.artifacts["starter/SYSTEM.md"], self.artifacts["docs/downloads/SYSTEM.md"])
        self.assertEqual(self.artifacts["portable/PORTABLE_WORKFLOW.md"], self.artifacts["docs/downloads/PORTABLE_WORKFLOW.md"])

    def test_migration_guide_is_generated_and_links_exact_workspace_release(self):
        guide = self.artifacts["starter/MULAI_DI_SINI.md"].decode()
        self.assertIn((ROOT / "MIGRATION_COACH.md").read_text(encoding="utf-8").strip(), guide)
        self.assertIn("/releases/download/" + self.manifest["source_ref"] + "/", guide)
        self.assertEqual(self.artifacts["starter/MULAI_DI_SINI.md"], self.artifacts["docs/downloads/MULAI_DI_SINI.md"])

    def test_migration_guide_enforces_safe_nontechnical_handoff(self):
        guide = self.artifacts["starter/MULAI_DI_SINI.md"].decode()
        for expected in (
            "Give a complete, detailed setup guide in one response",
            "The uploaded file is the starting point",
            "Kenapa perlu aplikasi agent?",
            "agent adalah AI yang duduk di meja kerja",
            "Kamu tidak perlu menulis kode",
            "Personal Workspace ZIP",
            "without asking the user to browse GitHub or find a release",
            "Do not scatter these questions across many messages",
            "provide its complete steps together under clear sections",
            "hanya kamu yang bisa mengaksesnya",
            "Kamu mau tracker disimpan di komputer saja, atau di Google Sheets?",
            "The two modes are alternatives, not simultaneous databases",
            "folder Personal Workspace yang sama",
            "Gunakan satu agent pada satu waktu",
            "tidak tersinkron otomatis",
            "Their continuity comes from reading the same local files",
            "https://chatgpt.com/download/",
            "ChatGPT Work, Claude Cowork, ordinary AI chats",
            "Ask them to select **Codex** from the product menu",
            "https://antigravity.google/download",
            "https://cursor.com/downloads",
            "https://code.claude.com/docs/en/getting-started",
            "kamu tidak perlu akun GitHub",
            "data/SETUP_STATUS.json",
            "data/tracker.config.json",
            "do not send them back to this web chat",
        ):
            self.assertIn(expected, guide)
        self.assertNotIn("satu langkah per pesan", guide.lower())
        self.assertNotIn("git clone https://", guide.lower())

    def test_workspace_tracker_seed_matches_declared_schema_shape(self):
        with self.workspace() as zf:
            seed = json.loads(zf.read("data/tracker.json"))
            schema = json.loads(zf.read("system/tracker.schema.json"))
            self.assertEqual(set(schema["required"]), set(seed))
            self.assertEqual(seed["schema_version"], schema["properties"]["schema_version"]["const"])
            statuses = schema["properties"]["jobs"]["items"]["properties"]["status"]["enum"]
            self.assertTrue({"Review", "Hold", "Applied", "Rejected", "Closed"}.issubset(statuses))
            tracker_config = json.loads(zf.read("data/tracker.config.json"))
            config_schema = json.loads(zf.read("system/tracker-config.schema.json"))
            self.assertEqual(set(config_schema["required"]), set(tracker_config))
            self.assertEqual(tracker_config["schema_version"], config_schema["properties"]["schema_version"]["const"])
            self.assertIn(tracker_config["mode"], config_schema["properties"]["mode"]["enum"])

    def test_workspace_has_no_git_or_private_user_data(self):
        with self.workspace() as zf:
            for name in zf.namelist():
                self.assertFalse(name.startswith("/") or ".." in Path(name).parts)
                self.assertNotIn(".git", Path(name).parts)
                self.assertNotIn(".github", Path(name).parts)
                self.assertNotIn("USER_CONTEXT.md", name)
                self.assertFalse(name.endswith((".py", ".exe", ".ps1")))
            instructions = zf.read("AGENTS.md").decode()
            self.assertIn("Never initialize or use Git", instructions)
            self.assertIn("data/SETUP_STATUS.json", instructions)

    def test_pages_downloads_resolve_to_built_files(self):
        links = []

        class Links(HTMLParser):
            def handle_starttag(self, tag, attrs):
                attrs = dict(attrs)
                if tag == "a" and "download" in attrs:
                    links.append(attrs["href"])

        Links().feed((ROOT / "docs/index.html").read_text(encoding="utf-8"))
        for link in links:
            self.assertIn("docs/" + link, self.artifacts)

    def test_pages_has_one_public_setup_entrypoint(self):
        page = (ROOT / "docs/index.html").read_text(encoding="utf-8")
        starter_url = "https://github.com/argytbh/ai-job-search-os/releases/download/v1.8.1/MULAI_DI_SINI.md"
        self.assertEqual(page.count(starter_url), 6)
        self.assertNotIn('href="downloads/AI-Job-Search-Personal-Workspace-v1.8.1.zip"', page)
        self.assertIn("Preview dashboard lokal", page)
        self.assertIn('type="application/ld+json"', page)
        self.assertIn('id="cara-pakai"', page)
        structured_data = [
            json.loads(block.split("</script>", 1)[0])
            for block in page.split('<script type="application/ld+json">')[1:]
        ]
        howto = next(item for item in structured_data if item.get("@type") == "HowTo")
        self.assertEqual(howto["@type"], "HowTo")
        self.assertEqual(len(howto["step"]), 6)
        for expected in (
            "Ini satu-satunya file yang perlu lo cari sendiri",
            "Bantu saya mulai.",
            "Pilih tempat tracker",
            "Buka Personal Workspace",
            "Lo tidak perlu clone repository",
            "Masukkan CV dan mulai",
            "AI untuk cari kerja yang tetap bikin lo pegang kendali.",
            "Mulai Setup — Download 1 File",
            "Kenapa pindah ke aplikasi agent?",
            "Tetap ngobrol dengan AI. Sekarang AI juga punya meja kerja.",
            "folder Personal Workspace yang sama",
            "satu agent pada satu waktu",
            "tidak ikut sinkron otomatis",
            "Dashboard ini bisa lo ubah sesuai cara kerja lo",
            "Catatan dari pembuatnya",
        ):
            self.assertIn(expected, page)

    def test_visit_analytics_is_disclosed_and_limited_to_landing_page(self):
        landing = (ROOT / "docs/index.html").read_text(encoding="utf-8")
        dashboard = (ROOT / "docs/dashboard/index.html").read_text(encoding="utf-8")
        dashboard_script = (ROOT / "docs/dashboard/dashboard.js").read_text(encoding="utf-8")
        beacon = "https://static.cloudflareinsights.com/beacon.min.js"
        token = "b274b7740bde42ee89db20fa1330ac4f"
        self.assertEqual(landing.count(beacon), 1)
        self.assertEqual(landing.count(token), 1)
        self.assertIn("Landing page ini hanya menghitung kunjungan agregat tanpa cookie", landing)
        self.assertIn("Dashboard lokal hanya membaca folder setelah lo memberi izin dan tidak mengunggah CV, tracker, atau riwayat lamaran", landing)
        self.assertNotIn(beacon, dashboard)
        self.assertNotIn(beacon, dashboard_script)
        self.assertNotIn(token, dashboard)
        self.assertNotIn(token, dashboard_script)

    def test_public_page_has_search_and_social_metadata(self):
        page = (ROOT / "docs/index.html").read_text(encoding="utf-8")
        for expected in (
            "AI untuk Cari Kerja, Job Tracker &amp; CV ATS | AI Job Search OS",
            'rel="canonical" href="https://argytbh.github.io/ai-job-search-os/"',
            'property="og:title"',
            'property="og:description"',
            'property="og:image" content="https://argytbh.github.io/ai-job-search-os/social-preview.png"',
            'name="twitter:card" content="summary_large_image"',
            '"@type": "WebSite"',
            "AI untuk cari kerja yang tetap bikin lo pegang kendali.",
        ):
            self.assertIn(expected, page)

        sitemap = (ROOT / "docs/sitemap.xml").read_text(encoding="utf-8")
        self.assertEqual(sitemap.count("<loc>"), 1)
        self.assertIn("<loc>https://argytbh.github.io/ai-job-search-os/</loc>", sitemap)
        robots = (ROOT / "docs/robots.txt").read_text(encoding="utf-8")
        self.assertIn("Allow: /", robots)
        self.assertIn("Sitemap: https://argytbh.github.io/ai-job-search-os/sitemap.xml", robots)
        verification = (ROOT / "docs/googlea04e7a88243eaaa3.html").read_text(encoding="utf-8").strip()
        self.assertEqual(verification, "google-site-verification: googlea04e7a88243eaaa3.html")

        preview = (ROOT / "docs/social-preview.png").read_bytes()
        self.assertEqual(preview[:8], b"\x89PNG\r\n\x1a\n")
        self.assertEqual(struct.unpack(">II", preview[16:24]), (1280, 640))
        self.assertLess(len(preview), 1_000_000)

    def test_dashboard_is_local_only_and_packaged(self):
        page = (ROOT / "docs/dashboard/index.html").read_text(encoding="utf-8")
        script = (ROOT / "docs/dashboard/dashboard.js").read_text(encoding="utf-8")
        self.assertIn("connect-src 'none'", page)
        self.assertIn("showDirectoryPicker", script)
        self.assertIn('getFileHandle("tracker.config.json")', script)
        self.assertIn('config.mode === "google_sheets"', script)
        self.assertIn('id="cloudMode"', page)
        self.assertIn('getDirectoryHandle("data")', script)
        self.assertIn("createWritable", script)
        self.assertIn("status_changed", script)
        self.assertIn('id="tableView"', page)
        self.assertIn("renderTable", script)
        for section in ("dashboard", "analytics", "tracker", "logs"):
            self.assertIn(f'data-section="{section}"', page)
        for renderer in ("renderAnalytics", "renderDonutChart", "renderBarChart", "renderLogs", "saveJob", "persistTrackerChange", "buildTrackerCsv", "exportTrackerCsv", "Belum diklasifikasikan"):
            self.assertIn(renderer, script)
        self.assertIn('id="exportCsvButton"', page)
        self.assertIn('nextStatus === "Interview" && !job.interview_at', script)
        for field in ("jobCompany", "jobRole", "jobUrl", "jobApplied", "jobInterview", "recruiterUrl"):
            self.assertIn(f'id="{field}"', page)
        self.assertIn("setInterval(() => refresh(false), 1500)", script)
        for network_api in ("fetch(", "XMLHttpRequest", "WebSocket", "EventSource", "sendBeacon"):
            self.assertNotIn(network_api, script)
        with self.workspace() as zf:
            launcher = zf.read("BUKA_DASHBOARD.html").decode()
            self.assertIn("dashboard/index.html", launcher)
            self.assertNotIn("argytbh.github.io", launcher)
            self.assertEqual(zf.read("dashboard/index.html"), (ROOT / "docs/dashboard/index.html").read_bytes())
            self.assertEqual(zf.read("dashboard/dashboard.css"), (ROOT / "docs/dashboard/dashboard.css").read_bytes())
            self.assertEqual(zf.read("dashboard/dashboard.js"), (ROOT / "docs/dashboard/dashboard.js").read_bytes())

    def test_dashboard_customization_preserves_simple_local_architecture(self):
        router = (ROOT / "skill/ai-job-search-os/SKILL.md").read_text(encoding="utf-8")
        persistence = (ROOT / "skill/ai-job-search-os/references/persistence.md").read_text(encoding="utf-8")
        workspace = (ROOT / "workspace/AGENTS.md").read_text(encoding="utf-8")
        self.assertIn("customize the local dashboard", router)
        for expected in (
            "The local dashboard source is bundled inside the Personal Workspace",
            "make the smallest coherent change",
            "connect-src 'none'",
            "do not add analytics, remote scripts, APIs, accounts, databases, servers, build systems, package managers, hosting, or deployment steps",
            "do not turn ordinary interface customization into a DevOps project",
        ):
            self.assertIn(expected, persistence)
        self.assertIn("editable local dashboard source lives under `dashboard/`", workspace)

    def fixture(self, directory):
        root = Path(directory)
        shutil.copy(ROOT / "manifest.json", root / "manifest.json")
        shutil.copytree(ROOT / "skill", root / "skill")
        return root

    def test_missing_module_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            root = self.fixture(directory)
            (root / "skill/ai-job-search-os/references/startup.md").unlink()
            with self.assertRaisesRegex(ValueError, "complete Skill"):
                build_artifacts(root)

    def test_mixed_version_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            root = self.fixture(directory)
            path = root / "skill/ai-job-search-os/SKILL.md"
            path.write_text(path.read_text(encoding="utf-8").replace(self.manifest["version"], "1.0.0"), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "versions differ"):
                build_artifacts(root)


if __name__ == "__main__":
    unittest.main()
