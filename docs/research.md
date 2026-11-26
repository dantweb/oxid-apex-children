# Research: popular modern Bootstrap shop themes (2026-11-26)

Goal: base three APEX child themes on what current top-selling Bootstrap e-commerce themes do for three
verticals. Theme names and sales figures were checked on live ThemeForest pages. Hex values and font pairings
are derived from the shared patterns, not copied from any theme's CSS. themes.getbootstrap.com now shows a
"Sunsetting Bootstrap Themes" notice and was not used.

## Market check

- **Cartzilla v3**: about 2,750 sales on the Bootstrap marketplace; Bootstrap 5.3.3, light and dark modes. The ThemeForest
  relaunch (updated Jan 2026) has Electronics, two Fashion, Furniture, Grocery, Marketplace and Single-product demos.
  https://themeforest.net/item/cartzilla-multipurpose-ecommerce-html-template/59622257
- **Ecomus**: Bootstrap HTML template, about 1–1.7K sales, 48+ home pages. https://themeforest.net/item/ecomus-ultimate-html5-template/53417990
- **Molla**: about 1.3K sales, last updated in 2021, but its fashion and electronics demos are still the reference look.
  https://themeforest.net/item/molla-ecommerce-html5-template/25119280
- **RedParts** (auto parts): about 1.1K HTML sales, plus React and Angular versions; Bootstrap 4.x, so used as a design reference only.
  https://themeforest.net/search/redparts
- Auto parts generally: the active sellers are WooCommerce themes (Bumbleb, Autozpro, Karpart). On Shopify, vehicle
  search (year/make/model) comes from apps, not themes (e.g. Spark Fitment), so we built it as a theme feature.
- **Luxury fashion**: Shopify **Prestige** is the usual luxury pick; Laramiss and Lume are
  Bootstrap/HTML references. https://themes.shopify.com/themes/prestige/styles/allure

## Trends 2025–26

- Colors through CSS variables, light and dark modes, sticky headers that shrink, off-canvas cart and menu, a bottom bar on mobile.
- Corner radii of 12–24px and borderless surfaces with soft shadows; the exception is the hard-edged industrial look for auto parts.
- Pill-shaped badges, category rows that scroll sideways, hover image swap, fonts installed locally from @fontsource.

## Vertical briefs → what we used

### Auto parts → `apex-child-1`
- Palette: red `#D7182A` (hover `#B01020`), black `#111111`, carbon `#1E1F22`, surface `#F4F4F5`,
  border `#E4E4E7`, muted text `#6B7280`, "fits your car" green `#16A34A`.
- Type: Barlow Condensed 600/700 uppercase for headings, Barlow 400/600 for body.
- Header: dark top bar (USPs, hotline, language/currency), white bar with wide search, red category bar.
- Home: hero → **vehicle finder** → trust strip → category tiles → deals → bestsellers → new → brands.
- Cards: radius 0–2px, 1px border, red border and shadow on hover, bold price.
- Buttons: 2px radius, uppercase, 700, letter-spacing .04em, solid red.
- Footer: black with a red rule at the top.

### Electronics → `apex-child-2`
- Palette: blue `#2563EB` (hover `#1D4ED8`, tint `#EFF4FF`), violet `#6D28D9`, deal `#F43F5E`,
  ink `#0F172A`, surface `#F3F5F9`, border `#E2E8F0`, navy `#0B1120`.
- Type: Inter for body; Space Grotesk 700 for headings with tight tracking (-.02em); tabular numbers for prices.
- Header: sticky, central pill-shaped search, round icon buttons with count bubbles, category row of pill links.
- Home: rounded hero → round category icons → deals with badge → new → bestsellers → feature cards → brands.
- Cards: radius 16px, no border, lift of 4px and soft shadow on hover.
- Footer: dark navy.

### Luxury fashion → `apex-child-3`
- Palette: ink `#111111`, ivory `#FAF8F5`, beige `#EFE9E1`, taupe `#8A7F72`, gold `#B08D57`,
  hairline `#E6E0D8`, sale `#8B2E2E`.
- Type: Cormorant Garamond 500 for display (plus italic), Jost 300/400/500 for body; navigation 11–12px uppercase
  with letter-spacing .18–.22em.
- Header: slim announcement bar, centered logo, search left and icons right, centered navigation.
- Home: full-bleed hero → 3 collection tiles without gaps → new in → editorial split → bestsellers → values → sale → designers.
- Cards: radius 0, no border or shadow, 3:4 image (the second image appears on hover, from apex), small uppercase name, light price.
- Buttons and forms: square, uppercase, letter-spacing .16em; inputs with only a bottom border.
- Footer: beige, airy.

## Not done in this first pass (candidates for later)

- Dark mode (`data-bs-theme`) for Voltage.
- Mega menu with product images (Voltage) and an editorial image tile (Atelier).
- Countdown timer for deals, spec badges from article attributes, fitment badge from vehicle data (Redline).
- Transparent header over the hero (Atelier).
