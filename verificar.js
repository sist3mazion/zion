#!/usr/bin/env node
'use strict';
/**
 * Comprueba que un archivo lleva exactamente el programa de esta carpeta, sin nada añadido.
 *
 *   node verificar.js dist/notas.html            solo el programa
 *   node verificar.js dist/notas.html --clave    además lo abre (pide la clave) y dice qué contiene
 *
 * Sirve para quien reparte: antes de pasar una copia que ha recibido de otro, puede saber si es auténtica.
 */
const fs = require('fs');
const { comprobar } = require('./lib/paquete');
const { cargarNucleo } = require('./lib/nucleo');

async function main() {
  const args = process.argv.slice(2);
  const ruta = args.find(a => !a.startsWith('--'));
  if (!ruta) { console.log('Uso: node verificar.js <archivo.html> [--clave "<clave>"]'); process.exit(1); }
  const r = comprobar(fs.readFileSync(ruta, 'utf8'));
  if (!r.ok) { console.log('✖ NO AUTÉNTICO. ' + r.motivo); process.exit(2); }
  console.log('✔ Programa auténtico: es el de esta carpeta, sin nada añadido, y no puede conectarse a la red.');
  console.log('  Portada: "' + r.piezas.title + '" (' + r.piezas.lang + '). Contenido cifrado: ' + (r.piezas.blob.length * 3 / 4 / 1048576).toFixed(2) + ' MB.');
  const i = args.indexOf('--clave');
  if (i < 0) return;
  const clave = args[i + 1] || process.env.CLAVE;
  if (!clave) { console.log('  (pasa la clave tras --clave o en la variable CLAVE para ver el contenido)'); return; }
  const N = cargarNucleo();
  try {
    const { m } = await N.open(clave.trim(), r.piezas.blob);
    console.log('✔ La clave abre. ' + m.t.length + (m.t.length === 1 ? ' traducción:' : ' traducciones:'));
    for (const t of m.t) console.log('  ' + t.l.padEnd(4) + '"' + (t.n || 'sin nombre') + '", ' + t.b.length + ' libros (' + t.b[0][0] + ' … ' + t.b[t.b.length - 1][0] + '), lectura ' + t.d + ', ' + t.k.length + ' bloques ' + (t.k[0][2] === 'x' ? 'LZMA' : 'zlib') + '.');
  } catch (e) { console.log('✖ La clave no abre este archivo.'); process.exit(3); }
}
main().catch(e => { console.error('Error: ' + e.message); process.exit(1); });
