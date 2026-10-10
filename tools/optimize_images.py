#!/usr/bin/env python3
"""Pienentää alkuperäiset kuvat verkkokokoon (assets/img). Aja projektin juuresta:
    python3 tools/optimize_images.py
Alkuperäisiä kansioita ei muokata."""
from PIL import Image, ImageOps
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img"

def save(src, dest, max_side, q=80):
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", quality=q, method=6)
    print(dest.relative_to(ROOT), im.size, dest.stat().st_size // 1024, "kB")

members = {"Alex": "alex", "Ana": "ana", "Erik": "erik", "Jemina": "jemina", "Jon": "jon",
           "Juho": "juho", "Julita": "julita", "Nixu": "nixu", "Totti": "totti"}
for k, v in members.items():
    save(ROOT / "Band members" / f"{k}.jpg", OUT / "members" / f"{v}.webp", 1100)

save(ROOT / "Band members" / "The band.jpg", OUT / "band" / "band.webp", 2000)
save(ROOT / "Band members" / "The band 2.jpg", OUT / "band" / "band-2.webp", 1400)
save(ROOT / "Band members" / "The boys.jpg", OUT / "band" / "boys.webp", 1800)
save(ROOT / "Band members" / "Jon & Alwar.jpg", OUT / "band" / "djs.webp", 1800)

barn = [54, 55, 58, 95, 101, 102, 104, 105, 106, 107, 109, 136, 137, 138, 140, 141]
for n in barn:
    src = ROOT / "Barn bash 2026 photos" / f"Barn&Bash-{n}.jpg"
    save(src, OUT / "gallery" / f"barn-{n}.webp", 1600)
    save(src, OUT / "thumbs" / f"barn-{n}.webp", 640, 74)

wed = {"45": "WhatsApp Image 2026-07-02 at 18.37.45.jpeg", "46": "WhatsApp Image 2026-07-02 at 18.37.46.jpeg",
       "48b": "WhatsApp Image 2026-07-02 at 18.37.48 (2).jpeg"}
for k, f in wed.items():
    src = ROOT / "Wedding lahti" / f
    save(src, OUT / "gallery" / f"wedding-{k}.webp", 1600)
    save(src, OUT / "thumbs" / f"wedding-{k}.webp", 640, 74)
