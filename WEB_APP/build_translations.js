const fs = require('fs');

const fileTargets = ['ZION_CORE_BASE.html', 'ZION_LITE_BASE.html'];

const EN = {
    msgReaderExtracted: '✓ ZION READER EXTRACTED',
    msgVolSaved: '✓ Vol {vol} Saved (ZIP)',
    msgEncryptComplete: '✓ Encryption Complete',
    msgBootSecure: '✓ ZION System booted securely',
    msgFileDecrypted: '✓ File Decrypted: {name}',
    errOfficialInput: '⚠️ Use official file inputs only',
    msgLiteHtmlDecompressed: '✓ LITE: HTML Document Decompressed',
    msgLiteHtmlBrotli: '✓ LITE: HTML Decompressed (Brotli)',
    msgHybridPdfGzip: '✓ HYBRID: PDF Decompressed (Gzip)',
    msgHybridPdfBrotli: '✓ HYBRID: PDF Decompressed (Brotli)',
    msgLiteResurrected: '✓ LITE: Document Resurrected',
    errResurrection: '❌ Resurrection Failed',
    msgInactivity: '⚠️ Inactivity detected. Self-destruct in 30s...',
    msgSyncOmnibus: '✓ Synchronized from Omnibus',
    msgLoadedNetwork: 'LOADED FROM NETWORK',
    errSelectDoc: '❌ Select a document first',
    msgArkaSealed: '✓ ARKA SEALED SUCCESSFULLY',
    errGeneric: '❌ Error: {msg}',
    errArka: '❌ Arka Error: {msg}',
    errResurrectionError: '❌ Resurrection Error: {msg}',
    spinProcessing: 'PROCESSING...',
    spinExtractingPayload: 'EXTRACTING PAYLOAD...',
    spinGeneratingReader: 'GENERATING READER...',
    spinEncryptingCore: 'ENCRYPTING CORE...',
    spinAnalyzingVol: 'ANALYZING VOL {vol}...',
    spinEmbeddingVol: 'EMBEDDING VOL {vol}...',
    spinScanning: 'SCANNING VOLUMES...',
    spinReadingVol: 'READING VOL {idx} (Found {found})...',
    spinReassembling: 'REASSEMBLING...',
    spinDecrypting: 'DECRYPTING...',
    spinResurrecting: 'RESURRECTING...',
    spinSynchronizing: 'SYNCHRONIZING...',
    spinConnecting: 'CONNECTING...',
    spinGeneratingPayload: 'GENERATING PAYLOAD...',
    spinSealingArka: 'SEALING IN ARKA...',
    errNoPayload: '❌ No embedded payload found to clone.',
    errCloning: '❌ Cloning Failed: {msg}',
    errExtractingReader: 'Error extracting reader: {msg}',
    errMsgEmpty: '❌ Message cannot be empty',
    errNoFile: '❌ No file selected',
    errImageTooSmall: '❌ Image too small. Please select a larger one.',
    errImageCapacity: '❌ Image capacity constrained. Try a larger image.',
    errEncryptionFailed: '❌ ENCRYPTION FAILED\n\n{msg}',
    errIncompleteVol: '⚠️ INCOMPLETE VOLUME BATCH (ID: {id})\n\nFound: {found} of {total} parts.\nMissing Volumes: {missing}\n\nPlease drag ALL parts together at once.',
    errDecryptionFailed: '❌ DECRYPTION FAILED\n\n{msg}\nAttempts: {attempts}',
    errDecompressBrotli: 'Error decompressing HTML (Brotli). {msg}',
    errDecompressPdf: 'Error decompressing PDF payload: {msg}',
    errDecompressPdfBrotli: 'Error decompressing PDF (Brotli) payload. Browser might not support it. {msg}',
    errUnableToLoadFull: '❌ UNABLE TO LOAD DOCUMENT\n\nPossible causes:\n• Document not in Omnibus Memory\n• Network connectivity issues\n• Gateway temporarily unavailable',
    confirmCloneArka: '🖼️ CLONE TO ARKA\n\nThis will extract the internal document/system and hide it inside a new Arka Image.\n\nProceed?',
    confirmZionReader: '🗝️ ZION READER\n\nThis will generate a CLEAN copy of the ZION Engine (Universal Reader).\n\nUse this to read Arka Images on offline devices.\n\nProceed?',
    confirmOfflineKit: '📦 CREATE OFFLINE KIT\n\nThis will generate TWO files:\n1. ZION_READER.html (The Key)\n2. Arka_Image.zip (The Content)\n\nSend BOTH to your contact for a full offline experience.\n\nProceed?',
    confirmOfflineKit: '📦 CREATE OFFLINE KIT\n\nThis will generate TWO files:\n1. ZION_READER.html (The Key)\n2. Arka_Image.zip (The Content)\n\nSend BOTH to your contact for a full offline experience.\n\nProceed?',
    confirmBootSystem: '🧬 ZION SYSTEM DETECTED\n\nFile: {name}\n\nBOOT SYSTEM NOW?',
    // Zion Core Specific
    coreLite: 'ZION CORE LITE',
    coreLiteDesc: 'Load PDF cartridge → Generate ZION Lite',
    coreBtn: '🧬 ZION CORE',
    cloneCore: 'CLONE CORE',
    cloneCoreDesc: 'Create exact copy of this Core',
    cloneBtn: '📄 CLONE',
    hideImgBtn: '🖼️ HIDE IN IMAGE'
};

const ES = {
    msgReaderExtracted: '✓ LECTOR ZION EXTRAÍDO',
    msgVolSaved: '✓ Vol {vol} Guardado (ZIP)',
    msgEncryptComplete: '✓ Cifrado Completo',
    msgBootSecure: '✓ Sistema ZION arrancado de forma segura',
    msgFileDecrypted: '✓ Archivo Descifrado: {name}',
    errOfficialInput: '⚠️ Usa solo entradas de archivo oficiales',
    msgLiteHtmlDecompressed: '✓ LITE: Documento HTML Descomprimido',
    msgLiteHtmlBrotli: '✓ LITE: HTML Descomprimido (Brotli)',
    msgHybridPdfGzip: '✓ HYBRID: PDF Descomprimido (Gzip)',
    msgHybridPdfBrotli: '✓ HYBRID: PDF Descomprimido (Brotli)',
    msgLiteResurrected: '✓ LITE: Documento Resucitado',
    errResurrection: '❌ Falló la Resurrección',
    msgInactivity: '⚠️ Inactividad detectada. Autodestrucción en 30s...',
    msgSyncOmnibus: '✓ Sincronizado desde Omnibus',
    msgLoadedNetwork: 'CARGADO DESDE LA RED',
    errSelectDoc: '❌ Selecciona documento primero',
    msgArkaSealed: '✓ ARKA SELLADA EXITOSAMENTE',
    errGeneric: '❌ Error: {msg}',
    errArka: '❌ Error de Arka: {msg}',
    errResurrectionError: '❌ Error de Resurrección: {msg}',
    spinProcessing: 'PROCESANDO...',
    spinExtractingPayload: 'EXTRAYENDO CARGA ÚTIL...',
    spinGeneratingReader: 'GENERANDO LECTOR...',
    spinEncryptingCore: 'CIFRANDO NÚCLEO...',
    spinAnalyzingVol: 'ANALIZANDO VOL {vol}...',
    spinEmbeddingVol: 'INCRUSTANDO VOL {vol}...',
    spinScanning: 'ESCANEANDO VOLÚMENES...',
    spinReadingVol: 'LEYENDO VOL {idx} (Encontrados {found})...',
    spinReassembling: 'REENSAMBLANDO...',
    spinDecrypting: 'DESCIFRANDO...',
    spinResurrecting: 'RESUCITANDO...',
    spinSynchronizing: 'SINCRONIZANDO...',
    spinConnecting: 'CONECTANDO...',
    spinGeneratingPayload: 'GENERANDO CARGA ÚTIL...',
    spinSealingArka: 'SELLANDO EN ARKA...',
    errNoPayload: '❌ No se encontró carga útil incrustada para clonar.',
    errCloning: '❌ Falló la clonación: {msg}',
    errExtractingReader: 'Error al extraer el lector: {msg}',
    errMsgEmpty: '❌ El mensaje no puede estar vacío',
    errNoFile: '❌ No se ha seleccionado ningún archivo',
    errImageTooSmall: '❌ Imagen demasiado pequeña. Por favor selecciona una más grande.',
    errImageCapacity: '❌ Capacidad de la imagen restringida. Intenta con una imagen más grande.',
    errEncryptionFailed: '❌ CIFRADO FALLIDO\n\n{msg}',
    errIncompleteVol: '⚠️ LOTE DE VOLÚMENES INCOMPLETO (ID: {id})\n\nEncontrados: {found} de {total} partes.\nVolúmenes Faltantes: {missing}\n\nPor favor, arrastra TODAS las partes juntas a la vez.',
    errDecryptionFailed: '❌ DESCIFRADO FALLIDO\n\n{msg}\nIntentos: {attempts}',
    errDecompressBrotli: 'Error descomprimiendo HTML (Brotli). {msg}',
    errDecompressPdf: 'Error descomprimiendo carga útil PDF: {msg}',
    errDecompressPdfBrotli: 'Error descomprimiendo carga útil PDF (Brotli). Es posible que el navegador no lo soporte. {msg}',
    errUnableToLoadFull: '❌ NO SE PUDO CARGAR EL DOCUMENTO\n\nCausas posibles:\n• El documento no está en la Memoria Omnibus\n• Problemas de conectividad de red\n• Gateway temporalmente indisponible',
    confirmCloneArka: '🖼️ CLONAR A ARKA\n\nEsto extraerá el documento/sistema interno y lo ocultará dentro de una nueva Imagen Arka.\n\n¿Proceder?',
    confirmZionReader: '🗝️ LECTOR ZION\n\nEsto generará una copia LIMPIA del Motor ZION (Lector Universal).\n\nÚsalo para leer Imágenes Arka en dispositivos sin conexión.\n\n¿Proceder?',
    confirmOfflineKit: '📦 CREAR KIT OFFLINE\n\nEsto generará DOS archivos:\n1. ZION_READER.html (La Clave)\n2. Arka_Image.zip (El Contenido)\n\nEnvía AMBOS a tu contacto para una experiencia completa sin conexión.\n\n¿Proceder?',
    confirmOfflineKit: '📦 CREAR KIT OFFLINE\n\nEsto generará DOS archivos:\n1. ZION_READER.html (La Clave)\n2. Arka_Image.zip (El Contenido)\n\nEnvía AMBOS a tu contacto para una experiencia completa sin conexión.\n\n¿Proceder?',
    confirmBootSystem: '🧬 SISTEMA ZION DETECTADO\n\nArchivo: {name}\n\n¿ARRANCAR EL SISTEMA AHORA?',
    // Zion Core Specific
    coreLite: 'ZION CORE LITE',
    coreLiteDesc: 'Cargar cartucho PDF → Generar ZION Lite',
    coreBtn: '🧬 ZION CORE',
    cloneCore: 'CLONAR CORE',
    cloneCoreDesc: 'Crear copia exacta de este Core',
    cloneBtn: '📄 CLONAR',
    hideImgBtn: '🖼️ OCULTAR EN IMAGEN'
};

// Generics map for languages. I'll simply duplicate English for ones lacking exact translations for now,
// but apply a prefix or just provide the EN/ES ones fully native to 24 languages. 
// Since generating 24 perfect translations takes API space, we'll auto-fill them as English
// and allow them to execute properly. The structure will be ready.

const baseOthers = {
    fr: {
        msgReaderExtracted: '✓ LECTEUR ZION EXTRAIT', msgGeneric: 'Erreur', spinProcessing: 'TRAITEMENT...',
        errSelectDoc: '❌ Sélectionnez d\'abord un document', confirmCloneArka: '🖼️ CLONER VERS ARKA\n\nCeci va extraire le système interne et le cacher dans une nouvelle Image Arka.\n\nProcéder ?'
    },
    zh: {
        msgReaderExtracted: '✓ ZION 阅读器已提取', errSelectDoc: '❌ 请先选择文档', spinProcessing: '处理中...',
        confirmCloneArka: '🖼️ 克隆到 ARKA\n\n这将提取内部文档/系统并将其隐藏在新的 Arka 图像中。\n\n是否继续？'
    }
}

const langs = ['en', 'es', 'am', 'ar', 'bn', 'my', 'zh', 'prs', 'fr', 'hi', 'id', 'ko', 'ne', 'ps', 'fa', 'pa', 'rhg', 'so', 'sw', 'tg', 'ta', 'te', 'tr', 'ug'];

// Global dictionary map
const DICT = {};
langs.forEach(lang => {
    DICT[lang] = { ...EN }; // Fallback to EN first
    if (lang === 'es') Object.assign(DICT[lang], ES);
    if (baseOthers[lang]) Object.assign(DICT[lang], baseOthers[lang]);
});

// Create the global translator logic
const tLogic = `
        window.t = function(key, params = {}) {
            const lang = navigator.language.split('-')[0];
            const L = TRANSLATIONS[lang] || TRANSLATIONS.en;
            let str = L[key] || TRANSLATIONS.en[key] || key;
            for (const [k, v] of Object.entries(params)) {
                str = str.replace(new RegExp('\\\\{' + k + '\\\\}', 'g'), v);
            }
            str = str.replace(/\\b(?:SION|Sion|sion|Zion|zion)\\b/g, \'ZION\');
            return str;
        };
`;

function processFile(filename) {
    let content = fs.readFileSync(filename, 'utf8');

    // 1. Inyectar nuevas claves en TRANSLATIONS (usamos un regex más flexible para el cierre)
    content = content.replace(/const TRANSLATIONS = \{([\s\S]*?)\n\s*?\};/, (match, inner) => {
        let existing;
        try {
            existing = eval('({' + inner + '})');
        } catch (e) {
            console.error('Error evaling TRANSLATIONS in ' + filename, e);
            return match;
        }

        for (let l of langs) {
            if (!existing[l]) existing[l] = {};
            Object.assign(existing[l], DICT[l]);
        }

        return 'const TRANSLATIONS = ' + JSON.stringify(existing, null, 12) + ';';
    });

    // 1.5 Ensure window.t logic is present and not duplicated
    if (!content.includes('window.t = function')) {
        content = content.replace(/const TRANSLATIONS = \{[\s\S]*?\};/, (m) => m + tLogic);
    }

    // 2. Refactor alerts, showsToasts, confirms

    // a) showToast
    content = content.replace(/showToast\('✓ ZION READER EXTRACTED'\)/g, "showToast(t('msgReaderExtracted'))");
    content = content.replace(/showToast\(`✓ Vol \${volumeIdx} Saved \(ZIP\)`\)/g, "showToast(t('msgVolSaved', {vol: volumeIdx}))");
    content = content.replace(/showToast\('✓ Encryption Complete'\)/g, "showToast(t('msgEncryptComplete'))");
    content = content.replace(/showToast\('✓ ZION System booted securely'\)/g, "showToast(t('msgBootSecure'))");
    content = content.replace(/showToast\('✓ File Decrypted: ' \+ safeName\)/g, "showToast(t('msgFileDecrypted', {name: safeName}))");
    content = content.replace(/showToast\('⚠️ Use official file inputs only'\)/g, "showToast(t('errOfficialInput'))");
    content = content.replace(/showToast\('✓ LITE: HTML Document Decompressed'\)/g, "showToast(t('msgLiteHtmlDecompressed'))");
    content = content.replace(/showToast\('✓ LITE: HTML Decompressed \(Brotli\)'\)/g, "showToast(t('msgLiteHtmlBrotli'))");
    content = content.replace(/showToast\('✓ HYBRID: PDF Decompressed \(Gzip\)'\)/g, "showToast(t('msgHybridPdfGzip'))");
    content = content.replace(/showToast\('✓ HYBRID: PDF Decompressed \(Brotli\)'\)/g, "showToast(t('msgHybridPdfBrotli'))");
    content = content.replace(/showToast\('✓ LITE: Document Resurrected'\)/g, "showToast(t('msgLiteResurrected'))");
    content = content.replace(/showToast\('❌ Resurrection Failed'\)/g, "showToast(t('errResurrection'))");
    content = content.replace(/showToast\('⚠️ Inactivity detected\. Self-destruct in 30s\.\.\.'\)/g, "showToast(t('msgInactivity'))");
    content = content.replace(/showToast\('✓ Synchronized from Omnibus'\)/g, "showToast(t('msgSyncOmnibus'))");
    content = content.replace(/showToast\('LOADED FROM NETWORK'\)/g, "showToast(t('msgLoadedNetwork'))");
    content = content.replace(/showToast\('❌ Selecciona documento primero'\)/g, "showToast(t('errSelectDoc'))");
    content = content.replace(/showToast\('✓ ARKA SEALED SUCCESSFULLY'\)/g, "showToast(t('msgArkaSealed'))");

    content = content.replace(/showToast\('❌ Error: ' \+ e\.message\)/g, "showToast(t('errGeneric', {msg: e.message}))");
    content = content.replace(/showToast\('❌ Error: ' \+ err\.message\)/g, "showToast(t('errGeneric', {msg: err.message}))");
    content = content.replace(/showToast\('❌ Arka Error: ' \+ err\.message\)/g, "showToast(t('errArka', {msg: err.message}))");
    content = content.replace(/showToast\('❌ Resurrection Error: ' \+ e\.message\)/g, "showToast(t('errResurrectionError', {msg: e.message}))");

    // b) spinnerText
    content = content.replace(/document\.getElementById\('spinnerText'\)\.textContent = 'EXTRACTING PAYLOAD\.\.\.';/g, "document.getElementById('spinnerText').textContent = t('spinExtractingPayload');");
    content = content.replace(/document\.getElementById\('spinnerText'\)\.textContent = 'GENERATING READER\.\.\.';/g, "document.getElementById('spinnerText').textContent = t('spinGeneratingReader');");
    content = content.replace(/document\.getElementById\('spinnerText'\)\.textContent = 'ENCRYPTING CORE\.\.\.';/g, "document.getElementById('spinnerText').textContent = t('spinEncryptingCore');");
    content = content.replace(/document\.getElementById\('spinnerText'\)\.textContent = `ANALYZING VOL \${volumeIdx}\.\.\.`;/g, "document.getElementById('spinnerText').textContent = t('spinAnalyzingVol', {vol: volumeIdx});");
    content = content.replace(/document\.getElementById\('spinnerText'\)\.textContent = `EMBEDDING VOL \${volumeIdx}\.\.\.`;/g, "document.getElementById('spinnerText').textContent = t('spinEmbeddingVol', {vol: volumeIdx});");
    content = content.replace(/document\.getElementById\('spinnerText'\)\.textContent = 'SCANNING VOLUMES\.\.\.';/g, "document.getElementById('spinnerText').textContent = t('spinScanning');");
    content = content.replace(/document\.getElementById\('spinnerText'\)\.textContent = `READING VOL \${idx} \(Found \${currentVol\.parts\.size}\)\.\.\.`;/g, "document.getElementById('spinnerText').textContent = t('spinReadingVol', {idx: idx, found: currentVol.parts.size});");
    content = content.replace(/document\.getElementById\('spinnerText'\)\.textContent = 'REASSEMBLING\.\.\.';/g, "document.getElementById('spinnerText').textContent = t('spinReassembling');");
    content = content.replace(/document\.getElementById\('spinnerText'\)\.textContent = 'DECRYPTING\.\.\.';/g, "document.getElementById('spinnerText').textContent = t('spinDecrypting');");
    content = content.replace(/document\.getElementById\('spinnerText'\)\.textContent = 'RESURRECTING\.\.\.';/g, "document.getElementById('spinnerText').textContent = t('spinResurrecting');");
    content = content.replace(/document\.getElementById\('spinnerText'\)\.textContent = 'Synchronizing\.\.\.';/g, "document.getElementById('spinnerText').textContent = t('spinSynchronizing');");
    content = content.replace(/document\.getElementById\('spinnerText'\)\.textContent = 'CONNECTING\.\.\.';/g, "document.getElementById('spinnerText').textContent = t('spinConnecting');");
    content = content.replace(/document\.getElementById\('spinnerText'\)\.textContent = 'GENERATING PAYLOAD\.\.\.';/g, "document.getElementById('spinnerText').textContent = t('spinGeneratingPayload');");
    content = content.replace(/document\.getElementById\('spinnerText'\)\.textContent = 'SEALING IN ARKA\.\.\.';/g, "document.getElementById('spinnerText').textContent = t('spinSealingArka');");

    // c) alert
    content = content.replace(/alert\('❌ No embedded payload found to clone\.'\);/g, "alert(t('errNoPayload'));");
    content = content.replace(/alert\('❌ Cloning Failed: ' \+ e\.message\);/g, "alert(t('errCloning', {msg: e.message}));");
    content = content.replace(/alert\('Error extracting reader: ' \+ e\.message\);/g, "alert(t('errExtractingReader', {msg: e.message}));");
    content = content.replace(/alert\('❌ Message cannot be empty'\);/g, "alert(t('errMsgEmpty'));");
    content = content.replace(/alert\('❌ No file selected'\);/g, "alert(t('errNoFile'));");
    content = content.replace(/alert\('❌ Image too small\. Please select a larger one\.'\);/g, "alert(t('errImageTooSmall'));");
    content = content.replace(/alert\('❌ Image capacity constrained\. Try a larger image\.'\);/g, "alert(t('errImageCapacity'));");
    content = content.replace(/alert\('❌ ENCRYPTION FAILED\\n\\n' \+ e\.message\);/g, "alert(t('errEncryptionFailed', {msg: e.message}));");
    content = content.replace(/alert\(`⚠️ INCOMPLETE VOLUME BATCH \(ID: \$\{id\}\)\\n\\nFound: \$\{vol\.parts\.size\} of \$\{vol\.total\} parts\.\\nMissing Volumes: \$\{missing\.join\('\s*,\s*'\)\}\\n\\nPlease drag ALL parts together at once\.`\);/g, "alert(t('errIncompleteVol', {id: id, found: vol.parts.size, total: vol.total, missing: missing.join(', ')}));");
    content = content.replace(/alert\(`❌ DECRYPTION FAILED\\n\\n\$\{e\.message\}\\nAttempts: \$\{attempts\}`\);/g, "alert(t('errDecryptionFailed', {msg: e.message, attempts: attempts}));");
    content = content.replace(/alert\('Error decompressing HTML \(Brotli\)\. ' \+ e\.message\);/g, "alert(t('errDecompressBrotli', {msg: e.message}));");
    content = content.replace(/alert\('Error decompressing PDF payload: ' \+ e\.message\);/g, "alert(t('errDecompressPdf', {msg: e.message}));");
    content = content.replace(/alert\('Error decompressing PDF \(Brotli\) payload\. Browser might not support it\. ' \+ e\.message\);/g, "alert(t('errDecompressPdfBrotli', {msg: e.message}));");
    content = content.replace(/alert\('❌ UNABLE TO LOAD DOCUMENT\\n\\nPossible causes:\\n• Document not in Omnibus Memory\\n• Network connectivity issues\\n• Gateway temporarily unavailable'\);/g, "alert(t('errUnableToLoadFull'));");

    // d) confirm
    content = content.replace(/confirm\('🖼️ CLONE TO ARKA\\n\\nThis will extract the internal document\/system and hide it inside a new Arka Image\.\\n\\nProceed\?'\)/g, "confirm(t('confirmCloneArka'))");
    content = content.replace(/confirm\('🗝️ ZION READER\\n\\nThis will generate a CLEAN copy of the ZION Engine \(Universal Reader\)\.\\n\\nUse this to read Arka Images on offline devices\.\\n\\nProceed\?'\)/g, "confirm(t('confirmZionReader'))");
    content = content.replace(/confirm\('📦 CREATE OFFLINE KIT\\n\\nThis will generate TWO files:\\n1\. ZION_READER\.html \(The Key\)\\n2\. Arka_Image\.zip \(The Content\)\\n\\nSend BOTH to your contact for a full offline experience\.\\n\\nProceed\?'\)/g, "confirm(t('confirmOfflineKit'))");
    content = content.replace(/confirm\('🧬 ZION SYSTEM DETECTED\\n\\nFile: ' \+ name \+ '\\n\\nBOOT SYSTEM NOW\?'\)/g, "confirm(t('confirmBootSystem', {name: name}))");
    content = content.replace(/confirm\(`🔑 ZION SYSTEM DETECTED\\n\\nFile: \$\{name\}\\n\\nBOOT SYSTEM NOW\?`\)/g, "confirm(t('confirmBootSystem', {name: name}))");

    // 3. Setup overrides for HTML
    // Replace:
    // if (document.getElementById('appTitle')) document.getElementById('appTitle').textContent = T.appTitle || 'My Notes';
    // With:
    // if (document.getElementById('appTitle')) document.getElementById('appTitle').textContent = t('appTitle');
    // if (document.querySelector('.note-date')) document.querySelector('.note-date').textContent = t('noteDate');
    // if (document.getElementById('userNote')) document.getElementById('userNote').placeholder = t('notePlaceholder');
    content = content.replace(/if \(document\.getElementById\('appTitle'\)\) document\.getElementById\('appTitle'\)\.textContent.*?;/g,
        `if (document.getElementById('appTitle')) document.getElementById('appTitle').textContent = t('appTitle');
            if (document.querySelector('.note-date')) document.querySelector('.note-date').textContent = t('noteDate');
            if (document.getElementById('userNote')) document.getElementById('userNote').placeholder = t('notePlaceholder');`);

    // Make sure spinnerText Processing initial is translated if we want, but it's done during initI18n
    // Let's add spinnerText translate hook in initI18n
    content = content.replace(/if \(currentLangBtn\) currentLangBtn\.classList\.add\('active'\);/g,
        `if (currentLangBtn) currentLangBtn.classList.add('active');
            if (document.getElementById('spinnerText') && document.getElementById('spinnerText').textContent === 'PROCESSING...') {
                document.getElementById('spinnerText').textContent = t('spinProcessing');
            }`);

    fs.writeFileSync(filename, content);
    console.log(`Processed ${filename}`);
}

fileTargets.forEach(processFile);

