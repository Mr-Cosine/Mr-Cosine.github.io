// --- Put on textbox ---
function insertIntoWindow(target, text) {
    if (!text || !target) return;
    var start = target.selectionStart || target.value.length;
    var end = target.selectionEnd || target.value.length;
    target.value = target.value.slice(0, start) + text + target.value.slice(end);
    target.selectionStart = target.selectionEnd = start + text.length;
    target.focus();
}

// --- Drag logic ---
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

// --- Mode toggle buttons ---
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
    btn.setAttribute('class', 'sci-mainpanel-btn');
    btn.style.backgroundColor = 'white';
    btn.id = id;
    btn.color = color;

    var labelSpan = document.createElement('span');
    labelSpan.appendChild(document.createTextNode(label));
        
    var symbolSpan = document.createElement('span');
    symbolSpan.setAttribute('class', 'sci-mainpanel-btnsymbol');
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

    return btn;
}

function createSubMenuToggle(label, symbol, id, color, state, outputLoc, parentPanel) {
    var btn = document.createElement('button');
    btn.setAttribute('class', 'sci-mainpanel-btn');
    btn.style.backgroundColor = '#f9f9f9';
    btn.id = id;
    btn.color = color;

    var labelSpan = document.createElement('span');
    labelSpan.appendChild(document.createTextNode(label));
        
    var symbolSpan = document.createElement('span');
    symbolSpan.setAttribute('class', 'sci-mainpanel-btnsymbol');
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

    return btn;
}

function createCopyBtn(target) {
    var copyBtn = document.createElement('button');
    copyBtn.setAttribute('id', 'sci-mainpanel-copybtn');
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

function openInfo(outputLoc, parentpanel) {
    if (document.getElementById('sci-infopanel')) return;

    var infoBtn = document.getElementById('sci-mainpanel-info');
    var rect = infoBtn.getBoundingClientRect();

    var menuWin = document.createElement('div');
    menuWin.id = 'sci-infopanel'; // Updated ID
    menuWin.style.left = (rect.right + 2) + 'px';
    menuWin.style.top = rect.top + 'px';

    var header = document.createElement('div');
    header.className = 'sci-infopanel-header';
    header.style.cursor = 'default';
    header.textContent = 'MAPPING';
    
    var btnList = document.createElement('div');
    btnList.style.display = 'flex';
    btnList.style.flexDirection = 'column';

    function createMenuBtn(label, data) {
        var btn = document.createElement('button');
        btn.className = 'sci-infopanel-menubtn';
        btn.textContent = label;
        
        btn.onclick = () => {
            var freshRect = infoBtn.getBoundingClientRect();
            openInfoContent(label, data, freshRect.right + 2, freshRect.top, outputLoc, parentpanel); 
            menuWin.remove();
        };
        return btn;
    }

    // Populate using global objects
    btnList.appendChild(createMenuBtn('MATH', Object.entries(window.maths || {})));
    btnList.appendChild(createMenuBtn('GREEK', Object.entries(window.greeks || {})));
    btnList.appendChild(createMenuBtn('SUP/SUB', Object.entries(window.superscripts || {}).concat(Object.entries(window.subscripts || {}))));
    btnList.appendChild(createMenuBtn('SPECIAL', [['Deg', window.degree || '°'], ['Eq', window.equilibrium || '⇌']]));

    menuWin.append(header, btnList);
    document.body.appendChild(menuWin);
}

function openInfoContent(title, mapping, x, y, outputLoc, parentpanel) {
    var existingPage = document.getElementById('sci-infopanel-contentpage');
    if (existingPage) existingPage.remove();

    var contentWin = document.createElement('div');
    contentWin.id = 'sci-infopanel-contentpage';
    contentWin.style.left = x + 'px';
    contentWin.style.top = y + 'px';

    var header = document.createElement('div');
    header.className = 'sci-infopanel-contentpage-header';
    header.style.cursor = 'move';
    
    var titleSpan = document.createElement('span');
    titleSpan.className = 'sci-infopanel-contentpage-header-title';
    titleSpan.textContent = title;

    var closeBtn = document.createElement('button');
    closeBtn.className = 'sci-infopanel-contentpage-header-closebtn';
    closeBtn.textContent = '×';
    closeBtn.onclick = () => {
        contentWin.remove(); 
        openInfo(outputLoc, parentpanel);
    };

    header.append(titleSpan, closeBtn);

    var displayArea = document.createElement('div');
    displayArea.className = 'sci-infopanel-contentpage-scroll';

    mapping.forEach(([key, val]) => {
        var row = document.createElement('div');
        row.className = 'sci-infopanel-contentpage-scroll-row';

        var originalDiv = document.createElement('div');
        originalDiv.className = 'sci-infopanel-contentpage-scroll-row-original';
        originalDiv.textContent = key;

        var arrowDiv = document.createElement('div');
        arrowDiv.className = 'sci-infopanel-contentpage-scroll-row-arrow';
        arrowDiv.textContent = '→';

        var mappedDiv = document.createElement('div');
        mappedDiv.className = 'sci-infopanel-contentpage-scroll-row-mapped';
        mappedDiv.textContent = val;

        row.appendChild(originalDiv);
        row.appendChild(arrowDiv);
        row.appendChild(mappedDiv);

        row.onclick = () => {
                insertIntoWindow(outputLoc, val);
        };

        // Hover effects handled via CSS or JS (optional)
        displayArea.appendChild(row);
    });

    contentWin.append(header, displayArea);
    document.body.appendChild(contentWin);

    if (typeof makeDraggable === 'function') {
        makeDraggable(header, contentWin);
    }
}

function closeInfo() {
    document.getElementById('sci-infopanel-contentpage')?.remove();
    document.getElementById('sci-infopanel')?.remove();
}