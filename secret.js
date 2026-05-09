const messages = [
    // Greetings
    "Hey! You must be a curious one. XD",
    "Nice intuition!",
    "Salutes.",
    "Good morning, good afternoon, and good evening!",
    "Bonjour, hello, and...你好!",
    "Hope you are having a good day! :D",

    // Gibberish
    "Big Andy is watching you.",
    "Water water water, Loo loo loo!",
    "Can someone tell Vedal there is a problem with my AI?",
    "Hey is someone there? I am trapped in this website!",
    "Dunno what to say, so have a great day~",
    "To wish upon the S.A.T.E.L.L.I.T.E.",
    "I left a gift for you...check your amazon and you will find a 0% off deal! :P",

    // Fun facts
    "My favourite music is Luminous Era by Laur. ;)",
    "I am a big fan of all kinds of hardcore EDMs, and I also love classical musics. That's why my favourite genres are Hard renaissance and J-artcore.",
    "My height unfortunately shrinked from 185 to 183 as I grew up... :C",
    "The time these messages last depends on their length.",
    "My name has a syllable that does not exist in English.",
    "My github name came from my steam account, f(x) = cos(x). Cuz my other two friends are sin(x) and conics.",
    "You can also call me: Jaki, Jackie, Jyachee, or... okay maybe just Andy."
];

document.addEventListener("DOMContentLoaded", () => {
    const name = document.querySelector('.clickable');
    const bar = document.getElementById('top-message');

    if (name) {
        name.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * messages.length);
            showMessage(messages[randomIndex]);
        });
    }
});

function showMessage(message) {
    let bar = document.getElementById('top-message');

    if (!bar) {
        bar = document.createElement('div');
        bar.setAttribute('id', 'top-message');
        document.body.appendChild(bar);
    }

    if (!bar || bar.style.opacity === '1') return; // prevent multiple clicks while message is visible
    bar.textContent = message;
    const timeoutsec = bar.textContent.length * 40 + 500;

    // fade in 
    bar.style.opacity = '1';
    // fade out after the timeout
    setTimeout(() => {
        bar.style.opacity = '0';
    }, timeoutsec);
}