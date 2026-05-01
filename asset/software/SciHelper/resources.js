//============================================================================
// Special characters mapping

const superscripts = Object.freeze({
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
    "a": "ᵃ", "b": "ᵇ", "c": "ᶜ", "d": "ᵈ", "e": "ᵉ",
    "f": "ᶠ", "g": "ᵍ", "h": "ʰ", "i": "ⁱ", "j": "ʲ",
    "k": "ᵏ", "l": "ˡ", "m": "ᵐ", "n": "ⁿ", "o": "ᵒ",
    "p": "ᵖ", "q": "ᑫ", "r": "ʳ", "s": "ˢ", "t": "ᵗ", "u": "ᵘ",
    "v": "ᵛ", "w": "ʷ", "x": "ˣ", "y": "ʸ", "z": "ᶻ",
    "-": "⁻", "+": "⁺"
});

const subscripts = Object.freeze({
    "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
    "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
    "a": "ₐ", "b": "₆", "c": "꜀", "e": "ₑ", "f": "ғ", "g": "₉",
    "h": "ₕ", "i": "ᵢ", "j": "ⱼ", "k": "ₖ", "l": "ₗ", "m": "ₘ",
    "n": "ₙ", "o": "ₒ", "p": "ₚ", "r": "ᵣ", "s": "ₛ", "t": "ₜ",
    "u": "ᵤ", "v": "ᵥ", "w": "ᵥᵥ", "x": "ₓ", "y": "ᵧ",
    "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎",
});

const greeks = Object.freeze({
    "a": "α", "b": "β", "g": "γ", "d": "δ", "e": "ε",
    "z": "ζ", "h": "η", "q": "θ", "i": "ι", "k": "κ",
    "l": "λ", "m": "μ", "n": "ν", "x": "ξ", "o": "ο",
    "p": "π", "r": "ρ", "s": "σ", "t": "τ", "u": "υ",
    "f": "φ", "c": "χ", "y": "ψ", "w": "ω",
});

const maths = Object.freeze({
    "i": "∫", "p": "∂", "s": "∑", "r": "√", "l": "∞", "d": "∆",
    "g": "∇", "o": "ₒ", "e": "≈", "@": "∈", "*": "×", "f": "ƒ",
    "b": "≥", "s": "≤", "/": "÷", ".": "·", "n": "≠", "a": "∀",
    "E": "∃", "v": "⃗",
});

const degree = "°";
const equilibium = "⇌";

//============================================================================
// Chemistry

class element {
    constructor(name, symbol, atomicNumber, molarMass) {
        this.name = name;
        this.symbol = symbol;
        this.atomicNumber = atomicNumber;
        this.molarMass = molarMass;
        Object.freeze(this);
    }
}

const _elements = [];
//  _elements[#]   = new element("Chemical name", "Sym", At#,  Molar mass);
    _elements[1]   = new element("Hydrogen",      "H",   1,    1.008);
    _elements[2]   = new element("Helium",        "He",  2,    4.003);
    _elements[3]   = new element("Lithium",       "Li",  3,    6.940);
    _elements[4]   = new element("Beryllium",     "Be",  4,    9.012);
    _elements[5]   = new element("Boron",         "B",   5,    10.810);
    _elements[6]   = new element("Carbon",        "C",   6,    12.011);
    _elements[7]   = new element("Nitrogen",      "N",   7,    14.007);
    _elements[8]   = new element("Oxygen",        "O",   8,    15.999);
    _elements[9]   = new element("Fluorine",      "F",   9,    18.998);
    _elements[10]  = new element("Neon",          "Ne",  10,   20.180);

    _elements[11]  = new element("Sodium",        "Na",  11,   22.990);
    _elements[12]  = new element("Magnesium",     "Mg",  12,   24.305);
    _elements[13]  = new element("Aluminum",      "Al",  13,   26.982);
    _elements[14]  = new element("Silicon",       "Si",  14,   28.085);
    _elements[15]  = new element("Phosphorus",    "P",   15,   30.974);
    _elements[16]  = new element("Sulfur",        "S",   16,   32.060);
    _elements[17]  = new element("Chlorine",      "Cl",  17,   35.450);
    _elements[18]  = new element("Argon",         "Ar",  18,   39.948);

    _elements[19]  = new element("Potassium",     "K",   19,   39.098);
    _elements[20]  = new element("Calcium",       "Ca",  20,   40.078);
    _elements[21]  = new element("Scandium",      "Sc",  21,   44.956);
    _elements[22]  = new element("Titanium",      "Ti",  22,   47.867);
    _elements[23]  = new element("Vanadium",      "V",   23,   50.942);
    _elements[24]  = new element("Chromium",      "Cr",  24,   51.996);
    _elements[25]  = new element("Manganese",     "Mn",  25,   54.938);
    _elements[26]  = new element("Iron",          "Fe",  26,   55.845);
    _elements[27]  = new element("Cobalt",        "Co",  27,   58.933);
    _elements[28]  = new element("Nickel",        "Ni",  28,   58.693);
    _elements[29]  = new element("Copper",        "Cu",  29,   63.546);
    _elements[30]  = new element("Zinc",          "Zn",  30,   65.380);

    _elements[31]  = new element("Gallium",       "Ga",  31,   69.723);
    _elements[32]  = new element("Germanium",     "Ge",  32,   72.630);
    _elements[33]  = new element("Arsenic",       "As",  33,   74.922);
    _elements[34]  = new element("Selenium",      "Se",  34,   78.971);
    _elements[35]  = new element("Bromine",       "Br",  35,   79.904);
    _elements[36]  = new element("Krypton",       "Kr",  36,   83.798);

    _elements[37]  = new element("Rubidium",      "Rb",  37,   85.468);
    _elements[38]  = new element("Strontium",     "Sr",  38,   87.620);
    _elements[39]  = new element("Yttrium",       "Y",   39,   88.906);
    _elements[40]  = new element("Zirconium",     "Zr",  40,   91.224);
    _elements[41]  = new element("Niobium",       "Nb",  41,   92.906);
    _elements[42]  = new element("Molybdenum",    "Mo",  42,   95.950);
    _elements[43]  = new element("Technetium",    "Tc",  43,   98.000);
    _elements[44]  = new element("Ruthenium",     "Ru",  44,   101.070);
    _elements[45]  = new element("Rhodium",       "Rh",  45,   102.910);
    _elements[46]  = new element("Palladium",     "Pd",  46,   106.420);
    _elements[47]  = new element("Silver",        "Ag",  47,   107.870);
    _elements[48]  = new element("Cadmium",       "Cd",  48,   112.410);

    _elements[49]  = new element("Indium",        "In",  49,   114.820);
    _elements[50]  = new element("Tin",           "Sn",  50,   118.710);
    _elements[51]  = new element("Antimony",      "Sb",  51,   121.760);
    _elements[52]  = new element("Tellurium",     "Te",  52,   127.600);
    _elements[53]  = new element("Iodine",        "I",   53,   126.900);
    _elements[54]  = new element("Xenon",         "Xe",  54,   131.290);

    _elements[55]  = new element("Cesium",        "Cs",  55,   132.910);
    _elements[56]  = new element("Barium",        "Ba",  56,   137.330);

    _elements[57]  = new element("Lanthanum",     "La",  57,   138.910);
    _elements[58]  = new element("Cerium",        "Ce",  58,   140.120);
    _elements[59]  = new element("Praseodymium",  "Pr",  59,   140.910);
    _elements[60]  = new element("Neodymium",     "Nd",  60,   144.240);
    _elements[61]  = new element("Promethium",    "Pm",  61,   145.000);
    _elements[62]  = new element("Samarium",      "Sm",  62,   150.360);
    _elements[63]  = new element("Europium",      "Eu",  63,   151.960);
    _elements[64]  = new element("Gadolinium",    "Gd",  64,   157.250);
    _elements[65]  = new element("Terbium",       "Tb",  65,   158.930);
    _elements[66]  = new element("Dysprosium",    "Dy",  66,   162.500);
    _elements[67]  = new element("Holmium",       "Ho",  67,   164.930);
    _elements[68]  = new element("Erbium",        "Er",  68,   167.260);
    _elements[69]  = new element("Thulium",       "Tm",  69,   168.930);
    _elements[70]  = new element("Ytterbium",     "Yb",  70,   173.050);
    _elements[71]  = new element("Lutetium",      "Lu",  71,   174.970);

    _elements[72]  = new element("Hafnium",       "Hf",  72,   178.490);
    _elements[73]  = new element("Tantalum",      "Ta",  73,   180.950);
    _elements[74]  = new element("Tungsten",      "W",   74,   183.840);
    _elements[75]  = new element("Rhenium",       "Re",  75,   186.210);
    _elements[76]  = new element("Osmium",        "Os",  76,   190.230);
    _elements[77]  = new element("Iridium",       "Ir",  77,   192.220);
    _elements[78]  = new element("Platinum",      "Pt",  78,   195.080);
    _elements[79]  = new element("Gold",          "Au",  79,   196.970);
    _elements[80]  = new element("Mercury",       "Hg",  80,   200.590);
    _elements[81]  = new element("Thallium",      "Tl",  81,   204.380);
    _elements[82]  = new element("Lead",          "Pb",  82,   207.200);
    _elements[83]  = new element("Bismuth",       "Bi",  83,   208.980);
    _elements[84]  = new element("Polonium",      "Po",  84,   209.000);
    _elements[85]  = new element("Astatine",      "At",  85,   210.000);
    _elements[86]  = new element("Radon",         "Rn",  86,   222.000);

    _elements[87]  = new element("Francium",      "Fr",  87,   223.000);
    _elements[88]  = new element("Radium",        "Ra",  88,   226.000);

    _elements[89]  = new element("Actinium",      "Ac",  89,   227.000);
    _elements[90]  = new element("Thorium",       "Th",  90,   232.040);
    _elements[91]  = new element("Protactinium",  "Pa",  91,   231.040);
    _elements[92]  = new element("Uranium",       "U",   92,   238.030);
    _elements[93]  = new element("Neptunium",     "Np",  93,   237.000);
    _elements[94]  = new element("Plutonium",     "Pu",  94,   244.000);
    _elements[95]  = new element("Americium",     "Am",  95,   243.000);
    _elements[96]  = new element("Curium",        "Cm",  96,   247.000);
    _elements[97]  = new element("Berkelium",     "Bk",  97,   247.000);
    _elements[98]  = new element("Californium",   "Cf",  98,   251.000);
    _elements[99]  = new element("Einsteinium",   "Es",  99,   252.000);
    _elements[100] = new element("Fermium",       "Fm",  100,  257.000);
    _elements[101] = new element("Mendelevium",   "Md",  101,  258.000);
    _elements[102] = new element("Nobelium",      "No",  102,  259.000);
    _elements[103] = new element("Lawrencium",    "Lr",  103,  266.000);

    _elements[104] = new element("Rutherfordium", "Rf",  104,  267.000);
    _elements[105] = new element("Dubnium",       "Db",  105,  268.000);
    _elements[106] = new element("Seaborgium",    "Sg",  106,  269.000);
    _elements[107] = new element("Bohrium",       "Bh",  107,  270.000);
    _elements[108] = new element("Hassium",       "Hs",  108,  269.000);
    _elements[109] = new element("Meitnerium",    "Mt",  109,  278.000);
    _elements[110] = new element("Darmstadtium",  "Ds",  110,  281.000);
    _elements[111] = new element("Roentgenium",   "Rg",  111,  282.000);
    _elements[112] = new element("Copernicium",   "Cn",  112,  285.000);
    _elements[113] = new element("Nihonium",      "Nh",  113,  286.000);
    _elements[114] = new element("Flerovium",     "Fl",  114,  289.000);
    _elements[115] = new element("Moscovium",     "Mc",  115,  290.000);
    _elements[116] = new element("Livermorium",   "Lv",  116,  293.000);
    _elements[117] = new element("Tennessine",    "Ts",  117,  294.000);
    _elements[118] = new element("Oganesson",     "Og",  118,  294.000);

const elements = Object.freeze(_elements);

const _polyions = [];
    _polyions[0]  = new element("Ammonium",       "NH₄⁺",     -1,   18.044);
    _polyions[1]  = new element("Acetate",        "CH₃COO⁻",  -1,   59.044);
    _polyions[2]  = new element("Bicarbonate",    "HCO₃⁻",    -1,   61.016);
    _polyions[3]  = new element("Chlorate",       "ClO₃⁻",    -1,   83.451);
    _polyions[4]  = new element("Cyanide",        "CN⁻",      -1,   26.017);
    _polyions[5]  = new element("Hydroxide",      "OH⁻",      -1,   17.007);
    _polyions[6]  = new element("Nitrate",        "NO₃⁻",     -1,   62.004);
    _polyions[7]  = new element("Nitrite",        "NO₂⁻",     -1,   46.005);
    _polyions[8]  = new element("Permanganate",   "MnO₄⁻",    -1,   118.937);
    _polyions[9]  = new element("Carbonate",      "CO₃²⁻",    -1,   60.008);
    _polyions[10] = new element("Chromate",       "CrO₄²⁻",   -1,   115.994);
    _polyions[11] = new element("Dichromate",     "Cr₂O₇²⁻",  -1,   215.988);
    _polyions[12] = new element("Oxalate",        "C₂O₄²⁻",   -1,   88.019);
    _polyions[13] = new element("Sulfate",        "SO₄²⁻",    -1,   96.062);
    _polyions[14] = new element("Sulfite",        "SO₃²⁻",    -1,   80.062);
    _polyions[15] = new element("Phosphate",      "PO₄³⁻",    -1,   94.971);
    _polyions[16] = new element("Phosphite",      "PO₃³⁻",    -1,   78.972);

const polyions = Object.freeze(_polyions);

const electroPotentials = Object.freeze([
    { name: "Fluorine",             symbol: "F₂",       rxn: "F₂(g) + 2e⁻ ⇌ 2F⁻(aq)",                                       e0: 2.87 },
    { name: "Hydrogen Peroxide",    symbol: "H₂O₂",     rxn: "H₂O₂ + 2H⁺ + 2e⁻ → 2H₂O",                                     e0:  1.78 }, 
    { name: "Permanganate",         symbol: "MnO₄⁻",    rxn: "MnO₄⁻(aq) + 8H⁺(aq) + 5e⁻ ⇌ Mn²⁺(aq) + 4H₂O(l)",              e0: 1.51 },
    { name: "Gold",                 symbol: "Au³⁺",     rxn: "Au³⁺(aq) + 3e⁻ ⇌ Au(s)",                                      e0: 1.50 },
    { name: "Chlorite",             symbol: "ClO₄⁻",    rxn: "ClO₄⁻(aq) + 8H⁺(aq) + 8e⁻ ⇌ Cl⁻(aq) + 4H₂O(l)",               e0: 1.39 },
    { name: "Chlorine",             symbol: "Cl₂",      rxn: "Cl₂(g) + 2e⁻ ⇌ 2Cl⁻(aq)",                                     e0: 1.36 },
    { name: "Nitrous Acid",         symbol: "HNO₂",     rxn: "2HNO₂(aq) + 4H⁺(aq) + 4e⁻ ⇌ N₂O(g) + 3H₂O(l)",                e0: 1.30 },
    { name: "Dichromate",           symbol: "Cr₂O₇²⁻",  rxn: "Cr₂O₇²⁻(aq) + 14H⁺(aq) + 6e⁻ ⇌ 2Cr³⁺(aq) + 7H₂O(l)",          e0: 1.23 },
    { name: "Oxygen (Acidic)",      symbol: "O₂",       rxn: "O₂(g) + 4H⁺(aq) + 4e⁻ ⇌ 2H₂O(l)",                             e0: 1.23 },
    { name: "Manganese(IV) Oxide",  symbol: "MnO₂",     rxn: "MnO₂(s) + 4H⁺(aq) + 2e⁻ ⇌ Mn²⁺(aq) + 2H₂O(l)",                e0: 1.22 },
    { name: "Iodate",               symbol: "IO₃⁻",     rxn: "2IO₃⁻(aq) + 12H⁺(aq) + 10e⁻ ⇌ I₂(s) + 6H₂O(l)",               e0: 1.20 },
    { name: "Bromine",              symbol: "Br₂",      rxn: "Br₂(l) + 2e⁻ ⇌ 2Br⁻(aq)",                                     e0: 1.07 },
    { name: "Nitrate",              symbol: "NO₃⁻",     rxn: "NO₃⁻ + 4H⁺ + 3e⁻ ⇌ NO + 2H₂O",                                e0:  0.96 }, 
    { name: "Mercury(II)",          symbol: "Hg²⁺",     rxn: "Hg²⁺(aq) + 2e⁻ ⇌ Hg(l)",                                      e0: 0.85 },
    { name: "Hypochlorite",         symbol: "ClO⁻",     rxn: "ClO⁻(aq) + H₂O(l) + 2e⁻ ⇌ Cl⁻(aq) + 2OH⁻(aq)",                e0: 0.84 },
    { name: "Silver",               symbol: "Ag⁺",      rxn: "Ag⁺(aq) + e⁻ ⇌ Ag(s)",                                        e0: 0.80 },
    { name: "Nitrate",              symbol: "NO₃⁻",     rxn: "NO₃⁻(aq) + 2H⁺(aq) + e⁻ ⇌ NO₂(g) + H₂O(l)",                   e0: 0.80 },
    { name: "Iron(III)",            symbol: "Fe³⁺",     rxn: "Fe³⁺(aq) + e⁻ ⇌ Fe²⁺(aq)",                                    e0: 0.77 },
    { name: "Hydrogen Peroxide",    symbol: "H₂O₂",     rxn: "O₂(g) + 2H⁺(aq) + 2e⁻ ⇌ H₂O₂(l)",                             e0: 0.70 },
    { name: "Permanganate (Basic)", symbol: "MnO₄⁻",    rxn: "MnO₄⁻(aq) + 2H₂O(l) + 3e⁻ ⇌ MnO₂(s) + 4OH⁻(aq)",              e0: 0.60 },
    { name: "Iodine",               symbol: "I₂",       rxn: "I₂(s) + 2e⁻ ⇌ 2I⁻(aq)",                                       e0: 0.54 },
    { name: "Copper(I)",            symbol: "Cu⁺",      rxn: "Cu⁺(aq) + e⁻ ⇌ Cu(s)",                                        e0: 0.52 },
    { name: "Oxygen (Basic)",       symbol: "O₂",       rxn: "O₂(g) + 2H₂O(l) + 4e⁻ ⇌ 4OH⁻(aq)",                            e0: 0.40 },
    { name: "Copper(II)",           symbol: "Cu²⁺",     rxn: "Cu²⁺(aq) + 2e⁻ ⇌ Cu(s)",                                      e0: 0.34 },
    { name: "Sulfate (Acidic)",     symbol: "SO₄²⁻",    rxn: "SO₄²⁻(aq) + 4H⁺(aq) + 2e⁻ ⇌ H₂SO₃(aq) + H₂O(l)",              e0: 0.17 },
    { name: "Tin(IV)",              symbol: "Sn⁴⁺",     rxn: "Sn⁴⁺(aq) + 2e⁻ ⇌ Sn²⁺(aq)",                                   e0: 0.15 },
    { name: "Sulfur",               symbol: "S",        rxn: "S(s) + 2H⁺(aq) + 2e⁻ ⇌ H₂S(aq)",                              e0: 0.14 },
    { name: "Silver Bromide",       symbol: "AgBr",     rxn: "AgBr(s) + e⁻ ⇌ Ag(s) + Br⁻(aq)",                              e0: 0.07 },
    { name: "Hydrogen (SHE)",       symbol: "H⁺",       rxn: "2H⁺(aq) + 2e⁻ ⇌ H₂(g)",                                       e0: 0.00 },
    { name: "Lead(II)",             symbol: "Pb²⁺",     rxn: "Pb²⁺(aq) + 2e⁻ ⇌ Pb(s)",                                      e0: -0.13 },
    { name: "Tin(II)",              symbol: "Sn²⁺",     rxn: "Sn²⁺(aq) + 2e⁻ ⇌ Sn(s)",                                      e0: -0.14 },
    { name: "Silver Iodide",        symbol: "AgI",      rxn: "AgI(s) + e⁻ ⇌ Ag(s) + I⁻(aq)",                                e0: -0.15 },
    { name: "Nickel(II)",           symbol: "Ni²⁺",     rxn: "Ni²⁺(aq) + 2e⁻ ⇌ Ni(s)",                                      e0: -0.26 },
    { name: "Cobalt(II)",           symbol: "Co²⁺",     rxn: "Co²⁺(aq) + 2e⁻ ⇌ Co(s)",                                      e0: -0.28 },
    { name: "Phosphoric Acid",      symbol: "H₃PO₄",    rxn: "H₃PO₄(aq) + 2H⁺(aq) + 2e⁻ ⇌ H₃PO₃(aq) + H₂O(l)",              e0: -0.28 },
    { name: "Lead(II) Sulfate",     symbol: "PbSO₄",    rxn: "PbSO₄(s) + 2e⁻ ⇌ Pb(s) + SO₄²⁻(aq)",                          e0: -0.36 },
    { name: "Selenium",             symbol: "Se",       rxn: "Se(s) + 2H⁺(aq) + 2e⁻ ⇌ H₂Se(aq)",                            e0: -0.40 },
    { name: "Cadmium(II)",          symbol: "Cd²⁺",     rxn: "Cd²⁺(aq) + 2e⁻ ⇌ Cd(s)",                                      e0: -0.40 },
    { name: "Chromium(III)",        symbol: "Cr³⁺",     rxn: "Cr³⁺(aq) + e⁻ ⇌ Cr²⁺(aq)",                                    e0: -0.41 },
    { name: "Iron(II)",             symbol: "Fe²⁺",     rxn: "Fe²⁺(aq) + 2e⁻ ⇌ Fe(s)",                                      e0: -0.44 },
    { name: "Silver Sulfide",       symbol: "Ag₂S",     rxn: "Ag₂S(s) + 2e⁻ ⇌ 2Ag(s) + S²⁻(aq)",                            e0: -0.69 },
    { name: "Chromium(III)",        symbol: "Cr³⁺",     rxn: "Cr³⁺(aq) + 3e⁻ ⇌ Cr(s)",                                      e0: -0.74 }, 
    { name: "Zinc",                 symbol: "Zn²⁺",     rxn: "Zn²⁺(aq) + 2e⁻ ⇌ Zn(s)",                                      e0: -0.76 },
    { name: "Tellurium",            symbol: "Te",       rxn: "Te(s) + 2H⁺(aq) + 2e⁻ ⇌ H₂Te(aq)",                            e0: -0.79 },
    { name: "Water (Reduction)",    symbol: "H₂O",      rxn: "2H₂O(l) + 2e⁻ ⇌ H₂(g) + 2OH⁻(aq)",                            e0: -0.83 },
    { name: "Chromium(II)",         symbol: "Cr²⁺",     rxn: "Cr²⁺(aq) + 2e⁻ ⇌ Cr(s)",                                      e0: -0.91 },
    { name: "Sulfite (Basic)",      symbol: "SO₃²⁻",    rxn: "SO₃²⁻(aq) + H₂O(l) + 2e⁻ ⇌ SO₃²⁻(aq) + 2OH⁻(aq)",             e0: -0.93 },
    { name: "Manganese(II)",        symbol: "Mn²⁺",     rxn: "Mn²⁺(aq) + 2e⁻ ⇌ Mn(s)",                                      e0: -1.18 }, 
    { name: "Aluminum",             symbol: "Al³⁺",     rxn: "Al³⁺(aq) + 3e⁻ ⇌ Al(s)",                                      e0: -1.66 },
    { name: "Magnesium",            symbol: "Mg²⁺",     rxn: "Mg²⁺(aq) + 2e⁻ ⇌ Mg(s)",                                      e0: -2.37 },
    { name: "Sodium",               symbol: "Na⁺",      rxn: "Na⁺(aq) + e⁻ ⇌ Na(s)",                                        e0: -2.71 },
    { name: "Calcium",              symbol: "Ca²⁺",     rxn: "Ca²⁺(aq) + 2e⁻ ⇌ Ca(s)",                                      e0: -2.87 },
    { name: "Barium",               symbol: "Ba²⁺",     rxn: "Ba²⁺(aq) + 2e⁻ ⇌ Ba(s)",                                      e0: -2.91 },
    { name: "Potassium",            symbol: "K⁺",       rxn: "K⁺(aq) + e⁻ ⇌ K(s)",                                          e0: -2.93 },
    { name: "Lithium",              symbol: "Li⁺",      rxn: "Li⁺(aq) + e⁻ ⇌ Li(s)",                                        e0: -3.04 }
]);

const chemFormulas = [
 
    // ── Stoichiometry & Moles ────────────────────────────────
 
    {
        name: "Molar Mass Relationship",
        category: "Stoichiometry",
        formula: "n = m / M",
        latex: "n = \\frac{m}{M}",
        variables: [
            { symbol: "n", name: "Amount of substance", unit: "mol" },
            { symbol: "m", name: "Mass", unit: "g" },
            { symbol: "M", name: "Molar mass", unit: "g/mol" }
        ],
        solve: {
            n: "m / M",
            m: "n * M",
            M: "m / n"
        }
    },
    {
        name: "Number of Particles",
        category: "Stoichiometry",
        formula: "N = n × Nₐ",
        latex: "N = n \\times N_A",
        variables: [
            { symbol: "N", name: "Number of particles", unit: "" },
            { symbol: "n", name: "Amount of substance", unit: "mol" },
            { symbol: "Na", name: "Avogadro's number", unit: "mol⁻¹", constant: 6.022e23 }
        ],
        solve: {
            N:  "n * Na",
            n:  "N / Na",
            Na: "N / n"
        }
    },
 
    // ── Gas Laws ─────────────────────────────────────────────
 
    {
        name: "Ideal Gas Law",
        category: "Gas Laws",
        formula: "PV = nRT",
        latex: "PV = nRT",
        variables: [
            { symbol: "P", name: "Pressure", unit: "kPa" },
            { symbol: "V", name: "Volume", unit: "L" },
            { symbol: "n", name: "Amount of substance", unit: "mol" },
            { symbol: "R", name: "Gas constant", unit: "L·kPa/(mol·K)", constant: 8.314 },
            { symbol: "T", name: "Temperature", unit: "K" }
        ],
        solve: {
            P: "( n * R * T ) / V",
            V: "( n * R * T ) / P",
            n: "( P * V ) / ( R * T )",
            T: "( P * V ) / ( n * R )",
            R: "( P * V ) / ( n * T )"
        }
    },
    {
        name: "Combined Gas Law",
        category: "Gas Laws",
        formula: "P₁V₁/T₁ = P₂V₂/T₂",
        latex: "\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}",
        variables: [
            { symbol: "P1", name: "Initial pressure", unit: "atm" },
            { symbol: "V1", name: "Initial volume", unit: "L" },
            { symbol: "T1", name: "Initial temperature", unit: "K" },
            { symbol: "P2", name: "Final pressure", unit: "atm" },
            { symbol: "V2", name: "Final volume", unit: "L" },
            { symbol: "T2", name: "Final temperature", unit: "K" }
        ],
        solve: {
            P1: "( P2 * V2 * T1 ) / ( T2 * V1 )",
            V1: "( P2 * V2 * T1 ) / ( T2 * P1 )",
            T1: "( P1 * V1 * T2 ) / ( P2 * V2 )",
            P2: "( P1 * V1 * T2 ) / ( T1 * V2 )",
            V2: "( P1 * V1 * T2 ) / ( T1 * P2 )",
            T2: "( P2 * V2 * T1 ) / ( P1 * V1 )"
        }
    },
    {
        name: "Graham's Law of Effusion",
        category: "Gas Laws",
        formula: "r₁/r₂ = √(M₂/M₁)",
        latex: "\\frac{r_1}{r_2} = \\sqrt{\\frac{M_2}{M_1}}",
        variables: [
            { symbol: "r1", name: "Rate of effusion (gas 1)", unit: "mol/s" },
            { symbol: "r2", name: "Rate of effusion (gas 2)", unit: "mol/s" },
            { symbol: "M1", name: "Molar mass (gas 1)", unit: "g/mol" },
            { symbol: "M2", name: "Molar mass (gas 2)", unit: "g/mol" }
        ],
        solve: {
            r1: "r2 * ( M2 / M1 ) ^ 0.5",
            r2: "r1 * ( M1 / M2 ) ^ 0.5",
            M1: "M2 * ( r2 / r1 ) ^ 2",
            M2: "M1 * ( r1 / r2 ) ^ 2"
        }
    },
 
    // ── Solutions & Concentration ────────────────────────────
 
    {
        name: "Molarity",
        category: "Solutions",
        formula: "C = n / V",
        latex: "C = \\frac{n}{V}",
        variables: [
            { symbol: "C", name: "Molarity (concentration)", unit: "mol/L" },
            { symbol: "n", name: "Moles of solute", unit: "mol" },
            { symbol: "V", name: "Volume of solution", unit: "L" }
        ],
        solve: {
            C: "n / V",
            n: "C * V",
            V: "n / C"
        }
    },
    {
        name: "Dilution Equation",
        category: "Solutions",
        formula: "C₁V₁ = C₂V₂",
        latex: "C_1 V_1 = C_2 V_2",
        variables: [
            { symbol: "C1", name: "Initial concentration", unit: "mol/L" },
            { symbol: "V1", name: "Initial volume", unit: "L" },
            { symbol: "C2", name: "Final concentration", unit: "mol/L" },
            { symbol: "V2", name: "Final volume", unit: "L" }
        ],
        solve: {
            C1: "( C2 * V2 ) / V1",
            V1: "( C2 * V2 ) / C1",
            C2: "( C1 * V1 ) / V2",
            V2: "( C1 * V1 ) / C2"
        }
    },
    {
        name: "Mass Percent",
        category: "Solutions",
        formula: "mass% = (m_solute / m_solution) × 100",
        latex: "\\text{mass\\%} = \\frac{m_{\\text{solute}}}{m_{\\text{solution}}} \\times 100",
        variables: [
            { symbol: "massPercent", name: "Mass percent", unit: "%" },
            { symbol: "mSolute", name: "Mass of solute", unit: "g" },
            { symbol: "mSolution", name: "Mass of solution", unit: "g" }
        ],
        solve: {
            massPercent: "( mSolute / mSolution ) * 100",
            mSolute: "( massPercent / 100 ) * mSolution",
            mSolution: "mSolute / ( massPercent / 100 )"
        }
    },
 
    // ── Thermochemistry ──────────────────────────────────────
 
    {
        name: "Heat Energy (q = mcΔT)",
        category: "Thermochemistry",
        formula: "q = mcΔT",
        latex: "q = mc\\Delta T",
        variables: [
            { symbol: "q", name: "Heat energy", unit: "J" },
            { symbol: "m", name: "Mass", unit: "g" },
            { symbol: "c", name: "Specific heat capacity", unit: "J/(g·°C)" },
            { symbol: "deltaT", name: "Temperature change", unit: "°C" }
        ],
        solve: {
            q:      "m * c * deltaT",
            m:      "q / ( c * deltaT )",
            c:      "q / ( m * deltaT )",
            deltaT: "q / ( m * c )"
        }
    },
    {
        name: "Enthalpy from Moles",
        category: "Thermochemistry",
        formula: "q = nΔH",
        latex: "q = n\\Delta H",
        variables: [
            { symbol: "q", name: "Heat energy", unit: "kJ" },
            { symbol: "n", name: "Moles", unit: "mol" },
            { symbol: "deltaH", name: "Molar enthalpy change", unit: "kJ/mol" }
        ],
        solve: {
            q:      "n * deltaH",
            n:      "q / deltaH",
            deltaH: "q / n"
        }
    },

    // ── Equilibrium ───────────────────────────────────

    {
        name: "Equilibrium Constant",
        category: "Equilibrium",
        formula: "K = [C]^c[D]^d / [A]^a[B]^b",
        latex: "K = \\frac{[\\text{C}]^c[\\text{D}]^d}{[\\text{A}]^a[\\text{B}]^b}",
        variables: [
            { symbol: "K", name: "Equilibrium constant", unit: "" },
            { symbol: "A", name: "Concentration of A", unit: "mol/L" },
            { symbol: "a", name: "Stoichiometric coefficient of A", unit: "" },
            { symbol: "B", name: "Concentration of B", unit: "mol/L" },
            { symbol: "b", name: "Stoichiometric coefficient of B", unit: "" },
            { symbol: "C", name: "Concentration of C", unit: "mol/L" },
            { symbol: "c", name: "Stoichiometric coefficient of C", unit: "" },
            { symbol: "D", name: "Concentration of D", unit: "mol/L" },
            { symbol: "d", name: "Stoichiometric coefficient of D", unit: "" }
        ],
        solve: {
            K:   "( C ^ c * D ^ d ) / ( A ^ a * B ^ b )",
            products: "K * ( A ^ a * B ^ b )",
            reactants: "( C ^ c * D ^ d ) / K"
        }
    },
 
    // ── Acids & Bases ────────────────────────────────────────
 
    {
        name: "pH Definition",
        category: "Acids & Bases",
        formula: "pH = −log[H⁺]",
        latex: "\\text{pH} = -\\log[H^+]",
        variables: [
            { symbol: "pH", name: "pH", unit: "" },
            { symbol: "H", name: "Hydrogen ion concentration", unit: "mol/L" }
        ],
        solve: {
            pH: "-1 * log10 ( H )",
            H:  "10 ^ ( -1 * pH )"
        }
    },
    {
        name: "pOH Definition",
        category: "Acids & Bases",
        formula: "pOH = −log[OH⁻]",
        latex: "\\text{pOH} = -\\log[OH^-]",
        variables: [
            { symbol: "pOH", name: "pOH", unit: "" },
            { symbol: "OH", name: "Hydroxide ion concentration", unit: "mol/L" }
        ],
        solve: {
            pOH: "-1 * log10 ( OH )",
            OH:  "10 ^ ( -1 * pOH )"
        }
    },
    {
        name: "pH + pOH Relationship",
        category: "Acids & Bases",
        formula: "pH + pOH = 14",
        latex: "\\text{pH} + \\text{pOH} = 14",
        variables: [
            { symbol: "pH", name: "pH", unit: "" },
            { symbol: "pOH", name: "pOH", unit: "" }
        ],
        solve: {
            pH:  "14 - pOH",
            pOH: "14 - pH"
        }
    },
    {
        name: "Water Autoionization (Kw)",
        category: "Acids & Bases",
        formula: "Kw = [H⁺][OH⁻]",
        latex: "K_w = [H^+][OH^-]",
        variables: [
            { symbol: "Kw", name: "Ion product of water", unit: "", constant: 1.0e-14 },
            { symbol: "H", name: "Hydrogen ion concentration", unit: "mol/L" },
            { symbol: "OH", name: "Hydroxide ion concentration", unit: "mol/L" }
        ],
        solve: {
            Kw: "H * OH",
            H:  "Kw / OH",
            OH: "Kw / H"
        }
    },
    {
        name: "Henderson-Hasselbalch (Acid Buffer)",
        category: "Acids & Bases",
        formula: "pH = pKa + log([A⁻]/[HA])",
        latex: "\\text{pH} = \\text{p}K_a + \\log\\frac{[A^-]}{[HA]}",
        variables: [
            { symbol: "pH", name: "pH", unit: "" },
            { symbol: "pKa", name: "Acid dissociation constant (pKa)", unit: "" },
            { symbol: "A", name: "Conjugate base concentration [A⁻]", unit: "mol/L" },
            { symbol: "HA", name: "Weak acid concentration [HA]", unit: "mol/L" }
        ],
        solve: {
            pH:  "pKa + log10 ( A / HA )",
            pKa: "pH - log10 ( A / HA )",
            A:   "HA * 10 ^ ( pH - pKa )",
            HA:  "A / 10 ^ ( pH - pKa )"
        }
    },
    {
        name: "Henderson-Hasselbalch (Base Buffer)",
        category: "Acids & Bases",
        formula: "pOH = pKb + log([BH⁺]/[B])",
        latex: "\\text{pOH} = \\text{p}K_b + \\log\\frac{[BH^+]}{[B]}",
        variables: [
            { symbol: "pOH", name: "pOH", unit: "" },
            { symbol: "pKb", name: "Base dissociation constant (pKb)", unit: "" },
            { symbol: "BH", name: "Conjugate acid concentration [BH⁺]", unit: "mol/L" },
            { symbol: "B", name: "Weak base concentration [B]", unit: "mol/L" }
        ],
        solve: {
            pOH: "pKb + log10 ( BH / B )",
            pKb: "pOH - log10 ( BH / B )",
            BH:  "B * 10 ^ ( pOH - pKb )",
            B:   "BH / 10 ^ ( pOH - pKb )"
        }
    },
  
    // ── Electrochemistry ────────────────────────────────────
 
    {
        name: "Standard Cell Potential",
        category: "Electrochemistry",
        formula: "E°cell = E°cathode − E°anode",
        latex: "E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}",
        variables: [
            { symbol: "Ecell", name: "Standard cell potential", unit: "V" },
            { symbol: "Ecathode", name: "Cathode reduction potential", unit: "V" },
            { symbol: "Eanode", name: "Anode reduction potential", unit: "V" }
        ],
        solve: {
            Ecell:    "Ecathode - Eanode",
            Ecathode: "Ecell + Eanode",
            Eanode:   "Ecathode - Ecell"
        }
    },
 
    // ── Reaction Rates ──────────────────────────────────────
 
    {
        name: "Average Rate of Reaction",
        category: "Kinetics",
        formula: "rate = Δ[concentration] / Δt",
        latex: "\\text{rate} = \\frac{\\Delta[\\text{conc}]}{\\Delta t}",
        variables: [
            { symbol: "rate", name: "Average rate", unit: "mol/(L·s)" },
            { symbol: "deltaC", name: "Change in concentration", unit: "mol/L" },
            { symbol: "deltaT", name: "Change in time", unit: "s" }
        ],
        solve: {
            rate:   "deltaC / deltaT",
            deltaC: "rate * deltaT",
            deltaT: "deltaC / rate"
        }
    },
    {
        name: "Zero-Order Rate Law (Differential)",
        category: "Kinetics",
        formula: "rate = k",
        latex: "\\text{rate} = k",
        variables: [
            { symbol: "rate", name: "Reaction rate", unit: "mol/(L·s)" },
            { symbol: "k", name: "Rate constant", unit: "mol/(L·s)" }
        ],
        solve: {
            rate: "k",
            k:    "rate"
        }
    },
    {
        name: "Zero-Order Integrated Rate Law",
        category: "Kinetics",
        formula: "[A] = [A]₀ − kt",
        latex: "[A] = [A]_0 - kt",
        variables: [
            { symbol: "A", name: "Concentration at time t", unit: "mol/L" },
            { symbol: "A0", name: "Initial concentration", unit: "mol/L" },
            { symbol: "k", name: "Rate constant", unit: "mol/(L·s)" },
            { symbol: "t", name: "Time", unit: "s" }
        ],
        solve: {
            A:  "A0 - k * t",
            A0: "A + k * t",
            k:  "( A0 - A ) / t",
            t:  "( A0 - A ) / k"
        }
    },
    {
        name: "Zero-Order Half-Life",
        category: "Kinetics",
        formula: "t½ = [A]₀ / 2k",
        latex: "t_{1/2} = \\frac{[A]_0}{2k}",
        variables: [
            { symbol: "tHalf", name: "Half-life", unit: "s" },
            { symbol: "A0", name: "Initial concentration", unit: "mol/L" },
            { symbol: "k", name: "Rate constant", unit: "mol/(L·s)" }
        ],
        solve: {
            tHalf: "A0 / ( 2 * k )",
            A0:    "2 * k * tHalf",
            k:     "A0 / ( 2 * tHalf )"
        }
    },
    {
        name: "First-Order Rate Law (Differential)",
        category: "Kinetics",
        formula: "rate = k[A]",
        latex: "\\text{rate} = k[A]",
        variables: [
            { symbol: "rate", name: "Reaction rate", unit: "mol/(L·s)" },
            { symbol: "k", name: "Rate constant", unit: "s⁻¹" },
            { symbol: "A", name: "Concentration [A]", unit: "mol/L" }
        ],
        solve: {
            rate: "k * A",
            k:    "rate / A",
            A:    "rate / k"
        }
    },
    {
        name: "First-Order Integrated Rate Law",
        category: "Kinetics",
        formula: "ln[A] = ln[A]₀ − kt",
        latex: "\\ln[A] = \\ln[A]_0 - kt",
        variables: [
            { symbol: "A", name: "Concentration at time t", unit: "mol/L" },
            { symbol: "A0", name: "Initial concentration", unit: "mol/L" },
            { symbol: "k", name: "Rate constant", unit: "s⁻¹" },
            { symbol: "t", name: "Time", unit: "s" }
        ],
        solve: {
            A:  "A0 * 2.718 ^ ( -1 * k * t )",
            A0: "A / 2.718 ^ ( -1 * k * t )",
            k:  "ln ( A0 / A ) / t",
            t:  "ln ( A0 / A ) / k"
        }
    },
    {
        name: "First-Order Half-Life",
        category: "Kinetics",
        formula: "t½ = ln(2) / k",
        latex: "t_{1/2} = \\frac{\\ln 2}{k}",
        variables: [
            { symbol: "tHalf", name: "Half-life", unit: "s" },
            { symbol: "k", name: "Rate constant", unit: "s⁻¹" }
        ],
        solve: {
            tHalf: "ln ( 2 ) / k",
            k:     "ln ( 2 ) / tHalf"
        }
    },
    {
        name: "Second-Order Rate Law (Differential)",
        category: "Kinetics",
        formula: "rate = k[A]²",
        latex: "\\text{rate} = k[A]^2",
        variables: [
            { symbol: "rate", name: "Reaction rate", unit: "mol/(L·s)" },
            { symbol: "k", name: "Rate constant", unit: "L/(mol·s)" },
            { symbol: "A", name: "Concentration [A]", unit: "mol/L" }
        ],
        solve: {
            rate: "k * A * A",
            k:    "rate / ( A * A )",
            A:    "sqrt ( rate / k )"
        }
    },
    {
        name: "Second-Order Integrated Rate Law",
        category: "Kinetics",
        formula: "1/[A] = 1/[A]₀ + kt",
        latex: "\\frac{1}{[A]} = \\frac{1}{[A]_0} + kt",
        variables: [
            { symbol: "A", name: "Concentration at time t", unit: "mol/L" },
            { symbol: "A0", name: "Initial concentration", unit: "mol/L" },
            { symbol: "k", name: "Rate constant", unit: "L/(mol·s)" },
            { symbol: "t", name: "Time", unit: "s" }
        ],
        solve: {
            A:  "1 / ( 1 / A0 + k * t )",
            A0: "1 / ( 1 / A - k * t )",
            k:  "( 1 / A - 1 / A0 ) / t",
            t:  "( 1 / A - 1 / A0 ) / k"
        }
    },
    {
        name: "Second-Order Half-Life",
        category: "Kinetics",
        formula: "t½ = 1 / (k[A]₀)",
        latex: "t_{1/2} = \\frac{1}{k[A]_0}",
        variables: [
            { symbol: "tHalf", name: "Half-life", unit: "s" },
            { symbol: "k", name: "Rate constant", unit: "L/(mol·s)" },
            { symbol: "A0", name: "Initial concentration", unit: "mol/L" }
        ],
        solve: {
            tHalf: "1 / ( k * A0 )",
            k:     "1 / ( tHalf * A0 )",
            A0:    "1 / ( k * tHalf )"
        }
    },
    {
        name: "Arrhenius Equation",
        category: "Kinetics",
        formula: "k = Ae^(−Ea/RT)",
        latex: "k = Ae^{-E_a / RT}",
        variables: [
            { symbol: "k", name: "Rate constant", unit: "varies" },
            { symbol: "A", name: "Pre-exponential factor (A)", unit: "varies" },
            { symbol: "Ea", name: "Activation energy", unit: "J/mol" },
            { symbol: "R", name: "Gas constant", unit: "J/(mol·K)", constant: 8.314 },
            { symbol: "T", name: "Temperature", unit: "K" }
        ],
        solve: {
            k:  "A * 2.718 ^ ( -Ea / ( R * T ) )",
            A:  "k / 2.718 ^ ( -Ea / ( R * T ) )",
            Ea: "-1 * R * T * log ( k / A )",
            T:  "-1 * Ea / ( R * log ( k / A ) )",
            R:  "-1 * Ea / ( T * log ( k / A ) )"
        }
    },
    {
        name: "Arrhenius Two-Temperature Form",
        category: "Kinetics",
        formula: "ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂)",
        latex: "\\ln\\frac{k_2}{k_1} = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)",
        variables: [
            { symbol: "k1", name: "Rate constant at T₁", unit: "varies" },
            { symbol: "k2", name: "Rate constant at T₂", unit: "varies" },
            { symbol: "Ea", name: "Activation energy", unit: "J/mol" },
            { symbol: "R", name: "Gas constant", unit: "J/(mol·K)", constant: 8.314 },
            { symbol: "T1", name: "Temperature 1", unit: "K" },
            { symbol: "T2", name: "Temperature 2", unit: "K" }
        ],
        solve: {
            k1: "k2 / 2.718 ^ ( ( Ea / R ) * ( 1 / T1 - 1 / T2 ) )",
            k2: "k1 * 2.718 ^ ( ( Ea / R ) * ( 1 / T1 - 1 / T2 ) )",
            Ea: "R * log ( k2 / k1 ) / ( 1 / T1 - 1 / T2 )",
            T1: "1 / ( log ( k2 / k1 ) * R / Ea + 1 / T2 )",
            T2: "1 / ( 1 / T1 - log ( k2 / k1 ) * R / Ea )",
            R:  "Ea * ( 1 / T1 - 1 / T2 ) / log ( k2 / k1 )"
        }
    }
];

//============================================================================
// Physics
 
const physFormulas = [

    // ── Kinematics ──────────────────────────────────────────
 
    {
        name: "Velocity (constant acceleration)",
        category: "Kinematics",
        formula: "v = v₀ + at",
        latex: "v = v_0 + at",
        variables: [
            { symbol: "v", name: "Final velocity", unit: "m/s" },
            { symbol: "v0", name: "Initial velocity", unit: "m/s" },
            { symbol: "a", name: "Acceleration", unit: "m/s²" },
            { symbol: "t", name: "Time", unit: "s" }
        ],
        solve: {
            v:  "v0 + a * t",
            v0: "v - a * t",
            a:  "( v - v0 ) / t",
            t:  "( v - v0 ) / a"
        }
    },
    {
        name: "Displacement (constant acceleration)",
        category: "Kinematics",
        formula: "d = v₀t + ½at²",
        latex: "d = v_0 t + \\frac{1}{2}at^2",
        variables: [
            { symbol: "d", name: "Displacement", unit: "m" },
            { symbol: "v0", name: "Initial velocity", unit: "m/s" },
            { symbol: "a", name: "Acceleration", unit: "m/s²" },
            { symbol: "t", name: "Time", unit: "s" }
        ],
        solve: {
            d:  "v0 * t + 0.5 * a * t * t",
            v0: "( d - 0.5 * a * t * t ) / t",
            a:  "2 * ( d - v0 * t ) / ( t * t )",
            t:  "( -1 * v0 + ( v0 * v0 + 2 * a * d ) ^ 0.5 ) / a"
        }
    },
    {
        name: "Velocity–Displacement (no time)",
        category: "Kinematics",
        formula: "v² = v₀² + 2ad",
        latex: "v^2 = v_0^2 + 2ad",
        variables: [
            { symbol: "v", name: "Final velocity", unit: "m/s" },
            { symbol: "v0", name: "Initial velocity", unit: "m/s" },
            { symbol: "a", name: "Acceleration", unit: "m/s²" },
            { symbol: "d", name: "Displacement", unit: "m" }
        ],
        solve: {
            v:  "( v0 * v0 + 2 * a * d ) ^ 0.5",
            v0: "( v * v - 2 * a * d ) ^ 0.5",
            a:  "( v * v - v0 * v0 ) / ( 2 * d )",
            d:  "( v * v - v0 * v0 ) / ( 2 * a )"
        }
    },
    {
        name: "Average Velocity",
        category: "Kinematics",
        formula: "v_avg = d / t",
        latex: "v_{\\text{avg}} = \\frac{d}{t}",
        variables: [
            { symbol: "vAvg", name: "Average velocity", unit: "m/s" },
            { symbol: "d", name: "Displacement", unit: "m" },
            { symbol: "t", name: "Time", unit: "s" }
        ],
        solve: {
            vAvg: "d / t",
            d:    "vAvg * t",
            t:    "d / vAvg"
        }
    },
 
    // ── Forces (Newton's Laws) ──────────────────────────────
 
    {
        name: "Newton's Second Law",
        category: "Forces",
        formula: "F = ma",
        latex: "F = ma",
        variables: [
            { symbol: "F", name: "Net force", unit: "N" },
            { symbol: "m", name: "Mass", unit: "kg" },
            { symbol: "a", name: "Acceleration", unit: "m/s²" }
        ],
        solve: {
            F: "m * a",
            m: "F / a",
            a: "F / m"
        }
    },
    {
        name: "Weight",
        category: "Forces",
        formula: "Fg = mg",
        latex: "F_g = mg",
        variables: [
            { symbol: "Fg", name: "Weight (gravitational force)", unit: "N" },
            { symbol: "m", name: "Mass", unit: "kg" },
            { symbol: "g", name: "Gravitational acceleration", unit: "m/s²", constant: 9.81 }
        ],
        solve: {
            Fg: "m * g",
            m:  "Fg / g",
            g:  "Fg / m"
        }
    },
    {
        name: "Friction Force",
        category: "Forces",
        formula: "f = μFₙ",
        latex: "f = \\mu F_n",
        variables: [
            { symbol: "f", name: "Friction force", unit: "N" },
            { symbol: "mu", name: "Coefficient of friction", unit: "" },
            { symbol: "Fn", name: "Normal force", unit: "N" }
        ],
        solve: {
            f:  "mu * Fn",
            mu: "f / Fn",
            Fn: "f / mu"
        }
    },
    {
        name: "Universal Gravitation",
        category: "Forces",
        formula: "F = Gm₁m₂ / r²",
        latex: "F = \\frac{Gm_1 m_2}{r^2}",
        variables: [
            { symbol: "F", name: "Gravitational force", unit: "N" },
            { symbol: "G", name: "Gravitational constant", unit: "N·m²/kg²", constant: 6.674e-11 },
            { symbol: "m1", name: "Mass 1", unit: "kg" },
            { symbol: "m2", name: "Mass 2", unit: "kg" },
            { symbol: "r", name: "Distance between centres", unit: "m" }
        ],
        solve: {
            F:  "( G * m1 * m2 ) / ( r * r )",
            m1: "( F * r * r ) / ( G * m2 )",
            m2: "( F * r * r ) / ( G * m1 )",
            r:  "( G * m1 * m2 ) / F ) ^ 0.5",
            G:  "( F * r * r ) / ( m1 * m2 )"
        }
    },
    {
        name: "Hooke's Law (Spring Force)",
        category: "Forces",
        formula: "Fs = −kx",
        latex: "F_s = -kx",
        variables: [
            { symbol: "Fs", name: "Spring force", unit: "N" },
            { symbol: "k", name: "Spring constant", unit: "N/m" },
            { symbol: "x", name: "Displacement from equilibrium", unit: "m" }
        ],
        solve: {
            Fs: "-1 * k * x",
            k:  "-1 * Fs / x",
            x:  "-1 * Fs / k"
        }
    },
 
    // ── Work, Energy & Power ────────────────────────────────
 
    {
        name: "Work",
        category: "Energy",
        formula: "W = Fd cos(θ)",
        latex: "W = Fd\\cos\\theta",
        variables: [
            { symbol: "W", name: "Work", unit: "J" },
            { symbol: "F", name: "Force", unit: "N" },
            { symbol: "d", name: "Displacement", unit: "m" },
            { symbol: "theta", name: "Angle (θ)", unit: "°" }
        ],
        solve: {
            W:     "F * d * cos ( theta * PI / 180 )",
            F:     "W / (d * cos ( theta * PI / 180 ) )",
            d:     "W / (F * cos ( theta * PI / 180 ) )",
            theta: "acos ( W / ( F * d ) ) * 180 / PI"
        }
    },
    {
        name: "Kinetic Energy",
        category: "Energy",
        formula: "KE = ½mv²",
        latex: "KE = \\frac{1}{2}mv^2",
        variables: [
            { symbol: "KE", name: "Kinetic energy", unit: "J" },
            { symbol: "m", name: "Mass", unit: "kg" },
            { symbol: "v", name: "Velocity", unit: "m/s" }
        ],
        solve: {
            KE: "0.5 * m * v * v",
            m:  "( 2 * KE ) / ( v * v )",
            v:  "( ( 2 * KE ) / m ) ^ 0.5"
        }
    },
    {
        name: "Gravitational Potential Energy",
        category: "Energy",
        formula: "PE = mgh",
        latex: "PE = mgh",
        variables: [
            { symbol: "PE", name: "Potential energy", unit: "J" },
            { symbol: "m", name: "Mass", unit: "kg" },
            { symbol: "g", name: "Gravitational acceleration", unit: "m/s²", constant: 9.81 },
            { symbol: "h", name: "Height", unit: "m" }
        ],
        solve: {
            PE: "m * g * h",
            m:  "PE / ( g * h )",
            g:  "PE / ( m * h )",
            h:  "PE / ( m * g )"
        }
    },
    {
        name: "Elastic Potential Energy",
        category: "Energy",
        formula: "PE = ½kx²",
        latex: "PE = \\frac{1}{2}kx^2",
        variables: [
            { symbol: "PE", name: "Elastic potential energy", unit: "J" },
            { symbol: "k", name: "Spring constant", unit: "N/m" },
            { symbol: "x", name: "Displacement", unit: "m" }
        ],
        solve: {
            PE: "0.5 * k * x * x",
            k:  "( 2 * PE ) / ( x * x )",
            x:  "( ( 2 * PE ) / k ) ^ 0.5"
        }
    },
    {
        name: "Power",
        category: "Energy",
        formula: "P = W / t",
        latex: "P = \\frac{W}{t}",
        variables: [
            { symbol: "P", name: "Power", unit: "W" },
            { symbol: "W", name: "Work (or energy)", unit: "J" },
            { symbol: "t", name: "Time", unit: "s" }
        ],
        solve: {
            P: "W / t",
            W: "P * t",
            t: "W / P"
        }
    },
 
    // ── Momentum & Impulse ──────────────────────────────────
 
    {
        name: "Momentum",
        category: "Momentum",
        formula: "p = mv",
        latex: "p = mv",
        variables: [
            { symbol: "p", name: "Momentum", unit: "kg·m/s" },
            { symbol: "m", name: "Mass", unit: "kg" },
            { symbol: "v", name: "Velocity", unit: "m/s" }
        ],
        solve: {
            p: "m * v",
            m: "p / v",
            v: "p / m"
        }
    },
    {
        name: "Impulse",
        category: "Momentum",
        formula: "J = FΔt = Δp",
        latex: "J = F\\Delta t = \\Delta p",
        variables: [
            { symbol: "J", name: "Impulse", unit: "N·s" },
            { symbol: "F", name: "Average force", unit: "N" },
            { symbol: "deltaT", name: "Time interval", unit: "s" }
        ],
        solve: {
            J:      "F * deltaT",
            F:      "J / deltaT",
            deltaT: "J / F"
        }
    },
 
    // ── Circular Motion ─────────────────────────────────────
 
    {
        name: "Centripetal Acceleration",
        category: "Circular Motion",
        formula: "ac = v² / r",
        latex: "a_c = \\frac{v^2}{r}",
        variables: [
            { symbol: "ac", name: "Centripetal acceleration", unit: "m/s²" },
            { symbol: "v", name: "Tangential velocity", unit: "m/s" },
            { symbol: "r", name: "Radius", unit: "m" }
        ],
        solve: {
            ac: "( v * v ) / r",
            v:  "( ac * r ) ^ 0.5",
            r:  "( v * v ) / ac"
        }
    },
    {
        name: "Centripetal Force",
        category: "Circular Motion",
        formula: "Fc = mv² / r",
        latex: "F_c = \\frac{mv^2}{r}",
        variables: [
            { symbol: "Fc", name: "Centripetal force", unit: "N" },
            { symbol: "m", name: "Mass", unit: "kg" },
            { symbol: "v", name: "Tangential velocity", unit: "m/s" },
            { symbol: "r", name: "Radius", unit: "m" }
        ],
        solve: {
            Fc: "( m * v * v ) / r",
            m:  "( Fc * r ) / ( v * v )",
            v:  "(( Fc * r ) / m ) ^ 0.5",
            r:  "( m * v * v ) / Fc"
        }
    },
    {
        name: "Period of Circular Motion",
        category: "Circular Motion",
        formula: "T = 2πr / v",
        latex: "T = \\frac{2\\pi r}{v}",
        variables: [
            { symbol: "T", name: "Period", unit: "s" },
            { symbol: "r", name: "Radius", unit: "m" },
            { symbol: "v", name: "Tangential velocity", unit: "m/s" }
        ],
        solve: {
            T: "( 2 * PI * r ) / v",
            r: "( T * v ) / ( 2 * PI )",
            v: "( 2 * PI * r ) / T"
        }
    },
    {
        name: "Frequency",
        category: "Circular Motion",
        formula: "f = 1 / T",
        latex: "f = \\frac{1}{T}",
        variables: [
            { symbol: "f", name: "Frequency", unit: "Hz" },
            { symbol: "T", name: "Period", unit: "s" }
        ],
        solve: {
            f: "1 / T",
            T: "1 / f"
        }
    },
 
    // ── Waves ───────────────────────────────────────────────
 
    {
        name: "Wave Speed",
        category: "Waves",
        formula: "v = fλ",
        latex: "v = f\\lambda",
        variables: [
            { symbol: "v", name: "Wave speed", unit: "m/s" },
            { symbol: "f", name: "Frequency", unit: "Hz" },
            { symbol: "lambda", name: "Wavelength (λ)", unit: "m" }
        ],
        solve: {
            v:      "f * lambda",
            f:      "v / lambda",
            lambda: "v / f"
        }
    },
    {
        name: "Snell's Law",
        category: "Waves",
        formula: "n₁ sin(θ₁) = n₂ sin(θ₂)",
        latex: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2",
        variables: [
            { symbol: "n1", name: "Refractive index (medium 1)", unit: "" },
            { symbol: "theta1", name: "Angle of incidence (θ₁)", unit: "°" },
            { symbol: "n2", name: "Refractive index (medium 2)", unit: "" },
            { symbol: "theta2", name: "Angle of refraction (θ₂)", unit: "°" }
        ],
        solve: {
            n1:     "( n2 * sin ( theta2 * PI / 180 ) ) / sin ( theta1 * PI / 180 )",
            theta1: "asin ( ( n2 * sin ( theta2 * PI / 180 ) ) / n1 ) * 180 / PI",
            n2:     "( n1 * sin ( theta1 * PI / 180 ) ) / sin ( theta2 * PI / 180 )",
            theta2: "asin ( ( n1 * sin ( theta1 * PI / 180 ) ) / n2 ) * 180 / PI"
        }
    },
 
    // ── Electricity ─────────────────────────────────────────
 
    {
        name: "Ohm's Law",
        category: "Electricity",
        formula: "V = IR",
        latex: "V = IR",
        variables: [
            { symbol: "V", name: "Voltage", unit: "V" },
            { symbol: "I", name: "Current", unit: "A" },
            { symbol: "R", name: "Resistance", unit: "Ω" }
        ],
        solve: {
            V: "I * R",
            I: "V / R",
            R: "V / I"
        }
    },
    {
        name: "Electrical Power",
        category: "Electricity",
        formula: "P = IV",
        latex: "P = IV",
        variables: [
            { symbol: "P", name: "Power", unit: "W" },
            { symbol: "I", name: "Current", unit: "A" },
            { symbol: "V", name: "Voltage", unit: "V" }
        ],
        solve: {
            P: "I * V",
            I: "P / V",
            V: "P / I"
        }
    },
    {
        name: "Electrical Power (resistance form)",
        category: "Electricity",
        formula: "P = I²R",
        latex: "P = I^2 R",
        variables: [
            { symbol: "P", name: "Power", unit: "W" },
            { symbol: "I", name: "Current", unit: "A" },
            { symbol: "R", name: "Resistance", unit: "Ω" }
        ],
        solve: {
            P: "I * I * R",
            I: "( P / R ) ^ 0.5",
            R: "P / ( I * I )"
        }
    },
    {
        name: "Electrical Energy",
        category: "Electricity",
        formula: "E = Pt",
        latex: "E = Pt",
        variables: [
            { symbol: "E", name: "Electrical energy", unit: "J" },
            { symbol: "P", name: "Power", unit: "W" },
            { symbol: "t", name: "Time", unit: "s" }
        ],
        solve: {
            E: "P * t",
            P: "E / t",
            t: "E / P"
        }
    },
    {
        name: "Charge",
        category: "Electricity",
        formula: "Q = It",
        latex: "Q = It",
        variables: [
            { symbol: "Q", name: "Charge", unit: "C" },
            { symbol: "I", name: "Current", unit: "A" },
            { symbol: "t", name: "Time", unit: "s" }
        ],
        solve: {
            Q: "I * t",
            I: "Q / t",
            t: "Q / I"
        }
    },
    {
        name: "Coulomb's Law",
        category: "Electricity",
        formula: "F = kq₁q₂ / r²",
        latex: "F = \\frac{kq_1 q_2}{r^2}",
        variables: [
            { symbol: "F", name: "Electrostatic force", unit: "N" },
            { symbol: "k", name: "Coulomb's constant", unit: "N·m²/C²", constant: 8.99e9 },
            { symbol: "q1", name: "Charge 1", unit: "C" },
            { symbol: "q2", name: "Charge 2", unit: "C" },
            { symbol: "r", name: "Distance", unit: "m" }
        ],
        solve: {
            F:  "( k * q1 * q2 ) / ( r * r )",
            q1: "( F * r * r ) / ( k * q2 )",
            q2: "( F * r * r ) / ( k * q1 )",
            r:  "( ( k * q1 * q2 ) / F ) ^ 0.5",
            k:  "( F * r * r ) / ( q1 * q2 )"
        }
    },
 
    // ── Torque & Rotational ─────────────────────────────────
 
    {
        name: "Torque",
        category: "Rotational Motion",
        formula: "τ = rF sin(θ)",
        latex: "\\tau = rF\\sin\\theta",
        variables: [
            { symbol: "tau", name: "Torque", unit: "N·m" },
            { symbol: "r", name: "Lever arm length", unit: "m" },
            { symbol: "F", name: "Force", unit: "N" },
            { symbol: "theta", name: "Angle (θ)", unit: "°" }
        ],
        solve: {
            tau:   "r * F * sin ( theta * PI / 180 )",
            r:     "tau / (F * sin ( theta * PI / 180 ) )",
            F:     "tau / (r * sin ( theta * PI / 180 ) )",
            theta: "asin ( tau / ( r * F ) ) * 180 / PI"
        }
    },
 
    // ── Thermal Physics ─────────────────────────────────────
 
    {
        name: "Heat Transfer (Q = mcΔT)",
        category: "Thermal Physics",
        formula: "Q = mcΔT",
        latex: "Q = mc\\Delta T",
        variables: [
            { symbol: "Q", name: "Heat transferred", unit: "J" },
            { symbol: "m", name: "Mass", unit: "kg" },
            { symbol: "c", name: "Specific heat capacity", unit: "J/(kg·°C)" },
            { symbol: "deltaT", name: "Temperature change", unit: "°C" }
        ],
        solve: {
            Q:      "m * c * deltaT",
            m:      "Q / ( c * deltaT )",
            c:      "Q / ( m * deltaT )",
            deltaT: "Q / ( m * c )"
        }
    },
    {
        name: "Latent Heat",
        category: "Thermal Physics",
        formula: "Q = mL",
        latex: "Q = mL",
        variables: [
            { symbol: "Q", name: "Heat for phase change", unit: "J" },
            { symbol: "m", name: "Mass", unit: "kg" },
            { symbol: "L", name: "Specific latent heat", unit: "J/kg" }
        ],
        solve: {
            Q: "m * L",
            m: "Q / L",
            L: "Q / m"
        }
    },
 
    // ── Simple Harmonic Motion ──────────────────────────────
 
    {
        name: "Period of a Pendulum",
        category: "Simple Harmonic Motion",
        formula: "T = 2π√(L/g)",
        latex: "T = 2\\pi\\sqrt{\\frac{L}{g}}",
        variables: [
            { symbol: "T", name: "Period", unit: "s" },
            { symbol: "L", name: "Length of pendulum", unit: "m" },
            { symbol: "g", name: "Gravitational acceleration", unit: "m/s²", constant: 9.81 }
        ],
        solve: {
            T: "2 * PI * ( L / g ) ^ 0.5",
            L: "g * ( T / (2 * PI) ) ^ 2",
            g: "L / ( T / (2 * PI) ) ^ 2"
        }
    },
    {
        name: "Period of a Mass-Spring System",
        category: "Simple Harmonic Motion",
        formula: "T = 2π√(m/k)",
        latex: "T = 2\\pi\\sqrt{\\frac{m}{k}}",
        variables: [
            { symbol: "T", name: "Period", unit: "s" },
            { symbol: "m", name: "Mass", unit: "kg" },
            { symbol: "k", name: "Spring constant", unit: "N/m" }
        ],
        solve: {
            T: "2 * PI * ( m / k ) ^ 0.5",
            m: "k * ( T / (2 * PI) ) ^ 2",
            k: "m / ( T / (2 * PI) ) ^ 2"
        }
    },
 
    // ── Modern Physics ──────────────────────────────────────
 
    {
        name: "Photon Energy",
        category: "Modern Physics",
        formula: "E = hf",
        latex: "E = hf",
        variables: [
            { symbol: "E", name: "Energy of photon", unit: "J" },
            { symbol: "h", name: "Planck's constant", unit: "J·s", constant: 6.626e-34 },
            { symbol: "f", name: "Frequency", unit: "Hz" }
        ],
        solve: {
            E: "h * f",
            h: "E / f",
            f: "E / h"
        }
    },
    {
        name: "de Broglie Wavelength",
        category: "Modern Physics",
        formula: "λ = h / p",
        latex: "\\lambda = \\frac{h}{p}",
        variables: [
            { symbol: "lambda", name: "Wavelength (λ)", unit: "m" },
            { symbol: "h", name: "Planck's constant", unit: "J·s", constant: 6.626e-34 },
            { symbol: "p", name: "Momentum", unit: "kg·m/s" }
        ],
        solve: {
            lambda: "h / p",
            h:      "lambda * p",
            p:      "h / lambda"
        }
    }
];

