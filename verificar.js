#!/usr/bin/env node
'use strict';
/**
 * Comprueba que un archivo lleva exactamente una versión publicada del programa (versiones.json), sin nada añadido.
 * Verifica siempre con el repositorio actualizado: una lista antigua no conoce las versiones nuevas.
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
  const v = r.version;
  if (v.actual && v.fecha === 'sin publicar') console.log('! Programa de esta carpeta, pero aún no está en versiones.json: no lo repartas hasta añadirlo (node versiones.js --añadir).');
  else if (v.actual) console.log('✔ Programa auténtico: versión actual (' + v.fecha + '), sin nada añadido, y no puede conectarse a la red.');
  else console.log('✔ Programa auténtico: versión anterior (' + v.fecha + '), sin nada añadido, y no puede conectarse a la red. Hay una versión más nueva.');
  if (v.aviso) console.log('! Aviso de esta versión: ' + v.aviso);
  if (r.invitacion) {
    console.log('  Es una invitación (envío a distancia): no lleva contenido, solo textos en ' + Object.keys(JSON.parse(r.piezas.ui)).length + ' idiomas.');
    if (r.anterior) console.log('✔ Sus textos son exactamente los de una versión anterior. Funciona, pero las invitaciones nuevas son más fáciles de usar: mejor mandar una nueva.');
    else if (!r.distintos.length) console.log('✔ Sus textos son exactamente los de este repositorio.');
    else console.log('! Textos distintos de los de este repositorio en: ' + r.distintos.join(', ') + '. Pueden ser de otra versión o estar cambiados: léelos antes de pasarla (una invitación con otras instrucciones es una trampa).');
    return;
  }
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
