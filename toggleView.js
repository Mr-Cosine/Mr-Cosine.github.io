document.addEventListener("DOMContentLoaded", () => {
    const viewer = document.getElementById("rifle");
    const toggleBtn = document.getElementById("toggleViewBtn");
    const icon = document.querySelector(".Btnicon");

    let exploded = false;

    toggleBtn.addEventListener("click", () => {
        exploded = !exploded;

        viewer.src = exploded?
            "asset/models/rifle_explode.glb"
            : "asset/models/rifle.glb";

        icon.src = exploded? 
            'asset/images/exploded view icon.png'
            : 'asset/images/normal view icon.png';
        
        toggleBtn.title = exploded?
            "Change to Normal View"
            : "Change to Exploded View"
    });
});
