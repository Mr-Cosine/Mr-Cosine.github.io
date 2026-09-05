/* Fades sections in as they enter the viewport.
   The `js-reveal` flag is what actually hides them, and it is only set here —
   so with JS disabled, no IntersectionObserver, or reduced motion requested,
   nothing is ever hidden and the page reads normally.

   Loaded synchronously in <head> so the flag lands before first paint,
   which avoids a flash of the un-hidden content. */
(() => {
    const supported = "IntersectionObserver" in window;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!supported || reducedMotion) return;

    document.documentElement.classList.add("js-reveal");

    document.addEventListener("DOMContentLoaded", () => {
        const targets = document.querySelectorAll(".reveal");
        if (!targets.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0, rootMargin: "0px 0px -80px 0px" });
        // threshold 0 so cards taller than the viewport still trigger

        targets.forEach((el, i) => {
            // Stagger siblings slightly so a row of cards cascades in.
            el.style.transitionDelay = `${Math.min(i % 3, 2) * 90}ms`;
            observer.observe(el);
        });
    });
})();
