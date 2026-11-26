(function () {
'use strict';
var D = document, W = window, SELF = D.currentScript ? D.currentScript.textContent : '';

/* <core> */
var te = new TextEncoder(), td = new TextDecoder();

function b64d(s) {
  var bin = atob(s), n = bin.length, a = new Uint8Array(n), i;
  for (i = 0; i < n; i++) a[i] = bin.charCodeAt(i);
  return a;
}
function b64e(a) {
  var s = '', i;
  for (i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000));
  return btoa(s);
}
function rand(n) { var a = new Uint8Array(n); if (n) crypto.getRandomValues(a); return a; }
function cat() {
  var n = 0, i, o;
  for (i = 0; i < arguments.length; i++) n += arguments[i].length;
  o = new Uint8Array(n);
  for (i = 0, n = 0; i < arguments.length; i++) { o.set(arguments[i], n); n += arguments[i].length; }
  return o;
}

/* Argon2id -> AES-256-GCM. Layout: salt(16) | iv(12) | ciphertext+tag
   Argon2id with the second option of RFC 9106 (64 MiB, 3 passes, 4 lanes): memory-hard, so a graphics card
   gains far less over a phone than with PBKDF2. A2 is hash-wasm (src/argon2.js), checked against the reference C code.
   The browser has no Argon2 of its own yet: this needs WebAssembly ('wasm-unsafe-eval' in the policy). */
var KDF = { m: 65536, t: 3, p: 4 };
/* the same key from any keyboard: a digit of any script counts as 0-9 (every Unicode series of ten digits
   starts at its zero, so the value is the distance to the start of the run), and a key made only of digits,
   spaces and punctuation keeps just the digits: 4821-0937 = 4821 0937 = 48210937 */
function ascii(s) {
  var nd = /\p{Nd}/u;
  return s.replace(/\p{Nd}/gu, function (c) {
    var n = c.codePointAt(0), z = n;
    while (nd.test(String.fromCodePoint(z - 1))) z--;
    return String((n - z) % 10);
  });
}
function fold(pass) {
  var s = ascii(pass.normalize('NFC'));
  return /^[0-9\s\p{P}\p{Z}]+$/u.test(s) ? s.replace(/[^0-9]/g, '') : s;
}
/* Argon2id of the key: 32 bytes that the caller wipes */
async function argon(pass, salt) {
  var pw = te.encode(fold(pass));
  try {
    return await A2.argon2id({ password: pw, salt: salt, parallelism: KDF.p, iterations: KDF.t, memorySize: KDF.m, hashLength: 32, outputType: 'binary' });
  } finally { pw.fill(0); }
}
function aes(raw) { return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']); }
async function kdf(pass, salt) {
  var raw = await argon(pass, salt);
  try { return await aes(raw); } finally { raw.fill(0); }
}
/* ad: optional additional data, ties a box to its place in the file */
function gcm(iv, ad) { var p = { name: 'AES-GCM', iv: iv }; if (ad) p.additionalData = te.encode(ad); return p; }
async function seal(key, plain, ad) {
  var iv = rand(12);
  return cat(iv, new Uint8Array(await crypto.subtle.encrypt(gcm(iv, ad), key, plain)));
}
async function unseal(key, box, ad) {
  return new Uint8Array(await crypto.subtle.decrypt(gcm(box.subarray(0, 12), ad), key, box.subarray(12)));
}
async function wrap(pass, plain, ad) {
  var salt = rand(16);
  return cat(salt, await seal(await kdf(pass, salt), plain, ad));
}
async function unwrap(pass, blob, ad) {
  var key = await kdf(pass, blob.subarray(0, 16));
  return { key: key, data: await unseal(key, blob.subarray(16), ad) };
}

/* Copies sent at a distance: HPKE (RFC 9180), mode Base, DHKEM(X25519, HKDF-SHA256), HKDF-SHA256, AES-256-GCM.
   The receiver's key pair comes from their key: Argon2id(key, salt) -> DeriveKeyPair, so the private key is never kept.
   The sender seals to the public key with a new ephemeral key for every copy; the key of the file is the output of the
   HPKE exporter. The curve is noble-curves (X2, src/x25519.js); hashes and AES are WebCrypto. Checked against the official
   RFC 9180 test vectors (tests/candado.test.js). */
var NONE = new Uint8Array(0), KID = cat(te.encode('KEM'), new Uint8Array([0, 0x20])), SID = cat(te.encode('HPKE'), new Uint8Array([0, 0x20, 0, 1, 0, 2]));
var INFO = te.encode('nt1');
/* HMAC-SHA256. An empty key is the same as 32 zero bytes (HMAC pads every key with zeros), and WebCrypto refuses empty keys */
async function hmac(k, d) {
  var key = await crypto.subtle.importKey('raw', k.length ? k : new Uint8Array(32), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, d));
}
/* LabeledExtract and LabeledExpand (HKDF with the HPKE labels) */
function lx(sid, salt, label, ikm) { return hmac(salt, cat(te.encode('HPKE-v1'), sid, te.encode(label), ikm)); }
async function le(sid, prk, label, info, n) {
  var li = cat(new Uint8Array([n >> 8, n & 255]), te.encode('HPKE-v1'), sid, te.encode(label), info), out = NONE, t = NONE, i;
  for (i = 1; out.length < n; i++) { t = await hmac(prk, cat(t, li, new Uint8Array([i]))); out = cat(out, t); }
  return out.subarray(0, n);
}
/* DeriveKeyPair */
async function dkp(ikm) {
  var prk = await lx(KID, NONE, 'dkp_prk', ikm), sk = await le(KID, prk, 'sk', NONE, 32);
  prk.fill(0);
  return { sk: sk, pk: X2.x25519.getPublicKey(sk) };
}
/* ExtractAndExpand of a Diffie-Hellman result. getSharedSecret refuses an all-zero result (a bad point), as RFC 9180 asks */
async function kem(dh, enc, pkR) {
  var prk = await lx(KID, NONE, 'eae_prk', dh);
  try { return await le(KID, prk, 'shared_secret', cat(enc, pkR), 32); } finally { dh.fill(0); prk.fill(0); }
}
/* KeySchedule, mode Base (no PSK) */
async function sched(ss, info) {
  var c = cat(new Uint8Array([0]), await lx(SID, NONE, 'psk_id_hash', NONE), await lx(SID, NONE, 'info_hash', info)), s = await lx(SID, ss, 'secret', NONE);
  ss.fill(0);
  try { return { key: await le(SID, s, 'key', c, 32), nonce: await le(SID, s, 'base_nonce', c, 12), exp: await le(SID, s, 'exp', c, 32) }; } finally { s.fill(0); }
}
/* SetupBaseS (ikmE only in tests: otherwise 32 random bytes, which is how RFC 9180 builds GenerateKeyPair) and SetupBaseR */
async function seal2(pkR, info, ikmE) {
  var e = await dkp(ikmE || rand(32)), ss;
  try { ss = await kem(X2.x25519.getSharedSecret(e.sk, pkR), e.pk, pkR); } finally { e.sk.fill(0); }
  return { enc: e.pk, ks: await sched(ss, info) };
}
async function open2(enc, skR, pkR, info) { return sched(await kem(X2.x25519.getSharedSecret(skR, enc), enc, pkR), info); }
/* the key of the file: Export(exporter_context 'f', 32) */
async function fkey(ks) {
  var k = await le(SID, ks.exp, 'sec', te.encode('f'), 32);
  try { return await aes(k); } finally { k.fill(0); ks.key.fill(0); ks.nonce.fill(0); ks.exp.fill(0); }
}

/* The receiver's code: 130 digits in groups of five, copied and pasted, never typed.
   bytes = salt(16) | public key(32) | language of the phone(2) | check(4), the check being the first 4 bytes of
   SHA-256('nt1' | the rest). Read as one number it is always below 10^130, because the salt, which leads, is drawn
   below SMAX: no digit is fixed, so nothing in the code marks it. A new salt, so a new code, every time. */
var CL = 130, SMAX = (10n ** 130n) >> 304n;
function big(a) { var h = '0x0', i; for (i = 0; i < a.length; i++) h += (a[i] < 16 ? '0' : '') + a[i].toString(16); return BigInt(h); }
function bytes(n, len) { var a = new Uint8Array(len), i; for (i = len - 1; i >= 0; i--) { a[i] = Number(n & 255n); n >>= 8n; } return a; }
async function sum(b, l) { return new Uint8Array(await crypto.subtle.digest('SHA-256', cat(l || INFO, b))).subarray(0, 4); }
/* a language code of two or three letters a-z as a number (base 27; 0: none), and back */
function lnum(l) {
  var m = /^([a-z]{2,3})(?![a-z])/.exec(String(l || '').toLowerCase()), n = 0, i;
  if (!m) return 0;
  for (i = 0; i < 3; i++) n = n * 27 + (i < m[1].length ? m[1].charCodeAt(i) - 96 : 0);
  return n;
}
function lstr(n) {
  var a = Math.floor(n / 729), b = Math.floor(n / 27) % 27, c = n % 27;
  return a > 0 && a < 27 && b > 0 ? String.fromCharCode(96 + a, 96 + b) + (c ? String.fromCharCode(96 + c) : '') : '';
}
/* the code for a key: Argon2id with a new salt, then the public key of DeriveKeyPair */
async function code(pass, lang) {
  var salt, ikm, p, n = lnum(lang), b;
  do salt = rand(16); while (big(salt) >= SMAX);
  ikm = await argon(pass, salt);
  try { p = await dkp(ikm); } finally { ikm.fill(0); }
  p.sk.fill(0);
  b = cat(salt, p.pk, new Uint8Array([n >> 8, n & 255]));
  return String(big(cat(b, await sum(b)))).padStart(CL, '0').replace(/(\d{5})(?=\d)/g, '$1 ');
}
/* A pasted message -> { salt, pk, l } or null. Digits of any script count; inside the code only spaces, line breaks and
   invisible marks (those a chat app adds around text in another direction) may separate the groups. A run of exactly 130
   digits that starts and ends where a group does and has the right check is a candidate: a time, a date or a phone number
   next to it does not spoil it. Not exactly one candidate (the same code twice counts once): refused. Never used as a key. */
async function unpack(msg) {
  var parts = ascii(String(msg)).match(/[0-9]+|[^0-9]+/g) || [], runs = [], g = [], seen = {}, ok = [], i, j, n, d, b, s, pk;
  for (i = 0; i < parts.length; i++) {
    if (/^[0-9]/.test(parts[i])) g.push(parts[i]);
    else if (!/^[\s\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u2069\ufeff]+$/.test(parts[i])) { runs.push(g); g = []; }
  }
  runs.push(g);
  for (i = 0; i < runs.length; i++) {
    for (j = 0; j < runs[i].length; j++) {
      for (d = '', n = j; n < runs[i].length && d.length < CL; n++) d += runs[i][n];
      if (d.length === CL) seen[d] = 1;
    }
  }
  for (d in seen) {
    b = bytes(BigInt(d), 54);           // 130 digits are always below 2^432 (54 bytes)
    s = await sum(b.subarray(0, 50));
    if (s[0] !== b[50] || s[1] !== b[51] || s[2] !== b[52] || s[3] !== b[53]) continue;
    pk = b.slice(16, 48);
    try { X2.x25519.getSharedSecret(rand(32), pk); } catch (e) { continue; }   // a point of small order: not a key
    ok.push({ salt: b.slice(0, 16), pk: pk, l: lstr(b[48] << 8 | b[49]) });
  }
  return ok.length === 1 ? ok[0] : null;
}

/* Short messages between two people who have the file: CPace (draft-irtf-cfrg-cpace-21, with the RFC Editor), X25519 and
   SHA-512, initiator-responder, no party identities, CI = 'nt2', a new random sid for every conversation. Both type a number
   agreed in person or by voice (6 digits or more: the PRS). It never travels: whoever does not know it gets one guess per
   conversation and cannot test guesses offline. From ISK come a key for each direction (HKDF-SHA256 to AES-256-GCM, not
   extractable) and the tag of the acceptance (the key confirmation of the draft: mac_key = H('CPaceMac' | sid | ISK),
   Tb = HMAC-SHA512(mac_key, lv_cat(Yb, ADb)), its first 32 bytes). Blocks, in base64 without '=':
     start    A to B   sid(16) | Ya(32) | check(4)                       70 characters
     accept   B to A   Yb(32) | Tb(32)                                   86 characters
     message  both     iv(12) | AES-GCM(v(1) | n(1) | text(400))       574 characters
   A writes first, once Tb proves the same ISK; B writes once A's first message has opened: no text goes out before the
   other side has proved it holds the same key. Nothing comes from the key of the file. ya waits for the acceptance and yb
   goes at once; the keys of the directions die with the conversation. Checked against the official test vectors of the
   draft (tests/mensajes.test.js). */
var CPD = te.encode('CPace255'), CI2 = te.encode('nt2'), INF2 = CI2, P25 = (1n << 255n) - 19n, MSG = 400, SL = 70, AL = 86, ML = 574;
function sha512(b) { return crypto.subtle.digest('SHA-512', b).then(function (h) { return new Uint8Array(h); }); }
/* prepend_len and lv_cat (lvc) of the draft: the length in LEB128, then the bytes */
function lenp(d) { var o = [], n = d.length; do { o.push(n < 128 ? n : (n & 127) | 128); n >>>= 7; } while (n); return cat(new Uint8Array(o), d); }
function lvc() { var a = [], i; for (i = 0; i < arguments.length; i++) a.push(lenp(arguments[i])); return cat.apply(null, a); }
/* field elements of curve25519, little-endian as in RFC 7748 */
function fle(b) { var n = 0n, i; for (i = b.length - 1; i >= 0; i--) n = (n << 8n) | BigInt(b[i]); return n; }
function fen(n) { var a = new Uint8Array(32), i; for (i = 0; i < 32; i++) { a[i] = Number(n & 255n); n >>= 8n; } return a; }
function finv(x) { var r = 1n, e = P25 - 2n; x %= P25; while (e > 0n) { if (e & 1n) r = r * x % P25; x = x * x % P25; e >>= 1n; } return r; }
/* calculate_generator: SHA-512 of generator_string(DSI, PRS, CI, sid, 128), its first 32 bytes as a u coordinate
   (decodeUCoordinate), then map_to_curve_elligator2 of RFC 9380 (the one in noble-curves), keeping only u */
async function cgen(prs, ci, sid) {
  var h = await sha512(lvc(CPD, prs, new Uint8Array(Math.max(0, 128 - 1 - lenp(prs).length - lenp(CPD).length)), ci, sid)), u, m;
  h[31] &= 127; u = fle(h.subarray(0, 32)) % P25; h.fill(0);
  m = X2._map_to_curve_elligator2_curve25519(u);
  return fen(m.xMn * finv(m.xMd) % P25);
}
/* scalar_mult_vfy is X25519: a low-order point gives all zeros, noble-curves throws, and that is the abort of the draft */
function cmul(s, p) { return X2.x25519.scalarMult(s, p); }
/* ISK = H(lv_cat(DSI | '_ISK', sid, K) | transcript_ir(Ya, ADa, Yb, ADb)). K is wiped */
async function cisk(sid, k, ya, ada, yb, adb) {
  try { return await sha512(cat(lvc(cat(CPD, te.encode('_ISK')), sid, k), lvc(ya, ada), lvc(yb, adb))); } finally { k.fill(0); }
}
/* from ISK: the key of each direction (a: from A, b: from B) and the tag of the acceptance. ISK is wiped */
async function csess(isk, sid, yb) {
  var mk = await sha512(cat(te.encode('CPaceMac'), sid, isk)), o = {}, h, b;
  function dk(l) { return crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: sid, info: te.encode(l) }, b, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']); }
  try {
    h = await crypto.subtle.importKey('raw', mk, { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']);
    o.tb = new Uint8Array(await crypto.subtle.sign('HMAC', h, lvc(yb, NONE))).slice(0, 32);
    b = await crypto.subtle.importKey('raw', isk, 'HKDF', false, ['deriveKey']);
    o.a = await dk('nt2 a'); o.b = await dk('nt2 b');
  } finally { mk.fill(0); isk.fill(0); }
  return o;
}
function b64u(a) { return b64e(a).replace(/=+$/, ''); }
function u64(s) { while (s.length % 4) s += '='; return b64d(s); }
/* a start that arrived whole? (the check only catches a bad copy: who sent it is proved by the acceptance) */
async function cok(st) {
  var s;
  if (st.length !== 52) return false;
  s = await sum(st.subarray(0, 48), INF2);
  return s[0] === st[48] && s[1] === st[49] && s[2] === st[50] && s[3] === st[51];
}
/* A: the start. The caller keeps ya until the acceptance arrives */
async function cstart(pin) {
  var sid = rand(16), ya = rand(32), g = await cgen(te.encode(fold(pin)), CI2, sid), b;
  try { b = cat(sid, cmul(ya, g)); } finally { g.fill(0); }
  return { sid: sid, ya: ya, Ya: b.slice(16), b: cat(b, await sum(b, INF2)) };
}
/* B: accepting a start with the number; yb and K go at once. null: not a whole start, or a low-order point */
async function caccept(pin, st) {
  var sid, Ya, yb, g, Yb, k, s;
  if (!(await cok(st))) return null;
  sid = st.slice(0, 16); Ya = st.slice(16, 48); yb = rand(32);
  g = await cgen(te.encode(fold(pin)), CI2, sid);
  try { Yb = cmul(yb, g); k = cmul(yb, Ya); } catch (e) { return null; } finally { g.fill(0); yb.fill(0); }
  s = await csess(await cisk(sid, k, Ya, NONE, Yb, NONE), sid, Yb);
  return { sid: sid, keys: s, b: cat(Yb, s.tb) };
}
/* A: an acceptance gives the keys only if its tag proves the same ISK (same number, same start); otherwise null */
async function cfinish(ya, sid, Ya, ac) {
  var Yb, k, s, d = 0, i;
  if (ac.length !== 64) return null;
  Yb = ac.slice(0, 32);
  try { k = cmul(ya, Yb); } catch (e) { return null; }
  s = await csess(await cisk(sid, k, Ya, NONE, Yb, NONE), sid, Yb);
  for (i = 0; i < 32; i++) d |= s.tb[i] ^ ac[32 + i];
  return d ? null : s;
}
/* a message: version 1, its number in the conversation (one byte), the text in UTF-16 (200 units) and zeros after it,
   so every message has the same size. The additional data is the sid: a message only opens in its own conversation */
async function cseal(key, sid, n, text) {
  var p = new Uint8Array(2 + MSG), iv = rand(12), i, c;
  p[0] = 1; p[1] = n & 255;
  for (i = 0; i < text.length && i < MSG / 2; i++) { c = text.charCodeAt(i); p[2 + 2 * i] = c & 255; p[3 + 2 * i] = c >> 8; }
  try { return cat(iv, new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv, additionalData: sid }, key, p))); } finally { p.fill(0); }
}
async function copen(key, sid, b) {
  var p, s = '', n, i, j;
  if (b.length !== 30 + MSG) return null;
  try { p = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b.subarray(0, 12), additionalData: sid }, key, b.subarray(12))); } catch (e) { return null; }
  if (p[0] !== 1) { p.fill(0); return null; }
  for (j = MSG / 2; j > 0 && !(p[2 * j] | p[2 * j + 1]); j--);
  for (i = 0; i < j; i++) s += String.fromCharCode(p[2 + 2 * i] | p[3 + 2 * i] << 8);
  n = p[1]; p.fill(0);
  return { n: n, t: s };
}
/* A pasted message -> the blocks in it by kind, as base64 strings. Between the pieces of a block only spaces, line breaks and
   the invisible marks chat apps add; a time, a name or other words next to it do not spoil it. Whether one is valid is
   for whoever opens it to say */
function grab(msg) {
  var parts = String(msg).match(/[A-Za-z0-9+\/]+|[^A-Za-z0-9+\/]+/g) || [], runs = [], g = [], o = { s: [], a: [], m: [] }, seen = {}, i, j, n, d;
  for (i = 0; i < parts.length; i++) {
    if (/^[A-Za-z0-9+\/]/.test(parts[i])) g.push(parts[i]);
    else if (!/^[\s\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u2069\ufeff]+$/.test(parts[i])) { runs.push(g); g = []; }
  }
  runs.push(g);
  for (i = 0; i < runs.length; i++) {
    for (j = 0; j < runs[i].length; j++) {
      for (d = '', n = j; n < runs[i].length && d.length < ML; n++) {
        d += runs[i][n];
        if (seen[d]) continue;
        if (d.length === SL) { seen[d] = 1; o.s.push(d); } else if (d.length === AL) { seen[d] = 1; o.a.push(d); } else if (d.length === ML) { seen[d] = 1; o.m.push(d); }
      }
    }
  }
  return o;
}

/* raw inflate (RFC 1951), used only where the native stream is missing */
function puff(src, pos) {
  var out = new Uint8Array(Math.max(1024, src.length * 4)), op = 0, bb = 0, bc = 0, last, type, n, fl, fd;
  var LB = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258],
    LE = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
    DB = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577],
    DE = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
    CO = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  function bad() { throw new Error('z'); }
  function bits(k) {
    var v;
    while (bc < k) { if (pos >= src.length) bad(); bb |= src[pos++] << bc; bc += 8; }
    v = bb & ((1 << k) - 1); bb >>>= k; bc -= k;
    return v;
  }
  function table(len, off, cnt) {
    var c = new Uint16Array(16), s = new Uint16Array(cnt), o = new Uint16Array(16), i;
    for (i = 0; i < cnt; i++) c[len[off + i]]++;
    c[0] = 0;
    for (i = 1; i < 16; i++) o[i] = o[i - 1] + c[i - 1];
    for (i = 0; i < cnt; i++) if (len[off + i]) s[o[len[off + i]]++] = i;
    return { c: c, s: s };
  }
  function sym(t) {
    var code = 0, first = 0, idx = 0, l, c;
    for (l = 1; l < 16; l++) {
      code |= bits(1); c = t.c[l];
      if (code - c < first) return t.s[idx + (code - first)];
      idx += c; first += c; first <<= 1; code <<= 1;
    }
    bad();
  }
  function room(k) {
    if (op + k > out.length) { var b = new Uint8Array(Math.max(out.length * 2, op + k)); b.set(out); out = b; }
  }
  function codes(lt, dt) {
    var s, len, d, i;
    for (;;) {
      s = sym(lt);
      if (s < 256) { room(1); out[op++] = s; continue; }
      if (s === 256) return;
      s -= 257; if (s > 28) bad();
      len = LB[s] + bits(LE[s]);
      s = sym(dt); if (s > 29) bad();
      d = DB[s] + bits(DE[s]); if (d > op) bad();
      room(len);
      for (i = 0; i < len; i++, op++) out[op] = out[op - d];
    }
  }
  function fixed() {
    var l, i;
    if (!fl) {
      l = new Uint8Array(318);
      for (i = 0; i < 144; i++) l[i] = 8;
      for (; i < 256; i++) l[i] = 9;
      for (; i < 280; i++) l[i] = 7;
      for (; i < 288; i++) l[i] = 8;
      for (; i < 318; i++) l[i] = 5;
      fl = table(l, 0, 288); fd = table(l, 288, 30);
    }
    codes(fl, fd);
  }
  function dynamic() {
    var nl = bits(5) + 257, nd = bits(5) + 1, nc = bits(4) + 4, cl = new Uint8Array(19), l = new Uint8Array(nl + nd), i, s, r, t;
    if (nl > 286 || nd > 30) bad();
    for (i = 0; i < nc; i++) cl[CO[i]] = bits(3);
    t = table(cl, 0, 19);
    for (i = 0; i < nl + nd;) {
      s = sym(t);
      if (s < 16) { l[i++] = s; continue; }
      r = 0;
      if (s === 16) { if (!i) bad(); r = l[i - 1]; s = 3 + bits(2); }
      else if (s === 17) s = 3 + bits(3);
      else s = 11 + bits(7);
      if (i + s > nl + nd) bad();
      while (s--) l[i++] = r;
    }
    codes(table(l, 0, nl), table(l, nl, nd));
  }
  do {
    last = bits(1); type = bits(2);
    if (type === 0) {
      bb = 0; bc = 0;
      if (pos + 4 > src.length) bad();
      n = src[pos] | (src[pos + 1] << 8); pos += 4;
      if (pos + n > src.length) bad();
      room(n); out.set(src.subarray(pos, pos + n), op); op += n; pos += n;
    } else if (type === 1) fixed();
    else if (type === 2) dynamic();
    else bad();
  } while (!last);
  return out.subarray(0, op);
}
/* zlib stream -> bytes */
async function unz(z) {
  if (typeof DecompressionStream === 'function' && typeof Response === 'function') {
    try {
      return new Uint8Array(await new Response(new Blob([z]).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer());
    } catch (e) { }
  }
  return puff(z, 2);
}

/* LZMA1 decoder (raw stream, output size known), written from the public-domain LZMA specification
   (Igor Pavlov, LzmaSpec.cpp). The whole output stays in memory, so it is also the dictionary.
   props = lc + lp * 9 + pb * 45 */
function unlz(src, props, size) {
  var lc = props % 9, lp = ((props / 9) | 0) % 5, pb = (props / 45) | 0;
  var out = new Uint8Array(size), op = 0, pos = 0, range = 0xffffffff, code = 0, i;
  function bad() { throw new Error('z'); }
  function P(n) { var a = new Uint16Array(n); a.fill(1024); return a; }
  function bit(p, k) {
    var v = p[k], b = (range >>> 11) * v;
    if (code < b) { range = b; p[k] = v + ((2048 - v) >>> 5); v = 0; }
    else { range -= b; code -= b; p[k] = v - (v >>> 5); v = 1; }
    if (range < 16777216) { if (pos >= src.length) bad(); range = (range << 8) >>> 0; code = ((code << 8) | src[pos++]) >>> 0; }
    return v;
  }
  function tree(p, o, n) { var m = 1, k; for (k = 0; k < n; k++) m = (m << 1) | bit(p, o + m); return m - (1 << n); }
  function rtree(p, o, n) { var m = 1, s = 0, k, b; for (k = 0; k < n; k++) { b = bit(p, o + m); m = (m << 1) | b; s |= b << k; } return s; }
  function direct(n) {
    var r = 0;
    while (n--) {
      range >>>= 1;
      if (code >= range) { code -= range; r = (r << 1) | 1; } else r <<= 1;
      if (range < 16777216) { if (pos >= src.length) bad(); range = (range << 8) >>> 0; code = ((code << 8) | src[pos++]) >>> 0; }
    }
    return r >>> 0;
  }
  function len(L, ps) {
    if (!bit(L, 0)) return tree(L, 2 + (ps << 3), 3);
    if (!bit(L, 1)) return 8 + tree(L, 130 + (ps << 3), 3);
    return 16 + tree(L, 258, 8);
  }
  if (lc > 8 || pb > 4 || src.length < 5 || src[0] !== 0) bad();
  for (i = 1; i < 5; i++) code = ((code << 8) | src[i]) >>> 0;
  pos = 5;
  var lit = P(0x300 << (lc + lp)), isM = P(192), isR = P(12), g0 = P(12), g1 = P(12), g2 = P(12), r0l = P(192),
    slot = P(256), pd = P(115), al = P(16), ld = P(514), rl = P(514);
  var st = 0, d0 = 0, d1 = 0, d2 = 0, d3 = 0, pm = (1 << pb) - 1, lm = (1 << lp) - 1, ps, s, mb, b, mbit, n, k, t;
  while (op < size) {
    ps = op & pm;
    if (!bit(isM, (st << 4) + ps)) {
      k = 0x300 * (((op & lm) << lc) + ((op ? out[op - 1] : 0) >> (8 - lc)));
      s = 1;
      if (st >= 7) {
        mb = out[op - d0 - 1];
        do { mbit = (mb >> 7) & 1; mb <<= 1; b = bit(lit, k + ((1 + mbit) << 8) + s); s = (s << 1) | b; if (mbit !== b) break; } while (s < 256);
      }
      while (s < 256) s = (s << 1) | bit(lit, k + s);
      out[op++] = s & 255;
      st = st < 4 ? 0 : st < 10 ? st - 3 : st - 6;
      continue;
    }
    if (bit(isR, st)) {
      if (!op) bad();
      if (!bit(g0, st)) {
        if (!bit(r0l, (st << 4) + ps)) { st = st < 7 ? 9 : 11; out[op] = out[op - d0 - 1]; op++; continue; }
      } else {
        if (!bit(g1, st)) t = d1;
        else { if (!bit(g2, st)) t = d2; else { t = d3; d3 = d2; } d2 = d1; }
        d1 = d0; d0 = t;
      }
      n = len(rl, ps); st = st < 7 ? 8 : 11;
    } else {
      d3 = d2; d2 = d1; d1 = d0;
      n = len(ld, ps); st = st < 7 ? 7 : 10;
      s = tree(slot, (n < 3 ? n : 3) << 6, 6);
      if (s < 4) d0 = s;
      else {
        k = (s >> 1) - 1; d0 = (2 | (s & 1)) * Math.pow(2, k);
        if (s < 14) d0 += rtree(pd, d0 - s, k);
        else d0 += direct(k - 4) * 16 + rtree(al, 0, 4);
      }
      if (d0 >= op) bad();
    }
    n += 2;
    if (op + n > size) bad();
    for (k = op - d0 - 1, t = op + n; op < t;) out[op++] = out[k++];
  }
  return out;
}
var LZP = 93;   /* lc 3, lp 0, pb 2 */

/* bytes [off, off + len) of the base64 string s, without decoding the rest */
function b64at(s, off, len) {
  var a = Math.floor(off / 3), b = Math.ceil((off + len) / 3);
  return b64d(s.slice(a * 4, b * 4)).subarray(off - a * 3, off - a * 3 + len);
}
/* base64 of the parts joined, as a list of strings (no single big copy) */
function b64parts(parts) {
  var out = [], rest = new Uint8Array(0), i, a, n;
  for (i = 0; i < parts.length; i++) {
    a = rest.length ? cat(rest, parts[i]) : parts[i];
    n = i === parts.length - 1 ? a.length : a.length - a.length % 3;
    out.push(b64e(a.subarray(0, n)));
    rest = a.subarray(n);
  }
  return out;
}

/* file layout:  salt(16) | box(u32le at, u32le len of the index) | blocks | index | random tail
   box = iv(12) | AES-GCM ciphertext and tag. Additional data: 'h' for the header, 'i' for the index, '<text>.<block>' for a block
   (and 'c' for the reading position, which lives only in memory).
   index = { v: 2, u: {code: interface texts}, t: [{ l, n, d, g, t, a, dd, b: [[name, block, at, len]], k: [[off, len, 'x'|'z', size]] }] }
   A copy sent at a distance:  salt of the receiver's code(16) | enc(32) | box(header) | ... the same ...
   with the key of the file from HPKE (fkey). Nothing in clear says which of the two a file is: the key is tried both ways,
   with a single Argon2id (the salt is in the same place in both). */
var HEAD = 52, HEAD2 = 84;
async function open(pass, s) {
  var top = b64at(s, 0, HEAD2), ikm = await argon(pass, top.subarray(0, 16)), key, h = null, p, v, ix;
  try {
    key = await aes(ikm);
    try { h = await unseal(key, top.subarray(16, HEAD), 'h'); } catch (e) { h = null; }
    if (!h) {
      p = await dkp(ikm);
      try { key = await fkey(await open2(top.slice(16, 48), p.sk, p.pk, INFO)); } finally { p.sk.fill(0); }
      h = await unseal(key, top.subarray(48, HEAD2), 'h');
    }
  } finally { ikm.fill(0); }
  v = new DataView(h.buffer, h.byteOffset, 8);
  ix = await unseal(key, b64at(s, v.getUint32(0, true), v.getUint32(4, true)), 'i');
  return { key: key, m: JSON.parse(td.decode(ix)) };
}
/* compressed block j of text i, then its bytes */
function piece(key, s, m, i, j) { return unseal(key, b64at(s, m.t[i].k[j][0], m.t[i].k[j][1]), i + '.' + j); }
function inflate(k, p) { return k[2] === 'x' ? unlz(p, LZP, k[3]) : unz(p); }
/* to: a key, or a code read by unpack() (a copy sent at a distance). get(i, j) -> compressed block j of text i.
   Fills the offsets of m.t[].k and returns the parts of the file */
async function build(to, m, get) {
  var pre, key, out = [], at, i, j, t, b, ix, h = new Uint8Array(8), v = new DataView(h.buffer), z = rand(2), e;
  if (typeof to === 'string') { pre = rand(16); key = await kdf(to, pre); }
  else { e = await seal2(to.pk, INFO); pre = cat(to.salt, e.enc); key = await fkey(e.ks); }
  at = pre.length + 36;
  for (i = 0; i < m.t.length; i++) {
    for (t = m.t[i], j = 0; j < t.k.length; j++) {
      b = await seal(key, await get(i, j), i + '.' + j);
      t.k[j][0] = at; t.k[j][1] = b.length; at += b.length; out.push(b);
    }
  }
  ix = await seal(key, te.encode(JSON.stringify(m)), 'i');
  v.setUint32(0, at, true); v.setUint32(4, ix.length, true);
  return [pre, await seal(key, h, 'h')].concat(out, [ix, rand(z[0] << 8 | z[1])]);
}

/* search folding: case, Latin/Hebrew/Arabic marks, Arabic-script letter variants */
function norm(s) {
  return s.normalize('NFD')
    .replace(/[\u0300-\u036f\u0591-\u05c7\u064b-\u065f\u0670\u06d6-\u06ed\u0640\u200b-\u200f]/g, '')
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627').replace(/[\u0649\u06cc]/g, '\u064a')
    .replace(/\u06a9/g, '\u0643').replace(/\u0629/g, '\u0647').replace(/\s+/g, ' ').toLowerCase();
}

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

/* the whole file; the same function builds the first copy and every later one */
function assemble(p) {
  var sc = 'script';
  return '<!doctype html>\n<html lang="' + esc(p.lang) + '" dir="' + esc(p.dir) + '">\n<head>\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    '<meta http-equiv="Content-Security-Policy" content="' + esc(p.csp) + '">\n' +
    '<meta name="referrer" content="no-referrer">\n<title>' + esc(p.title) + '</title>\n' +
    '<style>' + p.css + '</style>\n</head>\n<body>\n' +
    '<' + sc + ' type="application/json" id="u">' + p.ui + '</' + sc + '>\n' +
    '<' + sc + ' type="application/octet-stream" id="d">' + p.blob + '</' + sc + '>\n' +
    '<' + sc + '>' + p.js + '</' + sc + '>\n</body>\n</html>\n';
}
/* </core> */

/* ---------- small DOM helpers ---------- */
var IC = {
  plus: 'M12 5v14M5 12h14', minus: 'M5 12h14', back: 'M15 5l-7 7 7 7', next: 'M9 5l7 7-7 7',
  x: 'M6 6l12 12M18 6L6 18', search: 'M11 4a7 7 0 1 0 0 14a7 7 0 0 0 0-14zM20 20l-4-4',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12', more: 'M5 12h.01M12 12h.01M19 12h.01',
  share: 'M12 15V4M8 8l4-4 4 4M5 14v5h14v-5', down: 'M12 4v11M8 11l4 4 4-4M5 14v5h14v-5', info: 'M12 11v6M12 7.5v.01M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z', msg: 'M4 5h16v11H10l-4 4v-4H4z',
  globe: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18'
};
function ic(n) {
  var t = D.createElement('span');
  t.innerHTML = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path' + (n === 'more' ? ' stroke-width="3"' : '') + ' d="' + IC[n] + '"/></svg>';
  return t.firstChild;
}
function el(tag, cls) {
  var e = D.createElement(tag), i, a;
  if (cls) e.className = cls;
  for (i = 2; i < arguments.length; i++) {
    a = arguments[i];
    if (a != null) e.appendChild(typeof a === 'string' ? D.createTextNode(a) : a);
  }
  return e;
}
function btn(cls, icon, label, fn) {
  var b = el('button', cls, icon ? ic(icon) : null);
  b.type = 'button';
  if (label) { b.setAttribute('aria-label', label); b.title = label; }
  b.onclick = fn;
  return b;
}
function wipe(n) { while (n.firstChild) n.removeChild(n.firstChild); }
function plain(i) {
  i.autocomplete = 'off'; i.spellcheck = false;
  i.setAttribute('autocapitalize', 'none'); i.setAttribute('autocorrect', 'off');
  return i;
}
function later(fn, ms) { var t = 0; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }

/* ---------- storage (best effort) ---------- */
var mem = {};
/* the reading position lives only in memory (pc), encrypted: storage would show, without the key, that the reader was used,
   and every file opened in the same browser shares it. Older versions kept it in storage: remove what they left. */
try { localStorage.removeItem('nt.c'); } catch (e) { }
function sg(k) { try { var v = localStorage.getItem(k); if (v !== null) return v; } catch (e) { } return k in mem ? mem[k] : null; }
function ss(k, v) { mem[k] = v; try { localStorage.setItem(k, v); } catch (e) { } }

var U = JSON.parse(D.getElementById('u').textContent), LANG = D.documentElement.lang || 'en';
var prefs = {};
try { prefs = JSON.parse(sg('nt.p') || '{}') || {}; } catch (e) { }
function look() {
  D.documentElement.className = prefs.t || '';
  D.documentElement.style.setProperty('--fs', (prefs.f || 18) + 'px');
}
function setPref(k, v) { prefs[k] = v; ss('nt.p', JSON.stringify(prefs)); look(); }
look();

/* ---------- history: one sentinel entry so Back stays inside ---------- */
var armed = false, skip = false;
function arm() { if (armed) return; try { history.pushState({ z: 1 }, ''); armed = true; } catch (e) { } }
function disarm() { if (!armed) return; armed = false; skip = true; try { history.back(); } catch (e) { skip = false; } }
W.addEventListener('popstate', function () {
  if (skip) { skip = false; return; }
  armed = false;
  if (S) { if (rBack()) arm(); } else if (!ev.hidden) shut();
});

/* ---------- notes ---------- */
var root = el('div', 'app'), cv = el('section', 'cv'), rd = el('section', 'rd');
var notes = [], cur = null;
try { notes = JSON.parse(sg('nt.n') || '[]'); if (!Array.isArray(notes)) notes = []; } catch (e) { notes = []; }
function keep() { ss('nt.n', JSON.stringify(notes)); }

var q = plain(el('input')); q.type = 'search'; q.placeholder = U.s; q.setAttribute('aria-label', U.s); q.setAttribute('enterkeyhint', 'search');
var sf = el('form', 'sf', q), ul = el('ul', 'ls');
var lv = el('div', 'lv', el('header', 'hd', el('h1', null, U.t)), sf, ul);
var fab = btn('fab', 'plus', U.n, function () { edit(null); });
var ta = el('textarea'); ta.placeholder = U.p;
var ev = el('div', 'ed', el('div', 'bar', btn('ib fl', 'back', U.b, function () { shut(); disarm(); }), el('span', 'gr'),
  btn('ib', 'trash', U.d, function () { drop(); disarm(); })), ta);
ev.hidden = true;

function when(ms) {
  try { return new Date(ms).toLocaleDateString(LANG, { day: 'numeric', month: 'short' }); } catch (e) { return ''; }
}
function draw() {
  var f = norm(q.value.trim()), n = 0;
  wipe(ul);
  notes.sort(function (a, b) { return b.m - a.m; });
  notes.forEach(function (o) {
    if (f && norm(o.x).indexOf(f) < 0) return;
    var lines = o.x.split('\n').filter(function (s) { return s.trim(); });
    var li = el('li', null, el('b', null, lines[0] || ''), lines.length > 1 ? el('span', null, lines.slice(1).join(' ').slice(0, 120)) : null, el('i', null, when(o.m)));
    li.onclick = function () { edit(o); };
    ul.appendChild(li); n++;
  });
  if (!n) ul.appendChild(el('p', 'em', f ? U.z : U.e));
}
function edit(o) {
  cur = o; ta.value = o ? o.x : '';
  lv.hidden = true; fab.hidden = true; ev.hidden = false; arm();
  if (!o) ta.focus();
}
function commit() {
  var x = ta.value;
  if (!cur) {
    if (!x.trim()) return;
    cur = { i: Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36), x: x, m: Date.now() };
    notes.unshift(cur);
  } else if (cur.x !== x) { cur.x = x; cur.m = Date.now(); } else return;
  keep();
}
function leave() { cur = null; ta.value = ''; ev.hidden = true; lv.hidden = false; fab.hidden = false; draw(); }
function shut() {
  if (ev.hidden) return;
  commit();
  if (cur && !cur.x.trim()) { notes.splice(notes.indexOf(cur), 1); keep(); }
  leave();
}
function drop() {
  var i = cur ? notes.indexOf(cur) : -1;
  if (i >= 0) { notes.splice(i, 1); keep(); }
  leave();
}
ta.oninput = later(function () { if (!ev.hidden) commit(); }, 400);
q.oninput = draw;
sf.onsubmit = function (e) { e.preventDefault(); enter(q.value); };

/* ---------- unlock: the search box, Enter ---------- */
var pc = null, raw = null, busy = false, away = false, S = null, R = null, hold = false, idleT = 0, mk = false;
async function enter(v) {
  var r = null;
  v = v.trim();
  if (!v || busy || S || !W.crypto || !crypto.subtle) return;
  // a key has 16 characters at least (in a key of digits, 16 digits): anything shorter is just a search of the notes
  if (Array.from(fold(v)).length < 16) return;
  // a key attempt leaves nothing on screen, right or wrong: not in the box, not in the recent-apps picture
  q.value = ''; draw(); q.blur();
  busy = true; away = false;
  try {
    if (!raw) raw = D.getElementById('d').textContent;
    r = await open(v, raw);
  } catch (e) { r = null; }
  busy = false; v = '';
  // the person left the app while the key was being checked: the reader does not open behind their back
  if (!r || away) return;
  start(r);
}

/* ---------- reader ---------- */
var HD = { s: 1, S: 1, d: 1, r: 1, a: 1 };
var ttl, pg, pn, mn, sb, bkb, rg, rgT = 0;

function num(x) {
  var g = S && S.m.g;
  x = String(x);
  return g ? x.replace(/[0-9]/g, function (c) { return String.fromCharCode(g + +c); }) : x;
}
function put(node) { wipe(pg); pg.appendChild(node); pg.scrollTop = 0; }
function set(v) {
  if (v.t === 'books' || v.t === 'chap' || v.t === 'text') S.pv = v;
  S.v = v; hold = false; mn.hidden = true; pn.hidden = v.t !== 'text'; bkb.hidden = v.t === 'books'; sb.hidden = v.t === 'copy' || v.t === 'about' || v.t === 'msg'; S.tok++;   // search is hidden here: on these forms it would throw away what is typed
}
function item(icon, label, fn) {
  var b = el('button', 'it', ic(icon), el('span', null, label));
  b.type = 'button'; b.onclick = function () { mn.hidden = true; fn(); };
  return b;
}
function size(d) { setPref('f', Math.max(14, Math.min(30, (prefs.f || 18) + d))); }
function flip() {
  var dark = prefs.t ? prefs.t === 'd' : !!(W.matchMedia && W.matchMedia('(prefers-color-scheme:dark)').matches);
  setPref('t', dark ? 'l' : 'd');
}

/* one state per open text; switching text makes a new one, so pending work for the old one stops */
function fresh(k, x, i, v, pv) { return { k: k, x: x, ti: i, m: x.t[i], bl: {}, bo: [], bk: {}, ord: [], ix: [], tok: 0, v: v, pv: pv }; }
// decrypted blocks are overwritten with zeros; books and the search index (strings) are let go
function forget(s) { for (var k in s.bl) { try { s.bl[k].fill(0); } catch (e) { } } s.bl = {}; s.bo = []; s.bk = {}; s.ord = []; s.ix = []; }
function use(i) {
  var o = S;
  forget(o);
  S = fresh(o.k, o.x, i, o.v, o.pv);
  pn.dir = S.m.d;
  books();
}
// first language of the phone that the file has (exact code, then without region); read locally, never sent
function phone(has) {
  var l = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''], i, c;
  for (i = 0; i < l.length; i++) {
    c = String(l[i]).toLowerCase();
    if (has(c)) return c;
    c = c.split('-')[0];
    if (has(c)) return c;
  }
  return null;
}
async function start(r) {
  var x = r.m, pos = null, c, i, ti = -1;
  S = fresh(r.key, x, 0, null, null);
  var ul = phone(function (c) { return !!(x.u[c] && x.u[c].r); }) || (x.u[LANG] ? LANG : x.u.en ? 'en' : Object.keys(x.u)[0]);
  R = x.u[ul].r;
  rd.lang = ul; rd.dir = x.u[ul].dir === 'rtl' ? 'rtl' : 'ltr';
  wipe(rd);
  ttl = el('button', 'tt'); ttl.type = 'button';
  ttl.onclick = function () { var v = S.v; if (v.t === 'text') up(v.b); else books(); };
  pg = el('main', 'pg'); pg.onclick = function () { mn.hidden = true; };
  rg = ring();
  pn = el('div', 'pn', btn('rb fl', 'back', R.pv, function () { step(-1); }), rg, btn('rb fl', 'next', R.nx, function () { step(1); }));
  mn = el('div', 'mn',
    el('div', 'fr', el('span', null, R.f), btn('ib', 'minus', R.f + ' -', function () { size(-2); }), btn('ib', 'plus', R.f + ' +', function () { size(2); })),
    item('moon', R.th, flip), x.t.length > 1 ? item('globe', R.lg, langs) : null, item('share', R.cp, pass), item('down', R.rc, mine), item('msg', R.ms, chat), item('info', R.ab, about));
  mn.hidden = true;
  bkb = btn('ib fl', 'back', R.bk, function () { if (S && S.v.t !== 'books') rBack(); });
  rd.appendChild(el('div', 'bar', btn('ib', 'x', R.x, function () { lock(); }), bkb, ttl,
    (sb = btn('ib', 'search', R.s, find)), btn('ib', 'more', R.m, function () { mn.hidden = !mn.hidden; })));
  rd.appendChild(pg); rd.appendChild(pn); rd.appendChild(mn);
  cv.hidden = true; rd.hidden = false; arm(); idle();
  var s = S;
  try { c = pc; if (c) pos = JSON.parse(td.decode(await unseal(s.k, c, 'c'))); } catch (e) { pos = null; }
  if (S !== s) return;
  // last text read; otherwise the one in the language of the notes; otherwise the first
  for (i = 0; i < x.t.length; i++) if (pos && x.t[i].l === pos.l && ti < 0) ti = i;
  if (ti < 0) { pos = null; for (i = 0; i < x.t.length; i++) if (x.t[i].l === LANG && ti < 0) ti = i; }
  S = fresh(s.k, x, ti < 0 ? 0 : ti, null, null);
  // nothing read yet since the file was opened: a short notice above the books; nothing is stored for it
  S.fi = !c;
  pn.dir = S.m.d;
  // a conversation going on: straight to it (the person is coming back from the chat with a block copied)
  if (alive()) chat(); else if (pos && S.m.b[pos.b]) text(pos.b, pos.c); else books();
}

/* name of a text in the language lists: the language itself; the version (it is in About) only if two texts share a language */
function lname(x, t) {
  var u = x.u[t.l];
  return u && u.nm && !x.t.some(function (o) { return o !== t && o.l === t.l; }) ? u.nm : t.n;
}

function langs() {
  var w = el('div', 'gd lg');
  set({ t: 'lang' }); ttl.textContent = R.lg;
  S.x.t.forEach(function (t, i) {
    var b = el('button', 'bk' + (i === S.ti ? ' on' : ''), lname(S.x, t));
    b.type = 'button'; b.dir = t.d;
    b.onclick = function () { if (i === S.ti) books(); else use(i); };
    w.appendChild(b);
  });
  put(w);
}

function lock(fromPop) {
  if (!S) return;
  clearTimeout(idleT);
  forget(S);
  S = null; R = null; hold = false;
  wipe(rd); rd.hidden = true; rd.removeAttribute('lang'); rd.removeAttribute('dir'); cv.hidden = false;
  if (!fromPop) disarm();
}
// 30 seconds without touching the screen close the reader; never in the middle of making a copy
function idle() {
  clearTimeout(idleT);
  if (!S) return;
  idleT = setTimeout(function () { if (mk) idle(); else lock(); }, 30000);
  // the ring shows the time running out; restarted at most once a second so scrolling stays smooth
  if (rg && Date.now() - rgT > 1000) { var c = rg.lastChild; rgT = Date.now(); c.style.animation = 'none'; void c.getBoundingClientRect(); c.style.animation = ''; }
}
/* time left before the reader closes on its own: a circle that empties over the 30 seconds */
function ring() {
  var t = D.createElement('span');
  t.innerHTML = '<svg class="rg" viewBox="0 0 24 24" aria-hidden="true"><circle class="rk" cx="12" cy="12" r="9"/><circle class="rv" cx="12" cy="12" r="9"/></svg>';
  rgT = 0;
  return t.firstChild;
}

/* Back: true while the reader stays open */
function rBack() {
  var v = S.v;
  if (!mn.hidden) { mn.hidden = true; return true; }
  if (v.t === 'text') { up(v.b); return true; }
  if (v.t === 'chap') { books(); return true; }
  if (v.t === 'books') { lock(true); return false; }
  v = S.pv;
  if (v && v.t === 'text') text(v.b, v.c); else if (v && v.t === 'chap') chap(v.b); else books();
  return true;
}

/* a block holds several books: decrypted and unpacked on first use, at most two kept */
async function block(j) {
  var s = S, d = s.bl[j], p, o;
  if (d) return d;
  p = await piece(s.k, raw, s.x, s.ti, j);
  d = await inflate(s.m.k[j], p);
  p.fill(0);
  if (S !== s) { d.fill(0); return null; }      // closed or switched meanwhile: wiped, not kept
  s.bl[j] = d; s.bo.push(j);
  if (s.bo.length > 2) { o = s.bo.shift(); if (s.bl[o]) { s.bl[o].fill(0); delete s.bl[o]; } }
  return d;
}
async function book(i) {
  var s = S, c = s.bk[i], e, d;
  if (c) return c;
  e = s.m.b[i];
  d = await block(e[1]);
  if (!d) return [];
  c = JSON.parse(td.decode(d.subarray(e[2], e[2] + e[3])));
  s.bk[i] = c; s.ord.push(i);
  if (s.ord.length > 3) delete s.bk[s.ord.shift()];
  return c;
}

function books() {
  var g = el('div', 'gd');
  set({ t: 'books' }); ttl.textContent = S.m.n;
  g.dir = S.m.d;
  S.m.b.forEach(function (e, i) {
    var b = el('button', 'bk', e[0]);
    b.type = 'button'; b.onclick = function () { chap(i); };
    if (i && i === S.m.t) g.appendChild(el('hr'));
    g.appendChild(b);
  });
  var w = el('div');
  if (S.fi) {
    var ok = el('button', 'sb', R.ok), fi = el('div', 'fi', el('p', null, R.fi), ok);
    ok.type = 'button'; ok.onclick = function () { if (S) S.fi = false; fi.remove(); };
    w.appendChild(fi);
  }
  w.appendChild(g);
  if (S.m.dd) {
    var q = S.m.dd, d = el('section', 'dd', el('h2', null, q[1]), el('p', null, q[2]), el('p', null, q[3]), bold(q[4]));
    d.dir = q[0];
    w.appendChild(d);
  }
  put(w);
}
/* a paragraph where *name* goes in bold */
function bold(s) {
  var n = el('p'), a = s.split('*'), i;
  for (i = 0; i < a.length; i++) if (a[i]) n.appendChild(i % 2 ? el('b', null, a[i]) : D.createTextNode(a[i]));
  return n;
}
/* from a text page up to its chapter grid; one-chapter books go straight to the list */
async function up(i) {
  var s = S, bk = await book(i);
  if (S !== s) return;
  if (bk.length < 2) books(); else chap(i, bk);
}
async function chap(i, known) {
  var s = S, bk = known || await book(i), g;
  if (S !== s) return;
  if (bk.length < 2 && !known) return text(i, bk[0][0]);
  set({ t: 'chap', b: i }); ttl.textContent = s.m.b[i][0];
  g = el('div', 'gd cg'); g.dir = s.m.d;
  bk.forEach(function (ch) {
    var b = el('button', 'ch', num(ch[0]));
    b.type = 'button'; b.onclick = function () { text(i, ch[0]); };
    g.appendChild(b);
  });
  put(g);
}
async function text(i, cn, mark) {
  var s = S, bk = await book(i), ch = bk[0], x, k, j, b, p, sp, lab = '', hit = null, name;
  if (S !== s) return;
  for (k = 0; k < bk.length; k++) if (bk[k][0] === cn) ch = bk[k];
  set({ t: 'text', b: i, c: ch[0] });
  name = s.m.b[i][0] + ' ' + num(ch[0]);
  ttl.textContent = name;
  x = el('article', 'tx', el('h2', null, name)); x.dir = s.m.d;
  for (k = 1; k < ch.length; k++) {
    b = ch[k];
    if (b[0] === 'b') { x.appendChild(el('div', 'k-b')); continue; }
    p = el('p', 'k-' + b[0]);
    if (HD[b[0]]) { p.textContent = b[1]; x.appendChild(p); continue; }
    for (j = 1; j < b.length; j += 2) {
      if (b[j] !== '') lab = String(b[j]);
      sp = el('span', null, b[j] !== '' ? el('sup', null, num(b[j])) : null, b[j + 1] + ' ');
      if (mark != null && lab === String(mark)) { sp.className = 'on'; if (!hit) hit = sp; }
      p.appendChild(sp);
    }
    x.appendChild(p);
  }
  put(x);
  if (hit && hit.scrollIntoView) hit.scrollIntoView({ block: 'center' });
  try { pc = await seal(s.k, te.encode(JSON.stringify({ l: s.m.l, b: i, c: ch[0] })), 'c'); } catch (e) { }
}
async function step(d) {
  var s = S, v = s.v, bk, k, at = 0, nb;
  if (v.t !== 'text') return;
  bk = await book(v.b);
  if (S !== s) return;
  for (k = 0; k < bk.length; k++) if (bk[k][0] === v.c) at = k;
  if (bk[at + d]) return text(v.b, bk[at + d][0]);
  nb = v.b + d;
  if (!s.m.b[nb]) return;
  bk = await book(nb);
  if (S !== s) return;
  text(nb, bk[d > 0 ? 0 : bk.length - 1][0]);
}

/* search */
async function index(i) {
  var s = S, ix = s.ix[i], bk, a, b, j, ch, bl, last;
  if (ix) return ix;
  bk = await book(i);
  ix = { c: [], n: [], x: [], k: [] };
  for (a = 0; a < bk.length; a++) {
    ch = bk[a]; last = -1;
    for (b = 1; b < ch.length; b++) {
      bl = ch[b];
      if (HD[bl[0]] || bl[0] === 'b') continue;
      for (j = 1; j < bl.length; j += 2) {
        if (bl[j] !== '' || last < 0) { ix.c.push(ch[0]); ix.n.push(String(bl[j])); ix.x.push(bl[j + 1]); last = ix.x.length - 1; }
        else ix.x[last] += ' ' + bl[j + 1];
      }
    }
  }
  for (j = 0; j < ix.x.length; j++) ix.k.push(norm(ix.x[j]));
  s.ix[i] = ix;
  return ix;
}
/* where the folded terms sit in the original string: merged [from, to) ranges */
function spots(x, terms) {
  var k = '', mp = [], out = [], i, c, j, t, z;
  for (i = 0; i < x.length; i++) { c = norm(x.charAt(i)); for (j = 0; j < c.length; j++) mp.push(i); k += c; }
  for (t = 0; t < terms.length; t++) {
    i = k.indexOf(terms[t]);
    if (i < 0) continue;
    z = mp[i + terms[t].length - 1] + 1;
    while (z < x.length && norm(x.charAt(z)) === '') z++;
    out.push([mp[i], z]);
  }
  out.sort(function (p, q) { return p[0] - q[0]; });
  for (i = 1; i < out.length;) {
    if (out[i][0] <= out[i - 1][1]) { out[i - 1][1] = Math.max(out[i - 1][1], out[i][1]); out.splice(i, 1); } else i++;
  }
  return out;
}
function snip(x, terms) {
  var r = spots(x, terms), node = el('span'), a = 0, p, end, i;
  if (!r.length) { node.textContent = x.length > 220 ? x.slice(0, 220) + '\u2026' : x; return node; }
  if (r[0][0] > 70) { a = x.indexOf(' ', r[0][0] - 50); a = a < 0 || a > r[0][0] ? r[0][0] : a + 1; }
  end = Math.min(x.length, a + 260);
  if (a) node.appendChild(D.createTextNode('\u2026'));
  for (i = 0, p = a; i < r.length && r[i][0] < end; i++) {
    node.appendChild(D.createTextNode(x.slice(p, r[i][0])));
    p = Math.min(r[i][1], end);
    node.appendChild(el('mark', null, x.slice(r[i][0], p)));
  }
  node.appendChild(D.createTextNode(x.slice(p, end) + (end < x.length ? '\u2026' : '')));
  return node;
}
/* exact phrase first, then entries holding every word */
async function run(qs, out) {
  var s = S, tok = ++s.tok, phrase = norm(qs).trim(), terms = phrase.split(' ').filter(Boolean);
  var seen = {}, n = 0, bar = el('i', 'pr'), pass, i, j, k, ix, ok, fresh;
  wipe(out);
  if (phrase.replace(/ /g, '').length < 2) return;
  out.appendChild(bar);
  for (pass = 0; pass < (terms.length > 1 ? 2 : 1); pass++) {
    for (i = 0; i < s.m.b.length; i++) {
      fresh = !s.ix[i];
      ix = await index(i);
      if (S !== s || s.tok !== tok) return;
      for (j = 0; j < ix.k.length; j++) {
        if (!pass) ok = ix.k[j].indexOf(phrase) >= 0;
        else { ok = !seen[i + '.' + j]; for (k = 0; k < terms.length && ok; k++) ok = ix.k[j].indexOf(terms[k]) >= 0; }
        if (!ok) continue;
        if (!pass) seen[i + '.' + j] = 1;
        out.appendChild(found(i, ix.c[j], ix.n[j], ix.x[j], pass ? terms : [phrase]));
        if (++n >= 200) { out.removeChild(bar); out.appendChild(el('p', 'em', '\u2026')); return; }
      }
      if (!pass) bar.style.width = Math.round((i + 1) * 100 / s.m.b.length) + '%';
      if (fresh || i % 8 === 7) {
        await new Promise(function (f) { setTimeout(f, 0); });
        if (S !== s || s.tok !== tok) return;
      }
    }
  }
  out.removeChild(bar);
  if (!n) out.appendChild(el('p', 'em', R.z));
}
function found(i, c, n, x, terms) {
  var b = el('button', 'ht', el('b', null, S.m.b[i][0] + ' ' + num(c) + (n ? ':' + num(n) : '')), snip(x, terms));
  b.type = 'button'; b.dir = S.m.d;
  b.onclick = function () { text(i, c, n); };
  return b;
}
function find() {
  var inp = plain(el('input')), out = el('div');
  inp.type = 'search'; inp.placeholder = R.s; inp.setAttribute('aria-label', R.s);
  set({ t: 'find' }); ttl.textContent = R.s;
  inp.oninput = later(function () { if (S && S.v.t === 'find') run(inp.value, out); }, 250);
  put(el('div', 'fv', inp, out));
  inp.focus();
}

/* hand a copy on: in person (a new key, said face to face) or at a distance (to the code the other person sends) */
function field(label, type, value) {
  var i = plain(el('input')), l = el('label', null, label, i);
  i.type = type; if (value) i.value = value;
  if (type === 'password') i.autocomplete = 'new-password';
  l.i = i;
  return l;
}
// the key of every copy: 20 random digits in groups of four (10^20, 66 bits). Every keyboard has digits and every
// language can say them; fold() takes them from any script, with or without the spaces.
function suggest() {
  var s = '', r;
  while (s.replace(/ /g, '').length < 20) {
    r = rand(1)[0];
    if (r >= 250) continue;               // 250 = 25 * 10: no bias
    if (s.length % 5 === 4) s += ' ';
    s += r % 10;
  }
  return s;
}
// the language of the phone, for the code (read here, it goes nowhere else)
function tongue() { return (navigator.languages && navigator.languages[0]) || navigator.language || ''; }
function pass() {
  var a = el('button', 'pb', R.ps), b = el('button', 'sb', R.pd);
  a.type = 'button'; b.type = 'button'; a.onclick = copy; b.onclick = far;
  set({ t: 'copy' }); ttl.textContent = R.cp;
  put(el('div', 'fm', a, b));
}
/* a new key, always made here, never invented: a verse or a date is guessed offline in seconds, 20 random digits are not.
   Seen only on this screen, never stored, and not selectable, so it never reaches the clipboard (Android keeps its history).
   Typing it back proves it was written down. T: the texts (the reader's, or the invitation's) */
function keybox(T) {
  var o = { key: '' }, kv = el('p', 'kv'), ot = el('button', 'sb', T.ot);
  o.field = field(T.k2, 'password');
  o.fill = function () { o.key = suggest(); kv.textContent = o.key; o.field.i.value = ''; if (o.msg) o.msg.textContent = ''; };
  o.hide = function () { o.key = ''; kv.textContent = ''; o.field.i.value = ''; };
  // typed back with any digits, spaces or none: fold() makes both the same
  o.ok = function () { return !!o.key && fold(o.field.i.value) === fold(o.key); };
  o.field.i.setAttribute('inputmode', 'numeric');
  ot.type = 'button'; ot.onclick = o.fill; kv.dir = 'ltr';
  o.box = el('div', 'ks', el('span', null, T.k1), kv, ot);
  o.fill();
  return o;
}
var ALIAS = { ms: 'zlm' };   // a phone language whose text goes by another code
/* what goes in a copy, the same for both ways: which texts, the language of the notes and the name of the file.
   lg: the language of the other phone (a copy sent at a distance), ticked if this file has it */
function choose(x, lg) {
  var f = field(R.fn, 'text', U.f), cs = [], box = null, sel = null, nf = U.f, codes = Object.keys(x.u), touched = false, first = S.ti, i;
  for (i = 0; lg && i < x.t.length; i++) if (!x.t[i].p && (x.t[i].l === lg || x.t[i].l === ALIAS[lg])) { first = i; break; }
  // the notes language follows the first text ticked, until the person picks one by hand
  function follow() {
    if (!sel || touched) return;
    for (var i = 0; i < x.t.length; i++) if (!cs.length || cs[i].checked) {
      if (x.u[x.t[i].l]) { sel.value = x.t[i].l; sel.onchange(); }
      return;
    }
  }
  // which texts go in the copy: only one by default (a lighter, less conspicuous file)
  if (x.t.length > 1) {
    box = el('fieldset', 'ck', el('legend', null, R.cl));
    x.t.forEach(function (t, i) {
      var c = el('input'), n = el('span', null, lname(x, t)), l = el('label', null, c, n);
      c.type = 'checkbox'; c.checked = i === first && !t.p; n.dir = t.d;
      if (t.p) { c.disabled = true; l.style.opacity = '.5'; }   // permiso del titular pendiente: no sale en copias
      c.onchange = follow;
      cs.push(c); box.appendChild(l);
    });
    // marcar / desmarcar todo (los textos con permiso pendiente quedan siempre fuera)
    var tg = el('button', 'sb tg', ''), pick = function () { return cs.filter(function (c) { return !c.disabled; }); };
    var sync = function () { tg.textContent = pick().every(function (c) { return c.checked; }) ? R.cn || '\u2610' : R.ca || '\u2611'; };
    tg.type = 'button';
    tg.onclick = function () {
      var on = pick(), v = !on.every(function (c) { return c.checked; });
      on.forEach(function (c) { c.checked = v; });
      sync(); follow();
    };
    cs.forEach(function (c) { var f0 = c.onchange; c.onchange = function () { f0(); sync(); }; });
    sync();
    box.insertBefore(tg, box.children[1]);
  }
  // language of the notes in the copy
  if (codes.length > 1) {
    var start = lg && x.u[lg] ? lg : LANG;
    sel = el('select');
    codes.forEach(function (c) { var o = el('option', null, x.u[c].nm || c); o.value = c; if (c === start) o.selected = true; sel.appendChild(o); });
    sel.onchange = function () { var v = x.u[sel.value].c.f; if (f.i.value === nf) f.i.value = v; nf = v; };
    sel.addEventListener('change', function () { touched = true; });   // only a real change by the person (not follow())
    // a copy sent at a distance: the notes go in the language of the other phone, whatever texts are ticked
    if (start !== LANG) { sel.onchange(); touched = true; }
    follow();
  }
  return {
    f: f, box: box, sel: sel ? el('label', null, R.cc, sel) : null,
    keep: function () { var k = [], i; for (i = 0; i < x.t.length; i++) if (!x.t[i].p && (!cs.length || cs[i].checked)) k.push(i); return k; },
    cov: function () { return sel ? sel.value : LANG; },
    name: function (u) { return (f.i.value.trim().replace(/\.html?$/i, '').replace(/[\\\/:*?"<>|\u0000-\u001f]/g, '') || u.c.f) + '.html'; }
  };
}
/* a whole file around a blob: the script, the styles and the policy of this one, unchanged */
function page(same, cov, u, blob, ui) {
  return assemble({
    lang: same ? D.documentElement.lang : cov, dir: same ? D.documentElement.dir || 'ltr' : u.dir === 'rtl' ? 'rtl' : 'ltr', title: same ? U.t : u.c.t,
    csp: D.querySelector('meta[http-equiv]').content, css: D.querySelector('style').textContent,
    ui: ui || (same ? D.getElementById('u').textContent : JSON.stringify(u.c).replace(/</g, '\\u003c')), blob: blob, js: SELF
  });
}
/* make the copy (to: a new key, or a code) and offer it; h: the text over the buttons */
async function make(to, c, msg, go, h) {
  var s = S, x = s.x, keep = c.keep(), cov = c.cov(), u = x.u[cov] || { c: U }, m, parts, html, at;
  if (!keep.length) { msg.textContent = R.e3; return; }
  msg.textContent = ''; go.disabled = true; mk = true;
  try {
    m = { v: 2, u: x.u, t: keep.map(function (i) { return Object.assign({}, x.t[i], { k: x.t[i].k.map(function (k) { return k.slice(); }) }); }) };
    parts = await build(to, m, function (i, j) { return piece(s.k, raw, x, keep[i], j); });
    html = page(cov === LANG, cov, u, '\u0001');
    at = html.indexOf('\u0001');
    parts = [html.slice(0, at)].concat(b64parts(parts), [html.slice(at + 1)]);
  } catch (e) { go.disabled = false; return; } finally { mk = false; }
  if (S !== s || s.v.t !== 'copy') return;
  ready(new Blob(parts, { type: 'text/html' }), c.name(u), h);
}
function copy() {
  var x = S.x, msg = el('p', 'er'), go = el('button', 'pb', R.mk), k = keybox(R), c = choose(x, '');
  k.msg = msg; go.type = 'button';
  go.onclick = function () {
    if (!k.ok()) { msg.textContent = R.e2; return; }
    make(k.key, c, msg, go, R.h2);
  };
  set({ t: 'copy' }); ttl.textContent = R.cp;
  // the last sentence of h1 (the passphrase rule) goes on its own line, in bold
  var h = /^([\s\S]*?[.!?\u3002\u0964\u06d4\u0f0d\u104b])\s*([^.!?\u3002\u0964\u06d4\u0f0d\u104b]+[.!?\u3002\u0964\u06d4\u0f0d\u104b]?)$/.exec(R.h1.trim());
  put(el('div', 'fm', h ? el('p', null, h[1]) : null, el('p', 'wn', h ? h[2] : R.h1), el('p', 'wn', R.h3), k.box, k.field, c.f, c.box, c.sel, msg, go));
}
/* at a distance: paste the message with the other person's code (copied before opening this: leaving the app closes it).
   Anything that is not exactly one valid code is refused, never taken as a key. Someone with no copy yet gets an invitation first */
function far() {
  var x = S.x, ta = plain(el('textarea')), er = el('p', 'er'), msg = el('p', 'er'), go = el('button', 'pb', R.mk), opt = el('div'), iv = el('button', 'sb', R.iv), pb = null, n = 0;
  ta.placeholder = R.pg; ta.rows = 4; ta.dir = 'ltr';
  iv.type = 'button'; go.type = 'button'; iv.onclick = invite;
  async function read() {
    var k = ++n, v = ta.value, r = null, c;
    try { if (v.trim()) r = await unpack(v); } catch (e) { r = null; }
    if (k !== n || !S || S.v.t !== 'copy') return;          // a newer paste is being read, or the reader closed
    er.textContent = r || !v.trim() ? '' : R.e4;
    wipe(opt); opt.hidden = !r;
    if (!r) return;
    c = choose(x, r.l);
    go.disabled = false;
    go.onclick = function () { make({ salt: r.salt, pk: r.pk }, c, msg, go, R.h4); };
    opt.appendChild(el('div', null, c.f, c.box, c.sel, msg, go));
  }
  if (navigator.clipboard && navigator.clipboard.readText) {
    pb = el('button', 'sb', R.pe); pb.type = 'button';
    // the browser may ask before it lets the page read the clipboard: that is not leaving the app (only while it asks)
    pb.onclick = function () {
      hold = true;
      navigator.clipboard.readText().then(function (t) { ta.value = t; read(); }, function () { ta.focus(); }).then(function () { hold = false; });
    };
  }
  ta.oninput = later(read, 300);
  opt.hidden = true;
  set({ t: 'copy' }); ttl.textContent = R.pd;
  put(el('div', 'fm', el('p', null, R.h5), iv, ta, pb, er, opt));
}
/* the invitation: this same program with no texts inside, only what the other person needs to make a code. It speaks the
   language of the phone that opens it, so it carries its few texts in every language this file has */
var IVR = ['k1', 'k2', 'e2', 'mc', 'em', 'ok', 'bk', 'sd', 'cy', 'h7'];   // the texts of the reader it needs (lib/paquete.js: DEL_LECTOR)
function invite() {
  var x = S.x, u = {}, k, r, i;
  for (k in x.u) {
    r = x.u[k].r;
    if (x.u[k].i && r) { u[k] = Object.assign({ dir: x.u[k].dir }, x.u[k].i); for (i = 0; i < IVR.length; i++) u[k][IVR[i]] = r[IVR[i]]; }
  }
  ready(new Blob([page(true, LANG, null, '', JSON.stringify(u).replace(/</g, '\\u003c'))], { type: 'text/html' }), R.vn + '.html', R.h4);
}
/* receive a copy at a distance: a code made from the key this file opens with, so the copy will open with that same key.
   The key is typed again (it is never kept) and tried on this file first */
function mine() {
  var b = field(R.k2, 'password'), msg = el('p', 'er'), go = el('button', 'pb', R.mc);
  go.type = 'button';
  go.onclick = async function () {
    var s = S, v = b.i.value, c = null;
    msg.textContent = ''; go.disabled = true; mk = true;
    try { if (Array.from(fold(v.trim())).length >= 16) { await open(v.trim(), raw); c = await code(v.trim(), tongue()); } } catch (e) { c = null; } finally { mk = false; }
    v = ''; b.i.value = '';
    if (S !== s || s.v.t !== 'copy') return;
    go.disabled = false;
    if (!c) { msg.textContent = R.e2; return; }
    put(el('div', 'fm', shown(c, R, brief), el('p', 'wn', R.h7)));
  };
  set({ t: 'copy' }); ttl.textContent = R.rc;
  put(el('div', 'fm', el('p', null, R.h6), b, msg, go));
}
/* the code on screen (selectable: it is not a secret), with Send (the share sheet) and Copy. cls: 'bl' for a block */
function shown(c, T, before, cls) {
  var w = el('div'), p = el('p', 'cd' + (cls ? ' ' + cls : ''), c), b, y;
  p.dir = 'ltr';
  w.appendChild(p);
  if (navigator.share) {
    b = el('button', 'pb', T.sd); b.type = 'button';
    b.onclick = function () { if (before) before(); try { navigator.share({ text: c }).catch(function () { }); } catch (e) { } };
    w.appendChild(b);
  }
  y = el('button', navigator.share ? 'sb' : 'pb', T.cy); y.type = 'button';
  y.onclick = function () { clip(c, function () { y.textContent = T.cy + ' \u2713'; }); };
  w.appendChild(y);
  return w;
}
function clip(t, done) {
  function old() {
    var a = el('textarea');
    a.value = t; a.readOnly = true; a.style.position = 'fixed'; a.style.opacity = '0';
    D.body.appendChild(a); a.select();
    try { if (D.execCommand('copy')) done(); } catch (e) { }
    D.body.removeChild(a);
  }
  try { navigator.clipboard.writeText(t).then(done, old); } catch (e) { old(); }
}
function ready(blob, name, h) {
  var file = null, can = false, box = el('div', 'fm', el('p', null, h || R.h2)), b;
  try { file = new File([blob], name, { type: 'text/html' }); can = !!(navigator.canShare && navigator.canShare({ files: [file] })); } catch (e) { }
  if (can) {
    b = el('button', 'pb', R.sd); b.type = 'button';
    b.onclick = function () { brief(); try { navigator.share({ files: [file] }).catch(function () { }); } catch (e) { } };
    box.appendChild(b);
  }
  b = el('button', can ? 'sb' : 'pb', R.sv); b.type = 'button';
  b.onclick = function () {
    brief();
    var u = URL.createObjectURL(blob), l = el('a');
    l.href = u; l.download = name; rd.appendChild(l); l.click(); rd.removeChild(l);
    setTimeout(function () { URL.revokeObjectURL(u); }, 60000);
  };
  box.appendChild(b);
  b = el('button', 'sb', R.ok); b.type = 'button';
  b.onclick = function () { if (S) rBack(); };
  box.appendChild(b);
  put(box);
}
// the share sheet or the save prompt takes the focus away: no lock for that, only until the person is back
function brief() {
  var t = setTimeout(back, 60000);
  function back() { clearTimeout(t); W.removeEventListener('focus', back); rd.removeEventListener('pointerdown', back, true); hold = false; }
  hold = true;
  W.addEventListener('focus', back); rd.addEventListener('pointerdown', back, true);
}
/* ---------- messages: one conversation at a time, only in memory, 15 minutes at most ----------
   The conversation outlives the reader (copying a block from the chat closes it) but never the page. Its keys are in memory
   and not extractable; ya is sealed with a random key of its own until the acceptance. The key of the file only opens the
   door to this screen, and nothing is written anywhere. The 15 minutes count from the start (or the acceptance) and never
   grow; the browser may freeze timers in the background, so every use checks the clock too */
var CV = null, CVT = 0, TTL = 15 * 60000, DG = { ar: 0x660, fa: 0x6f0, my: 0x1040 };
function hangup() { clearTimeout(CVT); CV = null; }
function alive() { if (CV && Date.now() >= CV.end) hangup(); return CV; }
function conv(r, sid, st, out) {
  hangup();
  CV = { r: r, sid: sid, st: st, out: out, end: Date.now() + TTL, ns: 0, seen: {} };
  CVT = setTimeout(function () { hangup(); if (S && S.v.t === 'msg') chat(); }, TTL);
  return CV;
}
// numbers in the digits the texts of the reader use (where they have their own)
function dig(n) { var z = DG[rd.lang]; n = String(n); return z ? n.replace(/[0-9]/g, function (c) { return String.fromCharCode(z + +c); }) : n; }
function left(c) { return R.tm.replace('%', dig(Math.max(1, Math.ceil((c.end - Date.now()) / 60000)))); }
/* what a pasted message holds for the conversation: a start (none open), the acceptance (A waiting) or messages */
async function hear(v) {
  var c = alive(), p = grab(v), got = [], i, b, r, ya;
  if (!c) {
    for (i = 0; i < p.s.length; i++) { b = u64(p.s[i]); if (await cok(b)) got.push(b); }
    return got.length === 1 ? { s: got[0] } : null;
  }
  if (c.st === 'w') {
    for (i = 0; i < p.a.length && CV === c; i++) {
      ya = await unseal(c.w, c.ya, 'y');
      try { r = await cfinish(ya, c.sid, c.Ya, u64(p.a[i])); } finally { ya.fill(0); }
      if (r && CV === c) { c.ks = r.a; c.kr = r.b; c.st = 'o'; c.ya = c.w = c.out = null; return { a: 1 }; }
    }
    return null;
  }
  for (i = 0; i < p.m.length && CV === c; i++) {
    r = await copen(c.kr, c.sid, u64(p.m[i]));
    if (r) { r.old = !!c.seen[r.n]; c.seen[r.n] = 1; got.push(r); }
  }
  if (!got.length || CV !== c) return null;
  if (c.st === 'k') { c.st = 'o'; c.out = null; }     // A's first message: from now on B may write
  got.sort(function (x, y) { return x.n - y.n; });
  return { m: got };
}
function said(m) { var p = el('p', null, m.t); p.dir = 'auto'; return el('div', 'mg', el('b', null, '#' + dig(m.n + 1), m.old ? el('i', null, ' ' + R.rd) : null), p); }
/* the screen. got: the messages that have just opened; draft: what was being written */
function chat(got, draft) {
  var c = alive(), w = el('div', 'fm'), ta = plain(el('textarea')), er = el('p', 'er'), pb = null, n = 0, st = null, pin, go, cm, cnt, sl, end;
  set({ t: 'msg' }); ttl.textContent = R.ms;
  ta.placeholder = R.pb; ta.rows = 3; ta.dir = 'ltr';
  async function look() {
    var k = ++n, v = ta.value, r = null;
    try { if (v.trim()) r = await hear(v); } catch (e) { r = null; }
    if (k !== n || !S || S.v.t !== 'msg') return;              // a newer paste is being read, or the reader closed
    if (r && (r.a || r.m)) return chat(r.m, cm ? cm.value : '');
    st = r && r.s ? r.s : null;
    er.textContent = r || !v.trim() ? '' : R.e5;
    if (go) go.textContent = st ? R.ac : R.em;
  }
  ta.oninput = later(look, 300);
  if (navigator.clipboard && navigator.clipboard.readText) {
    pb = el('button', 'sb', R.pe); pb.type = 'button';
    // the browser may ask before it lets the page read the clipboard: that is not leaving the app (only while it asks)
    pb.onclick = function () {
      hold = true;
      navigator.clipboard.readText().then(function (t) { ta.value = t; look(); }, function () { ta.focus(); }).then(function () { hold = false; });
    };
  }
  if (!c) {
    // no conversation: the agreed number, then Start, or Accept if what was pasted is a start
    pin = field(R.pn, 'password'); pin.i.setAttribute('inputmode', 'numeric');
    go = el('button', 'pb', R.em); go.type = 'button';
    go.onclick = async function () {
      var v = pin.i.value.trim(), s, r = null, a;
      if (Array.from(fold(v)).length < 6) { er.textContent = R.e6; return; }
      // something pasted that is not (yet) read as a start: read it now; if it is not one, say so and start nothing
      if (ta.value.trim() && !st) { await look(); if (!st) return; }
      s = st;
      go.disabled = true; er.textContent = '';
      try {
        if (s) {
          r = await caccept(v, s);
          if (r) { c = conv('b', r.sid, 'k', b64u(r.b)); c.ks = r.keys.b; c.kr = r.keys.a; }
        } else {
          r = await cstart(v);
          a = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
          c = conv('a', r.sid, 'w', b64u(r.b)); c.Ya = r.Ya; c.w = a; c.ya = await seal(a, r.ya, 'y'); r.ya.fill(0);
        }
      } catch (e) { r = null; }
      v = ''; pin.i.value = '';
      if (!S || S.v.t !== 'msg') return;
      if (!r) { go.disabled = false; er.textContent = R.e5; return; }
      chat();
    };
    w.appendChild(el('div', null, el('p', null, R.h8), pin, ta, pb, er, go));
  } else {
    w.appendChild(el('p', 'hi', left(c)));
    // still waiting for the other side: the block to send (again, if needed)
    if (c.st !== 'o') w.appendChild(el('div', null, shown(c.out, R, brief, 'bl'), el('p', 'wn', R.h9)));
    w.appendChild(el('div', null, ta, pb, er));
    (got || []).forEach(function (m) { w.appendChild(said(m)); });
    if (c.st === 'o') {
      cm = plain(el('textarea')); cm.placeholder = R.wr; cm.maxLength = MSG / 2; cm.rows = 3; cm.dir = 'auto'; cm.value = draft || '';
      cnt = el('span', 'cn', dig(MSG / 2 - cm.value.length));
      cm.oninput = function () { cnt.textContent = dig(MSG / 2 - cm.value.length); };
      sl = el('button', 'pb', R.sl); sl.type = 'button';
      sl.onclick = async function () {
        var k = alive(), b = null, ok;
        if (k !== c || k.st !== 'o' || k.ns > 255) return chat();
        sl.disabled = true;
        try { b = await cseal(k.ks, k.sid, k.ns, cm.value); } catch (e) { b = null; }
        if (!S || S.v.t !== 'msg') return;
        if (!b || CV !== k) return chat();
        k.ns++;
        ok = el('button', 'sb', R.ok); ok.type = 'button'; ok.onclick = function () { chat(); };
        put(el('div', 'fm', shown(b64u(b), R, brief, 'bl'), el('p', 'wn', R.h9), ok));
      };
      w.appendChild(el('div', null, cm, cnt, sl));
    }
    end = el('button', 'sb', R.te); end.type = 'button';
    end.onclick = function () { hangup(); chat(); };
    w.appendChild(end);
  }
  put(w);
}

function about() {
  set({ t: 'about' }); ttl.textContent = R.ab;
  put(el('div', 'ab', el('h3', null, S.m.n), S.m.a ? el('p', null, S.m.a) : null, el('p', 'nt', R.hp + '\n' + R.nc)));
}

/* ---------- lifecycle ---------- */
D.addEventListener('visibilitychange', function () { if (!D.hidden) return; if (busy) away = true; if (S && !hold) lock(); });
// Android takes the recents thumbnail before visibilitychange fires; blur arrives in time (tested: Android 10 + Brave).
W.addEventListener('blur', function () { if (busy) away = true; if (S && !hold) lock(); });
W.addEventListener('pagehide', function () { if (busy) away = true; if (S) lock(true); });
D.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (busy) away = true; if (S) lock(); } idle(); });
['pointerdown', 'touchstart', 'scroll', 'input'].forEach(function (n) { rd.addEventListener(n, idle, { capture: true, passive: true }); });

/* ---------- the invitation: a file with no texts inside; the other person makes their code here ----------
   Four steps, one thing each. 1: paper and something to write with (no key exists until Start). 2: the key, in five big rows,
   to write down. 3: the key leaves the screen and is typed from the paper, so what gets checked is the paper, not the screen;
   the digits show as they are typed, in groups. Checked only at the end: a key that does not match goes back to step 2 with
   the groups that differ marked and the field empty (no trying digits until it matches). 4: the code.
   Leaving the page hides everything (the recent-apps picture must not show it). Back within ITL: the same key. Later, or
   if the browser dropped it, it is gone and the person is told to cross it out: the key never changes without saying so.
   If the code cannot be made (too little memory), the same key stays. The time is checked on coming back, not left to a timer
   (a page in the background may not run). The field is plain text: a password field may be offered to the browser's store. */
var ITL = 2 * 60000;
function group(i) {
  var v = i.value, p = i.selectionEnd == null ? v.length : i.selectionEnd, d = [], n = 0, j = 0, s = '', q = 0;
  Array.from(v).forEach(function (c) { if (/\p{Nd}/u.test(c)) { if (j < p) n++; d.push(c); } j += c.length; });
  d.slice(0, 20).forEach(function (c, k) { if (k && k % 4 === 0) s += ' '; s += c; if (k < n) q = s.length; });
  if (s !== v) { i.value = s; try { i.setSelectionRange(q, q); } catch (e) { } }
}
function invitation() {
  var lg = phone(function (c) { return !!U[c]; }) || (U[LANG] ? LANG : U.en ? 'en' : Object.keys(U)[0]), T = U[lg];
  var w = el('div', 'iv fm'), key = '', bad = [], at = '', gone = 0, tm = 0;
  D.documentElement.lang = lg; D.documentElement.dir = T.dir === 'rtl' ? 'rtl' : 'ltr';
  function bt(cls, t, fn) { var b = el('button', cls, t); b.type = 'button'; b.onclick = fn; return b; }
  function show() { wipe(w); for (var i = 0; i < arguments.length; i++) if (arguments[i]) w.appendChild(arguments[i]); }
  function start(m) {
    at = 'go'; key = ''; bad = [];
    show(m ? el('p', 'er', m) : null, el('p', null, T.a), el('p', 'wn', T.d), bt('pb', T.em, function () { key = suggest(); bad = []; see(); }));
  }
  function see(m) {
    var g = el('div', 'kg');
    at = 'see'; g.dir = 'ltr';
    key.split(' ').forEach(function (p, i) { g.appendChild(el('span', bad.indexOf(i) < 0 ? null : 'no', p)); });
    show(m ? el('p', 'er', m) : null, el('p', 'kl', T.k1), g, el('p', 'wn', T.b), bt('pb', T.ok, function () { type(); }));
  }
  function type(m) {
    var f = field(T.k2, 'text'), i = f.i, go = bt('pb', T.mc, make);
    at = 'type';
    i.className = 'kt'; i.dir = 'ltr'; i.autocomplete = 'off'; i.spellcheck = false;
    i.setAttribute('inputmode', 'numeric'); i.setAttribute('autocorrect', 'off'); i.setAttribute('autocapitalize', 'off'); i.setAttribute('enterkeyhint', 'done');
    i.oninput = function () { group(i); };
    i.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); make(); } };
    show(f, el('p', 'er', m || ''), go, bt('sb', T.bk, function () { bad = []; see(); }));
    i.focus();
    async function make() {
      var v = fold(i.value), k = fold(key), c = null, b;
      if (at !== 'type') return;
      if (!v) { i.focus(); return; }
      i.value = '';
      if (v !== k) { bad = [0, 1, 2, 3, 4].filter(function (g) { return v.slice(4 * g, 4 * g + 4) !== k.slice(4 * g, 4 * g + 4); }); see(T.e2); return; }
      at = 'busy'; b = el('button', 'pb', T.mc + '\u2026'); b.disabled = true; show(b);
      try { c = await code(key, tongue()); } catch (e) { c = null; }
      v = k = '';
      if (!c) { type(T.f); return; }
      key = ''; at = 'done';
      show(shown(c, T), el('p', 'wn', T.h7), el('p', null, T.c));
    }
  }
  function away() {
    if (at !== 'see' && at !== 'type') return;
    if (!gone) { gone = Date.now(); clearTimeout(tm); tm = setTimeout(function () { key = ''; }, ITL); }
    wipe(w);
  }
  function back() {
    if (!gone || D.hidden) return;
    var late = !key || Date.now() - gone > ITL;
    clearTimeout(tm); gone = 0;
    if (late) start(T.e); else if (at === 'see') see(); else type();
  }
  W.addEventListener('blur', away); W.addEventListener('pagehide', away); W.addEventListener('focus', back); W.addEventListener('pageshow', back);
  D.addEventListener('visibilitychange', function () { if (D.hidden) away(); else back(); });
  start();
  D.body.appendChild(el('div', 'app', w));
}

rd.hidden = true;
if (!D.getElementById('d').firstChild) invitation();
else {
  cv.appendChild(lv); cv.appendChild(fab); cv.appendChild(ev);
  root.appendChild(cv); root.appendChild(rd);
  D.body.appendChild(root);
  draw();
}
})();
