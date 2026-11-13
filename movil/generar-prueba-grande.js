#!/usr/bin/env node
'use strict';
/**
 * Genera una página de prueba del tamaño del archivo con todos los idiomas (~25 MB), sin ninguna Biblia y sin red.
 * Usa el núcleo real de src/app.js (cifrado y descompresor LZMA). Mide en el teléfono lo que decide si el archivo único es viable: si abre, cuánto tarda en cargar,
 * cuánto tarda la clave, cuánto tarda en descomprimir el idioma más grande (texto sin sentido en escritura birmana
 * que se comprime como el birmano real), y cuánta memoria usa.
 *
 *   node movil/generar-prueba-grande.js [--mb 25] [--salida dist/prueba-grande.html]
 *
 * Necesita la orden `xz` (Linux, macOS). El resultado no se sube al repositorio.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');
const { cargarNucleo } = require('../lib/nucleo');

const a = process.argv.slice(2), o = {};
for (let i = 0; i < a.length; i += 2) o[a[i].replace(/^--/, '')] = a[i + 1];
const MB = +(o.mb || 25), SALIDA = o.salida || path.join('dist', 'prueba-grande.html');
const CLAVE = 'prueba prueba prueba', TAM = Math.round(16.8 * 1048576), PROPS = 93;   // 93 = lc3 lp0 pb2 (LZP en la app)

// texto sin sentido con letras birmanas, frecuencias tipo Zipf: se comprime como el birmano real (16,8 MB -> ~1,3 MB)
function texto() {
  let x = 7; const r = () => (x = (Math.imul(x, 1103515245) + 12345) >>> 0) / 4294967296;
  const V = 2000, pal = [], cum = []; let s = 0;
  for (let i = 0; i < V; i++) { let w = ''; const L = 2 + Math.floor(r() * 5); for (let j = 0; j < L; j++) w += String.fromCharCode(0x1000 + Math.floor(r() * 0x2a)); pal.push(w); }
  for (let i = 0; i < V; i++) { s += 1 / Math.pow(i + 1, 1.33); cum.push(s); }
  const partes = []; let n = 0;
  while (n < TAM) {
    const u = r() * s; let lo = 0, hi = V - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < u) lo = m + 1; else hi = m; }
    const w = pal[lo] + (r() < 0.08 ? '။ ' : ' '); partes.push(w); n += Buffer.byteLength(w);
  }
  return Buffer.from(partes.join(''), 'utf8').subarray(0, TAM);
}

(async () => {
  const N = cargarNucleo();
  const plano = texto();
  const z = cp.execFileSync('xz', ['--format=raw', '--lzma1=preset=9e,dict=16MiB', '-c'], { input: plano, maxBuffer: 1 << 28 });
  const caja = await N.wrap(CLAVE, new Uint8Array(z));                      // sal(16) | iv(12) | AES-GCM, como la app
  const relleno = crypto.randomBytes(Math.max(0, Math.floor(MB * 1048576 * 3 / 4) - caja.length));
  const blob = Buffer.concat([Buffer.from(caja), relleno]).toString('base64');
  const meta = { n: caja.length, size: TAM, props: PROPS, sha: crypto.createHash('sha256').update(plano).digest('hex'), clave: CLAVE };
  const nucleo = /\/\* <core> \*\/([\s\S]*?)\/\* <\/core> \*\//.exec(fs.readFileSync(path.join(__dirname, '..', 'src', 'app.js'), 'utf8'))[1];

  const html = `<!doctype html>
<html lang="es" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<meta name="referrer" content="no-referrer">
<title>Prueba de archivo grande</title>
<style>
body{font:15px/1.4 system-ui,sans-serif;margin:0;padding:12px;background:#fff;color:#111}
h1{font-size:18px;margin:0 0 4px}p{margin:6px 0}
table{border-collapse:collapse;width:100%;margin:8px 0}
td{border-top:1px solid #ddd;padding:5px 2px;vertical-align:top;word-break:break-word}
td:first-child{width:55%;color:#444}td:last-child{font-weight:600}
.ok{color:#0a7a2f}.no{color:#b00020}
button{font:inherit;padding:10px 14px;margin:4px 0;border:1px solid #888;border-radius:8px;background:#f3f3f3}
pre{white-space:pre-wrap;word-break:break-all;background:#f6f6f6;padding:8px;border-radius:8px;font-size:12px}
</style>
</head>
<body>
<h1>Prueba de archivo grande (${MB} MB)</h1>
<p>No contiene ninguna Biblia ni se conecta a nada. Mide si este teléfono puede con un archivo de este tamaño. Espera a que ponga <b>Terminado</b>, haz una captura de toda la pantalla y anota cómo lo abriste (WhatsApp, Telegram, gestor de archivos…) y el modelo del teléfono.</p>
<p id="estado">Cargando…</p>
<table id="t"></table>
<button id="otra" type="button" hidden>Repetir</button>
<pre id="res"></pre>
<script type="application/json" id="m">${JSON.stringify(meta)}</script>
<script type="application/octet-stream" id="d">${blob}</script>
<script>
(function () {
'use strict';
var T0 = performance.now(), D = document;
${nucleo}
var M = JSON.parse(D.getElementById('m').textContent), filas = [], corriendo = false;
function mem() { var m = performance.memory; return m ? Math.round(m.usedJSHeapSize / 1048576) + ' MB' : 'no disponible'; }
function fila(k, v, mal) {
  var tr = D.createElement('tr'), a = D.createElement('td'), b = D.createElement('td');
  a.textContent = k; b.textContent = v; if (mal != null) b.className = mal ? 'no' : 'ok';
  tr.appendChild(a); tr.appendChild(b); D.getElementById('t').appendChild(tr); filas.push(k + ': ' + v);
}
function s(ms) { return (ms / 1000).toFixed(2) + ' s'; }
function pausa() { return new Promise(function (r) { setTimeout(r, 30); }); }
async function paso(nombre, fn) {
  D.getElementById('estado').textContent = nombre + '…'; await pausa();
  var t = performance.now();
  try { var v = await fn(); fila(nombre, s(performance.now() - t) + (v ? ' · ' + v : ''), false); return true; }
  catch (e) { fila(nombre, 'FALLA: ' + (e && e.message || e), true); return false; }
}
async function prueba() {
  if (corriendo) return; corriendo = true;
  D.getElementById('t').textContent = ''; filas = []; D.getElementById('otra').hidden = true;
  var n = navigator;
  fila('Navegador', n.userAgent);
  fila('Memoria del teléfono (aprox.)', n.deviceMemory ? n.deviceMemory + ' GB' : 'no disponible');
  fila('Núcleos', String(n.hardwareConcurrency || '?'));
  fila('Hasta poder ejecutar (carga del archivo)', s(T0));
  fila('Memoria al empezar', mem());
  fila('Contexto seguro / cifrado', (window.isSecureContext ? 'sí' : 'no') + ' / ' + (window.crypto && crypto.subtle ? 'sí' : 'no'), !(window.crypto && crypto.subtle));
  var b64, caja, plano, salida;
  var ok = await paso('Leer el bloque de ${MB} MB', function () { b64 = D.getElementById('d').textContent; return Math.round(b64.length / 1048576) + ' M caracteres'; });
  ok = ok && await paso('Sacar el idioma (1,3 MB)', function () { caja = b64d(b64.slice(0, Math.ceil(M.n / 3) * 4)).subarray(0, M.n); });
  ok = ok && await paso('Clave y descifrado', async function () { plano = (await unwrap(M.clave, caja)).data; });
  ok = ok && await paso('Descomprimir el idioma más grande (16,8 MB)', function () { salida = unlz(plano, M.props, M.size); });
  ok = ok && await paso('Comprobar que salió exacto', async function () {
    var h = new Uint8Array(await crypto.subtle.digest('SHA-256', salida)), x = '', i;
    for (i = 0; i < h.length; i++) x += (h[i] < 16 ? '0' : '') + h[i].toString(16);
    if (x !== M.sha) throw new Error('distinto');
    return 'idéntico';
  });
  ok = ok && await paso('Pasar a texto', function () { return Math.round(new TextDecoder().decode(salida).length / 1048576) + ' M letras'; });
  fila('Memoria tras abrir el idioma', mem());
  await paso('Esfuerzo: descodificar los ${MB} MB enteros', function () { return Math.round(b64d(b64).length / 1048576) + ' MB'; });
  fila('Memoria máxima vista', mem());
  b64 = caja = plano = salida = null;
  fila('Resultado', ok ? 'TODO BIEN' : 'ALGO FALLÓ', !ok);
  D.getElementById('estado').textContent = 'Terminado.';
  D.getElementById('res').textContent = filas.join('\\n');
  D.getElementById('otra').hidden = false; corriendo = false;
}
D.getElementById('otra').onclick = prueba;
setTimeout(prueba, 300);
})();
</script>
</body>
</html>
`;
  fs.mkdirSync(path.dirname(path.resolve(SALIDA)), { recursive: true });
  fs.writeFileSync(SALIDA, html);
  console.log('Hecho: ' + SALIDA + ' · ' + (Buffer.byteLength(html) / 1048576).toFixed(2) + ' MB · idioma de prueba ' + (z.length / 1048576).toFixed(2) + ' MB comprimido');
})().catch(e => { console.error('Error: ' + e.message); process.exit(1); });
