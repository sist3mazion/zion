'use strict';
/**
 * Mensajes: CPace (draft-irtf-cfrg-cpace-21, X25519 y SHA-512) con sus vectores oficiales, la conversación completa,
 * los ataques que no deben abrir nada, el secreto hacia delante, los límites del texto y la lectura de lo pegado.
 * Todo sobre el núcleo real de src/app.js.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { cargarNucleo, RUTA_X2 } = require('../lib/nucleo');
const UI = require('../src/ui');

const N = cargarNucleo();
const X2 = new Function(fs.readFileSync(RUTA_X2, 'utf8') + '\nreturn X2;')();
const V = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'cpace-x25519-sha512.json'), 'utf8'));
const hex = s => new Uint8Array(Buffer.from(s, 'hex'));
const aHex = b => Buffer.from(b).toString('hex');
const enc = s => new TextEncoder().encode(s);
const B64 = /^[A-Za-z0-9+/]+$/;
const NUM = '482109';

// una conversación entera hasta tener las claves de los dos lados (A empieza, B acepta, A comprueba)
async function conversar(pinA = NUM, pinB = NUM) {
  const a = await N.cstart(pinA);
  const b = await N.caccept(pinB, a.b);
  const fa = b && await N.cfinish(a.ya, a.sid, a.Ya, b.b);
  return { a, b, fa };
}

test('CPace: los vectores oficiales del borrador 21 (X25519, SHA-512): cadenas, generador, Ya, Yb, K e ISK', async () => {
  for (const [e, s] of V.prepend_len) assert.equal(aHex(N.lenp(hex(e))), s);
  assert.equal(aHex(N.lenp(new Uint8Array(127))).slice(0, 2), '7f');
  assert.equal(aHex(N.lenp(new Uint8Array(128))).slice(0, 4), '8001');
  assert.equal(aHex(N.lvc(...V.lv_cat.entrada.map(hex))), V.lv_cat.salida);
  // generator_string, su hash, el elemento del cuerpo y el generador
  const prs = hex(V.PRS), ci = hex(V.CI), sid = hex(V.sid);
  const gs = N.lvc(N.CPD, prs, new Uint8Array(128 - 1 - N.lenp(prs).length - N.lenp(N.CPD).length), ci, sid);
  assert.equal(aHex(gs), V.generator_string);
  assert.equal(aHex((await N.sha512(gs)).subarray(0, 32)), V.hash);
  const g = await N.cgen(prs, ci, sid);
  assert.equal(aHex(g), V.g);
  // los mensajes de A y B y el punto secreto, por los dos lados
  const Ya = N.cmul(hex(V.ya), g), Yb = N.cmul(hex(V.yb), g);
  assert.equal(aHex(Ya), V.Ya); assert.equal(aHex(Yb), V.Yb);
  const K1 = N.cmul(hex(V.ya), Yb), K2 = N.cmul(hex(V.yb), Ya);
  assert.equal(aHex(K1), V.K); assert.equal(aHex(K2), V.K);
  // transcript_ir e ISK; K se borra tras usarlo
  assert.equal(aHex(N.cat(N.lvc(Ya, hex(V.ADa)), N.lvc(Yb, hex(V.ADb)))), V.transcript_ir);
  assert.equal(aHex(await N.cisk(sid, K1, Ya, hex(V.ADa), Yb, hex(V.ADb))), V.ISK_ir);
  assert.equal(aHex(K1), '00'.repeat(32), 'K debe quedar a cero');
});

test('CPace: puntos de orden pequeño (u0 a ub): el resultado del borrador, y abortan los que deben', () => {
  const s = hex(V.orden_bajo.s);
  V.orden_bajo.u.forEach((u, i) => {
    if (V.orden_bajo.abortan.includes(i)) assert.throws(() => N.cmul(s, hex(u)), 'u' + i.toString(16) + ' debe abortar');
    else assert.equal(aHex(N.cmul(s, hex(u))), V.orden_bajo.q[i], 'u' + i.toString(16));
  });
});

test('CPace: con un punto de orden pequeño en el inicio o en la aceptación no sale ninguna clave', async () => {
  const { a } = await conversar();
  for (const i of V.orden_bajo.abortan) {
    const u = hex(V.orden_bajo.u[i]);
    // un inicio con Ya de orden pequeño (con su comprobación bien hecha, para que llegue a usarse)
    const st = N.cat(a.sid, u);
    assert.equal(await N.caccept(NUM, N.cat(st, await N.sum(st, N.INF2))), null);
    // una aceptación con Yb de orden pequeño
    assert.equal(await N.cfinish(a.ya, a.sid, a.Ya, N.cat(u, new Uint8Array(32))), null);
  }
});

test('librería: expone solo X25519 y el Elligator 2 de RFC 9380, que coincide con la fórmula de referencia del borrador', () => {
  assert.deepEqual(Object.keys(X2).sort(), ['_map_to_curve_elligator2_curve25519', 'x25519']);
  const p = (1n << 255n) - 19n, A = 486662n, pw = (b, e) => { let r = 1n; b %= p; while (e > 0n) { if (e & 1n) r = r * b % p; b = b * b % p; e >>= 1n; } return r; };
  // la del apéndice del borrador: v = -A / (1 + z r^2), epsilon = legendre(v^3 + A v^2 + v), x = epsilon v - (1 - epsilon) A / 2
  const ref = r => {
    const v = (p - A) * pw(1n + 2n * r * r, p - 2n) % p;
    const l = pw((v * v % p * v + A * v % p * v + v) % p, (p - 1n) / 2n);
    return l === 1n ? v : (p - v - A + 2n * p) % p;
  };
  for (let i = 0; i < 300; i++) {
    const r = N.fle(N.rand(32)) % p, m = X2._map_to_curve_elligator2_curve25519(r);
    assert.equal(m.xMn * N.finv(m.xMd) % p, ref(r));
  }
});

test('conversación: inicio, aceptación y mensajes en los dos sentidos, con tamaños fijos (70, 86 y 574 caracteres)', async () => {
  const { a, b, fa } = await conversar();
  assert.ok(fa, 'A debe aceptar la aceptación');
  const inicio = N.b64u(a.b), acepto = N.b64u(b.b);
  assert.equal(inicio.length, 70); assert.equal(acepto.length, 86);
  assert.match(inicio, B64); assert.match(acepto, B64);
  assert.ok(await N.cok(N.u64(inicio)));
  // A escribe con su clave, B lee con la misma; y al revés
  const m0 = await N.cseal(fa.a, a.sid, 0, 'Mañana a las 8, en el sitio de siempre.');
  assert.equal(N.b64u(m0).length, 574); assert.match(N.b64u(m0), B64);
  assert.deepEqual(await N.copen(b.keys.a, b.sid, N.u64(N.b64u(m0))), { n: 0, t: 'Mañana a las 8, en el sitio de siempre.' });
  const r0 = await N.cseal(b.keys.b, b.sid, 0, 'De acuerdo.');
  assert.deepEqual(await N.copen(fa.b, a.sid, r0), { n: 0, t: 'De acuerdo.' });
  // cada mensaje es distinto aunque el texto sea el mismo, y todos miden lo mismo
  const otro = await N.cseal(fa.a, a.sid, 1, 'De acuerdo.');
  assert.notEqual(aHex(otro), aHex(r0)); assert.equal(otro.length, r0.length);
  // las claves no se pueden sacar de la memoria como bytes
  for (const k of [fa.a, fa.b, b.keys.a, b.keys.b]) await assert.rejects(crypto.subtle.exportKey('raw', k));
});

test('el número: da igual cómo se escriban las cifras; con otro número no hay conversación', async () => {
  // las mismas cifras en árabe, con espacios o en persa son el mismo número
  for (const pin of ['٤٨٢١٠٩', '482 109', '۴۸۲-۱۰۹']) assert.ok((await conversar(NUM, pin)).fa, pin);
  const mal = await conversar(NUM, '482108');
  assert.equal(mal.fa, null, 'con otro número la aceptación no vale');
  // aunque A siguiera adelante con sus claves, lo que escribiera B no se abriría
  const { a, b } = await conversar(NUM, '000000');
  const fa2 = await N.cfinish(a.ya, a.sid, a.Ya, b.b);
  assert.equal(fa2, null);
});

test('nadie se mete en medio: aceptación falsa o tocada, mensaje de un tercero, reflejado, de otra conversación o tocado: no abren', async () => {
  const { a, b, fa } = await conversar();
  // quien ve el inicio pero no sabe el número no puede fabricar una aceptación buena
  for (const pin of ['123456', '000000', '482110']) {
    const c = await N.caccept(pin, a.b);
    assert.equal(await N.cfinish(a.ya, a.sid, a.Ya, c.b), null, pin);
  }
  // la aceptación buena con un bit cambiado en Yb o en la etiqueta
  for (const i of [0, 31, 32, 63]) { const t = b.b.slice(); t[i] ^= 1; assert.equal(await N.cfinish(a.ya, a.sid, a.Ya, t), null); }
  const m = await N.cseal(fa.a, a.sid, 0, 'hola');
  // un tercero con otra conversación (mismo número) no escribe en esta
  const x = await conversar();
  assert.equal(await N.copen(b.keys.a, b.sid, await N.cseal(x.fa.a, x.a.sid, 0, 'soy yo')), null);
  assert.equal(await N.copen(b.keys.a, b.sid, await N.cseal(x.fa.a, b.sid, 0, 'soy yo')), null);
  // el mensaje de A devuelto a A, o leído en otra conversación
  assert.equal(await N.copen(fa.b, a.sid, m), null);
  assert.equal(await N.copen(x.b.keys.a, x.b.sid, m), null);
  // un bit cambiado en cualquier sitio
  for (const i of [0, 11, 12, 200, 429]) { const t = m.slice(); t[i] ^= 1; assert.equal(await N.copen(b.keys.a, b.sid, t), null); }
  // y la buena sigue abriendo
  assert.equal((await N.copen(b.keys.a, b.sid, m)).t, 'hola');
});

test('secreto hacia delante: terminada la conversación, los bloques guardados no se abren ni sabiendo el número', async () => {
  const { a, b, fa } = await conversar();
  const guardado = await N.cseal(fa.a, a.sid, 0, 'esto no debe leerse después');
  // alguien con el inicio, el número y el bloque guardado, pero sin las claves temporales (ya, yb), que se descartaron
  const nuevo = await N.caccept(NUM, a.b);
  assert.equal(await N.copen(nuevo.keys.a, nuevo.sid, guardado), null);
  const otroA = await N.cstart(NUM);
  assert.equal(await N.cfinish(otroA.ya, a.sid, a.Ya, b.b), null);
  // ni el inicio ni la aceptación llevan nada que dependa de la clave del archivo: dos conversaciones con el mismo número no se parecen
  const dos = await conversar();
  assert.notEqual(aHex(dos.a.b), aHex(a.b)); assert.notEqual(aHex(dos.b.b), aHex(b.b));
});

test('mensajes: 200 caracteres en cualquier escritura, emoji, vacío, espacios al final; nunca más de 200', async () => {
  const { a, b, fa } = await conversar();
  const casos = ['', 'Sí.  ', 'مرحبا، غدًا ٨ صباحًا', 'မင်္ဂလာပါ', '明天上午八点见', '😀👍🏽', 'x'.repeat(200), 'ñ'.repeat(200)];
  for (const t of casos) assert.equal((await N.copen(b.keys.a, b.sid, await N.cseal(fa.a, a.sid, 3, t))).t, t);
  assert.equal((await N.copen(b.keys.a, b.sid, await N.cseal(fa.a, a.sid, 3, 'y'.repeat(250)))).t, 'y'.repeat(200));
  assert.equal(N.MSG / 2, 200);
  // el número del mensaje viaja dentro (para avisar de repetidos y de los que falten)
  assert.equal((await N.copen(b.keys.a, b.sid, await N.cseal(fa.a, a.sid, 255, 'z'))).n, 255);
});

test('pegar: el bloque se encuentra con la hora, el nombre, saltos de línea, cortes de correo y marcas invisibles; varios a la vez', async () => {
  const { a, b, fa } = await conversar();
  const ini = N.b64u(a.b), ac = N.b64u(b.b), m1 = N.b64u(await N.cseal(fa.a, a.sid, 0, 'uno')), m2 = N.b64u(await N.cseal(fa.a, a.sid, 1, 'dos'));
  const wa = '[26/11/2026, 18:09] Ana: ' + m1 + '\n[26/11/2026, 18:10] Ana: ' + m2;
  assert.deepEqual(N.grab(wa).m.sort(), [m1, m2].sort());
  assert.deepEqual(N.grab('toma:\n' + ini.slice(0, 40) + '\n' + ini.slice(40) + ' ok').s, [ini]);
  assert.deepEqual(N.grab(m1.replace(/(.{76})/g, '$1\r\n')).m, [m1], 'cortado en líneas de 76, como el correo');
  assert.deepEqual(N.grab('‫' + ac + '‬‏').a, [ac], 'con marcas de dirección');
  // texto corriente, o un bloque cortado o con un carácter de más, no da nada que abra
  assert.deepEqual(N.grab('hola, ¿qué tal? mañana a las 8'), { s: [], a: [], m: [] });
  assert.deepEqual(N.grab(m1.slice(0, 500)).m, []);
  for (const t of N.grab(m1 + 'A').m) assert.equal(await N.copen(b.keys.a, b.sid, N.u64(t)), null);
  // un inicio dañado se detecta antes de usarlo
  const roto = N.u64(ini); roto[20] ^= 4;
  assert.equal(await N.cok(roto), false);
  assert.equal(await N.caccept(NUM, roto), null);
});

test('el núcleo no lo tapa ninguna variable de la interfaz (en Node se carga solo y no se notaría)', () => {
  const js = fs.readFileSync(path.join(__dirname, '..', 'src', 'app.js'), 'utf8');
  const i = js.indexOf('/* <core> */'), f = js.indexOf('/* </core> */');
  const core = js.slice(i, f), resto = js.slice(0, i) + js.slice(f);
  const nombres = new Set([...core.matchAll(/^(?:async )?function (\w+)\(/gm)].map(m => m[1]).concat(
    [...core.matchAll(/^var ([^;]+);/gm)].flatMap(m => m[1].split(/,(?![^(]*\))/).map(d => d.trim().split(/[\s=]/)[0]))));
  assert.ok(nombres.has('lvc') && nombres.has('grab') && nombres.has('seal') && nombres.has('CPD'));
  for (const n of nombres) {
    const re = new RegExp('^(?:(?:async )?function ' + n + '\\s*\\(|var\\b[^\\n]*?(?:var|,)\\s+' + n + '\\s*=)', 'm');
    assert.equal(re.exec(resto.replace(/^var /gm, 'var var ')), null, 'la interfaz vuelve a declarar «' + n + '»');
  }
});

test('interfaz: los textos de Mensajes están en los 35 idiomas, y el de los minutos lleva dónde va el número', () => {
  const ks = ['ms', 'h8', 'pn', 'em', 'ac', 'pb', 'wr', 'sl', 'h9', 'tm', 'te', 'rd', 'e5', 'e6'];
  assert.equal(Object.keys(UI).length, 35);
  for (const [cod, u] of Object.entries(UI)) {
    for (const k of ks) assert.ok(typeof u.r[k] === 'string' && u.r[k].trim(), cod + '.' + k);
    assert.equal((u.r.tm.match(/%/g) || []).length, 1, cod + '.tm');
    assert.ok(/15|١٥|۱۵|၁၅/.test(u.r.h8) && /6|٦|۶|၆/.test(u.r.h8), cod + '.h8 debe decir los 15 minutos y las 6 cifras');
  }
  // los textos de Mensajes van cifrados (en r): ninguno entra en la invitación, que va en claro
  assert.equal(Object.keys(UI.es.i).some(k => ks.includes(k)), false);
});
