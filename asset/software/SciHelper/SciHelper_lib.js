let state = {
    greek: false,
    superscript: false,
    subscript: false,
    math: false,
    chemistry: false,
    physics: false,
    general: false,
    info: false
};
    
let outputLoc = null;
let keyListener = null;

/* --- Booting --- */
function boot() {
    if (document.getElementById('sci-restore')) {document.getElementById('sci-restore').remove();}
    var restoreBtn = document.createElement('div');
    restoreBtn.id = 'sci-restore';
    restoreBtn.textContent = '⌬';
    restoreBtn.classList.add('no-select');
    restoreBtn.rcdx = 100; restoreBtn.rcdy = 100;

    let startTime;
    restoreBtn.addEventListener('mousedown', function() { startTime = Date.now(); });

    restoreBtn.addEventListener('mouseup', function() {
        let duration = Date.now() - startTime;

        if (duration < 150) { 
            initSciHelper(this.rcdx, this.rcdy);
            this.style.display = 'none';
        } 
    });

    restoreBtn.addEventListener('mouseenter', function() {
        cancelClose();
        openSettings(restoreBtn);
    });

    restoreBtn.addEventListener('mouseleave', function() {
        closeSettings();
    })

    makeDraggable(restoreBtn, restoreBtn);

    document.body.appendChild(restoreBtn);
}

/* --- Main SciHelper Window --- */
function initSciHelper(initx = 100, inity = 100) {    
    if (!document.body || document.getElementById('sci-panel')) return;

    Object.keys(state).forEach(key => { state[key] = false; });
        
    // --- UI Construction ---
    var panel = document.createElement('div');
    panel.setAttribute('id', 'sci-panel');
    panel.style.left = initx + 'px';
    panel.style.top = inity + 'px';

    var headerContainer = document.createElement('div');
    headerContainer.setAttribute('id', 'sci-panel-headercontainer');
        
    var header = document.createElement('div');
    header.setAttribute('id', 'sci-panel-header');
    header.textContent = 'Sci-Helper';
    header.classList.add('no-select');
        
    var closeBtn = document.createElement('button')
    closeBtn.setAttribute('id', 'sci-panel-closebtn');
    closeBtn.textContent = "×";
    closeBtn.classList.add('no-select');

    closeBtn.addEventListener('click', function() {closeSciHelper();});

    var characterBtnContainer = document.createElement('div');
    characterBtnContainer.setAttribute('class', 'sci-panel-btncontainer');
    var toolboxBtnContainer = document.createElement('div');
    toolboxBtnContainer.setAttribute('class', 'sci-panel-btncontainer');

    var outputBox = document.createElement('textarea');
    outputBox.setAttribute('id', 'sci-panel-output');
    outputBox.setAttribute('placeholder', 'Type symbols...');
    outputLoc = outputBox;

    var infoBtn = document.createElement('div');
    infoBtn.setAttribute('id', 'sci-panel-info');
    infoBtn.textContent = "🛈";
    infoBtn.classList.add('no-select');

    infoBtn.addEventListener('click', function () {
        if (state.info) {
            closeInfo();
            state.info = false;
        }
        else {
            openInfo(outputLoc);
            state.info = true;
        }
    });

    var specialCharacterTitle = document.createElement('div');
    specialCharacterTitle.setAttribute('class', 'sci-panel-sectiontitle');
    specialCharacterTitle.textContent = '▸ Special characters insertion:';

    characterBtnContainer.appendChild(createToggle('Suprscript', 'Xⁿ', 'superscript', '#e57373', state));
    characterBtnContainer.appendChild(createToggle('Subscript', 'Xₙ', 'subscript', '#ffaf4d', state));
    characterBtnContainer.appendChild(createToggle('Greek', 'αbγ', 'greek', '#81c784', state)); 
    characterBtnContainer.appendChild(createToggle('Math', '+-×÷', 'math', '#64b5f6', state)); 

    var toolboxTitle = document.createElement('div');
    toolboxTitle.setAttribute('class', 'sci-panel-sectiontitle');
    toolboxTitle.textContent = '▸ Toolboxes:';

    toolboxBtnContainer.appendChild(createSubMenuToggle('Chemistry', 'H₂O', 'chemistry', '#83c1bb', state, outputLoc, panel)); 
    toolboxBtnContainer.appendChild(createSubMenuToggle('Physics', 'F=ma', 'physics', '#ba68c8', state, outputLoc, panel));
    toolboxBtnContainer.appendChild(createSubMenuToggle('General', '⌬', 'general', '#cfe084', state, outputLoc, panel));

    headerContainer.append(header, closeBtn);
    panel.append(headerContainer, specialCharacterTitle, characterBtnContainer, toolboxTitle, toolboxBtnContainer, infoBtn, outputBox, createCopyBtn(outputBox));        
    document.body.appendChild(panel);

    makeDraggable(headerContainer, panel);

    if (keyListener) document.removeEventListener('keydown', keyListener);
    keyListener = function(e) {
        if (document.activeElement.tagName === 'INPUT' && 
            document.activeElement.id !== 'sci-panel-output') {
            return;
        }

        if (e.ctrlKey && e.altKey) {
            if (e.code === "KeyD") { insertIntoWindow(outputLoc, degree); e.preventDefault(); return; }
            if (e.code === "KeyE") { insertIntoWindow(outputLoc, equilibium); e.preventDefault(); return; }
        }

        if ((e.ctrlKey || e.altKey) === false) {
            var symbol = null;
            var key = e.key;

            if (state.superscript) {
                symbol = superscripts[key] || (e.code.startsWith("Digit") ? superscripts[e.code.replace("Digit", "")] : null);
            } else if (state.subscript) {
                symbol = subscripts[key] || (e.code.startsWith("Digit") ? subscripts[e.code.replace("Digit", "")] : null);
            } else if (state.greek) {
                symbol = greeks[key.toLowerCase()];
            } else if (state.math) {
                symbol = maths[key];
            }
                    
            if (symbol) { e.preventDefault(); insertIntoWindow(outputLoc, symbol); }
        }
    }
    document.addEventListener("keydown", keyListener, true);
}

function closeSciHelper() {  
    let panel = document.getElementById('sci-panel');          
    closeChemWindow();
    closeGenWindow();
    closeInfo();
    
    let restoreBtn = document.getElementById('sci-restore');
    restoreBtn.style.display = 'grid';

    var rect = document.getElementById('sci-panel').getBoundingClientRect();
    restoreBtn.rcdx = rect.right;
    restoreBtn.rcdy = rect.top;

    panel.remove();
    outputLoc = null;
}

/* --- Put on textbox --- */
function insertIntoWindow(target, text) {
    if (!text || !target) return;
    var start = target.selectionStart || target.value.length;
    var end = target.selectionEnd || target.value.length;
    target.value = target.value.slice(0, start) + text + target.value.slice(end);
    target.selectionStart = target.selectionEnd = start + text.length;
    target.focus();
}

/* --- Drag logic --- */
function makeDraggable(handle, target) {
    handle.addEventListener('mousedown', function(e) {
        var rect = target.getBoundingClientRect();
        var shiftX = e.clientX - rect.left;
        var shiftY = e.clientY - rect.top;
        function move(e) {
            target.style.left = e.clientX - shiftX + 'px';
            target.style.top = e.clientY - shiftY + 'px';
            target.style.right = 'auto';
        }
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', () => 
        document.removeEventListener('mousemove', move), { once: true }
        );
    });
}

/* --- Mode toggle buttons --- */
function refreshBtnDisp(classname, state) {
    var allBtns = document.getElementsByClassName(classname);
    for (let b of allBtns) {
        const active = state[b.id]; 
        b.style.backgroundColor = active ? b.color : 'white';
        b.style.color = active ? 'white' : 'black';
    }
}

function createToggle(label, symbol, id, color, state) {
    var btn = document.createElement('button');
    btn.setAttribute('class', 'sci-panel-btn');
    btn.style.backgroundColor = 'white';
    btn.id = id;
    btn.color = color;

    var labelSpan = document.createElement('span');
    labelSpan.appendChild(document.createTextNode(label));
        
    var symbolSpan = document.createElement('span');
    symbolSpan.setAttribute('class', 'sci-panel-btn-symbol');
    symbolSpan.style.color = color;
    symbolSpan.appendChild(document.createTextNode(symbol));

    btn.append(labelSpan, symbolSpan);

    btn.addEventListener('click', function() {
        state.superscript = (id === 'superscript') ? !state.superscript : false;
        state.subscript = (id === 'subscript') ? !state.subscript : false;
        state.greek = (id === 'greek') ? !state.greek : false;
        state.math = (id === 'math')  ? !state.math  : false;

        refreshBtnDisp(btn.className, state);
    });

    refreshBtnDisp(btn.className, state);

    return btn;
}

function createSubMenuToggle(label, symbol, id, color, state, outputLoc, parentPanel) {
    var btn = document.createElement('button');
    btn.setAttribute('class', 'sci-panel-btn');
    btn.style.backgroundColor = 'white';
    btn.id = id;
    btn.color = color;

    var labelSpan = document.createElement('span');
    labelSpan.appendChild(document.createTextNode(label));
        
    var symbolSpan = document.createElement('span');
    symbolSpan.setAttribute('class', 'sci-panel-btn-symbol');
    symbolSpan.style.color = color;
    symbolSpan.appendChild(document.createTextNode(symbol));

    btn.append(labelSpan, symbolSpan);
    
    btn.addEventListener('click', function() {
        if (id === 'chemistry') {
            state.chemistry = (state.chemistry === false) ? openChemWindow(outputLoc, parentPanel) : closeChemWindow();
        }
        else if (id === 'physics') {
            state.physics = (state.physics === false) ? openPhysWindow(outputLoc, parentPanel) : closePhysWindow();
        }
        else if (id === 'general') {
            state.general = (state.general === false) ? openGenWindow(outputLoc, parentPanel) : closeGenWindow();
        }
        refreshBtnDisp(btn.className, state);
    });

    refreshBtnDisp(btn.className, state);

    return btn;
}

function createCopyBtn(target) {
    var copyBtn = document.createElement('button');
    copyBtn.setAttribute('id', 'sci-panel-copybtn');
    copyBtn.textContent = 'COPY';

    copyBtn.addEventListener('click', function() {
        if (!target) return;

        var textToCopy = (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') 
                         ? target.value 
                         : target.textContent;

        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
            var originalText = copyBtn.textContent;
            copyBtn.textContent = 'COPIED!';
            copyBtn.style.backgroundColor = '#72c972';
            copyBtn.style.color = '#fff';
            
            setTimeout(() => { 
                copyBtn.textContent = originalText; 
                copyBtn.style.backgroundColor = '#fff';
                copyBtn.style.color = '#000';
            }, 1000);
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    });

    return copyBtn;
}

function openInfo(outputLoc) {
    while (document.getElementById('sci-info')) document.getElementById('sci-info').remove();

    var infoBtn = document.getElementById('sci-panel-info');

    var menuWin = document.createElement('div');
    menuWin.id = 'sci-info';

    var header = document.createElement('div');
    header.className = 'sci-info-header';
    header.style.cursor = 'default';
    header.textContent = 'MAPPING';
    
    var btnList = document.createElement('div');
    btnList.style.display = 'flex';
    btnList.style.flexDirection = 'column';

    function createMenuBtn(label, data) {
        var btn = document.createElement('button');
        btn.className = 'sci-info-menubtn';
        btn.textContent = label;
        
        btn.onclick = (e) => {
            e.stopPropagation();
            openInfoContent(label, data, menuWin, outputLoc); 
        };
        return btn;
    }

    btnList.appendChild(createMenuBtn('MATH', Object.entries(maths)));
    btnList.appendChild(createMenuBtn('GREEK', Object.entries(greeks)));
    btnList.appendChild(createMenuBtn('SUP/SUB', Object.entries(superscripts).concat(Object.entries(subscripts))));
    btnList.appendChild(createMenuBtn('SPECIAL', [
                                                    ['Ctrl + Alt + D', degree], 
                                                    ['Ctrl + Alt + E', equilibium]]));

    menuWin.append(header, btnList);
    infoBtn.appendChild(menuWin);

    menuWin.style.left = (- menuWin.offsetWidth - 2) + 'px';
    menuWin.style.top = '0px';
}

function openInfoContent(title, mapping, panel, outputLoc) {
    panel.innerHTML = ''; 
    
    var header = document.createElement('div');
    header.className = 'sci-info-content-header';
    header.style.cursor = 'move';
    
    var titleSpan = document.createElement('span');
    titleSpan.className = 'sci-info-content-header-title';
    titleSpan.textContent = title;

    var closeBtn = document.createElement('button');
    closeBtn.className = 'sci-info-content-header-closebtn';
    closeBtn.textContent = '×';
    closeBtn.onclick = () => {
        panel.remove();
    };

    header.append(titleSpan, closeBtn);

    var displayArea = document.createElement('div');
    displayArea.className = 'sci-info-content-scroll';

    mapping.forEach(([key, val]) => {
        var row = document.createElement('div');
        row.className = 'sci-info-content-scroll-row';

        var originalDiv = document.createElement('div');
        originalDiv.className = 'sci-info-content-scroll-row-original';
        originalDiv.textContent = key;

        var arrowDiv = document.createElement('div');
        arrowDiv.className = 'sci-info-content-scroll-row-arrow';
        arrowDiv.textContent = '→';

        var mappedDiv = document.createElement('div');
        mappedDiv.className = 'sci-info-content-scroll-row-mapped';
        mappedDiv.textContent = val;

        row.appendChild(originalDiv);
        row.appendChild(arrowDiv);
        row.appendChild(mappedDiv);

        row.onclick = (e) => {
            e.stopPropagation();
            insertIntoWindow(outputLoc, val);
        };

        displayArea.appendChild(row);
    });

    panel.append(header, displayArea);

    panel.style.left = (- panel.offsetWidth - 2) + 'px';
    panel.style.top = '0px';
}

function closeInfo() {
    document.getElementById('sci-info')?.remove();
}

/* --- Settings --- */
function openSettings(parent) {
    cancelClose();

    if (document.querySelector('.sci-bubble')) return;

    const initAngle = -90;
    const deviate = 40;
    const radius = 50;

    const bubbles = [
        createBubble('×', 'sci-bubble-close', "Turn off SciHelper", () => turnoff()),
        createBubble('⚙', 'sci-bubble-option', "Open options", () => openOptions()),
        createBubble('✉', 'sci-bubble-contact', "Reach to dev", () => openContact())
    ];

    bubbles.forEach((bubble, index) => {
        parent.appendChild(bubble);

        void bubble.offsetWidth;

        const angleRad = (initAngle + deviate * index) * Math.PI / 180;
        const dx = radius * Math.cos(angleRad);
        const dy = radius * Math.sin(angleRad);

        bubble.style.left = `calc(50% + ${dx}px)`;
        bubble.style.top = `calc(50% + ${dy}px)`;
        bubble.style.transform = 'translate(-50%, -50%)';
    });
}

function createBubble(text, id, description, clickHandler) {
    const bubble = document.createElement('div');
    bubble.className = 'sci-bubble';
    bubble.id = id;
    bubble.textContent = text;
    bubble.setAttribute('title', description);

    bubble.addEventListener('click', (e) => {
        e.stopPropagation();
        clickHandler();
    });
    
    bubble.addEventListener('mouseenter', () => cancelClose());
    bubble.addEventListener ('mouseleave', () => closeSettings());
    return bubble;
}

let closeTimeout = null;

function closeSettings() {
    if (closeTimeout) clearTimeout(closeTimeout);
    closeTimeout = setTimeout(() => {
        document.querySelectorAll('.sci-bubble').forEach(bubble => {
            bubble.remove()
        });
        closeTimeout = null;
    }, 300);
}

function cancelClose() {
    if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
    }
}

function turnoff() { document.querySelectorAll('[id^="sci-"], [class^="sci-"]').forEach(element => element.remove()); }

function openOptions() { browser.runtime.sendMessage({ action: 'openOptions' }); }

function openContact() { browser.runtime.sendMessage({ action: 'openContact' }); }