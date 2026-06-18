---
name: Artisanal Crochet System
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#434840'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#73796f'
  outline-variant: '#c3c8bd'
  surface-tint: '#496640'
  primary: '#334f2b'
  on-primary: '#ffffff'
  primary-container: '#4a6741'
  on-primary-container: '#c2e4b4'
  inverse-primary: '#afd0a1'
  secondary: '#5f5e58'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2da'
  on-secondary-container: '#65645e'
  tertiary: '#4b483c'
  on-tertiary: '#ffffff'
  tertiary-container: '#645f52'
  on-tertiary-container: '#e1dac9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#caecbc'
  primary-fixed-dim: '#afd0a1'
  on-primary-fixed: '#062104'
  on-primary-fixed-variant: '#324e2a'
  secondary-fixed: '#e5e2da'
  secondary-fixed-dim: '#c9c6bf'
  on-secondary-fixed: '#1c1c17'
  on-secondary-fixed-variant: '#474741'
  tertiary-fixed: '#e9e2d2'
  tertiary-fixed-dim: '#cdc6b6'
  on-tertiary-fixed: '#1e1b12'
  on-tertiary-fixed-variant: '#4a473b'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-lg:
    fontFamily: Source Serif 4
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Source Serif 4
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Source Serif 4
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The brand personality is artisanal, warm, and professional, reflecting the intricate craftsmanship of handmade amigurumi. It targets a discerning audience that appreciates the slow-made movement and the whimsical nature of crochet art.

The design style is a blend of **Minimalism** and **Modern Corporate**, utilizing heavy white space and a restricted earth-toned palette to allow the colorful textures of the products to stand out. It avoids clutter, favoring clean lines and soft edges to evoke a sense of comfort and quality. The interface should feel like a high-end boutique catalog: calm, organized, and inviting.

## Colors

The palette is rooted in nature and raw materials. 
- **Primary (Moss Green):** Used for key actions, brand accents, and active states. It represents the "organic" nature of the craft.
- **Secondary (Cream/Beige):** Serves as the primary surface color. It is warmer and softer than pure white, providing a "canvas" feel.
- **Tertiary (Sand):** Used for subtle borders, disabled states, or secondary backgrounds to provide depth without introducing high contrast.
- **Neutral (Black/Off-black):** Reserved for high-legibility typography and crisp iconography.

The default mode is light, emphasizing the airy and clean aesthetic required for a professional handmade brand.

## Typography

This system employs a sophisticated pairing of a modern sans-serif and a literary serif to balance "professional" and "handcrafted."

- **Headlines:** Use **Hanken Grotesk**. Its clean, sharp geometry provides a modern structural anchor to the layout.
- **Body:** Use **Source Serif 4**. The serif details evoke a sense of tradition and tactile quality, making long descriptions of amigurumi pieces easy and enjoyable to read.
- **Labels:** Small labels and buttons use uppercase Hanken Grotesk with increased letter spacing to create a distinctive, boutique-like functional style.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to maintain the boutique catalog feel, centering the content with generous outer margins. 

- **Desktop:** 12-column grid, 1200px max-width, 24px gutters.
- **Tablet:** 8-column grid, fluid width, 24px margins.
- **Mobile:** 4-column grid, fluid width, 16px margins.

Spacing is based on an 8px base unit. Generous padding (32px+) should be used inside cards and sections to prevent the UI from feeling cramped, ensuring the "minimalist" brand promise is kept.

## Elevation & Depth

To maintain an artisanal feel, this system avoids heavy, dark shadows. Instead, it uses **Ambient Shadows** and **Tonal Layers**.

- **Surface Levels:** The primary background is the Secondary Cream. Secondary containers (like cards) can use pure white or a slightly lighter cream to lift them off the page.
- **Shadow Style:** Shadows are extremely diffused (e.g., 20px - 40px blur) with very low opacity (5-8%) and a slight tint of the Primary Moss Green to make them feel integrated into the environment.
- **Interactions:** On hover, cards should subtly lift by increasing the shadow spread and slightly shifting the element upwards (2-4px).

## Shapes

The shape language is friendly and approachable, mimicking the soft, rounded nature of amigurumi toys.

- **Standard Elements:** Buttons and input fields use a `0.5rem` radius.
- **Featured Cards:** Use `rounded-xl` (1.5rem) to emphasize the "softness" of the brand.
- **Product Imagery:** Should always feature rounded corners to match the UI components, reinforcing the cohesive, gentle aesthetic.

## Components

### Buttons
Primary buttons are solid Moss Green with white Hanken Grotesk text. Secondary buttons use a Moss Green outline with a transparent background. All buttons have a 0.5rem corner radius and high-legibility label styling.

### Cards
Product cards are the core of the system. They feature a pure white or very light cream background, a `rounded-xl` corner radius, and the signature soft ambient shadow. Product names are set in Hanken Grotesk, while prices and descriptions use Source Serif 4.

### Inputs & Forms
Input fields use a subtle Sand (#D9D2C2) border and a 0.5rem radius. Focus states are indicated by a 2px Moss Green border.

### Chips & Tags
Used for product categories (e.g., "Cotton," "Small," "New"). These are small, pill-shaped elements with a Sand background and dark grey text to remain unobtrusive.

### Lists
Lists should have generous vertical spacing (12px+) and use thin Sand-colored dividers to maintain a light, organized appearance.