document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.altKey && e.code === 'KeyS') {
        const existingSci = document.querySelector('[id^="sci-"], [class^="sci-"]');
        if (!existingSci) {
            e.preventDefault();
            boot();
        }
    }
});

boot();