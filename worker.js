function json(data, status = 200, extraHeaders) {
  const base = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key' };
  const h = extraHeaders ? Object.assign({}, base, extraHeaders) : base;
  return new Response(JSON.stringify(data), { status, headers: h });
}

function html(body, status = 200) {
  return new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' } });
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

// ─── Rate limiter ───
const rateLimitMap = new Map();
function checkRateLimit(ip, maxAttempts = 10, windowMs = 60000) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count++;
  rateLimitMap.set(ip, entry);
  // Cleanup old entries every 100 requests
  if (rateLimitMap.size > 1000) {
    const cutoff = now - 120000;
    for (const [key, val] of rateLimitMap) {
      if (val.resetAt < cutoff) rateLimitMap.delete(key);
    }
  }
  return {
    allowed: entry.count <= maxAttempts,
    remaining: Math.max(0, maxAttempts - entry.count),
    resetAt: entry.resetAt,
  };
}

// ─── Admin Panel HTML (sketchbook aesthetic) ───
function adminHtml() {
  const css = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Literata:ital,wght@0,400;0,600;1,400&display=swap");
:root{--font-headline:'Bricolage Grotesque',system-ui,sans-serif;--font-body:'Literata',Georgia,serif;--color-teal:#76946b;--color-teal-dark:#8fb887;--color-ink:#E8E6E1;--color-paper:#1A1D1E;--color-surface:#232728;--color-surface-high:#2A2F31;--color-ink-variant:#A5ADB0;--border-width:3px;--shadow-offset:4px;--shadow-ink:#111}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--font-body);background:var(--color-surface);color:var(--color-ink);min-height:100vh}
.wrap{max-width:1000px;margin:0 auto;padding:24px}
.top{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;background:var(--color-surface);color:var(--color-ink);position:sticky;top:0;z-index:10;border-bottom:var(--border-width) solid var(--color-teal)}
.top h1{font-family:var(--font-headline);font-size:1.1rem;font-weight:800;color:var(--color-ink);letter-spacing:1px}
.top h1 span{color:var(--color-teal)}
.top a{color:var(--color-ink-variant);text-decoration:none;font-size:0.75rem;padding:6px 14px;border:var(--border-width) solid var(--color-ink-variant);font-family:var(--font-headline);font-weight:700;transition:all .15s}
.top a:hover{border-color:var(--color-teal);color:var(--color-teal)}
.toolbar{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center}
.fb{font-family:var(--font-headline);font-size:.7rem;font-weight:700;padding:6px 14px;border:var(--border-width) solid var(--color-ink);background:var(--color-surface);color:var(--color-ink);cursor:pointer;transition:all .12s;box-shadow:2px 2px 0 var(--shadow-ink)}
.fb.act{background:var(--color-teal);color:var(--color-paper);border-color:var(--color-teal);box-shadow:none}
.fb:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 var(--shadow-ink)}.fb.act:hover{transform:none;box-shadow:none;background:var(--color-teal-dark)}
.fb.sync{margin-left:auto}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:10px;margin-bottom:16px}
.sc{background:var(--color-surface);border:var(--border-width) solid var(--color-ink);padding:12px;text-align:center;box-shadow:var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-ink)}
.sc .n{font-family:var(--font-headline);font-size:1.3rem;font-weight:800;color:var(--color-ink)}
.sc .l{font-size:.55rem;color:var(--color-ink-variant);text-transform:uppercase;letter-spacing:.5px;margin-top:3px;font-family:var(--font-headline);font-weight:700}
.lb{max-width:360px;margin:80px auto;text-align:center;background:var(--color-surface);padding:40px 32px;border:var(--border-width) solid var(--color-ink);box-shadow:var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-ink)}
.lb h2{font-family:var(--font-headline);font-size:1.2rem;font-weight:800;color:var(--color-ink);margin-bottom:4px}
.lb p{font-size:.78rem;color:var(--color-ink-variant);margin-bottom:16px;font-family:var(--font-body)}
.lb input{width:100%;padding:10px 12px;border:var(--border-width) solid var(--color-ink);font-size:.85rem;margin-bottom:10px;font-family:var(--font-body);background:#2a2a2a;color:var(--color-ink);transition:box-shadow .15s}
.lb input:focus{outline:none;box-shadow:3px 3px 0 var(--shadow-ink)}
.lb button{width:100%;padding:10px;background:var(--color-teal);color:var(--color-paper);border:var(--border-width) solid var(--color-teal);font-size:.85rem;cursor:pointer;font-family:var(--font-headline);font-weight:800;transition:background .15s;letter-spacing:.5px}
.lb button:hover{background:var(--color-teal-dark)}
.lb .err{color:#f44336;font-size:.7rem;margin-top:6px;display:none;font-family:var(--font-body)}
.lb .attempts{font-size:.6rem;color:var(--color-ink-variant);margin-top:8px;font-family:var(--font-body)}
.oc{background:var(--color-surface);border:var(--border-width) solid var(--color-ink);margin-bottom:14px;box-shadow:var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-ink);overflow:hidden}
.oc.mp{border-left-color:#4fc3f7}.oc.wpp{border-left-color:#66bb6a}
.och{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:var(--color-paper);border-bottom:var(--border-width) solid var(--color-ink);flex-wrap:wrap;gap:6px}
.oi{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.oid{font-family:var(--font-headline);font-size:.85rem;font-weight:800;color:var(--color-teal);letter-spacing:1px}
.od{font-size:.6rem;color:var(--color-ink-variant);font-family:var(--font-body)}
.bdg{display:inline-block;font-size:.5rem;font-weight:700;padding:2px 7px;border:2px solid;text-transform:uppercase;letter-spacing:.5px;font-family:var(--font-headline)}
.bdg.mp{background:#1a237e;color:#90caf9;border-color:#42a5f5}
.bdg.wpp{background:#1b5e20;color:#a5d6a7;border-color:#66bb6a}
.bdg.paid{background:#2e7d32;color:#c8e6c9;border-color:#4caf50}
.bdg.unpaid{background:#e65100;color:#ffe0b2;border-color:#ff9800}
.sb{display:inline-block;padding:3px 10px;font-size:.55rem;font-weight:700;color:var(--color-paper);text-transform:uppercase;letter-spacing:.5px;border:2px solid transparent;font-family:var(--font-headline)}
.sb.sp{background:#bf8f60;border-color:#bf8f60}.sb.ss{background:#5a7fa6;border-color:#5a7fa6}.sb.sh{background:#8a6fa6;border-color:#8a6fa6}.sb.sf{background:var(--color-teal);border-color:var(--color-teal)}.sb.sr{background:#3a6b48;border-color:#3a6b48}
.ocb{display:grid;grid-template-columns:1fr 1fr;gap:0}
.cl{padding:14px 16px}
.cl+.cl{border-left:var(--border-width) solid var(--color-ink)}@media(max-width:700px){.ocb{grid-template-columns:1fr}.cl+.cl{border-left:none;border-top:var(--border-width) solid var(--color-ink)}}
.cl h3{font-size:.55rem;text-transform:uppercase;letter-spacing:1px;color:var(--color-ink-variant);margin-bottom:8px;font-weight:700;font-family:var(--font-headline)}
.pr{display:flex;justify-content:space-between;padding:4px 0;font-size:.75rem;color:var(--color-ink);border-bottom:1px solid var(--color-paper);font-family:var(--font-body)}
.pr:last-child{border:none}
.pr .prc{color:var(--color-ink);font-weight:600}
.otr{display:flex;justify-content:space-between;font-size:.85rem;font-weight:800;color:var(--color-ink);padding-top:6px;margin-top:4px;border-top:var(--border-width) solid var(--color-ink);font-family:var(--font-headline)}
.cd{display:grid;gap:5px}
.cd div{font-size:.75rem;color:var(--color-ink);display:flex;gap:6px;font-family:var(--font-body)}
.cd .tg{color:var(--color-ink-variant);min-width:50px;font-family:var(--font-headline);font-weight:700;font-size:.65rem;text-transform:uppercase;letter-spacing:.5px}
.sctl{margin-top:10px}
.sctl select{width:100%;padding:6px 8px;border:var(--border-width) solid var(--color-ink);font-size:.72rem;background:#2a2a2a;color:var(--color-ink);cursor:pointer;font-family:var(--font-body);transition:box-shadow .15s}
.sctl select:focus{outline:none;box-shadow:2px 2px 0 var(--shadow-ink)}
.emp{text-align:center;padding:60px 24px}
.emp p{color:var(--color-ink-variant);font-size:.85rem;font-family:var(--font-body)}
.cf-inp{width:100%;padding:8px;border:var(--border-width) solid var(--color-ink);background:#2a2a2a;color:var(--color-ink);margin-bottom:6px;font-family:var(--font-body);font-size:.78rem}
.cf-inp:focus{outline:none;box-shadow:2px 2px 0 var(--shadow-ink)}
.cf-ib{display:flex;gap:4px;margin-bottom:4px}
.cf-ib .n{flex:2}.cf-ib .q{flex:0 0 60px}.cf-ib .p{flex:0 0 80px}
.cf-btn{padding:6px 14px;border:var(--border-width) solid var(--color-ink);background:var(--color-surface);color:var(--color-ink);cursor:pointer;font-family:var(--font-headline);font-weight:700;font-size:.65rem;transition:all .12s}
.cf-btn:hover{transform:translate(-1px,-1px);box-shadow:2px 2px 0 var(--shadow-ink)}
.cf-btn-p{flex:1;padding:8px;background:var(--color-teal);color:var(--color-paper);border:var(--border-width) solid var(--color-teal);font-family:var(--font-headline);font-weight:800;cursor:pointer;font-size:.75rem}
.cf-btn-p:hover{background:var(--color-teal-dark)}
.cf-err{color:#f44336;font-size:.7rem;margin-top:4px}
.cf-ok{text-align:center;padding:10px;border:var(--border-width) solid var(--color-teal);margin-top:6px}
.cf-ok .c{font-size:1.2rem;font-weight:800;color:var(--color-teal);font-family:var(--font-headline);letter-spacing:1px}
.cf-ok .s{font-size:.6rem;color:var(--color-ink-variant);margin:0 0 4px}
.cf-ok a{font-size:.65rem;color:var(--color-ink-variant)}
@media(max-width:500px){.wrap{padding:12px}.top{padding:12px 16px}.top h1{font-size:.95rem}.och{padding:10px 12px}.cl{padding:10px 12px}}`;
  const statusData = JSON.stringify(Object.entries(STATUS_LABELS).map(([k,v]) => [k,v]));
  const statusesJson = JSON.stringify(STATUSES);
  const renderJs = `
const SK="__ak",SD=${statusData},ORDERED=${statusesJson};
var STATUS_LABELS={},FILTER='all';SD.forEach(function(a){STATUS_LABELS[a[0]]=a[1]});
var loginAttempts=parseInt(sessionStorage.getItem(SK+'_attempts')||'0');
function k(){return sessionStorage.getItem(SK)||""}
async function api(u,o){if(!o)o={};var kk=k();if(kk)o.headers=o.headers||{};if(kk)o.headers["X-Admin-Key"]=kk;var r;try{r=await fetch(u,o)}catch(e){return{ok:false}}if(r.status===401){sessionStorage.removeItem(SK);sessionStorage.removeItem(SK+'_attempts');render()}return r}
async function login(){var p=document.getElementById("pwd").value;try{var r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:p})});if(r.ok){sessionStorage.setItem(SK,p);sessionStorage.removeItem(SK+'_attempts');document.getElementById("err").style.display="none";await render()}else{loginAttempts++;sessionStorage.setItem(SK+'_attempts',loginAttempts);document.getElementById("err").style.display="block";document.getElementById("rem").textContent=Math.max(0,5-loginAttempts)+" intento(s) restante(s)";if(loginAttempts>=5){document.getElementById("pwd").disabled=true;document.getElementById("loginbtn").disabled=true;document.getElementById("rem").textContent="Demasiados intentos. Cierra y vuelve a abrir la pagina."}}}catch(e){alert("Error: "+e.message)}}
async function setStatus(id,s){await api("/api/order/"+id+"/status",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:s})});render()}
async function togglePaid(id){var r=await api("/api/order/"+id+"/paid",{method:"POST"});if(r.ok)render()}
function showCreateForm(){
  if(document.getElementById("cf"))return;
  var h='<div id="cf" style="background:var(--color-surface);border:var(--border-width) solid var(--color-ink);padding:16px;margin-bottom:16px;box-shadow:var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-ink)">'+
    '<h3 style="font-family:var(--font-headline);font-size:.8rem;margin-bottom:10px">Nuevo Pedido (WhatsApp)</h3>'+
    '<input class="cf-inp" id="cf-name" placeholder="Nombre">'+
    '<input class="cf-inp" id="cf-phone" placeholder="WhatsApp">'+
    '<input class="cf-inp" id="cf-addr" placeholder="Direcci\u00F3n">'+
    '<div id="cf-items"><div class="cf-ib"><input class="cf-inp n cf-ip-name" placeholder="Producto"><input class="cf-inp q cf-ip-qty" type=number placeholder="Cant" value=1><input class="cf-inp p cf-ip-price" type=number step=.01 placeholder="Precio S/."></div></div>'+
    '<button class="cf-btn" onclick="addItemRow()" style="margin:0 0 10px">+ Agregar item</button>'+
    '<div style="display:flex;gap:6px">'+
    '<button class="cf-btn-p" onclick="submitCreateOrder()">Generar c\u00F3digo</button>'+
    '<button class="cf-btn" onclick="this.parentElement.parentElement.remove()">Cancelar</button></div>'+
    '<div id="cf-result"></div></div>';
  document.getElementById("app").insertAdjacentHTML("afterbegin",h);
  document.getElementById("cf-name").focus();
}
function addItemRow(){
  var d=document.createElement("div");d.className="cf-ib";
  d.innerHTML='<input class="cf-inp n cf-ip-name" placeholder="Producto"><input class="cf-inp q cf-ip-qty" type=number placeholder="Cant" value=1><input class="cf-inp p cf-ip-price" type=number step=.01 placeholder="Precio S/.">';
  document.getElementById("cf-items").appendChild(d);
}
async function submitCreateOrder(){
  var name=document.getElementById("cf-name").value.trim();
  var phone=document.getElementById("cf-phone").value.trim();
  var addr=document.getElementById("cf-addr").value.trim();
  if(!name||!phone){document.getElementById("cf-result").innerHTML='<p class="cf-err">Nombre y WhatsApp son obligatorios</p>';return}
  var items=[],err=false;
  document.querySelectorAll("#cf-items .cf-ib").forEach(function(r){
    var n=r.querySelector(".cf-ip-name"),q=r.querySelector(".cf-ip-qty"),p=r.querySelector(".cf-ip-price");
    if(n&&n.value.trim())items.push({title:n.value.trim(),qty:parseInt(q.value)||1,unit_price:parseFloat(p.value)||0});
  });
  if(!items.length){document.getElementById("cf-result").innerHTML='<p class="cf-err">Agrega al menos un producto</p>';return}
  var total=items.reduce(function(s,i){return s+i.qty*i.unit_price},0);
  document.getElementById("cf-result").innerHTML='<p style="color:var(--color-ink-variant);font-size:.7rem">Creando pedido...</p>';
  var r=await api("/api/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:name,phone:phone,address:addr,items:items,total:total})});
  if(!r.ok){document.getElementById("cf-result").innerHTML='<p class="cf-err">Error al crear pedido</p>';return}
  var o=await r.json();
  document.getElementById("cf-result").innerHTML='<div class="cf-ok"><p class="s">Pedido creado</p><p class="c">#'+o.id+'</p><a href="/pedido?id='+o.id+'" target="_blank">Ver seguimiento</a></div>';
  render();
}
function fmt(d){var t=new Date(d);return t.toLocaleDateString("es-PE",{day:"2-digit",month:"short"})+" "+t.toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit"})}
function payLabel(o){var p=o.payment||(o.preferenceId?'mp':'wpp');return p==='mp'?'Mercado Pago':'WhatsApp'}
function payCls(o){var p=o.payment||(o.preferenceId?'mp':'wpp');return p==='mp'?'mp':'wpp'}
function card(o){
  var c=o.customer||{},it=o.items||[];
  return '<div class="oc '+payCls(o)+'">'+
    '<div class=och><div class=oi><div><span class=oid>#'+o.id+'</span><span class=od> '+fmt(o.createdAt)+'</span></div>'+
    '<span class="bdg '+payCls(o)+'">'+payLabel(o)+'</span>'+
    '<span class="bdg '+(o.paid?'paid':'unpaid')+'">'+(o.paid?'Pagado':'Pendiente')+'</span>'+
    '</div><span class="sb s'+o.status.charAt(0)+'">'+(STATUS_LABELS[o.status]||o.status)+'</span></div>'+
    '<div class=ocb><div class=cl><h3>Productos</h3>'+
    it.map(function(i){return'<div class=pr><span>'+i.title+' x'+i.qty+'</span><span class=prc>S/. '+(i.unit_price*i.qty).toFixed(2)+'</span></div>'}).join('')+
    '<div class=otr><span>Total</span><span>S/. '+o.total.toFixed(2)+'</span></div></div>'+
    '<div class=cl><h3>Cliente</h3>'+
    '<div class=cd>'+
    '<div><span class=tg>Nombre</span><span>'+(c.name||'-')+'</span></div>'+
    '<div><span class=tg>WhatsApp</span><span>'+(c.phone||'-')+'</span></div>'+
    '<div><span class=tg>Dir.</span><span>'+(c.address||'-')+'</span></div>'+
    (o.paymentMpId?'<div><span class=tg>MP ID</span><span style=font-size:.6rem;word-break:break-all>'+o.paymentMpId+'</span></div>':'')+
    '</div>'+
    '<div style="display:flex;gap:6px;margin-top:8px">'+
    '<div class=sctl style="flex:1;margin-top:0"><h3>Estado</h3><select onchange="setStatus(' + "'" + o.id + "'" + ',this.value)">'+
    ORDERED.map(function(s){return'<option value="'+s+'"'+(s===o.status?' selected':'')+'>'+STATUS_LABELS[s]+'</option>'}).join('')+
    '</select></div>'+
    '<div class=sctl style="flex:0;margin-top:0"><h3>Pago</h3><button onclick="togglePaid(' + "'" + o.id + "'" + ')" style="padding:6px 10px;font-size:.65rem;font-family:var(--font-headline);font-weight:700;border:var(--border-width) solid '+(o.paid?'#4caf50':'var(--color-ink-variant)')+';background:'+(o.paid?'#2e7d32':'transparent')+';color:'+(o.paid?'#c8e6c9':'var(--color-ink-variant)')+';cursor:pointer;width:100%">'+(o.paid?'Pagado':'Pendiente')+'</button></div>'+
    '</div></div></div>';
}
async function render(){
  var kk=k();
  if(!kk){document.getElementById("app").innerHTML='<div class=lb><h2>Acceso restringido</h2><p>Ingresa la contrase\u00F1a de administrador</p><input id=pwd type=password placeholder="Contrase\u00F1a" onkeydown="if(event.key===\\"Enter\\")login()" autofocus><button id=loginbtn onclick=login()>Ingresar</button><div class=err id=err>Contrase\u00F1a incorrecta</div><div class=attempts id=rem>'+(loginAttempts>=5?'Demasiados intentos. Cierra la pagina.':(5-loginAttempts)+' intento(s) restante(s)')+'</div></div>';if(loginAttempts>=5){document.getElementById("pwd").disabled=true;document.getElementById("loginbtn").disabled=true}return}
  document.getElementById("app").innerHTML='<div class=emp><p>Cargando...</p></div>';
  var r=await api("/api/orders?all=1");
  if(!r.ok){document.getElementById("app").innerHTML='<div class=lb><p>Error al cargar pedidos</p><button onclick=render() style="margin-top:12px;padding:8px 20px;background:var(--color-teal);color:var(--color-paper);border:var(--border-width) solid var(--color-teal);font-family:var(--font-headline);font-weight:800;cursor:pointer">Reintentar</button></div>';return}
  var allOrders=await r.json();
  var orders=FILTER==='all'?allOrders:allOrders.filter(function(o){return (o.payment||'mp')===FILTER});
  var sm={};ORDERED.forEach(function(s){sm[s]=0});
  allOrders.forEach(function(o){sm[o.status]=(sm[o.status]||0)+1});
  var total=allOrders.length,paid=allOrders.filter(function(o){return o.paid}).length,pend=allOrders.filter(function(o){return !o.paid}).length,
      mpCount=allOrders.filter(function(o){return o.payment==='mp'}).length,wppCount=allOrders.filter(function(o){return o.payment!=='mp'}).length,
      rev=allOrders.filter(function(o){return o.paid}).reduce(function(s,o){return s+(o.total||0)},0);
  var h='<div class=toolbar>'+
    '<button class="fb'+(FILTER==='all'?' act':'')+'" onclick="FILTER=\\'all\\';render()">Todos</button>'+
    '<button class="fb'+(FILTER==='mp'?' act':'')+'" onclick="FILTER=\\'mp\\';render()">MP</button>'+
    '<button class="fb'+(FILTER==='wpp'?' act':'')+'" onclick="FILTER=\\'wpp\\';render()">WhatsApp</button>'+
    '<button class="fb" onclick="showCreateForm()" style="margin-left:0">+ Nuevo</button>'+
    '<button class="fb sync" onclick="render()">&#x21BB; Sincronizar</button></div>';
  h+='<div class=stats><div class=sc><div class=n>'+total+'</div><div class=l>Pedidos</div></div><div class=sc><div class=n>'+paid+'</div><div class=l>Pagados</div></div><div class=sc><div class=n>'+pend+'</div><div class=l>Pendientes</div></div><div class=sc><div class=n>S/. '+rev.toFixed(2)+'</div><div class=l>Ingresos</div></div><div class=sc><div class=n>'+mpCount+'</div><div class=l>MP</div></div><div class=sc><div class=n>'+wppCount+'</div><div class=l>WPP</div></div></div>';
  h+='<div class=stats style="grid-template-columns:repeat(5,1fr)">'+ORDERED.map(function(s){return'<div class=sc><div class=n>'+(sm[s]||0)+'</div><div class=l>'+STATUS_LABELS[s].replace(/Pedido /g,'')+'</div></div>'}).join('')+'</div>';
  if(!orders.length){document.getElementById("app").innerHTML=h+'<div class=emp><p>No hay pedidos'+(FILTER!=='all'?' con este filtro':'')+'</p></div>';return}
  h+=orders.map(card).join('');
  document.getElementById("app").innerHTML=h;
}
render();`;
  return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin — Konarumis</title><style>' + css + '</style></head><body>' +
    '<div class="top"><h1>KONA<span>RUMIS</span> <span style="font-size:.65rem;opacity:.6;font-weight:400">Admin</span></h1><a href="#" onclick="sessionStorage.removeItem(\'__ak\');sessionStorage.removeItem(\'__ak_attempts\');render();return false">Cerrar sesi\u00F3n</a></div>' +
    '<div class="wrap"><div id="app"></div></div>' +
    '<script>' + renderJs + '</script></body></html>';
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

  const waNum = '51922330331';
  let actionBtn = '';
  if (s === 'halfway' || s === 'finished') {
    const waMsg = `Hola! Me gustaria ver fotos de mi pedido %23${id}`;
    actionBtn = `<a href="https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}" target="_blank" class="btn-action">Pedir fotos por WhatsApp</a>`;
  } else if (s === 'ready') {
    const waMsg = `Hola! Mi pedido %23${id} esta listo para entrega, cuando puedo coordinarla?`;
    actionBtn = `<a href="https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}" target="_blank" class="btn-action">Coordinar entrega</a>`;
  }

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
.btn-action{display:block;margin-top:12px;padding:12px 20px;background:#25d366;color:#fff;text-decoration:none;border-radius:8px;font-size:0.85rem;font-weight:600;transition:background .2s}.btn-action:hover{background:#1da851}
.btn-volver{display:inline-block;margin-top:16px;padding:10px 24px;background:#76946b;color:#fff;text-decoration:none;border-radius:8px;font-size:0.85rem}
</style></head><body>
<div class="card">
  <h1>Seguimiento de pedido</h1>
  <p class="id">#${id}</p>
  <div class="progress">${steps}</div>
  <div class="status-msg">Estado actual: <strong>${STATUS_LABELS[s]}</strong></div>
  ${actionBtn}
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
    payment: 'mp',
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

async function toggleOrderPaid(env, orderId) {
  const raw = await env.ORDERS.get(orderId);
  if (!raw) return json({ error: 'Pedido no encontrado' }, 404);
  const order = JSON.parse(raw);
  order.paid = !order.paid;
  if (order.paid && order.status === 'created') order.status = 'pending';
  await env.ORDERS.put(orderId, JSON.stringify(order));
  return json({ ok: true, paid: order.paid });
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

async function createOrder(request, env) {
  const body = await request.json();
  let id = body.id;
  if (!id) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    id = 'KMR';
    for (let i = 0; i < 5; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    while (await env.ORDERS.get(id)) {
      id = 'KMR';
      for (let i = 0; i < 5; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } else if (await env.ORDERS.get(id)) {
    return json({ error: 'El pedido ya existe', id }, 409);
  }
  const now = new Date().toISOString();
  const order = {
    id,
    customer: { name: body.name || '', phone: body.phone || '', address: body.address || '', location: body.location || '' },
    items: Array.isArray(body.items) ? body.items : [],
    total: Number(body.total) || 0,
    payment: 'wpp',
    paid: false,
    status: 'pending',
    createdAt: now
  };
  await env.ORDERS.put(id, JSON.stringify(order));
  return json(order, 201);
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
      const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';

      function rlHeaders() {
        const rl = checkRateLimit(ip);
        return { 'X-RateLimit-Remaining': String(rl.remaining), 'X-RateLimit-Reset': String(rl.resetAt) };
      }

      function checkApiRate(max = 10) {
        const rl = checkRateLimit(ip, max);
        return { allowed: rl.allowed, headers: { 'X-RateLimit-Remaining': String(rl.remaining), 'X-RateLimit-Reset': String(rl.resetAt) } };
      }

      // ── Admin login (rate limited: 5/min) ──
      if (path === '/api/admin/login' && request.method === 'POST') {
        const loginRl = checkRateLimit(ip + ':login', 5, 60000);
        if (!loginRl.allowed) return json({ error: 'Demasiados intentos. Espera un minuto.' }, 429, rlHeaders());
        const body = await request.json();
        if (body?.password === (env.ADMIN_PASSWORD || '')) return json({ ok: true });
        return json({ error: 'Contraseña incorrecta' }, 401);
      }

      // ── Admin: list orders ──
      if (path === '/api/orders' && request.method === 'GET') {
        const apiRl = checkApiRate();
        if (!apiRl.allowed) return json({ error: 'Demasiadas solicitudes. Intenta de nuevo.' }, 429, apiRl.headers);
        if (!isAdmin(request, env)) return json({ error: 'No autorizado' }, 401);
        return listOrders(env, url.searchParams.get('all') === '1');
      }

      // ── Create order (admin or client) ──
      if (path === '/api/order' && request.method === 'POST') {
        if (isAdmin(request, env)) {
          const apiRl = checkApiRate();
          if (!apiRl.allowed) return json({ error: 'Demasiadas solicitudes.' }, 429, apiRl.headers);
        } else {
          const pubRl = checkRateLimit(ip + ':create', 5, 60000);
          if (!pubRl.allowed) return json({ error: 'Demasiadas solicitudes.' }, 429);
        }
        return createOrder(request, env);
      }

      // ── Admin: update status ──
      const statusMatch = path.match(/^\/api\/order\/([A-Za-z0-9]+)\/status$/);
      if (statusMatch && request.method === 'POST') {
        const apiRl = checkApiRate();
        if (!apiRl.allowed) return json({ error: 'Demasiadas solicitudes. Intenta de nuevo.' }, 429, apiRl.headers);
        if (!isAdmin(request, env)) return json({ error: 'No autorizado' }, 401);
        return updateOrderStatus(request, env, statusMatch[1]);
      }

      // ── Toggle paid status (admin) ──
      const paidMatch = path.match(/^\/api\/order\/([A-Za-z0-9]+)\/paid$/);
      if (paidMatch && request.method === 'POST') {
        const apiRl = checkApiRate();
        if (!apiRl.allowed) return json({ error: 'Demasiadas solicitudes.' }, 429, apiRl.headers);
        if (!isAdmin(request, env)) return json({ error: 'No autorizado' }, 401);
        return toggleOrderPaid(env, paidMatch[1]);
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

      // ── Webhook (MP payment notification) ──
      if (path === '/api/webhook' && request.method === 'POST') {
        try {
          const whBody = await request.clone().json();
          if (whBody.type === 'payment') {
            const pRes = await fetch('https://api.mercadopago.com/v1/payments/' + whBody.data.id, {
              headers: { Authorization: 'Bearer ' + (env.MERCADO_PAGO_ACCESS_TOKEN || '') },
            });
            if (pRes.ok) {
              const p = await pRes.json();
              if (p.status === 'approved' && p.external_reference) {
                // Find order by preferenceId (stored in external_reference or preference_id)
                const prefId = p.external_reference || whBody.data.id;
                // Search for order by preferenceId
                const list = await env.ORDERS.list();
                for (const key of list.keys) {
                  const raw = await env.ORDERS.get(key.name);
                  if (!raw) continue;
                  const o = JSON.parse(raw);
                  if (o.preferenceId === p.preference_id || o.id === prefId) {
                    o.paid = true;
                    o.paymentMpId = String(whBody.data.id);
                    if (o.status === 'created') o.status = 'pending';
                    await env.ORDERS.put(o.id, JSON.stringify(o));
                    break;
                  }
                }
              }
            }
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

    // Serve static assets (no-cache for html/css/js)
    const asset = await env.ASSETS.fetch(request);
    const reqUrl = new URL(request.url);
    const ext = reqUrl.pathname.split('.').pop().toLowerCase();
    if (['html', 'css', 'js'].includes(ext) || url.pathname === '/' || url.pathname === '') {
      return new Response(asset.body, {
        status: asset.status,
        headers: {
          'Content-Type': asset.headers.get('Content-Type') || 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }
    return asset;
  },
};
