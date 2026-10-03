import urllib.request
import urllib.error

ports = [8000, 8001, 8002, 8003, 8004, 5010, 5020, 5030, 5031, 5040]

for port in ports:
    url = f"http://localhost:{port}/health" if port in [8000, 8001, 8002, 8003, 8004] else f"http://localhost:{port}/"
    try:
        req = urllib.request.urlopen(url, timeout=3)
        print(f"Port {port} ({url}): HTTP {req.status}")
    except urllib.error.HTTPError as e:
        print(f"Port {port} ({url}): HTTP {e.code}")
    except Exception as e:
        print(f"Port {port} ({url}): Error ({e})")
