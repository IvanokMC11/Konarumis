import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

async function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

async function createPreference(request, env) {
  try {
    const { items } = await request.json();
    if (!items?.length) return json({ error: 'Carrito vacío' }, 400);

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + env.MERCADO_PAGO_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        items: items.map(i => ({
          title: i.title,
          unit_price: Number(i.unit_price),
          quantity: Number(i.quantity),
          currency_id: 'PEN',
        })),
        back_urls: {
          success: env.SITE_URL + '/?status=success',
          failure: env.SITE_URL + '/?status=failure',
          pending: env.SITE_URL + '/?status=pending',
        },
        auto_return: 'approved',
        notification_url: env.SITE_URL + '/api/webhook',
      }),
    });

    const data = await res.json();
    if (!res.ok) return json({ error: 'MP error' }, 500);
    return json({ preferenceId: data.id });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

async function webhook(request, env) {
  try {
    const body = await request.clone().json();
    if (body.type === 'payment') {
      const res = await fetch('https://api.mercadopago.com/v1/payments/' + body.data.id, {
        headers: { Authorization: 'Bearer ' + env.MERCADO_PAGO_ACCESS_TOKEN },
      });
      const p = await res.json();
      if (p.status === 'approved') console.log('Pago OK:', p.id);
    }
  } catch (_) {}
  return new Response(null, { status: 200 });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
    }
    if (url.pathname === '/api/create-preference') return createPreference(request, env);
    if (url.pathname === '/api/webhook') return webhook(request, env);
    try {
      return await getAssetFromKV({ request, waitUntil: ctx.waitUntil.bind(ctx) });
    } catch {
      return new Response('Not Found', { status: 404 });
    }
  },
};
