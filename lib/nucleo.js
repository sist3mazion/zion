'use strict';
/**
 * Carga en Node el núcleo REAL de la app (el tramo entre los marcadores <core> de src/app.js):
 * cifrado, formato del archivo, descompresión (zlib y LZMA), plegado de búsqueda y ensamblado.
 * El generador y los tests usan exactamente el mismo código que corre en el móvil,
 * incluidos el Argon2id de src/argon2.js (hash-wasm, WebAssembly) y el X25519 de src/x25519.js (noble-curves),
 * que van delante de la app en el archivo.
 */
const fs = require('fs');
const path = require('path');

const RUTA_A2 = path.join(__dirname, '..', 'src', 'argon2.js');
const RUTA_X2 = path.join(__dirname, '..', 'src', 'x25519.js');
const RUTA_JS = path.join(__dirname, '..', 'src', 'app.js');
const RUTA_CSS = path.join(__dirname, '..', 'src', 'app.css');
const NOMBRES = ['KDF', 'fold', 'ascii', 'b64d', 'b64e', 'rand', 'cat', 'argon', 'aes', 'kdf', 'seal', 'unseal', 'wrap', 'unwrap',
  'hmac', 'le', 'SID', 'dkp', 'kem', 'sched', 'seal2', 'open2', 'fkey', 'INFO', 'code', 'unpack', 'lnum', 'lstr', 'CL', 'sum', 'big', 'bytes',
  'puff', 'unz', 'unlz', 'LZP', 'b64at', 'b64parts', 'HEAD', 'HEAD2', 'open', 'piece', 'inflate', 'build', 'norm', 'esc', 'assemble',
  'CPD', 'CI2', 'INF2', 'MSG', 'SL', 'AL', 'ML', 'sha512', 'lenp', 'lvc', 'fle', 'fen', 'finv', 'cgen', 'cmul', 'cisk', 'csess',
  'b64u', 'u64', 'cok', 'cstart', 'caccept', 'cfinish', 'cseal', 'copen', 'grab'];

function leer(ruta) {
  const s = fs.readFileSync(ruta, 'utf8').replace(/\r\n?/g, '\n');
  if (/[^\n\x20-\x7e]/.test(s)) throw new Error(path.basename(ruta) + ' debe ser ASCII puro (usa \\uXXXX)');
  return s;
}

/**
 * Quita los comentarios y la sangría de un script (cadenas y expresiones regulares quedan intactas).
 * Los comentarios explican el diseño y van en claro en cada archivo: el repo los conserva, el archivo no.
 * Los saltos de línea se mantienen (no cambia dónde se inserta un «;» automático).
 */
function sinComentarios(js) {
  const PALABRAS = /(?:^|[^\w$])(?:return|typeof|instanceof|in|of|new|delete|void|throw|case|do|else|yield|await)$/;
  let o = '', i = 0, ini = true, prev = '';
  const n = js.length;
  while (i < n) {
    const c = js[i], d = js[i + 1];
    if (ini && (c === ' ' || c === '\t')) { i++; continue; }
    if (c === '\n') { if (!ini) o += '\n'; ini = true; i++; continue; }
    if (c === '/' && d === '/') { while (i < n && js[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') {
      const f = js.indexOf('*/', i + 2);
      if (f < 0) throw new Error('Comentario sin cerrar');
      const salto = js.slice(i, f).includes('\n');
      i = f + 2;
      if (salto) { if (!ini) o += '\n'; ini = true; } else if (!ini && !/\s$/.test(o)) o += ' ';
      continue;
    }
    ini = false;
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < n && js[j] !== c) { if (js[j] === '\\') j++; if (c !== '`' && js[j] === '\n') throw new Error('Cadena sin cerrar'); j++; }
      o += js.slice(i, j + 1); i = j + 1; prev = 'x'; continue;
    }
    if (c === '/') {
      const antes = o.replace(/\s+$/, '');
      const ult = antes.slice(-1);
      if (!ult || /[(,=:[!&|?{};+\-*%<>~^]/.test(ult) || PALABRAS.test(antes)) {
        let j = i + 1, clase = false;
        while (j < n && (clase || js[j] !== '/')) {
          if (js[j] === '\\') j++; else if (js[j] === '[') clase = true; else if (js[j] === ']') clase = false;
          if (js[j] === '\n') throw new Error('Expresión regular sin cerrar');
          j++;
        }
        j++; while (j < n && /[a-z]/.test(js[j])) j++;
        o += js.slice(i, j); i = j; continue;
      }
    }
    o += c; i++;
  }
  return o.replace(/[ \t]+\n/g, '\n').replace(/\n+$/, '');
}

/** Una librería de terceros sin su comentario descriptivo, pero con la licencia MIT, que debe acompañar a cada copia. */
function tercero(ruta) {
  const a = leer(ruta), m = a.indexOf('MIT License'), f = a.indexOf('*/');
  if (!a.startsWith('/*') || m < 0 || m > f) throw new Error(path.basename(ruta) + ': no encuentro la licencia MIT en su primer comentario');
  return '/* ' + a.slice(m, f).replace(/\n {3}/g, '\n') + '*/\n' + sinComentarios(a.slice(f + 2));
}

/** El script que lleva el archivo: Argon2id, X25519 y, detrás, la app; sin comentarios salvo las licencias. */
function fuenteJs() { return tercero(RUTA_A2) + '\n' + tercero(RUTA_X2) + '\n' + sinComentarios(leer(RUTA_JS)); }

function cargarNucleo(opciones = {}) {
  const js = leer(RUTA_JS);
  const m = /\/\* <core> \*\/([\s\S]*?)\/\* <\/core> \*\//.exec(js);
  if (!m) throw new Error('No encuentro los marcadores <core> en src/app.js');
  const cuerpo = leer(RUTA_A2) + '\n' + leer(RUTA_X2) + '\n' + m[1] + '\nreturn {' + NOMBRES.join(',') + '};';
  // sinNativo: fuerza el descompresor de reserva (para probarlo)
  const fn = new Function('DecompressionStream', cuerpo);
  return fn(opciones.sinNativo ? undefined : globalThis.DecompressionStream);
}

module.exports = { cargarNucleo, fuenteJs, fuenteCss: () => leer(RUTA_CSS), sinComentarios, RUTA_X2 };
