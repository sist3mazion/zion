'use strict';
/**
 * Carga en Node el núcleo REAL de la app (el tramo entre los marcadores <core> de src/app.js):
 * cifrado, descompresión, plegado de búsqueda y ensamblado del archivo.
 * El generador y los tests usan exactamente el mismo código que corre en el móvil.
 */
const fs = require('fs');
const path = require('path');

const RUTA_JS = path.join(__dirname, '..', 'src', 'app.js');
const RUTA_CSS = path.join(__dirname, '..', 'src', 'app.css');
const NOMBRES = ['ITER', 'b64d', 'b64e', 'rand', 'cat', 'kdf', 'seal', 'unseal', 'wrap', 'unwrap', 'puff', 'unz', 'parse', 'norm', 'esc', 'assemble'];

function leer(ruta) {
  const s = fs.readFileSync(ruta, 'utf8').replace(/\r\n?/g, '\n');
  if (/[^\n\x20-\x7e]/.test(s)) throw new Error(path.basename(ruta) + ' debe ser ASCII puro (usa \\uXXXX)');
  return s;
}

function cargarNucleo(opciones = {}) {
  const js = leer(RUTA_JS);
  const m = /\/\* <core> \*\/([\s\S]*?)\/\* <\/core> \*\//.exec(js);
  if (!m) throw new Error('No encuentro los marcadores <core> en src/app.js');
  const cuerpo = m[1] + '\nreturn {' + NOMBRES.join(',') + '};';
  // sinNativo: fuerza el descompresor de reserva (para probarlo)
  const fn = new Function('DecompressionStream', cuerpo);
  return fn(opciones.sinNativo ? undefined : globalThis.DecompressionStream);
}

module.exports = { cargarNucleo, fuenteJs: () => leer(RUTA_JS), fuenteCss: () => leer(RUTA_CSS) };
