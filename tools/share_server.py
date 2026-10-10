#!/usr/bin/env python3
"""Salasanasuojattu esikatselupalvelin bändikavereille.

Palvelee vain sivuston tiedostot (ei alkuperäisiä kuvia eikä videoita) ja vaatii salasanan.
Käyttö:  python3 tools/share_server.py [portti]
Salasana: ympäristömuuttuja EVERLESS_PASSWORD (oletus everless2026), käyttäjätunnus voi olla mikä tahansa.
"""
import base64, hmac, os, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PASSWORD = os.environ.get("EVERLESS_PASSWORD", "everless2026")
ALLOWED_TOP = {"index.html", "css", "js", "data", "assets"}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def _authorized(self):
        h = self.headers.get("Authorization", "")
        if not h.startswith("Basic "):
            return False
        try:
            _, _, pw = base64.b64decode(h[6:]).decode("utf-8").partition(":")
        except Exception:
            return False
        return hmac.compare_digest(pw.encode(), PASSWORD.encode())

    def _gate(self):
        if not self._authorized():
            self.send_response(401)
            self.send_header("WWW-Authenticate", 'Basic realm="Everless (esikatselu)", charset="UTF-8"')
            self.send_header("Content-Length", "0")
            self.end_headers()
            return False
        top = self.path.split("?")[0].lstrip("/").split("/")[0]
        if top not in ALLOWED_TOP and top != "":
            self.send_error(404)
            return False
        return True

    def do_GET(self):
        if self._gate():
            super().do_GET()

    def do_HEAD(self):
        if self._gate():
            super().do_HEAD()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Robots-Tag", "noindex, nofollow")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8124
    print(f"Palvelin käynnissä portissa {port}")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
