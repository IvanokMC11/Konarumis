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
  return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin - Konarumis</title><style>' +
'@import url("https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap");' +
'*{margin:0;padding:0;box-sizing:border-box}' +
'body{font-family:"Hanken Grotesk",system-ui,sans-serif;background:#f5f2ef;color:#2c2c2c;min-height:100vh}' +
'.admin-wrap{max-width:1000px;margin:0 auto;padding:24px}' +
'.top-bar{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;background:#2c2c2c;color:#fcf9f8;position:sticky;top:0;z-index:10}' +
'.top-bar h1{font-family:"Source Serif 4",serif;font-size:1.2rem;font-weight:600;color:#fcf9f8}' +
'.top-bar h1 span{color:#76946b}' +
'.top-bar a{color:#e0dbd7;text-decoration:none;font-size:0.8rem;padding:6px 14px;border:1px solid #555;border-radius:6px;transition:all .2s}' +
'.top-bar a:hover{border-color:#c17f59;color:#c17f59}' +
'.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:24px}' +
'.stat-card{background:#fff;border-radius:12px;padding:16px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.04)}' +
'.stat-card .num{font-size:1.5rem;font-weight:700;color:#6b4f3c;font-family:"Source Serif 4",serif}' +
'.stat-card .label{font-size:0.7rem;color:#999;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px}' +
'.login-box{max-width:340px;margin:120px auto;text-align:center;background:#fff;padding:40px 32px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}' +
'.login-box .icon{width:48px;height:48px;background:#f5f2ef;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:1.2rem}' +
'.login-box h2{font-family:"Source Serif 4",serif;font-size:1.2rem;color:#6b4f3c;margin-bottom:4px}' +
'.login-box p{font-size:0.8rem;color:#999;margin-bottom:20px}' +
'.login-box input{width:100%;padding:12px;border:2px solid #e0dbd7;border-radius:8px;font-size:0.9rem;margin-bottom:12px;transition:border .2s;font-family:inherit}' +
'.login-box input:focus{border-color:#76946b;outline:none}' +
'.login-box button{width:100%;padding:12px;background:#76946b;color:#fff;border:none;border-radius:8px;font-size:0.9rem;cursor:pointer;font-weight:700;transition:background .2s}' +
'.login-box button:hover{background:#5d7a53}' +
'.order-card{background:#fff;border-radius:12px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);overflow:hidden}' +
'.order-card-header{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;background:#fcf9f8;border-bottom:1px solid #f0eeec;flex-wrap:wrap;gap:8px}' +
'.order-info{display:flex;align-items:center;gap:12px}' +
'.order-id{font-size:0.9rem;font-weight:700;color:#6b4f3c;font-family:"Source Serif 4",serif}' +
'.order-date{font-size:0.7rem;color:#aaa}' +
'.status-badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:0.65rem;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:0.5px}' +
'.status-pending{background:#d4a373}.status-started{background:#6b9ac4}.status-halfway{background:#b088c4}.status-finished{background:#76946b}.status-ready{background:#4a7c59}' +
'.order-card-body{display:grid;grid-template-columns:1fr 1fr;gap:0}@media(max-width:700px){.order-card-body{grid-template-columns:1fr}}' +
'.order-col{padding:16px 20px}' +
'.order-col+.order-col{border-left:1px solid #f0eeec}@media(max-width:700px){.order-col+.order-col{border-left:none;border-top:1px solid #f0eeec}}' +
'.order-col h3{font-size:0.65rem;text-transform:uppercase;letter-spacing:0.8px;color:#bbb;margin-bottom:10px;font-weight:700}' +
'.product-row{display:flex;justify-content:space-between;padding:5px 0;font-size:0.8rem;color:#555;border-bottom:1px solid #f5f2ef}' +
'.product-row:last-child{border:none}' +
'.product-row .price{color:#6b4f3c;font-weight:600}' +
'.order-total-row{display:flex;justify-content:space-between;font-size:0.9rem;font-weight:700;color:#6b4f3c;padding-top:8px;margin-top:4px;border-top:2px solid #e8e3df}' +
'.customer-details{display:grid;gap:6px}' +
'.customer-details div{font-size:0.8rem;color:#555;display:flex;gap:6px}' +
'.customer-details .tag{color:#999;min-width:50px}' +
'.status-control{margin-top:12px}' +
'.status-control select{width:100%;padding:8px 10px;border:2px solid #e8e3df;border-radius:8px;font-size:0.8rem;background:#fff;cursor:pointer;font-family:inherit;transition:border .2s}' +
'.status-control select:focus{border-color:#76946b;outline:none}' +
'.empty-state{text-align:center;padding:80px 24px}' +
'.empty-state .empty-icon{font-size:2.5rem;opacity:0.3;margin-bottom:16px}' +
'.empty-state p{color:#bbb;font-size:0.9rem}' +
'.empty-state .sub{color:#ddd;font-size:0.8rem;margin-top:8px}' +
'@media(max-width:480px){.admin-wrap{padding:12px}.top-bar{padding:12px 16px}.top-bar h1{font-size:1rem}.order-card-header{padding:12px 16px}.order-col{padding:12px 16px}}' +
'</style></head><body>' +
'<div class="top-bar"><h1>Konarumis <span>Admin</span></h1><a href="#" onclick="sessionStorage.removeItem(\'__ak\');render();return false">Cerrar sesion</a></div>' +
'<div class="admin-wrap"><div id="app"></div></div>' +
'<script>' +
'const SK="__ak",STATUS_LABELS={' + Object.entries(STATUS_LABELS).map(([k,v]) => k+':"'+v+'"').join(',') + '},ORDERED=' + JSON.stringify(STATUSES) + ';' +
'function k(){let v=sessionStorage.getItem(SK);return v||""}' +
'async function api(u,o){let h=o.headers||{};let kk=k();if(kk)h["X-Admin-Key"]=kk;let r=await fetch(u,{...o,headers:h});if(r.status===401){sessionStorage.removeItem(SK);render()}return r}' +
'async function login(){let p=document.getElementById("pwd").value;let r=await api("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:p})});if(r.ok){sessionStorage.setItem(SK,p);render()}else{alert("Contrasena incorrecta")}}' +
'async function setStatus(id,s){await api("/api/order/"+id+"/status",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:s})});render()}' +
'function fmt(d){let t=new Date(d);return t.toLocaleDateString("es-PE",{day:"2-digit",month:"short"})+" "+t.toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit"})}' +
'async function render(){let kk=k();if(!kk){document.getElementById("app").innerHTML=' +
"'<div class=\"login-box\"><div class=\"icon\">&#128274;</div><h2>Acceso restringido</h2><p>Ingresa la contrasena de administrador</p><input id=\"pwd\" type=\"password\" placeholder=\"Contrasena\" onkeydown=\"if(event.key==='Enter')login()\" autofocus><button onclick=\"login()\">Ingresar</button></div>';return}" +
'let r=await api("/api/orders");if(!r.ok)return;let orders=await r.json();' +
'let stats={};ORDERED.forEach(s=>stats[s]=0);orders.forEach(o=>{stats[o.status]=(stats[o.status]||0)+1});' +
'let h="<div class=stats>"+ORDERED.map(s=>"<div class=stat-card><div class=num>"+(stats[s]||0)+"</div><div class=label>"+STATUS_LABELS[s]+"</div></div>").join("")+"</div>";' +
'if(!orders.length){document.getElementById("app").innerHTML=h+"<div class=empty-state><div class=empty-icon>&#128230;</div><p>No hay pedidos confirmados</p><p class=sub>Los pedidos aparecen aqui despues de un pago exitoso</p></div>";return}' +
'orders.forEach(o=>{let c=o.customer||{},items=o.items||[];' +
'h+="<div class=order-card>"' +
+'"<div class=order-card-header><div class=order-info><div><div class=order-id>#"+o.id+"</div><div class=order-date>"+fmt(o.createdAt)+"</div></div></div><span class=\"status-badge status-"+o.status+"\">"+(STATUS_LABELS[o.status]||o.status)+"</span></div>"' +
+'"<div class=order-card-body><div class=order-col><h3>Productos</h3>"' +
+items.map(i=>"<div class=product-row><span>"+i.title+" x"+i.qty+"</span><span class=price>S/. "+(i.unit_price*i.qty).toFixed(2)+"</span></div>").join("")+'<div class=order-total-row><span>Total</span><span>S/. '+o.total.toFixed(2)+'</span></div></div>' +
+'<div class=order-col><h3>Cliente</h3>' +
+'<div class=customer-details>' +
+'<div><span class=tag>Nombre</span><span>'+(c.name||"-")+'</span></div>' +
+'<div><span class=tag>WhatsApp</span><span>'+(c.phone||"-")+'</span></div>' +
+'<div><span class=tag>Direccion</span><span>'+(c.address||"-")+'</span></div>' +
+'</div>' +
+'<div class=status-control><h3>Estado</h3><select onchange=\"setStatus(\\\''+o.id+'\\\',this.value)\">'+ORDERED.map(s=>'<option value="'+s+'"'+(s===o.status?' selected':'')+'>'+STATUS_LABELS[s]+'</option>').join('')+'</select></div>' +
+'</div></div></div>";});' +
'document.getElementById("app").innerHTML=h;' +
'}' +
'render();' +
'</script></body></html>';
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
