'use strict';
/** Núcleo real de la app (extraído de src/app.js): cifrado, descompresión, plegado, ensamblado. */
const test = require('node:test');
const assert = require('node:assert/strict');
const zlib = require('node:zlib');
const nodeCrypto = require('node:crypto');
const { cargarNucleo } = require('../lib/nucleo');

const N = cargarNucleo();
const R = cargarNucleo({ sinNativo: true });   // fuerza el descompresor propio
const enc = s => new TextEncoder().encode(s);

test('cifrado: ida y vuelta, y cada cifrado es distinto', async () => {
  const datos = enc('contenido de prueba '.repeat(500));
  const a = await N.wrap('tres palabras clave', datos);
  const b = await N.wrap('tres palabras clave', datos);
  assert.equal(a.length, datos.length + 16 + 12 + 16);
  assert.notDeepEqual(Buffer.from(a), Buffer.from(b));
  const r = await N.unwrap('tres palabras clave', a);
  assert.deepEqual(Buffer.from(r.data), Buffer.from(datos));
});

test('cifrado: clave incorrecta o un solo bit cambiado → no abre', async () => {
  const caja = await N.wrap('la clave buena', enc('secreto'));
  await assert.rejects(N.unwrap('la clave mala', caja));
  for (const pos of [0, 20, 30, caja.length - 1]) {
    const mal = caja.slice(); mal[pos] ^= 1;
    await assert.rejects(N.unwrap('la clave buena', mal), 'posición ' + pos);
  }
});

test('cifrado: la clave se normaliza (NFC), así da igual cómo componga los acentos el teclado', async () => {
  const caja = await N.wrap('canción'.normalize('NFC'), enc('x'));
  const r = await N.unwrap('canción'.normalize('NFD'), caja);
  assert.equal(new TextDecoder().decode(r.data), 'x');
});

test('cifrado: el formato es estándar (Argon2id igual que la implementación de referencia en C; AES-GCM de Node)', async () => {
  // Argon2id('clave de prueba', sal 00..0f, 64 MiB, t=3, p=4, 32 bytes) calculado con la implementación de referencia en C (argon2-cffi)
  const REF = Buffer.from('f5de01722eeadb3bcbeb804d6343b75e669882c3a69017e5405e371b9e9b5a7e', 'hex');
  const sal = Buffer.from([...Array(16).keys()]), iv = nodeCrypto.randomBytes(12);
  const c = nodeCrypto.createCipheriv('aes-256-gcm', REF, iv);
  const cuerpo = Buffer.concat([c.update('interoperable'), c.final()]);
  // una caja hecha solo con Node la abre la app: misma derivación de clave y mismo formato
  const r = await N.unwrap('clave de prueba', new Uint8Array(Buffer.concat([sal, iv, cuerpo, c.getAuthTag()])));
  assert.equal(new TextDecoder().decode(r.data), 'interoperable');
  // y lo que cifra la app lo abre Node con esa clave
  const k = await N.kdf('clave de prueba', new Uint8Array(sal));
  const caja = Buffer.from(await N.seal(k, enc('de vuelta')));
  const d = nodeCrypto.createDecipheriv('aes-256-gcm', REF, caja.subarray(0, 12));
  d.setAuthTag(caja.subarray(caja.length - 16));
  assert.equal(Buffer.concat([d.update(caja.subarray(12, caja.length - 16)), d.final()]).toString(), 'de vuelta');
  assert.deepEqual(N.KDF, { m: 65536, t: 3, p: 4 }, 'Argon2id por debajo de la segunda opción de RFC 9106');
});

test('descompresor propio = zlib, con todos los tipos de bloque', () => {
  let semilla = 7;
  const azar = () => (semilla = (semilla * 1103515245 + 12345) >>> 0) / 4294967296;
  const casos = [Buffer.alloc(0), Buffer.from('a'), Buffer.from('abc'.repeat(10000))];
  for (let k = 0; k < 40; k++) {
    const n = Math.floor(azar() * 30000), b = Buffer.alloc(n);
    const alfabeto = 2 + Math.floor(azar() * 250);
    for (let i = 0; i < n; i++) b[i] = Math.floor(azar() * alfabeto);
    casos.push(b);
  }
  casos.push(Buffer.from(JSON.stringify(Array.from({ length: 3000 }, (_, i) => ['p', i, 'En el principio era el Verbo, y el Verbo era con Dios ' + i]))));
  for (const c of casos) {
    for (const opt of [{ level: 9 }, { level: 1 }, { level: 0 }, { strategy: zlib.constants.Z_FIXED }, { strategy: zlib.constants.Z_HUFFMAN_ONLY }]) {
      const z = zlib.deflateSync(c, opt);
      assert.deepEqual(Buffer.from(N.puff(new Uint8Array(z), 2)), c);
    }
  }
});

test('descompresor propio: entrada dañada lanza error (no se cuelga ni devuelve basura silenciosa)', () => {
  const z = new Uint8Array(zlib.deflateSync(Buffer.from('texto de ejemplo '.repeat(200))));
  assert.throws(() => N.puff(z.subarray(0, 20), 2));
  assert.throws(() => N.puff(new Uint8Array([0x78, 0x9c, 0x07]), 2));   // tipo de bloque 3: no válido
});

test('descompresión: la vía nativa y la de reserva dan lo mismo', async () => {
  const datos = Buffer.from('La hierba se seca y la flor se cae. '.repeat(3000));
  const z = new Uint8Array(zlib.deflateSync(datos, { level: 9 }));
  assert.deepEqual(Buffer.from(await N.unz(z)), datos);
  assert.deepEqual(Buffer.from(await R.unz(z)), datos);
});

test('plegado de búsqueda: mayúsculas, acentos, vocalización árabe/hebrea y variantes de letra', () => {
  const NBSP = String.fromCharCode(160), ZWNJ = String.fromCharCode(0x200c);
  assert.equal(N.norm('Él  CAMINÓ' + NBSP + 'allí'), 'el camino alli');
  assert.equal(N.norm('فِي ٱلْبَدْءِ خَلَقَ ٱللهُ'), N.norm('في البدء خلق الله'));
  assert.equal(N.norm('یادداشت' + ZWNJ + 'ها'), N.norm('يادداشتها'));      // persa: ی/ي y medio espacio
  assert.equal(N.norm('کتاب'), N.norm('كتاب'));                             // persa/árabe: ک/ك
  assert.equal(N.norm('בְּרֵאשִׁית'), 'בראשית');
  assert.equal(N.norm('ГОСПОДЬ'), 'господь');
  assert.equal(N.norm('太初有道'), '太初有道');
  assert.equal(N.norm('परमेश्वर'), 'परमेश्वर'.normalize('NFD'));           // no toca los signos vocálicos índicos
});

test('ensamblado: estructura fija y valores escapados', () => {
  const h = N.assemble({ lang: 'es', dir: 'ltr', title: 'A & <B>', csp: "default-src 'none'", css: 'b{}', ui: '{"t":"x"}', blob: 'QUJD', js: 'var a=1;' });
  assert.match(h, /^<!doctype html>\n<html lang="es" dir="ltr">/);
  assert.ok(h.includes('<title>A &amp; &lt;B></title>'));
  assert.ok(h.includes('<style>b{}</style>'));
  assert.ok(h.includes('<script type="application/octet-stream" id="d">QUJD</script>'));
  assert.ok(h.endsWith('<script>var a=1;</script>\n</body>\n</html>\n'));
});
