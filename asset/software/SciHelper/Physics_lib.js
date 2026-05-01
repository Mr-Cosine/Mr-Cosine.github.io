const SVG_NS = "http://www.w3.org/2000/svg";
const CENTER = { x: 200, y: 200 };

// --- Helper Functions ---
function vectorAdd(v1, v2, mode) {
    if (v1.length !== v2.length) return "Error";
    if (mode === 'polar') {
        if(v1.length !== 2 || v2.length !== 2) return "Error";
        else return [   
                        Math.sqrt((v1[0]*Math.cos(v1[1]) + v2[0]*Math.cos(v2[1]))**2 + (v1[0]*Math.sin(v1[1]) + v2[0]*Math.sin(v2[1]))**2), 
                        Math.atan2(v1[0]*Math.sin(v1[1]) + v2[0]*Math.sin(v2[1]), v1[0]*Math.cos(v1[1]) + v2[0]*Math.cos(v2[1]))
                    ];
    }
    else {
        let r = [];
        for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
            r.push((v1[i] || 0) + (v2[i] || 0));
        }
        return r;
    }
}

function vectorSubtract(v1, v2, mode) {
    if (v1.length !== v2.length) return "Error";
    if (mode === 'polar') {
        if(v1.length !== 2 || v2.length !== 2) return "Error";
        else return [   
                        Math.sqrt((v1[0]*Math.cos(v1[1]) - v2[0]*Math.cos(v2[1]))**2 + (v1[0]*Math.sin(v1[1]) - v2[0]*Math.sin(v2[1]))**2), 
                        Math.atan2(v1[0]*Math.sin(v1[1]) - v2[0]*Math.sin(v2[1]), v1[0]*Math.cos(v1[1]) - v2[0]*Math.cos(v2[1]))
                    ];
    }
    else {
        let r = [];
        for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
            r.push((v1[i] || 0) - (v2[i] || 0))
        }
        return r;
    }
}

function vectorDot(v1, v2, mode) {
    if (v1.length !== v2.length) return "Error";
    if (mode === 'polar') {
        if(v1.length !== 2 || v2.length !== 2) return "Error";
        else return v1[0]*v2[0]*Math.cos(v1[1] - v2[1]);
    }
    else {
        let r = 0;
        for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
            r += (v1[i] || 0) * (v2[i] || 0);
        }
        return r;
    }
}

function vectorCross(v1, v2, mode) {
    if (v1.length > 3 || v2.length > 3 || v1.length !== v2.length) return "Error";
    if (mode === 'polar') {
        if(v1.length !== 2 || v2.length !== 2) return "Error";
        else return [0, 0, v1[0]*v2[0]*Math.sin(v2[1] - v1[1])];
    }
    else {
        if (v1.length !== v2.length) return "Error";
        else if(v1.length === 2 && v2.length === 2) return [0, 0, v1[0] * v2[1] - v1[1] * v2[0]];
        else return [
                        v1[1] * v2[2] - v1[2] * v2[1],
                        v1[2] * v2[0] - v1[0] * v2[2],
                        v1[0] * v2[1] - v1[1] * v2[0]
                    ];
    }
}

//============================================================================
// --- UI builders ---

// --- Main Physics Window ---
function openPhysWindow(outputLoc, parentWin) {
    if (document.getElementById('sci-phys')) return;

    let state_phys = {
        formula: false,
        vectorCalc: false,
        FBDCalc: false
    }
    
    var physWindow = document.createElement('div');
    physWindow.setAttribute('id', 'sci-phys');
    
    var physHeader = document.createElement('div');
    physHeader.setAttribute('id', 'sci-phys-header');
    physHeader.textContent = 'Physics Toolbox';
    physHeader.classList.add('no-select');

    var fnButtonContainer = document. createElement('div');
    fnButtonContainer.setAttribute('class', 'sci-phys-btncontainer');

    var btncolor = '#ba68c8';
    fnButtonContainer.appendChild(createFnBtn_phys('Formula Sheet', '📝', btncolor, "formula", state_phys, outputLoc));
    fnButtonContainer.appendChild(createFnBtn_phys('Vector Calculations', '↗️', btncolor, "vectorCalc", state_phys, outputLoc));
    fnButtonContainer.appendChild(createFnBtn_phys('FBD Visualization', '🧭', btncolor, "FBDCalc", state_phys, outputLoc));

    physWindow.appendChild(physHeader);
    physWindow.appendChild(fnButtonContainer);
    parentWin.appendChild(physWindow);

    return true;
}

function closePhysWindow() {
    let toolWindow = document.getElementsByClassName('sci-phys-tool');
    while (toolWindow.length > 0) {toolWindow[0].remove();}
    document.getElementById('sci-phys')?.remove();

    return false;
}

function createFnBtn_phys(name, symbol, color, id, state_phys, outputLoc) {
    var btn = document.createElement('button');
    btn.setAttribute('class', 'sci-phys-btn');
    btn.style.backgroundColor = '#f9f9f9'; // Default state
    btn.id = id;
    btn.color = color;

    var labelSpan = document.createElement('span');
    labelSpan.textContent = name;
        
    var symbolSpan = document.createElement('span');
    symbolSpan.setAttribute('class', 'sci-phys-btn-symbol');
    symbolSpan.style.color = color;
    symbolSpan.textContent = symbol;

    btn.append(labelSpan, symbolSpan);

    btn.addEventListener('click', function() {
        if (id === 'formula') {
            var existingWindow = document.getElementById('sci-phys-frml');
            if (!existingWindow) {openPhysFormulaWindow(outputLoc); state_phys.formula = true;}
            else {existingWindow.remove(); state_phys.formula = false;}
        }
        else if (id === 'vectorCalc') {
            var existingWindow = document.getElementById('sci-phys-vect');
            if (!existingWindow) {openVectorCalcWindow(outputLoc); state_phys.vectorCalc = true;}
            else {existingWindow.remove(); state_phys.vectorCalc = false;}
        }
        else if (id === 'FBDCalc') {
            var existingWindow = document.getElementById('sci-phys-fbd');
            if (!existingWindow) {openFBDCalcWindow(outputLoc); state_phys.FBDCalc = true;}
            else {existingWindow.remove(); state_phys.FBDCalc = false;}
        }
        refreshBtnDisp(btn.className, state_phys);
    });

    return btn;
}

/* --- Formula Sheet --- */

function openPhysFormulaWindow(outputLoc) {
    if (document.getElementById('sci-phys-frml')) return;

    var formulaWindow = document.createElement('div');
    formulaWindow.setAttribute('id', 'sci-phys-frml');
    formulaWindow.setAttribute('class', 'sci-phys-tool');

    var formulaHeader = document.createElement('div');
    formulaHeader.setAttribute('class', 'sci-phys-tool-header');
    formulaHeader.textContent = 'Formula Sheet';
    formulaHeader.classList.add('no-select');
    formulaWindow.appendChild(formulaHeader);

    var formulaContainer = document.createElement('div');
    formulaContainer.setAttribute('id', 'sci-phys-frml-content');
    
    let prevcategory = "";
    physFormulas.forEach((entry, i) => {
        if (entry.category !== prevcategory) {
            var categoryHeader = document.createElement('div');
            categoryHeader.setAttribute('class', 'sci-phys-frml-category');
            categoryHeader.textContent = entry.category + ":";
            formulaContainer.appendChild(categoryHeader);
            prevcategory = entry.category;
        }

        var row = document.createElement('div');
        row.setAttribute('class', 'sci-phys-frml-row');
        katex.render(entry.latex, row, { throwOnError: false, displayMode: false });
        row.rowID = i;
        row.addEventListener('click', () => {
            openCalculatorWindow(formulaWindow, entry, outputLoc);
        });
        formulaContainer.appendChild(row);
    });

    formulaWindow.appendChild(formulaContainer);
    document.body.appendChild(formulaWindow);
    makeDraggable(formulaHeader, formulaWindow);

    return formulaWindow;
}

function openCalculatorWindow (parentWindow, formula, outputLoc) {
    while(document.getElementById('sci-phys-frml-calc')) {document.getElementById('sci-phys-frml-calc').remove();}
    var calcWindow = document.createElement('div');
    calcWindow.setAttribute('id', 'sci-phys-frml-calc');

    var calcHeader = document.createElement('div');
    calcHeader.setAttribute('class', 'sci-phys-tool-header');
    calcHeader.textContent = formula.name;

    calcWindow.appendChild(calcHeader);

    formula.variables.forEach(variable => {
        var input = document.createElement('input');
        input.symbol = variable.symbol;
        input.placeholder = variable.symbol + (variable.unit ? " (" + variable.unit + ")" : "");
        if (variable.constant) {input.value = variable.constant;}
        input.setAttribute('class', 'sci-phys-frml-calc-input');
        input.addEventListener('input', () => {
            input.style.backgroundColor = 'white';
        });
        calcWindow.appendChild(input);
    });
    
    var solveBtn = document.createElement('button');
    solveBtn.textContent = 'Solve';
    solveBtn.setAttribute('class', 'sci-phys-frml-calc-solve');
    solveBtn.addEventListener('click', () => {
        if (document.querySelector('.sci-phys-frml-calc-alert')) document.querySelector('.sci-phys-frml-calc-alert').remove();
        let inputs = document.querySelectorAll('.sci-phys-frml-calc-input');

        let varValues = {};
        let emptyValues = {};

        inputs.forEach(input => {
            if (input.value === "") {
                emptyValues[input.symbol] = null;
                varValues[input.symbol] = null;
            }
            else {
                varValues[input.symbol] = parseFloat(input.value);
            }
        });

        if (Object.keys(emptyValues).length > 0 && Object.keys(emptyValues).length < 2) {
            let result = solveEq(varValues, formula.solve).toFixed(3);
            let targetVar = Array.from(inputs).find(input => input.symbol === Object.keys(emptyValues)[0]);
            targetVar.value = result;
            targetVar.style.backgroundColor = '#f3e8f7';
        }
        else {
            var alert = document.createElement('div');
            alert.setAttribute('class', 'sci-phys-frml-calc-alert');
            alert.textContent = "Please fill in exactly one variable to solve for.";
            calcWindow.appendChild(alert);
        }
    });
    calcWindow.appendChild(solveBtn);
    parentWindow.appendChild(calcWindow);
}

/* --- Vector Calculation --- */

function openVectorCalcWindow(outputLoc) {
    if (document.getElementById('sci-phys-vect')) return;
    var vectorWindow = document.createElement('div');
    vectorWindow.setAttribute('id', 'sci-phys-vect');
    vectorWindow.setAttribute('class', 'sci-phys-tool');

    var vectorHeader = document.createElement('div');
    vectorHeader.setAttribute('class', 'sci-phys-tool-header');
    vectorHeader.textContent = 'Vector Calculator';
    vectorHeader.classList.add('no-select');

    var modeContainer = document.createElement('div');
    modeContainer.setAttribute('class', 'sci-phys-vect-modecontainer');
    var modeLabel = document.createElement('span');
    modeLabel.setAttribute('class', 'sci-phys-vect-modecontainer-modelabel');
    modeLabel.textContent = "Coordinate System: ";
    modeContainer.appendChild(modeLabel);

    var mode = document.createElement('select');
    mode.append(new Option('Cartesian: (x, y)', 'cartesian'));
    mode.append(new Option('Polar(2D): (r, θ°)', 'polar'));
    mode.setAttribute('class', 'sci-phys-vect-modecontainer-mode');
    modeContainer.appendChild(mode);

    var vectorContainer1 = document.createElement('div');
    vectorContainer1.setAttribute('class', 'sci-phys-vect-vectcontainer');
    var vector1Label = document.createElement('span');
    vector1Label.setAttribute('class', 'sci-phys-vect-vectcontainer-vectlabel');
    vector1Label.textContent = "Vector 1: ";
    vectorContainer1.appendChild(vector1Label);

    var vector1 = document.createElement('input');
    vector1.placeholder = "(x1, x2, x3 ...)";
    vector1.setAttribute('class', 'sci-phys-vect-vectcontainer-vectinput');
    vectorContainer1.appendChild(vector1);

    var vectorContainer2 = document.createElement('div');
    vectorContainer2.setAttribute('class', 'sci-phys-vect-vectcontainer');
    vectorContainer2.style.borderBottom = "1px solid #ccc";
    vectorContainer2.style.marginBottom = "8px";
    vectorContainer2.style.paddingBottom = "16px";
    var vector2Label = document.createElement('span');
    vector2Label.setAttribute('class', 'sci-phys-vect-vectcontainer-vectlabel');
    vector2Label.textContent = "Vector 2: ";
    vectorContainer2.appendChild(vector2Label);

    var vector2 = document.createElement('input');
    vector2.placeholder = "(y1, y2, y3 ...)";
    vector2.setAttribute('class', 'sci-phys-vect-vectcontainer-vectinput');
    vectorContainer2.appendChild(vector2);

    var results = document.createElement('div');
    results.setAttribute('class', 'sci-phys-tool-result');
    results.textContent = "R = (r1, r2, r3...)";

    var operationBox = document.createElement('div');
    operationBox.setAttribute('class', 'sci-phys-vect-opcontainer');
    operationBox.addEventListener('click', ()=>{
        let v1 = vector1.value.replaceAll('(', '').replaceAll(')', '').split(',').map(Number);
        let v2 = vector2.value.replaceAll('(', '').replaceAll(')', '').split(',').map(Number);
        operationBox.v1 = v1;
        operationBox.v2 = v2;
    })

    var add = document.createElement('div');
    add.setAttribute('class', 'sci-phys-vect-opcontainer-op');
    add.textContent = 'A + B';
    operationBox.appendChild(add);
    add.addEventListener('click', () => {
        if (vector1.value === "" || vector2.value === "") {
            results.textContent = "Please enter both vectors.";
            return;
        }
        let R = vectorAdd(operationBox.v1, operationBox.v2, mode.value);
        if (Array.isArray(R)) results.textContent = "R = (" + R.join(', ') + ")";
        else results.textContent = "Error";
    });

    var subtract = document.createElement('div');
    subtract.setAttribute('class', 'sci-phys-vect-opcontainer-op');
    subtract.textContent = 'A - B';
    operationBox.appendChild(subtract);
    subtract.addEventListener('click', () => {
        if (vector1.value === "" || vector2.value === "") {
            results.textContent = "Please enter both vectors.";
            return;
        }
        let R = vectorSubtract(operationBox.v1, operationBox.v2, mode.value);
        if (Array.isArray(R)) results.textContent = "R = (" + R.join(', ') + ")";
        else results.textContent = "Error";
    });

    var dotProduct = document.createElement('div');
    dotProduct.setAttribute('class', 'sci-phys-vect-opcontainer-op');
    dotProduct.textContent = 'A ⋅ B';
    operationBox.appendChild(dotProduct);
    dotProduct.addEventListener('click', () => {
        if (vector1.value === "" || vector2.value === "") {
            results.textContent = "Please enter both vectors.";
            return;
        }
        let R = vectorDot(operationBox.v1, operationBox.v2, mode.value);
        if (typeof(R) === 'number') results.textContent = "R = " + R;
        else results.textContent = "Error";
    });

    var crossProduct = document.createElement('div');
    crossProduct.setAttribute('class', 'sci-phys-vect-opcontainer-op');
    crossProduct.textContent = 'A × B';
    operationBox.appendChild(crossProduct);
    crossProduct.addEventListener('click', () => {
        if (vector1.value === "" || vector2.value === "") {
            results.textContent = "Please enter both vectors.";
            return;
        }
        let R = vectorCross(operationBox.v1, operationBox.v2, mode.value);
        if (Array.isArray(R)) results.textContent = "R = (" + R.join(', ') + ")";
        else results.textContent = "Error";
    });

    operationBox.append(add, subtract, dotProduct, crossProduct);

    vectorWindow.append(vectorHeader, modeContainer, vectorContainer1, vectorContainer2, operationBox, results); 

    document.body.appendChild(vectorWindow);
    makeDraggable(vectorHeader, vectorWindow);
}

// --- FBD Calculation --- 
function openFBDCalcWindow(outputloc) {
    if (document.getElementById('sci-phys-fbd')) return;
    
    var fbdCalcWindow = document.createElement('div');
    fbdCalcWindow.setAttribute('id', 'sci-phys-fbd');
    fbdCalcWindow.setAttribute('class', 'sci-phys-tool');
    
    var fbdCalcHeader = document.createElement('div');
    fbdCalcHeader.setAttribute('class', 'sci-phys-tool-header');
    fbdCalcHeader.textContent = 'Free Body Diagram';
    fbdCalcHeader.classList.add('no-select');

    var inputBox = document.createElement('div');
    inputBox.setAttribute('id', 'sci-phys-fbd-input');

    inputBox.append(createFBDRow('F1'));
    inputBox.append(createFBDRow('F2'));

    var addrowBtn = document.createElement('button');
    addrowBtn.setAttribute('id', 'sci-phys-fbd-addrow')
    addrowBtn.textContent = '+';

    addrowBtn.addEventListener('click', () => {
        let currentRows = document.querySelectorAll('.sci-phys-fbd-row')
        let defaultName = 'F' + (currentRows.length + 1);
        inputBox.append(createFBDRow(defaultName));
    });

    const FBDvisualization = document.createElementNS(SVG_NS, 'svg');
    FBDvisualization.setAttribute('id', 'sci-phys-disp')
    FBDvisualization.setAttribute('viewBox', '0 0 400 400');

    var result = document.createElement('div');
    result.setAttribute('class', 'sci-phys-tool-result');
    result.textContent = "Net Force: --N @ --°";

    fbdCalcWindow.append(fbdCalcHeader, inputBox, addrowBtn, FBDvisualization, result);
    document.body.appendChild(fbdCalcWindow);
    makeDraggable(fbdCalcHeader, fbdCalcWindow);

    return fbdCalcWindow;
}

function createFBDRow(forceDefaultName) {
    var row = document.createElement('div');
    row.setAttribute('class', 'sci-phys-fbd-row');
    row.rowID = forceDefaultName;

    var name = document.createElement('input');
    name.setAttribute('class','sci-phys-fbd-row-name');
    name.placeholder = forceDefaultName;
    name.defaultName = forceDefaultName;

    var magnitude = document.createElement('input');
    magnitude.setAttribute('class','sci-phys-fbd-row-magnitude');
    magnitude.placeholder = "Magnitude";

    var direction = document.createElement('input');
    direction.setAttribute('class','sci-phys-fbd-row-direction');
    direction.placeholder = "Direction (°)";

    var removeBtn = document.createElement('button');
    removeBtn.setAttribute('class', 'sci-phys-fbd-row-remove');
    removeBtn.textContent = '⊝';
    removeBtn.buttonID = forceDefaultName;

    removeBtn.addEventListener('click', () => {
        let rowLst = document.getElementsByClassName(row.className);
        for (let existingRow of rowLst) {if (existingRow.rowID === removeBtn.buttonID) existingRow.remove();}
        updateFBDvisualization();
    })
    
    if (parseInt(forceDefaultName.replace('F', '')) <= 1) {
        removeBtn.disabled = true;
        removeBtn.style.visibility = 'hidden';
    }

    row.addEventListener('input', () => {let forces = updateFBDvisualization();});
    
    row.append(name, magnitude, direction, removeBtn);
    return row;
}

function updateFBDvisualization() {
    let inputs = document.body.querySelectorAll('.sci-phys-fbd-row');
    const canva = document.body.querySelector('#sci-phys-disp');
    
    let forces = [];
    let maxMagnitude = 0;
    for (let input of inputs) {
        let fname = (input.querySelector('[class$="-name"]').value)? input.querySelector('[class$="-name"]').value : input.querySelector('[class$="-name"]').placeholder;
        let fmagnitude = parseFloat(input.querySelector('[class$="-magnitude"]').value);
        let fdirection = parseFloat(input.querySelector('[class$="-direction"]').value);
        if (fmagnitude < 0) {fmagnitude = -1 * fmagnitude; fdirection = fdirection - 180;}
        while (fdirection > 360 || fdirection < 0) {fdirection += (fdirection > 0)? -360: 360;}

        if (isNum(fmagnitude) && isNum(fdirection)){
            forces.push({
                name:      fname,
                magnitude: fmagnitude,
                direction: fdirection,
                startx: CENTER.x,
                starty: CENTER.y
            });

            if (maxMagnitude < Math.abs(fmagnitude)) maxMagnitude = Math.abs(fmagnitude);
        }
    }
    
    if (forces.length > 0){
        canva.innerHTML = '';
        let netx = 0;
        let nety = 0;
        for (let force of forces){
            netx += force.magnitude * Math.cos(force.direction * Math.PI/180);
            nety += force.magnitude * Math.sin(force.direction * Math.PI/180);
        }

        let net = {
                'name': 'Fnet', 
                'magnitude': parseFloat((Math.sqrt(netx ** 2 + nety ** 2)).toFixed(3)), 
                'direction': parseFloat((Math.atan2(nety, netx) * 180/Math.PI).toFixed(3)),
                startx: CENTER.x,
                starty: CENTER.y
            };
        if (maxMagnitude < net.magnitude) maxMagnitude = net.magnitude;

        let result = document.querySelector('.sci-phys-tool-result')
        result.textContent = `Net Force: ${net.magnitude}N @ ${net.direction}°`;

        const SCALE = 200/maxMagnitude/1.2;

        const arrowgroup = document.createElementNS(SVG_NS, 'g');
        forces.forEach((force)=> {
            arrowgroup.appendChild(renderArrow(force, SCALE, '#444', 3, true));
        });
        if (forces.length > 1 && Math.abs(net.magnitude) > 0) {arrowgroup.appendChild(renderArrow(net, SCALE, '#ccc', 3, true));}

        canva.append(arrowgroup);

        const dot = document.createElementNS(SVG_NS, 'circle');
        dot.setAttribute('cx', CENTER.x); dot.setAttribute('cy', CENTER.y);
        dot.setAttribute('r', 6);
        dot.setAttribute('fill', '#444');
        canva.appendChild(dot);

        const reference = document.createElementNS(SVG_NS, 'g');
        reference.append(renderArrow({name: 'x⁺', magnitude: 20/SCALE, direction: 0, startx: 350, starty: 50}, SCALE, '#444', 2, false));
        reference.append(renderArrow({name: 'y⁺', magnitude: 20/SCALE, direction: 90, startx: 350, starty: 50}, SCALE, '#444', 2, false));
        const referencedot = document.createElementNS(SVG_NS, 'circle');
        referencedot.setAttribute('cx', 350); referencedot.setAttribute('cy', 50);
        referencedot.setAttribute('r', 3);
        referencedot.setAttribute('fill', '#444');
        reference.append(referencedot);
        canva.appendChild(reference);
    }
}

function renderArrow(force, SCALE, color, width, showMag = true) {
    let arrow = document.createElementNS(SVG_NS, 'g');

    const headLen = 5;
    const bodyLen = force.magnitude * SCALE - headLen;
    const sizefactor = width/3;

    const rad = -force.direction * Math.PI / 180;
    const perpRad = -force.direction * Math.PI/180 - Math.PI / 2;

    const tipx = force.startx + bodyLen*Math.cos(rad);
    const tipy = force.starty + bodyLen*Math.sin(rad);

    const arrowbody = document.createElementNS(SVG_NS, 'line');
    arrowbody.setAttribute('x1', force.startx); arrowbody.setAttribute('y1', force.starty); 
    arrowbody.setAttribute('x2', tipx ); arrowbody.setAttribute('y2', tipy);
    arrowbody.setAttribute('stroke', color); arrowbody.setAttribute('stroke-width', width);
    arrow.appendChild(arrowbody);

    const tip = { x: tipx + 2 * headLen * Math.cos(rad) * sizefactor, y: tipy + 2 * headLen * Math.sin(rad) * sizefactor };
    const baseLeft  = { x: tipx - headLen * Math.cos(perpRad) * sizefactor, y: tipy - headLen * Math.sin(perpRad) * sizefactor };
    const baseRight = { x: tipx + headLen * Math.cos(perpRad) * sizefactor, y: tipy + headLen * Math.sin(perpRad) * sizefactor };

    const head = document.createElementNS(SVG_NS, 'polygon');
    head.setAttribute('points', `${tip.x},${tip.y} ${baseLeft.x},${baseLeft.y} ${baseRight.x},${baseRight.y}`);
    head.setAttribute('fill', color);
    arrow.appendChild(head);

    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', tip.x);
    text.setAttribute('y', tip.y);
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', '600');
    if (Math.abs(force.direction) < 90 || Math.abs(force.direction) > 270) text.setAttribute('text-anchor', 'start');
        else if (Math.abs(force.direction) > 90 && Math.abs(force.direction) < 270) text.setAttribute('text-anchor', 'end');
        else text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');

    const direction = Math.abs(force.direction) % 360;
    let dy;

    if (direction === 90) {dy = '-1.2em';} 
    else if (direction === 270) {dy1 = '1.8em';} 
    else { dy = '0em';}

    text.innerHTML = `
        <tspan x="${tip.x}" dy="${dy}" fill="#444" font-size="12">${force.name}: ${showMag ? `${force.magnitude}N` : ''}
    `;

    arrow.appendChild(text);

    let info = null;
    let moveHandler = null;

    const collisionBox = document.createElementNS(SVG_NS, 'line');
    collisionBox.setAttribute('x1', force.startx); collisionBox.setAttribute('y1', force.starty); 
    collisionBox.setAttribute('x2', tipx ); collisionBox.setAttribute('y2', tipy);
    collisionBox.setAttribute('stroke', 'transparent'); collisionBox.setAttribute('stroke-width', 3*width);
    arrow.appendChild(collisionBox);

    collisionBox.addEventListener("mouseenter", (e) => {
        info = document.createElement('div');
        info.setAttribute("class", "sci-phys-fbd-disp-info")
        info.innerHTML = `
            <div style = "font-weight: bold; display: flex; flex-direction: row; gap: 5px;">${force.name}:
            <div style = "font-weight: normal">${force.magnitude}N @ ${force.direction}°
            </div></div>

            <ul>
            
                <li> Component-x: ${(force.magnitude * Math.cos(force.direction * Math.PI/180)).toFixed(3)}N </li> 
                <li> Component-y: ${(force.magnitude * Math.sin(force.direction * Math.PI/180)).toFixed(3)}N </li> 
            </ul>
        `
        document.body.appendChild(info);

        const updatePosition = (event) => {
            var rect = info.getBoundingClientRect();
            var shiftX = event.clientX - rect.left;
            var shiftY = event.clientY - rect.top;

            if (info) {
                info.style.left = (event.clientX + 15) + 'px';
                info.style.top = (event.clientY + 15) + 'px';
            }
        };
        
        updatePosition(e);
        
        moveHandler = updatePosition;
        document.addEventListener('mousemove', moveHandler);
    });

    collisionBox.addEventListener("mouseleave", () => {
        if (info) {
            info.remove();
            info = null;
        }
        if (moveHandler) {
            document.removeEventListener('mousemove', moveHandler);
            moveHandler = null;
        }
    });

    return arrow;
}