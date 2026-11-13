'use strict';
/**
 * Convierte el modelo de texto en el archivo final. Un archivo puede llevar varias traducciones.
 *
 *   archivo = portada de notas + base64( sal(16) | caja(dónde está el índice) | bloques | índice | cola aleatoria ) + la app
 *   caja    = iv(12) | AES-256-GCM. Una sola clave (PBKDF2) para todo; cada caja va ligada a su sitio (datos asociados).
 *   bloque  = varios libros seguidos de una traducción, comprimidos con LZMA (o zlib si no hay xz). ~6 por traducción.
 *   índice  = JSON: textos de la interfaz, y por traducción su nombre, licencia, libros y dónde está cada bloque.
 *
 * Al abrir solo se descifran el índice y, después, los bloques que se leen. Nada del contenido queda en claro.
 */
const zlib = require('zlib');
const crypto = require('crypto');
const cp = require('child_process');
const { cargarNucleo, fuenteJs, fuenteCss } = require('./nucleo');
const { inicioNT, direccion } = require('./texto');
const UI = require('../src/ui');
const DED = require('../src/dedicatoria');

// idiomas que escriben los números de versículo con sus propias cifras
const CIFRAS = { ar: 0x660, fa: 0x6f0, prs: 0x6f0, ps: 0x6f0, ur: 0x6f0, my: 0x1040 };
const CLAVE_MIN = 8;
const BLOQUES = 6;   // por traducción: abrir un libro descomprime ~1/6 del texto

let XZ = null;
/** ¿Está la orden xz? (Linux y macOS la traen; sin ella se usa zlib y el archivo sale ~40 % más grande) */
function hayXz() {
  if (XZ === null) { try { cp.execFileSync('xz', ['--version'], { stdio: 'ignore' }); XZ = true; } catch (e) { XZ = false; } }
  return XZ;
}
/** LZMA crudo con lc=3 lp=0 pb=2 (LZP = 93 en la app) o zlib */
function comprimir(buf, modo) {
  if (modo !== 'zlib' && hayXz()) {
    const z = cp.execFileSync('xz', ['--format=raw', '--lzma1=preset=9e,dict=8MiB,lc=3,lp=0,pb=2', '-c'], { input: buf, maxBuffer: 1 << 30 });
    return { c: 'x', z };
  }
  if (modo === 'lzma') throw new Error('Falta la orden xz para comprimir con LZMA');
  return { c: 'z', z: zlib.deflateSync(buf, { level: 9 }) };
}

/** Reparte los libros en hasta n bloques de tamaño parecido, sin partir ningún libro. */
function trocear(libros, n) {
  const datos = libros.map(l => Buffer.from(JSON.stringify(l.caps), 'utf8'));
  const meta = datos.reduce((a, d) => a + d.length, 0) / n, grupos = [[]];
  let acum = 0;
  datos.forEach((d, i) => {
    if (acum >= meta * grupos.length && grupos.length < n && grupos[grupos.length - 1].length) grupos.push([]);
    grupos[grupos.length - 1].push(i);
    acum += d.length;
  });
  return { datos, grupos };
}

/** Una traducción → su entrada del índice y sus bloques comprimidos. */
function texto(tr, bloques, compresion) {
  const l = (tr.idioma || 'en').toLowerCase(), dir = direccion(tr.libros);
  const { datos, grupos } = trocear(tr.libros, bloques);
  const b = [], k = [], piezas = [];
  let codec = '';
  grupos.forEach((g, j) => {
    let at = 0;
    for (const i of g) { b[i] = [tr.libros[i].nombre, j, at, datos[i].length]; at += datos[i].length; }
    const plano = Buffer.concat(g.map(i => datos[i]));
    const { c, z } = comprimir(plano, compresion);
    k.push([0, 0, c, plano.length]);
    piezas.push(new Uint8Array(z.buffer, z.byteOffset, z.length));
    codec = c;
  });
  return {
    t: {
      l, n: tr.nombre || '', d: dir, g: tr.cifrasLatinas ? 0 : (CIFRAS[l] || 0), t: inicioNT(tr.libros), a: tr.acerca || '',
      // dedicatoria de la web de ZION: [dirección, título, p1, p2, p3]; en el idioma del texto si existe, si no en inglés
      dd: [DED[l] ? dir : 'ltr'].concat(DED[l] || DED.en), b, k
    },
    piezas, codec
  };
}

function sha(t) { return crypto.createHash('sha256').update(t, 'utf8').digest('base64'); }

/** La política que lleva escrita el archivo: nada externo, y solo el script y los estilos con estos hashes. */
function politica(js, css) {
  return "default-src 'none'; script-src 'sha256-" + sha(js) + "'; style-src 'sha256-" + sha(css) + "'; base-uri 'none'; form-action 'none'";
}

const FORMA = /^<!doctype html>\n<html lang="([^"<>]*)" dir="(ltr|rtl)">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<meta http-equiv="Content-Security-Policy" content="([^"<>]*)">\n<meta name="referrer" content="no-referrer">\n<title>([^<>]*)<\/title>\n<style>([^<]*)<\/style>\n<\/head>\n<body>\n<script type="application\/json" id="u">([^<]*)<\/script>\n<script type="application\/octet-stream" id="d">([A-Za-z0-9+\/=]*)<\/script>\n<script>([\s\S]*)<\/script>\n<\/body>\n<\/html>\n$/;

/** Separa un archivo en sus piezas. Devuelve null si no tiene exactamente la forma esperada. */
function desmontar(html) {
  const m = FORMA.exec(html);
  if (!m || /<\/script/i.test(m[8])) return null;
  return { lang: m[1], dir: m[2], csp: m[3], title: m[4], css: m[5], ui: m[6], blob: m[7], js: m[8] };
}

/**
 * ¿Lleva este archivo exactamente el programa de esta carpeta?
 * El navegador solo ejecuta el script cuyo hash figura en la política, así que basta comparar las piezas.
 */
function comprobar(html) {
  const p = desmontar(html);
  if (!p) return { ok: false, motivo: 'No tiene la estructura de un archivo generado (o le han añadido algo).' };
  const js = fuenteJs(), css = fuenteCss();
  if (p.js !== js) return { ok: false, motivo: 'El programa no coincide con el de esta carpeta: es otra versión o ha sido modificado.' };
  if (p.css !== css) return { ok: false, motivo: 'Los estilos no coinciden con los de esta carpeta.' };
  if (p.csp !== politica(js, css)) return { ok: false, motivo: 'La política de seguridad ha sido cambiada.' };
  let ui;
  try { ui = JSON.parse(p.ui); } catch (e) { ui = null; }
  if (!ui || typeof ui !== 'object' || Object.values(ui).some(v => typeof v !== 'string')) return { ok: false, motivo: 'Los textos de la portada no son válidos.' };
  return { ok: true, piezas: p };
}

/**
 * @param {object} o
 * @param {Array}  [o.traducciones] [{libros, idioma, nombre, acerca, cifrasLatinas}] — varias en un archivo
 * @param {Array}  [o.libros]  una sola traducción (salida de texto.leerArchivos()), con o.idioma, o.nombre, o.acerca, o.cifrasLatinas
 * @param {string} o.clave    clave de apertura (mínimo 8 caracteres)
 * @param {string} [o.ui]     idioma de la portada y del lector; por defecto el de la primera traducción si existe, si no "en"
 * @param {object} [o.uiDatos] bloque {dir, c, r} propio (sustituye a o.ui)
 * @param {string} [o.compresion] 'lzma' | 'zlib'; por defecto LZMA si está xz
 * @param {number} [o.bloques] bloques por traducción (6)
 * @returns {Promise<{html:string, libros:number, textos:number, ui:string, dir:string, compresion:string}>}
 */
async function construir(o) {
  const lista = o.traducciones || [{ libros: o.libros, idioma: o.idioma, nombre: o.nombre, acerca: o.acerca, cifrasLatinas: o.cifrasLatinas }];
  if (!lista.length || lista.some(t => !t.libros || !t.libros.length)) throw new Error('No hay libros que empaquetar');
  const clave = String(o.clave || '').trim();
  if (clave.length < CLAVE_MIN) throw new Error('La clave debe tener al menos ' + CLAVE_MIN + ' caracteres');
  const idioma = (lista[0].idioma || 'en').toLowerCase();
  const ui = o.uiDatos ? (o.ui || idioma) : (UI[o.ui] ? o.ui : UI[idioma] ? idioma : 'en');
  const u = o.uiDatos || UI[ui];
  for (const k of ['t', 's', 'e', 'z', 'n', 'd', 'b', 'p', 'f']) if (!u.c || !u.c[k]) throw new Error('Falta el texto de portada "' + k + '"');
  for (const k of Object.keys(UI.en.r)) if (!u.r || !u.r[k]) throw new Error('Falta el texto del lector "' + k + '"');

  // el índice lleva la interfaz de todos los idiomas: el lector usa la de la portada, y al pasar una copia se puede cambiar
  const m = { v: 2, u: Object.assign({}, UI, o.uiDatos ? { [ui]: Object.assign({ nm: ui }, o.uiDatos) } : {}), t: [] }, piezas = [];
  let codec = '';
  for (const tr of lista) {
    const r = texto(tr, o.bloques || BLOQUES, o.compresion);
    m.t.push(r.t); piezas.push(r.piezas); codec = r.codec;
  }
  const N = cargarNucleo();
  const blob = N.b64parts(await N.build(clave, m, (i, j) => piezas[i][j])).join('');

  const js = fuenteJs(), css = fuenteCss();
  if (/<\/script|<!--/i.test(js) || /<\/style/i.test(css)) throw new Error('El código de la app contiene una secuencia que rompería el HTML');
  const csp = politica(js, css);
  const html = N.assemble({
    lang: ui, dir: u.dir === 'rtl' ? 'rtl' : 'ltr', title: u.c.t, csp, css,
    ui: JSON.stringify(u.c).replace(/</g, '\\u003c'), blob, js
  });
  return { html, libros: lista[0].libros.length, textos: m.t.length, ui, dir: m.t[0].d, compresion: codec === 'x' ? 'lzma' : 'zlib' };
}

module.exports = { construir, desmontar, comprobar, politica, hayXz, CLAVE_MIN };
