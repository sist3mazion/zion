/**
 * ZION CORE BUILD SCRIPT
 * ───────────────────────
 * Generates the lightweight ZION Core (~5MB) + PDF Cartridges folder.
 *
 * Output:
 *   dist_optimized/core/
 *     ├── ZION_CORE.html        (~5 MB)
 *     └── cartuchos/
 *         ├── ZION_CARTUCHO_ar.pdf
 *         ├── ZION_CARTUCHO_es.pdf
 *         └── ... (24 files)
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const CONFIG = {
    vaultPath: path.join(__dirname, 'ZION_CORE_BASE.html'),
    litePath: path.join(__dirname, 'ZION_LITE_BASE.html'),
    workerPath: path.join(__dirname, 'pdf.worker.min.js'),
    pdfDir: path.join(__dirname, 'pdfs_input'),
    outDir: path.join(__dirname, 'dist_optimized', 'core'),
    cartDir: path.join(__dirname, 'dist_optimized', 'core', 'cartuchos'),
    langs: [
        { code: 'ar', file: 'Arabic_العربية.pdf' },
        { code: 'am', file: 'Amharic_አማርኛ.pdf' },
        { code: 'bn', file: 'Bengali_বাংলা.pdf' },
        { code: 'fa', file: 'Persian_فارسی.pdf' },
        { code: 'hi', file: 'Hindi_हिन्दी.pdf' },
        { code: 'my', file: 'Burmese_မြန်မာဘာသာ.pdf' },
        { code: 'ps', file: 'Pashto_پښتو.pdf' },
        { code: 'zh', file: 'Chinese_中文.pdf' },
        { code: 'prs', file: 'Dari_دری.pdf' },
        { code: 'en', file: 'English.pdf' },
        { code: 'fr', file: 'French_Français.pdf' },
        { code: 'id', file: 'Indonesian_Bahasa Indonesia.pdf' },
        { code: 'ko', file: 'Korean_한국어.pdf' },
        { code: 'ne', file: 'Nepali_नेपाली.pdf' },
        { code: 'pa', file: 'Punjabi_ਪੰਜਾਬੀ.pdf' },
        { code: 'rhg', file: 'Rohingya_Ruáingga.pdf' },
        { code: 'so', file: 'Somali_Soomaali.pdf' },
        { code: 'es', file: 'Spanish_Español.pdf' },
        { code: 'sw', file: 'Swahili_Kiswahili .pdf' },
        { code: 'tg', file: 'Tajik_Тоҷикӣ.pdf' },
        { code: 'ta', file: 'Tamil_தமிழ்.pdf' },
        { code: 'te', file: 'Telugu_తెలుగు.pdf' },
        { code: 'tr', file: 'Turkish_Türkçe.pdf' },
        { code: 'ug', file: 'Uyghur_ئۇيغۇرچە.pdf' }
    ]
};

function build() {
    console.log('🧬  ZION CORE BUILD\n');

    // 1. Create output directories
    [CONFIG.outDir, CONFIG.cartDir].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    // 2. Read and compress the Lite template (with worker pre-injected, payload placeholders kept)
    console.log('📄 Preparing Lite Template...');
    let liteTemplate = fs.readFileSync(CONFIG.litePath, 'utf8');

    // Inject the PDF.js worker into the template NOW so clones don't need it separately
    if (fs.existsSync(CONFIG.workerPath)) {
        const workerBuf = fs.readFileSync(CONFIG.workerPath);
        const workerB64 = workerBuf.toString('base64').replace(/[\r\n]/g, '');
        liteTemplate = liteTemplate.replace('[[ZION_WORKER_B64_HERE]]', workerB64);
        console.log(`   Worker injected: ${(workerB64.length / 1024).toFixed(0)} KB`);
    } else {
        console.error('   ❌ pdf.worker.min.js NOT FOUND!');
    }

    // Compress the template with gzip (keeps [[PAYLOAD_HERE]] and [[DOC_TYPE_HERE]] as placeholders)
    const templateBuf = Buffer.from(liteTemplate, 'utf8');
    const compressed = zlib.gzipSync(templateBuf, { level: 9 });
    const templateB64 = compressed.toString('base64');
    console.log(`   Template original: ${(templateBuf.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Template gzipped:  ${(compressed.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Template Base64:   ${(templateB64.length / 1024 / 1024).toFixed(2)} MB`);

    // 3. Read the Vault base and inject the compressed template
    console.log('\n🏗️  Building Core HTML...');
    let printerHtml = fs.readFileSync(CONFIG.vaultPath, 'utf8');

    // Inject the compressed Lite template as a global variable
    // We insert it right after the 'use strict'; declaration
    const templateInjection = `\n        // === ZION CORE: EMBEDDED LITE TEMPLATE (Gzip+Base64) ===\n        window.ZION_LITE_TEMPLATE_GZ = "${templateB64}";\n        window.ZION_IS_CORE = true;\n`;
    printerHtml = printerHtml.replace(
        "'use strict';",
        "'use strict';" + templateInjection
    );

    // 3.1 Strip Vault-only blocks for Core (Dead Code Removal)
    console.log('   Stripping Vault-only dead code...');
    printerHtml = printerHtml.replace(/\/\/\s*\[\[VAULT_ONLY\]\].*?\/\/\s*\[\[\/VAULT_ONLY\]\]/gs, '/* VAULT_ONLY_REMOVED */');
    printerHtml = printerHtml.replace(/<!--\s*\[\[VAULT_ONLY\]\].*?<!--\s*\[\[\/VAULT_ONLY\]\]\s*-->/gs, '<!-- VAULT_ONLY_REMOVED -->');

    // Write the Printer HTML
    const printerPath = path.join(CONFIG.outDir, 'ZION_CORE.html');
    fs.writeFileSync(printerPath, printerHtml);
    const printerSize = fs.statSync(printerPath).size;
    console.log(`✅ CORE: ${printerPath}`);
    console.log(`   Size: ${(printerSize / 1024 / 1024).toFixed(2)} MB`);

    // 4. Copy PDFs as "Cartridges"
    console.log('\n📦 Copying PDF Cartridges...');
    let copied = 0;
    for (const lang of CONFIG.langs) {
        const src = path.join(CONFIG.pdfDir, lang.file);
        const dst = path.join(CONFIG.cartDir, `ZION_CARTUCHO_${lang.code}.pdf`);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dst);
            const size = fs.statSync(dst).size;
            console.log(`   ✅ ${lang.code.toUpperCase().padEnd(4)} → ${path.basename(dst)} (${(size / 1024 / 1024).toFixed(2)} MB)`);
            copied++;
        } else {
            console.error(`   ❌ NOT FOUND: ${src}`);
        }
    }

    console.log(`\n🎉 CORE BUILD COMPLETE!`);
    console.log(`   Core HTML: ${(printerSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Cartridges: ${copied}/${CONFIG.langs.length}`);
    console.log(`   Output: ${CONFIG.outDir}`);
}

build();
