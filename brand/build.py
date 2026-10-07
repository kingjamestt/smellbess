"""Build the Smell Bess logo files (brand pack: business-plan.md section 5a).

Draws every mark from the Archivo font itself and turns all lettering into
outlines, so the SVGs look the same on any machine, in any app, with no font
installed. Geometry follows the brand pack canvas (Logo and Seal boards):
https://claude.ai/artifact/UofYt4NYKqVGszxNcpQXcw

    pip install fonttools
    python brand/build.py          # writes brand/svg/*.svg and web/src/app/opengraph-image.svg
    node brand/render.mjs          # writes brand/png/*.png and web/src/app/opengraph-image.png

Fonts are downloaded from Google Fonts into brand/.fonts (gitignored).
Archivo is licensed under the SIL Open Font License 1.1.
"""

import math
import re
import urllib.request
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent
FONTS = ROOT / ".fonts"
SVG = ROOT / "svg"

NIGHT, SMOKE, PEARL, ASH, AMBER = "#121014", "#1E1B21", "#EAE8E5", "#8F8A93", "#E3A23B"
INK_SOFT = "#5E5962"  # descriptor grey on light, from the Logo board

# (width axis, weight) for each cut we use.
CUTS = {"exp300": (125, 300), "exp400": (125, 400), "exp500": (125, 500), "norm400": (100, 400)}


def font_file(name: str) -> Path:
    path = FONTS / f"{name}.ttf"
    if not path.exists():
        FONTS.mkdir(exist_ok=True)
        wdth, wght = CUTS[name]
        css_url = f"https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@{wdth},{wght}"
        # A non-browser user agent makes Google Fonts serve plain TTF.
        css = urllib.request.urlopen(urllib.request.Request(css_url, headers={"User-Agent": "curl"})).read().decode()
        url = re.search(r"url\((https://[^)]+\.ttf)\)", css).group(1)
        path.write_bytes(urllib.request.urlopen(url).read())
    return path


class Face:
    def __init__(self, name: str):
        self.font = TTFont(font_file(name))
        self.glyphs = self.font.getGlyphSet()
        self.cmap = self.font.getBestCmap()
        self.upm = self.font["head"].unitsPerEm
        self.cap = self.font["OS/2"].sCapHeight

    def glyph(self, ch: str) -> str:
        return self.cmap[ord(ch)]

    def advance(self, ch: str, size: float) -> float:
        return self.font["hmtx"][self.glyph(ch)][0] * size / self.upm

    def width(self, text: str, size: float, tracking: float = 0) -> float:
        """Width of tracked text, without the trailing tracking after the last letter."""
        return sum(self.advance(c, size) for c in text) + tracking * size * (len(text) - 1)

    def path(self, ch: str, x: float, y: float, size: float) -> str:
        """Outline of one glyph with its baseline origin at (x, y)."""
        if ch == " ":
            return ""
        s = size / self.upm
        pen = SVGPathPen(self.glyphs)
        self.glyphs[self.glyph(ch)].draw(TransformPen(pen, (s, 0, 0, -s, x, y)))
        return pen.getCommands()

    def text(self, text: str, x: float, y: float, size: float, tracking: float = 0, anchor: str = "start") -> str:
        """Outlined, tracked text as one path's d attribute. tracking is in em."""
        w = self.width(text, size, tracking)
        x -= {"start": 0, "middle": w / 2, "end": w}[anchor]
        out = []
        for c in text:
            out.append(self.path(c, x, y, size))
            x += self.advance(c, size) + tracking * size
        return " ".join(p for p in out if p)

    def ring(self, text: str, cx: float, cy: float, r: float, size: float, length: float) -> str:
        """Text set on a circle, starting at the left and running clockwise over the top.
        Matches SVG textPath with textLength=length and lengthAdjust=spacing."""
        natural = sum(self.advance(c, size) for c in text)
        gap = (length - natural) / len(text)
        out, s = [], 0.0
        for c in text:
            adv = self.advance(c, size)
            phi = (s + adv / 2) / r  # radians travelled from the start point
            a = math.pi + phi
            px, py = cx + r * math.cos(a), cy + r * math.sin(a)
            rot = math.degrees(phi) - 90  # baseline follows the tangent
            if c != " ":
                d = self.path(c, -adv / 2, 0, size)
                out.append(f'<path transform="translate({px:.3f} {py:.3f}) rotate({rot:.3f})" d="{d}"/>')
            s += adv + gap
        return "".join(out)


def svg(w: float, h: float, body: str, title: str, bg: str | None = None) -> str:
    rect = f'<rect width="{w:g}" height="{h:g}" fill="{bg}"/>' if bg else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:g} {h:g}" width="{w:g}" height="{h:g}" '
        f'role="img" aria-label="{title}"><title>{title}</title>{rect}{body}</svg>\n'
    )


exp300, exp400, exp500, norm400 = (Face(n) for n in CUTS)
RING = "SMELL BESS · ONLY THE BEST · TRINIDAD & TOBAGO · "


def seal(fg: str, accent: str, *, fill: str | None = None, light: bool = False, est: str | None = None) -> str:
    """The thin-ring seal on a 200x200 grid (Seal board). Optionally offset into a larger canvas by the caller."""
    ring_face = exp500 if light or fill else exp400
    mono_face = exp400 if light or fill else exp300
    parts = []
    if fill:
        parts.append(f'<circle cx="100" cy="100" r="98" fill="{fill}"/>')
    else:
        parts.append(f'<circle cx="100" cy="100" r="96" fill="none" stroke="{fg}" stroke-width="{1.6 if light else 1.2}"/>')
        if not light:
            parts.append(f'<circle cx="100" cy="100" r="92" fill="none" stroke="{fg}" stroke-width="0.5"/>')
    parts.append(f'<circle cx="100" cy="100" r="64" fill="none" stroke="{fg}" stroke-width="{0.8 if light or fill else 0.5}"/>')
    parts.append(f'<g fill="{fg}">{ring_face.ring(RING, 100, 100, 77, 9.5, 470)}</g>')
    parts.append(f'<path fill="{fg}" d="{mono_face.text("S", 80, 110, 30, anchor="middle")} {mono_face.text("B", 120, 110, 30, anchor="middle")}"/>')
    bar = (99.3, 1.4) if not (light or fill) else (99, 2)
    parts.append(f'<rect x="{bar[0]}" y="82" width="{bar[1]}" height="34" fill="{accent}"/>')
    if est:
        parts.append(f'<path fill="{est}" d="{exp500.text("EST. 2026", 100, 138, 6, tracking=0.4, anchor="middle")}"/>')
    return "".join(parts)


def wordmark(x: float, y: float, size: float, fg: str) -> tuple[str, float]:
    """SMELL BESS, BESS in Amber, tracked 0.22em. Returns (markup, width)."""
    t = 0.22
    smell = "SMELL "
    w_smell = exp300.width(smell, size, t) + t * size
    w = exp300.width("SMELL BESS", size, t)
    return (
        f'<path fill="{fg}" d="{exp300.text("SMELL", x, y, size, t)}"/>'
        f'<path fill="{AMBER}" d="{exp300.text("BESS", x + w_smell, y, size, t)}"/>',
        w,
    )


def write(name: str, content: str, folder: Path = SVG) -> None:
    folder.mkdir(parents=True, exist_ok=True)
    (folder / name).write_text(content)
    print("wrote", (folder / name).relative_to(ROOT.parent))


def build() -> None:
    cap = exp300.cap / exp300.upm

    # Wordmark alone, for dark and light backgrounds. Clear space = cap height (Logo board).
    size = 64
    m, w = wordmark(0, 0, size, PEARL)
    pad, h = cap * size, cap * size
    for name, fg in (("wordmark-pearl.svg", PEARL), ("wordmark-night.svg", NIGHT)):
        m, w = wordmark(pad, pad + h, size, fg)
        write(name, svg(w + 2 * pad, h + 2 * pad, m, "Smell Bess"))

    # Lockup: wordmark, Amber rule, FINE FRAGRANCE (Logo board, primary tile).
    for name, fg, rule, desc in (
        ("lockup-pearl.svg", PEARL, AMBER, ASH),
        ("lockup-night.svg", NIGHT, NIGHT, INK_SOFT),
    ):
        _, w = wordmark(0, 0, size, fg)
        W = w + 2 * pad
        y_word = pad + h
        y_rule = y_word + 34
        d_size = 13
        y_desc = y_rule + 3 + 26 + exp500.cap / exp500.upm * d_size
        H = y_desc + pad
        m, _ = wordmark(pad, y_word, size, fg)
        body = (
            m
            + f'<rect x="{W / 2 - 40:.2f}" y="{y_rule:.2f}" width="80" height="3" fill="{rule}"/>'
            + f'<path fill="{desc}" d="{exp500.text("FINE FRAGRANCE", W / 2, y_desc, d_size, 0.32, "middle")}"/>'
        )
        write(name, svg(W, H, body, "Smell Bess, fine fragrance"))

    # Monogram S|B (Logo board: profile photo, favicon, atomizer caps).
    def mono(fg: str, face: Face, cx: float = 60, cy: float = 60, size: float = 36) -> str:
        """S | B with 12px either side of a 2px Amber line, at 36px (Logo board), scaled by size."""
        k = size / 36
        gap, bar_h = 13 * k, 40 * k
        base = cy + face.cap / face.upm * size / 2
        return (
            f'<path fill="{fg}" d="{face.text("S", cx - gap, base, size, anchor="end")} {face.text("B", cx + gap, base, size)}"/>'
            f'<rect x="{cx - k:.2f}" y="{cy - bar_h / 2:.2f}" width="{2 * k:.2f}" height="{bar_h:.2f}" fill="{AMBER}"/>'
        )

    write("monogram-pearl.svg", svg(120, 120, mono(PEARL, exp300), "S|B"))
    write("monogram-night.svg", svg(120, 120, mono(NIGHT, exp400), "S|B"))
    # Profile photo: monogram on Night, well inside the circle crop social apps use.
    write("avatar.svg", svg(120, 120, mono(PEARL, exp300, size=26), "Smell Bess", bg=NIGHT))

    # Seal (Seal board): Pearl on dark, Night on light, Amber pouch sticker.
    write("seal-pearl.svg", svg(200, 200, seal(PEARL, AMBER, est=ASH), "Smell Bess seal: only the best, Trinidad and Tobago"))
    write("seal-night.svg", svg(200, 200, seal(NIGHT, NIGHT, light=True), "Smell Bess seal: only the best, Trinidad and Tobago"))
    write("seal-amber.svg", svg(200, 200, seal(NIGHT, NIGHT, fill=AMBER), "Smell Bess seal: only the best, Trinidad and Tobago"))

    # Link preview card, 1200x630. Seal left, lockup right. The lockup sits inside
    # the centred 630px square (x 285-915) that small WhatsApp thumbnails keep.
    W, H = 1200, 630
    seal_size, seal_x = 250, 64
    s = seal_size / 200
    card = [f'<g transform="translate({seal_x} {(H - seal_size) / 2}) scale({s})">{seal(PEARL, AMBER, est=ASH)}</g>']
    x = 360
    ws = 50
    m, w = wordmark(x, 0, ws, PEARL)
    block_h = ws * cap + 28 + 4 + 36 + 40 * 0.72 + 30 + 16 * 0.72
    top = (H - block_h) / 2
    y_word = top + ws * cap
    m, _ = wordmark(x, y_word, ws, PEARL)
    y_rule = y_word + 28
    y_tag = y_rule + 4 + 36 + 40 * 0.72
    y_desc = y_tag + 30 + 16 * 0.72
    card += [
        m,
        f'<rect x="{x}" y="{y_rule:.2f}" width="96" height="4" fill="{AMBER}"/>',
        f'<path fill="{PEARL}" d="{norm400.text("Only the best.", x, y_tag, 40)}"/>',
        f'<path fill="{ASH}" d="{exp500.text("FINE FRAGRANCE · TRINIDAD & TOBAGO", x, y_desc, 16, 0.18)}"/>',
    ]
    write(
        "opengraph-image.svg",
        svg(W, H, "".join(card), "Smell Bess: only the best. Fine fragrance, Trinidad and Tobago", bg=NIGHT),
    )


if __name__ == "__main__":
    build()
