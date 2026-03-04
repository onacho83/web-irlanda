#!/usr/bin/env node
// Lightweight Node.js server to accept POST /save-config and overwrite config.json
// Usage: DEPLOY_TOKEN=yourtoken node server/save-config.js

import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const TOKEN = process.env.DEPLOY_TOKEN || '';
const CONFIG_PATH = path.resolve(process.cwd(), 'config.json');

function sendJSON(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/save-config') {
    const provided = req.headers['x-deploy-token'] || new URL(req.url, `http://${req.headers.host}`).searchParams.get('token') || '';
    if (!TOKEN) {
      console.error('DEPLOY_TOKEN not set on server; rejecting request');
      return sendJSON(res, 500, { ok: false, error: 'Server not configured' });
    }
    if (provided !== TOKEN) {
      return sendJSON(res, 403, { ok: false, error: 'Invalid token' });
    }

    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        // backup
        try { fs.copyFileSync(CONFIG_PATH, CONFIG_PATH + '.bak.' + Date.now()); } catch (e) { /* ignore */ }
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2), { encoding: 'utf8' });
        return sendJSON(res, 200, { ok: true });
      } catch (err) {
        console.error('Failed to save config:', err);
        return sendJSON(res, 400, { ok: false, error: 'Invalid JSON' });
      }
    });
    return;
  }

  // not found
  sendJSON(res, 404, { ok: false, error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`save-config server listening on port ${PORT}`);
});
