// Lazy load the model when the viewer is in the viewport
document.addEventListener("DOMContentLoaded", () => {
  const viewer = document.querySelector('#myModel');
  if (!viewer) {
    console.warn("model-viewer element not found");
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        viewer.play();
      } else {
        viewer.pause();
      }
    });
  }, { threshold: 0.3});

  observer.observe(viewer);
});