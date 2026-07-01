# Rediseño Sketchbook Punk — Konarumis Web
> Guía completa de rediseño visual con estilo Neo-Brutalista artesanal  
> Basado en DESIGN.md + recursos SVG proporcionados

---

## Visión del rediseño

El sitio web de Konarumis pasa de un catálogo digital convencional a una **experiencia de sketchbook vivo**: como si alguien abriera su cuaderno de bocetos y los amigurumis cobran vida entre garabatos, parches cosidos y marcadores de color. La identidad "Cusco Punk" se fusiona con la estética artesanal del crochet: imperfecto a propósito, lleno de energía, auténtico.

---

## Sistema de diseño Sketchbook Punk

### Paleta de colores

```css
:root {
  /* Fondos */
  --color-paper:        #FCF9F2;   /* papel viejo, fondo principal */
  --color-surface:      #F1EEE7;   /* contenedores internos */
  --color-surface-high: #EBE8E1;   /* cards elevados */

  /* Texto */
  --color-ink:          #1A1A1A;   /* negro tinta — el color estructural */
  --color-ink-variant:  #3F484D;   /* variante más suave */

  /* Acentos de marca */
  --color-teal:         #2D7D9A;   /* teal Konarumis — CTAs primarios */
  --color-teal-dark:    #006480;   /* teal oscuro */
  --color-orange:       #E67E22;   /* naranja Konarumis — tags, categorías */
  --color-marker:       #FE9D7A;   /* marcador naranja — highlights de texto */

  /* Sombras y bordes */
  --shadow-ink:         #1A1A1A;   /* sombra offset dura */
  --border-width:       4px;       /* borde principal */
  --shadow-offset:      6px;       /* offset de sombra nivel 1 */
  --shadow-offset-hero: 10px;      /* offset de sombra nivel 2 (hero) */
}
```

### Tipografía

```css
/* Importar en <head> */
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?
  family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&
  family=Literata:ital,wght@0,400;0,600;1,400&
  display=swap">

/* Variables tipográficas */
:root {
  --font-headline: 'Bricolage Grotesque', sans-serif;
  --font-body:     'Literata', serif;

  /* Escala */
  --text-display: clamp(2rem, 5vw, 3.5rem);  /* hero */
  --text-h1:      clamp(1.75rem, 4vw, 2.5rem);
  --text-h2:      clamp(1.375rem, 3vw, 2rem);
  --text-body-lg: 1.125rem;
  --text-body:    1rem;
  --text-label:   0.875rem;
  --text-price:   1.375rem;
}
```

### Uso de fuentes

| Elemento | Fuente | Peso | Estilo |
|---|---|---|---|
| Títulos hero, H1, H2 | Bricolage Grotesque | 800 | Mayúsculas o itálica |
| Labels de botones, badges | Bricolage Grotesque | 800 | UPPERCASE, letter-spacing |
| Precio (price-tag) | Bricolage Grotesque | 900 | Normal |
| Cuerpo de texto | Literata | 400 | Normal |
| Texto de apoyo | Literata | 600 | Normal |
| Énfasis emocional | Literata | 400 | Itálica |

### Sistema de elevación (2D-Táctil)

```css
/* NUNCA usar box-shadow con blur — solo offset duro */

/* Nivel 1 — Cards / Botones */
.sk-level-1 {
  border: var(--border-width) solid var(--color-ink);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-ink);
}

/* Nivel 2 — Hero / Elementos activos */
.sk-level-2 {
  border: var(--border-width) solid var(--color-ink);
  box-shadow: var(--shadow-offset-hero) var(--shadow-offset-hero) 0 var(--shadow-ink);
}

/* Estado :active — simula presión física */
.sk-btn:active {
  transform: translate(3px, 3px);
  box-shadow: none;
}
```

### Formas y bordes irregulares

```css
/* Tarjeta con efecto "dibujado a mano" */
.sk-card {
  border-radius: 2% 6% 5% 4% / 1% 1% 2% 4%;
}

/* Variante 2 */
.sk-card-alt {
  border-radius: 5% 2% 4% 6% / 2% 4% 1% 3%;
}

/* Botones — esquinas mínimas */
.sk-btn {
  border-radius: 2px 6px 4px 3px / 3px 2px 5px 2px;
}

/* Badges / Stickers — rotación sutil */
.sk-badge {
  transform: rotate(-2deg);
  border-radius: 2px;
}
.sk-badge-alt {
  transform: rotate(1.5deg);
}
```

### Borde cosido (Stitched Border)

```css
/* Simula parche de tela — borde punteado interior */
.sk-stitched {
  position: relative;
  border: var(--border-width) solid var(--color-ink);
}
.sk-stitched::before {
  content: '';
  position: absolute;
  inset: 6px;
  border: 2px dashed rgba(26, 26, 26, 0.4);
  border-radius: inherit;
  pointer-events: none;
}
```

### Highlight de marcador (Marker Highlight)

```css
/* Resaltado que queda por debajo del texto */
.sk-highlight {
  background: linear-gradient(
    to bottom,
    transparent 40%,
    var(--color-marker) 40%,
    var(--color-marker) 100%
  );
  display: inline;
  padding: 0 4px;
}

/* Variante teal */
.sk-highlight-teal {
  background: linear-gradient(
    to bottom,
    transparent 40%,
    rgba(45, 125, 154, 0.35) 40%
  );
}
```

---

## Uso de los SVGs proporcionados

Los archivos SVG son **ilustraciones de amigurumis/personajes** en formato de máscara sobre fondo blanco. Se usan como:

| Archivo | Descripción | Uso en el diseño |
|---|---|---|
| `9.svg`, `10.svg`, `11.svg` | Fondos de collage con amigurumi grande | Sección hero — imagen principal rotada |
| `12.svg`, `13.svg` | Amigurumis con perspectiva diagonal | Cards de catálogo — imagen del producto |
| `14.svg` | Silueta de amigurumi minimalista | Decoración de sección "Proceso" |
| `15.svg` | Ilustración vertical de amigurumi completo | Sección "¿Quieres algo radical?" — mascota |

### Cómo integrarlos en HTML

```html
<!-- Opción A: img con rotación y borde ink -->
<img
  src="assets/svgs/9.svg"
  alt="Amigurumi Konarumis"
  class="sk-product-img"
  style="transform: rotate(-3deg);"
>

<!-- Opción B: como fondo decorativo de sección -->
<div class="sk-hero-deco" aria-hidden="true">
  <img src="assets/svgs/15.svg" alt="">
</div>
```

```css
/* Imagen de producto con borde ink y rotación */
.sk-product-img {
  width: 100%;
  max-width: 320px;
  border: var(--border-width) solid var(--color-ink);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-ink);
  border-radius: 2% 6% 5% 4% / 1% 1% 2% 4%;
  /* Filtro: ligeramente desaturado en reposo */
  filter: grayscale(20%);
  transition: filter 0.25s ease, transform 0.2s ease;
}
.sk-product-img:hover {
  filter: grayscale(0%);
  transform: rotate(0deg) scale(1.02);
}

/* Decoración de fondo — amigurumi grande semitransparente */
.sk-hero-deco img {
  opacity: 0.08;
  position: absolute;
  right: -5%;
  top: -10%;
  width: 55%;
  pointer-events: none;
}
```

---

## Estructura HTML completa del sitio

### `index.html` — Esqueleto base

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Konarumis — Arte & Diversión · Cusco</title>
  <meta name="description" content="Amigurumis con actitud: anime, horror y personajes únicos tejidos a mano en Cusco, Perú.">

  <!-- Fuentes -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Literata:ital,wght@0,400;0,600;1,400&display=swap">

  <!-- Iconos Material Symbols con peso 700 -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,700,0,0">

  <!-- Estilos -->
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <!-- HEADER -->
  <header class="sk-header" id="main-header">
    <!-- ver sección Header -->
  </header>

  <!-- HERO -->
  <section class="sk-hero" id="inicio">
    <!-- ver sección Hero -->
  </section>

  <!-- CATÁLOGO -->
  <section class="sk-catalog" id="catalogo">
    <!-- ver sección Catálogo -->
  </section>

  <!-- CTA PERSONALIZADO -->
  <section class="sk-cta-radical" id="proceso">
    <!-- ver sección CTA -->
  </section>

  <!-- PROCESO -->
  <section class="sk-process" id="como-hacemos">
    <!-- ver sección Proceso -->
  </section>

  <!-- FOOTER -->
  <footer class="sk-footer">
    <!-- ver sección Footer -->
  </footer>

  <!-- WhatsApp FAB -->
  <a href="https://wa.me/51922330331?text=Hola+Konarumis%2C+quiero+hacer+un+pedido"
     class="sk-wa-fab" target="_blank" rel="noopener" aria-label="Chatear por WhatsApp">
    <span class="material-symbols-outlined">chat</span>
  </a>

  <script src="script.js"></script>
</body>
</html>
```

---

## Secciones — HTML + CSS

### 1. Header / Navegación

```html
<header class="sk-header" id="main-header">
  <div class="sk-container sk-nav-wrap">

    <!-- Logo -->
    <a href="#" class="sk-logo" aria-label="Konarumis Home">
      <img src="images/logo.png" alt="Konarumis" class="sk-logo-img">
      <span class="sk-logo-wordmark">KONARUMIS</span>
    </a>

    <!-- Nav desktop -->
    <nav aria-label="Navegación principal">
      <ul class="sk-nav-links">
        <li><a href="#inicio"    class="sk-nav-link">Inicio</a></li>
        <li><a href="#catalogo" class="sk-nav-link">Catálogo</a></li>
        <li><a href="#como-hacemos" class="sk-nav-link">Proceso</a></li>
        <li><a href="#contacto" class="sk-nav-link">Contacto</a></li>
      </ul>
    </nav>

    <!-- CTA + hamburger -->
    <div class="sk-nav-cta">
      <a href="https://wa.me/51922330331" target="_blank" class="sk-btn sk-btn-teal">
        <span class="material-symbols-outlined">chat</span>
        Escribir
      </a>
      <button class="sk-hamburger" id="sk-hamburger" aria-label="Menú">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>
```

```css
/* ===== HEADER ===== */
.sk-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-paper);
  border-bottom: var(--border-width) solid var(--color-ink);
  padding: 12px 0;
}

.sk-nav-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.sk-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.sk-logo-img {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-ink);
  border-radius: 4px;
}

.sk-logo-wordmark {
  font-family: var(--font-headline);
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--color-ink);
  letter-spacing: 0.05em;
}

.sk-nav-links {
  display: flex;
  list-style: none;
  gap: 8px;
  margin: 0;
  padding: 0;
}

.sk-nav-link {
  font-family: var(--font-headline);
  font-weight: 700;
  font-size: var(--text-label);
  text-decoration: none;
  color: var(--color-ink);
  padding: 6px 12px;
  letter-spacing: 0.04em;
  position: relative;
}

/* Subrayado ink al hover */
.sk-nav-link::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 12px;
  right: 12px;
  height: 3px;
  background: var(--color-ink);
  transform: scaleX(0);
  transition: transform 0.2s ease;
}
.sk-nav-link:hover::after,
.sk-nav-link.active::after {
  transform: scaleX(1);
}

/* Hamburger */
.sk-hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
}
.sk-hamburger span {
  display: block;
  width: 24px;
  height: 3px;
  background: var(--color-ink);
  border-radius: 1px;
}

@media (max-width: 768px) {
  .sk-nav-links { display: none; }
  .sk-hamburger { display: flex; }
}
```

---

### 2. Hero

```html
<section class="sk-hero" id="inicio">
  <div class="sk-container sk-hero-inner">

    <!-- Columna texto -->
    <div class="sk-hero-text">

      <!-- Badge / sticker -->
      <div class="sk-badge sk-badge-teal">ESTILO KONARUMIS</div>

      <!-- Headline con highlight -->
      <h1 class="sk-hero-headline">
        Amigurumis<br>
        con <span class="sk-highlight">Actitud</span> y<br>
        Estilo Propio.
      </h1>

      <p class="sk-hero-body">
        No son solo juguetes. Son piezas de arte tejidas con<br>
        técnica de Cusco y vibras de sketchbook. Anime,<br>
        música y crochet en un solo lugar.
      </p>

      <div class="sk-hero-actions">
        <a href="#catalogo" class="sk-btn sk-btn-teal sk-level-1">
          EXPLORAR ARTE
        </a>
        <a href="#como-hacemos" class="sk-btn sk-btn-outline">
          MI MUNDO
        </a>
      </div>
    </div>

    <!-- Columna imagen — usar svg 9 o 10 -->
    <div class="sk-hero-visual">

      <!-- SVG 9 / 10 — imagen principal del amigurumi -->
      <div class="sk-hero-img-wrap sk-level-2 sk-stitched">
        <img src="assets/svgs/9.svg" alt="Amigurumi Konarumis hero" class="sk-hero-img">

        <!-- Badge "Cusco Punk" superpuesto -->
        <div class="sk-badge sk-badge-orange sk-hero-badge">CUSCO · PUNK</div>
      </div>

      <!-- Pantalla de "app" decorativa detrás — SVG 10 o imagen captura -->
      <div class="sk-hero-app-preview sk-level-1">
        <img src="assets/svgs/10.svg" alt="" aria-hidden="true">
      </div>

      <!-- Rayo decorativo SVG inline -->
      <svg class="sk-hero-bolt" viewBox="0 0 24 40" fill="none" aria-hidden="true">
        <path d="M13 2L2 22h9l-4 16 15-22h-9L13 2z"
              fill="var(--color-orange)" stroke="var(--color-ink)" stroke-width="2"/>
      </svg>
    </div>

  </div>
</section>
```

```css
/* ===== HERO ===== */
.sk-hero {
  background: var(--color-paper);
  padding: 64px 0 80px;
  overflow: hidden;
  position: relative;
}

.sk-hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

/* Texto */
.sk-hero-headline {
  font-family: var(--font-headline);
  font-size: var(--text-display);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-ink);
  margin: 16px 0 24px;
}

.sk-hero-body {
  font-family: var(--font-body);
  font-size: var(--text-body-lg);
  font-weight: 600;
  line-height: 1.6;
  color: var(--color-ink-variant);
  margin-bottom: 32px;
}

.sk-hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

/* Imagen hero */
.sk-hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
}

.sk-hero-img-wrap {
  position: relative;
  width: 100%;
  max-width: 380px;
  background: white;
  padding: 12px;
  transform: rotate(-1deg);
}

.sk-hero-img {
  width: 100%;
  height: auto;
  display: block;
}

.sk-hero-badge {
  position: absolute;
  bottom: -14px;
  right: -14px;
}

.sk-hero-app-preview {
  position: absolute;
  bottom: -20px;
  right: -30px;
  width: 200px;
  background: white;
  padding: 8px;
  transform: rotate(2deg);
  z-index: -1;
}

.sk-hero-bolt {
  position: absolute;
  top: 20px;
  right: -20px;
  width: 32px;
  height: 56px;
}

@media (max-width: 768px) {
  .sk-hero-inner {
    grid-template-columns: 1fr;
  }
  .sk-hero-visual {
    order: -1;
  }
  .sk-hero-app-preview {
    display: none;
  }
}
```

---

### 3. Catálogo de productos

```html
<section class="sk-catalog" id="catalogo">
  <div class="sk-container">

    <!-- Header de sección -->
    <div class="sk-section-header">
      <span class="sk-section-label">CATÁLOGO DE PIEZAS</span>
      <p class="sk-section-sub">
        Coleccionables únicos con vibras de anime y técnica artesanal. Cero aburrimiento.
      </p>

      <!-- Filtros -->
      <div class="sk-filters" role="group" aria-label="Filtrar por categoría">
        <button class="sk-filter-btn active" data-filter="all">Todo</button>
        <button class="sk-filter-btn" data-filter="personalizado">Personalizado</button>
        <button class="sk-filter-btn" data-filter="anime">Anime</button>
        <button class="sk-filter-btn" data-filter="horror">Horror</button>
      </div>
    </div>

    <!-- Grid de productos — 4 columnas desktop -->
    <div class="sk-product-grid" id="sk-product-grid">

      <!-- Card de producto -->
      <article class="sk-product-card sk-level-1 sk-stitched" data-category="anime">

        <!-- Badge de categoría -->
        <div class="sk-badge sk-badge-orange sk-card-badge">EPIC</div>

        <!-- Imagen — usar svg 12 o 13 -->
        <div class="sk-card-img-wrap">
          <img src="assets/svgs/12.svg" alt="Monkey D. Luffy Amigurumi" class="sk-card-img">
        </div>

        <!-- Info -->
        <div class="sk-card-body">
          <h3 class="sk-card-name">LUFFY</h3>
          <p class="sk-card-desc">El futuro Rey de los Piratas, tejido punto a punto.</p>
          <div class="sk-card-footer">
            <span class="sk-price">S/. 32</span>
            <a href="https://wa.me/51922330331?text=Quiero+el+Luffy"
               class="sk-btn sk-btn-ink sk-card-btn" target="_blank">
              ARTE &amp;<br>DIVERSIÓN
            </a>
          </div>
        </div>

      </article>

      <!-- Más cards con svgs 13, 14, 15... -->

    </div>
  </div>
</section>
```

```css
/* ===== CATÁLOGO ===== */
.sk-catalog {
  padding: 80px 0;
  background: var(--color-paper);
}

.sk-section-header {
  margin-bottom: 40px;
}

.sk-section-label {
  font-family: var(--font-headline);
  font-size: var(--text-label);
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--color-teal);
  display: block;
  margin-bottom: 8px;
}

.sk-section-sub {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--color-ink-variant);
  max-width: 480px;
  margin-bottom: 24px;
}

/* Filtros */
.sk-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sk-filter-btn {
  font-family: var(--font-headline);
  font-weight: 800;
  font-size: var(--text-label);
  letter-spacing: 0.06em;
  padding: 8px 20px;
  border: var(--border-width) solid var(--color-ink);
  background: transparent;
  cursor: pointer;
  border-radius: 2px 6px 4px 3px / 3px 2px 5px 2px;
  transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 3px 3px 0 var(--color-ink);
}

.sk-filter-btn.active,
.sk-filter-btn:hover {
  background: var(--color-teal);
  color: white;
}

.sk-filter-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

/* Grid productos */
.sk-product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .sk-product-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .sk-product-grid { grid-template-columns: 1fr; }
}

/* Card de producto */
.sk-product-card {
  background: white;
  border-radius: 2% 6% 5% 4% / 1% 1% 2% 4%;
  overflow: visible;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.sk-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 10px 10px 0 var(--color-ink);
}

.sk-card-badge {
  position: absolute;
  top: -12px;
  left: 12px;
  z-index: 1;
}

.sk-card-img-wrap {
  overflow: hidden;
  border-bottom: var(--border-width) solid var(--color-ink);
  background: var(--color-surface);
}

.sk-card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  /* Desaturado en reposo, color en hover */
  filter: grayscale(20%);
  transition: filter 0.25s ease, transform 0.25s ease;
}

.sk-product-card:hover .sk-card-img {
  filter: grayscale(0%);
  transform: scale(1.04);
}

.sk-card-body {
  padding: 16px;
}

.sk-card-name {
  font-family: var(--font-headline);
  font-weight: 800;
  font-size: 1.125rem;
  letter-spacing: 0.04em;
  color: var(--color-ink);
  margin: 0 0 4px;
}

.sk-card-desc {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-ink-variant);
  line-height: 1.5;
  margin: 0 0 12px;
}

.sk-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.sk-price {
  font-family: var(--font-headline);
  font-weight: 900;
  font-size: var(--text-price);
  color: var(--color-teal-dark);
}

.sk-card-btn {
  font-size: 0.7rem;
  line-height: 1.2;
  text-align: center;
  padding: 8px 12px;
}
```

---

### 4. Sección CTA "¿Quieres algo radical?"

```html
<section class="sk-cta-radical sk-level-2 sk-stitched" id="personalizado">
  <div class="sk-container sk-cta-inner">

    <!-- Mascota — SVG 15 -->
    <div class="sk-cta-mascot">
      <div class="sk-badge sk-badge-teal sk-cta-mascot-badge">MEOW-PUNK</div>
      <div class="sk-cta-mascot-img-wrap sk-level-1">
        <img src="assets/svgs/15.svg" alt="Mascota Konarumis punk">
      </div>
    </div>

    <!-- Texto -->
    <div class="sk-cta-text">
      <h2 class="sk-cta-headline">¿QUIERES ALGO <span class="sk-highlight">RADICAL?</span></h2>
      <p class="sk-cta-body">
        Hacemos realidad tus diseños de anime, bandas o lo que sea. Mándanos tu
        idea y la tejemos con todo el estilo.
      </p>
      <a href="https://wa.me/51922330331?text=Quiero+cotizar+mi+idea"
         class="sk-btn sk-btn-outline sk-level-1" target="_blank">
        COTIZAR MI IDEA
      </a>
    </div>

  </div>
</section>
```

```css
/* ===== CTA RADICAL ===== */
.sk-cta-radical {
  background: var(--color-teal);
  margin: 0 24px;
  border-radius: 4px 8px 6px 5px / 3px 5px 4px 6px;
}

.sk-cta-inner {
  display: flex;
  align-items: center;
  gap: 48px;
  padding: 40px 0;
}

.sk-cta-mascot {
  position: relative;
  flex-shrink: 0;
}

.sk-cta-mascot-badge {
  position: absolute;
  top: -14px;
  left: 8px;
  background: var(--color-orange);
  color: white;
}

.sk-cta-mascot-img-wrap {
  width: 160px;
  height: 160px;
  background: white;
  padding: 12px;
  border-radius: 4px;
  transform: rotate(-2deg);
}

.sk-cta-mascot-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sk-cta-headline {
  font-family: var(--font-headline);
  font-size: var(--text-h1);
  font-weight: 800;
  color: white;
  margin: 0 0 16px;
  letter-spacing: -0.01em;
}

.sk-cta-body {
  font-family: var(--font-body);
  color: rgba(255,255,255,0.9);
  font-size: var(--text-body-lg);
  line-height: 1.6;
  margin-bottom: 28px;
}

.sk-btn-outline {
  background: transparent;
  color: white;
  border-color: white;
  box-shadow: 6px 6px 0 rgba(255,255,255,0.35);
}
.sk-btn-outline:hover {
  background: white;
  color: var(--color-teal);
}

@media (max-width: 768px) {
  .sk-cta-inner {
    flex-direction: column;
    text-align: center;
  }
}
```

---

### 5. Sección Proceso (¿Cómo se hace la magia?)

```html
<!-- Fondo con textura de boceto — SVG 14 como watermark -->
<section class="sk-process" id="como-hacemos">

  <!-- Fondo decorativo -->
  <div class="sk-process-bg" aria-hidden="true">
    <img src="assets/svgs/14.svg" alt="">
  </div>

  <div class="sk-container">
    <h2 class="sk-process-title">¿CÓMO SE HACE <span class="sk-highlight">LA MAGIA</span>?</h2>

    <div class="sk-process-steps">

      <!-- Paso 1 — SKETCH -->
      <div class="sk-process-step sk-level-1 sk-stitched">
        <div class="sk-step-icon sk-step-icon-teal">
          <span class="material-symbols-outlined">draw</span>
        </div>
        <h3 class="sk-step-title">1. SKETCH</h3>
        <p class="sk-step-body">
          Dibujamos el concepto con hilo de algodón top y definimos la paleta de colores pro.
        </p>
      </div>

      <!-- Paso 2 — REMIX -->
      <div class="sk-process-step sk-level-1 sk-stitched">
        <div class="sk-step-icon sk-step-icon-teal">
          <span class="material-symbols-outlined">search</span>
        </div>
        <h3 class="sk-step-title">2. REMIX</h3>
        <p class="sk-step-body">
          Tejemos cada punto con hilo de algodón top, crochet, es arte con actitud.
        </p>
      </div>

      <!-- Paso 3 — DROP -->
      <div class="sk-process-step sk-level-1 sk-stitched">
        <div class="sk-step-icon sk-step-icon-orange">
          <span class="material-symbols-outlined">bolt</span>
        </div>
        <h3 class="sk-step-title">3. DROP</h3>
        <p class="sk-step-body">
          Detalles finales, empaque sketchbook y listo para tu colección.
        </p>
      </div>

    </div>
  </div>
</section>
```

```css
/* ===== PROCESO ===== */
.sk-process {
  position: relative;
  padding: 100px 0;
  background: var(--color-surface);
  border-top: var(--border-width) solid var(--color-ink);
  border-bottom: var(--border-width) solid var(--color-ink);
  overflow: hidden;
}

.sk-process-bg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.sk-process-bg img {
  width: 120%;
  max-width: 900px;
  opacity: 0.06;
  transform: rotate(-5deg);
}

.sk-process-title {
  font-family: var(--font-headline);
  font-size: var(--text-h1);
  font-weight: 800;
  text-align: center;
  color: white;  /* sobre el fondo de textura oscura */
  margin-bottom: 48px;
  position: relative;
}

.sk-process-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  position: relative;
}

.sk-process-step {
  background: var(--color-paper);
  padding: 32px 24px;
  border-radius: 4px 8px 6px 5px / 3px 5px 4px 6px;
  text-align: center;
  transform: rotate(-1deg);
}
.sk-process-step:nth-child(2) { transform: rotate(0.5deg); }
.sk-process-step:nth-child(3) { transform: rotate(-0.8deg); }

.sk-step-icon {
  width: 56px;
  height: 56px;
  border: var(--border-width) solid var(--color-ink);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.sk-step-icon-teal  { background: var(--color-teal); color: white; }
.sk-step-icon-orange { background: var(--color-orange); color: white; }

.sk-step-icon .material-symbols-outlined {
  font-size: 28px;
  font-variation-settings: 'wght' 700;
}

.sk-step-title {
  font-family: var(--font-headline);
  font-weight: 800;
  font-size: 1.125rem;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
  color: var(--color-ink);
}

.sk-step-body {
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: 1.6;
  color: var(--color-ink-variant);
}

@media (max-width: 768px) {
  .sk-process-steps { grid-template-columns: 1fr; }
  .sk-process-step, .sk-process-step:nth-child(2),
  .sk-process-step:nth-child(3) { transform: none; }
}
```

---

### 6. Footer

```html
<footer class="sk-footer sk-level-1">
  <div class="sk-container sk-footer-inner">

    <!-- Logo -->
    <div class="sk-footer-brand">
      <span class="sk-footer-logo">KONARUMIS</span>
      <p class="sk-footer-tagline">Cusco. Punk. Crochet. Redefiniendo el arte del amigurumi desde 2026.</p>
    </div>

    <!-- Nav footer -->
    <nav class="sk-footer-nav" aria-label="Redes sociales">
      <a href="https://www.instagram.com/konarumis/" target="_blank" class="sk-footer-link">INSTA</a>
      <a href="#" target="_blank" class="sk-footer-link">FB</a>
      <a href="https://wa.me/51922330331" target="_blank" class="sk-footer-link sk-footer-wa">WA</a>
      <a href="mailto:konarumis@example.com" class="sk-footer-link">MAIL</a>
    </nav>

    <!-- CTA envíos -->
    <div class="sk-footer-shipping">
      <a href="https://wa.me/51922330331?text=Quiero+info+sobre+envíos"
         class="sk-btn sk-btn-ink sk-level-1" target="_blank">
        ENVÍOS A TODO EL PERÚ
      </a>
    </div>

  </div>

  <!-- Copyright -->
  <div class="sk-footer-copy">
    <p>© 2026 Konarumis Studio · Arte &amp; Diversión</p>
  </div>
</footer>
```

```css
/* ===== FOOTER ===== */
.sk-footer {
  background: var(--color-ink);
  color: white;
  padding: 40px 0 0;
  margin-top: 80px;
}

.sk-footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
  padding-bottom: 32px;
}

.sk-footer-logo {
  font-family: var(--font-headline);
  font-weight: 800;
  font-size: 1.5rem;
  letter-spacing: 0.05em;
  color: var(--color-teal);
  display: block;
  margin-bottom: 8px;
}

.sk-footer-tagline {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: rgba(255,255,255,0.7);
  max-width: 260px;
  line-height: 1.5;
}

.sk-footer-nav {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.sk-footer-link {
  font-family: var(--font-headline);
  font-weight: 700;
  font-size: 0.875rem;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  letter-spacing: 0.08em;
  transition: color 0.15s;
}
.sk-footer-link:hover { color: white; }
.sk-footer-wa { color: #25D366; }
.sk-footer-wa:hover { color: #4AE384; }

.sk-footer-copy {
  border-top: 2px solid rgba(255,255,255,0.12);
  padding: 16px 0;
  text-align: center;
}
.sk-footer-copy p {
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: rgba(255,255,255,0.45);
  margin: 0;
}
```

---

### 7. WhatsApp FAB + Botones globales

```css
/* ===== BOTONES GLOBALES ===== */
.sk-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-headline);
  font-weight: 800;
  font-size: var(--text-label);
  letter-spacing: 0.08em;
  text-decoration: none;
  padding: 12px 24px;
  cursor: pointer;
  border: var(--border-width) solid var(--color-ink);
  border-radius: 2px 6px 4px 3px / 3px 2px 5px 2px;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.15s ease;
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--color-ink);
}
.sk-btn:active {
  transform: translate(3px, 3px);
  box-shadow: none;
}

/* Variantes */
.sk-btn-teal   { background: var(--color-teal);   color: white; }
.sk-btn-orange { background: var(--color-orange);  color: white; }
.sk-btn-ink    { background: var(--color-ink);     color: white; border-color: var(--color-ink); }
.sk-btn-paper  { background: var(--color-paper);   color: var(--color-ink); }

.sk-btn-teal:hover   { background: var(--color-teal-dark); }
.sk-btn-orange:hover { background: #c0661a; }

/* ===== BADGES / STICKERS ===== */
.sk-badge {
  display: inline-block;
  font-family: var(--font-headline);
  font-weight: 800;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 10px;
  border: 2px solid var(--color-ink);
  border-radius: 2px;
  transform: rotate(-2deg);
  box-shadow: 2px 2px 0 var(--color-ink);
}
.sk-badge-teal   { background: var(--color-teal);   color: white; }
.sk-badge-orange { background: var(--color-orange);  color: white; }
.sk-badge-paper  { background: var(--color-paper);   color: var(--color-ink); }
.sk-badge-alt    { transform: rotate(1.5deg); }

/* ===== WHATSAPP FAB ===== */
.sk-wa-fab {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 56px;
  height: 56px;
  background: #25D366;
  border: var(--border-width) solid var(--color-ink);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 5px 5px 0 var(--color-ink);
  text-decoration: none;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  z-index: 200;
}
.sk-wa-fab .material-symbols-outlined {
  color: white;
  font-size: 28px;
  font-variation-settings: 'wght' 700;
}
.sk-wa-fab:active {
  transform: translate(3px, 3px);
  box-shadow: none;
}

/* ===== LAYOUT BASE ===== */
.sk-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .sk-container { padding: 0 16px; }
}

*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}
```

---

## JavaScript — Funcionalidades existentes adaptadas

```javascript
// script.js — Sketchbook Punk Konarumis

// ===== FILTRO DE CATÁLOGO =====
function initCatalogFilter() {
  const filterBtns = document.querySelectorAll('.sk-filter-btn');
  const products   = document.querySelectorAll('.sk-product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Estado activo
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      products.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.animation = 'sk-fade-in 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ===== HAMBURGER MOBILE =====
function initHamburger() {
  const btn = document.getElementById('sk-hamburger');
  const nav = document.querySelector('.sk-nav-links');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.style.display === 'flex';
    nav.style.display = open ? '' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.top = '100%';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.background = 'var(--color-paper)';
    nav.style.borderBottom = '4px solid var(--color-ink)';
    nav.style.padding = '16px 24px';
    btn.setAttribute('aria-expanded', !open);
  });
}

// ===== HEADER STICKY CON BORDE =====
function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle('sk-header-scrolled', !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
  );

  const sentinel = document.createElement('div');
  sentinel.style.height = '1px';
  document.body.prepend(sentinel);
  observer.observe(sentinel);
}

// ===== MICROINTERACCIÓN: CARDS WIGGLE =====
function initCardWiggle() {
  document.querySelectorAll('.sk-product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease';
    });
  });
}

// ===== ANIMACIÓN KEYFRAME DE ENTRADA =====
const style = document.createElement('style');
style.textContent = `
  @keyframes sk-fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sk-header-scrolled {
    box-shadow: 0 4px 0 var(--color-ink);
  }
`;
document.head.appendChild(style);

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', () => {
  initCatalogFilter();
  initHamburger();
  initStickyHeader();
  initCardWiggle();
});
```

---

## Checklist de implementación

### Paso 1 — Configuración (30 min)
- [ ] Crear estructura de carpetas: `assets/svgs/`, `images/`, `styles.css`, `script.js`
- [ ] Copiar los 7 SVGs a `assets/svgs/` con nombres: `hero-1.svg` → `9.svg`, etc.
- [ ] Agregar variables CSS (`:root`) al inicio de `styles.css`
- [ ] Importar fuentes en `<head>`

### Paso 2 — Layout base (1h)
- [ ] Implementar reset CSS + `.sk-container`
- [ ] Implementar clases de botones `.sk-btn` y variantes
- [ ] Implementar `.sk-badge` (stickers)
- [ ] Implementar `.sk-level-1` y `.sk-level-2` (sombras)
- [ ] Implementar `.sk-stitched` (borde cosido)
- [ ] Implementar `.sk-highlight` (marcador)

### Paso 3 — Secciones (2h)
- [ ] Header con navegación sticky
- [ ] Hero con SVG 9/10 e imagen rotada
- [ ] Catálogo con grid 4 columnas + SVGs 12/13/14
- [ ] CTA "¿Quieres algo radical?" con SVG 15
- [ ] Proceso con SVG 14 como fondo
- [ ] Footer con links sociales y WhatsApp

### Paso 4 — JavaScript (45 min)
- [ ] Filtro de catálogo por categoría
- [ ] Menú hamburger mobile
- [ ] Header sticky con sombra al hacer scroll
- [ ] Animación de entrada para cards filtradas
- [ ] Carrito existente — mantener funcionalidad, restylear el drawer

### Paso 5 — Responsive + detalles (1h)
- [ ] Breakpoint 768px: nav colapsa, hero en columna, grid 2 col
- [ ] Breakpoint 480px: grid 1 col
- [ ] Verificar que los SVGs se muestran correctamente en mobile
- [ ] Probar FAB de WhatsApp en touch
- [ ] Verificar contraste de colores (blanco sobre teal: ✅, ink sobre paper: ✅)
- [ ] Verificar aria-labels en botones y SVGs decorativos

---

## Notas de mantenimiento

**Agregar un producto al catálogo:**
Copiar el bloque `<article class="sk-product-card">` y cambiar:
- `data-category="anime"` → `"horror"` / `"personalizado"`
- `src` de la imagen → SVG o imagen JPG del producto
- Texto del nombre, descripción y precio
- URL de WhatsApp con el nombre del producto en el texto

**Cambiar los SVGs de decoración:**
Los SVGs 9-15 son intercambiables. Si se añaden nuevas ilustraciones de amigurumis en el mismo formato, simplemente reemplazar la referencia en `src` sin tocar el CSS.

---

*Documento generado para Konarumis · Rediseño Sketchbook Punk · 2026*  
*Recursos: DESIGN.md · SVGs 9-15 · index.html + styles.css existentes*
