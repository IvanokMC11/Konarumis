async function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

async function createPreference(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (_) {
    return json({ error: 'El cuerpo de la solicitud no es JSON válido' }, 400);
  }

  const items = body?.items;
  if (!items?.length) return json({ error: 'Carrito vacío' }, 400);

  if (!env.MERCADO_PAGO_ACCESS_TOKEN) {
    return json({ error: 'Token de Mercado Pago no configurado' }, 500);
  }

  try {
    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + env.MERCADO_PAGO_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        items: items.map(i => ({
          title: String(i.title || 'Producto'),
          unit_price: Number(i.unit_price) || 0,
          quantity: Number(i.quantity) || 1,
          currency_id: 'PEN',
        })),
        back_urls: {
          success: (env.SITE_URL || 'https://konarumis.ivanokmc11.workers.dev') + '/?status=success',
          failure: (env.SITE_URL || 'https://konarumis.ivanokmc11.workers.dev') + '/?status=failure',
          pending: (env.SITE_URL || 'https://konarumis.ivanokmc11.workers.dev') + '/?status=pending',
        },
        auto_return: 'approved',
        notification_url: (env.SITE_URL || 'https://konarumis.ivanokmc11.workers.dev') + '/api/webhook',
      }),
    });

    let data;
    try {
      data = await res.json();
    } catch (_) {
      const text = await res.text().catch(() => '');
      return json({ error: 'Mercado Pago respondió con código ' + res.status + ': ' + (text || 'sin cuerpo') }, 500);
    }

    if (!res.ok) return json({ error: 'Error en Mercado Pago: ' + (data.message || JSON.stringify(data)) }, 500);
    return json({ preferenceId: data.id });
  } catch (e) {
    return json({ error: 'Error al conectar con Mercado Pago: ' + e.message }, 500);
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
      return new Response(null, {
        headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
      });
    }

    if (url.pathname === '/api/create-preference' && request.method === 'POST') {
      return createPreference(request, env);
    }
    if (url.pathname === '/api/webhook' && request.method === 'POST') {
      return webhook(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
