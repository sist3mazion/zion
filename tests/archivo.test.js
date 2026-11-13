'use strict';
/** El archivo generado: qué se ve en claro, qué no, y que no puede hablar con la red. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const nodeCrypto = require('node:crypto');
const { construir, desmontar, comprobar } = require('../lib/paquete');
const { leerArchivos } = require('../lib/texto');
const { leerZip } = require('../lib/zip');
const { cargarNucleo } = require('../lib/nucleo');
const UI = require('../src/ui');

const FX = path.join(__dirname, 'fixtures');
const N = cargarNucleo();
const libros = () => leerArchivos([{ nombre: 'es.usfx.xml', texto: fs.readFileSync(path.join(FX, 'es-rv1909.usfx.xml'), 'utf8') }]);
const CLAVE = 'semilla buena tierra';
const hacer = (extra = {}) => construir(Object.assign({ libros: libros(), clave: CLAVE, idioma: 'es', nombre: 'Reina-Valera 1909', acerca: 'Dominio público.' }, extra));

function partes(html) {
  const p = desmontar(html);
  assert.ok(p, 'el archivo no tiene la estructura esperada');
  return p;
}
const sha = t => nodeCrypto.createHash('sha256').update(t, 'utf8').digest('base64');

// Palabras que delatarían el contenido o la herramienta si aparecieran en claro
const DELATORAS = /bibl|zion|jes[uú]s|crist|christ|gospel|evangel|iglesia|church|scriptur|testament|vers[ií]culo|\bverses?\b|salmo|psalm|g[eé]nesis|nuke|stegan|arweave|ipfs|semilla|reina|valera/i;
// Cualquier forma de salir a la red o de cargar algo externo
const RED = /https?:|\/\/[a-z0-9]|\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|importScripts|\bimport\s*\(|\.src\s*=|<img|<link|<iframe|<object|<embed/i;
const RED_CSS = /url\s*\(|@import|@font-face/i;

test('política de contenido: nada externo, y solo se ejecuta el script cuyo hash coincide', async () => {
  const { html } = await hacer();
  const p = partes(html);
  assert.equal(p.csp, "default-src 'none'; script-src 'sha256-" + sha(p.js) + "'; style-src 'sha256-" + sha(p.css) + "'; base-uri 'none'; form-action 'none'");
  assert.ok(!/unsafe|\*|https?:|data:|blob:/.test(p.csp));
  assert.ok(!/[^\n\x20-\x7e]/.test(p.js + p.css), 'el código debe ser ASCII puro');
  assert.ok(!html.includes('\r'));
});

test('en claro no hay ni una palabra delatora ni una vía de red', async () => {
  const { html } = await hacer();
  const p = partes(html);
  const claro = html.replace(p.blob, '');
  assert.equal(DELATORAS.exec(claro), null);
  assert.equal(RED.exec(claro), null);
  assert.equal(RED_CSS.exec(p.css), null);
  assert.equal(p.title, 'Notas');
  assert.deepEqual(Object.keys(JSON.parse(p.ui)).sort(), ['b', 'd', 'e', 'f', 'n', 'p', 's', 't', 'z']);
});

test('dos archivos del mismo texto y la misma clave no se parecen (ni en bytes ni en tamaño)', async () => {
  const a = await hacer(), b = await hacer(), c = await hacer();
  const pa = partes(a.html), pb = partes(b.html);
  assert.notEqual(pa.blob, pb.blob);
  assert.notEqual(pa.blob.slice(0, 40), pb.blob.slice(0, 40));
  assert.ok(new Set([a.html.length, b.html.length, c.html.length]).size > 1, 'la cola aleatoria no varía el tamaño');
  assert.equal(pa.js, pb.js); assert.equal(pa.css, pb.css);
});

test('con la clave se recupera todo; sin ella, nada', async () => {
  const ar = leerArchivos([{ nombre: 'ar.usfm', texto: fs.readFileSync(path.join(FX, 'ar-vd.usfm'), 'utf8') }]);
  const r = await construir({ clave: CLAVE, traducciones: [
    { libros: libros(), idioma: 'es', nombre: 'Reina-Valera 1909', acerca: 'Dominio público.' },
    { libros: ar, idioma: 'ar', nombre: 'فان دايك' }] });
  const p = partes(r.html);
  assert.equal(r.textos, 2);
  await assert.rejects(N.open('otra clave distinta', p.blob));
  const { key, m } = await N.open(CLAVE, p.blob);
  const es = m.t[0];
  assert.equal(es.n, 'Reina-Valera 1909'); assert.equal(es.l, 'es'); assert.equal(es.d, 'ltr'); assert.equal(es.a, 'Dominio público.');
  assert.deepEqual(es.b.map(x => x[0]), ['Génesis', 'Salmos', 'Juan', 'Judas']);
  assert.equal(es.t, 2);
  assert.deepEqual(m.u.es.r, UI.es.r);
  assert.equal(m.t[1].l, 'ar'); assert.equal(m.t[1].d, 'rtl');
  for (let i = 0; i < m.t.length; i++) {
    for (const [, j, at, len] of m.t[i].b) {
      const d = await N.inflate(m.t[i].k[j], await N.piece(key, p.blob, m, i, j));
      const caps = JSON.parse(Buffer.from(d.subarray(at, at + len)).toString('utf8'));
      assert.ok(Array.isArray(caps) && caps.length >= 1 && typeof caps[0][0] === 'number');
    }
  }
  // cada bloque solo abre en su sitio: no se pueden cambiar de lugar
  await assert.rejects(N.unseal(key, N.b64at(p.blob, m.t[0].k[0][0], m.t[0].k[0][1]), '1.0'));
});

test('comprobar: reconoce el programa auténtico y detecta cualquier cambio fuera del contenido cifrado', async () => {
  const { html } = await hacer();
  assert.equal(comprobar(html).ok, true);
  const p = partes(html);
  // un carácter del programa
  assert.equal(comprobar(html.replace('var ITER = 600000', 'var ITER = 600001')).ok, false);
  // un script añadido
  assert.equal(comprobar(html.replace('</body>', '<script>1</script></body>')).ok, false);
  // política relajada
  assert.equal(comprobar(html.replace("default-src 'none'", "default-src *")).ok, false);
  // estilos tocados
  assert.equal(comprobar(html.replace(p.css, p.css + 'b{}')).ok, false);
  // algo colado antes o después
  assert.equal(comprobar('<!-- x -->' + html).ok, false);
  assert.equal(comprobar(html + '<p>').ok, false);
  // otro contenido cifrado u otra portada sí son legítimos
  const otro = await hacer({ clave: 'otra clave distinta', ui: 'fr' });
  assert.equal(comprobar(otro.html).ok, true);
});

test('claves cortas se rechazan al generar', async () => {
  await assert.rejects(hacer({ clave: 'corta' }), /al menos 8/);
});

test('texto de derecha a izquierda y cifras propias', async () => {
  const ar = leerArchivos([{ nombre: 'ar.usfm', texto: fs.readFileSync(path.join(FX, 'ar-vd.usfm'), 'utf8') }]);
  const { html, ui, dir } = await construir({ libros: ar, clave: CLAVE, idioma: 'ar' });
  const p = partes(html);
  assert.equal(ui, 'ar'); assert.equal(dir, 'rtl'); assert.equal(p.lang, 'ar'); assert.equal(p.dir, 'rtl');
  const { m } = await N.open(CLAVE, p.blob);
  assert.equal(m.t[0].d, 'rtl'); assert.equal(m.t[0].g, 0x660);
});

test('idioma sin interfaz propia: cae a inglés y lo dice', async () => {
  const r = await hacer({ idioma: 'so' });
  assert.equal(r.ui, 'en');
  assert.equal(partes(r.html).title, 'Notes');
});

test('tabla de interfaz: todos los idiomas tienen todas las claves y la portada no delata nada', () => {
  const kc = Object.keys(UI.es.c).sort(), kr = Object.keys(UI.es.r).sort();
  for (const [cod, u] of Object.entries(UI)) {
    assert.deepEqual(Object.keys(u.c).sort(), kc, cod);
    assert.deepEqual(Object.keys(u.r).sort(), kr, cod);
    assert.ok(u.dir === 'ltr' || u.dir === 'rtl', cod);
    for (const v of Object.values(u.c).concat(Object.values(u.r))) assert.ok(typeof v === 'string' && v.length > 0, cod);
    assert.equal(DELATORAS.exec(JSON.stringify(u.c)), null, cod);
    assert.ok(!/[\\\/:*?"<>|]/.test(u.c.f), cod + ': nombre de archivo no válido');
  }
});

test('lector de zip: entradas guardadas y comprimidas', () => {
  const entradas = [['uno.usfm', Buffer.from('\\id GEN\n'), 0], ['dir/dos.usfm', Buffer.from('texto '.repeat(500)), 8]];
  const locales = [], centrales = [];
  let pos = 0;
  for (const [nombre, datos, metodo] of entradas) {
    const cuerpo = metodo ? zlib.deflateRawSync(datos) : datos, n = Buffer.from(nombre);
    const l = Buffer.alloc(30); l.writeUInt32LE(0x04034b50, 0); l.writeUInt16LE(metodo, 8); l.writeUInt32LE(cuerpo.length, 18); l.writeUInt32LE(datos.length, 22); l.writeUInt16LE(n.length, 26);
    const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(metodo, 10); c.writeUInt32LE(cuerpo.length, 20); c.writeUInt32LE(datos.length, 24); c.writeUInt16LE(n.length, 28); c.writeUInt32LE(pos, 42);
    locales.push(l, n, cuerpo); centrales.push(c, n);
    pos += 30 + n.length + cuerpo.length;
  }
  const cd = Buffer.concat(centrales), fin = Buffer.alloc(22);
  fin.writeUInt32LE(0x06054b50, 0); fin.writeUInt16LE(entradas.length, 8); fin.writeUInt16LE(entradas.length, 10); fin.writeUInt32LE(cd.length, 12); fin.writeUInt32LE(pos, 16);
  const salida = leerZip(Buffer.concat([...locales, cd, fin]));
  assert.deepEqual(salida.map(e => [e.nombre, e.datos.toString()]), entradas.map(([n, d]) => [n, d.toString()]));
});
