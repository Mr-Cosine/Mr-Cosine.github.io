// --- Helper Functions ---
function f(x, polynomials) {let y = 0; for (let term of polynomials) { y += term.coeff * Math.pow(x, term.exp);} return y;};
function getBound(polynomials) {
    let an = Math.abs(polynomials[0].coeff);

    let maxOther = 0;
    for (let i = 1; i < polynomials.length; i++) {
        let val = Math.abs(polynomials[i].coeff);
        if (val > maxOther) maxOther = val;
    }
    return 1 + (maxOther / an);
}

function ddx(polynomials) {
    let derivedPoly = polynomials.map(term => ({
        coeff: term.coeff,
        exp: term.exp
    }));

    for (let term of derivedPoly) {
        let multiplier = term.exp;
        term.exp -= 1;
        term.coeff *= multiplier;
    }
    return derivedPoly.filter(term => term.exp !== -1 && term.coeff !== 0);
}

function solve(rawPolynomials, mandatoryNum = false) {
    const epsi = 0.000001;
    let result = [];
    let polynomials = [];
    let exactRoot = false;

    if (rawPolynomials.length === 0) return {'roots': ['blnk'], 'exactRoot': false};
    for (let term of rawPolynomials) {
        if (term.coeff === null || term.exp === null || term.coeff === "" || term.exp === "") return {'roots': ['blnk'], 'exactRoot': false};

        let c = parseFloat(term.coeff);
        let e = parseInt(term.exp);

        if (isNaN(c) || isNaN(e)) return {'roots': ['ilgl'], 'exactRoot': false};
        if (e > 40) return {'roots': ['big'], 'exactRoot': false};
        if (c !== 0) polynomials.push({ coeff: c, exp: e });
    }

    polynomials.sort((a, b) => b.exp - a.exp);

    if (polynomials[0].exp === 1 && !mandatoryNum) {result = getExactRoot(polynomials); exactRoot = true;}
    else if (polynomials[0].exp === 2 && !mandatoryNum) {result = getExactRoot(polynomials); exactRoot = true;}
    else {
        const range = getBound(polynomials);
        let derivative = ddx(polynomials);

        let x = -range; 
        let rangeCheck = [];
        while (x <= range) {
            let stepCoeff = Math.abs(f(x, derivative));
            let stepSize = 0.05/((stepCoeff < 0.5)? 0.5 : stepCoeff);
            let y1 = f(x, polynomials);
            let y2 = f(x + stepSize, polynomials);
            
            if (y1 * y2 <= 0) {
                rangeCheck.push({ lower: x, upper: x + stepSize });
            }
            x += stepSize;
        }

        for (let range of rangeCheck) {
            result.push(getRoot(range.lower, range.upper, epsi, polynomials));
        }
        exactRoot = false;
    }

    return {'roots': result, 'exactRoot': exactRoot};
}

function getExactRoot(polynomials) {
    polynomials.sort((a, b) => b.exp - a.exp);
    if (polynomials[0].exp <= 0 || polynomials[0].exp > 2) return 'err';

    let a = 0, b = 0, c = 0;

    for (let term of polynomials) {
        if (term.exp === 2) a += term.coeff;
        else if (term.exp === 1) b += term.coeff;
        else if (term.exp === 0) c += term.coeff;
    }

    if (a === 0) {
        if (b === 0) return [];
        else if (c === 0) return [0];
        else {let result = '-' + Math.abs(c).toString() + '/' + Math.abs(b).toString(); return (c*b < 0)? '-' + result: result;}
    }
    else {
        let sqrtContent = b**2 - 4 * a * c;
        if (sqrtContent < 0) return [];
        else if (sqrtContent === 0) return [0];

        else {
            let result = ' √ ' + sqrtContent + ((b<0)? ' - ' + Math.abs(b): ' + ' + Math.abs(b)).toString() + ' ) / ' + Math.abs(2*a).toString();

            function trimZero (expr) {
                return expr
                    .replace(/\s*[+-]\s*0\s*/g, '')
                    .replace(/^0\s*[+-]\s*/, '')
                    .replace(/[+-]\s*$/, '')
                    .replace(/\s*([+-])\s*/, '$1')
                    .trim();
            }

            result = trimZero(result);

            let result1 = result;
            let result2 = result;
            if (2*a < 0) {result1 = ' ( - ' + result1; result2 = " ( " + result2;}
            else {result1 = ' ( ' + result1; result2 = ' ( - ' + result2;}
            return [result1.replace(/\s/g, ''), result2.replace(/\s/g, '')];
        }
    }
}

function getRoot(lo, hi, epsi, polynomials) {
    let mid = (hi + lo)/2;
    if (Math.abs(f(mid, polynomials)) <= epsi || Math.abs(hi - lo) <= epsi) {
        return mid;
    }

    if (f(mid, polynomials) * f(lo, polynomials) > 0) {return getRoot(mid, hi, epsi, polynomials);}
    else {return getRoot(lo, mid, epsi, polynomials);}
}

function calculatePoints(expression, dimension, xrange, yrange, defaultStep) {
    function processExpr() {
        const regex = /(\d+(?:\.\d+)?)|([a-zA-Z]+)|([+\-*/^()])|(\s+)/g;
        const tokens = [];
        let match;
        while ((match = regex.exec(expression)) !== null) {
            if (match[4]) continue;
            if (match[1]) tokens.push(parseFloat(match[1]));
            else if (match[2]) tokens.push(match[2]);
            else if (match[3]) tokens.push(match[3]);
        }

        const rawTokens = tokens.filter(t => t !== " ").map(t => (typeof t === 'string' && t === 'X') ? 'x' : t);
        const ops = new operators();

        const unknownVar = new Set();
        for (let token of rawTokens) {
            if (!ops.isOperator(token) && typeof token === 'string' && !/^\d+$/.test(token)) {
                unknownVar.add(token);
            }
        }
        const varList = [...unknownVar]
        if (varList.length >= dimension) return ['INVALID'];
        if (dimension === 2 && varList.filter(v => (v.length > 1 || !(v.includes("x") || v.includes("X")))).length > 0) return ['INVALID'];
        if (dimension === 3 && varList.filter(v => (v.length > 1 || (!(v.includes("x") || v.includes("X")) && !(v.includes("y") || v.includes("Y"))))).length > 0) return ['INVALID'];

        return infixToPostfix(rawTokens);
    }

    const processedExpr = processExpr();
    if (processedExpr[0] === 'INVALID') return [];

    let points = [];

    const MIN_X = xrange[0], MAX_X = xrange[1];
    const MIN_Y = yrange[0], MAX_Y = yrange[1];
    if (!isNum(MIN_X) || !isNum(MAX_X) || MIN_X >= MAX_X) return null;
    if (!isNum(MIN_Y) || !isNum(MAX_Y) || MIN_Y >= MAX_Y) return null;

    if (dimension === 2) {
        const MAX_SLOPE = 1e6;
        const MAX_STEP = defaultStep / 10;
        const DEFAULT_STEP = defaultStep / 20;
        const MIN_STEP = defaultStep / 100;
        
        let prevValid = false;
        let prevX, prevY;
        let prevSlope = null;
        let step = DEFAULT_STEP;

        for (let xVal = MIN_X; xVal <= MAX_X + step / 2; xVal += step) {
            const postfixWithValues = processedExpr.map(tok =>
                (tok === 'x' || tok === 'X') ? xVal : tok
            );
            let yVal = evaluate(postfixWithValues);

            let currSlope = null;
            if (prevValid) currSlope = Math.abs((yVal - prevY) / (xVal - prevX));

            if (isNum(yVal)) {
                if (currSlope !== null && currSlope !== 0) { step = Math.min(MAX_STEP, Math.max(1 / currSlope * 0.1, MIN_STEP)); } 
                else step = DEFAULT_STEP;

                if (currSlope !== null && prevSlope !== null && currSlope > MAX_SLOPE && Math.abs(currSlope - prevSlope) > MAX_SLOPE) {
                    points.push({ x: NaN, y: NaN, z: NaN });
                    prevValid = false;
                    prevSlope = null;
                } 
                else prevSlope = currSlope;

                points.push({ x: xVal, y: yVal, z: NaN });
                prevX = xVal; prevY = yVal;
                prevValid = true;
            } 
            else {
                if (prevValid) points.push({ x: NaN, y: NaN, z: NaN });
                prevValid = false;
                prevSlope = null;
                step = DEFAULT_STEP;
            }
        }
        return {xrange: xrange, yrange: yrange, zrange: [0,0], points: points};
    } 
    else if (dimension === 3) {
        let step = defaultStep;

        let sampleIndex = 0;
        const SAMPLE_COUNT = 10000;
        let reservoir = new Array(SAMPLE_COUNT);

        for (let xVal = MIN_X; xVal <= MAX_X + step/2; xVal += step) {
            for (let yVal = MIN_Y; yVal <= MAX_Y + step/2;) {
                const postfixWithValues = processedExpr.map(tok => {
                    if (tok === 'x' || tok === 'X') return xVal;
                    else if (tok === 'y' || tok === 'Y') return yVal;
                    else return tok;
                });

                let zVal = evaluate(postfixWithValues);
                if (isNum(zVal)) {
                    points.push({ x: xVal, y: yVal, z: zVal });

                    if (sampleIndex < SAMPLE_COUNT) reservoir[sampleIndex] = zVal;
                    else {
                        const j = Math.floor(Math.random() * (sampleIndex + 1));
                        if (j < SAMPLE_COUNT) reservoir[j] = zVal;
                    }
                    sampleIndex++;
                }
                yVal += step
            }
        }

        reservoir = reservoir.slice(0, Math.min(sampleIndex, SAMPLE_COUNT)).sort((a,b) => a - b);
        zmax = reservoir[Math.round(reservoir.length * 0.95)];
        zmin = reservoir[Math.round(reservoir.length * 0.05)]

        return {xrange: xrange, yrange: yrange, zrange: [zmin, zmax], points: points};
    }
    else return null;
}

function plot(graph, overlay, plotter, expression, dimension, xrange, yrange, colorMap) {
    const MIN_X = parseFloat(xrange[0]);
    const MAX_X = parseFloat(xrange[1]);
    const MIN_Y = parseFloat(yrange[0]);
    const MAX_Y = parseFloat(yrange[1]);
    
    const gl = graph.getContext("webgl");
    const ctx = overlay.getContext("2d");

    const CANVAS_YSTART = 0;
    const CANVAS_YEND = overlay.height;
    const CANVAS_XSTART = 0;
    const CANVAS_XEND = overlay.width;
    const CANVAS_XCENTER = overlay.width/2;
    const CANVAS_YCENTER = overlay.height/2;

    function line(x1, y1, x2, y2, lineWidth = 1, color) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function XYaxis(lineWidth = 1, color = "#999") {
        function tickStep(range, desiredTickCount) { return range / desiredTickCount; }

        const tickStepX = tickStep(MAX_X - MIN_X, 10);
        const tickStepY = tickStep(MAX_Y - MIN_Y, 10);
        const tickLen = graph.width * 0.02;   
        ctx.fillStyle = "#ccc";
        ctx.font = `${graph.width * 0.03}px sans-serif`;
        const tickFontDeviate = graph.width * 0.02;

        const scaleX = overlay.width / (MAX_X - MIN_X);
        const scaleY = overlay.height / (MAX_Y - MIN_Y);

        function canvasX(x) {return (x - MIN_X) * scaleX; }
        function canvasY(y) { return CANVAS_YEND - (y - MIN_Y) * scaleY; }
        function realX(canvasX) { return canvasX / scaleX + MIN_X; }
        function realY(canvasY) { return (CANVAS_YEND - canvasY) / scaleY + MIN_Y; }

        let existedZero = false;
        // Y axis
        if (MIN_X * MAX_X < 0) {
            line(canvasX(0), CANVAS_YSTART, canvasX(0), CANVAS_YEND, lineWidth, color);

            ctx.textAlign = "middle";
            ctx.textBaseline = 'middle';
            if (canvasY(0) < CANVAS_YEND) {
                for (let y = canvasY(0); y <= CANVAS_YEND + tickStepY * scaleY / 2; y += tickStepY * scaleY) {
                    line(canvasX(0)- tickLen/2, y, canvasX(0)+ tickLen/2, y, lineWidth, color);
                    let val = realY(y);
                    if (Math.abs(Math.round(val) - val) < 1e-6) val = Math.round(val).toString();
                    else val = val.toFixed(2);
                    if (Math.abs(val) > 1e-6) ctx.fillText(val, canvasX(0) - tickFontDeviate, y)
                    else if (!existedZero) { ctx.fillText('0', canvasX(0) - tickFontDeviate, y + tickFontDeviate); existedZero = true; }
                    else continue;
                }
            }
            if (canvasY(0) > CANVAS_YSTART) {
                for (let y = canvasY(0); y >= CANVAS_YSTART - tickStepY * scaleY / 2; y -= tickStepY * scaleY) {
                    line(canvasX(0)- tickLen/2, y, canvasX(0)+ tickLen/2, y, lineWidth, color);
                    let val = realY(y);
                    if (Math.abs(Math.round(val) - val) < 1e-6) val = Math.round(val).toString();
                    else val = val.toFixed(2);
                    if (Math.abs(val) > 1e-6) ctx.fillText(val, canvasX(0) - tickFontDeviate, y)
                    else if (!existedZero) { ctx.fillText('0', canvasX(0) - tickFontDeviate, y + tickFontDeviate); existedZero = true; }
                    else continue;
                }
            }
        }
        ctx.textAlign = "left";
        ctx.textBaseline = 'top';
        ctx.fillText("y", CANVAS_XSTART + 10, CANVAS_YSTART + 10);

        // X axis
        if (MIN_Y * MAX_Y < 0) {
            line(CANVAS_XSTART, canvasY(0), CANVAS_XEND, canvasY(0), lineWidth, color);

            ctx.textAlign = "middle";
            ctx.textBaseline = 'top';
            if (canvasX(0) < CANVAS_XEND) {
                for (let x = canvasX(0); x <= CANVAS_XEND + tickStepX * scaleX / 2; x += tickStepX * scaleX) {
                    line(x, canvasY(0)- tickLen/2, x, canvasY(0)+ tickLen/2, lineWidth, color);
                    let val = realX(x);
                    if (Math.abs(Math.round(val) - val) < 1e-6) val = Math.round(val).toString();
                    else val = val.toFixed(2);
                    if (Math.abs(val) > 1e-6) ctx.fillText(val, x, canvasY(0) + tickFontDeviate);
                    else if (!existedZero) { ctx.fillText('0', x - tickFontDeviate, canvasY(0) + tickFontDeviate); xistedZero = true; }
                    else continue;
                }
            }
            if (canvasX(0) > CANVAS_XSTART) {
                for (let x = canvasX(0); x >= CANVAS_XSTART - tickStepX * scaleX / 2; x -= tickStepX * scaleX) {
                    line(x, canvasY(0)- tickLen/2, x, canvasY(0)+ tickLen/2, lineWidth, color);
                    let val = realX(x);
                    if (Math.abs(Math.round(val) - val) < 1e-6) val = Math.round(val).toString();
                    else val = val.toFixed(2);
                    if (Math.abs(val) > 0) ctx.fillText(val, x, canvasY(0) + tickFontDeviate);
                    else if (!existedZero) { ctx.fillText('0', x - tickFontDeviate, canvasY(0) + tickFontDeviate); xistedZero = true; }
                    else continue;
                }
            }
        }
        ctx.textAlign = "right";
        ctx.textBaseline = 'bottom';
        ctx.fillText("x", CANVAS_XEND - 10, CANVAS_YEND - 10);
    }

    function legend(min, zero, max) {
        const LEGEND_WIDTH = 60;
        const LEGEND_HEIGHT = 180;

        ctx.fillstyle = "#ffffff";
        ctx.fillRect(CANVAS_XEND - LEGEND_WIDTH, CANVAS_YSTART, LEGEND_WIDTH, LEGEND_HEIGHT);
    }

    function warning() {
        ctx.fillStyle = 'red';
        ctx.font = "20px sans-serif";
        ctx.textAlign = "middle";
        ctx.fillText('No valid points', CANVAS_XCENTER, CANVAS_YCENTER);
    }

    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    ctx.clearRect(CANVAS_XSTART, CANVAS_YSTART, CANVAS_XEND, CANVAS_YEND);

    if (expression && dimension && isNum(MIN_X) && isNum(MAX_X) && isNum(MIN_Y) && isNum(MAX_Y)) {
        const DESIRED_SAMPLE = Math.max(graph.width, graph.height);
        let xspan = [null, null]; let yspan = [null, null];

        xspan = [MIN_X, MAX_X];
        yspan = [MIN_Y, MAX_Y];
        let step = Math.min(Math.abs(yspan[1] - yspan[0]), Math.abs(xspan[1] - xspan[0]))/DESIRED_SAMPLE;
        let result = calculatePoints(expression, parseInt(dimension), xspan, yspan, step);
        
        const POINTS = (result.points)? result.points: [];

        if (POINTS.filter(p => isFinite(p.x) && isFinite(p.y)).length > 1) {
            const xrange = result.xrange;
            const yrange = result.yrange;
            const zrange = result.zrange;

            let positions = new Float32Array(POINTS.length * 3);
            for (let i = 0; i < POINTS.length; i++) {
                    positions[i*3]   = POINTS[i].x;
                    positions[i*3+1] = POINTS[i].y;
                    positions[i*3+2] = POINTS[i].z;
            }

            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            gl.enableVertexAttribArray(gl.getAttribLocation(plotter, 'a_pos'));
            gl.vertexAttribPointer(gl.getAttribLocation(plotter, 'a_pos'), 3, gl.FLOAT, false, 0, 0);

            gl.uniform2f(gl.getUniformLocation(plotter, 'u_xrange'), xrange[0], xrange[1]);
            gl.uniform2f(gl.getUniformLocation(plotter, 'u_yrange'), yrange[0], yrange[1]);
            
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, colorMap);

            gl.uniform1i(gl.getUniformLocation(plotter, 'u_colorMap'), 0);
            gl.uniform2f(gl.getUniformLocation(plotter, 'u_zrange'), zrange[0], zrange[1]);
            gl.uniform4f(gl.getUniformLocation(plotter, 'u_nanColor'), 0.25, 0.25, 0.25, 1.0);

            if (dimension === 2) gl.drawArrays(gl.LINE_STRIP, 0, POINTS.length);
            else gl.drawArrays(gl.POINTS, 0, POINTS.length);

            XYaxis();
            legend();
        }
        else { 
            XYaxis();
            warning(); 
        }
    }
    else {
        XYaxis();
        warning();
    }
}
//============================================================================
// --- UI builders ---

// --- Main General submenu ---
function openGenWindow(outputLoc, parentWin) {
    if (document.getElementById('sci-gen')) return;

    let state_gen = {
        polySolver: false,
        plotter: false
    }
    
    var genWindow = document.createElement('div');
    genWindow.setAttribute('id', 'sci-gen');
    
    var genHeader = document.createElement('div');
    genHeader.setAttribute('id', 'sci-gen-header');
    genHeader.textContent = 'General Toolbox';
    genHeader.classList.add('no-select');

    var fnButtonContainer = document. createElement('div');
    fnButtonContainer.setAttribute('class', 'sci-gen-btncontainer');

    var btncolor = '#cfe084';
    fnButtonContainer.appendChild(createFnBtn_gen('Polynomial solver', '🧮', btncolor, 'polySolver', outputLoc, state_gen));
    fnButtonContainer.appendChild(createFnBtn_gen('Function/data plotter', '📈', btncolor, 'plotter', outputLoc, state_gen))

    genWindow.appendChild(genHeader);
    genWindow.appendChild(fnButtonContainer);
    parentWin.appendChild(genWindow);

    return true;
}

function closeGenWindow() {
    let toolWindow = document.getElementsByClassName('sci-gen-tool');
    while (toolWindow.length > 0) {toolWindow[0].remove();}
    document.getElementById('sci-gen')?.remove();

    return false;
}

function createFnBtn_gen(name, symbol, color, id, outputLoc, state_gen) {
    var btn = document.createElement('button');
    btn.setAttribute('class', 'sci-gen-btn');
    btn.style.backgroundColor = '#f9f9f9';
    btn.id = id;
    btn.color = color;

    var labelSpan = document.createElement('span');
    labelSpan.textContent = name;
        
    var symbolSpan = document.createElement('span');
    symbolSpan.setAttribute('class', 'sci-gen-btn-symbol');
    symbolSpan.style.color = color;
    symbolSpan.textContent = symbol;

    btn.append(labelSpan, symbolSpan);

    btn.addEventListener('click', function() {
        switch (id) {
            case 'polySolver':
                var existingWindow = document.getElementById('sci-gen-poly');
                if (!existingWindow) {openPolyWindow(outputLoc); state_gen.polySolver = true;}
                else {existingWindow.remove(); state_gen.polySolver = false;}
                break;

            case 'plotter':
                var existingWindow = document.getElementById('sci-gen-plot');
                if (!existingWindow) {openPlotterWindow(outputLoc); state_gen.plotter = true;}
                else {existingWindow.remove(); state_gen.plotter = false;}
                break;
                
            default: break;
        }

        refreshBtnDisp(btn.className, state_gen);
    });

    return btn;
}

// --- Polynomials Solver ---
function openPolyWindow(outputLoc) {
    if (document.getElementById('sci-gen-poly')) return;

    var polyWindow = document.createElement('div');
    polyWindow.setAttribute('id', 'sci-gen-poly');
    polyWindow.setAttribute('class', 'sci-gen-tool');

    var header = document.createElement('div');
    header.setAttribute('class', 'sci-gen-tool-header');
    header.textContent = 'Polynomial solver';
    header.classList.add('no-select');  

    var inputContainer = document.createElement('div');
    inputContainer.setAttribute('class', 'sci-gen-poly-input');
    var rowID = 1;
    var row1 = createPolyInput('a' + rowID, 2); rowID++;
    var row2 = createPolyInput('a' + rowID, 1); rowID++;
    inputContainer.append(row1, row2);

    var addRowBtn = document.createElement('button');
    addRowBtn.setAttribute('id', 'sci-gen-poly-addrow');
    addRowBtn.textContent = '+';
    addRowBtn.addEventListener('click', function() {
        rowID = document.getElementsByClassName(row1.className).length + 1;
        inputContainer.append(createPolyInput('a' + rowID));
    });

    var solveBtn = document.createElement('button');
    solveBtn.setAttribute('id', 'sci-gen-poly-confirm');
    solveBtn.textContent = 'Solve polynomials';

    var result = document.createElement('div');
    result.setAttribute('class', 'sci-gen-tool-result');
    result.textContent = '𝑥 =';

    solveBtn.addEventListener('click', function() {
        result.textContent = '';
        let rows = document.getElementsByClassName(row1.className);
        let polynomials = [{coeff: parseFloat(-1 * row1.constant.value), exp: 0}];
        for (let row of rows) {
            let coefficient = row.coefficient.value;
            let exponent = row.exponent.value;
            polynomials.push({ coeff: coefficient, exp: exponent });
        }

        let {roots, exactRoot} = solve(polynomials);
        roots = roots.map(root => {
            if (isNum(root)) {
                let rounded = Math.round(root);
                if (Math.abs(rounded - root) < 1e-6) {
                    return rounded;
                }
                return root.toFixed(3);
            }
            else {
                return root;
            }
        });
            
        if (roots.length === 0) result.textContent = 'No real roots';
        else if (roots[0] == 'ilgl') result.textContent = 'Illegal characters present.';
        else if (roots[0] == 'big') result.textContent = 'Exponent too big.';
        else if (roots[0] == 'blnk') result.textContent = 'Incomplete expression, fill all blank spaces.';
        else {
            result.innerHTML = ''; 

            let textSpan = document.createElement('span');
            textSpan.textContent = '𝑥 = ' + roots.join(', ');
            result.appendChild(textSpan);

            if (exactRoot) {
                let changeform = document.createElement('div');
                changeform.setAttribute('class', 'sci-gen-poly-result-changeform');
                changeform.textContent = 'Num';
                
                let showingExact = true;

                changeform.addEventListener('click', function() {
                    showingExact = !showingExact;

                    let {roots, exactRoot} = solve(polynomials, !showingExact);
                        roots = roots.map(root => {
                            if (isNum(root)) {
                                let rounded = Math.round(root);
                                if (Math.abs(rounded - root) < 1e-6) {
                                    return rounded;
                                }
                                return root.toFixed(3);
                            }
                            else {
                                return root;
                            }
                        });

                    textSpan.textContent = '𝑥 = ' + roots.join(', ');
                    changeform.textContent = showingExact ? 'Num' : 'Exact';
                });

                result.appendChild(changeform);
            }
}
    });

    polyWindow.append(header, inputContainer, addRowBtn, solveBtn, result);
    makeDraggable(header, polyWindow);

    document.body.appendChild(polyWindow);

    return;
}

function createPolyInput(rowID, defaultExponent = 'n') {
    var row = document.createElement('div');
    row.setAttribute('class', 'sci-gen-poly-row');
    row.rowID = 'a' + rowID;

    var inputSection = document.createElement('div');
    inputSection.setAttribute('class', 'sci-gen-poly-row-section');

    var constant = document.createElement('input');
    constant.setAttribute('type', 'text');
    constant.setAttribute('placeholder', 'c');
    constant.setAttribute('class', 'sci-gen-poly-row-section-constant');
    
    var equalSign = document.createElement('span');
    equalSign.textContent = ' = ';
    equalSign.setAttribute('class', 'sci-gen-poly-row-section-equalsign');

    var coefficient = document.createElement('input');
    coefficient.setAttribute('type', 'text');
    coefficient.setAttribute('placeholder', rowID);
    coefficient.setAttribute('class', 'sci-gen-poly-row-section-coeff');

    var variable = document.createElement('span');
    variable.textContent = '𝑥';
    variable.setAttribute('class', 'sci-gen-poly-row-section-variable');

    var exponent = document.createElement('input');
    exponent.setAttribute('type', 'text');
    exponent.setAttribute('placeholder', 'n');
    exponent.setAttribute('class', 'sci-gen-poly-row-section-exponent');
    if (defaultExponent !== 'n') {exponent.value = defaultExponent;}


    var removeBtn = document.createElement('button');
    removeBtn.setAttribute('class', 'sci-gen-poly-row-remove');
    removeBtn.textContent = '⊝';
    removeBtn.buttonID = 'a' + rowID;

    removeBtn.addEventListener('click', () => {
        let rowLst = document.getElementsByClassName(row.className);
        for (let existingRow of rowLst) {if (existingRow.rowID === removeBtn.buttonID) existingRow.remove();}
    })

    if (Number(rowID.slice(1)) >= 2) {
        constant.style.visibility = 'hidden'; constant.disabled = true;
        equalSign.textContent = '+';
    }
    else {
        removeBtn.style.visibility = 'hidden'; removeBtn.disabled = true;
    }

    row.constant = constant;
    row.coefficient = coefficient;
    row.exponent = exponent;
    
    inputSection.append(constant, equalSign, coefficient, variable, exponent);
    row.append(inputSection, removeBtn);

    return row;
}

function openPlotterWindow(outputLoc) {
    if (document.getElementById('sci-gen-plot')) return;

    var plotWindow = document.createElement('div');
    plotWindow.setAttribute('id', 'sci-gen-plot');
    plotWindow.setAttribute('class', 'sci-gen-tool');

    var header = document.createElement('div');
    header.setAttribute('class', 'sci-gen-tool-header');
    header.textContent = 'Function/Data Plotter';
    header.classList.add('no-select');

    var inputSection = document.createElement('div');
    inputSection.setAttribute('id', 'sci-gen-plot-input')

    var functionInput = document.createElement('div');
    functionInput.setAttribute('id', 'sci-gen-plot-input-function')
    var dimension = document.createElement('select');
    dimension.setAttribute('id', 'sci-gen-plot-input-function-dim');
    let options = [
        {text: 'f(x) =', value: 2},
        {text: 'f(x,y) =', value: 3}
    ];
    options.forEach(opt => {
        let el = document.createElement('option');
        el.text = opt.text;
        el.value = opt.value;
        dimension.appendChild(el);
    });
    var expression = document.createElement('input');
    expression.setAttribute('id', 'sci-gen-plot-input-function-expr');
    var inputConfirm = document.createElement('div');
    inputConfirm.setAttribute('id', 'sci-gen-plot-input-function-confirm')
    inputConfirm.textContent = "Plot";
    functionInput.append(dimension, expression, inputConfirm);

    var rangeInput = document.createElement('div');
    rangeInput.setAttribute('id', 'sci-gen-plot-input-range');
    var xrange = document.createElement('div');
    xrange.setAttribute('class', 'sci-gen-plot-input-range-var');
    xrange.setAttribute("id", "x");
    var xlabel = document.createElement('div');
    xlabel.setAttribute('class',  'sci-gen-plot-input-range-label');
    xlabel.textContent = 'x range:';
    var xmin = document.createElement('input');
    xmin.setAttribute('class',  'sci-gen-plot-input-range-min');
    xmin.value = "-10";
    xmin.type = "number";
    var xmax = document.createElement('input');
    xmax.setAttribute('class',  'sci-gen-plot-input-range-max');
    xmax.value = "10";
    xmax.type = "number";
    var connlabel = document.createElement('div');
    connlabel.setAttribute('class', 'sci-gen-plot-input-range-label');
    connlabel.textContent = '~';

    var yrange = document.createElement('div');
    yrange.setAttribute('class', 'sci-gen-plot-input-range-var');
    yrange.setAttribute('id', 'y');
    var ylabel = document.createElement('div');
    ylabel.setAttribute('class',  'sci-gen-plot-input-range-label');
    ylabel.textContent = 'y range:';
    var ymin = document.createElement('input')
    ymin.setAttribute('class',  'sci-gen-plot-input-range-min');
    ymin.value = "-10";
    ymin.type = "number";
    var ymax = document.createElement('input');
    ymax.setAttribute('class',  'sci-gen-plot-input-range-max');
    ymax.value = "10";
    ymax.type = "number";

    xrange.append(xlabel, xmin, connlabel.cloneNode(true), xmax);
    yrange.append(ylabel, ymin, connlabel.cloneNode(true), ymax);

    rangeInput.append(xrange, yrange);
    
    inputSection.append(functionInput, rangeInput);
    

    var graphSection = document.createElement('div');
    graphSection.setAttribute('id', 'sci-gen-plot-canvas');

    const graph = document.createElement('canvas');
    graph.setAttribute('id', 'sci-gen-plot-canvas-canvas');
    graph.setAttribute('width', '840');
    graph.setAttribute('height', '840');
    const gl = graph.getContext('webgl');
    gl.viewport(0, 0, graph.width, graph.height);

    const overlay2D = document.createElement('canvas');
    overlay2D.setAttribute('id', 'sci-gen-plot-canvas-overlay');
    overlay2D.setAttribute('width', '840');
    overlay2D.setAttribute('height', '840');
    const ctx = overlay2D.getContext('2d');

    graphSection.append(graph, overlay2D);

    const VSHADER_CODE = `
        uniform vec2 u_xrange;
        uniform vec2 u_yrange;
        uniform vec2 u_canvadim;

        attribute vec3 a_pos;

        varying float v_z;

        void main() {
            float ncdX = (a_pos.x - u_xrange.x) / (u_xrange.y - u_xrange.x) * 2.0 - 1.0;
            float ncdY = (a_pos.y - u_yrange.x) / (u_yrange.y - u_yrange.x) * 2.0 - 1.0;

            v_z = a_pos.z;
            gl_Position = vec4(vec2(ncdX, ncdY), 0.0, 1.0);
            gl_PointSize = 2.0;
        }
    `;

    const FSHADER_CODE = `
        precision mediump float;
        varying float v_z;
        uniform sampler2D u_colorMap;
        uniform vec2 u_zrange;
        uniform vec4 u_nanColor;

        void main() {
            if (v_z != v_z) { gl_FragColor = u_nanColor; return;}

            float t = (v_z - u_zrange.x) / (u_zrange.y - u_zrange.x);
            t = clamp(t, 0.0, 1.0);
            gl_FragColor = texture2D(u_colorMap, vec2(t, 0.5));
        }
    `;

    // Compile a shader from source string
    function compileShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    const PLOTTER = gl.createProgram();
    gl.attachShader(PLOTTER, compileShader(gl, VSHADER_CODE, gl.VERTEX_SHADER));
    gl.attachShader(PLOTTER, compileShader(gl, FSHADER_CODE, gl.FRAGMENT_SHADER));
    gl.linkProgram(PLOTTER);
    gl.useProgram(PLOTTER);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    const VIRIDIS_GLTEXTURE = (new viridisPlot()).createGLTexture(gl);

    inputConfirm.addEventListener('click', ()=>{ 
        plot(graph, overlay2D, PLOTTER, expression.value, dimension.value, [xmin.value, xmax.value], [ymin.value, ymax.value], VIRIDIS_GLTEXTURE);
    });

    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let startRanges = { xmin: 0, xmax: 0, ymin: 0, ymax: 0 };
    let lastPlot = 0;

    // Panning: start drag on mousedown
    graphSection.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStart.x = e.clientX;
        dragStart.y = e.clientY;

        startRanges = {
            xmin: parseFloat(xmin.value), 
            xmax: parseFloat(xmax.value),  
            ymin: parseFloat(ymin.value), 
            ymax: parseFloat(ymax.value)
        };
        e.preventDefault();
    });

    // End dragging on mouseup
    document.addEventListener('mouseup', ()=> { isDragging = false; });
    graphSection.addEventListener('mouseup', () => { 
        isDragging = false; 
        plot(graph, overlay2D, PLOTTER, expression.value, dimension.value, [xmin.value, xmax.value], [ymin.value, ymax.value], VIRIDIS_GLTEXTURE);
        lastPlot = performance.now();
    });

    // Panning
    const FRAME_INTERVAL = 33;
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        let dx = e.clientX - dragStart.x;
        let dy = e.clientY - dragStart.y;
        
        const CANVAS_RECT = graphSection.getBoundingClientRect();
        
        let xrange = startRanges.xmax - startRanges.xmin;
        let yrange = startRanges.ymax - startRanges.ymin;
        
        dx = (dx / CANVAS_RECT.width) * xrange;
        dy = (dy / CANVAS_RECT.height) * yrange;

        xmin.value = startRanges.xmin - dx;
        xmax.value = startRanges.xmax - dx;
        ymin.value = startRanges.ymin + dy;
        ymax.value = startRanges.ymax + dy;
        
        const now = performance.now();
        if (now - lastPlot > FRAME_INTERVAL) { 
            plot(graph, overlay2D, PLOTTER, expression.value, dimension.value, [xmin.value, xmax.value], [ymin.value, ymax.value], VIRIDIS_GLTEXTURE);
            lastPlot = performance.now();
        }
    });

    // Zoom with wheel
    graphSection.addEventListener('wheel', (e) => {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 1.1 : 0.9;

        let xCenter = (parseFloat(xmin.value) + parseFloat(xmax.value)) / 2;
        let yCenter = (parseFloat(ymin.value) + parseFloat(ymax.value)) / 2;
        let xRange = (parseFloat(xmax.value) - parseFloat(xmin.value)) * factor;
        let yRange = (parseFloat(ymax.value) - parseFloat(ymin.value)) * factor;
        
        xmin.value = xCenter - xRange / 2;
        xmax.value = xCenter + xRange / 2;
        ymin.value = yCenter - yRange / 2;
        ymax.value = yCenter + yRange / 2;
        
        const now = performance.now();
        if (now - lastPlot > FRAME_INTERVAL) { 
            plot(graph, overlay2D, PLOTTER, expression.value, dimension.value, [xmin.value, xmax.value], [ymin.value, ymax.value], VIRIDIS_GLTEXTURE); 
            lastPlot = performance.now();
        }
    }, { passive: false });

    plotWindow.append(header, inputSection, graphSection);
    makeDraggable(header, plotWindow);
    document.body.appendChild(plotWindow);
}