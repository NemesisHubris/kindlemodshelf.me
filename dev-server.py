#!/usr/bin/env python3
"""Local dev server for public/ that mimics Cloudflare Pages:
/page serves page.html, and /page.html redirects to /page.

Run from anywhere:  python3 dev-server.py   (http://127.0.0.1:8000/)
"""
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        path, _, query = self.path.partition("?")
        suffix = "?" + query if query else ""
        if path.endswith(".html") and path != "/index.html":
            self.send_response(308)
            self.send_header("Location", path[:-5] + suffix)
            self.end_headers()
            return
        if path == "/index.html":
            self.send_response(308)
            self.send_header("Location", "/" + suffix)
            self.end_headers()
            return
        clean = path.rstrip("/")
        if clean and "." not in os.path.basename(clean) and os.path.isfile(os.path.join(ROOT, clean.lstrip("/") + ".html")):
            self.path = clean + ".html" + suffix
        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f"Serving {ROOT} at http://127.0.0.1:{port}/")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
