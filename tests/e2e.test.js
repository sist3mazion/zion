'use strict';
/**
 * Prueba de extremo a extremo en un navegador real (Chrome/Chromium sin interfaz).
 * Necesita Playwright:  npm i -D playwright   (o tenerlo instalado globalmente).
 * Si no hay navegador, estas pruebas se saltan; las demás no dependen de ellas.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { construir, comprobar } = require('../lib/paquete');
const { leerArchivos } = require('../lib/texto');
const { cargarNucleo } = require('../lib/nucleo');

function playwright() {
  for (const m of ['playwright', 'playwright-core', '/opt/npm-tools/node_modules/playwright']) {
    try { return require(m); } catch (e) { /* siguiente */ }
  }
  return null;
}
const pw = playwright();
const CHROME = process.env.CHROME || ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(p => fs.existsSync(p));
const FX = path.join(__dirname, 'fixtures');
const CLAVE = 'semilla buena tierra', CLAVE2 = 'otra clave distinta 7';
const sinBlob = h => h.replace(/(<script type="application\/octet-stream" id="d">)[^<]*/, '$1');

test('navegador', { skip: !pw && 'Playwright no está instalado' }, async t => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-'));
  const es = path.join(tmp, 'notas.html'), ar = path.join(tmp, 'ar.html');
  const fuenteEs = leerArchivos([{ nombre: 'es.usfx.xml', texto: fs.readFileSync(path.join(FX, 'es-rv1909.usfx.xml'), 'utf8') }]);
  const fuenteAr = leerArchivos([{ nombre: 'ar.usfm', texto: fs.readFileSync(path.join(FX, 'ar-vd.usfm'), 'utf8') }]);
  fs.writeFileSync(es, (await construir({ libros: fuenteEs, clave: CLAVE, idioma: 'es', nombre: 'Reina-Valera 1909', acerca: 'Dominio público.' })).html);
  fs.writeFileSync(ar, (await construir({ libros: fuenteAr, clave: CLAVE, idioma: 'ar', nombre: 'فان دايك' })).html);

  const nav = await pw.chromium.launch(Object.assign({ args: ['--no-sandbox'] }, CHROME ? { executablePath: CHROME } : {}));
  const ctx = await nav.newContext({ viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true, acceptDownloads: true, locale: 'es-ES' });
  await ctx.setOffline(true);                               // todo debe funcionar sin red
  const problemas = [];
  async function abrir(archivo) {
    const p = await ctx.newPage();
    p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') problemas.push(m.text()); });
    p.on('pageerror', e => problemas.push('excepción: ' + e.message));
    p.on('request', r => { if (!/^(file|blob):/.test(r.url())) problemas.push('petición: ' + r.url()); });
    await p.goto('file://' + archivo);
    return p;
  }
  const teclear = async (p, clave) => { await p.fill('.sf input', clave); await p.press('.sf input', 'Enter'); };
  const entrar = async (p, clave) => { await teclear(p, clave); await p.waitForSelector('.rd:not([hidden]) .pg > *'); };
  const cerrado = async p => (await p.locator('.rd').isHidden()) && (await p.locator('.rd').innerHTML()) === '' && (await p.locator('.cv').isVisible());
  t.after(async () => { await nav.close(); fs.rmSync(tmp, { recursive: true, force: true }); });

  const p = await abrir(es);

  await t.test('la portada es un bloc de notas que funciona y recuerda', async () => {
    assert.equal(await p.title(), 'Notas');
    assert.equal(await p.textContent('.em'), 'No hay notas');
    await p.click('.fab'); await p.fill('textarea', 'Lista de la compra\nPan y leche'); await p.click('.ed .bar button:first-child');
    await p.click('.fab'); await p.fill('textarea', 'Llamar al fontanero'); await p.click('.ed .bar button:first-child');
    assert.deepEqual(await p.locator('.ls li b').allTextContents(), ['Llamar al fontanero', 'Lista de la compra']);
    await p.fill('.sf input', 'COMPRA');
    assert.deepEqual(await p.locator('.ls li b').allTextContents(), ['Lista de la compra']);
    await p.fill('.sf input', '');
    await p.reload();
    assert.equal(await p.locator('.ls li').count(), 2);
    await p.click('.ls li >> nth=0'); await p.click('.ed .bar button:last-child');       // eliminar
    assert.deepEqual(await p.locator('.ls li b').allTextContents(), ['Lista de la compra']);
  });

  await t.test('una clave equivocada no hace nada visible', async () => {
    await teclear(p, 'clave que no es');
    await p.waitForTimeout(1200);
    assert.ok(await cerrado(p));
    assert.equal(await p.textContent('.em'), 'Sin resultados');
    assert.ok(!(await p.locator('body').innerText()).includes('Juan'));
  });

  await t.test('la clave correcta abre: libros, capítulos y texto', async () => {
    await entrar(p, CLAVE);
    assert.equal(await p.inputValue('.sf input'), '', 'la clave no debe quedarse escrita');
    assert.equal(await p.textContent('.tt'), 'Reina-Valera 1909');
    assert.deepEqual(await p.locator('.bk').allTextContents(), ['Génesis', 'Salmos', 'Juan', 'Judas']);
    assert.equal(await p.locator('.gd hr').count(), 1, 'separador entre testamentos');
    assert.equal(await p.textContent('.dd h2'), 'DEDICADO A:');
    assert.match(await p.textContent('.dd'), /Por Jesús, que resucitando/);
    await p.click('.bk:has-text("Salmos")');                     // un solo capítulo, y no es el 1
    await p.waitForSelector('.tx');
    assert.equal(await p.textContent('.tt'), 'Salmos 23');
    assert.match(await p.textContent('.tx'), /JEHOVÁ es mi pastor/);
    await p.click('.pn button >> nth=1'); await p.waitForFunction(() => document.querySelector('.tt').textContent === 'Juan 3');
    await p.click('.pn button >> nth=0'); await p.waitForFunction(() => document.querySelector('.tt').textContent === 'Salmos 23');
    await p.click('.tt');                                         // libro de un capítulo: vuelve a la lista
    await p.waitForSelector('.bk');
  });

  await t.test('buscar sin acentos ni mayúsculas, y saltar al versículo', async () => {
    await p.click('.bar button[aria-label="Buscar"]');
    await p.fill('.fv input', 'CRIO DIOS');
    await p.waitForSelector('.ht');
    assert.match(await p.textContent('.ht >> nth=0'), /Génesis 1:1.*crió Dios/);
    assert.equal(await p.textContent('.ht >> nth=0 >> mark'), 'crió Dios');
    await p.fill('.fv input', 'zzzzqqq'); await p.waitForSelector('.pg .em');
    assert.equal(await p.textContent('.pg .em'), 'Sin resultados');
    await p.fill('.fv input', 'de tal manera amó'); await p.waitForSelector('.ht');
    await p.click('.ht >> nth=0'); await p.waitForSelector('.tx .on');
    assert.equal(await p.textContent('.tt'), 'Juan 3');
    assert.match(await p.textContent('.tx .on'), /^16Porque de tal manera amó Dios al mundo/);
  });

  await t.test('se cierra con ✕, con Escape, al salir de la pantalla y con Atrás; al volver, retoma donde estaba', async () => {
    await p.click('.bar button[aria-label="Cerrar"]');
    assert.ok(await cerrado(p));
    assert.ok(!(await p.locator('body').innerText()).includes('Juan'));
    await entrar(p, CLAVE);
    assert.equal(await p.textContent('.tt'), 'Juan 3', 'no ha retomado la última lectura');
    await p.keyboard.press('Escape');
    assert.ok(await cerrado(p));
    await entrar(p, CLAVE);
    await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); delete document.hidden; });
    assert.ok(await cerrado(p));
    await entrar(p, CLAVE);                                       // Juan 3
    await p.goBack(); await p.waitForSelector('.bk');             // un libro con un solo capítulo cargado: lista
    await p.goBack(); await p.waitForFunction(() => document.querySelector('.rd').hidden);
    assert.ok(await cerrado(p));
    assert.equal(await p.locator('.ls li').count(), 1, 'Atrás no debe sacar de la página');
  });

  await t.test('tamaño de letra y tema se aplican y se recuerdan; la posición de lectura no deja rastro al recargar', async () => {
    await p.reload();
    assert.equal(await p.evaluate(() => localStorage.getItem('nt.c')), null, 'la posición no debe quedar en el almacenamiento');
    await entrar(p, CLAVE);
    assert.equal(await p.textContent('.tt'), 'Reina-Valera 1909', 'tras recargar se empieza por los libros');
    await p.click('.bk:has-text("Juan")'); await p.waitForSelector('.tx');
    const antes = await p.evaluate(() => getComputedStyle(document.querySelector('.tx')).fontSize);
    await p.click('.bar button[aria-label="Más"]'); await p.click('.fr button >> nth=1'); await p.click('.fr button >> nth=1');
    const despues = await p.evaluate(() => getComputedStyle(document.querySelector('.tx')).fontSize);
    assert.equal(parseFloat(despues), parseFloat(antes) + 4);
    await p.click('.it:has-text("Tema")');
    assert.equal(await p.evaluate(() => document.documentElement.className), 'd');
    await p.click('.bar button[aria-label="Más"]'); await p.click('.it:has-text("Acerca de")');
    assert.match(await p.textContent('.ab'), /Reina-Valera 1909.*Dominio público\..*Para abrir/s);
  });

  await t.test('pasar una copia: clave nueva, bytes nuevos, mismo programa', async () => {
    await p.click('.bar button[aria-label="Más"]'); await p.click('.it:has-text("Pasar una copia")');
    // dos maneras separadas: en persona (lo de siempre) y a distancia (pegar un código)
    assert.deepEqual(await p.locator('.fm button').allTextContents(), ['En persona', 'A distancia']);
    await p.click('.fm button:has-text("En persona")');
    // la clave la pone siempre la app: 20 cifras al azar; no hay campo para inventarla
    assert.equal(await p.locator('.fm input[type=password]').count(), 1, 'solo el campo para repetirla');
    const k1 = await p.textContent('.ks .kv');
    assert.match(k1, /^\d{4}( \d{4}){4}$/);
    // la clave no se puede seleccionar: así no acaba en el portapapeles
    assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector('.ks .kv')).userSelect), 'none');
    await p.click('.ks .sb');
    const CLAVE2 = await p.textContent('.ks .kv');
    assert.notEqual(CLAVE2, k1, '«Otra» da otra clave');
    await p.fill('.fm label >> nth=0 >> input', k1); await p.click('.pb');
    assert.equal(await p.textContent('.er'), 'Las claves no coinciden', 'la clave anterior ya no vale');
    await p.fill('.fm label >> nth=0 >> input', CLAVE2.replace(/ /g, ''));          // sin espacios también vale
    await p.fill('.fm label >> nth=1 >> input', 'apuntes');
    await p.click('.pb'); await p.waitForSelector('.fm .sb');
    const [bajada] = await Promise.all([p.waitForEvent('download'), p.click('.fm button:has-text("Guardar")')]);
    assert.equal(bajada.suggestedFilename(), 'apuntes.html');
    const copia = path.join(tmp, 'apuntes.html');
    await bajada.saveAs(copia);
    const a = fs.readFileSync(es, 'utf8'), b = fs.readFileSync(copia, 'utf8');
    assert.notEqual(a, b);
    assert.equal(sinBlob(a), sinBlob(b), 'fuera del contenido cifrado la copia debe ser idéntica');
    assert.equal(comprobar(b).ok, true, 'la copia hecha en el móvil debe pasar la verificación');
    await p.click('.fm button:has-text("Hecho")');
    await p.click('.bar button[aria-label="Cerrar"]');

    const q = await abrir(copia);
    await teclear(q, CLAVE); await q.waitForTimeout(1200);
    assert.ok(await cerrado(q), 'la copia no debe abrirse con la clave antigua');
    await entrar(q, CLAVE2);
    assert.deepEqual(await q.locator('.bk').allTextContents(), ['Génesis', 'Salmos', 'Juan', 'Judas']);
    await q.close();
  });

  // envío a distancia: la otra persona tiene el teléfono en francés (otro contexto del navegador, como otro móvil)
  const fr = await nav.newContext({ viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true, acceptDownloads: true, locale: 'fr-FR' });
  await fr.setOffline(true);
  t.after(() => fr.close());
  async function abrirFr(archivo) {
    const q = await fr.newPage();
    q.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') problemas.push(m.text()); });
    q.on('pageerror', e => problemas.push('excepción: ' + e.message));
    q.on('request', r => { if (!/^(file|blob):/.test(r.url())) problemas.push('petición: ' + r.url()); });
    await q.goto('file://' + archivo);
    return q;
  }
  async function guardar(pg, nombre) {
    const [b] = await Promise.all([pg.waitForEvent('download'), pg.click('.fm button:has-text("Guardar"), .fm button:has-text("Enregistrer")')]);
    const ruta = path.join(tmp, nombre);
    await b.saveAs(ruta);
    return { ruta, sugerido: b.suggestedFilename() };
  }
  // el emisor pega el mensaje del chat (con la hora y un teléfono alrededor) y hace la copia
  async function pegarYCopiar(codigo, nombre) {
    await entrar(p, CLAVE);
    await p.click('.bar button[aria-label="Más"]'); await p.click('.it:has-text("Pasar una copia")');
    await p.click('.fm button:has-text("A distancia")');
    await p.fill('.fm textarea', '[12:30, 26/11/2026] Ana: ' + codigo + '\nmi número: 600 123 456');
    await p.waitForSelector('.fm .pb:has-text("Crear copia")');
    const r = { cubierta: await p.inputValue('.fm select'), archivo: await p.inputValue('.fm label:has-text("Nombre del archivo") input') };
    await p.click('.fm .pb:has-text("Crear copia")'); await p.waitForSelector('.fm button:has-text("Guardar")');
    assert.equal(await p.textContent('.fm p'), 'Lista. Mándala por el mismo chat de WhatsApp o Signal.');
    r.copia = (await guardar(p, nombre)).ruta;
    await p.click('.fm button:has-text("Hecho")'); await p.click('.bar button[aria-label="Cerrar"]');
    return r;
  }
  let invitacion, clave3, copia3;

  await t.test('a distancia: crear la invitación (mismo programa, sin contenido, nada delator)', async () => {
    await entrar(p, CLAVE);
    await p.click('.bar button[aria-label="Más"]'); await p.click('.it:has-text("Pasar una copia")');
    await p.click('.fm button:has-text("A distancia")');
    assert.match(await p.textContent('.fm p'), /mándale primero una invitación/);
    // algo que no es un código se rechaza con un aviso, y no aparece nada más
    await p.fill('.fm textarea', 'hola, mi clave es 4821 0937 5512 8846 0393');
    await p.waitForFunction(() => document.querySelector('.fm .er').textContent !== '');
    assert.equal(await p.textContent('.fm .er'), 'No es un código válido');
    assert.equal(await p.locator('.fm .pb:has-text("Crear copia")').count(), 0);
    await p.click('.fm button:has-text("Crear invitación")'); await p.waitForSelector('.fm button:has-text("Guardar")');
    const g = await guardar(p, 'invitacion.html');
    assert.equal(g.sugerido, 'invitacion.html');
    invitacion = g.ruta;
    await p.click('.fm button:has-text("Hecho")'); await p.click('.bar button[aria-label="Cerrar"]');
    const html = fs.readFileSync(invitacion, 'utf8'), v = comprobar(html);
    assert.equal(v.ok, true); assert.equal(v.invitacion, true); assert.deepEqual(v.distintos, []);
    assert.equal(sinBlob(html).replace(/(<script type="application\/json" id="u">)[^<]*/, '$1'), sinBlob(fs.readFileSync(es, 'utf8')).replace(/(<script type="application\/json" id="u">)[^<]*/, '$1'), 'mismo programa, estilos y política');
    assert.ok(html.length < 250000, 'pesa ' + html.length);
    assert.ok(!/Génesis|Juan|Reina|Valera|Dios/.test(html), 'la invitación no lleva nada del contenido');
  });

  let codigo;
  await t.test('a distancia: el receptor abre la invitación en su idioma, apunta su clave y crea su código', async () => {
    const q = await abrirFr(invitacion);
    assert.equal(await q.getAttribute('html', 'lang'), 'fr');
    assert.match(await q.textContent('.iv'), /Quelqu’un veut vous envoyer un fichier/);
    const k = await q.textContent('.ks .kv');
    assert.match(k, /^\d{4}( \d{4}){4}$/);
    assert.equal(await q.evaluate(() => getComputedStyle(document.querySelector('.ks .kv')).userSelect), 'none');
    // al salir de la página la clave desaparece (la miniatura de «recientes» no la enseña); al volver hay otra
    await q.evaluate(() => window.dispatchEvent(new Event('blur')));
    assert.equal(await q.textContent('.ks .kv'), '');
    await q.evaluate(() => window.dispatchEvent(new Event('focus')));
    const clave = await q.textContent('.ks .kv');
    assert.match(clave, /^\d{4}( \d{4}){4}$/); assert.notEqual(clave, k);
    // mal copiada: no avanza
    await q.fill('.iv input[type=password]', k); await q.click('.iv .pb');
    assert.equal(await q.textContent('.iv .er'), 'Les deux phrases ne correspondent pas');
    await q.fill('.iv input[type=password]', clave.replace(/ /g, '')); await q.click('.iv .pb');
    await q.waitForSelector('.iv .cd');
    codigo = await q.textContent('.iv .cd');
    assert.match(codigo, /^\d{5}( \d{5}){25}$/);
    assert.ok(!(await q.locator('body').innerText()).includes(clave), 'la clave ya no está en pantalla');
    assert.match(await q.textContent('.iv'), /Recherch.*supprimez cette invitation/s);
    assert.equal(await q.locator('.iv button:has-text("Copier")').count(), 1);
    clave3 = clave;
    await q.close();
  });

  await t.test('a distancia: el emisor pega el mensaje y hace la copia; solo la abre la clave del receptor', async () => {
    const r = await pegarYCopiar(codigo, 'copia-fr.html');
    // el código dice el idioma del otro teléfono: la portada de la copia ya va en francés
    assert.equal(r.cubierta, 'fr'); assert.equal(r.archivo, 'notes');
    const html = fs.readFileSync(r.copia, 'utf8');
    assert.equal(comprobar(html).ok, true);
    assert.equal(sinBlob(html).replace(/<title>[^<]*|(id="u">)[^<]*|lang="[a-z]+"/g, ''), sinBlob(fs.readFileSync(es, 'utf8')).replace(/<title>[^<]*|(id="u">)[^<]*|lang="[a-z]+"/g, ''));
    const q = await abrirFr(r.copia);
    assert.equal(await q.title(), 'Notes');
    await teclear(q, CLAVE); await q.waitForTimeout(1200);
    assert.ok(await cerrado(q), 'la clave del emisor no la abre');
    await entrar(q, clave3);
    assert.deepEqual(await q.locator('.bk').allTextContents(), ['Génesis', 'Salmos', 'Juan', 'Judas']);
    copia3 = r.copia;
    await q.close();
  });

  await t.test('recibir otra copia con la clave de siempre: el código sale de la clave con que se abre', async () => {
    const q = await abrirFr(copia3);
    await entrar(q, clave3);
    await q.click('.bar button[aria-label="Plus"]'); await q.click('.it:has-text("Recevoir une copie")');
    await q.fill('.fm input[type=password]', '1111 2222 3333 4444 5555'); await q.click('.fm .pb');
    await q.waitForFunction(() => document.querySelector('.fm .er').textContent !== '');
    assert.equal(await q.textContent('.fm .er'), 'Les deux phrases ne correspondent pas');
    await q.fill('.fm input[type=password]', clave3); await q.click('.fm .pb');
    await q.waitForSelector('.fm .cd');
    const otro = await q.textContent('.fm .cd');
    assert.match(otro, /^\d{5}( \d{5}){25}$/); assert.notEqual(otro, codigo, 'un código nuevo cada vez');
    await q.close();
    const r = await pegarYCopiar(otro, 'copia-fr-2.html');
    const z = await abrirFr(r.copia);
    await entrar(z, clave3);
    assert.deepEqual(await z.locator('.bk').allTextContents(), ['Génesis', 'Salmos', 'Juan', 'Judas']);
    await z.close();
  });

  await t.test('a distancia con varios idiomas: se marca el del otro teléfono, y las notas van en ese idioma', async () => {
    const dos = path.join(tmp, 'dos.html');
    const fuenteAr = leerArchivos([{ nombre: 'ar.usfm', texto: fs.readFileSync(path.join(FX, 'ar-vd.usfm'), 'utf8') }]);
    fs.writeFileSync(dos, (await construir({ clave: CLAVE, traducciones: [
      { libros: leerArchivos([{ nombre: 'es.usfx.xml', texto: fs.readFileSync(path.join(FX, 'es-rv1909.usfx.xml'), 'utf8') }]), idioma: 'es', nombre: 'Reina-Valera 1909' },
      { libros: fuenteAr, idioma: 'ar', nombre: 'فان دايك' }] })).html);
    const codigoAr = await cargarNucleo().code('2222 3333 4444 5555 6666', 'ar-EG');
    const q = await abrir(dos);
    await entrar(q, CLAVE);
    await q.click('.bar button[aria-label="Más"]'); await q.click('.it:has-text("Pasar una copia")');
    await q.click('.fm button:has-text("A distancia")');
    await q.fill('.fm textarea', codigoAr);
    await q.waitForSelector('.fm .ck');
    assert.deepEqual(await q.locator('.fm .ck input[type=checkbox]').evaluateAll(a => a.map(c => c.checked)), [false, true], 'marcado: árabe');
    assert.equal(await q.inputValue('.fm select'), 'ar');
    await q.click('.bar button[aria-label="Cerrar"]');
    await q.close();
  });

  await t.test('una copia antigua (programa del 25-11-2026) sigue abriendo', async () => {
    const q = await abrir(path.join(FX, 'copia-2026-11-25.html'));
    await entrar(q, '4821 0937 5512 8846 0393');
    assert.deepEqual(await q.locator('.bk').allTextContents(), ['Génesis', 'Salmos', 'Juan', 'Judas']);
    await q.close();
  });

  await t.test('árabe: de derecha a izquierda, cifras propias y búsqueda sin vocalización', async () => {
    const q = await abrir(ar);
    assert.equal(await q.getAttribute('html', 'dir'), 'rtl');
    assert.equal(await q.title(), 'ملاحظات');
    await entrar(q, CLAVE);
    await q.click('.bk >> nth=2'); await q.waitForSelector('.tx');
    assert.equal(await q.textContent('.tt'), 'يوحنا ٣');
    assert.equal(await q.textContent('.tx sup'), '١٦');
    assert.equal(await q.getAttribute('.tx', 'dir'), 'rtl');
    assert.equal(await q.getAttribute('.rd', 'lang'), 'es');   // el menú sigue al teléfono (es), no a la portada (ar)
    await q.click('.bar button[aria-label="Buscar"]');
    await q.fill('.fv input', 'احب الله العالم');               // sin tashkil y con alef simple
    await q.waitForSelector('.ht');
    assert.match(await q.textContent('.ht b'), /يوحنا ٣:١٦/);
    assert.ok((await q.textContent('.ht mark')).length > 'احب الله العالم'.length, 'el resaltado debe cubrir el texto vocalizado');
    await q.close();
  });

  await t.test('libro con varios capítulos: rejilla, y Atrás va texto → capítulos → libros → notas', async () => {
    const en = path.join(tmp, 'en.html');
    const dir = path.join(FX, 'en-bsb');
    const fuente = leerArchivos(fs.readdirSync(dir).map(f => ({ nombre: f, texto: fs.readFileSync(path.join(dir, f), 'utf8') })));
    fs.writeFileSync(en, (await construir({ libros: fuente, clave: CLAVE, idioma: 'en', nombre: 'BSB' })).html);
    const q = await abrir(en);
    await q.evaluate(() => localStorage.clear());
    await entrar(q, CLAVE);
    await q.click('.bk:has-text("John")'); await q.waitForSelector('.cg');
    assert.deepEqual(await q.locator('.ch').allTextContents(), ['3', '4']);
    await q.click('.ch >> nth=1'); await q.waitForSelector('.tx');
    assert.equal(await q.textContent('.tt'), 'John 4');
    await q.click('.pn button >> nth=1'); await q.waitForFunction(() => document.querySelector('.tt').textContent === 'Jude 1');
    await q.click('.pn button >> nth=0'); await q.waitForFunction(() => document.querySelector('.tt').textContent === 'John 4');
    await q.goBack(); await q.waitForSelector('.cg');
    await q.goBack(); await q.waitForSelector('.bk');
    await q.goBack(); await q.waitForFunction(() => document.querySelector('.rd').hidden);
    assert.ok(await cerrado(q));
    await q.close();
  });

  await t.test('navegador antiguo o capado: sin descompresor nativo y sin almacenamiento, sigue funcionando', async () => {
    const q = await ctx.newPage();
    q.on('pageerror', e => problemas.push('excepción: ' + e.message));
    await q.addInitScript(() => {
      delete window.DecompressionStream;
      const no = () => { throw new DOMException('no', 'SecurityError'); };
      Storage.prototype.getItem = no; Storage.prototype.setItem = no;
      history.pushState = no;
    });
    await q.goto('file://' + es);
    assert.equal(await q.evaluate(() => typeof DecompressionStream), 'undefined');
    await q.click('.fab'); await q.fill('textarea', 'Nota en memoria'); await q.click('.ed .bar button:first-child');
    assert.equal(await q.locator('.ls li').count(), 1);
    await entrar(q, CLAVE);
    await q.click('.bk:has-text("Judas")'); await q.waitForSelector('.tx');
    assert.match(await q.textContent('.tx'), /JUDAS, siervo de Jesucristo/);
    await q.click('.bar button[aria-label="Buscar"]'); await q.fill('.fv input', 'pastor'); await q.waitForSelector('.ht');
    await q.click('.bar button[aria-label="Cerrar"]');
    assert.ok(await cerrado(q));
    await q.close();
  });

  await t.test('ni un error, ni un aviso, ni una petición de red en toda la sesión', () => {
    assert.deepEqual(problemas, []);
  });
});
