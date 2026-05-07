const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('ZION_LITE_BASE.html', 'utf8');

const dom = new JSDOM(html, {
    url: "http://localhost/",
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true
});

dom.window.MAX_STEGO_PAYLOAD = 8 * 1024 * 1024; // 8MB
dom.window.crypto = require('crypto').webcrypto;
dom.window.alert = (msg) => console.log('[ALERT]', msg);
dom.window.confirm = (msg) => { console.log('[CONFIRM]', msg); return true; };
dom.window.showToast = (msg) => console.log('[TOAST]', msg);
dom.window.getSecurePassphrase = async () => 'test_password123';
dom.window.t = (key, data) => `${key} ${JSON.stringify(data||{})}`;
dom.window.document.getElementById = (id) => {
    if (id === 'spinnerText') return { textContent: '' };
    if (id === 'propagationModal') return { classList: { add: () => {} } };
    if (id === 'loadingSpinner') return { classList: { remove: () => {}, add: () => {} } };
    return null;
};
dom.window.showSpinner = () => console.log('[SPINNER: SHOW]');
dom.window.hideSpinner = () => console.log('[SPINNER: HIDE]');

// MOCK:
class SecureString {
    constructor() { this._v = null; }
    set(v) { this._v = v; return this; }
    get() { return this._v; }
    wipe() {}
}
dom.window.SecureString = SecureString;

// Mock dependencies
dom.window.encryptData = async (data, pass) => {
    return {
        ct: new ArrayBuffer(data.length), // mock encryption size
        iv: new Uint8Array(12),
        salt: new Uint8Array(32)
    };
};
dom.window.embedLSBSecure = async () => {
    return new Blob(['stego_fake_data'], {type: 'image/png'});
};
dom.window.createImageBitmap = async () => {
    // Return a fake image that has very small capacity
    // Capacity = (width*height*3/4) - 128
    // Let's make it hold ~ 100 KB
    return { width: 400, height: 400, close: () => {} };
};

// Mock Zip
class MiniZip {
    constructor(n,d){}
    generate() { return new Blob(['zip']); }
}
dom.window.MiniZip = MiniZip;
dom.window.URL.createObjectURL = () => 'blob:test';
dom.window.URL.revokeObjectURL = () => {};

// Mock the file input cover selector to auto-resolve
const originalCreateElement = dom.window.document.createElement;
dom.window.document.createElement = (tag) => {
    if (tag === 'input') {
        const inp = { type: 'file', files: [ new Blob(['fake_cover'], {type: 'image/png'}) ] };
        setTimeout(() => {
            if (inp.onchange) inp.onchange({ target: inp });
        }, 10);
        return {
            click: () => {
                console.log('[USER INTERACTION: Cover image requested]');
                setTimeout(() => { if (inp.onchange) inp.onchange({ target: inp }); }, 10);
            },
            get files() { return inp.files; }
        };
    } else if (tag === 'a') {
        return {
            href: '', download: '', click: () => { console.log('[DOWNLOAD TRIGGERED]', this.download); }
        };
    }
    return originalCreateElement.call(dom.window.document, tag);
};


async function runTest() {
    console.log("--- STARTING MULTI-VOLUME FIX VERIFICATION ---");
    
    // Create a massive payload: 1MB mock
    const payloadData = new Uint8Array(1024 * 1024);
    payloadData.fill(65);
    const filename = "ZION_LITE_BUNDLE.html";

    // Call msgEncrypt from the global scope using our prePass logic
    try {
        console.log("Calling msgEncrypt with a 1MB payload...");
        await dom.window.msgEncrypt(payloadData, filename, "pre_supplied_passphrase");
        console.log("--- VERIFICATION COMPLETE: NO CRASHES ---");
    } catch(e) {
        console.error("FAILED", e);
    }
}

setTimeout(runTest, 1000); // Give JSDOM time to parse script tags
