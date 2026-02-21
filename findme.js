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

    trigger.addEventListener("mouseenter", showList);
    trigger.addEventListener("mouseleave", hideList);

    list.addEventListener("mouseenter", showList);
    list.addEventListener("mouseleave", hideList);
});