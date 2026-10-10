#!/usr/bin/env python3
"""Hakee repertuaarin biiseille iTunes-esikuuntelun osoitteet valmiiksi tiedostoon data/previews.js.
Näin sivu ei tarvitse hakua toiston yhteydessä (tärkeää mobiilissa) eikä iTunesin pyyntörajoitus haittaa.
Aja projektin juuresta (vaatii verkon):   python3 tools/fetch_previews.py
Jo löydetyt osoitteet säilytetään; --refresh hakee kaikki uudelleen."""
import json, re, sys, time, unicodedata, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "previews.js"
COUNTRY = "FI"
BAD = re.compile(r"karaoke|tribute|made famous|originally performed|instrumental version|ringtone|lullaby|piano version", re.I)


def norm(s):
    s = unicodedata.normalize("NFD", str(s).lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"[’'`]", "", s)
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def main_title(t):
    t = re.sub(r"\(.*?\)", " ", t)
    t = re.sub(r"\s-\s.*$", "", t)
    return norm(t.replace("...", " "))


def first_artist(a):
    return norm(re.split(r"\s&\s|\sja\s|\sfeat\.?\s|,", a, flags=re.I)[0])


def pick(song, results):
    title, artist = main_title(song["title"]), first_artist(song["artist"])
    wants_live = bool(re.search(r"live|acoustic", song["title"], re.I))
    best, best_score = None, 0
    for i, r in enumerate(results):
        if not r.get("previewUrl"):
            continue
        name = r.get("trackName", "")
        if BAD.search(name) or BAD.search(r.get("collectionName", "")):
            continue
        tn = main_title(name)
        if not (tn == title or (len(title) > 3 and tn.startswith(title)) or (len(tn) > 3 and title.startswith(tn))):
            continue
        ra = norm(r.get("artistName", ""))
        if artist not in ra and ra not in artist:
            continue
        score = 10 - min(i, 9) * 0.1
        if tn == title:
            score += 3
        live = bool(re.search(r"live|unplugged|acoustic", name + " " + r.get("collectionName", ""), re.I))
        if live and not wants_live:
            score -= 2
        if not live and wants_live:
            score -= 1
        if score > best_score:
            best, best_score = r["previewUrl"], score
    return best


def load_songs():
    text = (ROOT / "data" / "songs.js").read_text(encoding="utf-8")
    songs = []
    for m in re.finditer(r"\{\s*artist:\s*\"((?:[^\"\\]|\\.)*)\",\s*title:\s*\"((?:[^\"\\]|\\.)*)\"(?:,\s*q:\s*\"((?:[^\"\\]|\\.)*)\")?", text):
        songs.append({"artist": m.group(1), "title": m.group(2).replace('\\"', '"'), "q": m.group(3)})
    return songs


def load_existing():
    if not OUT.exists():
        return {}
    m = re.search(r"=\s*(\{.*\});?\s*$", OUT.read_text(encoding="utf-8"), re.S)
    return json.loads(m.group(1)) if m else {}


def main():
    refresh = "--refresh" in sys.argv
    previews = {} if refresh else load_existing()
    songs = load_songs()
    missing = []
    for n, s in enumerate(songs, 1):
        key = f"{s['artist']}|{s['title']}"
        if key in previews:
            continue
        q = s["q"] or (s["artist"] + " " + re.sub(r"\(.*?\)", "", s["title"]))
        url = "https://itunes.apple.com/search?" + urllib.parse.urlencode(
            {"media": "music", "entity": "song", "limit": 15, "country": COUNTRY, "term": q})
        try:
            data = json.load(urllib.request.urlopen(url, timeout=15))
            u = pick(s, data.get("results", []))
        except Exception as e:  # verkko- tai rajoitusvirhe: yritetään myöhemmin uudelleen
            print(f"[{n}/{len(songs)}] VIRHE {key}: {e}")
            time.sleep(10)
            missing.append(key)
            continue
        if u:
            previews[key] = u
            print(f"[{n}/{len(songs)}] ok   {key}")
        else:
            print(f"[{n}/{len(songs)}] EI LÖYTYNYT {key}")
            missing.append(key)
        time.sleep(3.2)  # iTunes sallii noin 20 hakua minuutissa
    body = json.dumps(previews, ensure_ascii=False, indent=2)
    OUT.write_text("/* Luotu komennolla: python3 tools/fetch_previews.py */\nwindow.EVERLESS_PREVIEWS = " + body + ";\n", encoding="utf-8")
    print(f"\nValmis: {len(previews)}/{len(songs)} osoitetta. Puuttuu: {missing or 'ei mitään'}")


if __name__ == "__main__":
    main()
