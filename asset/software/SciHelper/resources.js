// supercripts
if (typeof window.superscripts === 'undefined') {
    window.superscripts = Object.freeze({
        "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
        "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
        "a": "ᵃ", "b": "ᵇ", "c": "ᶜ", "d": "ᵈ", "e": "ᵉ",
        "f": "ᶠ", "g": "ᵍ", "h": "ʰ", "i": "ⁱ", "j": "ʲ",
        "k": "ᵏ", "l": "ˡ", "m": "ᵐ", "n": "ⁿ", "o": "ᵒ",
        "p": "ᵖ", "q": "ᑫ", "r": "ʳ", "s": "ˢ", "t": "ᵗ", "u": "ᵘ",
        "v": "ᵛ", "w": "ʷ", "x": "ˣ", "y": "ʸ", "z": "ᶻ",

        "-": "⁻"
    });
}

// subscripts
if (typeof window.subscripts === 'undefined') {
    window.subscripts = Object.freeze({
        "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
        "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",

        "a": "ₐ", "b": "₆", "c": "꜀", "e": "ₑ", "f": "ғ", "g": "₉", 
        "h": "ₕ", "i": "ᵢ", "j": "ⱼ", "k": "ₖ", "l": "ₗ", "m": "ₘ", 
        "n": "ₙ", "o": "ₒ", "p": "ₚ", "r": "ᵣ", "s": "ₛ", "t": "ₜ", 
        "u": "ᵤ", "v": "ᵥ", "w": "ᵥᵥ", "x": "ₓ", "y": "ᵧ", 

        "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎",

    });
}

// greeke letters
if (typeof window.greeks === 'undefined') {
    window.greeks = Object.freeze({
        "a": "α", "b": "β", "g": "γ", "d": "δ", "e": "ε",
        "z": "ζ", "h": "η", "q": "θ", "i": "ι", "k": "κ",
        "l": "λ", "m": "μ", "n": "ν", "x": "ξ", "o": "ο",
        "p": "π", "r": "ρ", "s": "σ", "t": "τ", "u": "υ",
        "f": "φ", "c": "χ", "y": "ψ", "w": "ω", 
    });
}

// math symbols
if (typeof window.maths === 'undefined') {
    window.maths = Object.freeze({
        "i": "∫", "p": "∂", "s": "∑", "r": "√", "l": "∞", "d": "∆",
        "g": "∇", "o": "ₒ", "e": "≈", "@": "∈", "*": "×", "f": "ƒ",
        "b": "≥", "s": "≤", "/": "÷", ".": "·", "n": "≠", "a": "∀",
        "E": "∃", "v": "⃗",
    });
}

// Special characters
if (typeof window.degree === 'undefined') { window.degree = "°"; }
if (typeof window.equilibium === 'undefined') { window.equilibium = "⇌"; }

//============================================================================Chemistry
//Elements
class element {
    constructor(name, symbol, atomicNumber, molarMass) {
        this.name = name;
        this.symbol = symbol;
        this.atomicNumber = atomicNumber;
        this.molarMass = molarMass;
        Object.freeze(this);
    }
}

if (typeof window.elements === 'undefined') {
    const e = [];
  //e[#]   = new element("Chemical name", "Sym", At#,  Molar mass);
    e[1]   = new element("Hydrogen",      "H",   1,    1.008);
    e[2]   = new element("Helium",        "He",  2,    4.003);
    e[3]   = new element("Lithium",       "Li",  3,    6.940);
    e[4]   = new element("Beryllium",     "Be",  4,    9.012);
    e[5]   = new element("Boron",         "B",   5,    10.810);
    e[6]   = new element("Carbon",        "C",   6,    12.011);
    e[7]   = new element("Nitrogen",      "N",   7,    14.007);
    e[8]   = new element("Oxygen",        "O",   8,    15.999);
    e[9]   = new element("Fluorine",      "F",   9,    18.998);
    e[10]  = new element("Neon",          "Ne",  10,   20.180);

    e[11]  = new element("Sodium",        "Na",  11,   22.990);
    e[12]  = new element("Magnesium",     "Mg",  12,   24.305);
    e[13]  = new element("Aluminum",      "Al",  13,   26.982);
    e[14]  = new element("Silicon",       "Si",  14,   28.085);
    e[15]  = new element("Phosphorus",    "P",   15,   30.974);
    e[16]  = new element("Sulfur",        "S",   16,   32.060);
    e[17]  = new element("Chlorine",      "Cl",  17,   35.450);
    e[18]  = new element("Argon",         "Ar",  18,   39.948);

    e[19]  = new element("Potassium",     "K",   19,   39.098);
    e[20]  = new element("Calcium",       "Ca",  20,   40.078);
    e[21]  = new element("Scandium",      "Sc",  21,   44.956);
    e[22]  = new element("Titanium",      "Ti",  22,   47.867);
    e[23]  = new element("Vanadium",      "V",   23,   50.942);
    e[24]  = new element("Chromium",      "Cr",  24,   51.996);
    e[25]  = new element("Manganese",     "Mn",  25,   54.938);
    e[26]  = new element("Iron",          "Fe",  26,   55.845);
    e[27]  = new element("Cobalt",        "Co",  27,   58.933);
    e[28]  = new element("Nickel",        "Ni",  28,   58.693);
    e[29]  = new element("Copper",        "Cu",  29,   63.546);
    e[30]  = new element("Zinc",          "Zn",  30,   65.380);

    e[31]  = new element("Gallium",       "Ga",  31,   69.723);
    e[32]  = new element("Germanium",     "Ge",  32,   72.630);
    e[33]  = new element("Arsenic",       "As",  33,   74.922);
    e[34]  = new element("Selenium",      "Se",  34,   78.971);
    e[35]  = new element("Bromine",       "Br",  35,   79.904);
    e[36]  = new element("Krypton",       "Kr",  36,   83.798);

    e[37]  = new element("Rubidium",      "Rb",  37,   85.468);
    e[38]  = new element("Strontium",     "Sr",  38,   87.620);
    e[39]  = new element("Yttrium",       "Y",   39,   88.906);
    e[40]  = new element("Zirconium",     "Zr",  40,   91.224);
    e[41]  = new element("Niobium",       "Nb",  41,   92.906);
    e[42]  = new element("Molybdenum",    "Mo",  42,   95.950);
    e[43]  = new element("Technetium",    "Tc",  43,   98.000);
    e[44]  = new element("Ruthenium",     "Ru",  44,   101.070);
    e[45]  = new element("Rhodium",       "Rh",  45,   102.910);
    e[46]  = new element("Palladium",     "Pd",  46,   106.420);
    e[47]  = new element("Silver",        "Ag",  47,   107.870);
    e[48]  = new element("Cadmium",       "Cd",  48,   112.410);

    e[49]  = new element("Indium",        "In",  49,   114.820);
    e[50]  = new element("Tin",           "Sn",  50,   118.710);
    e[51]  = new element("Antimony",      "Sb",  51,   121.760);
    e[52]  = new element("Tellurium",     "Te",  52,   127.600);
    e[53]  = new element("Iodine",        "I",   53,   126.900);
    e[54]  = new element("Xenon",         "Xe",  54,   131.290);

    e[55]  = new element("Cesium",        "Cs",  55,   132.910);
    e[56]  = new element("Barium",        "Ba",  56,   137.330);

    e[57]  = new element("Lanthanum",     "La",  57,   138.910);
    e[58]  = new element("Cerium",        "Ce",  58,   140.120);
    e[59]  = new element("Praseodymium",  "Pr",  59,   140.910);
    e[60]  = new element("Neodymium",     "Nd",  60,   144.240);
    e[61]  = new element("Promethium",    "Pm",  61,   145.000);
    e[62]  = new element("Samarium",      "Sm",  62,   150.360);
    e[63]  = new element("Europium",      "Eu",  63,   151.960);
    e[64]  = new element("Gadolinium",    "Gd",  64,   157.250);
    e[65]  = new element("Terbium",       "Tb",  65,   158.930);
    e[66]  = new element("Dysprosium",    "Dy",  66,   162.500);
    e[67]  = new element("Holmium",       "Ho",  67,   164.930);
    e[68]  = new element("Erbium",        "Er",  68,   167.260);
    e[69]  = new element("Thulium",       "Tm",  69,   168.930);
    e[70]  = new element("Ytterbium",     "Yb",  70,   173.050);
    e[71]  = new element("Lutetium",      "Lu",  71,   174.970);

    e[72]  = new element("Hafnium",       "Hf",  72,   178.490);
    e[73]  = new element("Tantalum",      "Ta",  73,   180.950);
    e[74]  = new element("Tungsten",      "W",   74,   183.840);
    e[75]  = new element("Rhenium",       "Re",  75,   186.210);
    e[76]  = new element("Osmium",        "Os",  76,   190.230);
    e[77]  = new element("Iridium",       "Ir",  77,   192.220);
    e[78]  = new element("Platinum",      "Pt",  78,   195.080);
    e[79]  = new element("Gold",          "Au",  79,   196.970);
    e[80]  = new element("Mercury",       "Hg",  80,   200.590);
    e[81]  = new element("Thallium",      "Tl",  81,   204.380);
    e[82]  = new element("Lead",          "Pb",  82,   207.200);
    e[83]  = new element("Bismuth",       "Bi",  83,   208.980);
    e[84]  = new element("Polonium",      "Po",  84,   209.000);
    e[85]  = new element("Astatine",      "At",  85,   210.000);
    e[86]  = new element("Radon",         "Rn",  86,   222.000);

    e[87]  = new element("Francium",      "Fr",  87,   223.000);
    e[88]  = new element("Radium",        "Ra",  88,   226.000);

    e[89]  = new element("Actinium",      "Ac",  89,   227.000);
    e[90]  = new element("Thorium",       "Th",  90,   232.040);
    e[91]  = new element("Protactinium",  "Pa",  91,   231.040);
    e[92]  = new element("Uranium",       "U",   92,   238.030);
    e[93]  = new element("Neptunium",     "Np",  93,   237.000);
    e[94]  = new element("Plutonium",     "Pu",  94,   244.000);
    e[95]  = new element("Americium",     "Am",  95,   243.000);
    e[96]  = new element("Curium",        "Cm",  96,   247.000);
    e[97]  = new element("Berkelium",     "Bk",  97,   247.000);
    e[98]  = new element("Californium",   "Cf",  98,   251.000);
    e[99]  = new element("Einsteinium",   "Es",  99,   252.000);
    e[100] = new element("Fermium",       "Fm",  100,  257.000);
    e[101] = new element("Mendelevium",   "Md",  101,  258.000);
    e[102] = new element("Nobelium",      "No",  102,  259.000);
    e[103] = new element("Lawrencium",    "Lr",  103,  266.000);

    e[104] = new element("Rutherfordium", "Rf",  104,  267.000);
    e[105] = new element("Dubnium",       "Db",  105,  268.000);
    e[106] = new element("Seaborgium",    "Sg",  106,  269.000);
    e[107] = new element("Bohrium",       "Bh",  107,  270.000);
    e[108] = new element("Hassium",       "Hs",  108,  269.000);
    e[109] = new element("Meitnerium",    "Mt",  109,  278.000);
    e[110] = new element("Darmstadtium",  "Ds",  110,  281.000);
    e[111] = new element("Roentgenium",   "Rg",  111,  282.000);
    e[112] = new element("Copernicium",   "Cn",  112,  285.000);
    e[113] = new element("Nihonium",      "Nh",  113,  286.000);
    e[114] = new element("Flerovium",     "Fl",  114,  289.000);
    e[115] = new element("Moscovium",     "Mc",  115,  290.000);
    e[116] = new element("Livermorium",   "Lv",  116,  293.000);
    e[117] = new element("Tennessine",    "Ts",  117,  294.000);
    e[118] = new element("Oganesson",     "Og",  118,  294.000);

    window.elements = Object.freeze(e);
}

if (typeof window.polyions === 'undefined') {
    const p = [];

    p[0]  = new element("Ammonium",       "NH₄⁺",     -1,   18.044);
    p[1]  = new element("Acetate",        "CH₃COO⁻",  -1,   59.044);
    p[2]  = new element("Bicarbonate",    "HCO₃⁻",    -1,   61.016);
    p[3]  = new element("Chlorate",       "ClO₃⁻",    -1,   83.451);
    p[4]  = new element("Cyanide",        "CN⁻",      -1,   26.017);
    p[5]  = new element("Hydroxide",      "OH⁻",      -1,   17.007);
    p[6]  = new element("Nitrate",        "NO₃⁻",     -1,   62.004);
    p[7]  = new element("Nitrite",        "NO₂⁻",     -1,   46.005);
    p[8]  = new element("Permanganate",   "MnO₄⁻",    -1,   118.937);
    p[9]  = new element("Carbonate",      "CO₃²⁻",    -1,   60.008);
    p[10] = new element("Chromate",       "CrO₄²⁻",   -1,   115.994);
    p[11] = new element("Dichromate",     "Cr₂O₇²⁻",  -1,   215.988);
    p[12] = new element("Oxalate",        "C₂O₄²⁻",   -1,   88.019);
    p[13] = new element("Sulfate",        "SO₄²⁻",    -1,   96.062);
    p[14] = new element("Sulfite",        "SO₃²⁻",    -1,   80.062);
    p[15] = new element("Phosphate",      "PO₄³⁻",    -1,   94.971);
    p[16] = new element("Phosphite",      "PO₃³⁻",    -1,   78.972);
    
    window.polyions = Object.freeze(p);
}

if (typeof window.electroPotentials === 'undefined') {
    const ELECTRO_POTENTIALS = [
        { name: "Fluorine", symbol: "F₂", rxn: "F₂ + 2e⁻ → 2F⁻", e0: 2.87 },
        { name: "Hydrogen Peroxide", symbol: "H₂O₂", rxn: "H₂O₂ + 2H⁺ + 2e⁻ → 2H₂O", e0: 1.78 },
        { name: "Permanganate", symbol: "MnO₄⁻", rxn: "MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O", e0: 1.51 },
        { name: "Gold", symbol: "Au³⁺", rxn: "Au³⁺ + 3e⁻ → Au", e0: 1.50 },
        { name: "Chlorine", symbol: "Cl₂", rxn: "Cl₂ + 2e⁻ → 2Cl⁻", e0: 1.36 },
        { name: "Dichromate", symbol: "Cr₂O₇²⁻", rxn: "Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O", e0: 1.33 },
        { name: "Oxygen", symbol: "O₂", rxn: "O₂ + 4H⁺ + 4e⁻ → 2H₂O", e0: 1.23 },
        { name: "Bromine", symbol: "Br₂", rxn: "Br₂ + 2e⁻ → 2Br⁻", e0: 1.07 },
        { name: "Nitrate", symbol: "NO₃⁻", rxn: "NO₃⁻ + 4H⁺ + 3e⁻ → NO + 2H₂O", e0: 0.96 },
        { name: "Silver", symbol: "Ag⁺", rxn: "Ag⁺ + e⁻ → Ag", e0: 0.80 },
        { name: "Iron(III)", symbol: "Fe³⁺", rxn: "Fe³⁺ + e⁻ → Fe²⁺", e0: 0.77 },
        { name: "Iodine", symbol: "I₂", rxn: "I₂ + 2e⁻ → 2I⁻", e0: 0.54 },
        { name: "Copper(I)", symbol: "Cu⁺", rxn: "Cu⁺ + e⁻ → Cu", e0: 0.52 },
        { name: "Copper(II)", symbol: "Cu²⁺", rxn: "Cu²⁺ + 2e⁻ → Cu", e0: 0.34 },
        { name: "Tin(IV)", symbol: "Sn⁴⁺", rxn: "Sn⁴⁺ + 2e⁻ → Sn²⁺", e0: 0.15 },
        { name: "Hydrogen (SHE)", symbol: "H⁺", rxn: "2H⁺ + 2e⁻ → H₂", e0: 0.00 },
        { name: "Lead(II)", symbol: "Pb²⁺", rxn: "Pb²⁺ + 2e⁻ → Pb", e0: -0.13 },
        { name: "Tin(II)", symbol: "Sn²⁺", rxn: "Sn²⁺ + 2e⁻ → Sn", e0: -0.14 },
        { name: "Nickel(II)", symbol: "Ni²⁺", rxn: "Ni²⁺ + 2e⁻ → Ni", e0: -0.26 },
        { name: "Cobalt(II)", symbol: "Co²⁺", rxn: "Co²⁺ + 2e⁻ → Co", e0: -0.28 },
        { name: "Iron(II)", symbol: "Fe²⁺", rxn: "Fe²⁺ + 2e⁻ → Fe", e0: -0.44 },
        { name: "Chromium(III)", symbol: "Cr³⁺", rxn: "Cr³⁺ + 3e⁻ → Cr", e0: -0.74 },
        { name: "Zinc", symbol: "Zn²⁺", rxn: "Zn²⁺ + 2e⁻ → Zn", e0: -0.76 },
        { name: "Water (Reduction)", symbol: "H₂O", rxn: "2H₂O + 2e⁻ → H₂ + 2OH⁻", e0: -0.83 },
        { name: "Manganese(II)", symbol: "Mn²⁺", rxn: "Mn²⁺ + 2e⁻ → Mn", e0: -1.18 },
        { name: "Aluminum", symbol: "Al³⁺", rxn: "Al³⁺ + 3e⁻ → Al", e0: -1.66 },
        { name: "Magnesium", symbol: "Mg²⁺", rxn: "Mg²⁺ + 2e⁻ → Mg", e0: -2.37 },
        { name: "Sodium", symbol: "Na⁺", rxn: "Na⁺ + e⁻ → Na", e0: -2.71 },
        { name: "Calcium", symbol: "Ca²⁺", rxn: "Ca²⁺ + 2e⁻ → Ca", e0: -2.87 },
        { name: "Potassium", symbol: "K⁺", rxn: "K⁺ + e⁻ → K", e0: -2.93 },
        { name: "Lithium", symbol: "Li⁺", rxn: "Li⁺ + e⁻ → Li", e0: -3.04 }
    ];
    window.electroPotentials = Object.freeze(ELECTRO_POTENTIALS);
}