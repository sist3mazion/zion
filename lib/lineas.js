'use strict';
/**
 * Lee una traducción en formato "un versículo por línea" (el que publica BibleNLP/ebible-corpus)
 * junto a su lista de referencias (vref.txt) y devuelve el mismo modelo que texto.leerArchivos():
 *
 *   [{ id:'GEN', nombre:'Génesis', caps:[ [1, ['p', '1', 'texto'], ['p', '2', 'texto'] ], … ] }, …]
 *
 * - Una línea vacía es un versículo que la traducción no tiene: se omite.
 * - Una línea "<range>" continúa el versículo anterior (versículos unidos): el anterior se rotula "3-4".
 * - Solo los 66 libros protestantes. La numeración es la del original (hebreo/griego): en Joel, Malaquías
 *   y algunos Salmos puede diferir de la que imprime la traducción.
 */
const { AT, NT } = require('./texto');

const ORDEN = AT.concat(NT);

function leerLineas(texto, vref, nombres) {
  const L = String(texto).split('\n'), R = String(vref).split('\n');
  if (Math.abs(L.length - R.length) > 1) throw new Error('El texto (' + L.length + ' líneas) no corresponde a vref.txt (' + R.length + ')');
  if (!Array.isArray(nombres) || nombres.length !== ORDEN.length) throw new Error('Hacen falta los nombres de los ' + ORDEN.length + ' libros');
  const por = new Map();
  for (let i = 0; i < R.length; i++) {
    const m = /^([0-9A-Z]{3}) (\d+):(\d+)$/.exec(R[i]);
    if (!m || !ORDEN.includes(m[1])) continue;
    const t = (L[i] || '').replace(/\s+/g, ' ').trim();
    let libro = por.get(m[1]);
    if (!libro) por.set(m[1], libro = new Map());
    const c = +m[2];
    if (!libro.has(c)) libro.set(c, []);
    libro.get(c).push({ v: +m[3], t });
  }
  const salida = [];
  for (const id of ORDEN) {
    const libro = por.get(id);
    if (!libro) continue;
    const caps = [];
    for (const c of [...libro.keys()].sort((a, b) => a - b)) {
      const vs = libro.get(c), bloques = [];
      for (let k = 0; k < vs.length; k++) {
        const { v, t } = vs[k];
        if (!t || t === '<range>') continue;
        let fin = v;
        while (k + 1 < vs.length && vs[k + 1].t === '<range>') { k++; fin = vs[k].v; }
        bloques.push(['p', fin > v ? v + '-' + fin : String(v), t]);
      }
      if (bloques.length) caps.push([c].concat(bloques));
    }
    if (caps.length) salida.push({ id, nombre: nombres[ORDEN.indexOf(id)], caps });
  }
  if (!salida.length) throw new Error('El texto no contiene ningún versículo');
  return salida;
}

/**
 * Versículos de la numeración inglesa (eng.vrs) que el texto no trae. Pasa cuando el original (hebreo) tiene menos
 * versículos en un capítulo que la traducción: el formato de un versículo por línea los descarta.
 * @returns {string[]} p. ej. ['Joel 2:28-32', 'Joel 3:6-21', …]
 */
function faltantes(libros, vrs, nombres) {
  const esp = {};
  for (const l of String(vrs).split('\n')) {
    const m = /^([0-9A-Z]{3})((?: \d+:\d+)+)\s*$/.exec(l);
    if (m) esp[m[1]] = m[2].trim().split(' ').map(x => x.split(':').map(Number));
  }
  const fuera = [];
  for (const id of ORDEN) {
    const l = libros.find(x => x.id === id);
    if (!esp[id]) continue;
    for (const [c, n] of esp[id]) {
      const cap = l && l.caps.find(x => x[0] === c);
      const hay = new Set();
      if (cap) for (const b of cap.slice(1)) {
        if (/^[sSrdab]$/.test(b[0])) continue;                          // títulos y líneas en blanco
        for (let i = 1; i + 1 < b.length; i += 2) {                       // etiqueta, texto, etiqueta, texto…
          if (!b[i] || !b[i + 1]) continue;
          const [a, z] = String(b[i]).replace(/[^\d-]/g, '').split('-').map(Number);
          for (let v = a; v <= (z || a); v++) hay.add(v);
        }
      }
      let ini = 0;
      for (let v = 1; v <= n + 1; v++) {
        if (v <= n && !hay.has(v)) { if (!ini) ini = v; }
        else if (ini) { fuera.push(nombres[ORDEN.indexOf(id)] + ' ' + c + ':' + (v - 1 > ini ? ini + '-' + (v - 1) : ini)); ini = 0; }
      }
    }
  }
  return fuera;
}

module.exports = { leerLineas, faltantes, ORDEN };
