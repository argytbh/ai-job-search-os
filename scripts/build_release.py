#!/usr/bin/env python3
"""Build/check migration guide, Personal Workspace, portable fallback, and checksums.

No network or third-party dependencies. Does not publish or install anything.
"""
import argparse
import hashlib
import io
import json
from pathlib import Path
import re
import zipfile

from build_portable import build as build_portable, REFERENCE_ORDER

ROOT = Path(__file__).resolve().parents[1]


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def checksums(files: dict[str, bytes]) -> bytes:
    return "".join(f"{digest(data)}  {name}\n" for name, data in sorted(files.items())).encode()


def archive(files: dict[str, bytes]) -> bytes:
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for name, data in sorted(files.items()):
            info = zipfile.ZipInfo(name, date_time=(2020, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            zf.writestr(info, data)
    return output.getvalue()


def build_artifacts(root: Path = ROOT) -> dict[str, bytes]:
    manifest = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
    version = manifest["version"]
    ref = manifest["source_ref"]
    release_stage = manifest["release_stage"]
    if not re.fullmatch(r"[0-9]+\.[0-9]+\.[0-9]+(?:-[a-zA-Z0-9.-]+)?", version):
        raise ValueError("Invalid version")
    if ref != f"v{version}":
        raise ValueError("source_ref must be the exact version tag")
    if release_stage not in {"development", "stable"}:
        raise ValueError("Unsupported release_stage")
    repo = manifest["repository"]
    if repo != "https://github.com/argytbh/ai-job-search-os":
        raise ValueError("Unexpected distribution repository")
    skill_dir = root / "skill" / "ai-job-search-os"
    skill_text = (skill_dir / "SKILL.md").read_text(encoding="utf-8")
    if f'version: "{version}"' not in skill_text:
        raise ValueError("Skill and manifest versions differ")
    reference_names = {p.name for p in (skill_dir / "references").glob("*.md")}
    if reference_names != set(REFERENCE_ORDER):
        raise ValueError("Portable reference list does not match the complete Skill bundle")
    for path in skill_dir.rglob("*.md"):
        text = path.read_text(encoding="utf-8")
        for target in re.findall(r"references/([\w-]+\.md)", text):
            if not (skill_dir / "references" / target).is_file():
                raise ValueError(f"Missing routed resource: {target}")
    manifest_bytes = (json.dumps(manifest, indent=2, ensure_ascii=False) + "\n").encode()
    raw = repo.replace("https://github.com/", "https://raw.githubusercontent.com/") + f"/{ref}"
    install = (root / manifest["bootstrap_source"]).read_text(encoding="utf-8").strip()
    bootstrap = (
        "# AI JOB SEARCH OS — SYSTEM / SETUP\n\n"
        "> Generated from INSTALL.md and manifest.json. Upload this file and say 'Start AI Job Search OS'.\n\n"
        "## Distribution\n\n"
        f"- Version: {version}\n- Repository: {repo}\n- Exact source ref: {ref}\n"
        f"- Manifest: {raw}/manifest.json\n"
        f"- Skill entry: {raw}/{manifest['canonical_skill']}\n"
        f"- Portable fallback: {raw}/{manifest['portable_system']}\n"
        "- Same-ZIP fallback: PORTABLE_WORKFLOW.md\n"
        "- Same-ZIP bundle: skill/ai-job-search-os/ (version in manifest.json)\n"
        f"- Native import archive: AI-Job-Search-OS-Skill-v{version}.zip\n"
        + (
            "- The exact ref may be unavailable for an unpublished development package. Use the matching bundled files; never switch to HEAD.\n\n"
            if release_stage == "development"
            else "- Distribution is pinned to this exact stable tag; never switch to HEAD.\n\n"
        )
        + install + "\n"
    ).encode()
    migration = (root / manifest["migration_source"]).read_text(encoding="utf-8").strip()
    workspace_asset = Path(manifest["starter_archive"]).name
    asset_url = f"{repo}/releases/download/{ref}/{workspace_asset}"
    migration_guide = (
        "# MULAI DI SINI — AI Job Search OS\n\n"
        "> Upload file ini ke AI chat yang sekarang kamu pakai, lalu bilang: **Bantu saya mulai.**\n\n"
        "## Distribution\n\n"
        f"- Version: {version}\n"
        f"- Personal Workspace: {asset_url}\n"
        + (
            "- This development release may not exist publicly until the matching tag and asset are published.\n\n"
            if release_stage == "development"
            else "- This stable distribution is pinned to the matching tag and release asset.\n\n"
        )
        + migration + "\n"
    ).encode()
    portable = build_portable(root).encode()
    skill_files = {
        "ai-job-search-os/" + p.relative_to(skill_dir).as_posix(): p.read_text(encoding="utf-8").replace("\r\n", "\n").encode()
        for p in sorted(skill_dir.rglob("*.md"))
    }
    skill_zip = archive(skill_files)
    workspace_source = root / "workspace"
    workspace_files = {
        p.relative_to(workspace_source).as_posix(): p.read_bytes()
        for p in sorted(workspace_source.rglob("*")) if p.is_file()
    }
    workspace_files.update({
        "VERSION": (version + "\n").encode(),
        "LICENSE": (root / "LICENSE").read_bytes(),
        **{"system/" + name: data for name, data in skill_files.items()},
    })
    forbidden_parts = {".git", ".github"}
    for name in workspace_files:
        if forbidden_parts.intersection(Path(name).parts):
            raise ValueError(f"Personal Workspace contains Git metadata: {name}")
    workspace_files["SHA256SUMS.txt"] = checksums(workspace_files)
    workspace_zip = archive(workspace_files)
    artifacts = {
        manifest["bootstrap"]: bootstrap,
        manifest["migration_guide"]: migration_guide,
        manifest["portable_system"]: portable,
        "portable/SYSTEM.md": portable,
        "docs/downloads/SYSTEM.md": bootstrap,
        "docs/downloads/PORTABLE_WORKFLOW.md": portable,
        manifest["starter_archive"]: workspace_zip,
        manifest["skill_archive"]: skill_zip,
        "docs/downloads/MULAI_DI_SINI.md": migration_guide,
        "docs/downloads/" + Path(manifest["starter_archive"]).name: workspace_zip,
    }
    artifacts["SHA256SUMS.txt"] = checksums({
        **artifacts,
        "manifest.json": (root / "manifest.json").read_bytes(),
    })
    for name in artifacts:
        path = (root / name).resolve()
        if not path.is_relative_to(root.resolve()):
            raise ValueError(f"Output escapes workspace: {name}")
    return artifacts


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check without writing")
    args = parser.parse_args()
    artifacts = build_artifacts()
    stale = []
    for name, expected in artifacts.items():
        path = ROOT / name
        if args.check:
            if not path.is_file() or path.read_bytes() != expected:
                stale.append(name)
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(expected)
    if stale:
        print("Stale/missing artifacts:\n" + "\n".join(stale))
        return 1
    stage = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))["release_stage"]
    print(f"{'Checked' if args.check else 'Built'} {len(artifacts)} artifacts for the local {stage} package. No publication performed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
