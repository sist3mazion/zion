'use strict';
/**
 * Lee una traducción en USFM o USFX (los dos formatos que ofrece eBible.org) y devuelve
 * un modelo mínimo pensado para leer en el móvil:
 *
 *   [{ id:'GEN', nombre:'Génesis', caps:[ [1, bloque, bloque…], [2, …] ] }, …]
 *
 *   bloque de título:   ['s'|'S'|'d'|'r'|'a', 'texto']
 *   bloque de texto:    ['p'|'m'|'pi'|'q1'|'q2'|'q3'|'l1'|'l2'|'c'|'e', etiqueta, texto, etiqueta, texto…]
 *                       (etiqueta = número de versículo, o '' si el fragmento continúa el anterior)
 *   línea en blanco:    ['b']
 *
 * Se descartan notas al pie, referencias cruzadas, introducciones y atributos de palabra
 * (Strong, lemas): solo queda el texto que se lee.
 */

const AT = 'GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL'.split(' ');
const DC = 'TOB JDT ESG WIS SIR BAR LJE S3Y SUS BEL 1MA 2MA 3MA 4MA 1ES 2ES MAN PS2 ODA PSS EZA 5EZ 6EZ DAG LAO'.split(' ');
const NT = 'MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV'.split(' ');
const ORDEN = AT.concat(DC, NT);

// marcador de párrafo -> clase de bloque
const PARRAFO = {
  p: 'p', po: 'p', m: 'm', nb: 'm', lh: 'm', lf: 'm', mi: 'pi', pi: 'pi', pm: 'pi', pmo: 'pi', pmc: 'pi', pmr: 'e', ph: 'pi',
  pc: 'c', qc: 'c', pr: 'e', qr: 'e', cls: 'e', q: 'q1', qm: 'q1', li: 'l1', lim: 'l1', tr: 'p'
};
// marcador de título -> clase de bloque (el texto llega hasta el siguiente marcador de párrafo)
const TITULO = { s: 's', ms: 'S', mr: 'r', sr: 'r', r: 'r', d: 'd', sp: 'd', qd: 'd', qa: 'a', sd: null };
// nombres del libro
const NOMBRE = { h: 'h', toc1: 'toc1', toc2: 'toc2', toc3: 'toc3', mt: 'mt', mt1: 'mt' };
// párrafos cuyo contenido no es texto bíblico: se ignoran
const IGNORAR = /^(i[a-z]+\d*|id|ide|usfm|sts|rem|restore|toca\d|cl|cd|cp|mte\d?|mt[2-9]|periph|lit|pb|iex|ie)$/;
// notas y similares: se salta todo hasta su cierre
const NOTA = { f: 1, fe: 1, ef: 1, x: 1, ex: 1, fig: 1, rq: 1, va: 1, vp: 1, ca: 1, cat: 1, esb: 1 };

function crear() {
  const libros = [];
  let L = null, C = null, B = null, T = null, buf = '', pend = null, modo = 'x', campo = '';

  function vaciar() {
    const t = buf.replace(/[ \t\n\r]+/g, ' ').replace(/^ | $/g, '');   // el espacio duro (~) se respeta
    buf = '';
    if (modo === 'n') { if (t && L && !L[campo]) L[campo] = t; return; }
    if (modo === 'h') { if (T && t && C) { T[1] = t; C.push(T); } T = null; modo = 't'; return; }
    if (modo !== 't' || !C || !t) return;
    if (!B) abrirBloque('p');
    B.push(pend === null ? '' : pend, t);
    pend = null;
  }
  function abrirBloque(clase) {
    if (B && B.length === 1 && C[C.length - 1] === B) C.pop();
    B = [clase];
    C.push(B);
  }
  function cerrarVersiculo() {
    // versículo sin texto (omitido en la traducción): se conserva el número
    if (pend !== null && C) { if (!B) abrirBloque('p'); B.push(pend, ''); pend = null; }
  }
  function limpiar() {
    if (B && C && B.length === 1 && C[C.length - 1] === B) C.pop();
  }

  return {
    libro(id) {
      vaciar(); cerrarVersiculo(); limpiar();
      L = { id: String(id).trim().toUpperCase().slice(0, 3), caps: [] };
      libros.push(L); C = null; B = null; pend = null; modo = 'x';
    },
    capitulo(n) {
      vaciar(); cerrarVersiculo(); limpiar();
      if (!L) return;
      C = [parseInt(n, 10) || L.caps.length + 1];
      L.caps.push(C); B = null; modo = 't';
    },
    versiculo(etiqueta) {
      vaciar(); cerrarVersiculo();
      if (!C) return;
      modo = 't';
      etiqueta = String(etiqueta).trim();
      pend = /^\d+$/.test(etiqueta) ? Number(etiqueta) : etiqueta;
    },
    /** Marcador de nivel de párrafo (nombre USFM sin barra, p. ej. "q2", "s1", "toc2", "ip"). */
    marca(nombre) {
      const base = nombre.replace(/\d+$/, ''), nivel = parseInt(nombre.slice(base.length), 10) || 1;
      const conocido = NOMBRE[nombre] || IGNORAR.test(nombre) || base === 'b' || base in TITULO || PARRAFO[base];
      if (!conocido) return;                      // marcador desconocido: el texto sigue donde estaba
      vaciar();
      if (NOMBRE[nombre]) { campo = NOMBRE[nombre]; modo = 'n'; return; }
      if (IGNORAR.test(nombre)) { limpiar(); B = null; modo = 'x'; return; }
      if (!C) { modo = 'x'; return; }
      if (base === 'b') { limpiar(); C.push(['b']); B = null; modo = 't'; return; }
      if (base in TITULO) {
        limpiar(); B = null;
        if (TITULO[base] === null) { modo = 't'; return; }
        T = [TITULO[base], '']; modo = 'h'; return;
      }
      let clase = PARRAFO[base];
      if (clase === 'q1' || clase === 'l1') clase = clase[0] + Math.min(nivel, clase === 'q1' ? 3 : 2);
      limpiar();
      abrirBloque(clase); modo = 't';
    },
    texto(s) { if (modo !== 'x') buf += s; },
    separar() { if (modo !== 'x') buf += ' '; },
    fin() {
      vaciar(); cerrarVersiculo(); limpiar();
      return libros;
    }
  };
}

/* ------------------------------- USFM ------------------------------- */

function leerUsfm(src, K) {
  const s = src.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const n = s.length;
  const re = /\\(\+?[A-Za-z]+\d*(?:-[se])?)(\*)?/y;
  let i = 0, spans = 0;

  function texto(t) {
    if (spans > 0) { const k = t.indexOf('|'); if (k >= 0) t = t.slice(0, k); }   // atributos de \w …|…\w*
    if (t) K.texto(t.replace(/~/g, '\u00A0').replace(/\/\//g, ' '));
  }
  function palabra() {                       // siguiente token separado por espacios
    while (i < n && /\s/.test(s[i])) i++;
    let j = i;
    while (j < n && !/\s/.test(s[j]) && s[j] !== '\\') j++;
    const w = s.slice(i, j);
    i = j;
    return w;
  }

  while (i < n) {
    let j = s.indexOf('\\', i);
    if (j < 0) j = n;
    if (j > i) texto(s.slice(i, j));
    if (j >= n) break;
    re.lastIndex = j;
    const m = re.exec(s);
    if (!m) { i = j + (s[j + 1] === '*' ? 2 : 1); continue; }           // "\*" suelto o barra perdida
    i = j + m[0].length;
    const anidado = m[1][0] === '+';
    const nombre = (anidado ? m[1].slice(1) : m[1]).toLowerCase();
    if (m[2]) { if (spans > 0) spans--; continue; }                      // cierre de marcador de carácter
    if (/-[se]$/.test(nombre)) {                                         // hito: \qt-s |…\*
      const k = s.indexOf('\\*', i);
      i = k < 0 ? n : k + 2;
      continue;
    }
    if (NOTA[nombre]) {                                                  // nota: saltar hasta \f*
      const cierre = '\\' + (anidado ? '+' : '') + m[1].replace(/^\+/, '') + '*';
      const k = s.indexOf(cierre, i);
      if (k < 0) { const fl = s.indexOf('\n', i); i = fl < 0 ? n : fl; } else i = k + cierre.length;
      continue;
    }
    if (s[i] === ' ' || s[i] === '\n') i++;                              // delimitador del marcador
    if (nombre === 'id') { K.libro(palabra()); K.marca('id'); spans = 0; continue; }
    if (nombre === 'c') { K.capitulo(palabra()); spans = 0; continue; }
    if (nombre === 'v') { K.versiculo(palabra()); if (s[i] === ' ') i++; spans = 0; continue; }
    if (/^t[hc]r?\d*$/.test(nombre)) { K.separar(); continue; }          // celdas de tabla
    // ¿marcador de carácter? (tiene cierre \nombre* más adelante en la misma línea o párrafo)
    if (anidado || esCaracter(nombre)) { spans++; continue; }
    spans = 0;
    K.marca(nombre);
  }
}

const CARACTER = new Set(('add addpn bk dc k nd ord pn png qt sig sls tl wj em bd it bdit no sc sup w wg wh wa rb pro ndx ' +
  'qs qac jmp xt fv fr fq fqa fk fl fw fp ft fdc fm xo xk xq xta xop xot xnt xdc lik liv litl').split(' '));
function esCaracter(nombre) { return CARACTER.has(nombre.replace(/\d+$/, '')); }

/* ------------------------------- USFX ------------------------------- */

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00A0' };
function entidades(t) {
  return t.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return e.toLowerCase() in ENT ? ENT[e.toLowerCase()] : m;
  });
}
const X_SALTAR = { f: 1, fe: 1, ef: 1, x: 1, ex: 1, fig: 1, id: 1, rem: 1, ide: 1, cl: 1, cp: 1, ca: 1, va: 1, vp: 1, languagecode: 1, generated: 1 };
const X_PARRAFO = { p: 1, q: 1, s: 1, d: 1, b: 1, h: 1, toc: 1, mt: 1, ms: 1, mr: 1, r: 1, sr: 1, sp: 1, qa: 1, qd: 1, qc: 1, qr: 1, li: 1, tr: 1 };

function leerUsfx(src, K) {
  const re = /<(\/?)([A-Za-z][\w.-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>|<[!?](?:[^>]*)>|([^<]+)/g;
  let m, saltar = 0;
  const attr = (a, k) => { const r = new RegExp('\\b' + k + '\\s*=\\s*"([^"]*)"').exec(a); return r ? r[1] : ''; };
  while ((m = re.exec(src))) {
    if (m[5] !== undefined) { if (!saltar) K.texto(entidades(m[5])); continue; }
    if (!m[2]) continue;
    const nombre = m[2].toLowerCase(), cierra = m[1] === '/', vacio = m[4] === '/', a = m[3] || '';
    if (X_SALTAR[nombre]) { if (!vacio) saltar += cierra ? -1 : 1; if (saltar < 0) saltar = 0; continue; }
    if (saltar) continue;
    if (cierra) { if (/^t[hc]r?$/.test(nombre)) K.separar(); continue; }
    if (nombre === 'book') { K.libro(attr(a, 'id')); continue; }
    if (nombre === 'c') { K.capitulo(attr(a, 'id')); continue; }
    if (nombre === 'v') { K.versiculo(attr(a, 'id')); continue; }
    if (X_PARRAFO[nombre]) {
      const sfm = attr(a, 'sfm') || nombre, nivel = attr(a, 'level');
      K.marca(sfm + (nivel && !/\d$/.test(sfm) ? nivel : ''));
    }
    // el resto (w, wj, add, nd, k, qs, ref, ve…) solo aporta su texto
  }
}

/* ------------------------------- común ------------------------------- */

function ordenar(libros) {
  const vistos = new Map();
  for (const l of libros) {
    if (!l.caps.length || !/^[A-Z0-9]{3}$/.test(l.id)) continue;
    if (/^(FRT|BAK|OTH|INT|CNC|GLO|TDX|NDX|XX[A-G])$/.test(l.id)) continue;
    if (!vistos.has(l.id)) vistos.set(l.id, l);
  }
  const pos = id => { const k = ORDEN.indexOf(id); return k < 0 ? ORDEN.length : k; };
  return [...vistos.values()]
    .map((l, k) => ({ l, k }))
    .sort((a, b) => pos(a.l.id) - pos(b.l.id) || a.k - b.k)
    .map(({ l }) => ({ id: l.id, nombre: l.toc2 || l.h || l.toc1 || l.mt || l.id, caps: l.caps }));
}

/** @param {{nombre:string, texto:string}[]} archivos */
function leerArchivos(archivos) {
  const K = crear();
  const lista = archivos.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'en', { numeric: true }));
  let n = 0;
  for (const f of lista) {
    if (/\.(usfx|xml)$/i.test(f.nombre) || /^\s*(<\?xml|<usfx)/i.test(f.texto.slice(0, 200))) {
      if (!/<usfx[\s>]/i.test(f.texto.slice(0, 2000))) continue;
      leerUsfx(f.texto, K); n++;
    } else if (/\.(usfm|sfm)$/i.test(f.nombre) || /^\uFEFF?\s*\\id /.test(f.texto.slice(0, 50))) {
      if (!/\\id\s/.test(f.texto.slice(0, 400))) {      // archivo sin \id: el código se saca del nombre
        const cod = ORDEN.find(c => f.nombre.toUpperCase().includes(c));
        if (!cod) continue;
        K.libro(cod);
      }
      leerUsfm(f.texto, K); n++;
    }
  }
  if (!n) throw new Error('No he encontrado archivos USFM (.usfm/.sfm) ni USFX (.xml)');
  return ordenar(K.fin());
}

function filtrar(libros, solo) {
  if (!solo) return libros;
  const s = String(solo).toUpperCase();
  const ids = s === 'NT' ? NT : s === 'AT' ? AT.concat(DC) : s.split(/[\s,]+/).filter(Boolean);
  return libros.filter(l => ids.includes(l.id));
}

/** Índice del primer libro del Nuevo Testamento (para dibujar un separador), o 0 si no aplica. */
function inicioNT(libros) {
  const k = libros.findIndex(l => NT.includes(l.id));
  return k > 0 ? k : 0;
}

/** Dirección de lectura deducida del propio texto. */
function direccion(libros) {
  let rtl = 0, ltr = 0;
  const muestra = JSON.stringify(libros[0].caps.slice(0, 3)).slice(0, 20000);
  for (const ch of muestra) {
    const c = ch.codePointAt(0);
    if ((c >= 0x590 && c <= 0x8ff) || (c >= 0xfb1d && c <= 0xfdff) || (c >= 0xfe70 && c <= 0xfeff) || (c >= 0x10800 && c <= 0x10fff) || (c >= 0x1e800 && c <= 0x1efff)) rtl++;
    else if (/\p{L}/u.test(ch)) ltr++;
  }
  return rtl > ltr ? 'rtl' : 'ltr';
}

/**
 * Quita los títulos (\\s) que casan con `re`. Algunas fuentes traen un título de relleno en cada capítulo
 * (p. ej. «Глава Х» en la Russian Open Bible) que no es texto de la Biblia.
 */
function sinTitulos(libros, re) {
  for (const l of libros) for (const c of l.caps) {
    for (let i = c.length - 1; i >= 1; i--) if (c[i][0] === 's' && re.test(String(c[i][1]).trim())) c.splice(i, 1);
  }
  return libros;
}

/** Aplica [expresión, reemplazo] a todo el texto (versículos y títulos). Sirve para quitar restos de conversión de la fuente. */
function sustituir(libros, reglas) {
  const f = t => reglas.reduce((x, [re, r]) => x.replace(re, r), t);
  for (const l of libros) for (const c of l.caps) for (const b of c.slice(1)) {
    if (b.length === 2 && b[0] !== 'b') b[1] = f(String(b[1]));
    else if (b.length > 2) for (let i = 2; i < b.length; i += 2) b[i] = f(String(b[i]));
  }
  return libros;
}

/**
 * Quita del final de cada libro la frase que case con `re` (p. ej. el «fin del libro» que algunas ediciones
 * añaden tras el último versículo y que no es texto bíblico). `re` debe ir anclada al final y no cruzar frases.
 * Si el fragmento se queda sin texto y no lleva número de versículo, desaparece.
 */
function sinFinal(libros, re) {
  let n = 0;
  for (const l of libros) {
    const c = l.caps[l.caps.length - 1];
    for (let k = c.length - 1; k >= 1; k--) {
      const b = c[k];
      if (b.length < 3) continue;
      const t = String(b[b.length - 1]);
      if (!re.test(t)) break;
      const r = t.replace(re, '');
      n++;
      if (r.trim() === '' && b[b.length - 2] === '') { b.length -= 2; if (b.length === 1) c.splice(k, 1); } else b[b.length - 1] = r.replace(/[\s\u200b]+$/, '');
      break;
    }
  }
  return n;
}

/** Cada versículo en su propio párrafo (las fuentes que no traen poesía ni párrafos lo dejan todo en un bloque por capítulo). */
function unVersiculoPorParrafo(libros) {
  for (const l of libros) for (const c of l.caps) {
    const sal = [c[0]];
    for (const b of c.slice(1)) {
      if (b.length <= 2) { sal.push(b); continue; }
      let cur = null;
      for (let i = 1; i < b.length; i += 2) {
        if (!cur || b[i] !== '') { cur = [b[0]]; sal.push(cur); }
        cur.push(b[i], b[i + 1]);
      }
    }
    c.length = 0; c.push(...sal);
  }
  return libros;
}

/** Sustituye libros o capítulos de `base` por los de `otros` (misma numeración de ids). Conserva el nombre del libro de `base`. */
function parchear(base, otros, libros, capitulos, reglas) {
  const quitar = reglas && reglas.length ? (ls => sustituir(ls, reglas)) : (ls => ls);
  quitar(otros);
  for (const id of libros || []) {
    const a = base.find(x => x.id === id), b = otros.find(x => x.id === id);
    if (!a || !b) throw new Error('parche: falta el libro ' + id);
    a.caps = b.caps;
  }
  for (const [id, caps] of Object.entries(capitulos || {})) {
    const a = base.find(x => x.id === id), b = otros.find(x => x.id === id);
    if (!a || !b) throw new Error('parche: falta el libro ' + id);
    for (const n of caps) {
      const nuevo = b.caps.find(x => x[0] === n);
      if (!nuevo) throw new Error('parche: falta ' + id + ' ' + n);
      const k = a.caps.findIndex(x => x[0] === n);
      if (k < 0) a.caps.push(nuevo); else a.caps[k] = nuevo;
    }
  }
  return base;
}

module.exports = { sustituir, sinFinal, unVersiculoPorParrafo, parchear, sinTitulos, leerArchivos, leerUsfm, leerUsfx, crear, ordenar, filtrar, inicioNT, direccion, AT, DC, NT };
