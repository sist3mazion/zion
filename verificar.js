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
    const { m } = N.parse((await N.unwrap(clave.trim(), N.b64d(r.piezas.blob))).data);
    console.log('✔ La clave abre. "' + (m.n || 'sin nombre') + '", ' + m.b.length + ' libros (' + m.b[0][0] + ' … ' + m.b[m.b.length - 1][0] + '), lectura ' + m.d + '.');
  } catch (e) { console.log('✖ La clave no abre este archivo.'); process.exit(3); }
}
main().catch(e => { console.error('Error: ' + e.message); process.exit(1); });
