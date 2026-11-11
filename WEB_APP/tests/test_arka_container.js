/**
 * Tests del contenedor ARKA (modo "archivo/documento") sobre el CÓDIGO REAL
 * de ZION_CORE_BASE.html y ZION_LITE_BASE.html.
 *   node tests/test_arka_container.js
 */
const assert = require('assert');
const { createCanvas } = require('canvas');
const { loadFromHtml } = require('./lib/extract_from_html');

const NAMES = [
    'MAX_STEGO_PAYLOAD', 'PBKDF2_ITERATIONS', 'SALT_SIZE_BYTES', 'ARKA_MAGIC',
    'deriveKey', 'encryptData', 'decryptData',
    'embedLSB', 'extractLSB', 'deriveHMACKey',
    'deriveArkaV2Keys', 'pngEndOffset', 'ARKA2_ZERO_COUNTER',
    'embedLSBSecure', 'extractArkaV2', 'extractArkaV1', 'unwrapArkaZip', 'extractLSBSecure', 'MiniZip',
];

function makePng(w = 320, h = 240) {
    const c = createCanvas(w, h), g = c.getContext('2d');
    const grd = g.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, '#2a6'); grd.addColorStop(1, '#a62');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    return new Uint8Array(c.toBuffer('image/png'));
}

const bytesOf = async (blob) => new Uint8Array(await blob.arrayBuffer());
const contains = (hay, needle) => {
    outer: for (let i = 0; i <= hay.length - needle.length; i++) {
        for (let j = 0; j < needle.length; j++) if (hay[i + j] !== needle[j]) continue outer;
        return true;
    }
    return false;
};

/** Construye el paquete igual que la app: [IV(12)][SALT][nameLen][name][CT] */
async function buildAppPayload(Z, data, name, pass) {
    const enc = await Z.encryptData(data, pass);
    const nameB = new TextEncoder().encode(name);
    const out = new Uint8Array(12 + Z.SALT_SIZE_BYTES + 1 + nameB.length + enc.ct.byteLength);
    let o = 0;
    out.set(enc.iv, 0); o += 12;
    out.set(enc.salt, o); o += Z.SALT_SIZE_BYTES;
    out[o++] = nameB.length; out.set(nameB, o); o += nameB.length;
    out.set(new Uint8Array(enc.ct), o);
    return out;
}

async function run(htmlFile) {
    console.log(`\n=== ${htmlFile} ===`);
    const Z = loadFromHtml(htmlFile, NAMES);
    const cover = new Blob([makePng()], { type: 'image/png' });
    const coverLen = (await bytesOf(cover)).length;
    const secret = new TextEncoder().encode('Mensaje de prueba ZION · ñ · 中文');
    const pass = 'contraseña-de-prueba';

    // 1. Ida y vuelta completa (como la app)
    const pkt = await buildAppPayload(Z, secret, 'nota.txt', pass);
    const stego = await Z.embedLSBSecure(cover, pkt, pass);
    const got = new Uint8Array(await Z.extractLSBSecure(stego, pass));
    assert.deepStrictEqual(got, pkt);
    console.log('✅ ocultar + extraer');

    // 2. Sin huella: ni "ARKA" ni "ZV" ni longitud en claro tras IEND
    const sb = await bytesOf(stego);
    const end = Z.pngEndOffset(sb);
    const trailer = sb.subarray(end);
    assert.ok(!contains(trailer, [0x41, 0x52, 0x4B, 0x41]), 'aparece la firma ARKA');
    assert.strictEqual(end, coverLen, 'la imagen original debe quedar intacta');
    console.log('✅ sin firma "ARKA" en los datos añadidos');

    // 2b. multi-volumen: la cabecera ZV queda cifrada
    const zv = new Uint8Array(9 + 50); zv[0] = 90; zv[1] = 86;
    const stegoZV = await bytesOf(await Z.embedLSBSecure(cover, zv, pass));
    assert.ok(!contains(stegoZV.subarray(end), [90, 86, 0, 0, 0, 0]), 'cabecera ZV en claro');
    console.log('✅ cabecera multi-volumen "ZV" no visible');

    // 2c. Flujo real de la app: el PNG se descarga dentro de un ZIP (MiniZip) y el usuario abre el ZIP
    const zipBlob = new Z.MiniZip('Arka_123.png', sb).generate();
    const zb = await bytesOf(zipBlob);
    assert.ok(zb[0] === 0x50 && zb[1] === 0x4B, 'debe ser un ZIP');
    assert.deepStrictEqual(new Uint8Array(await Z.extractLSBSecure(zipBlob, pass)), pkt);
    console.log('✅ leer directamente el ZIP que descarga la app');

    // 2d. Multi-volumen de extremo a extremo: trocear, ocultar en ZIPs, extraer y reensamblar como la app
    const big = crypto.getRandomValues(new Uint8Array(5000));
    const parts = [big.slice(0, 2000), big.slice(2000, 4000), big.slice(4000)];
    const batch = 0xA1B2C3D4, zips = [];
    for (let i = 0; i < parts.length; i++) {
        const h = new Uint8Array(9); h[0] = 90; h[1] = 86;
        new DataView(h.buffer).setUint32(2, batch); h[6] = i + 1; h[7] = (i === parts.length - 1) ? i + 1 : 0;
        const w = new Uint8Array(9 + parts[i].length); w.set(h, 0); w.set(parts[i], 9);
        const png = await bytesOf(await Z.embedLSBSecure(cover, w, pass));
        zips.push(new Z.MiniZip(`Arka_Vol${i + 1}.png`, png).generate());
    }
    const got2 = [];
    for (const z of zips.reverse()) {               // orden desordenado a propósito
        const v = new Uint8Array(await Z.extractLSBSecure(z, pass));
        got2.push([v[6], v.slice(9)]);               // misma lectura que la app (cabecera de 9 bytes)
    }
    const joined = Uint8Array.from(got2.sort((a, b) => a[0] - b[0]).flatMap(p => Array.from(p[1])));
    assert.deepStrictEqual(joined, big, 'el reensamblado multi-volumen no coincide');
    console.log('✅ multi-volumen: 3 ZIPs desordenados se reensamblan sin corrupción');

    // 3. Contraseña incorrecta
    await assert.rejects(Z.extractLSBSecure(stego, 'otra'), /wrong password/);
    console.log('✅ contraseña incorrecta rechazada');

    // 4. Manipulación
    const tampered = sb.slice(); tampered[end + 40] ^= 1;
    await assert.rejects(Z.extractLSBSecure(new Blob([tampered]), pass));
    console.log('✅ manipulación detectada');

    // 5. Imagen limpia -> no hay datos
    await assert.rejects(Z.extractLSBSecure(cover, pass), /No hidden data/);
    console.log('✅ imagen limpia: sin falsos positivos');

    // 6. Re-ocultar sobre una imagen que ya tenía datos: se sustituyen, no se acumulan
    const again = await bytesOf(await Z.embedLSBSecure(stego, pkt, pass));
    assert.strictEqual(again.length, sb.length);
    console.log('✅ re-ocultar reemplaza los datos previos');

    // 7. JPEG (foto recomprimida por WhatsApp/Telegram) -> mensaje claro
    await assert.rejects(Z.extractLSBSecure(new Blob([new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0, 0])]), pass), /JPEG/);
    console.log('✅ JPEG detectado con mensaje explicativo');

    // 8. Retrocompatibilidad: imágenes creadas con ARKA v1 siguen abriéndose
    const hmacSalt = crypto.getRandomValues(new Uint8Array(32));
    const hk = await Z.deriveHMACKey(pass, hmacSalt);
    const hmac = new Uint8Array(await crypto.subtle.sign('HMAC', hk, pkt));
    const v1 = new Uint8Array(64 + pkt.length); v1.set(hmac, 0); v1.set(hmacSalt, 32); v1.set(pkt, 64);
    const legacy = await Z.embedLSB(cover, v1, pass);
    const gotLegacy = new Uint8Array(await Z.extractLSBSecure(legacy, pass));
    assert.deepStrictEqual(gotLegacy, pkt);
    console.log('✅ imágenes ARKA v1 antiguas siguen siendo legibles');
}

(async () => {
    for (const f of ['ZION_CORE_BASE.html', 'ZION_LITE_BASE.html']) await run(f);
    console.log('\n🎉 TODOS LOS TESTS DEL CONTENEDOR PASAN');
})().catch(e => { console.error('❌', e); process.exit(1); });
