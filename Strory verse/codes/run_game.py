"""
Code Monsoon - Local Server Launcher
Launches a lightweight HTTP server on port 8000 and automatically opens the game in your default browser.
Ideal for offline presentations, college lab reviews, and hackathon demos.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
        
    def end_headers(self):
        # Enable caching-friendly headers and CORS for local testing
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

def main():
    os.chdir(DIRECTORY)
    url = f"http://localhost:{PORT}/index.html"
    print("=" * 60)
    print("CODE MONSOON - STORYVERSE ROUND 2 LOCAL SERVER")
    print("=" * 60)
    print(f"Serving files from: {DIRECTORY}")
    print(f"Game URL:          {url}")
    print("Press Ctrl+C to stop the server.")
    print("=" * 60)

    try:
        # Try to automatically open in default browser
        webbrowser.open(url)
    except Exception as e:
        print(f"Notice: Could not automatically launch browser ({e}).")
        print(f"Please open your browser manually and visit: {url}")

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down Code Monsoon server. Goodbye!")
            httpd.shutdown()

if __name__ == "__main__":
    main()
