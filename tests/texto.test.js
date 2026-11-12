'use strict';
/** Lectura de USFM y USFX. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { leerArchivos, filtrar, direccion, inicioNT } = require('../lib/texto');

const FX = path.join(__dirname, 'fixtures');
const usfm = t => leerArchivos([{ nombre: 'x.usfm', texto: t }]);
const dir = d => fs.readdirSync(path.join(FX, d)).map(f => ({ nombre: f, texto: fs.readFileSync(path.join(FX, d, f), 'utf8') }));
const NBSP = String.fromCharCode(160);

test('USFM: párrafos, versículos y nombre del libro', () => {
  const [l] = usfm('\\id GEN algo\n\\h Génesis\n\\toc1 Libro del Génesis\n\\toc2 Génesis\n\\mt2 Primer libro de\n\\mt1 GÉNESIS\n\\c 1\n\\p\n\\v 1 En el principio\ncreó Dios.\n\\v 2 Y la tierra.\n\\p\n\\v 3 Y dijo Dios.\n');
  assert.equal(l.id, 'GEN'); assert.equal(l.nombre, 'Génesis');
  assert.deepEqual(l.caps, [[1, ['p', 1, 'En el principio creó Dios.', 2, 'Y la tierra.'], ['p', 3, 'Y dijo Dios.']]]);
});

test('USFM: se descartan notas, referencias, introducciones y atributos de palabra', () => {
  const [l] = usfm('\\id JHN\n\\h Juan\n\\imt Introducción\n\\ip Texto de introducción que no debe salir.\n\\c 3\n\\s1 Título \\f + \\fr 3:1 \\ft nota en título\\f* de sección\n\\r (Mt 1:1)\n\\p\n' +
    '\\v 16 Porque de tal manera\\f + \\fr 3:16 \\ft Nota larga con \\+xt Ro 5:8\\+xt* dentro.\\f* amó \\w Dios|strong="G2316" lemma="θεός"\\w* al \\nd Señor\\nd*\\x - \\xo 3:16 \\xt Ro 5:8\\x*, dijo\\qt-s |who="Jesús"\\*: \\wj «venid»\\wj*.\n');
  assert.deepEqual(l.caps, [[3, ['s', 'Título de sección'], ['r', '(Mt 1:1)'], ['p', 16, 'Porque de tal manera amó Dios al Señor, dijo: «venid».']]]);
});

test('USFM: poesía, versículo repartido en varias líneas, línea en blanco y títulos de salmo', () => {
  const [l] = usfm('\\id PSA\n\\h Salmos\n\\c 23\n\\d Salmo de David.\n\\q1\n\\v 1 Jehová es mi pastor;\n\\q2 nada me faltará.\n\\b\n\\q1\n\\v 2 En lugares\n\\qs Selah\\qs*\n');
  assert.deepEqual(l.caps, [[23, ['d', 'Salmo de David.'], ['q1', 1, 'Jehová es mi pastor;'], ['q2', '', 'nada me faltará.'], ['b'], ['q1', 2, 'En lugares Selah']]]);
});

test('USFM: rangos, versículo vacío, espacio duro, tablas y marcadores desconocidos', () => {
  const [l] = usfm('\\id MAT\n\\h Mateo\n\\c 17\n\\p\n\\v 20 Texto.\n\\v 21\n\\v 22-23 Dos~juntos.\n\\zzz raro\n\\tr \\th1 Tribu \\tc2 12000\n');
  assert.deepEqual(l.caps, [[17, ['p', 20, 'Texto.', 21, '', '22-23', 'Dos' + NBSP + 'juntos. raro'], ['p', '', 'Tribu 12000']]]);
});

test('USFM: orden canónico, libros no bíblicos fuera, filtros y separador del NT', () => {
  const libros = usfm('\\id REV\n\\h Ap\n\\c 1\n\\p\n\\v 1 a\n\\id FRT\n\\c 1\n\\p\n\\v 1 portada\n\\id GEN\n\\h Gn\n\\c 1\n\\p\n\\v 1 b\n\\id TOB\n\\h Tob\n\\c 1\n\\p\n\\v 1 c\n\\id MAT\n\\h Mt\n\\c 1\n\\p\n\\v 1 d\n');
  assert.deepEqual(libros.map(l => l.id), ['GEN', 'TOB', 'MAT', 'REV']);
  assert.equal(inicioNT(libros), 2);
  assert.deepEqual(filtrar(libros, 'NT').map(l => l.id), ['MAT', 'REV']);
  assert.deepEqual(filtrar(libros, 'gen,rev').map(l => l.id), ['GEN', 'REV']);
});

test('USFM real (BSB): tres libros, capítulos sueltos, sin restos de marcadores', () => {
  const libros = leerArchivos(dir('en-bsb'));
  assert.deepEqual(libros.map(l => [l.id, l.nombre, l.caps.map(c => c[0])]), [['PSA', 'Psalm', [1, 23]], ['JHN', 'John', [3, 4]], ['JUD', 'Jude', [1]]]);
  const todo = JSON.stringify(libros);
  assert.ok(!/\\\\[a-z]|\|/.test(todo), 'quedan marcadores o atributos');
  const jn3 = libros[1].caps[0];
  assert.deepEqual(jn3[1], ['s', 'Jesus and Nicodemus']);
  const v16 = jn3.flat().indexOf(16);
  assert.match(jn3.flat()[v16 + 1], /^For God so loved the world/);
});

test('USFX real (RV1909): mismo modelo que USFM, sin números de Strong', () => {
  const libros = leerArchivos([{ nombre: 'es-rv1909.usfx.xml', texto: fs.readFileSync(path.join(FX, 'es-rv1909.usfx.xml'), 'utf8') }]);
  assert.deepEqual(libros.map(l => [l.id, l.nombre, l.caps.map(c => c[0])]), [['GEN', 'Génesis', [1]], ['PSA', 'Salmos', [23]], ['JHN', 'Juan', [3]], ['JUD', 'Judas', [1]]]);
  assert.deepEqual(libros[0].caps[0][1].slice(0, 3), ['p', 1, 'EN el principio crió Dios los cielos y la tierra.']);
  assert.ok(!/H\d{4}|<|&[a-z]+;/.test(JSON.stringify(libros)));
});

test('dirección de lectura: se deduce del texto, no de una tabla', () => {
  assert.equal(direccion(leerArchivos(dir('en-bsb'))), 'ltr');
  assert.equal(direccion(leerArchivos([{ nombre: 'ar.usfm', texto: fs.readFileSync(path.join(FX, 'ar-vd.usfm'), 'utf8') }])), 'rtl');
});

test('archivo USFM sin \\id: el código sale del nombre del archivo', () => {
  const libros = leerArchivos([{ nombre: '21ECCBSB.usfm', texto: '\\h Ecclesiastes\n\\c 1\n\\p\n\\v 1 Words.\n' }, { nombre: '20PROBSB.usfm', texto: '\\id PRO\n\\h Proverbs\n\\c 1\n\\p\n\\v 1 Proverbs.\n' }]);
  assert.deepEqual(libros.map(l => [l.id, l.caps.length]), [['PRO', 1], ['ECC', 1]]);
});
