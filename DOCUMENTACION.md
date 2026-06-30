# Konarumis — Documentación del Proyecto

> Tienda de amigurumis hechos a mano con carrito, pagos Mercado Pago, panel admin y seguimiento de pedidos.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | HTML + CSS plano (vanilla) + JavaScript inline |
| **Backend** | Cloudflare Workers (`worker.js`) |
| **Hosting** | `https://konarumis.ivanokmc11.workers.dev` |
| **Pagos** | Mercado Pago Checkout Bricks (Wallet Brick embebido) |
| **Persistencia** | Cloudflare KV (namespace `ORDERS`) |
| **Enlaces** | Cloudflare Workers también sirve assets estáticos |

---

## Estructura de Archivos

```
proyecto catalogo/
├── index.html              # Frontend completo (catálogo, carrito, checkout, WPP)
├── styles.css              # Sistema de diseño completo (2750 líneas)
├── worker.js               # Backend Cloudflare Workers (rutas API, admin, tracking)
├── wrangler.toml           # Config Cloudflare Workers (KV, vars, assets)
├── CONTEXT.md              # Contexto para el agente de IA
├── DESIGN.md               # Especificación del sistema de diseño
├── DOCUMENTACION.md        # Este archivo
├── README.md
├── package.json
├── .gitignore
├── screen.png
├── skills-lock.json
│
└── images/
    ├── logo.png            # Logo principal
    ├── nombre.png          # Marca "Konarumis"
    ├── modo noche.png      # Icono modo oscuro
    ├── por tamaño.png      # Guía de tallas
    ├── tarjeta de presentacion 0.png  # Business card (anverso)
    ├── tarjeta de presentacion 1.png  # Business card (reverso)
    ├── jake.png, luffy.png, zoro.png, chopper.png, Finn.png
    ├── Freddy.png, Chuky.png, Jason.png
    ├── SP1.png, SP2.png, SP3.png, SP4.png  # South Park
    ├── llama.png, Snoopy.png, conejo llavero.png
    ├── ANNE.png, muñeca reversible 1.png, muñeca reversible 2.png
    └── (otros assets gráficos)
```

---

## Configuración (`wrangler.toml`)

```toml
name = "konarumis"
main = "worker.js"
compatibility_date = "2025-06-01"
workers_dev = true

assets = { directory = "./", binding = "ASSETS" }

vars = {
  SITE_URL = "https://konarumis.ivanokmc11.workers.dev",
  ADMIN_PASSWORD = "konarumis2026"
}

[[kv_namespaces]]
binding = "ORDERS"
id = "b0ebe810c73e41eebd816fe744ae8b6d"
```

### Variables de Entorno

| Variable | Dónde se define | Valor |
|---|---|---|
| `SITE_URL` | `wrangler.toml` (vars) | `https://konarumis.ivanokmc11.workers.dev` |
| `ADMIN_PASSWORD` | `wrangler.toml` (vars) | `konarumis2026` |
| `MERCADO_PAGO_ACCESS_TOKEN` | Secret de Cloudflare | TEST: configurado / PROD: pendiente |

### Mercado Pago — Credenciales

| Variable | Valor (TEST) |
|---|---|
| **Public Key** (frontend) | `TEST-77a7d14b-edd8-4d4e-901a-ffe99401c4fc` |
| **Access Token** (backend) | Configurado como secreto en Cloudflare (`wrangler secret put MERCADO_PAGO_ACCESS_TOKEN`) |

> **Importante:** Para producción, cambiar ambas credenciales cuando se verifique la cuenta MP.

---

## Rutas del Backend (`worker.js`)

| Ruta | Método | Descripción | Auth |
|---|---|---|---|
| `/api/admin/login` | POST | Valida contraseña, devuelve `{ok:true}` o 401 | No |
| `/api/orders` | GET | Lista pedidos pagados (`?all=1` para todos) | `X-Admin-Key` |
| `/api/order/:id/status` | POST | Actualiza estado del pedido | `X-Admin-Key` |
| `/api/order/:id/confirm` | POST | Marca pedido como pagado | No |
| `/api/order/:id` | GET | Obtiene datos del pedido | No |
| `/api/create-preference` | POST | Crea preferencia MP y guarda orden en KV | No |
| `/api/webhook` | POST | Recibe notificaciones MP (actualmente solo log) | No |
| `/admin` | GET | Panel admin HTML | No (JS auth en página) |
| `/pedido?id=...` | GET | Página de seguimiento del pedido | No |
| `/*` | GET | Assets estáticos (imágenes, CSS, etc.) | No |

### Estados del Pedido

```javascript
STATUSES = ['pending', 'started', 'halfway', 'finished', 'ready']

STATUS_LABELS = {
  pending:  'Pago procesado',
  started:  'Pedido iniciado',
  halfway:  'Pedido a la mitad',
  finished: 'Pedido terminado',
  ready:    'Listo para entrega'
}
```

### Formato de una Orden en KV

```json
{
  "id": "K1A2B3C4D5",
  "items": [{ "title": "Jake", "qty": 1, "unit_price": 27 }],
  "total": 27,
  "status": "pending",
  "paid": true,
  "preferenceId": "123456789",
  "customer": {
    "name": "Juan Perez",
    "phone": "987654321",
    "address": "Entrega en Plaza Tupac Amaru (Cusco)",
    "location": "cusco"
  },
  "createdAt": "2026-06-30T12:00:00.000Z"
}
```

---

## Frontend (`index.html`)

### Secciones Principales

| Sección | Descripción |
|---|---|
| **Header** | Logo, navegación, carrito, toggle tema, menú hamburguesa mobile |
| **Hero** | Slider de fondo, logo circular, badge "Hecho a mano", CTA, redes sociales |
| **Catálogo** | Tabs (Todos/Stock/Pedido), filtros por categoría, tarjetas de producto |
| **Guía de Tallas** | Tabla de medidas + botón "Cotiza tu personalizado" |
| **Nosotros** | "Detrás del tejido" con valores de marca |
| **Testimonios** | Cards con reseñas de clientes |
| **Tarjeta Digital** | Business card flippeable (tap para girar) |
| **Rastreo** | Input para buscar pedido por código |
| **Footer** | Redes sociales, contacto, enlaces |
| **Cart Drawer** | Carrito lateral con formulario de checkout y botones de pago/WPP |

### Funcionalidades Clave

- **Carrito** — localStorage, drawer lateral, persistencia entre sesiones
- **Checkout** — Nombre, WhatsApp, tipo de entrega (Cusco gratis / envío)
- **Stock vs Pedido** — Botones dinámicos: "Pedir amigurumi" (pago completo) / "Encargar (50% adelanto)"
- **Pago MP** — Wallet Brick embebido en el drawer del carrito
- **WhatsApp** — Botón flotante, enlaces en cards, en carrito, en post-pago, en tracking
- **Post-pago** — Modal con código de pedido + botones "Enviar por WhatsApp" y "Ver seguimiento"
- **Dark mode** — Default oscuro, almacena preferencia en localStorage
- **Modo responsive** — Adaptado a mobile, tablet y desktop

### Número WhatsApp

`51922330331` (Perú, Cusco)

---

## Diseño y CSS

### Tokens de Color

| Variable | Light | Dark |
|---|---|---|
| `--primary` | `#76946b` (verde) | `#afd0a1` |
| `--warm-accent` | `#c17a5d` (terracota) | `#d49477` |
| `--surface` | `#fcf9f8` | `#191d18` |
| `--on-surface` | `#1c1b1b` | `#f3f0ef` |

### Tipografía

- **Headlines/Botones**: `Hanken Grotesk` (sans-serif)
- **Cuerpo**: `Source Serif 4` (serif)

### Animaciones

- Scroll reveal (entrada de elementos al hacer scroll)
- Hover en cards (elevación)
- Fade en slider del hero
- Transiciones suaves en todos los botones
- Skeleton loading en hero

---

## Admin Panel

**URL:** `https://konarumis.ivanokmc11.workers.dev/admin`

**Contraseña:** `konarumis2026`

### Funcionalidades

- Login protegido (contraseña en variable de entorno)
- Dashboard con:
  - Tarjetas de estadísticas (conteo por estado)
  - Lista de pedidos con datos del cliente
  - Detalle de productos y total
  - Select para avanzar estado del pedido
  - Badges de colores por estado

### Admin API

Todas las llamadas (excepto login) llevan header `X-Admin-Key: <password>`.

---

## Tracking Público

**URL:** `https://konarumis.ivanokmc11.workers.dev/pedido?id=KXXXXX`

- Línea de progreso visual con 5 estados
- Datos del pedido (productos, total)
- Botones de acción según estado:
  - **Halfway / Finished**: "Pedir fotos por WhatsApp"
  - **Ready**: "Coordinar entrega"

---

## Deploy

```bash
# Deploy a Cloudflare Workers
wrangler deploy

# Configurar secret (solo la primera vez)
wrangler secret put MERCADO_PAGO_ACCESS_TOKEN
# Luego pegar el token y presionar Enter

# Si el token se pega mal (1 carácter), usar pipe:
# echo "TOKEN" | wrangler secret put MERCADO_PAGO_ACCESS_TOKEN
```

---

## Pendientes / Próximos Pasos

- [ ] **Verificar cuenta MP** para pasar de TEST a PRODUCCIÓN
  - Cambiar `MERCADO_PAGO_PUBLIC_KEY` en `index.html`
  - Actualizar `MERCADO_PAGO_ACCESS_TOKEN` en secrets
- [ ] Probar flujo completo con credenciales TEST
- [ ] Monitorear webhooks MP para confirmación automática

---

## Notas Técnicas

- **Compatibilidad:** wrangler v4 usa `env.ASSETS.fetch()` en vez de `getAssetFromKV()`
- **Los pedidos aparecen en admin solo si `paid=true`** (usar `/admin?all=1` para ver todos)
- **Confirmación de pago:** se llama a `/api/order/:id/confirm` desde la página de retorno exitoso de MP
- **IDs de pedido:** formato `K` + timestamp base36 + random (ej: `K1A2B3C4D5`)
- **Precios incluyen comisión MP** (3.49% + S/1)
