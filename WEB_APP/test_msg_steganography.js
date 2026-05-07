const { createCanvas, loadImage } = require('canvas');
const { webcrypto: crypto } = require('crypto');
const fs = require('fs');
const path = require('path');

// --- CONSTANTS FROM ZION_LITE_BASE.html ---
const MAX_STEGO_PAYLOAD = 10 * 1024 * 1024;
const PBKDF2_ITERATIONS = 600000;
const SALT_SIZE_BYTES = 64;

// --- CRYPTO HELPER FUNCTIONS ---
async function deriveKey(pass, salt) {
    const enc = new TextEncoder();
    const base = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({
        name: 'PBKDF2', salt: salt, iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-256'
    }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

async function encryptData(buf, pass) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const salt = crypto.getRandomValues(new Uint8Array(SALT_SIZE_BYTES));
    const key = await deriveKey(pass, salt);
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, buf);
    return { ct, iv, salt };
}

async function decryptData(obj, pass) {
    const key = await deriveKey(pass, obj.salt);
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: obj.iv }, key, obj.ct);
}

async function calculateGhostOffset(pass, totalPixels) {
    const enc = new TextEncoder();
    const hashBuf = await crypto.subtle.digest('SHA-256', enc.encode(pass));
    const seed = new DataView(hashBuf).getUint32(0);
    return seed % totalPixels;
}

async function deriveHMACKey(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password + ':HMAC'),
        'PBKDF2',
        false,
        ['deriveBits']
    );

    const bits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: PBKDF2_ITERATIONS,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );

    return crypto.subtle.importKey(
        'raw',
        bits,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
    );
}

// --- STEGANOGRAPHY CORE ---
async function embedLSB(canvas, dataBuf, pass) {
    const len = dataBuf.byteLength;
    if (len <= 0) throw new Error('Payload is empty');
    
    const header = new Uint8Array([
        (len >> 24) & 255,
        (len >> 16) & 255,
        (len >> 8) & 255,
        len & 255
    ]);
    const payload = new Uint8Array(4 + len);
    payload.set(header, 0);
    payload.set(dataBuf, 4);

    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const totalPixels = canvas.width * canvas.height;

    const startPixel = await calculateGhostOffset(pass, totalPixels);
    let payloadByteIdx = 0;
    let shift = 6;
    let currentPixel = startPixel;

    while (payloadByteIdx < payload.length) {
        const baseIdx = currentPixel * 4;
        for (let offset = 0; offset < 3; offset++) {
            if (payloadByteIdx >= payload.length) break;
            const i = baseIdx + offset;
            data[i] = (data[i] & 252) | ((payload[payloadByteIdx] >> shift) & 3);
            shift -= 2;
            if (shift < 0) { shift = 6; payloadByteIdx++; }
        }
        currentPixel++;
        if (currentPixel >= totalPixels) currentPixel = 0;
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
}

async function extractLSB(canvas, pass) {
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const totalPixels = canvas.width * canvas.height;
    const startPixel = await calculateGhostOffset(pass, totalPixels);

    let headerBytes = [];
    let currentByte = 0;
    let shift = 6;
    let mode = 'HEADER';
    let payloadLen = 0;
    let payloadBuffer = null;
    let payloadIdx = 0;
    let currentPixel = startPixel;
    let checked = 0;

    while (checked < totalPixels) {
        const baseIdx = currentPixel * 4;
        if (baseIdx + 3 >= data.length) break;

        for (let offset = 0; offset < 3; offset++) {
            const i = baseIdx + offset;
            currentByte |= ((data[i] & 3) << shift);
            shift -= 2;
            if (shift < 0) {
                if (mode === 'HEADER') {
                    headerBytes.push(currentByte);
                    if (headerBytes.length === 4) {
                        payloadLen = (headerBytes[0] << 24) | (headerBytes[1] << 16) | (headerBytes[2] << 8) | headerBytes[3];
                        if (payloadLen <= 0 || payloadLen > MAX_STEGO_PAYLOAD) {
                            throw new Error(`Invalid payload length: ${payloadLen}. Wrong password?`);
                        }
                        payloadBuffer = new Uint8Array(payloadLen);
                        mode = 'DATA';
                    }
                } else {
                    if (payloadIdx < payloadLen) {
                        payloadBuffer[payloadIdx] = currentByte;
                        payloadIdx++;
                    }
                    if (payloadIdx === payloadLen) break;
                }
                currentByte = 0;
                shift = 6;
            }
        }
        if (mode === 'DATA' && payloadIdx === payloadLen) break;
        currentPixel++;
        if (currentPixel >= totalPixels) currentPixel = 0;
        checked++;
    }

    if (!payloadBuffer || payloadIdx !== payloadLen) {
        throw new Error('Incomplete data extraction');
    }
    return payloadBuffer;
}

async function embedLSBSecure(canvas, dataBuf, pass) {
    const hmacSalt = crypto.getRandomValues(new Uint8Array(32));
    const hmacKey = await deriveHMACKey(pass, hmacSalt);
    const hmac = await crypto.subtle.sign('HMAC', hmacKey, dataBuf);

    const payload = new Uint8Array(64 + dataBuf.byteLength);
    payload.set(new Uint8Array(hmac), 0);
    payload.set(hmacSalt, 32);
    payload.set(dataBuf, 64);

    return embedLSB(canvas, payload, pass);
}

async function extractLSBSecure(canvas, pass) {
    const extracted = await extractLSB(canvas, pass);
    const view = new Uint8Array(extracted);

    if (view.length < 64) throw new Error('Invalid payload - too small');

    const hmac = view.slice(0, 32);
    const hmacSalt = view.slice(32, 64);
    const data = view.slice(64);

    const hmacKey = await deriveHMACKey(pass, hmacSalt);
    const valid = await crypto.subtle.verify('HMAC', hmacKey, hmac, data);

    if (!valid) {
        throw new Error('Authentication failed - data has been tampered with or wrong password');
    }

    return data;
}

// --- FULL FLOW TEST ---
async function runFullFlowTest() {
    console.log('🚀 Starting Full Message Steganography Test Flow...\n');

    const pass = 'top-secret-arka-password-very-long-and-secure';
    const message = 'ESTEGANOGRAFÍA TEST: Securing this message with AES-GCM and LSB.';
    const filename = 'test_secret.txt';
    const data = new TextEncoder().encode(message);

    console.log(`Input Message: "${message}"`);
    console.log(`Password: "${pass}"`);

    try {
        // 1. ENCRYPT (Logic from msgEncrypt)
        console.log('\nStep 1: Encrypting data with AES-GCM...');
        const enc = await encryptData(data, pass);
        const nameB = new TextEncoder().encode(filename);
        
        // Assemble Arka Payload: [IV(12) | SALT(64) | NameLen(1) | Name(N) | Ciphertext(C)]
        const encryptedPayload = new Uint8Array(12 + SALT_SIZE_BYTES + 1 + nameB.length + enc.ct.byteLength);
        let off = 0;
        encryptedPayload.set(enc.iv, 0); off += 12;
        encryptedPayload.set(enc.salt, off); off += SALT_SIZE_BYTES;
        encryptedPayload[off] = nameB.length; off++;
        encryptedPayload.set(nameB, off); off += nameB.length;
        encryptedPayload.set(new Uint8Array(enc.ct), off);
        
        console.log(`✅ Encrypted Payload Size: ${encryptedPayload.length} bytes`);

        // 2. EMBED (Logic from msgEncrypt -> embedLSBSecure)
        console.log('\nStep 2: Embedding into image (LSB)...');
        const canvas = createCanvas(800, 800);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, 800, 800); // Base image

        await embedLSBSecure(canvas, encryptedPayload, pass);
        console.log('✅ Embedding successful.');

        // 3. EXTRACT (Logic from msgDecrypt -> extractLSBSecure)
        console.log('\nStep 3: Extracting from image...');
        const extractedEncryptedPayload = await extractLSBSecure(canvas, pass);
        console.log('✅ Extraction successful.');

        // 4. DECRYPT (Logic from processDecryptedBuffer -> decryptData)
        console.log('\nStep 4: Decrypting AES-GCM...');
        const v = new Uint8Array(extractedEncryptedPayload);
        const iv = v.slice(0, 12);
        const salt = v.slice(12, 12 + SALT_SIZE_BYTES);
        const nLen = v[12 + SALT_SIZE_BYTES];
        const extractedName = new TextDecoder().decode(v.slice(12 + SALT_SIZE_BYTES + 1, 12 + SALT_SIZE_BYTES + 1 + nLen));
        const ct = v.slice(12 + SALT_SIZE_BYTES + 1 + nLen);

        console.log(`Extracted Filename: "${extractedName}"`);
        
        const decryptedBuf = await decryptData({ iv, salt, ct }, pass);
        const decryptedText = new TextDecoder().decode(decryptedBuf);

        if (decryptedText === message) {
            console.log(`✅ SUCCESS: Decrypted message matches original!`);
            console.log(`Result: "${decryptedText}"`);
        } else {
            console.error('❌ FAILURE: Mismatch in decrypted data.');
            process.exit(1);
        }

        console.log('\n🎉 ALL FULL-FLOW TESTS PASSED!');
    } catch (e) {
        console.error('❌ Test failed with error:', e);
        process.exit(1);
    }
}

runFullFlowTest();
