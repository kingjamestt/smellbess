# Smell Bess logo files

Master logo files, drawn from the brand pack (`business-plan.md` §5a,
[brand pack canvas](https://claude.ai/artifact/UofYt4NYKqVGszxNcpQXcw)).
All lettering is outlined, so the SVGs look right anywhere, with no font installed.

| File | Use it for |
|---|---|
| `lockup-pearl` | Main logo with "FINE FRAGRANCE", on dark backgrounds |
| `lockup-night` | Main logo with "FINE FRAGRANCE", on light backgrounds |
| `wordmark-pearl` / `wordmark-night` | SMELL BESS on its own, dark / light backgrounds |
| `monogram-pearl` / `monogram-night` | S\|B: favicon, atomizer caps, small spaces |
| `avatar` | Profile photo for Instagram, TikTok, Facebook and WhatsApp (1080×1080) |
| `seal-pearl` | Seal on dark (with EST. 2026) |
| `seal-night` | Seal on light: cards and labels |
| `seal-amber` | Amber pouch sticker |

`svg/` has the vectors (use these for print and stickers). `png/` has transparent
PNGs, except `avatar`, which has its Night background.

The site's link preview card, `web/src/app/opengraph-image.png`, is built here too.

## Rules (brand pack, Logo and Seal boards)
- Archivo Expanded Light, uppercase, tracked 0.22em. Never bold, condense or tighten it, and no foil, gradients or bottle icon.
- Clear space is the cap height on every side. Smallest wordmark: 120px wide on screen, 30mm in print.
- Below 24mm, use the monogram instead of the seal (the ring text stops being readable).

## Rebuild
```
pip install fonttools
python brand/build.py     # SVGs (downloads Archivo from Google Fonts into brand/.fonts)
node brand/render.mjs     # PNGs and the link preview card (uses sharp from web/)
```
Archivo is licensed under the SIL Open Font License 1.1.
