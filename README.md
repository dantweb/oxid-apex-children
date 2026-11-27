# APEX child themes

Three child themes of the OXID **APEX** theme (Bootstrap 5, Twig, apex 3.0.x / OXID 7.4). They differ from apex,
and from each other, in **layout and colors**. All apex templates, JS and settings still apply; each child
overrides only its header, its start page and a few new partials.

| Theme id | For | Look | Layout differences |
|---|---|---|---|
| `apex-child-1` | Auto spare parts & accessories (the current EE demo data: rims, tyres, vehicles) | Red `#D7182A` / black `#111` / white, Barlow Condensed uppercase headings, 2px corners | Black meta bar with parts hotline, wide search with red button, **full-width red category bar**, start page: hero → **vehicle finder** (make / model / year / part → shop search) → trust strip → part-group tiles → deals → bestsellers → new arrivals → brands. Bordered product cards, red border on hover. |
| `apex-child-2` | Modern electronics (mall demo data: electronics shop) | Electric blue `#2563EB` on cool grey `#F3F5F9`, Inter + Space Grotesk, 12–16px radii | **Sticky header**, gradient announcement bar, pill search, round icon buttons, pill category row; start page: rounded hero → **round category icon strip** → **deals panel** with badge → new arrivals → bestsellers → feature cards → brands. Cards lift on hover. Navy footer with rounded top. |
| `apex-child-3` | Luxury fashion & apparel (mall demo data: fashion shop) | Ivory `#FAF8F5`, ink `#111`, gold `#B08D57`, Cormorant Garamond + Jost, no radii | **Centered logo**, search left / icons right, centered letter-spaced nav; start page: hero → **3 full-bleed portrait collection tiles** → new in → **editorial story section** → bestsellers → values strip → sale → designers. Borderless 3:4 product cards, underline-only form fields, beige footer. |

The research behind these choices is in [docs/research.md](docs/research.md).

## Screenshots

Each theme has a screenshot gallery per device — `docs/screenshots/index.html` with sections (anchors)
`#laptop` (1440 × 900), `#mobile-v` (phone portrait), `#mobile-h` (phone landscape) and `#mobile-folded-v`
(foldable, folded, portrait): start page (full length), category page, product page, one-page checkout modal.

| Theme | Gallery |
|---|---|
| `apex-child-1` · Redline | [apex-child-1/docs/screenshots/index.html](apex-child-1/docs/screenshots/index.html) |
| `apex-child-2` · Voltage | [apex-child-2/docs/screenshots/index.html](apex-child-2/docs/screenshots/index.html) |
| `apex-child-3` · Atelier | [apex-child-3/docs/screenshots/index.html](apex-child-3/docs/screenshots/index.html) |

Re-create after theme changes (needs the theme active in a running shop with the one-page checkout):

```bash
npm i --no-save playwright && npx playwright install chromium
[RESOLVE="MAP *.example.test 127.0.0.1"] node bin/screenshots.cjs apex-child-2/docs/screenshots \
    electronics.example.test /Smartphones/ /Smartphones/Some-Product.html "apex-child-2 · Voltage" "Electronics shop"
python3 bin/screenshot-gallery.py          # rebuilds every theme's index.html from screenshots.json
```

## Layout

```
themes/
├── bin/build.mjs              # builds CSS + copies fonts for every theme (or the ones named)
├── bin/screenshots.cjs        # screenshots per device (Playwright) → apex-child-*/docs/screenshots/<device>/
├── bin/screenshot-gallery.py  # builds apex-child-*/docs/screenshots/index.html
├── shared/scss/
│   ├── _apex-stack.scss       # Bootstrap 5.2.3 + all apex partials (same order as apex/style.scss)
│   └── _child-common.scss     # small helpers used by all three
├── package.json               # bootstrap 5.2.3 (= apex), sass 1.60, autoprefixer, @fontsource fonts
└── apex_<name>/
    ├── theme.php              # parentTheme => apex; only settings that differ or are new
    ├── composer.json          # type oxideshop-theme (target-directory / assets-directory)
    ├── de/ en/                # lang.php (new idents) + theme_options.php (admin labels)
    ├── build/
    │   ├── fonts.json         # @fontsource files to copy
    │   └── scss/              # style.scss = _variables → _fonts → apex-stack → _theme
    ├── tpl/                   # overrides: layout/header, page/shop/start, widget/<name>/*
    └── out/apex_<name>/       # img/logo.svg, thumbnail, src/css/styles.min.css, src/fonts/
```

How a child theme works in OXID 7.4: the child's `tpl/` is searched before apex's, and
`getResourceUrl()` / `getImageUrl()` look in `out/<child>/` first, then in `out/apex/`. So the child ships its
own `css/styles.min.css`, fonts and logo, and reuses apex's JS (`js/scripts.min.js`) and every template it
does not override. Theme settings of apex and of the child are both loaded; the child's values win.

Apex SCSS variables are not `!default`, so each child has a complete `_variables.scss` and compiles the apex
partials itself (`shared/scss/_apex-stack.scss`) instead of loading apex's CSS.

## Build

```bash
cd source/extensions/themes
npm install
npm run build                 # all themes
npm run build:redline         # one theme (also: build:voltage, build:atelier)
```

The build looks for apex at `$APEX_DIR`, then `../../source/Application/views/apex`, then
`../../vendor/oxid-esales/apex-theme`. The compiled CSS and fonts are committed in `out/`, like apex does.

## Install in this shop (development)

The themes are linked the same way apex is:

```bash
cd source/source
for t in apex-child-1 apex-child-2 apex-child-3; do
  ln -sfn ../../../extensions/themes/$t Application/views/$t
  ln -sfn ../Application/views/$t/out/$t out/$t
done
```

(Elsewhere: add a composer `path` repository for each theme directory and `composer require` it; the
`oxideshop-theme` installer copies `tpl/` etc. to `Application/views/<id>` and `out/<id>` to `source/out/<id>`.)

Activate in the admin (*Extensions → Themes*) or:

```bash
docker compose exec php bin/oe-console oe:theme:activate apex-child-1   # or apex-child-2 / apex-child-3
docker compose exec php bin/oe-console oe:cache:clear                   # needed so new lang idents load
```

In an EE mall each sub-shop can use a different theme (`--shop-id=<id>`), which fits the planned demo shops
(auto parts / electronics / fashion).

## Modules and child themes (required project setting)

OXID 7's Twig component loads module template extensions only for the **active** theme id
(`views/twig/extensions/themes/<id>/` and `default`). Under a child theme the active id is the child's, so modules that
ship `themes/apex/` extensions (one-page checkout, opalreturns, opalsubscription) lose them silently: no OPC modal,
no "Jetzt kaufen". `src/Twig/ParentThemeAwareShopTemplateChainAppender.php` makes the lookup active → parent → default.
Register it once per project:

```yaml
# var/configuration/configurable_services.yaml
services:
  OxidEsales\Twig\Resolver\TemplateChain\TemplateHandler\ModuleExtensions\ShopTemplateChainAppender:
    class: OxidEsales\ApexChildThemes\Twig\ParentThemeAwareShopTemplateChainAppender
    autowire: true
```

plus the autoload entry `"OxidEsales\\ApexChildThemes\\": "./extensions/themes/src/"` in the root `composer.json`
(`composer dump-autoload`), then `oe:cache:clear`.

## Settings added by the themes

| Theme | Setting | Group | Default |
|---|---|---|---|
| redline | `sRedlineHotline` – phone number in the meta bar (empty hides it) | header | `+49 761 000 000` |
| redline | `blRedlineShowVehicleFinder` | startpage | on |
| redline | `aRedlineVehicleMakes` – makes in the finder | startpage | 20 common makes |
| atelier | `blAtelierShowEditorial` | startpage | on |
| atelier | `sAtelierEditorialImage` – file in `out/apex-child-3/img/`; empty = first category picture | startpage | empty |

All three set their own `sLogoFile` / size and `sThemeColor`.

## Notes

- The vehicle finder builds an ordinary shop search: it joins make, model, year and part into `searchparam`.
  OXID's search matches every word, so in a real parts shop the vehicle data has to be in the article data
  (title, search keys or attributes) for results to appear.
- Category tiles, the category strip and the collection tiles use each top-level category's icon or thumbnail
  picture, falling back to apex's placeholder. The current EE demo categories have no pictures, so the placeholder
  shows; demo data with category pictures fills them.
- Overridden templates keep every apex block name, so modules that extend `layout/header.html.twig` or
  `page/shop/start.html.twig` blocks keep working. When apex changes those two templates, compare and update
  the child copies.
- If the shop is behind a CDN (e.g. Cloudflare), it may cache `/out/` files; purge it after a rebuild before
  checking the result.

## License

The child themes extend and partly copy templates of the OXID **APEX** theme (`tpl/layout/header.html.twig` and
`tpl/page/shop/start.html.twig` in each theme are derived from APEX's templates). APEX is © OXID eSales AG under the *OXID Modul & Komponenten-Lizenz*;
those derived files, like APEX itself, are for use with licensed OXID eShop editions only (hence `"license":
["proprietary"]` in the theme `composer.json` files). Everything else in this repository (SCSS layers, new
partials, build tooling, the Twig appender, docs) is original work of this repository.

Fonts are installed from [Fontsource](https://fontsource.org) and keep their own licenses (SIL Open Font License).
