// --- Helper Functions ---
function isLetter(token) {return /[a-zA-Z]/.test(token);}
function isUpper(token) {return (isLetter(token) && token === token.toUpperCase());}
function isLower(token) {return (isLetter(token) && token === token.toLowerCase());}
function isNum(token) {return (!isNaN(token));}

function sanitizeFormula(input) {
    if (!input) return "";

    const charMap = {
        '⁺': '+', '⁻': '-', 
        '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
        '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
    };

    return input.replace(/[⁺⁻⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/g, function(char) {
        return charMap[char] || char;
    });
}

function mergeElemLst(input1, input2) {
    let result = [];
    
    input1.forEach(entry => {
        let exist = -1;
        result.forEach ((existedEntry, index) => {if(existedEntry.name === entry.name) exist = index;});
        if (exist === -1){
            result.push(new elementinformula(entry.name, entry.count));
        }
        else {
            result[exist].count += entry.count;
        }
    });

    input2.forEach(entry => {
        let exist = -1;
        result.forEach ((existedEntry, index) => {if(existedEntry.name === entry.name) exist = index;});
        if (exist === -1){
            result.push(new elementinformula(entry.name, entry.count));
        }
        else {
            result[exist].count += entry.count;
        }
    });
    return result;
}

function hasMultipleCapitals(query) {
    let count = 0;
    for (let i = 0; i < query.length; i++) {
        if (isUpper(query[i])) {
            count++;
        }
        if (count > 1) return true; // Exit early once we hit 2
    }
    return false;
}

class elementinformula {
    constructor(name = "", count = 0) {
        this.name = name;
        this.count = count;
    }
}

function parseInput(input){
    let elemList = [];
    let i = 0;
    while (i < input.length) {
        let token = input[i];
        if (isUpper(token)) {
            let name = token;
            i++;
            if (i < input.length && isLower(input[i])) {
                name += input[i];
                i++;
            }
            let countStr = "";
            while (i < input.length && isNum(input[i]) && !isLetter(input[i])) {
                countStr += input[i];
                i++;
            }
            let count = countStr === "" ? 1 : parseInt(countStr);
            elemList = mergeElemLst(elemList, [new elementinformula(name, count)]);
        } 

        else if (token === " ") {
            i++;
        }

        else if (token === "(") {
            let subList = [];
            let j = i + 1;
            let bracketlevel = 1;
            
            while (j < input.length && bracketlevel > 0) {
                if (input[j] === "(") bracketlevel++;
                if (input[j] === ")") bracketlevel--;
                j++;
            }
                
            subList = parseInput(input.substring(i + 1, j - 1));
            if (subList.length === 0) {
                return ["ilgl"];
            }
            else if (subList[0] === "ilgl") {
                return ["ilgl"];
            }

            let multiplierStr = "";
            while (j < input.length && isNum(input[j])) {
                multiplierStr += input[j];
                j++;
            }
            let multiplier = multiplierStr === "" ? 1 : parseInt(multiplierStr);

            for (let e of subList){
                e.count *= Number(multiplier);
            }
            i = j;

            elemList = mergeElemLst(elemList, subList);
        }

        else if (token === ".") {
            let j = i + 1;
            let multiplierStr = "";
            while (j < input.length && isNum(input[j])) {
                multiplierStr += input[j];
                j++;
            }
            let multiplier = multiplierStr === "" ? 1 : parseInt(multiplierStr);
            i = j;

            while (j < input.length && input[j] != ".") {j++;}
            
            let subList = parseInput(input.substring(i,j));
            if (subList.length === 0) {
                return ["ilgl"]
            }
            else if (subList[0] === "ilgl") {
                return ["ilgl"];
            }
            for (let e of subList){
                e.count *= Number(multiplier);
            }
            i = j;

            elemList = mergeElemLst(elemList, subList);
        }

        else {
            return ["ilgl"]
        }
    }
    return elemList;
}

function lookup(elementName) {
    for (var j = 0; j < elements.length; j++) {
        var currentEntry = elements[j];

        // 1. Safety check: make sure the array slot isn't empty/null
        if (currentEntry && typeof currentEntry === 'object') {
            
            // 2. Exact match check
            if (currentEntry.symbol.toLowerCase() === elementName.toLowerCase()) {
                return currentEntry.molarMass;
            }
        }
    }
    return -1;
}

function calculate(elementList) {
    // 1. Check for your custom error codes
    if (!elementList || elementList.length === 0) return [-1, ""];
    if (elementList[0] === "ilgl") return [-2, ""]; // Code for "Illegal character"

    let totalMass = 0;
    var elemNotFound = "";
    for (let el of elementList) {
        let unitMass = lookup(el.name);
        if (unitMass < 0) {
            totalMass = -3;
            elemNotFound = elemNotFound + el.name + ", ";
        }
        if (totalMass >= 0) totalMass += unitMass * el.count;
    }
    return [totalMass, elemNotFound.slice(0,-2)];
}

 function calculateLimR(reagentList) {
    possibleProd = [];
    for (let r of reagentList) {
        const isVolumetricConc = (r.concUnit === 'molL' || r.concUnit === 'gL');
        const isMassConc = (r.concUnit === 'molg' || r.concUnit === 'gg');
        const isVolumetricAmt = (r.amountUnit === 'L' || r.amountUnit === 'mL');
        const isMassAmt = (r.amountUnit === 'g' || r.amountUnit === 'mg');

        if (isVolumetricConc && isMassAmt) return 'err';
        if (isMassConc && isVolumetricAmt) return 'err';
        if ((r.amountUnit !== 'mol' && r.amountUnit !== 'g') && r.concUnit === 'none') return 'err';

        let moles = 0;

        if (isNum(r.stoicoefficient) && isNum(r.concentration) && isNum(r.amount)) {
            if (r.amountUnit === 'mL' || r.amountUnit === 'mg') {
                r.amount = r.amount/1000;
                r.amountUnit = (r.amountUnit === 'mL')? 'L':'g';
            }
            if ((r.concUnit === 'gL' || r.concUnit === 'gg') && r.concUnit !== 'none') {
                let molm = calculate(parseInput(r.formula));
                if(molm[0] <= 0) return 'err';
                moles = r.concentration*r.amount/molm[0];
            }

            else if (r.amountUnit === 'mol') {
                moles = r.amount;
            }

            else if (r.amountUnit === 'g' && r.concUnit === 'none') {
                let molm = calculate(parseInput(r.formula));
                if (molm[0] <= 0) return 'err';
                moles = r.amount/molm[0];
            }

            else {
                moles = r.concentration*r.amount;
            }
            possibleProd.push([r.formula, moles/r.stoicoefficient]);
        }
        else {
            return 'err';
        }
    }
    possibleProd.sort((a, b) => a[1] - b[1]);
    let returnList = [];
    for (let prod of possibleProd) {
        if (prod[1] === possibleProd[0][1]) returnList.push(prod[0]);
        else break;
    }
    returnList.push(possibleProd[0][1])
    return returnList;
}

//============================================================================
// --- UI builders ---

// --- Main Chemistry submenu ---
function openChemWindow(outputLoc, parentWin) {
    if (document.getElementById('sci-chempanel')) return;

    state_chem = {
        elemSearch: false,
        molmCalc: false,
        limCalc: false,
        electroChem: false
    }
    
    var chemWindow = document.createElement('div');
    chemWindow.setAttribute('id', 'sci-chempanel');
    
    var chemHeader = document.createElement('div');
    chemHeader.setAttribute('id', 'sci-chempanel-header');
    chemHeader.textContent = 'Chemistry Toolbox';
    chemHeader.classList.add('no-select');

    var fnButtonContainer = document. createElement('div');
    fnButtonContainer.setAttribute('class', 'sci-chempanel-btncontainer');

    var btncolor = '#83c1bb';
    fnButtonContainer.appendChild(createFnBtn_chem('Element Look-Up', '🔎', btncolor, 'elemSearch', state_chem, outputLoc));
    fnButtonContainer.appendChild(createFnBtn_chem('Molar Mass Calculator', '🧮', btncolor, 'molmCalc', state_chem, outputLoc));
    fnButtonContainer.appendChild(createFnBtn_chem('Limiting Reagent Calculator', '🧪', btncolor, 'limCalc', state_chem, outputLoc));
    fnButtonContainer.appendChild(createFnBtn_chem('Electrochemistry', '⚡', btncolor, 'electroChem', state_chem, outputLoc));

    chemWindow.appendChild(chemHeader);
    chemWindow.appendChild(fnButtonContainer);
    parentWin.appendChild(chemWindow);

    return true;
}

function closeChemWindow() {
    let toolWindow = document.getElementsByClassName('sci-chempanel-tool');
    while (toolWindow.length > 0) {toolWindow[0].remove();}
    document.getElementById('sci-chempanel')?.remove();

    return false;
}

function createFnBtn_chem(name, symbol, color, id, state_chem, outputLoc) {
    var btn = document.createElement('button');
    btn.setAttribute('class', 'sci-chempanel-btn');
    btn.style.backgroundColor = '#f9f9f9'; // Default state
    btn.id = id;
    btn.color = color;

    // Use 'name' from arguments
    var labelSpan = document.createElement('span');
    labelSpan.textContent = name;
        
    var symbolSpan = document.createElement('span');
    symbolSpan.setAttribute('class', 'sci-chempanel-btnsymbol');
    symbolSpan.style.color = color;
    symbolSpan.textContent = symbol;

    btn.append(labelSpan, symbolSpan);

    btn.addEventListener('click', function() {
        if (id === 'elemSearch') {
            var existingWindow = document.getElementById('sci-chempanel-elesearch');
            if (!existingWindow) {openElemSearchWindow(outputLoc); state_chem.elemSearch = true;}
            else {existingWindow.remove(); state_chem.elemSearch = false;}
        }
        else if (id === 'molmCalc') {
            var existingWindow = document.getElementById('sci-chempanel-molmcalc');
            if (!existingWindow) {openMolarMassWindow(outputLoc); state_chem.molmCalc = true;} 
            else {existingWindow.remove(); state_chem.molmCalc = false;}
        }
        else if (id === 'limCalc') {
            var existingWindow = document.getElementById('sci-chempanel-limcalc');
            if (!existingWindow) {openLimReagentWindow(); state_chem.limCalc = true;}
            else {existingWindow.remove(); state_chem.limCalc = false;}
        }
        else if (id === 'electroChem') {
            var existingWindow = document.getElementById('sci-chempanel-elecchem');
            if (!existingWindow) {openElectroChemWindow(outputLoc); state_chem.electroChem = true;}
            else {existingWindow.remove(); state_chem.electroChem = false;}
        }
        refreshBtnDisp(btn.className, state_chem);
    });

    return btn;
}

// --- Element Look-Ups ---

function openElemSearchWindow(outputLoc) {
    if (document.getElementById('sci-chempanel-elesearch')) return;
    
    var elemSearchWindow = document.createElement('div');
    elemSearchWindow.setAttribute('id', 'sci-chempanel-elesearch');
    elemSearchWindow.setAttribute('class', 'sci-chempanel-tool');
    
    var elemSearchHeader = document.createElement('div');
    elemSearchHeader.setAttribute('class', 'sci-chempanel-subfunction-genericheader');
    elemSearchHeader.textContent = 'Elements Look-Up  ';
    elemSearchHeader.classList.add('no-select');

    var searchBox = document.createElement('input');
    searchBox.placeholder = 'Search element...';

    var resultsArea = document.createElement('div');
    resultsArea.setAttribute('class', 'sci-chempanel-elem-results');

    var legend = document.createElement('div');
    legend.setAttribute('class', 'sci-chempanel-elem-results-row');
    var symbol_legend = document.createElement("div");
    symbol_legend.classList.add('sci-chempanel-elem-results-row-symbol');
    symbol_legend.textContent = "Symbol: ";
    var name_legend = document.createElement("div");
    name_legend.classList.add('sci-chempanel-elem-results-row-text');
    name_legend.textContent = "Name: ";
    var mass_legend = document.createElement("div");
    mass_legend.classList.add('sci-chempanel-elem-results-row-text');
    mass_legend.textContent = "Molar Mass: ";

    legend.append(symbol_legend, name_legend, mass_legend);
    resultsArea.appendChild(legend);

    searchBox.addEventListener('input', function() {
        var query = searchBox.value.toLowerCase();
        while(resultsArea.firstChild) { resultsArea.removeChild(resultsArea.firstChild); }

        resultsArea.appendChild(legend);

        if (!query) return;

        var searchPool = elements.concat(polyions); 

        var found = [];

        if (!isNaN(query) && query !== "") {// Atomic Number Search (Elements only)
            found = elements.filter(elem => elem.atomicNumber == query);
        } 
        else {
            // Text Search (Name or Symbol)
            found = searchPool.filter(item => {
                var name = item.name.toLowerCase();
                var symbol = item.symbol.toLowerCase();
                // Remove superscripts/subscripts for "easy" typing (e.g., SO4 matching SO₄²⁻)
                var polySymbol = sanitizeFormula(item.symbol).toLowerCase();

                if (query.length === 1) {
                    // Single letter: Match startsWith for speed/accuracy
                    return name.startsWith(query) || symbol.startsWith(query);
                } 
                else {
                    // Multiple letters: Match anywhere in string
                    return name.includes(query) || symbol.includes(query) || polySymbol.includes(query);
                 }
            });
        }

        if (found.length === 0 && query.length > 0) {
            var row = document.createElement('div');
            row.setAttribute('class', 'sci-chempanel-elem-results-row');
            row.textContent = "No matched result.";
            resultsArea.appendChild(row);
        }
        else {
            for (let elem of found) {
                var row = document.createElement('div');
                row.setAttribute('class', 'sci-chempanel-elem-results-row');
                const symbolToPaste = elem.symbol;
                const nameToPaste = elem.name;
                const massToPaste = elem.molarMass.toFixed(3);

                var symbol = document.createElement("div");
                symbol.classList.add('sci-chempanel-elem-results-row-symbol');
                symbol.textContent = symbolToPaste;
                symbol.onclick = () => {insertIntoWindow(outputLoc, symbolToPaste);}
                var name = document.createElement("div");
                name.classList.add('sci-chempanel-elem-results-row-text');
                name.textContent = nameToPaste;
                name.onclick = () => {insertIntoWindow(outputLoc, nameToPaste);}
                var mass = document.createElement("div");
                mass.classList.add('sci-chempanel-elem-results-row-text');
                mass.textContent = massToPaste;
                mass.onclick = () => {insertIntoWindow(outputLoc, massToPaste + "g/mol ");}

                row.append(symbol, name, mass);
                resultsArea.appendChild(row);
            }
        }
    });

    elemSearchWindow.append(elemSearchHeader, searchBox, resultsArea);
    document.body.appendChild(elemSearchWindow);
    makeDraggable(elemSearchHeader, elemSearchWindow);
    searchBox.focus();

    return elemSearchWindow;
}

// --- Molar Mass Calculation ---

function openMolarMassWindow(outputLoc) {
    if (document.getElementById('sci-chempanel-molmcalc')) return;
    
    var molarMassWindow = document.createElement('div');
    molarMassWindow.setAttribute('id', 'sci-chempanel-molmcalc');
    molarMassWindow.setAttribute('class', 'sci-chempanel-tool');
    
    var molarMassHeader = document.createElement('div');
    molarMassHeader.setAttribute('class', 'sci-chempanel-subfunction-genericheader');
    molarMassHeader.textContent = 'Molar Mass Calculator';
    molarMassHeader.classList.add('no-select');

    var inputBox = document.createElement('input');
    inputBox.placeholder = 'Enter the formula';

    var resultBox = document.createElement('div')
    resultBox.setAttribute('class', 'sci-chempanel-molm-results');

    var result = document.createElement('div');
    result.setAttribute('class', 'sci-chempanel-subfunction-genericresult');
    result.textContent = "Molar Mass: --";

    var legend = document.createElement('div');
    legend.setAttribute('class', 'sci-chempanel-molm-results-row');
    var symbol_legend = document.createElement("div");
    symbol_legend.classList.add('sci-chempanel-molm-results-row-symbol');
    symbol_legend.textContent = "Element: ";
    var count_legend = document.createElement("div");
    count_legend.classList.add('sci-chempanel-molm-results-row-text');
    count_legend.textContent = "Count: ";
    var mass_legend = document.createElement("div");
    mass_legend.classList.add('sci-chempanel-molm-results-row-text');
    mass_legend.textContent = "Mass: ";
    var masspercent_legend = document.createElement("div");
    masspercent_legend.classList.add('sci-chempanel-molm-results-row-text');
    masspercent_legend.textContent = "%Mass: ";

    legend.append(symbol_legend, count_legend, mass_legend, masspercent_legend);
    resultBox.appendChild(legend);

    inputBox.addEventListener('input', function() {
        let elemLst = parseInput(sanitizeFormula(inputBox.value));
        let [totalMass,elem404] = calculate(elemLst);

        while(resultBox.firstChild) { resultBox.removeChild(resultBox.firstChild); }

        resultBox.appendChild(legend);

        switch (totalMass) {
            case -1:
                result.textContent = "Molar Mass: --";
                break;
            case -2:
                result.textContent = "Error: Contains invalid characters/structures.";
                break;
            case -3:
                result.textContent = "Error: Contains unrecognized elements: " + elem404;
                break;
            default:
                resultBox.appendChild(legend);

                for (let elem of elemLst) {
                    var row = document.createElement('div');
                    row.setAttribute('class', 'sci-chempanel-molm-results-row');

                    // 1. CAPTURE the values right now so the click knows exactly what to paste
                    const nameToPaste = elem.name;
                    const countToPaste = elem.count.toString();
                    const massToPaste = (lookup(elem.name) * elem.count).toFixed(3).toString();
                    const percentToPaste = (lookup(elem.name) * elem.count / totalMass * 100).toFixed(3) + "%";

                    var symbol = document.createElement("div");
                    symbol.classList.add('sci-chempanel-molm-results-row-symbol');
                    symbol.textContent = nameToPaste;
                    // 2. Use the CAPTURED constant here
                    symbol.onclick = () => { insertIntoWindow(outputLoc, nameToPaste); }
                                        
                    var count = document.createElement("div");
                    count.classList.add('sci-chempanel-molm-results-row-text');
                    count.textContent = countToPaste;
                    count.onclick = () => { insertIntoWindow(outputLoc, countToPaste); }

                    var mass = document.createElement("div");
                    mass.classList.add('sci-chempanel-molm-results-row-text');
                    mass.textContent = massToPaste;
                    mass.onclick = () => { insertIntoWindow(outputLoc, massToPaste + "g/mol "); }

                    var masspercent = document.createElement("div");
                    masspercent.classList.add('sci-chempanel-molm-results-row-text');
                    masspercent.textContent = percentToPaste;
                    masspercent.onclick = () => { insertIntoWindow(outputLoc, percentToPaste); }

                    row.append(symbol, count, mass, masspercent);
                    resultBox.appendChild(row);
                }
                const finalResultStr = totalMass.toFixed(3) + " g/mol";
                result.textContent = "Molar Mass = " + finalResultStr;
                result.onclick = () => insertIntoWindow(outputLoc, finalResultStr);

                break;
        }
    });

    molarMassWindow.append(molarMassHeader, inputBox, resultBox, result);
    document.body.appendChild(molarMassWindow);
    makeDraggable(molarMassHeader, molarMassWindow);

    return molarMassWindow;
}

// --- Limiting Reagent Calculation --- 
function openLimReagentWindow() {
    if (document.getElementById('sci-chempanel-limcalc')) return;
    
    var LimReagentWindow = document.createElement('div');
    LimReagentWindow.setAttribute('id', 'sci-chempanel-limcalc');
    LimReagentWindow.setAttribute('class', 'sci-chempanel-tool');
    
    var LimReagentHeader = document.createElement('div');
    LimReagentHeader.setAttribute('class', 'sci-chempanel-subfunction-genericheader');
    LimReagentHeader.textContent = 'Limiting Reagent Calculator';
    LimReagentHeader.classList.add('no-select');

    var inputBox = document.createElement('div');
    inputBox.setAttribute('id', 'sci-chempanel-limcalc-input');

    inputBox.append(createRow('A'));
    inputBox.append(createRow('B'));

    var addrowBtn = document.createElement('button');
    addrowBtn.setAttribute('id', 'sci-chempanel-limcalc-addrow')
    addrowBtn.textContent = '+';

    addrowBtn.addEventListener('click', () => {
        let currentRows = document.querySelectorAll('.sci-chempanel-limcalc-input-row')
        let placeholder = String.fromCharCode(currentRows[currentRows.length - 1].rowID.charCodeAt(0) + 1);

        if (currentRows.length < 5 && placeholder <= 'Z') {
            inputBox.appendChild(createRow(placeholder));
        }
        
        if(currentRows.length >= 4 || placeholder >= 'Z') {
            addrowBtn.style.color = '#aaa';
        }
    });

    var prodRatioBox = document.createElement('div');
    prodRatioBox.setAttribute('id', 'sci-chempanel-limcalc-productratiobox');
    var prodRatioLabel = document.createElement('span');
    prodRatioLabel.setAttribute('id', 'sci-chempanel-limcalc-productratiobox-label');
    prodRatioLabel.textContent = "Product/Limiting Reagent: ";
    var prodRatio = document.createElement('input');
    prodRatio.setAttribute('id', 'sci-chempanel-limcalc-productratiobox-input');
    prodRatio.placeholder = "Product Ratio";
    prodRatio.value = "1";

    prodRatioBox.append(prodRatioLabel, prodRatio);

    var confirmBtn = document.createElement('button');
    confirmBtn.setAttribute('id', 'sci-chempanel-limcalc-confirm')
    confirmBtn.textContent = 'CALCULATE';

    var result = document.createElement('div');
    result.setAttribute('class', 'sci-chempanel-subfunction-genericresult');
    result.textContent = "Limiting Reagent(s): --\nAmount of product formed: --";

    confirmBtn.addEventListener('click', ()=> {
        result.textContent = "Limiting Reagent(s): --\nAmount of product formed: --";
        reagentList = [];
        class reagent {
            constructor(formula, stoicoefficient, concentration, amount, units) {
                this.formula = formula;
                this.stoicoefficient = stoicoefficient;
                this.concentration = concentration;
                this.amount = amount;
                this.concUnit = units[0];
                this.amountUnit = units[1];
            }
        }
        let rowLst = document.getElementsByClassName('sci-chempanel-limcalc-input-row');
        for (let indiRow of rowLst) {
            let fName = sanitizeFormula(indiRow.querySelector('.sci-chempanel-limcalc-input-row-name').value);
            let stoic = indiRow.querySelector('.sci-chempanel-limcalc-input-row-stoic').value;
            let conc  = indiRow.querySelector('.sci-chempanel-limcalc-input-row-concentration').value;
            let amt   = indiRow.querySelector('.sci-chempanel-limcalc-input-row-amount').value;
            let cUnit = indiRow.querySelector('.sci-chempanel-limcalc-input-row-concentration-unit').value;
            let aUnit = indiRow.querySelector('.sci-chempanel-limcalc-input-row-amount-unit').value;

            if (fName === "" || stoic === "" || conc === "" || amt === "") {continue;}

            reagentList.push(new reagent(fName, stoic, conc, amt, [cUnit, aUnit]));
        }
        let resultValue = calculateLimR(reagentList);
        if (resultValue === 'err') {
            result.textContent = "Error in calculating, please check input.";
        } 
        else {
            if (prodRatio.value !== "" && (isNaN(prodRatio.value) || Number(prodRatio.value) <= 0)) {
                result.textContent = "Invalid product ratio. Please enter a positive number.";
            }
            else {
                let product = (resultValue[resultValue.length - 1] * ((prodRatio.value === "") ? 1 : Number(prodRatio.value))).toFixed(3);
                resultValue.pop();
                let resultstr = "Limiting Reagent(s): ";
                for (let res of resultValue) {
                    resultstr += res + ', ';
                }
                resultstr = resultstr.slice(0, -2) + "\nAmount of product formed: " + product + "mol.";
                result.textContent = resultstr;
            }
        }
    });

    LimReagentWindow.append(LimReagentHeader, inputBox, addrowBtn, prodRatioBox, confirmBtn, result);
    document.body.appendChild(LimReagentWindow);
    makeDraggable(LimReagentHeader, LimReagentWindow);

    return LimReagentWindow;
}

function createRow(reactantDefaultName) {
    var row = document.createElement('div');
    row.setAttribute('class', 'sci-chempanel-limcalc-input-row');
    row.rowID = reactantDefaultName;

    var name = document.createElement('input');
    name.setAttribute('class','sci-chempanel-limcalc-input-row-name');
    name.placeholder = reactantDefaultName;

    var stoicoefficient = document.createElement('input');
    stoicoefficient.setAttribute('class','sci-chempanel-limcalc-input-row-stoic');
    stoicoefficient.placeholder = "Stoi. coefficient";

    var concentration = document.createElement('input');
    concentration.setAttribute('class','sci-chempanel-limcalc-input-row-concentration');
    concentration.placeholder = "Concentration";

    var concUnit = document.createElement('select');
    concUnit.setAttribute('class','sci-chempanel-limcalc-input-row-concentration-unit');

    const concOptions = [
        { value: 'molL', text: 'mol/L' }, { value: 'gL', text: 'g/L' },
        { value: 'gg', text: 'g/g' }, { value: 'molg', text: 'mol/g' },
        {value: 'none', text: '--'}
    ];

    concOptions.forEach(opt => {
        let el = document.createElement('option');
        el.value = opt.value;
        el.text = opt.text;
        concUnit.appendChild(el);
    });

    concUnit.addEventListener('change', function() {
        const selected = this.value;
        if (selected === 'none') {
            concentration.value = 1;
            concentration.readOnly = true;
        }
        else {
            concentration.readOnly = false;
            concentration.value = "";
        }
    });

    var amount = document.createElement('input');
    amount.setAttribute('class','sci-chempanel-limcalc-input-row-amount');
    amount.placeholder = "Amount";

    var amountUnit = document.createElement('select');
    amountUnit.setAttribute('class', 'sci-chempanel-limcalc-input-row-amount-unit');
    
    const amountOptions = [
        { value: 'L', text: 'L' },
        { value: 'mL', text: 'mL' },
        { value: 'g', text: 'g' },
        { value: 'mg', text: 'mg' },
        { value: 'mol', text: 'mol'}
    ];

    amountOptions.forEach(opt => {
        let el = document.createElement('option');
        el.value = opt.value;
        el.text = opt.text;
        amountUnit.appendChild(el);
    });

    amountUnit.addEventListener('change', function() {
        const selected = this.value;

        if (selected === 'mol') {
            concUnit.value = 'none'; 
            concUnit.disabled = true;
            concentration.value = 1;
            concentration.readOnly = true;
        }
        else if ((selected === 'g' || selected === 'mg') && concUnit.value !== 'none') {
            concUnit.disabled = false;
        }
        else {
            concUnit.disabled = false;
        }
    });

    var removeBtn = document.createElement('button');
    removeBtn.setAttribute('class', 'sci-chempanel-limcalc-input-row-remove');
    removeBtn.textContent = '⊝';
    removeBtn.buttonID = reactantDefaultName;

    removeBtn.addEventListener('click', () => {
        let rowLst = document.getElementsByClassName(row.className);
        for (let existingRow of rowLst) {if (existingRow.rowID === removeBtn.buttonID) existingRow.remove();}
        if (rowLst.length < 5) document.getElementById('sci-chempanel-limcalc-addrow').style.color = 'black';
    })
    
    if (reactantDefaultName <= 'B') {
        removeBtn.disabled = true;
        removeBtn.style.visibility = 'hidden';
    }
    
    row.append(name, stoicoefficient, concentration, concUnit, amount, amountUnit, removeBtn);
    return row;
}

// --- Electrochemistry Dictionary ---
function openElectroChemWindow(outputLoc) {
    if (document.getElementById('sci-chempanel-elecchem')) return;

    var electroChemWindow = document.createElement('div');
    electroChemWindow.setAttribute('id', 'sci-chempanel-elecchem');
    electroChemWindow.setAttribute('class', 'sci-chempanel-tool');

    var ElectroChemHeader = document.createElement('div');
    ElectroChemHeader.setAttribute('class', 'sci-chempanel-subfunction-genericheader');
    ElectroChemHeader.textContent = 'Electrochemistry Info';
    ElectroChemHeader.classList.add('no-select');

    var inputBox1 = createSearchInput('Search redox reactions');
    var inputBox2 = createSearchInput('Search redox reactions');

    var confirmBtn = document.createElement('button');
    confirmBtn.setAttribute('id', 'sci-chempanel-elecchem-confirm')
    confirmBtn.textContent = 'CALCULATE CELL';

    var resultsArea = document.createElement('div');
    resultsArea.setAttribute('class', 'sci-chempanel-subfunction-genericresult');
    resultsArea.textContent = "E°cell = -- V\nSpontaneity: --";

    electroChemWindow.append(ElectroChemHeader, inputBox1, inputBox2, confirmBtn, resultsArea);
    
    confirmBtn.addEventListener('click', () => {
        resultsArea.textContent = "E°cell = -- V\nSpontaneity: --";
        let reaction1 = inputBox1.redoxLabel == 'reduction' ? inputBox1.redox: -1 * inputBox1.redox;
        let reaction2 = inputBox2.redoxLabel == 'reduction' ? inputBox2.redox: -1 * inputBox2.redox;

        if (reaction1 == null || reaction2 == null) {
            resultsArea.textContent = "E°cell = -- V\nSpontaneity: --";
        }

        else {
            resultsArea.textContent = "E°cell = " + (reaction1 + reaction2).toFixed(3) + " V" + '\n';
            resultsArea.textContent +=  (reaction1 - reaction2).toFixed(3) > 0 ? "Spontaneous" : "Non-spontaneous";
        }

    });

    resultsArea.addEventListener('click', () => {
        if (resultsArea.textContent.startsWith("E°cell = ")) {
            let cellPotential = resultsArea.textContent.split(" ")[2];
            insertIntoWindow(outputLoc, cellPotential + " V");
        }
    });

    document.body.appendChild(electroChemWindow);
    makeDraggable(ElectroChemHeader, electroChemWindow);

    return electroChemWindow;
}

function createSearchInput(placeholderText) {
    var container = document.createElement('div');
    container.setAttribute('class', 'sci-chempanel-elecchem-container');
    container.style.position = 'relative'; 
    container.style.width = '100%';
    container.redox = null;

    var input = document.createElement('div');
    input.setAttribute('class', 'sci-chempanel-elecchem-container-input-container');

    var inputBox = document.createElement('input');
    inputBox.setAttribute('class', 'sci-chempanel-elecchem-container-input-inputbox');
    inputBox.placeholder = placeholderText;

    var resultWindow = document.createElement('div');
    resultWindow.setAttribute('class', 'sci-chempanel-elecchem-container-input-result');

    var redoxLabel = document.createElement('select');
    redoxLabel.setAttribute('class', 'sci-chempanel-elecchem-container-input-redoxlabel');
    const redoxOptions = [{ value: 'oxidation', text: 'Oxidation' }, { value: 'reduction', text: 'Reduction' }];
    redoxOptions.forEach(opt => {
        let el = document.createElement('option');
        el.value = opt.value;
        el.text = opt.text;
        redoxLabel.appendChild(el);
    });

    input.append(inputBox, redoxLabel);
    container.append(input, resultWindow);

    inputBox.addEventListener('input', function() {
        container.redoxLabel = null;
        container.redox = redoxLabel.value;
        var query = inputBox.value.toLowerCase();
        while(resultWindow.firstChild) { resultWindow.removeChild(resultWindow.firstChild); }
        
        if (!query) {
            resultWindow.style.display = 'none';
            return;
        }

        for (let entry of window.electroPotentials) {
            let isMatch = false;

            if (isNum(query) && Math.abs(entry.potential - Number(query)) < 0.025) {
                isMatch = true;
            }
            else if (entry.name.toLowerCase().includes(query) || sanitizeFormula(entry.rxn).includes(query)) {
                isMatch = true;
            }

            if (isMatch) {
                var row = document.createElement('div'); 
                row.setAttribute('class', 'sci-chempanel-elecchem-container-input-result-row');
                
                var reaction = document.createElement("div"); 
                reaction.textContent = entry.rxn;
                
                var potential = document.createElement("div"); 
                potential.textContent = entry.e0 + " V";

                row.append(reaction, potential);

                row.addEventListener('click', () => {
                    inputBox.value = entry.rxn;
                    container.redox = entry.e0;
                    container.redoxLabel = redoxLabel.value;
                    resultWindow.style.display = 'none';
                });

                resultWindow.appendChild(row);

            }
        }
        
        resultWindow.style.display = resultWindow.firstChild ? 'block' : 'none';
    });

    return container; // Return the container, not just the input
}
