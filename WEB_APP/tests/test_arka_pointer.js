/**
 * Tests del PUNTERO ROBUSTO (ArkaPointer) sobre el código real de ZION_CORE_BASE.html.
 * Simula el envío como foto por WhatsApp/Telegram (recompresión JPEG + redimensionado).
 *   node tests/test_arka_pointer.js [ruta/a/foto.jpg ...]
 */
const assert = require('assert');
const { createCanvas, loadImage } = require('canvas');
const { loadFromHtml } = require('./lib/extract_from_html');

const { ARKA_POINTER: AP } = loadFromHtml('ZION_CORE_BASE.html', ['PBKDF2_ITERATIONS', 'ARKA_POINTER']);

const PASS = 'clave-de-prueba-2026';
const AR_ID = 'bNbA3TEQVL60xlgCcqdz4ZPHFZ711cZ3hmkpGttDt_U';          // formato de tx Arweave
const IPFS_ID = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi'; // CIDv1

/** Foto sintética con textura (gradientes, formas y ruido) parecida a una foto real. */
function syntheticPhoto(w, h, seed = 1) {
    let s = seed; const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    const c = createCanvas(w, h), g = c.getContext('2d');
    const grd = g.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, '#3b6e8f'); grd.addColorStop(0.5, '#d9b26f'); grd.addColorStop(1, '#2e4a1f');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 120; i++) {
        g.fillStyle = `rgba(${rnd() * 255 | 0},${rnd() * 255 | 0},${rnd() * 255 | 0},${0.15 + rnd() * 0.4})`;
        g.beginPath(); g.arc(rnd() * w, rnd() * h, 10 + rnd() * w / 6, 0, Math.PI * 2); g.fill();
    }
    const im = g.getImageData(0, 0, w, h);
    for (let i = 0; i < im.data.length; i += 4) { const n = (rnd() - 0.5) * 18; im.data[i] += n; im.data[i + 1] += n; im.data[i + 2] += n; }
    g.putImageData(im, 0, 0);
    return c;
}

/** Escala cualquier imagen al tamaño canónico y devuelve su ImageData (igual que hace la app). */
function toCanonical(img) {
    const { width, height } = AP.canonicalSize(img.width, img.height);
    const c = createCanvas(width, height), g = c.getContext('2d');
    g.imageSmoothingEnabled = true; g.quality = 'best';
    g.drawImage(img, 0, 0, width, height);
    return g.getImageData(0, 0, width, height);
}

function imageDataToCanvas(id) {
    const c = createCanvas(id.width, id.height); c.getContext('2d').putImageData(id, 0, 0); return c;
}

async function jpeg(canvas, quality, maxSide = null) {
    let src = canvas;
    if (maxSide && Math.max(canvas.width, canvas.height) > maxSide) {
        const k = maxSide / Math.max(canvas.width, canvas.height);
        src = createCanvas(Math.round(canvas.width * k), Math.round(canvas.height * k));
        src.getContext('2d').drawImage(canvas, 0, 0, src.width, src.height);
    }
    return loadImage(src.toBuffer('image/jpeg', { quality: quality / 100 }));
}

async function resized(canvas, w, q) {
    const h = Math.round(canvas.height * w / canvas.width);
    const c = createCanvas(w, h); c.getContext('2d').drawImage(canvas, 0, 0, w, h);
    return jpeg(c, q);
}

function psnr(a, b) {
    let se = 0, n = 0;
    for (let i = 0; i < a.data.length; i += 4) for (let k = 0; k < 3; k++) { const d = a.data[i + k] - b.data[i + k]; se += d * d; n++; }
    return 10 * Math.log10(255 * 255 / (se / n));
}

async function runOn(label, coverImg) {
    console.log(`\n=== ${label} (${coverImg.width}x${coverImg.height}) ===`);
    const key = crypto.getRandomValues(new Uint8Array(32));
    const ptr = AP.packPointer({ id: AR_ID, key });

    const original = toCanonical(coverImg);
    const work = toCanonical(coverImg);
    await AP.embed(work, ptr, PASS);
    const q = psnr(original, work);
    console.log(`   calidad visual: PSNR ${q.toFixed(1)} dB ${q > 38 ? '(imperceptible)' : ''}`);
    assert.ok(q > 36, 'distorsión visible');
    const stego = imageDataToCanvas(work);
    // La app entrega la foto como JPEG de alta calidad (una "foto normal")
    const delivered = await jpeg(stego, 92);

    const cases = [
        ['Foto tal cual (JPEG q92)', delivered],
        ['WhatsApp foto (JPEG q75)', await jpeg(imageDataToCanvas(toCanonical(delivered)), 75, 1600)],
        ['WhatsApp baja calidad (q60)', await jpeg(imageDataToCanvas(toCanonical(delivered)), 60, 1600)],
        ['Telegram foto (q87, 1280px)', await jpeg(imageDataToCanvas(toCanonical(delivered)), 87, 1280)],
        ['Reenviada dos veces (q75→q70)', await jpeg(imageDataToCanvas(toCanonical(await jpeg(stego, 75))), 70)],
        ['Reducida a 800px + q75', await resized(stego, 800, 75)],
        ['Reducida a 640px + q70', await resized(stego, 640, 70)],
    ];
    for (const [name, img] of cases) {
        const got = AP.unpackPointer(await AP.extract(toCanonical(img), PASS));
        assert.strictEqual(got.id, AR_ID, name);
        assert.deepStrictEqual(Array.from(got.key), Array.from(key), name);
        console.log(`✅ ${name}`);
    }
    await assert.rejects(AP.extract(toCanonical(delivered), 'otra-clave'), /wrong password/);
    console.log('✅ contraseña incorrecta rechazada');
    await assert.rejects(AP.extract(original, PASS), /wrong password/);
    console.log('✅ foto sin puntero: nada');
}

(async () => {
    // Empaquetado
    const p1 = AP.unpackPointer(AP.packPointer({ id: IPFS_ID }));
    assert.strictEqual(p1.id, IPFS_ID); assert.strictEqual(p1.network, 'ipfs'); assert.strictEqual(p1.key, null);
    assert.strictEqual(AP.unpackPointer(AP.packPointer({ id: AR_ID })).network, 'arweave');
    assert.throws(() => AP.packPointer({ id: 'https://evil/x' }));
    console.log('✅ empaquetado de IDs Arweave / IPFS');

    await runOn('foto sintética horizontal', syntheticPhoto(3000, 2000, 7));
    await runOn('foto sintética vertical', syntheticPhoto(1500, 2000, 3));
    for (const f of process.argv.slice(2)) await runOn(f, await loadImage(f));
    console.log('\n🎉 TODOS LOS TESTS DEL PUNTERO PASAN');
})().catch(e => { console.error('❌', e); process.exit(1); });
