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
    if (len > MAX_STEGO_PAYLOAD) {
        throw new Error(`Payload too large`);
    }

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
    const maxCapacity = Math.floor(totalPixels * 0.75);

    if (payload.length > maxCapacity) {
        throw new Error(`Image too small for payload.`);
    }

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

async function runTest() {
    console.log('🚀 Starting Steganography Logic Verification...\n');

    const pass = 'super-secret-password-of-at-least-21-chars';
    const originalText = 'Hello ZION! This is a secure test of the Arka Laboratory steganography engine.';
    const dataBuf = new TextEncoder().encode(originalText);

    // Create a dummy PNG canvas
    const width = 500;
    const height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Fill with random noise to simulate a real image
    const noise = new Uint8Array(width * height * 4);
    for (let i = 0; i < noise.length; i += 65536) {
        const chunk = noise.subarray(i, Math.min(i + 65536, noise.length));
        crypto.getRandomValues(chunk);
    }
    // Force alpha to 255 to prevent LSB corruption
    for (let i = 3; i < noise.length; i += 4) {
        noise[i] = 255;
    }
    const noiseData = ctx.createImageData(width, height);
    noiseData.data.set(noise);
    ctx.putImageData(noiseData, 0, 0);

    console.log(`Payload Size: ${dataBuf.length} bytes`);
    console.log(`Canvas Size: ${width}x${height} (${width * height} pixels)`);

    try {
        console.log('\n--- Testing SECURE embedding ---');
        await embedLSBSecure(canvas, dataBuf, pass);
        console.log('✅ Embedding successful.');

        console.log('\n--- Testing SECURE extraction ---');
        const extractedBuf = await extractLSBSecure(canvas, pass);
        const extractedText = new TextDecoder().decode(extractedBuf);

        if (extractedText === originalText) {
            console.log('✅ Extraction successful! Data matches.');
        } else {
            console.error('❌ Extraction failed! Data mismatch.');
            process.exit(1);
        }

        console.log('\n--- Testing extraction with WRONG password ---');
        try {
            await extractLSBSecure(canvas, 'wrong-password');
            console.error('❌ Error: Extraction should have failed with wrong password.');
            process.exit(1);
        } catch (e) {
            console.log(`✅ Expected failure: ${e.message}`);
        }

        console.log('\n--- Testing data tampering ---');
        const totalPixels = width * height;
        const startPixel = await calculateGhostOffset(pass, totalPixels);
        const tamperedImg = ctx.getImageData(0, 0, width, height);
        const idxToTamper = (startPixel * 4); // Red component of the first pixel of payload
        tamperedImg.data[idxToTamper] = tamperedImg.data[idxToTamper] ^ 1; // Flip 1 bit
        ctx.putImageData(tamperedImg, 0, 0);
        
        try {
            await extractLSBSecure(canvas, pass);
            console.error('❌ Error: HMAC check should have caught tampering.');
            process.exit(1);
        } catch (e) {
            console.log(`✅ Expected failure after tampering: ${e.message}`);
        }

        console.log('\n🎉 ALL LOGIC TESTS PASSED!');
    } catch (e) {
        console.error('❌ Unexpected error during test:', e);
        process.exit(1);
    }
}

runTest();
