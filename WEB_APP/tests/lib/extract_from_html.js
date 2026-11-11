/**
 * Extrae funciones y constantes REALES de los HTML de ZION para testearlas en Node,
 * en lugar de testear copias reimplementadas (que pueden divergir del código real).
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function extractBlock(src, startIdx) {
    let i = src.indexOf('{', startIdx);
    let depth = 0, inStr = null, inLineC = false, inBlockC = false, inTpl = 0;
    for (; i < src.length; i++) {
        const c = src[i], n = src[i + 1];
        if (inLineC) { if (c === '\n') inLineC = false; continue; }
        if (inBlockC) { if (c === '*' && n === '/') { inBlockC = false; i++; } continue; }
        if (inStr) { if (c === '\\') { i++; continue; } if (c === inStr) inStr = null; continue; }
        if (c === '/' && n === '/') { inLineC = true; i++; continue; }
        if (c === '/' && n === '*') { inBlockC = true; i++; continue; }
        if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
        if (c === '{') depth++;
        else if (c === '}') { depth--; if (depth === 0) return src.slice(startIdx, i + 1); }
    }
    throw new Error('Bloque sin cerrar');
}

function getDefinition(src, name) {
    const marker = new RegExp(`// <${name}>([\\s\\S]*?)// </${name}>`);
    const mk = marker.exec(src);
    if (mk) return mk[1];
    const clsRe = new RegExp(`class\\s+${name}\\s*\\{`);
    const cm = clsRe.exec(src);
    if (cm) return extractBlock(src, cm.index);
    const fnRe = new RegExp(`(async\\s+)?function\\s+${name}\\s*\\(`);
    const m = fnRe.exec(src);
    if (m) return extractBlock(src, m.index);
    const cRe = new RegExp(`const\\s+${name}\\s*=[^;]*;`);
    const c = cRe.exec(src);
    if (c) return c[0];
    throw new Error(`No se encontró "${name}" en el HTML`);
}

/** Los bloques con marcadores (p.ej. ARKA_POINTER) exportan su constante principal. */
const MARKER_EXPORTS = { ARKA_POINTER: 'ArkaPointer' };
const exportName = (n) => MARKER_EXPORTS[n] ? `${n}: ${MARKER_EXPORTS[n]}` : n;

/**
 * Carga en un contexto aislado las definiciones pedidas, en orden.
 * @param {string} htmlFile nombre del HTML en WEB_APP/
 * @param {string[]} names funciones o constantes a extraer
 */
function loadFromHtml(htmlFile, names) {
    const src = fs.readFileSync(path.join(__dirname, '..', '..', htmlFile), 'utf8');
    const code = names.map(n => getDefinition(src, n)).join('\n\n') +
        `\n;globalThis.__exports = { ${names.map(exportName).join(', ')} };`;
    const ctx = vm.createContext({
        crypto: globalThis.crypto, Blob, TextEncoder, TextDecoder, DataView,
        Uint8Array, Uint32Array, Float64Array, ArrayBuffer, Array, String, Math, Error, Promise, setTimeout, console,
    });
    vm.runInContext(code, ctx, { filename: htmlFile });
    return ctx.__exports;
}

module.exports = { loadFromHtml };
