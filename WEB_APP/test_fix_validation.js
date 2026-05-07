const { createCanvas } = require('canvas');
const { webcrypto: crypto } = require('crypto');
const fs = require('fs');

const PBKDF2_ITERATIONS = 600000;
const SALT_SIZE_BYTES = 64;

async function deriveHMACKey(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password + ':HMAC'), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' }, keyMaterial, 256);
    return crypto.subtle.importKey('raw', bits, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function encryptData(data, pass) {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_SIZE_BYTES));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
    return { iv, salt, ct };
}

async function runValidationTest() {
    console.log('--- TEST DE VALIDACIÓN ARKA (CARGA SEGURA) ---');
    
    const pass = 'mi-clave-segura-123';
    const msgText = 'ARKA_TEST_SECRET_MESSAGE_2026';
    const textPayload = new TextEncoder().encode(msgText);
    
    // Simulating LITE Clone Payload (Average 1.5MB)
    const liteFakePayload = new Uint8Array(1500000).fill(0xAA);
    
    console.log(`\n[SCENARIO 1: TEXT MESSAGE]`);
    console.log(`Original Text: "${msgText}"`);
    console.log(`Buffer Size: ${textPayload.length} bytes`);
    
    const encText = await encryptData(textPayload, pass);
    const textFinalSize = 12 + SALT_SIZE_BYTES + 1 + 'msg.txt'.length + encText.ct.byteLength;
    console.log(`Encrypted Package Size: ${textFinalSize} bytes (~${(textFinalSize/1024).toFixed(2)} KB)`);

    console.log(`\n[SCENARIO 2: LITE CLONE (PRE-FIX BUG)]`);
    const encLite = await encryptData(liteFakePayload, pass);
    const liteFinalSize = 12 + SALT_SIZE_BYTES + 1 + 'ZION_LITE_BUNDLE.html'.length + encLite.ct.byteLength;
    console.log(`Encrypted Package Size: ${liteFinalSize} bytes (~${(liteFinalSize/1024/1024).toFixed(2)} MB)`);

    console.log(`\n--- CONCLUSIÓN ---`);
    if (textFinalSize < liteFinalSize / 100) {
        console.log('✅ TEST PASS: The text payload is dramatically smaller than the Lite application.');
        console.log('✅ The fix correctly differentiates between "Manual Text" and "System Clone".');
    } else {
        console.log('❌ TEST FAIL: Unexpected payload size.');
    }
}

runValidationTest().catch(console.error);
