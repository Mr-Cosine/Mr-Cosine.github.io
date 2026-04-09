function openPhysWindow(outputLoc, parentWin) {
    if (document.getElementById('sci-physpanel')) return;
    
    var physWindow = document.createElement('div');
    physWindow.setAttribute('id', 'sci-physpanel');
    
    var physHeader = document.createElement('div');
    physHeader.setAttribute('id', 'sci-physpanel-header');
    physHeader.textContent = 'Physics Toolbox';
    physHeader.classList.add('no-select');

    var fnButtonContainer = document. createElement('div');
    fnButtonContainer.setAttribute('class', 'sci-physpanel-btncontainer');

    var btncolor = '#ba68c8';
    fnButtonContainer.appendChild(Btn('Element Look-Up', '🔎', btncolor, outputLoc));

    physWindow.appendChild(physHeader);
    physWindow.appendChild(fnButtonContainer);
    parentWin.appendChild(physWindow);

    return true;
}