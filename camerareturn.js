function enableAutoResetForAll(defaultOrbit = "45deg 45deg 1m", delay = 2000) {
    const viewers = document.querySelectorAll("model-viewer");

    viewers.forEach(viewer => {
        let timer;

        const resetCamera = () => {
            viewer.cameraOrbit = viewer.dataset.defaultOrbit || defaultOrbit;
        };

        const restartTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(resetCamera, delay);
        };

        // Listen for user interactions
        viewer.addEventListener("mousedown", restartTimer);
        viewer.addEventListener("touchstart", restartTimer);
        viewer.addEventListener("wheel", restartTimer);
        viewer.addEventListener("pointermove", restartTimer);

        // Start initial timer
        restartTimer();
    });
}

window.addEventListener("DOMContentLoaded", () => {
    enableAutoResetForAll();
});
