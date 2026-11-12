'use strict';
/**
 * Lee una traducción en CSV "Book,Chapter,Verse,Text" (el que publica scrollmapper/bible_databases).
 * La numeración es la propia de la traducción. Solo se toman los 66 libros protestantes.
 */
const { ORDEN } = require('./lineas');

function filas(t) {
  const R = [];
  let f = '', r = [], q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { r.push(f); f = ''; }
    else if (c === '\n') { r.push(f); R.push(r); r = []; f = ''; }
    else if (c !== '\r') f += c;
  }
  if (f || r.length) { r.push(f); R.push(r); }
  return R;
}

function normalizar(n) {
  return n.replace(/^III /, '3 ').replace(/^II /, '2 ').replace(/^I /, '1 ')
    .replace('Song of Solomon', 'Song of Songs').replace('Revelation of John', 'Revelation');
}

function leerCsv(texto, nombres, ingles) {
  const R = filas(String(texto));
  if (!R.length || R[0].join(',') !== 'Book,Chapter,Verse,Text') throw new Error('No es un CSV Book,Chapter,Verse,Text');
  const por = new Map();
  for (const r of R.slice(1)) {
    if (r.length < 4) continue;
    const k = ingles.indexOf(normalizar(r[0]));
    const t = r[3].replace(/\s+/g, ' ').trim();
    if (k < 0 || !t) continue;
    if (!por.has(k)) por.set(k, new Map());
    const L = por.get(k), c = +r[1];
    if (!L.has(c)) L.set(c, []);
    L.get(c).push(['p', String(+r[2]), t]);
  }
  const salida = [];
  for (const k of [...por.keys()].sort((a, b) => a - b)) {
    const caps = [...por.get(k).keys()].sort((a, b) => a - b).map(c => [c].concat(por.get(k).get(c)));
    salida.push({ id: ORDEN[k], nombre: nombres[k], caps });
  }
  if (salida.length !== 66) throw new Error('El CSV tiene ' + salida.length + ' libros reconocidos, no 66');
  return salida;
}

module.exports = { leerCsv };
