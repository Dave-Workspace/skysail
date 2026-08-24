(function () {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    // Slightly longer timing
    const minShowMs = 450;      // was 200
    const maxWatchdogMs = 3500; // was 3000
    let shownAt = Date.now();

    // mark busy for a11y and prevent scroll
    document.body.classList.add('loading');
    document.documentElement.classList.add('loading'); // <— add to <html>
    document.getElementById('main-content')?.setAttribute('aria-busy', 'true');

    function hideLoader() {
        if (!loader || loader.classList.contains('hidden')) return;
        const elapsed = Date.now() - shownAt;
        const wait = Math.max(0, minShowMs - elapsed);
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
            document.documentElement.classList.remove('loading'); // <— remove from <html>
            document.getElementById('main-content')?.removeAttribute('aria-busy');
        }, wait);
    }

    document.addEventListener('calculator:ready', hideLoader, { once: true });
    window.addEventListener('load', () => setTimeout(hideLoader, 700), { once: true });
    setTimeout(hideLoader, maxWatchdogMs);
})();