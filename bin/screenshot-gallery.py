#!/usr/bin/env python3
"""Build docs/screenshots/index.html (static gallery) for each theme from its docs/screenshots/screenshots.json.

Usage:  python3 bin/screenshot-gallery.py [apex-child-1 ...]      (default: every theme that has screenshots)

The page has no scripts and no external files, so it works opened from disk, on GitHub Pages or in a PR preview.
Sections per device folder (laptop, mobile-v, mobile-h, mobile-folded-v) carry anchors: index.html#mobile-v.
"""
import html
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CSS = """
:root { --bg: #f6f7f9; --card: #fff; --text: #16181d; --muted: #5d6470; --line: #e2e5ea; --accent: #2563eb; }
@media (prefers-color-scheme: dark) {
  :root { --bg: #111317; --card: #1b1e24; --text: #e8eaee; --muted: #9aa3b0; --line: #2c313a; --accent: #7aa7ff; }
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
header, main, footer { max-width: 1280px; margin: 0 auto; padding: 0 16px; }
header { padding-top: 28px; }
h1 { font-size: 26px; margin: 0 0 4px; }
.meta { color: var(--muted); margin: 0 0 16px; }
.meta a { color: var(--accent); }
nav { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 8px; }
nav a { border: 1px solid var(--line); background: var(--card); color: var(--text); text-decoration: none; padding: 6px 12px; border-radius: 999px; font-size: 14px; }
nav a:hover { border-color: var(--accent); color: var(--accent); }
section { padding-top: 24px; scroll-margin-top: 8px; }
h2 { font-size: 19px; margin: 0 0 12px; display: flex; align-items: baseline; gap: 10px; }
h2 a.anchor { color: var(--muted); text-decoration: none; font-weight: 400; font-size: 14px; }
.grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
figure { margin: 0; background: var(--card); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
figure a { display: block; height: 340px; background: var(--bg); }
figure img { display: block; width: 100%; height: 100%; object-fit: contain; object-position: top center; }
figure.full img { object-fit: cover; }   /* full-length pages: show the top, click for the whole page */
figcaption { padding: 10px 12px; font-size: 14px; }
figcaption span { display: block; color: var(--muted); font-size: 12px; }
footer { color: var(--muted); font-size: 13px; padding: 32px 16px 40px; }
"""


def render(theme_dir: str) -> str:
    shots_dir = os.path.join(ROOT, theme_dir, 'docs', 'screenshots')
    with open(os.path.join(shots_dir, 'screenshots.json'), encoding='utf-8') as handle:
        manifest = json.load(handle)
    e = html.escape
    nav = ''.join(f'<a href="#{e(d["folder"])}">{e(d["label"].split(" · ")[0])}</a>' for d in manifest['devices'])
    sections = []
    for device in manifest['devices']:
        figures = []
        for shot in device['shots']:
            src = f'{device["folder"]}/{shot["file"]}'
            full = ' class="full"' if shot['file'].startswith('01-start') else ''
            figures.append(
                f'<figure{full}><a href="{e(src)}" target="_blank" rel="noopener">'
                f'<img src="{e(src)}" alt="{e(shot["caption"])} — {e(device["label"])}" loading="lazy"></a>'
                f'<figcaption>{e(shot["caption"])}<span>{e(src)}</span></figcaption></figure>'
            )
        sections.append(
            f'<section id="{e(device["folder"])}"><h2>{e(device["label"])} '
            f'<a class="anchor" href="#{e(device["folder"])}">#{e(device["folder"])}</a></h2>'
            f'<div class="grid">{"".join(figures)}</div></section>'
        )
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(manifest['theme'])} — screenshots</title>
<style>{CSS}</style>
</head>
<body>
<header>
<h1>{e(manifest['theme'])}</h1>
<p class="meta">{e(manifest['shop'])} · taken {e(manifest['taken'])} from <a href="{e(manifest['url'])}">{e(manifest['url'])}</a></p>
<nav>{nav}</nav>
</header>
<main>{''.join(sections)}</main>
<footer>Click an image for full size. Start pages are full length. For reproducible shots the one-page-checkout
developer bar is hidden and the rotating header USPs are shown in their resting state (first USP).
Re-create: <code>node bin/screenshots.cjs …</code> then <code>python3 bin/screenshot-gallery.py</code>.</footer>
</body>
</html>
"""


def main() -> None:
    themes = sys.argv[1:] or sorted(
        d for d in os.listdir(ROOT)
        if os.path.isfile(os.path.join(ROOT, d, 'docs', 'screenshots', 'screenshots.json'))
    )
    for theme in themes:
        target = os.path.join(ROOT, theme, 'docs', 'screenshots', 'index.html')
        with open(target, 'w', encoding='utf-8') as handle:
            handle.write(render(theme))
        print(f'{theme}: {os.path.relpath(target, ROOT)}')


if __name__ == '__main__':
    main()
