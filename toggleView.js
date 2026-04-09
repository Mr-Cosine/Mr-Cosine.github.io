document.addEventListener("DOMContentLoaded", () => {
    const viewer = document.getElementById("rifle");
    const toggleBtn = document.getElementById("toggleViewBtn");

    let exploded = false;

    toggleBtn.addEventListener("click", () => {
        exploded = !exploded;

        viewer.src = exploded
            ? "asset/models/rifle_explode.glb"
            : "asset/models/rifle.glb";

        toggleBtn.textContent = exploded
            ? "Normal"
            : "Exploded";
    });
});
