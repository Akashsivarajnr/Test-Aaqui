import urllib.request
import urllib.error

frontend_ports = [
    ("Project A Video Interviewer Frontend", 5011),
    ("Project B Resume Screener UI", 5020),
    ("Project C Project Analyser Frontend", 5032),
    ("Project D Coding Admin UI", 5041),
    ("Project D Coding Candidate UI", 5042),
    ("Thozhil Admin Shell UI", 3000),
    ("Thozhil Gateway", 8080)
]

print("=== FRONTEND DEV SERVER & UI PORT AUDIT ===")
for name, port in frontend_ports:
    url = f"http://localhost:{port}/"
    try:
        with urllib.request.urlopen(url, timeout=3) as res:
            print(f"[{name}] (Port {port}): HTTP {res.status} -> OK")
    except urllib.error.HTTPError as e:
        print(f"[{name}] (Port {port}): HTTP {e.code}")
    except Exception as e:
        print(f"[{name}] (Port {port}): ERROR ({e})")
