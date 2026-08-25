#!/usr/bin/env python3
"""Preview-server voor rumo-website.

Waarom niet gewoon `python3 -m http.server`: die stuurt geen cache-instructies
mee, waardoor je browser een oud CSS- of JS-bestand kan blijven hergebruiken.
Dat kost je een half uur zoeken naar een opmaakfout die allang gerepareerd is.
Deze variant zegt bij elk bestand "niet bewaren", dus wat je ziet is altijd wat
er op schijf staat.

Starten:  python3 preview.py     (dan http://localhost:4321)
Stoppen:  Ctrl-C
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class NoCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def send_header(self, key, value):
        # De ingebouwde Last-Modified laat browsers alsnog een 304 vragen en
        # hun eigen kopie tonen. Voor een preview willen we dat niet.
        if key.lower() == 'last-modified':
            return
        super().send_header(key, value)

if __name__ == '__main__':
    print('Preview op http://localhost:4321  (Ctrl-C om te stoppen)')
    ThreadingHTTPServer(('127.0.0.1', 4321), NoCache).serve_forever()
