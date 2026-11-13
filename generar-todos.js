#!/usr/bin/env node
'use strict';
/**
 * Genera UN archivo con todas las traducciones de traducciones.js (el «maestro»).
 *   node generar-todos.js <carpeta de fuentes> --clave "<clave>" [--salida dist/] [--ui es] [--solo es,ar] [--vref vref.txt]
 * --ui: idioma de la portada (por defecto el de la primera traducción). Al pasar una copia se puede cambiar.
 * --solo: solo esas traducciones. Desde el propio archivo, «Pasar una copia» también permite quitar idiomas.
 * La carpeta de fuentes debe contener los archivos de traducciones.js y eng.vrs (y vref.txt si alguna fila usa el formato 'lineas').
 * Necesita la orden xz (Linux, macOS) para comprimir con LZMA; sin ella usa zlib y el archivo sale ~40 % más grande.
 */
const fs = require('fs');
const path = require('path');
const { leerArchivos, sinTitulos, sustituir, sinFinal, unVersiculoPorParrafo, parchear } = require('./lib/texto');
const { leerLineas, faltantes } = require('./lib/lineas');
const { leerCsv } = require('./lib/csv');
const NOMBRES = require('./lib/nombres');
const { construir, hayXz } = require('./lib/paquete');
const UI = require('./src/ui');
const { leerZip } = require('./lib/zip');
const LISTA = require('./traducciones');

async function main() {
  const a = process.argv.slice(2), o = { _: [] };
  for (let i = 0; i < a.length; i++) a[i].startsWith('--') ? o[a[i].slice(2)] = a[++i] : o._.push(a[i]);
  const dir = o._[0], clave = o.clave || process.env.CLAVE;
  if (!dir || !clave) { console.error('Uso: node generar-todos.js <carpeta de fuentes> --clave "<clave>" [--salida dist/] [--ui es] [--solo es,ar]'); process.exit(1); }
  if (!hayXz()) console.log('AVISO: no encuentro la orden xz; comprimo con zlib (archivo ~40 % más grande).');
  const lista = [];
  const vref = path.join(dir, o.vref || 'vref.txt');
  const salida = o.salida || 'dist';
  const solo = o.solo ? o.solo.split(',') : null;
  fs.mkdirSync(salida, { recursive: true });
  for (const t of LISTA) {
    if (solo && !solo.includes(t.id)) continue;
    const f = path.join(dir, t.fuente);
    let libros, acerca = t.acerca, aviso = '';
    if (t.formato === 'lineas') {
      libros = leerLineas(fs.readFileSync(f, 'utf8'), fs.readFileSync(vref, 'utf8'), NOMBRES[t.nombres]);
      const falta = faltantes(libros, fs.readFileSync(path.join(dir, 'eng.vrs'), 'utf8'), NOMBRES.en);
      if (falta.length) {
        acerca += '\n\nAVISO: a esta copia le faltan ' + falta.length + ' pasajes por diferencias entre la numeración hebrea y la inglesa del formato de origen: ' + falta.join('; ') +
          '. Algunos (Mt 17:21, Mr 9:44…) los omiten a propósito las traducciones modernas. Para una copia completa hace falta el USFM de eBible.org.';
        aviso = ' (faltan ' + falta.length + ' pasajes)';
      }
    } else if (t.formato === 'zip') {
      const arch = leerZip(fs.readFileSync(f)).filter(e => /\.(usfm|sfm)$/i.test(e.nombre)).map(e => ({ nombre: path.basename(e.nombre), texto: e.datos.toString('utf8') }));
      libros = leerArchivos(arch);
      if (t.quitarTitulos) sinTitulos(libros, new RegExp(t.quitarTitulos));
      if (libros.length !== 66) throw new Error(t.id + ': el zip trae ' + libros.length + ' libros, no 66');
    } else if (t.formato === 'csv') {
      libros = leerCsv(fs.readFileSync(f, 'utf8'), NOMBRES[t.nombres], NOMBRES.en);
    } else {
      libros = leerArchivos([{ nombre: t.fuente, texto: fs.readFileSync(f, 'utf8') }]);
    }
    // retoques de la fuente (cada uno se declara en traducciones.js y se anota en «Acerca de»)
    const zipLibros = f2 => leerArchivos(leerZip(fs.readFileSync(path.join(dir, f2))).filter(e => /\.(usfm|sfm)$/i.test(e.nombre)).map(e => ({ nombre: path.basename(e.nombre), texto: e.datos.toString('utf8') })));
    for (const p of t.parches || []) {
      parchear(libros, zipLibros(p.fuente), p.libros, p.capitulos, (p.sustituciones || []).map(([e, r]) => [new RegExp(e, 'gu'), r]));
      aviso += ' [parche ' + p.fuente + ': ' + (p.libros || []).concat(Object.entries(p.capitulos || {}).map(([k, v]) => k + ' ' + v.join(','))).join(', ') + ']';
    }
    if (t.sustituciones) sustituir(libros, t.sustituciones.map(([e, r]) => [new RegExp(e, 'gu'), r]));
    if (t.quitarFinal) aviso += ' [' + sinFinal(libros, new RegExp(t.quitarFinal, 'u')) + ' notas finales quitadas]';
    if (t.versiculoPorParrafo) unVersiculoPorParrafo(libros);
    if (t.formato === 'zip') {    // la comprobación va después de los retoques, para medir lo que de verdad se reparte
      const falta = faltantes(libros, fs.readFileSync(path.join(dir, 'eng.vrs'), 'utf8'), NOMBRES.en);
      if (falta.length) aviso = ' (' + falta.length + ' tramos sin texto: ' + falta.slice(0, 4).join('; ') + (falta.length > 4 ? '…' : '') + ')' + aviso;
    }
    lista.push({ libros, idioma: t.id, nombre: t.nombre, acerca });
    console.log(t.id.padEnd(4), String(libros.length).padStart(2) + ' libros' + aviso);
  }
  if (!lista.length) throw new Error('Ninguna traducción coincide con --solo');
  const r = await construir({ traducciones: lista, clave, ui: o.ui });
  const out = path.join(salida, (UI[r.ui] || UI.en).c.f + '.html');
  fs.writeFileSync(out, r.html);
  console.log('Hecho: ' + out + ' · ' + r.textos + ' traducciones · ' + (Buffer.byteLength(r.html) / 1048576).toFixed(2) + ' MB · ' + r.compresion + ' · portada "' + r.ui + '"');
}
main().catch(e => { console.error('Error: ' + e.message); process.exit(1); });
