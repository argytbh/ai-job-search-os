#!/usr/bin/env python3
"""Build the standalone Portable Mode SYSTEM.md from the canonical Skill bundle.

Canonical behavior lives under skill/ai-job-search-os/. Do not hand-edit the
portable output as the source of truth.
"""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
SKILL_DIR = ROOT / "skill" / "ai-job-search-os"
OUT = ROOT / "portable" / "PORTABLE_WORKFLOW.md"

REFERENCE_ORDER = [
    "startup.md",
    "onboarding.md",
    "discovery.md",
    "shortlist.md",
    "application.md",
    "ats-documents.md",
    "contacts-outreach.md",
    "recruitment.md",
    "persistence.md",
]


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8").strip()


def strip_frontmatter(text: str) -> str:
    """Remove one leading YAML frontmatter block from SKILL.md."""
    return re.sub(r"\A---\s*\n.*?\n---\s*\n", "", text, count=1, flags=re.S).strip()


def build(root: Path = ROOT) -> str:
    import json
    skill_dir = root / "skill" / "ai-job-search-os"
    version = json.loads((root / "manifest.json").read_text(encoding="utf-8"))["version"]
    skill = strip_frontmatter(read_text(skill_dir / "SKILL.md"))

    parts = [
        "# AI JOB SEARCH OS — PORTABLE WORKFLOW",
        f"Workflow version: {version}",
        "",
        "> GENERATED FILE — canonical behavior lives under `skill/ai-job-search-os/`.",
        "> This standalone fallback is for environments where Agent Skills are unavailable.",
        "> Do not use this generated file as the source of truth for behavior changes.",
        "",
        "## Portable Runtime Note",
        "",
        "Treat all workflow references named below as embedded sections of this document. "
        "Do not attempt to fetch GitHub during normal runtime. The user should provide a sanitized CV, "
        "a current tracker state and USER_CONTEXT.md after approved onboarding. In a Personal Workspace, honor data/tracker.config.json and use exactly one verified tracker mode.",
        "",
        skill,
    ]

    for filename in REFERENCE_ORDER:
        path = skill_dir / "references" / filename
        parts.extend([
            "",
            "---",
            "",
            f"<!-- BEGIN EMBEDDED REFERENCE: {filename} -->",
            "",
            read_text(path),
            "",
            f"<!-- END EMBEDDED REFERENCE: {filename} -->",
        ])

    return "\n".join(parts).rstrip() + "\n"


def main() -> None:
    output = build()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(output, encoding="utf-8", newline="\n")
    # Compatibility path for v1.6 development links; this is not the bootstrap.
    (ROOT / "portable" / "SYSTEM.md").write_text(output, encoding="utf-8", newline="\n")
    print(f"Wrote {OUT.relative_to(ROOT)} ({len(output)} chars)")


if __name__ == "__main__":
    main()
