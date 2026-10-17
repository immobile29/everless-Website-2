#!/usr/bin/env python3
"""Kokoaa julkaisukansion `deploy/` (vain sivuston tiedostot, ei alkuperäisiä kuvia eikä videoita).
Vedä kansio sen jälkeen Netlify Dropiin: https://app.netlify.com/drop"""
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "deploy"
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir()
for page in ("index.html", "galleria.html", "repertuaari.html"):
    shutil.copy2(ROOT / page, OUT / page)
for d in ("css", "js", "data", "assets"):
    shutil.copytree(ROOT / d, OUT / d, ignore=shutil.ignore_patterns(".DS_Store"))
(OUT / "_headers").write_text("/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n")
(OUT / "robots.txt").write_text("User-agent: *\nDisallow: /\n")
size = sum(f.stat().st_size for f in OUT.rglob("*") if f.is_file())
print(f"Valmis: {OUT} ({size/1e6:.1f} Mt)")
