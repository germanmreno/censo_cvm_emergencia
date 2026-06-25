import { createServer as createHttpServer } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { readFile, stat } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = resolve(__dirname, 'dist');
const PORT = Number(process.env.PORT) || 3013;
const HOST = process.env.HOST || '0.0.0.0';

const certPath = process.env.HTTPS_CERT;
const keyPath = process.env.HTTPS_KEY;
const useHttps = certPath && keyPath && existsSync(certPath) && existsSync(keyPath);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function safeJoin(root, requested) {
  const cleaned = normalize(decodeURIComponent(requested)).replace(/^[/\\]+/, '');
  const target = resolve(join(root, cleaned));
  if (target !== root && !target.startsWith(root + sep)) return null;
  return target;
}

async function resolveFile(pathname) {
  let filePath = safeJoin(DIST_DIR, pathname);
  if (!filePath) return null;

  try {
    const st = await stat(filePath);
    if (st.isDirectory()) filePath = join(filePath, 'index.html');
  } catch {
    if (pathname.startsWith('/api/') || pathname.includes('.')) return null;
    filePath = join(DIST_DIR, 'index.html');
  }
  return filePath;
}

const requestHandler = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end('Method Not Allowed');
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const filePath = await resolveFile(url.pathname);
  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }

  try {
    const data = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': filePath.endsWith('index.html')
        ? 'no-cache'
        : 'public, max-age=31536000, immutable',
    });
    res.end(req.method === 'HEAD' ? null : data);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
};

let server;
if (useHttps) {
  server = createHttpsServer(
    { cert: readFileSync(certPath), key: readFileSync(keyPath) },
    requestHandler,
  );
  console.log(`[censo-web] HTTPS habilitado con ${certPath}`);
} else {
  server = createHttpServer(requestHandler);
}

server.listen(PORT, HOST, () => {
  const proto = useHttps ? 'https' : 'http';
  console.log(`[censo-web] Sirviendo ${DIST_DIR} en ${proto}://${HOST}:${PORT}`);
});

const shutdown = (signal) => {
  console.log(`[censo-web] ${signal} recibido, cerrando...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
