import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local testing
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Check if port is busy, increment if needed
    current_port = PORT
    max_tries = 10
    httpd = None
    
    for i in range(max_tries):
        try:
            httpd = socketserver.TCPServer(("", current_port), Handler)
            break
        except OSError:
            current_port += 1
            
    if not httpd:
        print(f"Error: Tidak dapat menemukan port yang tersedia di sekitar {PORT}.")
        sys.exit(1)

    url = f"http://localhost:{current_port}/index.html"
    print("=" * 65)
    print("🚀 DASHBOARD MONITORING & ANALISIS SURVEI LAN RI 2026")
    print("=" * 65)
    print(f"Server berjalan di: {url}")
    print("Membuka browser otomatis...")
    print("Tekan Ctrl + C di terminal untuk menghentikan server.")
    print("=" * 65)
    
    try:
        webbrowser.open(url)
    except Exception:
        pass
        
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer dihentikan. Sampai jumpa!")
        httpd.server_close()

if __name__ == '__main__':
    main()
