document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.getElementById("contact");
    const list = document.getElementById("contact-list");

    let hideTimeout;

    const showList = () => {
        clearTimeout(hideTimeout);
        list.classList.add("show");
    };

    const hideList = () => {
        hideTimeout = setTimeout(() => {
            list.classList.remove("show");
        }, 200); // delay in ms — adjust to taste
    };

    let lockedOpen = false;

    trigger.addEventListener("mouseenter", () => {
        if (!lockedOpen) showList();
    });

    trigger.addEventListener("mouseleave", () => {
        if (!lockedOpen) hideList();
    });

    list.addEventListener("mouseenter", () => {
        if (!lockedOpen) showList();
    });

    list.addEventListener("mouseleave", () => {
        if (!lockedOpen) hideList();
    });

    trigger.addEventListener("click", () => {
        clearTimeout(hideTimeout);

        if (!lockedOpen) {
            lockedOpen = true;
            list.classList.add("show");
        } else {
            lockedOpen = false;
            list.classList.remove("show");
        }
    });

    document.addEventListener('click', (e) => { 
        clearTimeout(hideTimeout);
        if (!trigger.contains(e.target) && !list.contains(e.target)) { 
            hideList();
            lockedOpen = false;
        } 
    });
});