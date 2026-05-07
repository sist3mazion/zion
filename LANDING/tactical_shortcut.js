/**
 * Tactical System Cloning:
 * Fetches or clones the full landing page HTML and triggers a download.
 * The cloned file always starts from the initial landing page state.
 */
async function triggerTacticalShortcut() {
    const loaderStatus = document.getElementById('loaderStatus');
    const bootLoader   = document.getElementById('bootLoader');
    const filename     = 'ZION_PROJET.html';
    const url          = window.location.href;

    // Visual Feedback
    if (bootLoader) bootLoader.classList.add('active');
    if (loaderStatus) loaderStatus.innerText = `CLONING SYSTEM SOURCE...`;

    const triggerDownload = (content) => {
        const blob = new Blob([content], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    };

    try {
        // Method A: Get clean original source from network/cache
        const response = await fetch(url);
        if (!response.ok) throw new Error('FETCH_FAILED');
        const text = await response.text();
        triggerDownload(text);
        if (loaderStatus) loaderStatus.innerText = `✓ SYSTEM CLONED FROM SOURCE`;

    } catch (err) {
        console.warn("Network clone failed, using DOM fallback:", err);

        // Method B: DOM Fallback — reset UI to initial state before snapshot

        // 1. Collect current states to restore later
        const vaultModal  = document.getElementById('vaultModal');
        const specsPage   = document.getElementById('specsPage');
        const bootModal   = document.getElementById('bootModal');
        const scrollY     = window.scrollY;

        const vaultDisplay  = vaultModal  ? vaultModal.style.display   : null;
        const vaultActive   = vaultModal  ? vaultModal.classList.contains('active') : false;
        const specsDisplay  = specsPage   ? specsPage.style.display    : null;
        const specsActive   = specsPage   ? specsPage.classList.contains('active') : false;
        const bootDisplay   = bootModal   ? bootModal.style.display    : null;
        const bootActive    = bootModal   ? bootModal.classList.contains('active') : false;
        const blActive      = bootLoader  ? bootLoader.classList.contains('active') : false;

        // 2. Reset to initial landing state
        if (bootLoader)  bootLoader.classList.remove('active');
        if (vaultModal)  { vaultModal.classList.remove('active');  vaultModal.style.display  = 'none'; }
        if (specsPage)   { specsPage.classList.remove('active');   specsPage.style.display   = 'none'; }
        if (bootModal)   { bootModal.classList.remove('active');   bootModal.style.display   = 'none'; }
        window.scrollTo(0, 0);

        // 3. Capture clean DOM snapshot
        const cloneNode = document.documentElement.cloneNode(true);
        const injectedNodes = cloneNode.querySelectorAll('script[src], link[rel="stylesheet"], iframe, object');
        injectedNodes.forEach(el => el.remove());
        const htmlContent = '<!DOCTYPE html>\n' + cloneNode.outerHTML;

        // 4. Restore everything to how it was
        if (vaultModal) {
            vaultModal.style.display = vaultDisplay;
            if (vaultActive) vaultModal.classList.add('active');
        }
        if (specsPage) {
            specsPage.style.display = specsDisplay;
            if (specsActive) specsPage.classList.add('active');
        }
        if (bootModal) {
            bootModal.style.display = bootDisplay;
            if (bootActive) bootModal.classList.add('active');
        }
        if (bootLoader && blActive) bootLoader.classList.add('active');
        window.scrollTo(0, scrollY);

        triggerDownload(htmlContent);
        if (loaderStatus) loaderStatus.innerText = `✓ SYSTEM CLONED (OFFLINE)`;
    }

    setTimeout(() => {
        if (bootLoader) bootLoader.classList.remove('active');
    }, 2500);
}
