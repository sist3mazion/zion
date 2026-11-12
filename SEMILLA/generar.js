#!/usr/bin/env node
'use strict';
/**
 * Genera un archivo a partir de una traducción en USFM o USFX.
 *
 *   node generar.js <fuente> --idioma es --nombre "Reina-Valera 1909" --salida dist/notas.html
 *
 * <fuente> puede ser: una carpeta con .usfm/.sfm, un .zip de eBible.org (…_usfm.zip o …_usfx.zip)
 * o un archivo .usfx.xml / .usfm suelto. Si no se pasa --clave, se pide por teclado sin mostrarla.
 */
const fs = require('fs');
const path = require('path');
const { leerZip } = require('./lib/zip');
const { leerArchivos, filtrar } = require('./lib/texto');
const { leerLineas } = require('./lib/lineas');
const NOMBRES = require('./lib/nombres');
const { construir, CLAVE_MIN } = require('./lib/paquete');
const UI = require('./src/ui');

const AYUDA = `
Uso:  node generar.js <fuente> [opciones]

  <fuente>            carpeta con .usfm, zip de eBible.org, o archivo .usfx.xml / .usfm
                      o un .txt de "un versículo por línea" (BibleNLP/ebible-corpus) con --vref
  --vref <archivo>    vref.txt que acompaña al .txt de un versículo por línea
  --nombres <código>  nombres de los libros para ese formato (${Object.keys(NOMBRES).join(', ')})

  --idioma <código>   idioma del texto (es, en, ar, fa, zh…). Por defecto: en
  --nombre "<texto>"  nombre de la traducción (se ve dentro, nunca en claro)
  --acerca "<texto>"  licencia y atribución (o @archivo.txt). Si el zip trae copr.htm, se usa
  --ui <código>       idioma de la portada y los menús (${Object.keys(UI).join(', ')})
  --ui-archivo <json> textos propios para otro idioma (mismo formato que un bloque de src/ui.js)
  --solo <lista>      NT, AT, o códigos separados por comas (MAT,MRK,LUK,JHN)
  --cifras-latinas    no usar cifras árabes/persas para los números
  --clave "<clave>"   clave de apertura (mejor omitirla: se pide por teclado)
  --salida <ruta>     archivo de salida. Por defecto: dist/<nombre neutro>.html
`;

function argumentos(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--cifras-latinas' || a === '--ayuda' || a === '-h' || a === '--help') o[a.replace(/^-+/, '')] = true;
    else if (a.startsWith('--')) o[a.slice(2)] = argv[++i];
    else o._.push(a);
  }
  return o;
}

function textoDe(buf) { return buf.toString('utf8'); }

function cargarFuente(ruta) {
  const st = fs.statSync(ruta);
  let archivos = [], copr = '';
  if (st.isDirectory()) {
    for (const f of fs.readdirSync(ruta)) {
      const p = path.join(ruta, f);
      if (fs.statSync(p).isFile() && /\.(usfm|sfm|xml)$/i.test(f)) archivos.push({ nombre: f, texto: textoDe(fs.readFileSync(p)) });
      if (/^copr\.html?$/i.test(f)) copr = textoDe(fs.readFileSync(p));
    }
  } else if (/\.zip$/i.test(ruta)) {
    for (const e of leerZip(fs.readFileSync(ruta))) {
      const base = path.basename(e.nombre);
      if (/\.(usfm|sfm|xml)$/i.test(base)) archivos.push({ nombre: base, texto: textoDe(e.datos) });
      if (/^copr\.html?$/i.test(base)) copr = textoDe(e.datos);
    }
  } else {
    archivos.push({ nombre: path.basename(ruta), texto: textoDe(fs.readFileSync(ruta)) });
  }
  return { archivos, copr };
}

function sinEtiquetas(html) {
  return html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '').replace(/<br\s*\/?>|<\/(p|div|h\d|li)>/gi, '\n').replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&copy;/g, '©')
    .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n\n').trim();
}

function pedirClave(pregunta) {
  return new Promise((resolve, reject) => {
    const ent = process.stdin, sal = process.stderr;
    if (!ent.isTTY) return reject(new Error('Falta --clave (y no hay teclado para pedirla)'));
    sal.write(pregunta);
    ent.setRawMode(true); ent.resume(); ent.setEncoding('utf8');
    let v = '';
    const tecla = ch => {
      const c = ch.charCodeAt(0);
      if (c === 13 || c === 10 || c === 4) { ent.setRawMode(false); ent.pause(); ent.removeListener('data', tecla); sal.write('\n'); resolve(v); }
      else if (c === 3) { ent.setRawMode(false); sal.write('\n'); process.exit(1); }
      else if (c === 127 || c === 8) v = v.slice(0, -1);
      else v += ch;
    };
    ent.on('data', tecla);
  });
}

async function main() {
  const o = argumentos(process.argv.slice(2));
  if (o.ayuda || o.h || o.help || !o._.length) { process.stdout.write(AYUDA); process.exit(o._.length ? 0 : 1); }

  let archivos = [], copr = '', libros;
  if (/\.txt$/i.test(o._[0])) {
    if (!o.vref || !NOMBRES[o.nombres]) throw new Error('Un .txt de un versículo por línea necesita --vref y --nombres (' + Object.keys(NOMBRES).join(', ') + ')');
    libros = filtrar(leerLineas(fs.readFileSync(o._[0], 'utf8'), fs.readFileSync(o.vref, 'utf8'), NOMBRES[o.nombres]), o.solo);
  } else {
    ({ archivos, copr } = cargarFuente(o._[0]));
    libros = filtrar(leerArchivos(archivos), o.solo);
  }
  if (!libros.length) throw new Error('La fuente no contiene libros (¿--solo demasiado estricto?)');

  let acerca = o.acerca || '';
  if (acerca.startsWith('@')) acerca = fs.readFileSync(acerca.slice(1), 'utf8').trim();
  if (!acerca && copr) acerca = sinEtiquetas(copr);

  let uiDatos = null;
  if (o['ui-archivo']) uiDatos = JSON.parse(fs.readFileSync(o['ui-archivo'], 'utf8'));

  let clave = o.clave || process.env.CLAVE || '';
  if (!clave) {
    clave = await pedirClave('Clave de apertura (mínimo ' + CLAVE_MIN + ' caracteres; mejor tres palabras): ');
    if (clave !== await pedirClave('Repite la clave: ')) throw new Error('Las claves no coinciden');
  }

  const r = await construir({ libros, clave, idioma: o.idioma, ui: o.ui, uiDatos, nombre: o.nombre, acerca, cifrasLatinas: !!o['cifras-latinas'] });
  const base = (uiDatos || UI[r.ui]).c.f;
  const salida = o.salida || path.join('dist', base + '.html');
  fs.mkdirSync(path.dirname(path.resolve(salida)), { recursive: true });
  fs.writeFileSync(salida, r.html);

  const caps = libros.reduce((n, l) => n + l.caps.length, 0);
  console.log('Hecho: ' + salida);
  console.log('  ' + r.libros + ' libros, ' + caps + ' capítulos, ' + (Buffer.byteLength(r.html) / 1048576).toFixed(2) + ' MB');
  console.log('  portada en "' + r.ui + '", lectura ' + (r.dir === 'rtl' ? 'de derecha a izquierda' : 'de izquierda a derecha'));
  if (!acerca) console.log('  AVISO: sin texto de licencia (--acerca). Comprueba que puedes redistribuir esta traducción.');
  if (!o.ui && !uiDatos && r.ui !== (o.idioma || 'en').toLowerCase()) console.log('  AVISO: no hay interfaz en "' + o.idioma + '"; se ha usado "' + r.ui + '". Usa --ui-archivo para añadirla.');
}

main().catch(e => { console.error('Error: ' + e.message); process.exit(1); });
