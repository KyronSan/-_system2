import { tableroInicial, DISPLAY_PIECES } from "./motor_ajedrez.js";

const tableroDiv = document.getElementById("tablero");

let tablero = tableroInicial();

/* ================================
   🎨 SKIN (ANTES ERA skin.js)
================================ */

function aplicarSkin(miColor){

    console.log("aplicarSkin llamada con:", miColor);

    if(miColor === "blancas"){
        DISPLAY_PIECES.w = {
            king:'♚',
            queen:'♛',
            rook:'♜',
            bishop:'♝',
            knight:'♞',
            pawn:'♟'
        };
        console.log("Skin aplicada a blancas");
    }

    if(miColor === "negras"){
        DISPLAY_PIECES.b = {
            king:'♔',
            queen:'♕',
            rook:'♖',
            bishop:'♗',
            knight:'♘',
            pawn:'♙'
        };
        console.log("Skin aplicada a negras");
    }
}

/* ================================
   📥 RECIBIR DATOS
================================ */

const params = new URLSearchParams(window.location.search);
const aperturaURL = params.get("apertura");

const MAPEO_APERTURAS = {
    "Defensa Francesa": "Francesa",
    "Defensa Caro-Kann": "Caro-Kann",
    "Defensa Siciliana": "Siciliana",
    "Defensa Pirc": "Pirc",
    "Defensa India de Rey": "India de Rey",
    "Defensa Eslava": "Eslava",
    "Defensa Moderna": "Moderna",
    "Defensa Alekhine": "Alekhine",
    "Defensa Owen": "Owen",
    "Defensa Semi-Eslava": "Semi-Eslava"
};

const apertura = MAPEO_APERTURAS[aperturaURL];

const miColor = localStorage.getItem("color") || "blancas";

console.log("Apertura recibida:", apertura);
console.log("Color jugador:", miColor);

// 🔥 APLICAR SKIN
aplicarSkin(miColor);

/* ================================
    🏷️ NOMBRES BONITOS
================================ */
const NOMBRES_APERTURAS = {
    "Pirc":"Pirc",
    "Siciliana":"Siciliana",
    "Francesa":"Francesa",
    "Caro-Kann":"Caro-Kann",
    "India de Rey":"India de Rey",
    "Eslava":"Eslava",
    "Moderna":"Moderna",
    "Alekhine":"Alekhine",
    "Owen":"Owen",
    "Semi-Eslava":"Semi-Eslava"
};

/* ================================
    📝 DESCRIPCIONES
================================ */
const DESCRIPCIONES = {
    "Pirc":"La Defensa Pirc inicia con e4 d6, buscando desarrollo flexible y juego posicional.",
    "Siciliana":"La Defensa Siciliana comienza con e4 c5, buscando contrajuego activo en el flanco de dama.",
    "Francesa":"La Defensa Francesa comienza con e4 e6, buscando controlar el centro con d5.",
    "Caro-Kann":"La Defensa Caro-Kann inicia con e4 c6, buscando solidez y juego seguro.",
    "India de Rey":"La Defensa India de Rey comienza con d4 Nf6 c4 g6, con fianchetto del alfil de rey.",
    "Eslava":"La Defensa Eslava inicia con d4 d5 c4 c6, con desarrollo sólido y control del centro.",
    "Moderna":"La Defensa Moderna se caracteriza por e4 g6, buscando contrajuego flexible.",
    "Alekhine":"La Defensa Alekhine comienza con e4 Nf6, invitando a avanzar peones y contrajuego.",
    "Owen":"La Defensa Owen se inicia con e4 b6, con fianchetto del alfil de dama.",
    "Semi-Eslava":"La Semi-Eslava inicia con d4 d5 c4 e6 c6, con juego sólido y control central."
};

/* ================================
   ♟ APERTURAS DEFINIDAS
================================ */

const APERTURAS = {

    "Pirc": () => {
        tablero = tableroInicial();
        tablero[52] = ""; tablero[36] = "♙";
        tablero[11] = ""; tablero[27] = "♟";
    },

    "Siciliana": () => {
        tablero = tableroInicial();
        tablero[52] = ""; tablero[36] = "♙";
        tablero[10] = ""; tablero[26] = "♟";
    },

    "Francesa": () => {
        tablero = tableroInicial();
        tablero[52] = ""; tablero[36] = "♙";
        tablero[12] = ""; tablero[20] = "♟";
    },

    "Caro-Kann": () => {
        tablero = tableroInicial();
        tablero[52] = ""; tablero[36] = "♙";
        tablero[10] = ""; tablero[18] = "♟";
    },

    "India de Rey": () => {
        tablero = tableroInicial();
        tablero[51] = ""; tablero[35] = "♙";
        tablero[6] = ""; tablero[21] = "♞";
        tablero[50] = ""; tablero[34] = "♙";
        tablero[14] = ""; tablero[22] = "♟";
    },

    "Eslava": () => {
        tablero = tableroInicial();
        tablero[51] = ""; tablero[35] = "♙";
        tablero[11] = ""; tablero[27] = "♟";
        tablero[50] = ""; tablero[34] = "♙";
        tablero[10] = ""; tablero[18] = "♟";
    },

    "Moderna": () => {
        tablero = tableroInicial();
        tablero[52] = ""; tablero[36] = "♙";
        tablero[14] = ""; tablero[22] = "♟";
    },

    "Alekhine": () => {
        tablero = tableroInicial();
        tablero[52] = ""; tablero[36] = "♙";
        tablero[6] = ""; tablero[21] = "♞";
    },

    "Owen": () => {
        tablero = tableroInicial();
        tablero[52] = ""; tablero[36] = "♙";
        tablero[9] = ""; tablero[17] = "♟";
    },

    "Semi-Eslava": () => {
        tablero = tableroInicial();
        tablero[51] = ""; tablero[35] = "♙";
        tablero[11] = ""; tablero[27] = "♟";
        tablero[50] = ""; tablero[34] = "♙";
        tablero[12] = ""; tablero[20] = "♟";
        tablero[10] = ""; tablero[18] = "♟";
    }
};

/* ================================
   🔥 APLICAR APERTURA
================================ */

if (APERTURAS[apertura]) {
    APERTURAS[apertura]();
}

/* ================================
   🔄 PANEL (NOMBRE + DESCRIPCIÓN)
================================ */

const descripcionDiv = document.getElementById("descripcion-apertura");
const nombreDiv = document.getElementById("nombre-apertura");

if(nombreDiv){
    if(apertura && NOMBRES_APERTURAS[apertura]){
        nombreDiv.textContent = NOMBRES_APERTURAS[apertura];
    } else {
        nombreDiv.textContent = "Desconocida";
    }
}

if(descripcionDiv){
    if(apertura && DESCRIPCIONES[apertura]){
        descripcionDiv.textContent = DESCRIPCIONES[apertura];
    } else {
        descripcionDiv.textContent = "Descripción no disponible para esta apertura.";
    }
}

/* ================================
   🎨 RENDER (SIN CLICK)
================================ */

function render(){

    tableroDiv.innerHTML = "";

    for(let i=0;i<64;i++){

        const celda = document.createElement("div");
        celda.classList.add("celda");

        celda.classList.add(
            (Math.floor(i/8)+i%8)%2===0 ? "blanca" : "negra"
        );

        const pieza = tablero[i];

        if(pieza){

            if("♙♖♘♗♕♔".includes(pieza)){
                const tipo = {
                    "♙":"pawn","♖":"rook","♘":"knight",
                    "♗":"bishop","♕":"queen","♔":"king"
                }[pieza];

                celda.textContent = DISPLAY_PIECES.w[tipo];
                celda.classList.add("white-piece");
            }

            if("♟♜♞♝♛♚".includes(pieza)){
                const tipo = {
                    "♟":"pawn","♜":"rook","♞":"knight",
                    "♝":"bishop","♛":"queen","♚":"king"
                }[pieza];

                celda.textContent = DISPLAY_PIECES.b[tipo];
                celda.classList.add("black-piece");
            }
        }

        tableroDiv.appendChild(celda);
    }
}

render();