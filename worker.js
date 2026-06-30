function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key' },
  });
}

function html(body, status = 200) {
  return new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function genId() {
  return Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
}

const STATUSES = ['pending', 'started', 'halfway', 'finished', 'ready'];
const STATUS_LABELS = { pending: 'Pago procesado', started: 'Pedido iniciado', halfway: 'Pedido a la mitad', finished: 'Pedido terminado', ready: 'Listo para entrega' };

function isAdmin(req, env) {
  const key = req.headers.get('X-Admin-Key') || '';
  return key === (env.ADMIN_PASSWORD || '');
}

// ─── Admin Panel HTML ───
function adminHtml() {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin - Konarumis</title><style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Hanken Grotesk',system-ui,-apple-system,sans-serif;background:#f5f2ef;color:#2c2c2c;padding:24px;max-width:1100px;margin:0 auto}.admin-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #e0dbd7}h1{font-size:1.5rem;color:#6b4f3c;font-weight:700}.logout{color:#c44;text-decoration:none;font-size:0.85rem;padding:8px 16px;border:1px solid #e0dbd7;border-radius:8px}.login-box{max-width:340px;margin:100px auto;text-align:center;background:#fff;padding:40px 32px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}.login-box h1{font-size:1.3rem;margin-bottom:20px;color:#6b4f3c}.login-box input{width:100%;padding:12px;border:2px solid #e0dbd7;border-radius:8px;font-size:1rem;margin-bottom:12px;transition:border .2s}.login-box input:focus{border-color:#76946b;outline:none}.login-box button{width:100%;padding:12px;background:#76946b;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer;font-weight:600;transition:background .2s}.login-box button:hover{background:#5d7a53}.order-card{background:#fff;border-radius:12px;padding:20px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);border:1px solid #e8e3df}.order-head{display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;flex-wrap:wrap;gap:8px}.order-id{font-size:1rem;font-weight:700;color:#6b4f3c}.order-date{font-size:0.75rem;color:#999}.order-body{display:grid;grid-template-columns:1fr 1fr;gap:16px}@media(max-width:640px){.order-body{grid-template-columns:1fr}}.order-section{font-size:0.85rem}.order-section h3{font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px;color:#999;margin-bottom:6px;font-weight:700}.order-section p,.order-section div{margin-bottom:3px;color:#555}.customer-info{background:#f9f7f5;padding:10px;border-radius:8px;margin-top:8px}.customer-info div{padding:2px 0;font-size:0.8rem;color:#555}.order-items-list div{padding:4px 0;border-bottom:1px solid #f0eeec;font-size:0.8rem;display:flex;justify-content:space-between}.order-items-list div:last-child{border:none}.order-total{text-align:right;font-weight:700;font-size:1rem;color:#6b4f3c;margin-top:8px}.badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:0.7rem;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:0.3px}.badge-pending{background:#d4a373}.badge-started{background:#6b9ac4}.badge-halfway{background:#b088c4}.badge-finished{background:#76946b}.badge-ready{background:#4a7c59}.status-select{padding:6px 10px;border:2px solid #e0dbd7;border-radius:8px;font-size:0.8rem;background:#fff;cursor:pointer;font-family:inherit;margin-top:8px}.status-select:focus{border-color:#76946b;outline:none}.empty{text-align:center;color:#999;padding:64px 24px;font-size:0.9rem}.empty-icon{font-size:2rem;margin-bottom:12px;opacity:0.4}
</style></head><body>
<div class="admin-header"><h1>Pedidos</h1><a href="#" class="logout" onclick="sessionStorage.removeItem(KEY);render();return false">Cerrar sesion</a></div>
<div id="app"></div>
<script>
const KEY='__admin_k';let pwd='';
function getKey(){let k=sessionStorage.getItem(KEY);if(k){pwd=k;return pwd}return''}
async function api(url,opts={}){const key=getKey();if(key)opts.headers={...opts.headers,'X-Admin-Key':key};const r=await fetch(url,opts);if(r.status===401){sessionStorage.removeItem(KEY);render()}return r}
async function login(){pwd=document.getElementById('pwd').value;const r=await api('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pwd})});if(r.ok){sessionStorage.setItem(KEY,pwd);render()}else{alert('Contrasena incorrecta')}}
async function updateStatus(id,status){await api('/api/order/'+id+'/status',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});render()}
async function render(){const key=getKey();if(!key){document.getElementById('app').innerHTML='<div class="login-box"><h1>Admin Konarumis</h1><input id="pwd" type="password" placeholder="Contrasena" onkeydown="if(event.key==='Enter')login()"><button onclick="login()">Ingresar</button></div>';return}
const r=await api('/api/orders');if(!r.ok)return;const orders=await r.json();const L={${Object.entries(STATUS_LABELS).map(([k,v]) => `${k}:'${v}'`).join(',')}};const N=['${STATUSES.join("','")}'];
const fmt=d=>{const dt=new Date(d);return dt.toLocaleDateString('es-PE',{day:'2-digit',month:'short',year:'numeric'})+' '+dt.toLocaleTimeString('es-PE',{hour:'2-digit',minute:'2-digit'})};
document.getElementById('app').innerHTML=orders.length?orders.map(o=>{
const c=o.customer||{};const items=o.items||[];
return'<div class="order-card"><div class="order-head"><div><div class="order-id">#'+o.id+'</div><div class="order-date">'+fmt(o.createdAt)+'</div></div><div><span class="badge badge-'+o.status+'">'+(L[o.status]||o.status)+'</span></div></div><div class="order-body"><div class="order-section"><h3>Productos</h3><div class="order-items-list">'+items.map(i=>'<div><span>'+i.title+' x'+i.qty+'</span><span>S/. '+(i.unit_price*i.qty).toFixed(2)+'</span></div>').join('')+'</div><div class="order-total">Total: S/. '+o.total.toFixed(2)+'</div></div><div class="order-section"><h3>Cliente</h3><div class="customer-info"><div><strong>Nombre:</strong> '+(c.name||'-')+'</div><div><strong>WhatsApp:</strong> '+(c.phone||'-')+'</div><div><strong>Direccion:</strong> '+(c.address||'-')+'</div></div><div style="margin-top:12px"><h3>Estado</h3><select class="status-select" onchange="updateStatus(\''+o.id+'\',this.value)">'+N.map(s=>'<option value="'+s+'"'+(s===o.status?' selected':'')+'>'+L[s]+'</option>').join('')+'</select></div></div></div></div>'
}).join(''):'<div class="empty"><div class="empty-icon">&#128230;</div><p>No hay pedidos confirmados aun</p><p style="font-size:0.8rem;margin-top:8px;color:#ccc">Los pedidos aparecen aqui despues de un pago exitoso</p></div>'}
render();
</script></body></html>`;
}

// ─── Tracking Page HTML ───
function trackingHtml(id, order) {
  const s = order.status || 'pending';
  const idx = STATUSES.indexOf(s);
  let steps = '';
  STATUSES.forEach((st, i) => {
    const done = i <= idx;
    const current = i === idx;
    steps += `<div class="step ${done ? 'done' : ''} ${current ? 'current' : ''}">
      <div class="step-dot"></div>
      <div class="step-label">${STATUS_LABELS[st]}</div>
    </div>`;
    if (i < STATUSES.length - 1) {
      steps += `<div class="step-line ${done ? 'done' : ''}"></div>`;
    }
  });

  const itemsList = order.items.map(i => `<div class="track-item"><span>${i.title} x${i.qty}</span><span>S/. ${(i.unit_price * i.qty).toFixed(2)}</span></div>`).join('');

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Seguimiento - Konarumis</title><style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;background:#f5f2ef;color:#2c2c2c;padding:24px;max-width:600px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center}
.card{background:#fff;border-radius:16px;padding:32px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,0.08);text-align:center}
h1{font-size:1.3rem;color:#6b4f3c;margin-bottom:4px}.id{font-size:0.8rem;color:#999;margin-bottom:24px}
.progress{display:flex;align-items:center;justify-content:center;margin:32px 0;flex-wrap:wrap;gap:0}
.step{display:flex;flex-direction:column;align-items:center;gap:6px;position:relative;z-index:1}
.step-dot{width:20px;height:20px;border-radius:50%;background:#ddd;border:3px solid #ddd;transition:all .3s}
.step.done .step-dot{background:#76946b;border-color:#76946b}
.step.current .step-dot{background:#fff;border-color:#76946b;box-shadow:0 0 0 4px rgba(118,148,107,.3)}
.step-label{font-size:0.7rem;color:#999;max-width:80px;text-align:center;line-height:1.2}
.step.done .step-label{color:#76946b;font-weight:600}
.step.current .step-label{color:#6b4f3c;font-weight:700}
.step-line{width:32px;height:3px;background:#ddd;margin:0 2px;margin-bottom:26px}
.step-line.done{background:#76946b}
.items{margin:24px 0;text-align:left;border-top:1px solid #eee;padding-top:16px}
.track-item{display:flex;justify-content:space-between;padding:6px 0;font-size:0.85rem;color:#555}
.total{display:flex;justify-content:space-between;font-weight:700;font-size:1rem;border-top:2px solid #eee;padding-top:12px;margin-top:8px}
.status-msg{margin-top:24px;padding:12px;border-radius:8px;font-size:0.85rem;background:#f0f7ee;color:#4a7c59}
.btn-volver{display:inline-block;margin-top:20px;padding:10px 24px;background:#76946b;color:#fff;text-decoration:none;border-radius:8px;font-size:0.85rem}
</style></head><body>
<div class="card">
  <h1>Seguimiento de pedido</h1>
  <p class="id">#${id}</p>
  <div class="progress">${steps}</div>
  <div class="status-msg">Estado actual: <strong>${STATUS_LABELS[s]}</strong></div>
  <div class="items">${itemsList}</div>
  <div class="total"><span>Total</span><span>S/. ${order.total.toFixed(2)}</span></div>
  <a href="/" class="btn-volver">Volver al catálogo</a>
</div>
</body></html>`;
}

// ─── API Handlers ───

async function createPreference(req, env) {
  let body;
  try { body = await req.json(); } catch (_) { return json({ error: 'JSON inválido' }, 400); }

  const items = body?.items;
  if (!items?.length) return json({ error: 'Carrito vacío' }, 400);
  const customer = body?.customer || {};

  const token = (env.MERCADO_PAGO_ACCESS_TOKEN || '').trim();
  if (!token) return json({ error: 'Token MP no configurado' }, 500);

  const orderId = 'K' + genId();
  const baseUrl = env.SITE_URL || 'https://konarumis.ivanokmc11.workers.dev';

  const payload = {
    items,
    back_urls: {
      success: baseUrl + '/?status=success&order=' + orderId,
      failure: baseUrl + '/?status=failure',
      pending: baseUrl + '/?status=pending',
    },
    auto_return: 'approved',
  };

  const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(payload),
  });

  let data;
  try { data = await mpRes.json(); } catch (_) {
    const text = await mpRes.text().catch(() => '');
    return json({ error: 'MP respondió ' + mpRes.status + ': ' + (text || 'sin cuerpo') }, 500);
  }
  if (!mpRes.ok) return json({ error: 'MP error: ' + JSON.stringify(data) }, 500);

  // Create order in KV
  const total = items.reduce((s, i) => s + (i.unit_price || 0) * (i.quantity || 1), 0);
  const order = {
    id: orderId,
    items: items.map(i => ({ title: i.title, qty: i.quantity || 1, unit_price: i.unit_price || 0 })),
    total,
    status: 'created',
    paid: false,
    preferenceId: data.id,
    customer: { name: customer.name || '', phone: customer.phone || '', address: customer.address || '', location: customer.location || '' },
    createdAt: new Date().toISOString(),
  };

  try {
    await env.ORDERS.put(orderId, JSON.stringify(order));
  } catch (e) {
    // Order created in MP but failed to save in KV — still return preferenceId
  }

  return json({ preferenceId: data.id, orderId });
}

async function getOrder(req, env, orderId) {
  const raw = await env.ORDERS.get(orderId);
  if (!raw) return json({ error: 'Pedido no encontrado' }, 404);
  return json(JSON.parse(raw));
}

async function confirmOrder(env, orderId) {
  const raw = await env.ORDERS.get(orderId);
  if (!raw) return json({ error: 'Pedido no encontrado' }, 404);
  const order = JSON.parse(raw);
  if (order.paid) return json({ ok: true }); // already confirmed
  order.paid = true;
  if (order.status === 'created') order.status = 'pending';
  await env.ORDERS.put(orderId, JSON.stringify(order));
  return json({ ok: true, orderId });
}

async function updateOrderStatus(req, env, orderId) {
  let body;
  try { body = await req.json(); } catch (_) { return json({ error: 'JSON inválido' }, 400); }

  const newStatus = body?.status;
  if (!STATUSES.includes(newStatus)) return json({ error: 'Estado inválido' }, 400);

  const raw = await env.ORDERS.get(orderId);
  if (!raw) return json({ error: 'Pedido no encontrado' }, 404);

  const order = JSON.parse(raw);
  order.status = newStatus;
  await env.ORDERS.put(orderId, JSON.stringify(order));
  return json({ ok: true, status: newStatus });
}

async function listOrders(env, all = false) {
  const list = await env.ORDERS.list();
  const orders = [];
  for (const key of list.keys) {
    const raw = await env.ORDERS.get(key.name);
    if (!raw) continue;
    const o = JSON.parse(raw);
    if (all || o.paid) orders.push(o);
  }
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return json(orders);
}

// ─── Router ───

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key' },
      });
    }

    try {
      // ── Admin login ──
      if (path === '/api/admin/login' && request.method === 'POST') {
        const body = await request.json();
        if (body?.password === (env.ADMIN_PASSWORD || '')) return json({ ok: true });
        return json({ error: 'Contraseña incorrecta' }, 401);
      }

      // ── Admin: list orders ──
      if (path === '/api/orders' && request.method === 'GET') {
        if (!isAdmin(request, env)) return json({ error: 'No autorizado' }, 401);
        return listOrders(env, url.searchParams.get('all') === '1');
      }

      // ── Admin: update status ──
      const statusMatch = path.match(/^\/api\/order\/([A-Za-z0-9]+)\/status$/);
      if (statusMatch && request.method === 'POST') {
        if (!isAdmin(request, env)) return json({ error: 'No autorizado' }, 401);
        return updateOrderStatus(request, env, statusMatch[1]);
      }

      // ── Confirm order (after successful payment) ──
      const confirmMatch = path.match(/^\/api\/order\/([A-Za-z0-9]+)\/confirm$/);
      if (confirmMatch && request.method === 'POST') {
        return confirmOrder(env, confirmMatch[1]);
      }

      // ── Get order (public) ──
      const orderMatch = path.match(/^\/api\/order\/([A-Za-z0-9]+)$/);
      if (orderMatch && request.method === 'GET') {
        return getOrder(request, env, orderMatch[1]);
      }

      // ── Create preference ──
      if (path === '/api/create-preference' && request.method === 'POST') {
        return createPreference(request, env);
      }

      // ── Webhook ──
      if (path === '/api/webhook' && request.method === 'POST') {
        try {
          const whBody = await request.clone().json();
          if (whBody.type === 'payment') {
            const pRes = await fetch('https://api.mercadopago.com/v1/payments/' + whBody.data.id, {
              headers: { Authorization: 'Bearer ' + (env.MERCADO_PAGO_ACCESS_TOKEN || '') },
            });
            const p = await pRes.json();
            if (p.status === 'approved') console.log('Pago OK:', p.id);
          }
        } catch (_) {}
        return new Response(null, { status: 200 });
      }

      // ── Admin page ──
      if (path === '/admin' || path === '/admin/') {
        return html(adminHtml());
      }

      // ── Tracking page ──
      if (path === '/pedido') {
        const orderId = url.searchParams.get('id');
        if (!orderId) return html(trackingHtml('---', { items: [], total: 0, status: 'pending' }), 404);
        const raw = await env.ORDERS.get(orderId);
        if (!raw) return html('<h1>Pedido no encontrado</h1><a href="/">Volver</a>', 404);
        return html(trackingHtml(orderId, JSON.parse(raw)));
      }

    } catch (e) {
      return json({ error: 'Error interno: ' + e.message }, 500);
    }

    // Serve static assets
    return env.ASSETS.fetch(request);
  },
};
