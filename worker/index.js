export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const accept = request.headers.get('accept') || '';

    // Serve static assets if binding exists
    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      // If asset exists (not 404) return it
      if (assetResponse && assetResponse.status !== 404) {
        return assetResponse;
      }
      // SPA fallback: always return index.html for navigation requests
      if (request.method === 'GET' && accept.includes('text/html')) {
        const indexUrl = new URL('/index.html', url);
        return env.ASSETS.fetch(new Request(indexUrl, request));
      }
    }

    // Default JSON 404
    return makeJsonResponse({ error: 'Not found' }, 404);
  }
};

const makeJsonResponse = (data, status = 404, headers = {}) => {
  const baseHeaders = {
    'content-type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  };
  return new Response(JSON.stringify(data), { status, headers: { ...baseHeaders, ...headers } });
};
