import json
import urllib.request
import urllib.error
import sqlite3

def post(url, payload):
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.status, json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))
    except Exception as e:
        return 500, {"error": str(e)}

def get(url):
    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            content = response.read().decode('utf-8')
            try:
                return response.status, json.loads(content)
            except Exception:
                return response.status, content
    except urllib.error.HTTPError as e:
        content = e.read().decode('utf-8')
        try:
            return e.code, json.loads(content)
        except Exception:
            return e.code, content
    except Exception as e:
        return 500, {"error": str(e)}

print("=== 1. HEALTH VERIFICATION ===")
for service, port in [("Orchestrator", 8000), ("Resume Adapter", 8001), ("Project Adapter", 8002), ("Coding Adapter", 8003), ("Video Adapter", 8004)]:
    status, body = get(f"http://localhost:{port}/health")
    print(f"[{service} : {port}] Health: HTTP {status} -> {body}")

print("\n=== 2. REAL CANDIDATE PIPELINE TEST ===")
cand_id = "INT-E2E-1001"
create_status, create_res = post("http://localhost:8000/candidates", {
    "candidate_id": cand_id,
    "name": "Jane Doe",
    "email": "jane.doe@example.com"
})
print(f"Create Candidate: HTTP {create_status} -> {create_res}")

pipeline_payload = {
    "resume_text": "Senior Full Stack Engineer with 6 years experience in React, Python, Node.js, PostgreSQL",
    "job_title": "Software Engineer",
    "project_id": "proj-thozhil-demo",
    "work_description": "Architected microservices gateway with score gating and retry backoff",
    "exam_id": "exam-thozhil-demo",
    "interview_id": "interview-thozhil-demo"
}

start_status, report = post(f"http://localhost:8000/candidates/{cand_id}/pipeline/start", pipeline_payload)
print(f"\nPipeline Start Result: HTTP {start_status}")
print(json.dumps(report, indent=2))

print("\n=== 3. GET CANDIDATE REPORT VERIFICATION ===")
rep_status, rep_data = get(f"http://localhost:8000/candidates/{cand_id}/report")
print(f"Fetch Report: HTTP {rep_status} -> Pipeline State: {rep_data.get('pipeline_state')}, Overall Status: {rep_data.get('overall_status')}")

print("\n=== 4. SQLITE DATABASE PERSISTENCE VERIFICATION ===")
conn = sqlite3.connect("orchestrator.db")
cursor = conn.cursor()
cursor.execute("SELECT candidate_id, state, created_at FROM candidates WHERE candidate_id = ?", (cand_id,))
row = cursor.fetchone()
print(f"Database Record: {row}")

cursor.execute("SELECT stage, status, score FROM stage_results WHERE candidate_id = ?", (cand_id,))
stages = cursor.fetchall()
print(f"Persisted Stage Results: {stages}")
conn.close()

print("\n=== 5. GATEWAY REGRESSION TEST ===")
gw_status, gw_body = get("http://localhost:8080/")
print(f"Gateway Port 8080 Status: HTTP {gw_status} (Length: {len(str(gw_body))} bytes)")
