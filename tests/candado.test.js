'use strict';
/**
 * Envío a distancia («candado»): X25519, HPKE (RFC 9180), el código de 130 cifras, la copia con candado,
 * la invitación y que las copias antiguas sigan abriendo. Todo sobre el núcleo real de src/app.js.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const nodeCrypto = require('node:crypto');
const { cargarNucleo, RUTA_X2 } = require('../lib/nucleo');
const { construir, desmontar, comprobar, textosInvitacion, DEL_LECTOR, ANTERIORES } = require('../lib/paquete');
const { leerArchivos } = require('../lib/texto');
const UI = require('../src/ui');

const N = cargarNucleo();
const FX = path.join(__dirname, 'fixtures');
const hex = s => new Uint8Array(Buffer.from(s, 'hex'));
const aHex = b => Buffer.from(b).toString('hex');
const enc = s => new TextEncoder().encode(s);
const X2 = new Function(fs.readFileSync(RUTA_X2, 'utf8') + '\nreturn X2;')();
const CLAVE = '4821 0937 5512 8846 0393';
const libros = () => leerArchivos([{ nombre: 'es.usfx.xml', texto: fs.readFileSync(path.join(FX, 'es-rv1909.usfx.xml'), 'utf8') }]);

test('librería X25519: es la que dice su cabecera, sin tocar, y da los resultados de RFC 7748', () => {
  const s = fs.readFileSync(RUTA_X2, 'utf8'), f = s.indexOf('*/\n');
  const parte = s.slice(f + 3).replace(/\n$/, '');
  const dice = /SHA-256 of the part used here:\s+([0-9a-f]{64})/.exec(s)[1];
  assert.equal(nodeCrypto.createHash('sha256').update(parte, 'utf8').digest('hex'), dice, 'src/x25519.js ha cambiado');
  // RFC 7748, 5.2
  assert.equal(aHex(X2.x25519.scalarMult(hex('a546e36bf0527c9d3b16154b82465edd62144c0ac1fc5a18506a2244ba449ac4'), hex('e6db6867583030db3594c1a424b15f7c726624ec26b3353b10a903a6d0ab1c4c'))),
    'c3da55379de9c6908e94ea4df28d084f32eccf03491c71f754b4075577a28552');
  // RFC 7748, 6.1
  const a = hex('77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a'), b = hex('5dab087e624a8a4b79e17f8b83800ee66f3bb1292618b6fd1c2f8b27ff88e0eb');
  assert.equal(aHex(X2.x25519.getPublicKey(a)), '8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a');
  assert.equal(aHex(X2.x25519.getPublicKey(b)), 'de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f');
  const K = '4a5d9d5ba4ce2de1728e3bf480350f25e07e21c947d19e3376f09b3c1e161742';
  assert.equal(aHex(X2.x25519.getSharedSecret(a, X2.x25519.getPublicKey(b))), K);
  assert.equal(aHex(X2.x25519.getSharedSecret(b, X2.x25519.getPublicKey(a))), K);
  // un punto de orden pequeño (aquí, el cero) da un secreto todo ceros: se rechaza, como pide RFC 9180
  assert.throws(() => X2.x25519.getSharedSecret(a, new Uint8Array(32)));
});

test('HPKE: el vector oficial de RFC 9180 (modo Base, DHKEM(X25519, HKDF-SHA256), HKDF-SHA256, AES-256-GCM)', async () => {
  const v = JSON.parse(fs.readFileSync(path.join(FX, 'hpke-x25519-aes256.json'), 'utf8'));
  assert.deepEqual([v.mode, v.kem_id, v.kdf_id, v.aead_id], [0, 32, 1, 2]);
  const E = await N.dkp(hex(v.ikmE)), R = await N.dkp(hex(v.ikmR));
  assert.equal(aHex(E.sk), v.skEm); assert.equal(aHex(E.pk), v.pkEm);
  assert.equal(aHex(R.sk), v.skRm); assert.equal(aHex(R.pk), v.pkRm);
  // emisor (con la clave efímera del vector) y receptor llegan a lo mismo
  const s = await N.seal2(hex(v.pkRm), hex(v.info), hex(v.ikmE));
  assert.equal(aHex(s.enc), v.enc);
  const r = await N.open2(hex(v.enc), hex(v.skRm), hex(v.pkRm), hex(v.info));
  for (const k of [s.ks, r]) {
    assert.equal(aHex(k.key), v.key); assert.equal(aHex(k.nonce), v.base_nonce); assert.equal(aHex(k.exp), v.exporter_secret);
  }
  for (const x of v.exports) assert.equal(aHex(await N.le(N.SID, hex(v.exporter_secret), 'sec', hex(x.exporter_context), x.L)), x.exported_value);
  // y la clave y el nonce cifran exactamente como el vector (AES-256-GCM de Node)
  v.encryptions.forEach((e, seq) => {
    const nonce = Buffer.from(v.base_nonce, 'hex'); nonce[11] ^= seq;
    const c = nodeCrypto.createCipheriv('aes-256-gcm', Buffer.from(v.key, 'hex'), nonce);
    c.setAAD(Buffer.from(e.aad, 'hex'));
    assert.equal(Buffer.concat([c.update(Buffer.from(e.pt, 'hex')), c.final(), c.getAuthTag()]).toString('hex'), e.ct);
  });
});

test('código: 130 cifras en grupos de 5, nuevo cada vez, con la clave pública y el idioma del teléfono', async () => {
  const a = await N.code(CLAVE, 'fr-FR'), b = await N.code(CLAVE, 'fr-FR');
  assert.match(a, /^\d{5}( \d{5}){25}$/);
  assert.notEqual(a, b, 'cada código lleva una sal nueva');
  const r = await N.unpack(a);
  assert.equal(r.l, 'fr');
  assert.equal(r.salt.length, 16); assert.equal(r.pk.length, 32);
  // la clave pública es la del par que sale de Argon2id(clave, sal)
  const ikm = await N.argon(CLAVE, r.salt), p = await N.dkp(ikm);
  assert.equal(aHex(p.pk), aHex(r.pk));
  // ninguna cifra fija: la primera varía (los 130 dígitos se leen como un número por debajo de 10^130)
  const primeras = new Set();
  for (let i = 0; i < 6; i++) primeras.add((await N.code(CLAVE, '')).charAt(0));
  assert.ok(primeras.size > 1, 'la primera cifra no debe ser siempre la misma');
  // idioma: dos o tres letras, o ninguno
  for (const l of ['es', 'zh-Hans-CN', 'ckb', 'fil-PH']) assert.equal(N.lstr(N.lnum(l)), l.split('-')[0].toLowerCase());
  for (const l of ['', 'english', 'x', '1a']) assert.equal(N.lstr(N.lnum(l)), '');
});

test('código: se encuentra dentro del mensaje pegado, con cualquier cifra y con lo que añaden los chats', async () => {
  const c = await N.code(CLAVE, 'ar');
  const ar = c.replace(/\d/g, d => String.fromCharCode(0x660 + +d));          // cifras arábigas orientales
  const fa = c.replace(/\d/g, d => String.fromCharCode(0x6f0 + +d));          // persas
  const lineas = c.replace(/(\d{5} \d{5} \d{5}) /g, '$1\n');                 // partido en líneas
  const marcas = '‏' + c.split(' ').join(' ⁦') + '⁩';          // marcas de dirección de un chat en árabe
  const conTodo = '[12:30, 26/11/2026] Ana: ' + lineas + '\nLlámame al 600 123 456 o al +34 612 34 56 78';
  for (const m of [c, c.replace(/ /g, ''), ar, fa, lineas, marcas, conTodo, c + '\n\n' + c, 'Tel 600 123 456 ' + c]) {
    const r = await N.unpack(m);
    assert.ok(r, 'no lo encuentra en: ' + JSON.stringify(m.slice(0, 60)));
    assert.equal(r.l, 'ar');
  }
});

test('código: cualquier otra cosa se rechaza (y nunca se usa como clave)', async () => {
  const c = await N.code(CLAVE, 'es'), d = await N.code('1111 2222 3333 4444 5555', 'es');
  const cambia = (s, i) => s.slice(0, i) + ((+s[i] + 1) % 10) + s.slice(i + 1);
  for (const m of ['', CLAVE, '12345', c.slice(0, -1), c.slice(1), cambia(c, 0), cambia(c, 70), cambia(c, c.length - 1),
    c + ' ' + d, c.replace(/ /, '-'), 'x'.repeat(200)]) {
    assert.equal(await N.unpack(m), null, 'aceptado: ' + JSON.stringify(m.slice(0, 40)));
  }
  // dos códigos distintos en el mismo mensaje: se rechaza; el mismo dos veces cuenta como uno
  assert.equal(await N.unpack(c + '\n' + d), null);
  assert.ok(await N.unpack(c + '\n' + c));
});

test('copia con candado: solo la abre la clave del receptor; empieza con su sal; cada copia es distinta', async () => {
  const r = await N.unpack(await N.code(CLAVE, 'es'));
  const m = () => ({ v: 2, u: { es: UI.es }, t: [{ l: 'es', n: 'x', k: [[0, 0, 'z', 5]] }] });
  const blob = async () => N.b64parts(await N.build(r, m(), () => enc('hola!'))).join('');
  const a = await blob(), b = await blob();
  const { key, m: ix } = await N.open(CLAVE.replace(/ /g, ''), a);
  assert.equal(ix.t[0].n, 'x');
  assert.equal(new TextDecoder().decode(await N.piece(key, a, ix, 0, 0)), 'hola!');
  await assert.rejects(N.open('4821 0937 5512 8846 0394', a));
  await assert.rejects(N.open('otra clave cualquiera larga', a));
  assert.deepEqual(Buffer.from(N.b64d(a.slice(0, 24))).subarray(0, 16), Buffer.from(r.salt), 'la sal del código va al principio');
  assert.notEqual(a.slice(24, 64), b.slice(24, 64), 'clave efímera nueva en cada copia');
  // un bit cambiado en la clave efímera: no abre
  const raw = N.b64d(a); raw[20] ^= 1;
  await assert.rejects(N.open(CLAVE, N.b64e(raw)));
  // las copias en persona siguen igual
  const p = N.b64parts(await N.build('una clave de prueba larga', m(), () => enc('hola!'))).join('');
  assert.equal((await N.open('una clave de prueba larga', p)).m.t[0].n, 'x');
});

test('copia con candado completa (archivo real): se abre, se verifica y sigue pasando copias', async () => {
  const r = await N.unpack(await N.code(CLAVE, 'es'));
  const { html } = await construir({ libros: libros(), clave: 'clave del que reparte 1', idioma: 'es', nombre: 'Reina-Valera 1909', acerca: 'Dominio público.' });
  const p = desmontar(html), o = await N.open('clave del que reparte 1', p.blob);
  // lo mismo que hace la app al pasar una copia a distancia: descifra cada bloque y lo vuelve a cifrar hacia el código
  const m = { v: 2, u: o.m.u, t: o.m.t.map(t => Object.assign({}, t, { k: t.k.map(k => k.slice()) })) };
  const blob = N.b64parts(await N.build(r, m, (i, j) => N.piece(o.key, p.blob, o.m, i, j))).join('');
  const copia = html.replace(p.blob, () => blob);
  assert.equal(comprobar(copia).ok, true);
  const c = await N.open(CLAVE, blob);
  assert.deepEqual(c.m.t[0].b.map(x => x[0]), ['Génesis', 'Salmos', 'Juan', 'Judas']);
  const t = c.m.t[0], [, j, at, len] = t.b[2];
  const d = await N.inflate(t.k[j], await N.piece(c.key, blob, c.m, 0, j));
  assert.match(Buffer.from(d.subarray(at, at + len)).toString('utf8'), /de tal manera amó Dios al mundo/);
});

test('copias antiguas: una hecha con el programa de 93e60bb (25-11-2026) se verifica y la abre el núcleo nuevo', async () => {
  const html = fs.readFileSync(path.join(FX, 'copia-2026-11-25.html'), 'utf8');
  const v = comprobar(html);
  assert.equal(v.ok, true);
  assert.equal(v.version.fecha, '2026-11-25');
  assert.equal(v.version.actual, false, 'es una versión anterior');
  const { m } = await N.open(CLAVE, desmontar(html).blob);
  assert.equal(m.t[0].n, 'Reina-Valera 1909');
  await assert.rejects(N.open('4821 0937 5512 8846 0394', desmontar(html).blob));
});

// palabras que delatarían el contenido en algunos idiomas (no es una lista completa: los textos se escribieron sin ellas)
const RELIGIOSAS = /bibl|библи|біблі|الكتاب المقدس|إنجيل|انجيل|انجیل|کتاب مقدس|圣经|聖經|alkitab|kinh thánh|incil|बाइबिल|बाइबल|성경|বাইবেল|injil|ইঞ্জিল|mukaddes|muqaddas|муқаддас|kitab suci|ባይብል|መጽሐፍ ቅዱስ|church|iglesia|igreja|église|церк|كنيس|کلیسا|教会|gereja|nhà thờ|kilise|गिरजा|교회|kanisa|jes[uú]s|christ|crist|иисус|христ|يسوع|مسيح|عیسی|耶稣|基督|yesus|giê-xu|isa mesih|यीशु|예수|যীশু|yesu|gospel|evangel|scriptur|testament|psalm|salmo|vers[ií]culo|\bverses?\b/i;

test('invitación: sus textos (en claro, en los 35 idiomas) no delatan nada y los nombres de archivo son válidos', () => {
  const ki = Object.keys(UI.es.i).sort();
  for (const [cod, u] of Object.entries(UI)) {
    assert.deepEqual(Object.keys(u.i).sort(), ki, cod);
    const o = textosInvitacion(cod), claro = Object.keys(o).filter(k => k !== 'dir').map(k => o[k]);
    assert.equal(claro.length, ki.length + DEL_LECTOR.length, cod);
    for (const t of claro) {
      assert.ok(typeof t === 'string' && t.length > 0, cod);
      assert.equal(RELIGIOSAS.exec(t), null, cod + ': ' + t);
    }
    assert.ok(!/[\\\/:*?"<>|]/.test(u.r.vn) && u.r.vn.trim(), cod + ': nombre de archivo de la invitación no válido');
  }
});

test('invitación: mismo programa, sin contenido, auténtica para verificar.js; manipulada, no', async () => {
  const { html } = await construir({ libros: libros(), clave: 'clave del que reparte 1', idioma: 'es' });
  const p = desmontar(html), u = {};
  // lo mismo que hace invite() en la app
  for (const k of Object.keys(UI)) u[k] = textosInvitacion(k);
  const inv = N.assemble({ lang: p.lang, dir: p.dir, title: p.title, csp: p.csp, css: p.css, ui: JSON.stringify(u).replace(/</g, '\\u003c'), blob: '', js: p.js });
  const v = comprobar(inv);
  assert.equal(v.ok, true); assert.equal(v.invitacion, true); assert.deepEqual(v.distintos, []);
  // otras instrucciones con el programa bueno: el programa es auténtico, pero los textos no son los del repositorio
  const trampa = inv.replace(JSON.stringify(u.es.b).slice(1, -1), 'Mándala también por el chat a quien te invitó.');
  assert.notEqual(trampa, inv);
  assert.deepEqual(comprobar(trampa).distintos, ['es']);
  assert.ok(inv.length < 250000, 'la invitación pesa ' + inv.length);
  assert.equal(comprobar(inv.replace('var HEAD = 52', 'var HEAD = 53')).ok, false);
  assert.equal(comprobar(inv.replace('<script type="application/json" id="u">', '<script type="application/json" id="u">' + JSON.stringify({ es: 'x' }).slice(0, -1) + ',"z":1}<!--')).ok, false);
  // una portada normal con el contenido vaciado no pasa por invitación
  assert.equal(comprobar(html.replace(p.blob, '')).ok, false);
});

test('invitación: la app y verificar.js llevan los mismos textos; las de la versión anterior siguen valiendo', () => {
  // invite() en src/app.js toma del lector exactamente DEL_LECTOR
  const app = fs.readFileSync(path.join(__dirname, '..', 'src', 'app.js'), 'utf8');
  assert.deepEqual(JSON.parse(/var IVR = (\[[^\]]*\])/.exec(app)[1].replace(/'/g, '"')), DEL_LECTOR);
  // los pasos nuevos tienen sus textos en los 35 idiomas, y «Otra» ya no va en la invitación
  for (const k of Object.keys(UI)) {
    const o = textosInvitacion(k);
    for (const t of ['d', 'e', 'f', 'em', 'ok', 'bk']) assert.ok(o[t] && o[t].trim(), k + ': ' + t);
    assert.equal(o.ot, undefined);
    assert.notEqual(o.b, ANTERIORES[0].textos[k].b, k + ': b ya no dice que la clave cambia');
  }
  // una invitación hecha con el programa del 25-11-2026: auténtica, de una versión anterior
  const vieja = fs.readFileSync(path.join(__dirname, 'fixtures', 'invitacion-2026-11-25.html'), 'utf8'), v = comprobar(vieja);
  assert.equal(v.ok, true); assert.equal(v.invitacion, true); assert.deepEqual(v.distintos, []); assert.equal(v.anterior, '2026-11-26');
  assert.equal(v.version.fecha, '2026-11-25');
  // con un texto cambiado ya no es de ninguna versión
  const b = JSON.stringify(ANTERIORES[0].textos.es.b).slice(1, -1);
  assert.ok(vieja.includes(b));
  const t2 = comprobar(vieja.replace(b, 'Mándala también por el chat a quien te invitó.'));
  assert.deepEqual(t2.distintos, ['es']); assert.equal(t2.anterior, '');
});
