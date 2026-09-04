"""Render the public social-preview image used by GitHub Pages and repository sharing."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "social-preview.png"
WIDTH, HEIGHT = 1280, 640


def font(size: int, bold: bool = False):
    names = (
        ["C:/Windows/Fonts/seguisb.ttf", "C:/Windows/Fonts/arialbd.ttf"]
        if bold
        else ["C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf"]
    )
    names += ["/System/Library/Fonts/SFNS.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
    for name in names:
        if Path(name).exists():
            return ImageFont.truetype(name, size)
    return ImageFont.load_default(size=size)


image = Image.new("RGB", (WIDTH, HEIGHT), "#f6f9fc")
draw = ImageDraw.Draw(image)

# Quiet brand field with a single directional motif.
draw.ellipse((930, -210, 1390, 250), fill="#e7f1fb")
draw.rounded_rectangle((64, 56, 310, 102), radius=23, fill="#dcecf9")
draw.text((88, 67), "OPEN SOURCE · INDONESIA", font=font(18, True), fill="#1f5ea8")

draw.text((66, 142), "AI JOB SEARCH OS", font=font(29, True), fill="#1f5ea8")
draw.multiline_text(
    (62, 205),
    "AI untuk cari kerja,\ntanpa kehilangan kendali.",
    font=font(61, True),
    fill="#142033",
    spacing=9,
)
draw.text(
    (67, 380),
    "Job discovery · Tracker lamaran · CV ATS · Recruiter research",
    font=font(25),
    fill="#58667a",
)

steps = [("CHAT", 66), ("WORKSPACE", 260), ("LO YANG PUTUSKAN", 525)]
for label, x in steps:
    width = 160 if label == "CHAT" else (224 if label == "WORKSPACE" else 300)
    fill = "#17324d" if label == "LO YANG PUTUSKAN" else "#ffffff"
    ink = "#ffffff" if label == "LO YANG PUTUSKAN" else "#17324d"
    draw.rounded_rectangle((x, 466, x + width, 526), radius=16, fill=fill, outline="#c7d6e5", width=2)
    bbox = draw.textbbox((0, 0), label, font=font(18, True))
    draw.text((x + (width - (bbox[2] - bbox[0])) / 2, 483), label, font=font(18, True), fill=ink)

draw.text((231, 480), "→", font=font(27, True), fill="#1f5ea8")
draw.text((492, 480), "→", font=font(27, True), fill="#1f5ea8")
draw.text((67, 571), "Beginner-friendly · Privacy-conscious · Mulai dari 1 file", font=font(21, True), fill="#1f5ea8")
draw.text((1028, 570), "by ARGYTBH", font=font(20, True), fill="#58667a")

image.save(OUTPUT, "PNG", optimize=True)
print(f"Rendered {OUTPUT} ({WIDTH}x{HEIGHT}, {OUTPUT.stat().st_size} bytes)")
