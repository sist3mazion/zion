(function () {
'use strict';
var D = document, W = window, SELF = D.currentScript ? D.currentScript.textContent : '';

/* <core> */
var ITER = 600000, te = new TextEncoder(), td = new TextDecoder();

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

/* PBKDF2-SHA256 -> AES-256-GCM. Layout: salt(16) | iv(12) | ciphertext+tag */
async function kdf(pass, salt) {
  var base = await crypto.subtle.importKey('raw', te.encode(pass.normalize('NFC')), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: ITER, hash: 'SHA-256' }, base,
    { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function seal(key, plain) {
  var iv = rand(12);
  return cat(iv, new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, plain)));
}
async function unseal(key, box) {
  return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: box.subarray(0, 12) }, key, box.subarray(12)));
}
async function wrap(pass, plain) {
  var salt = rand(16);
  return cat(salt, await seal(await kdf(pass, salt), plain));
}
async function unwrap(pass, blob) {
  var key = await kdf(pass, blob.subarray(0, 16));
  return { key: key, data: await unseal(key, blob.subarray(16)) };
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

/* pack: u32le(len) | header json | chunks | random tail */
function parse(pack) {
  var n = new DataView(pack.buffer, pack.byteOffset, pack.byteLength).getUint32(0, true);
  return { m: JSON.parse(td.decode(pack.subarray(4, 4 + n))), o: 4 + n };
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
  share: 'M12 15V4M8 8l4-4 4 4M5 14v5h14v-5', info: 'M12 11v6M12 7.5v.01M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z'
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
var raw = null, busy = false, S = null, R = null, hold = false, idleT = 0;
async function enter(v) {
  var r;
  v = v.trim();
  if (!v || busy || S || !W.crypto || !crypto.subtle) return;
  busy = true; q.blur();
  try {
    if (!raw) raw = b64d(D.getElementById('d').textContent.trim());
    r = await unwrap(v, raw);
  } catch (e) { r = null; }
  busy = false;
  if (!r) return;
  q.value = ''; draw();
  start(r);
}

/* ---------- reader ---------- */
var HD = { s: 1, S: 1, d: 1, r: 1, a: 1 };
var ttl, pg, pn, mn;

function num(x) {
  var g = S && S.m.g;
  x = String(x);
  return g ? x.replace(/[0-9]/g, function (c) { return String.fromCharCode(g + +c); }) : x;
}
function put(node) { wipe(pg); pg.appendChild(node); pg.scrollTop = 0; }
function set(v) {
  if (v.t === 'books' || v.t === 'chap' || v.t === 'text') S.pv = v;
  S.v = v; hold = false; mn.hidden = true; pn.hidden = v.t !== 'text'; S.tok++;
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

async function start(r) {
  var p = parse(r.data), pos = null, c;
  S = { k: r.key, d: r.data, m: p.m, o: p.o, bk: {}, ord: [], ix: [], tok: 0, v: null, pv: null };
  R = p.m.u;
  wipe(rd);
  ttl = el('button', 'tt'); ttl.type = 'button';
  ttl.onclick = function () { var v = S.v; if (v.t === 'text') up(v.b); else books(); };
  pg = el('main', 'pg'); pg.onclick = function () { mn.hidden = true; };
  pn = el('div', 'pn', btn('rb fl', 'back', R.pv, function () { step(-1); }), btn('rb fl', 'next', R.nx, function () { step(1); }));
  pn.dir = S.m.d;
  mn = el('div', 'mn',
    el('div', 'fr', el('span', null, R.f), btn('ib', 'minus', R.f + ' -', function () { size(-2); }), btn('ib', 'plus', R.f + ' +', function () { size(2); })),
    item('moon', R.th, flip), item('share', R.cp, copy), item('info', R.ab, about));
  mn.hidden = true;
  rd.appendChild(el('div', 'bar', btn('ib', 'x', R.x, function () { lock(); }), ttl,
    btn('ib', 'search', R.s, find), btn('ib', 'more', R.m, function () { mn.hidden = !mn.hidden; })));
  rd.appendChild(pg); rd.appendChild(pn); rd.appendChild(mn);
  cv.hidden = true; rd.hidden = false; arm(); idle();
  var s = S;
  try { c = sg('nt.c'); if (c) pos = JSON.parse(td.decode(await unseal(s.k, b64d(c)))); } catch (e) { pos = null; }
  if (S !== s) return;
  if (pos && s.m.b[pos.b]) text(pos.b, pos.c); else books();
}

function lock(fromPop) {
  if (!S) return;
  clearTimeout(idleT);
  try { S.d.fill(0); } catch (e) { }
  S = null; R = null; hold = false;
  wipe(rd); rd.hidden = true; cv.hidden = false;
  if (!fromPop) disarm();
}
function idle() { clearTimeout(idleT); if (S) idleT = setTimeout(function () { lock(); }, 600000); }

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

async function book(i) {
  var s = S, c = s.bk[i], e;
  if (c) return c;
  e = s.m.b[i];
  c = JSON.parse(td.decode(await unz(s.d.slice(s.o + e[1], s.o + e[1] + e[2]))));
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
  w.appendChild(g);
  if (S.m.dd) {
    var q = S.m.dd, d = el('section', 'dd', el('h2', null, q[1]), el('p', null, q[2]), el('p', null, q[3]), el('p', null, q[4]));
    d.dir = q[0];
    w.appendChild(d);
  }
  put(w);
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
  try { ss('nt.c', b64e(await seal(s.k, te.encode(JSON.stringify({ b: i, c: ch[0] }))))); } catch (e) { }
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

/* hand a copy on: same content, new key, new bytes */
function field(label, type, value) {
  var i = plain(el('input')), l = el('label', null, label, i);
  i.type = type; if (value) i.value = value;
  if (type === 'password') i.autocomplete = 'new-password';
  l.i = i;
  return l;
}
function copy() {
  var a = field(R.k1, 'password'), b = field(R.k2, 'password'), f = field(R.fn, 'text', U.f), msg = el('p', 'er');
  var go = el('button', 'pb', R.mk);
  go.type = 'button';
  go.onclick = async function () {
    var s = S, p = a.i.value.trim(), body, tail, html, name;
    if (p.length < 8) { msg.textContent = R.e1; return; }
    if (a.i.value !== b.i.value) { msg.textContent = R.e2; return; }
    msg.textContent = ''; go.disabled = true;
    try {
      tail = rand(2);
      body = cat(s.d.subarray(0, s.o + s.m.z), rand(tail[0] << 8 | tail[1]));
      html = assemble({
        lang: D.documentElement.lang, dir: D.documentElement.dir || 'ltr', title: U.t,
        csp: D.querySelector('meta[http-equiv]').content, css: D.querySelector('style').textContent,
        ui: D.getElementById('u').textContent, blob: b64e(await wrap(p, body)), js: SELF
      });
    } catch (e) { go.disabled = false; return; }
    if (S !== s || s.v.t !== 'copy') return;
    name = (f.i.value.trim().replace(/\.html?$/i, '').replace(/[\\\/:*?"<>|\u0000-\u001f]/g, '') || U.f) + '.html';
    ready(new Blob([html], { type: 'text/html' }), name);
  };
  set({ t: 'copy' }); ttl.textContent = R.cp;
  put(el('div', 'fm', el('p', null, R.h1), a, b, f, msg, go));
}
function ready(blob, name) {
  var file = null, can = false, box = el('div', 'fm', el('p', null, R.h2)), b;
  try { file = new File([blob], name, { type: 'text/html' }); can = !!(navigator.canShare && navigator.canShare({ files: [file] })); } catch (e) { }
  if (can) {
    b = el('button', 'pb', R.sd); b.type = 'button';
    b.onclick = function () { try { navigator.share({ files: [file] }).catch(function () { }); } catch (e) { } };
    box.appendChild(b);
  }
  b = el('button', can ? 'sb' : 'pb', R.sv); b.type = 'button';
  b.onclick = function () {
    var u = URL.createObjectURL(blob), l = el('a');
    l.href = u; l.download = name; rd.appendChild(l); l.click(); rd.removeChild(l);
    setTimeout(function () { URL.revokeObjectURL(u); }, 60000);
  };
  box.appendChild(b);
  b = el('button', 'sb', R.ok); b.type = 'button';
  b.onclick = function () { if (S) rBack(); };
  box.appendChild(b);
  put(box);
  hold = true;
}
function about() {
  set({ t: 'about' }); ttl.textContent = R.ab;
  put(el('div', 'ab', el('h3', null, S.m.n), S.m.a ? el('p', null, S.m.a) : null, el('p', 'nt', R.hp)));
}

/* ---------- lifecycle ---------- */
D.addEventListener('visibilitychange', function () { if (D.hidden && S && !hold) lock(); });
// Android takes the recents thumbnail before visibilitychange fires; blur arrives in time (tested: Android 10 + Brave).
W.addEventListener('blur', function () { if (S && !hold) lock(); });
W.addEventListener('pagehide', function () { if (S) lock(true); });
D.addEventListener('keydown', function (e) { if (e.key === 'Escape' && S) lock(); idle(); });
['pointerdown', 'touchstart', 'scroll'].forEach(function (n) { rd.addEventListener(n, idle, { capture: true, passive: true }); });

rd.hidden = true;
cv.appendChild(lv); cv.appendChild(fab); cv.appendChild(ev);
root.appendChild(cv); root.appendChild(rd);
D.body.appendChild(root);
draw();
})();
