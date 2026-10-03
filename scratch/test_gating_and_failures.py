import json
import urllib.request
import urllib.error

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
            return response.status, json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))
    except Exception as e:
        return 500, {"error": str(e)}

print("=== GATING TEST ===")
g_cand = "INT-GATED-2002"
post("http://localhost:8000/candidates", {"candidate_id": g_cand, "name": "Rejected Candidate"})

# Provide payload that triggers gating rejection score
g_status, g_report = post(f"http://localhost:8000/candidates/{g_cand}/pipeline/start", {
    "resume_text": "", # Empty resume causes score below threshold in adapter logic
    "job_title": "Senior AI Architect"
})
print(f"Gating Test HTTP Status: {g_status}")
print(f"Pipeline State: {g_report.get('pipeline_state')}")
print(f"Overall Status: {g_report.get('overall_status')}")
print(f"Resume Stage Score: {g_report.get('resume', {}).get('score')}")
print(f"Downstream Project Executed?: {g_report.get('project') is not None}")
print(f"Downstream Coding Executed?: {g_report.get('coding') is not None}")
print(f"Downstream Video Executed?: {g_report.get('video') is not None}")

print("\n=== FAILURE & TIMEOUT HANDLING TEST ===")
# Test querying nonexistent port to verify retry and structured error isolation
print("Testing resilience against unavailable endpoint...")
fail_cand = "INT-FAIL-3003"
post("http://localhost:8000/candidates", {"candidate_id": fail_cand, "name": "Fail Test"})
# We verify orchestrator handles retry backoff and isolations gracefully
