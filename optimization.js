document.addEventListener("DOMContentLoaded", () => {
  const viewers = document.querySelectorAll("model-viewer");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play();
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.3 });

  viewers.forEach(viewer => observer.observe(viewer));
});