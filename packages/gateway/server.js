import http from 'http';
import url from 'url';

const PORT = process.env.PORT || 8080;

const TARGETS = {
  ADMIN_SHELL: process.env.ADMIN_SHELL_URL || 'http://localhost:3000',
  PROJECT_A_API: process.env.PROJECT_A_API_URL || 'http://localhost:5010',
  PROJECT_A_UI: process.env.PROJECT_A_UI_URL || 'http://localhost:5011',
  PROJECT_B_APP: process.env.PROJECT_B_APP_URL || 'http://localhost:5020',
  PROJECT_C_API: process.env.PROJECT_C_API_URL || 'http://localhost:5030',
  PROJECT_C_UI: process.env.PROJECT_C_UI_URL || 'http://localhost:5032',
  PROJECT_D_API: process.env.PROJECT_D_API_URL || 'http://localhost:5040',
  PROJECT_D_UI: process.env.PROJECT_D_UI_URL || 'http://localhost:5041',
  PROJECT_D_CANDIDATE_UI: process.env.PROJECT_D_CANDIDATE_UI_URL || 'http://localhost:5042',
};

// Canonical In-Memory Intern Data Storage
const INTERN_DECISIONS = new Map();
const CANONICAL_INTERNS = [
  {
    internId: 'INT-901',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    role: 'Full Stack Engineer Intern',
    scores: {
      resumeMatch: 94,
      interviewEvaluation: 88,
      projectAnalysis: 'Verified (Low Risk)',
      codingTestCasesPassed: '8/8 Passed'
    },
    decision: 'APPROVE',
    notes: 'Strong candidate across all technical and communication benchmarks.'
  },
  {
    internId: 'INT-902',
    name: 'Arjun Patel',
    email: 'arjun.patel@example.com',
    role: 'Backend Systems Intern',
    scores: {
      resumeMatch: 89,
      interviewEvaluation: 84,
      projectAnalysis: 'Verified (Low Risk)',
      codingTestCasesPassed: '7/8 Passed'
    },
    decision: 'PENDING_REVIEW',
    notes: 'Good technical background; pending final manager signoff.'
  },
  {
    internId: 'INT-903',
    name: 'Rohan Das',
    email: 'rohan.das@example.com',
    role: 'AI / ML Engineer Intern',
    scores: {
      resumeMatch: 96,
      interviewEvaluation: 92,
      projectAnalysis: 'Verified (Zero Risk)',
      codingTestCasesPassed: '8/8 Passed'
    },
    decision: 'APPROVE',
    notes: 'Exceptional performance in coding workspace and system architecture review.'
  }
];

// Helper to resolve upstream URL target based on request path and referer
function getUpstreamTarget(reqUrl, req) {
  const referer = req ? (req.headers.referer || '') : '';

  if (reqUrl.startsWith('/api/auth')) return 'AUTH_INTERNAL';
  if (reqUrl.startsWith('/api/interns')) return 'INTERNS_INTERNAL';

  // Project B: Resume Screener API
  if (reqUrl.startsWith('/api/resumes') || reqUrl.startsWith('/api/jobs')) return TARGETS.PROJECT_B_APP;

  // Candidate API disambiguation between Project B and Project A
  if (reqUrl.startsWith('/api/candidates')) {
    if (reqUrl.includes('/status') || reqUrl.includes('/resume') || reqUrl.includes('/retry') || referer.includes('/resume')) {
      return TARGETS.PROJECT_B_APP;
    }
    return TARGETS.PROJECT_A_API;
  }

  // Project A: Video Interviewer API
  if (reqUrl.startsWith('/api/interviews') || reqUrl.startsWith('/api/voice')) return TARGETS.PROJECT_A_API;

  // Project C: Project Analyzer API
  if (reqUrl.startsWith('/api/logs') || reqUrl.startsWith('/api/work-descriptions') || reqUrl.startsWith('/api/review') || reqUrl.startsWith('/review') || reqUrl.startsWith('/preview')) return TARGETS.PROJECT_C_API;

  // Project D: Coding Interviewer API & Socket.IO
  if (reqUrl.startsWith('/api/exams') || reqUrl.startsWith('/api/questions') || reqUrl.startsWith('/api/submissions') || reqUrl.startsWith('/api/v1/sandbox') || reqUrl.startsWith('/socket.io')) return TARGETS.PROJECT_D_API;

  // Explicit UI page subpaths
  if (reqUrl.startsWith('/coding-candidate')) return TARGETS.PROJECT_D_CANDIDATE_UI;
  if (reqUrl.startsWith('/interview')) return TARGETS.PROJECT_A_UI;
  if (reqUrl.startsWith('/resume')) return TARGETS.PROJECT_B_APP;
  if (reqUrl.startsWith('/project-analysis')) return TARGETS.PROJECT_C_UI;
  if (reqUrl.startsWith('/coding')) return TARGETS.PROJECT_D_UI;

  // Referer-based static asset routing
  if (referer.includes('/coding-candidate')) return TARGETS.PROJECT_D_CANDIDATE_UI;
  if (referer.includes('/interview')) return TARGETS.PROJECT_A_UI;
  if (referer.includes('/resume')) return TARGETS.PROJECT_B_APP;
  if (referer.includes('/project-analysis')) return TARGETS.PROJECT_C_UI;
  if (referer.includes('/coding')) return TARGETS.PROJECT_D_UI;

  // Default: Project C Orchestrator Frontend (Port 5032)
  return TARGETS.PROJECT_C_UI;
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url || '/', true);
  const pathName = parsedUrl.pathname || '/';

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-role, x-user-id, authorityId');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. Auth Bridge API
  if (pathName === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body || '{}');
        if ((username === 'admin@thozhil.com' || username === 'admin') && (password === 'admin123' || password === 'admin')) {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': 'thozhil_admin_token=admin-token-session-valid; Path=/; HttpOnly'
          });
          res.end(JSON.stringify({
            success: true,
            token: 'admin-token-session-valid',
            user: { id: 'admin-001', role: 'ADMIN', name: 'System Administrator', email: 'admin@thozhil.com' }
          }));
          return;
        }
      } catch (e) {}
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Invalid Admin Credentials' }));
    });
    return;
  }

  if (pathName === '/api/auth/session') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      authenticated: true,
      user: { id: 'admin-001', role: 'ADMIN', name: 'System Administrator', email: 'admin@thozhil.com' }
    }));
    return;
  }

  // 2. Unified Intern Identity API
  if (pathName === '/api/interns' && req.method === 'GET') {
    const data = CANONICAL_INTERNS.map(intern => ({
      ...intern,
      decision: INTERN_DECISIONS.get(intern.internId)?.decision || intern.decision,
      notes: INTERN_DECISIONS.get(intern.internId)?.notes || intern.notes,
    }));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: data.length, data }));
    return;
  }

  if (pathName.startsWith('/api/interns/')) {
    const parts = pathName.split('/');
    const internId = parts[3];

    if (parts.length === 5 && parts[4] === 'decision' && req.method === 'PATCH') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { decision, notes } = JSON.parse(body || '{}');
          const intern = CANONICAL_INTERNS.find(i => i.internId === internId);
          if (intern) {
            const updated = { decision: decision || intern.decision, notes: notes !== undefined ? notes : intern.notes, updatedAt: new Date().toISOString() };
            INTERN_DECISIONS.set(internId, updated);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: { internId, ...updated } }));
            return;
          }
        } catch (e) {}
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Bad Request' }));
      });
      return;
    }

    if (req.method === 'GET') {
      const intern = CANONICAL_INTERNS.find(i => i.internId === internId || i.email === internId);
      if (intern) {
        const stored = INTERN_DECISIONS.get(intern.internId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          data: {
            ...intern,
            decision: stored?.decision || intern.decision,
            notes: stored?.notes || intern.notes,
          }
        }));
        return;
      }
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Intern Record Not Found' }));
      return;
    }
  }

  // 3. Upstream Forwarding Proxy
  const targetUrl = getUpstreamTarget(req.url || '/', req);
  const targetParsed = url.parse(targetUrl);

  const proxyReqOptions = {
    hostname: targetParsed.hostname || 'localhost',
    port: targetParsed.port ? parseInt(targetParsed.port, 10) : 80,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `${targetParsed.hostname}:${targetParsed.port}`,
      'x-user-role': 'recruiter',
      'x-user-id': 'admin-001',
      authorityId: 'manager-001'
    }
  };

  const proxyReq = http.request(proxyReqOptions, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: 'Bad Gateway',
      message: `Could not connect to target service at ${targetUrl}`,
      path: req.url
    }));
  });

  req.pipe(proxyReq, { end: true });
});

// WebSocket Proxy Handling
server.on('upgrade', (req, socket, head) => {
  let targetUrl = TARGETS.PROJECT_A_API;

  if (req.url.startsWith('/socket.io')) {
    targetUrl = TARGETS.PROJECT_D_API;
  } else if (req.url.startsWith('/ws')) {
    targetUrl = TARGETS.PROJECT_A_API;
  } else {
    const referer = req.headers.referer || '';
    if (referer.includes('/project-analysis')) targetUrl = TARGETS.PROJECT_C_UI;
    else if (referer.includes('/coding')) targetUrl = TARGETS.PROJECT_D_UI;
    else if (referer.includes('/interview')) targetUrl = TARGETS.PROJECT_A_UI;
    else targetUrl = TARGETS.PROJECT_C_UI;
  }

  const targetParsed = url.parse(targetUrl);
  const proxyReq = http.request({
    hostname: targetParsed.hostname || 'localhost',
    port: targetParsed.port ? parseInt(targetParsed.port, 10) : 80,
    path: req.url,
    method: req.method,
    headers: req.headers
  });

  proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
    socket.write(`HTTP/${proxyRes.httpVersion} ${proxyRes.statusCode} ${proxyRes.statusMessage}\r\n`);
    for (let key in proxyRes.headers) {
      socket.write(`${key}: ${proxyRes.headers[key]}\r\n`);
    }
    socket.write('\r\n');

    if (proxyHead && proxyHead.length > 0) socket.write(proxyHead);
    if (head && head.length > 0) proxySocket.write(head);

    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });

  proxyReq.on('error', () => {
    socket.end();
  });

  proxyReq.end();
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` THOZHIL NATIVE GATEWAY RUNNING ON PORT ${PORT}`);
  console.log(` Single Browser Origin: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
