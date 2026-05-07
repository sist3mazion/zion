const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Configuration
const CONFIG = {
    pdfDir: path.join(__dirname, 'pdfs_input'),
    distDir: path.join(__dirname, 'dist_optimized'),
    templatePath: path.join(__dirname, 'ZION_LITE_BASE.html'),
    langs: [
        { code: 'ar', name: 'Arabic', nameEn: 'Arabic', rtl: true, file: 'Arabic_العربية.pdf' },
        { code: 'am', name: 'Amharic', nameEn: 'Amharic', rtl: false, file: 'Amharic_አማርኛ.pdf' },
        { code: 'bn', name: 'Bengali', nameEn: 'Bengali', rtl: false, file: 'Bengali_বাংলা.pdf' },
        { code: 'fa', name: 'Persian', nameEn: 'Persian/Farsi', rtl: true, file: 'Persian_فارسی.pdf' },
        { code: 'hi', name: 'Hindi', nameEn: 'Hindi', rtl: false, file: 'Hindi_हिन्दी.pdf' },
        { code: 'my', name: 'Burmese', nameEn: 'Burmese', rtl: false, file: 'Burmese_မြန်မာဘာသာ.pdf' },
        { code: 'ps', name: 'Pashto', nameEn: 'Pashto', rtl: true, file: 'Pashto_پښتو.pdf' },
        { code: 'zh', name: 'Chinese', nameEn: 'Chinese', rtl: false, file: 'Chinese_中文.pdf' },
        { code: 'prs', name: 'Dari', nameEn: 'Dari', rtl: true, file: 'Dari_دری.pdf' },
        { code: 'en', name: 'English', nameEn: 'English', rtl: false, file: 'English.pdf' },
        { code: 'fr', name: 'French', nameEn: 'French', rtl: false, file: 'French_Français.pdf' },
        { code: 'id', name: 'Indonesian', nameEn: 'Indonesian', rtl: false, file: 'Indonesian_Bahasa Indonesia.pdf' },
        { code: 'ko', name: 'Korean', nameEn: 'Korean', rtl: false, file: 'Korean_한국어.pdf' },
        { code: 'ne', name: 'Nepali', nameEn: 'Nepali', rtl: false, file: 'Nepali_नेपाली.pdf' },
        { code: 'pa', name: 'Punjabi', nameEn: 'Punjabi', rtl: false, file: 'Punjabi_ਪੰਜਾਬੀ.pdf' },
        { code: 'rhg', name: 'Rohingya', nameEn: 'Rohingya', rtl: true, file: 'Rohingya_Ruáingga.pdf' },
        { code: 'so', name: 'Somali', nameEn: 'Somali', rtl: false, file: 'Somali_Soomaali.pdf' },
        { code: 'es', name: 'Spanish', nameEn: 'Spanish', rtl: false, file: 'Spanish_Español.pdf' },
        { code: 'sw', name: 'Swahili', nameEn: 'Swahili', rtl: false, file: 'Swahili_Kiswahili .pdf' },
        { code: 'tg', name: 'Tajik', nameEn: 'Tajik', rtl: false, file: 'Tajik_Тоҷикӣ.pdf' },
        { code: 'ta', name: 'Tamil', nameEn: 'Tamil', rtl: false, file: 'Tamil_தமிழ்.pdf' },
        { code: 'te', name: 'Telugu', nameEn: 'Telugu', rtl: false, file: 'Telugu_తెలుగు.pdf' },
        { code: 'tr', name: 'Turkish', nameEn: 'Turkish', rtl: false, file: 'Turkish_Türkçe.pdf' },
        { code: 'ug', name: 'Uyghur', nameEn: 'Uyghur', rtl: true, file: 'Uyghur_ئۇيغۇرچە.pdf' }
    ]
};

// --- TRANSLATION DATABASE ---
const TRANSLATIONS = {
    en: {
        myNotes: "My Notes",
        editedJustNow: "Edited Just Now",
        writeSomething: "Write something...",
        verified: "VERIFIED",
        hide: "HIDE",
        nuke: "NUKE",
        trustSafety: "TRUST & SAFETY",
        encrypt: "ENCRYPT",
        decrypt: "DECRYPT",
        propagate: "PROPAGATE",
        initSystem: "Initializing System...",
        processing: "PROCESSING...",
        brand: "ZION SYSTEM"
    },
    es: {
        myNotes: "Mis Notas",
        editedJustNow: "Editado hace un momento",
        writeSomething: "Escribe algo...",
        verified: "VERIFICADO",
        hide: "OCULTAR",
        nuke: "BORRAR",
        trustSafety: "CONFIANZA Y SEGURIDAD",
        encrypt: "ENCRIPTAR",
        decrypt: "DESENCRIPTAR",
        propagate: "PROPAGAR",
        initSystem: "Inicializando Sistema...",
        processing: "PROCESANDO...",
        brand: "ZION SYSTEM"
    },
    fr: {
        myNotes: "Mes Notes",
        editedJustNow: "Modifié à l'instant",
        writeSomething: "Écrivez quelque chose...",
        verified: "VÉRIFIÉ",
        hide: "MASQUER",
        nuke: "EFFACER",
        trustSafety: "CONFIANCE & SÉCURITÉ",
        encrypt: "CHIFFRER",
        decrypt: "DÉCHIFFRER",
        propagate: "PROPAGER",
        initSystem: "Initialisation du système...",
        processing: "TRAITEMENT...",
        brand: "ZION SYSTEM"
    },
    ar: {
        myNotes: "ملاحظاتي",
        editedJustNow: "تم التعديل للتو",
        writeSomething: "اكتب شيئًا...",
        verified: "تم التحقق",
        hide: "إخفاء",
        nuke: "محو",
        trustSafety: "الثقة والأمان",
        encrypt: "تشفير",
        decrypt: "فك التشفير",
        propagate: "نشر",
        initSystem: "جاري تهيئة النظام...",
        processing: "جاري المعالجة...",
        brand: "نظام زيون"
    },
    am: {
        myNotes: "የእኔ ማስታወሻዎች",
        editedJustNow: "አሁን የተስተካከለ",
        writeSomething: "የሆነ ነገር ይጻፉ...",
        verified: "የተረጋገጠ",
        hide: "ደብቅ",
        nuke: "አጥፋ",
        trustSafety: "እምነት እና ደህንነት",
        encrypt: "ኢንክሪፕት",
        decrypt: "ዲክሪፕት",
        propagate: "አሰራጭ",
        initSystem: "ስርዓቱን በማስጀመር ላይ...",
        processing: "በማስኬድ ላይ...",
        brand: "ZION SYSTEM"
    },
    bn: {
        myNotes: "আমার নোট",
        editedJustNow: "এইমাত্র সম্পাদিত",
        writeSomething: "কিছু লিখুন...",
        verified: "যাচাইকৃত",
        hide: "লুকান",
        nuke: "মুছে ফেলুন",
        trustSafety: "বিশ্বাস ও নিরাপত্তা",
        encrypt: "এনক্রিপ্ট",
        decrypt: "ডিক্রিপ্ট",
        propagate: "ছড়িয়ে দিন",
        initSystem: "সিস্টেম চালু হচ্ছে...",
        processing: "প্রক্রিয়াধীন...",
        brand: "ZION SYSTEM"
    },
    fa: {
        myNotes: "یادداشت‌های من",
        editedJustNow: "همین حالا ویرایش شد",
        writeSomething: "چیزی بنویسید...",
        verified: "تایید شده",
        hide: "پنهان کردن",
        nuke: "پاکسازی",
        trustSafety: "اعتماد و امنیت",
        encrypt: "رمزگذاری",
        decrypt: "رمزگشایی",
        propagate: "انتشار",
        initSystem: "راه اندازی سیستم...",
        processing: "در حال پردازش...",
        brand: "سیستم زایون"
    },
    hi: {
        myNotes: "मेरे नोट्स",
        editedJustNow: "अभी संपादित किया गया",
        writeSomething: "कुछ लिखें...",
        verified: "सत्यापित",
        hide: "छिपाएं",
        nuke: "मिटाएं",
        trustSafety: "विश्वास और सुरक्षा",
        encrypt: "एन्क्रिप्ट",
        decrypt: "डिक्रिप्ट",
        propagate: "प्रसारित करें",
        initSystem: "सिस्टम आरंभ हो रहा है...",
        processing: "प्रक्रिया जारी है...",
        brand: "ZION SYSTEM"
    },
    my: {
        myNotes: "ကျွန်ုပ်၏ မှတ်စုများ",
        editedJustNow: "ယခုလေးတင် ပြင်ဆင်ပြီး",
        writeSomething: "တစ်ခုခု ရေးပါ...",
        verified: "စစ်ဆေးပြီး",
        hide: "ဖျောက်ပါ",
        nuke: "ဖျက်ပါ",
        trustSafety: "ယုံကြည်မှုနှင့် လုံခြုံရေး",
        encrypt: "စာဝှက်ပါ",
        decrypt: "စာဝှက်ဖြည်ပါ",
        propagate: "ဖြန့်ဝေပါ",
        initSystem: "စနစ် စတင်နေသည်...",
        processing: "လုပ်ဆောင်နေသည်...",
        brand: "ZION SYSTEM"
    },
    ps: {
        myNotes: "زما یادښتونه",
        editedJustNow: "همدا اوس ړنګ شو",
        writeSomething: "څه ولیکئ...",
        verified: "تایید شوی",
        hide: "پټول",
        nuke: "پاکول",
        trustSafety: "باور او خوندیتوب",
        encrypt: "کود کول",
        decrypt: "کود پرانیستل",
        propagate: "خپرول",
        initSystem: "سیستم پیل کیږي...",
        processing: "د پروسس په حال کې...",
        brand: "زیون سیستم"
    },
    zh: {
        myNotes: "我的笔记",
        editedJustNow: "刚刚编辑",
        writeSomething: "写点什么...",
        verified: "已验证",
        hide: "隐藏",
        nuke: "清除",
        trustSafety: "信任与安全",
        encrypt: "加密",
        decrypt: "解密",
        propagate: "传播",
        initSystem: "系统初始化...",
        processing: "处理中...",
        brand: "赛昂系统"
    },
    prs: {
        myNotes: "یادداشت‌های من",
        editedJustNow: "همین حالا ویرایش شد",
        writeSomething: "چیزی بنویسید...",
        verified: "تایید شده",
        hide: "پنهان کردن",
        nuke: "پاکسازی",
        trustSafety: "اعتماد و امنیت",
        encrypt: "رمزگذاری",
        decrypt: "رمزگشایی",
        propagate: "انتشار",
        initSystem: "راه اندازی سیستم...",
        processing: "در حال پردازش...",
        brand: "سیستم زایون"
    },
    id: {
        myNotes: "Catatan Saya",
        editedJustNow: "Baru saja diedit",
        writeSomething: "Tulis sesuatu...",
        verified: "TERVERIFIKASI",
        hide: "SEMBUNYIKAN",
        nuke: "HAPUS",
        trustSafety: "KEPERCAYAAN & KEAMANAN",
        encrypt: "ENKRIPSI",
        decrypt: "DEKRIPSI",
        propagate: "SEBARKAN",
        initSystem: "Memulai Sistem...",
        processing: "MEMPROSES...",
        brand: "ZION SYSTEM"
    },
    ko: {
        myNotes: "내 노트",
        editedJustNow: "방금 편집됨",
        writeSomething: "무언가를 쓰세요...",
        verified: "확인됨",
        hide: "숨기기",
        nuke: "삭제",
        trustSafety: "신뢰 및 보안",
        encrypt: "암호화",
        decrypt: "복호화",
        propagate: "전파",
        initSystem: "시스템 초기화 중...",
        processing: "처리 중...",
        brand: "ZION SYSTEM"
    },
    ne: {
        myNotes: "मेरा नोटहरू",
        editedJustNow: "भर्खरै सम्पादन गरिएको",
        writeSomething: "केही लेख्नुहोस्...",
        verified: "प्रमाणित",
        hide: "लुकाउनुहोस्",
        nuke: "मेटाउनुहोस्",
        trustSafety: "विश्वास र सुरक्षा",
        encrypt: "इन्क्रिप्ट",
        decrypt: "डिक्रिप्ट",
        propagate: "प्रचार गर्नुहोस्",
        initSystem: "प्रणाली सुरु हुँदैछ...",
        processing: "प्रक्रियामा...",
        brand: "ZION SYSTEM"
    },
    pa: {
        myNotes: "ਮੇਰੇ ਨੋਟਸ",
        editedJustNow: "ਹੁਣੇ ਸੰਪਾਦਿਤ ਕੀਤਾ",
        writeSomething: "ਕੁਝ ਲਿਖੋ...",
        verified: "ਤਸਦੀਕਸ਼ੁਦਾ",
        hide: "ਲੁਕਾਓ",
        nuke: "ਮਿਟਾਓ",
        trustSafety: "ਭਰੋਸਾ ਅਤੇ ਸੁਰੱਖਿਆ",
        encrypt: "ਏਨਕ੍ਰਿਪਟ",
        decrypt: "ਡਿਕ੍ਰਿਪਟ",
        propagate: "ਫੈਲਾਓ",
        initSystem: "ਸਿਸਟਮ ਚਾਲੂ ਹੋ ਰਿਹਾ ਹੈ...",
        processing: "ਕਾਰਵਾਈ ਜਾਰੀ ਹੈ...",
        brand: "ZION SYSTEM"
    },
    rhg: {
        myNotes: "Ar Nóot",
        editedJustNow: "Ehon toiyari gojjé",
        writeSomething: "Kisu lekó...",
        verified: "TOSDIK GOJJÉ",
        hide: "LUKAI FÉLO",
        nuke: "MIŚAI FÉLO",
        trustSafety: "BÔROŚA AR HÉFAZOT",
        encrypt: "ENCRYPT",
        decrypt: "DECRYPT",
        propagate: "FOLAI DO",
        initSystem: "System cálu gorér...",
        processing: "Kám colér...",
        brand: "ZION SYSTEM"
    },
    so: {
        myNotes: "Qoraaladayda",
        editedJustNow: "Hadda la bedelay",
        writeSomething: "Waxyar qor...",
        verified: "LA XAQIIJIYEY",
        hide: "QARI",
        nuke: "TIRTIR",
        trustSafety: "AAMINAAD & AMNIGA",
        encrypt: "QARI (ENCRYPT)",
        decrypt: "FUR (DECRYPT)",
        propagate: "FAAFIN",
        initSystem: "Nidaamka bilaabaya...",
        processing: "WAA LA WADAA...",
        brand: "ZION SYSTEM"
    },
    sw: {
        myNotes: "Maelezo Yangu",
        editedJustNow: "Imehaririwa Mda Huu",
        writeSomething: "Andika kitu...",
        verified: "IMETHIBITISHWA",
        hide: "FICHA",
        nuke: "FUTA",
        trustSafety: "IMANI & USALAMA",
        encrypt: "SIMBA (ENCRYPT)",
        decrypt: "FUMUA (DECRYPT)",
        propagate: "ENEZA",
        initSystem: "Mfumo Unaanza...",
        processing: "INACHAKATA...",
        brand: "ZION SYSTEM"
    },
    tg: {
        myNotes: "Қайдҳои ман",
        editedJustNow: "Ҳозир таҳрир шуд",
        writeSomething: "Чизе нависед...",
        verified: "ТАСДИҚ ШУД",
        hide: "ПИНҲОН КАРДАН",
        nuke: "ТОЗА КАРДАН",
        trustSafety: "БОВАРӢ ВА БЕХАТАРӢ",
        encrypt: "RAMZGUZORĪ",
        decrypt: "RAMZKUSHOĪ",
        propagate: "ПАҲН КАРДАН",
        initSystem: "Оғози система...",
        processing: "ДАР РАВАНД...",
        brand: "ZION SYSTEM"
    },
    ta: {
        myNotes: "என் குறிப்புகள்",
        editedJustNow: "இப்போது திருத்தப்பட்டது",
        writeSomething: "ஏதாவது எழுதுங்கள்...",
        verified: "சரிபார்க்கப்பட்டது",
        hide: "மறை",
        nuke: "அழி",
        trustSafety: "நம்பிக்கை & பாதுகாப்பு",
        encrypt: "ENCRYPT",
        decrypt: "DECRYPT",
        propagate: "பரப்பவும்",
        initSystem: "அமைப்பு தொடங்குகிறது...",
        processing: "செயலாக்கத்தில்...",
        brand: "ZION SYSTEM"
    },
    te: {
        myNotes: "నా గమనికలు",
        editedJustNow: "ఇప్పుడే సవరించబడింది",
        writeSomething: "ఏదో రాయండి...",
        verified: "నిర్ధారించబడింది",
        hide: "దాచు",
        nuke: "తొలగించు",
        trustSafety: "నమ్మకం & భద్రత",
        encrypt: "ENCRYPT",
        decrypt: "DECRYPT",
        propagate: "ప్రచారం చేయండి",
        initSystem: "సిస్టమ్ ప్రారంభమవుతోంది...",
        processing: "ప్రాసెసింగ్...",
        brand: "ZION SYSTEM"
    },
    tr: {
        myNotes: "Notlarım",
        editedJustNow: "Az önce düzenlendi",
        writeSomething: "Bir şeyler yaz...",
        verified: "DOĞRULANDI",
        hide: "GİZLE",
        nuke: "TEMİZLE",
        trustSafety: "GÜVEN & EMNİYET",
        encrypt: "ŞİFRELE",
        decrypt: "ŞİFRE ÇÖZ",
        propagate: "YAY",
        initSystem: "Sistem Başlatılıyor...",
        processing: "İŞLENİYOR...",
        brand: "ZION SYSTEM"
    },
    ug: {
        myNotes: "خاتىرىلىرىم",
        editedJustNow: "ھازىر تەھرىرلەندى",
        writeSomething: "بىر نەرسە يېزىڭ...",
        verified: "تەستىقلاندى",
        hide: "يوشۇرۇش",
        nuke: "تازىلاش",
        trustSafety: "ئىشەنچ ۋە بىخەتەرلىك",
        encrypt: "شىфىرلاش",
        decrypt: "شىфىر يېشىش",
        propagate: "تارقىتىش",
        initSystem: "سىستېما قوزغىلىۋاتىدۇ...",
        processing: "بىر تەرەپ قىلىنىۋاتىدۇ...",
        brand: "ZION SYSTEM"
    }
};

// --- PDF NATIVE COMPRESSION PIPELINE ---
async function renderPdfNative(pdfPath, langCode) {
    console.log(`\n📄 PROCESSING PDF: ${path.basename(pdfPath)}`);
    console.log(`   Mode: PDF Native (Gzip Compressed)`);
    console.log(`   Language: ${langCode.toUpperCase()}`);

    // 1. Read PDF as Binary
    console.log('   Reading PDF binary...');
    const pdfContent = fs.readFileSync(pdfPath);
    const originalSize = pdfContent.length;

    // 2. Compress with Gzip (Level 9)
    console.log('   Compressing (Gzip Level 9)...');
    const compressed = zlib.gzipSync(pdfContent, {
        level: 9
    });

    const ratio = (1 - compressed.length / originalSize) * 100;
    console.log(`   Original PDF:  ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Compressed:    ${(compressed.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Reduction:     ${ratio.toFixed(2)}%`);

    // Gzip optimization: If reduction is < 5%, use raw PDF to save client-side CPU
    if (ratio < 5) {
        console.log('   ⚠️ REDUCTION < 5%: Skipping GZIP to optimize client-side performance.');
        return {
            data: pdfContent.toString('base64'),
            type: 'pdf_raw_b64'
        };
    }

    return {
        data: compressed.toString('base64'),
        type: 'pdf_gzip_b64'
    };
}

async function build() {
    console.log('🚀 STARTING ZION BUILD (PDF Native Pipeline)...\n');

    // Ensure dist directory exists
    if (!fs.existsSync(CONFIG.distDir)) fs.mkdirSync(CONFIG.distDir);
    const liteDir = path.join(CONFIG.distDir, 'lite');
    if (!fs.existsSync(liteDir)) fs.mkdirSync(liteDir);

    // Read Template
    let template = fs.readFileSync(CONFIG.templatePath, 'utf8');

    // --- PREPARE WORKER INJECTION ---
    const workerPath = path.join(__dirname, 'pdf.worker.min.js');
    let workerB64 = "";
    if (fs.existsSync(workerPath)) {
        console.log("   Reading pdf.worker.min.js for injection...");
        const workerBuf = fs.readFileSync(workerPath);
        workerB64 = workerBuf.toString('base64');
        console.log(`   Worker Size: ${(workerBuf.length / 1024).toFixed(2)} KB (Base64: ${(workerB64.length / 1024).toFixed(2)} KB)`);
    } else {
        console.warn("   ⚠️ WARNING: pdf.worker.min.js NOT FOUND. Worker injection will fail.");
    }
    // Clean workerB64
    workerB64 = workerB64.replace(/[\r\n]/g, '');

    for (const lang of CONFIG.langs) {
        const pdfPath = path.join(CONFIG.pdfDir, lang.file);
        if (!fs.existsSync(pdfPath)) {
            console.error(`❌ PDF Not Found: ${pdfPath}`);
            continue;
        }

        try {
            // Process PDF (Native + Gzip)
            const result = await renderPdfNative(pdfPath, lang.code);
            console.log(`DEBUG: Generated Type for ${lang.code}: '${result.type}'`);

            // Inject into Template (Global Lite Mode)
            console.log(`   Injecting payload into ZION_LITE_${lang.code}.html...`);

            // 1. Inject Payload
            // CRITICAL: Escape </script> tags in Base64 payload to prevent HTML parsing errors
            const safePayload = result.data.replace(/<\/script>/gi, '<\\/script>').replace(/[\r\n]/g, '');

            // Fix 2: Use replaceAll for [[DOC_TYPE_HERE]] to catch any duplicate occurrences
            let finalHtml = template.replaceAll(
                '[[DOC_TYPE_HERE]]',
                result.type
            ).replace(
                '[[PAYLOAD_HERE]]',
                safePayload
            ).replace(
                '[[ZION_WORKER_B64_HERE]]',
                workerB64
            );

            // --- INJECT TRANSLATIONS ---
            const t = TRANSLATIONS[lang.code] || TRANSLATIONS['en']; // Fallback to EN if missing

            // Camouflage
            finalHtml = finalHtml.replace(/Min Notes/g, t.myNotes);
            finalHtml = finalHtml.replace(/My Notes/g, t.myNotes);
            finalHtml = finalHtml.replace('Edited Just Now', t.editedJustNow);
            finalHtml = finalHtml.replace('Write something...', t.writeSomething);

            // UI Header/Footer
            finalHtml = finalHtml.replace('VERIFIED', t.verified);
            finalHtml = finalHtml.replace('>HIDE<', `>${t.hide}<`); // Ensure we don't replace inside attributes
            finalHtml = finalHtml.replace('title="Hide Interface">HIDE<', `title="Hide Interface">${t.hide}<`);

            finalHtml = finalHtml.replace('>NUKE<', `>${t.nuke}<`);

            // Menu
            finalHtml = finalHtml.replace('🛡️ TRUST & SAFETY', `🛡️ ${t.trustSafety}`);
            finalHtml = finalHtml.replace('🔒 ENCRYPT', `🔒 ${t.encrypt}`);
            finalHtml = finalHtml.replace('🔓 DECRYPT', `🔓 ${t.decrypt}`);
            finalHtml = finalHtml.replace('🧬 PROPAGATE', `🧬 ${t.propagate}`);

            // System Messages (Boot/Spinner)
            finalHtml = finalHtml.replace('Initializing System...', t.initSystem);
            finalHtml = finalHtml.replace('PROCESSING...', t.processing);

            // Brand (optional, mainly for non-latin scripts if desired)
            if (t.brand !== "ZION SYSTEM") {
                finalHtml = finalHtml.replace(/ZION SYSTEM/g, t.brand);
            }

            // HTML Lang + Dir Attributes
            // Fix 3: Inject lang code AND dir="rtl" for RTL languages
            finalHtml = finalHtml.replace('<html lang="en">', `<html lang="${lang.code}">`); // base lang replacement
            if (lang.rtl) {
                // Inject dir="rtl" into the html tag for RTL scripts (ar, fa, prs, ps, rhg, ug)
                finalHtml = finalHtml.replace(`<html lang="${lang.code}">`, `<html lang="${lang.code}" dir="rtl">`);
            }

            const outFile = path.join(liteDir, `ZION_LITE_${lang.code}.html`);
            fs.writeFileSync(outFile, finalHtml);

            const finalSize = fs.statSync(outFile).size;
            console.log(`✅ BUILT: ${outFile}`);
            console.log(`   Final Size: ${(finalSize / 1024 / 1024).toFixed(2)} MB\n`);

        } catch (e) {
            console.error(`❌ Failed to build ${lang.code}:`, e);
        }
    }

    console.log('\n🎉 BUILD COMPLETE!');
}

build();
