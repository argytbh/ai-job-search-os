"""Distribution invariants; these do not certify AI host behavior."""
import hashlib
import io
from html.parser import HTMLParser
import json
from pathlib import Path
import shutil
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
            for name in ("MULAI_DI_SINI.md", "BUKA_DASHBOARD.html", "AGENTS.md", "CLAUDE.md", "GEMINI.md", "VERSION", "data/tracker.json", "reports/DASHBOARD.md"):
                self.assertIn(name, zf.namelist())
            tracker = json.loads(zf.read("data/tracker.json"))
            self.assertEqual(tracker["jobs"], [])
            self.assertEqual(tracker["contacts"], [])
            self.assertEqual(tracker["activity"], [])
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
            "give one concrete action per response",
            "hanya kamu yang bisa mengaksesnya",
            "https://chatgpt.com/download/",
            "ChatGPT Work, Claude Cowork, ordinary AI chats",
            "Ask them to select **Codex** from the product menu",
            "https://antigravity.google/download",
            "https://cursor.com/downloads",
            "https://code.claude.com/docs/en/getting-started",
            "kamu tidak perlu akun GitHub",
            "data/SETUP_STATUS.json",
        ):
            self.assertIn(expected, guide)
        self.assertNotIn("git clone https://", guide.lower())

    def test_workspace_tracker_seed_matches_declared_schema_shape(self):
        with self.workspace() as zf:
            seed = json.loads(zf.read("data/tracker.json"))
            schema = json.loads(zf.read("system/tracker.schema.json"))
            self.assertEqual(set(schema["required"]), set(seed))
            self.assertEqual(seed["schema_version"], schema["properties"]["schema_version"]["const"])
            statuses = schema["properties"]["jobs"]["items"]["properties"]["status"]["enum"]
            self.assertTrue({"Review", "Hold", "Applied", "Rejected", "Closed"}.issubset(statuses))

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
        self.assertTrue(links)
        for link in links:
            self.assertIn("docs/" + link, self.artifacts)

    def test_dashboard_is_local_only_and_packaged(self):
        page = (ROOT / "docs/dashboard/index.html").read_text(encoding="utf-8")
        script = (ROOT / "docs/dashboard/dashboard.js").read_text(encoding="utf-8")
        self.assertIn("connect-src 'none'", page)
        self.assertIn("showDirectoryPicker", script)
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
            self.assertIn("https://argytbh.github.io/ai-job-search-os/dashboard/", launcher)

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
