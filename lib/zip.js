'use strict';
/** Lector mínimo de .zip (métodos 0 y 8), sin dependencias. Devuelve [{nombre, datos}]. */
const zlib = require('zlib');

function leerZip(buf) {
  let fin = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { fin = i; break; }
  }
  if (fin < 0) throw new Error('No es un zip válido');
  const total = buf.readUInt16LE(fin + 10);
  let p = buf.readUInt32LE(fin + 16);
  const salida = [];
  for (let n = 0; n < total; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('Zip dañado');
    const metodo = buf.readUInt16LE(p + 10), tam = buf.readUInt32LE(p + 20);
    const ln = buf.readUInt16LE(p + 28), le = buf.readUInt16LE(p + 30), lc = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const nombre = buf.toString('utf8', p + 46, p + 46 + ln);
    p += 46 + ln + le + lc;
    if (nombre.endsWith('/')) continue;
    const ini = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const crudo = buf.subarray(ini, ini + tam);
    if (metodo === 0) salida.push({ nombre, datos: Buffer.from(crudo) });
    else if (metodo === 8) salida.push({ nombre, datos: zlib.inflateRawSync(crudo) });
    else throw new Error('Método de compresión no soportado en ' + nombre);
  }
  return salida;
}

module.exports = { leerZip };
