const makeJsonResponse = (data, status = 200, headers = {}) => {
  const baseHeaders = {
    'content-type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  };
  return new Response(JSON.stringify(data), { status, headers: { ...baseHeaders, ...headers } });
};

const inMemoryStore = new Map();
const generateToken = () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < 10; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
};

async function saveRecord(env, token, record) {
  if (env?.QUOTE_KV) {
    await env.QUOTE_KV.put(token, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 * 30 }); // 30 days
    return;
  }
  inMemoryStore.set(token, record);
}

async function loadRecord(env, token) {
  if (env?.QUOTE_KV) {
    const raw = await env.QUOTE_KV.get(token);
    return raw ? JSON.parse(raw) : null;
  }
  return inMemoryStore.get(token) || null;
}

async function handlePost(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch (err) {
    return makeJsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const items = Array.isArray(payload?.items) ? payload.items : [];
  if (!items.length) {
    return makeJsonResponse({ error: 'items is required and must be an array' }, 400);
  }
  const contact = payload?.contact || {};
  const record = {
    items,
    contact,
    createdAt: new Date().toISOString()
  };
  const token = generateToken();
  await saveRecord(env, token, record);
  return makeJsonResponse({ token, url: `/bao-gia-chia-se?token=${token}` });
}

async function handleGet(url, env) {
  const token = url.pathname.split('/').pop();
  if (!token) return makeJsonResponse({ error: 'token required' }, 400);
  const record = await loadRecord(env, token);
  if (!record) return makeJsonResponse({ error: 'Not found' }, 404);
  return makeJsonResponse(record);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') {
      return makeJsonResponse({}, 204);
    }

    if (url.pathname === '/share' && request.method === 'POST') {
      return handlePost(request, env);
    }

    if (url.pathname.startsWith('/share/') && request.method === 'GET') {
      return handleGet(url, env);
    }

    // Asset / SPA fallback
    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      // Serve asset if found
      if (assetResponse && assetResponse.status !== 404) {
        return assetResponse;
      }
      // SPA fallback: return index.html for navigation requests
      const accept = request.headers.get('accept') || '';
      if (request.method === 'GET' && accept.includes('text/html')) {
        const indexUrl = new URL('/index.html', url);
        return env.ASSETS.fetch(new Request(indexUrl, request));
      }
    }

    return makeJsonResponse({ error: 'Not found' }, 404);
  }
};
