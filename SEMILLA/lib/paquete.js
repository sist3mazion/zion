'use strict';
/**
 * Convierte el modelo de texto en el archivo final.
 *
 *   contenido = u32le(longitud cabecera) | cabecera JSON | libros (zlib, uno por trozo) | cola aleatoria
 *   archivo   = portada de notas + base64( sal(16) | iv(12) | AES-256-GCM(contenido) ) + la app
 *
 * Nada del contenido (ni los nombres de los libros ni los textos del lector) queda en claro.
 */
const zlib = require('zlib');
const crypto = require('crypto');
const { cargarNucleo, fuenteJs, fuenteCss } = require('./nucleo');
const { inicioNT, direccion } = require('./texto');
const UI = require('../src/ui');
const DED = require('../src/dedicatoria');

// idiomas que escriben los números de versículo con sus propias cifras
const CIFRAS = { ar: 0x660, fa: 0x6f0, prs: 0x6f0, ps: 0x6f0, ur: 0x6f0 };
const CLAVE_MIN = 8;

function empaquetar(libros, meta) {
  const trozos = [], indice = [];
  let pos = 0;
  for (const l of libros) {
    const z = zlib.deflateSync(Buffer.from(JSON.stringify(l.caps), 'utf8'), { level: 9 });
    indice.push([l.nombre, pos, z.length]);
    trozos.push(z);
    pos += z.length;
  }
  const cab = Buffer.from(JSON.stringify(Object.assign({ v: 1 }, meta, { b: indice, z: pos })), 'utf8');
  const len = Buffer.alloc(4);
  len.writeUInt32LE(cab.length, 0);
  return new Uint8Array(Buffer.concat([len, cab, ...trozos]));
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
 * @param {Array}  o.libros   salida de texto.leerArchivos()
 * @param {string} o.clave    clave de apertura (mínimo 8 caracteres)
 * @param {string} o.idioma   código de idioma del texto (es, ar, fa…)
 * @param {string} [o.ui]     idioma de la interfaz; por defecto el del texto si existe, si no "en"
 * @param {object} [o.uiDatos] bloque {dir, c, r} propio (sustituye a o.ui)
 * @param {string} [o.nombre] nombre de la traducción
 * @param {string} [o.acerca] licencia / atribución que se muestra dentro
 * @param {boolean} [o.cifrasLatinas] no usar cifras propias del idioma
 * @returns {Promise<{html:string, libros:number, ui:string, dir:string}>}
 */
async function construir(o) {
  if (!o.libros || !o.libros.length) throw new Error('No hay libros que empaquetar');
  const clave = String(o.clave || '').trim();
  if (clave.length < CLAVE_MIN) throw new Error('La clave debe tener al menos ' + CLAVE_MIN + ' caracteres');
  const idioma = (o.idioma || 'en').toLowerCase();
  const ui = o.uiDatos ? (o.ui || idioma) : (UI[o.ui] ? o.ui : UI[idioma] ? idioma : 'en');
  const u = o.uiDatos || UI[ui];
  for (const k of ['t', 's', 'e', 'z', 'n', 'd', 'b', 'p', 'f']) if (!u.c || !u.c[k]) throw new Error('Falta el texto de portada "' + k + '"');
  for (const k of Object.keys(UI.en.r)) if (!u.r || !u.r[k]) throw new Error('Falta el texto del lector "' + k + '"');

  const N = cargarNucleo();
  const dir = direccion(o.libros);
  const pack = empaquetar(o.libros, {
    n: o.nombre || '', l: idioma, d: dir, g: o.cifrasLatinas ? 0 : (CIFRAS[idioma] || 0),
    t: inicioNT(o.libros), a: o.acerca || '', u: u.r,
    // dedicatoria de la web de ZION: [dirección, título, p1, p2, p3]; en el idioma del texto si existe, si no en inglés
    dd: [DED[idioma] ? dir : 'ltr'].concat(DED[idioma] || DED.en)
  });
  const azar = N.rand(2);
  const blob = N.b64e(await N.wrap(clave, N.cat(pack, N.rand(azar[0] << 8 | azar[1]))));

  const js = fuenteJs(), css = fuenteCss();
  if (/<\/script|<!--/i.test(js) || /<\/style/i.test(css)) throw new Error('El código de la app contiene una secuencia que rompería el HTML');
  const csp = politica(js, css);
  const html = N.assemble({
    lang: ui, dir: u.dir === 'rtl' ? 'rtl' : 'ltr', title: u.c.t, csp, css,
    ui: JSON.stringify(u.c).replace(/</g, '\\u003c'), blob, js
  });
  return { html, libros: o.libros.length, ui, dir };
}

module.exports = { construir, empaquetar, desmontar, comprobar, politica, CLAVE_MIN };
