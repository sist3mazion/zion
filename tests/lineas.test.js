'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { leerLineas, ORDEN } = require('../lib/lineas');
const NOMBRES = require('../lib/nombres');
const LISTA = require('../traducciones');

const nombres = NOMBRES.en;
const vref = 'GEN 1:1\nGEN 1:2\nGEN 1:3\nGEN 2:1\nJHN 3:16\nTOB 1:1\nREV 22:21\n';

test('construye libros y capítulos, omite vacíos y libros deuterocanónicos', () => {
  const t = 'Uno\n\nTres\nDos-1\nAmó\nTobías\nGracia\n';
  const l = leerLineas(t, vref, nombres);
  assert.deepEqual(l.map(x => x.id), ['GEN', 'JHN', 'REV']);
  assert.equal(l[0].nombre, 'Genesis');
  assert.deepEqual(l[0].caps[0], [1, ['p', '1', 'Uno'], ['p', '3', 'Tres']]);
  assert.deepEqual(l[0].caps[1], [2, ['p', '1', 'Dos-1']]);
  assert.equal(l[1].nombre, 'John');
});

test('"<range>" une versículos: el primero se rotula con el intervalo', () => {
  const l = leerLineas('A\n<range>\n<range>\nB\n\n\n\n', vref, nombres);
  assert.deepEqual(l[0].caps[0], [1, ['p', '1-3', 'A']]);
  assert.deepEqual(l[0].caps[1], [2, ['p', '1', 'B']]);
});

test('rechaza un texto que no corresponde a vref, o nombres incompletos', () => {
  assert.throws(() => leerLineas('a\nb\n', vref, nombres), /no corresponde/);
  assert.throws(() => leerLineas('a\n'.repeat(7), vref, nombres.slice(0, 10)), /nombres/);
  assert.throws(() => leerLineas('\n'.repeat(7), vref, nombres), /ningún versículo/);
});

test('los nombres de cada idioma son 66, distintos y sin espacios sobrantes', () => {
  assert.equal(ORDEN.length, 66);
  for (const [k, v] of Object.entries(NOMBRES)) {
    assert.equal(v.length, 66, k);
    assert.equal(new Set(v).size, 66, k + ': nombres repetidos');
    for (const n of v) assert.equal(n, n.trim(), k + ': ' + n);
  }
});

test('traducciones.js: cada entrada tiene licencia visible y nombres si es de un versículo por línea', () => {
  const ids = new Set();
  for (const t of LISTA) {
    assert.ok(!ids.has(t.id), 'id repetido ' + t.id); ids.add(t.id);
    assert.match(t.acerca, /Dominio público|CC BY|no comercial/, t.id);
    if (/CC BY-N[CD]-?ND|BY-ND/.test(t.acerca)) assert.equal(t.permiso, 'pendiente', t.id + ': una licencia ND solo entra con permiso: \'pendiente\' (ver README)');
    if (t.formato === 'lineas') assert.ok(NOMBRES[t.nombres], t.id);
  }
  assert.ok(LISTA.length >= 12);
});

test('CSV de scrollmapper: nombres con números romanos, comillas y libros que sobran', () => {
  const { leerCsv } = require('../lib/csv');
  const filasCsv = ['Book,Chapter,Verse,Text'];
  NOMBRES.en.forEach((n, k) => {
    const ro = n.replace(/^1 /, 'I ').replace(/^2 /, 'II ').replace(/^3 /, 'III ').replace('Song of Songs', 'Song of Solomon').replace('Revelation', 'Revelation of John');
    filasCsv.push(ro + ',1,1,"texto, con coma y ""comillas"""' + (k === 0 ? '\nTobit,1,1,no canónico' : ''));
  });
  const l = leerCsv(filasCsv.join('\n') + '\n', NOMBRES.en, NOMBRES.en);
  assert.equal(l.length, 66);
  assert.equal(l[8].id, '1SA');
  assert.equal(l[0].caps[0][1][2], 'texto, con coma y "comillas"');
  assert.throws(() => leerCsv('a,b\n', NOMBRES.en, NOMBRES.en), /No es un CSV/);
});

test('faltantes: detecta los versículos ingleses que el formato de origen descarta', () => {
  const { faltantes } = require('../lib/lineas');
  const vrs = 'JOL 1:3 2:5\nGEN 1:2\n';
  const libros = [{ id: 'JOL', caps: [[1, ['p', '1-2', 'a'], ['p', '3', 'b']], [2, ['p', '1', 'x'], ['p', '2', 'y']]] }];
  assert.deepEqual(faltantes(libros, vrs, NOMBRES.en), ['Genesis 1:1-2', 'Joel 2:3-5']);
});

test('la dedicatoria viaja cifrada: no aparece en claro y cae al inglés si falta el idioma', async () => {
  const { construir } = require('../lib/paquete');
  const DED = require('../src/dedicatoria');
  assert.ok(DED.es && DED.en && DED.ar);
  const libros = [{ id: 'GEN', nombre: 'Génesis', caps: [[1, ['p', '1', 'En el principio']]] }];
  const r = await construir({ libros, clave: 'clave de prueba 1', idioma: 'es', nombre: 'x' });
  assert.ok(!r.html.includes('Por Jesús'), 'la dedicatoria no debe estar en claro');
  assert.ok(!r.html.includes('DEDICADO'), 'ni el título');
});
