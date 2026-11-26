#!/usr/bin/env node
/**
 * Builds the APEX child themes.
 *
 * For every theme directory (or only the ones given as arguments) it
 *   1. compiles <theme>/build/scss/style.scss to <theme>/out/<theme>/src/css/styles.min.css,
 *      resolving apex SCSS partials from the parent theme and Bootstrap from node_modules,
 *   2. copies the web fonts listed in <theme>/build/fonts.json to <theme>/out/<theme>/src/fonts/.
 *
 * Parent theme location: $APEX_DIR, or ../../source/Application/views/apex relative to this repo
 * (the shop layout this repo lives in: <shop>/extensions/themes), or vendor/oxid-esales/apex-theme.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nodeModules = path.join(root, 'node_modules');

function findApex() {
    const candidates = [
        process.env.APEX_DIR,
        path.resolve(root, '../../source/Application/views/apex'),
        path.resolve(root, '../../vendor/oxid-esales/apex-theme'),
    ].filter(Boolean);
    const found = candidates.find((dir) => existsSync(path.join(dir, 'build/scss/layout/_base.scss')));
    if (!found) {
        throw new Error('APEX parent theme not found. Set APEX_DIR to the apex theme directory.');
    }
    return found;
}

function themeDirs(requested) {
    const all = readdirSync(root, { withFileTypes: true })
        .filter((d) => d.isDirectory() && existsSync(path.join(root, d.name, 'theme.php')))
        .map((d) => d.name);
    if (requested.length === 0) {
        return all;
    }
    const unknown = requested.filter((t) => !all.includes(t));
    if (unknown.length) {
        throw new Error(`Unknown theme(s): ${unknown.join(', ')}. Known: ${all.join(', ')}`);
    }
    return requested;
}

function copyFonts(theme, outDir) {
    const listFile = path.join(root, theme, 'build/fonts.json');
    if (!existsSync(listFile)) {
        return 0;
    }
    const fonts = JSON.parse(readFileSync(listFile, 'utf8'));
    const target = path.join(outDir, 'fonts');
    mkdirSync(target, { recursive: true });
    for (const [pkg, files] of Object.entries(fonts)) {
        for (const file of files) {
            copyFileSync(path.join(nodeModules, '@fontsource', pkg, 'files', file), path.join(target, file));
        }
    }
    return Object.values(fonts).flat().length;
}

async function buildTheme(theme, apexScss) {
    const entry = path.join(root, theme, 'build/scss/style.scss');
    const outDir = path.join(root, theme, 'out', theme, 'src');
    const cssDir = path.join(outDir, 'css');
    mkdirSync(cssDir, { recursive: true });

    let deprecations = 0;
    const result = sass.compile(entry, {
        loadPaths: [path.join(root, theme, 'build/scss'), path.join(root, 'shared/scss'), apexScss, nodeModules],
        style: 'compressed',
        quietDeps: true,
        logger: {
            warn: (message, { deprecation }) => {
                if (deprecation) { deprecations += 1; return; }
                console.warn(`  warning: ${message}`);
            },
            debug: () => {},
        },
    });
    const prefixed = await postcss([autoprefixer({ overrideBrowserslist: ['last 2 versions'] })])
        .process(result.css, { from: undefined });
    writeFileSync(path.join(cssDir, 'styles.min.css'), prefixed.css);

    const fontCount = copyFonts(theme, outDir);
    const kb = (Buffer.byteLength(prefixed.css) / 1024).toFixed(1);
    console.log(`${theme}: css/styles.min.css ${kb} KiB, ${fontCount} font file(s), ${deprecations} sass deprecation notice(s) (apex partials)`);
}

const apexScss = path.join(findApex(), 'build/scss');
console.log(`apex scss: ${apexScss}`);
for (const theme of themeDirs(process.argv.slice(2))) {
    await buildTheme(theme, apexScss);
}
