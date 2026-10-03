import os
import json
import urllib.request
import urllib.parse
import time

JOB_TITLE = "Software Engineer"
BASE_URL = "http://localhost:5020"

# 1. Ensure job exists
req_job = urllib.request.Request(f"{BASE_URL}/api/jobs", data=json.dumps({"title": JOB_TITLE, "description": "Looking for Python, React, Node.js, REST API developer"}).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req_job) as resp:
        print(f"Ensure Job: HTTP {resp.status}")
except Exception as e:
    print(f"Ensure Job Info: {e}")

# 2. Upload real PDF file using multipart/form-data
pdf_path = "scratch/resumes/john_doe_resume.pdf"
boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
with open(pdf_path, 'rb') as f:
    pdf_bytes = f.read()

body = (
    f'--{boundary}\r\n'
    f'Content-Disposition: form-data; name="files"; filename="john_doe_resume.pdf"\r\n'
    f'Content-Type: application/pdf\r\n\r\n'
).encode('utf-8') + pdf_bytes + f'\r\n--{boundary}--\r\n'.encode('utf-8')

upload_url = f"{BASE_URL}/api/jobs/{urllib.parse.quote(JOB_TITLE)}/upload"
req_upload = urllib.request.Request(upload_url, data=body, headers={'Content-Type': f'multipart/form-data; boundary={boundary}'})

try:
    with urllib.request.urlopen(req_upload) as resp:
        upload_data = json.loads(resp.read().decode('utf-8'))
        print(f"Upload Resume: HTTP {resp.status} -> {upload_data}")
except Exception as e:
    print(f"Upload Resume Error: {e}")

# 3. Trigger screening
screen_url = f"{BASE_URL}/api/jobs/{urllib.parse.quote(JOB_TITLE)}/screen"
req_screen = urllib.request.Request(screen_url, data=b'{}', headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req_screen) as resp:
        screen_data = json.loads(resp.read().decode('utf-8'))
        print(f"Trigger Screening: HTTP {resp.status} -> {screen_data}")
except Exception as e:
    print(f"Trigger Screening Error: {e}")

# 4. Wait 2 seconds for background task to complete, then query candidates
time.sleep(2)
cand_url = f"{BASE_URL}/api/jobs/{urllib.parse.quote(JOB_TITLE)}/candidates"
try:
    with urllib.request.urlopen(cand_url) as resp:
        candidates = json.loads(resp.read().decode('utf-8'))
        print(f"Candidates List: HTTP {resp.status} -> Count: {len(candidates)}")
        for c in candidates:
            print(f"  Candidate {c.get('id')} ({c.get('name')}): Match Score = {c.get('match')}% (Status: {c.get('screening_status')})")
except Exception as e:
    print(f"Get Candidates Error: {e}")
