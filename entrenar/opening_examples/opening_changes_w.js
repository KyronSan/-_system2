import { tableroInicial, DISPLAY_PIECES } from "./motor_ajedrez.js";

const tableroDiv = document.getElementById("tablero");

let tablero = tableroInicial();

/* ================================
   🎨 SKIN
================================ */

function aplicarSkin(miColor){

    if(miColor === "blancas"){
        DISPLAY_PIECES.w = {
            king:'♚', queen:'♛', rook:'♜',
            bishop:'♝', knight:'♞', pawn:'♟'
        };
    }

    if(miColor === "negras"){
        DISPLAY_PIECES.b = {
            king:'♔', queen:'♕', rook:'♖',
            bishop:'♗', knight:'♘', pawn:'♙'
        };
    }
}

/* ================================
   📥 RECIBIR DATOS (CLAVE DIRECTA)
================================ */

const params = new URLSearchParams(window.location.search);
const apertura = params.get("apertura"); // 🔥 YA ES CLAVE

const miColor = localStorage.getItem("color") || "blancas";

console.log("Apertura clave:", apertura);
console.log("Color jugador:", miColor);

aplicarSkin(miColor);

/* ================================
    🏷️ NOMBRES BONITOS DE APERTURAS
================================ */
const NOMBRES_APERTURAS = {
    italiana: "Italiana",
    espanola: "Española",
    escocesa: "Escocesa",
    vienesa: "Vienesa",
    gambitodama: "Gambito de Dama",
    londres: "Londres",
    indiorey: "Indio de Rey",
    inglesa: "Inglesa",
    reti: "Reti",
    trompowsky: "Trompowsky"
};

/* ================================
   ♟ APERTURAS BLANCAS
================================ */

const APERTURAS = {

    italiana: () => {
        tablero = tableroInicial();
        tablero[52] = ""; tablero[36] = "♙";
        tablero[12] = ""; tablero[28] = "♟";
        tablero[62] = ""; tablero[45] = "♘";
        tablero[1] = ""; tablero[18] = "♞";
        tablero[61] = ""; tablero[34] = "♗";
    },

    espanola: () => {
        tablero = tableroInicial();
        tablero[52] = ""; tablero[36] = "♙";
        tablero[12] = ""; tablero[28] = "♟";
        tablero[62] = ""; tablero[45] = "♘";
        tablero[1] = ""; tablero[18] = "♞";
        tablero[61] = ""; tablero[25] = "♗";
    },

    escocesa: () => {
        tablero = tableroInicial();
        tablero[52] = ""; tablero[36] = "♙";
        tablero[12] = ""; tablero[28] = "♟";
        tablero[62] = ""; tablero[45] = "♘";
        tablero[1] = ""; tablero[18] = "♞";
        tablero[51] = ""; tablero[35] = "♙";
    },

    vienesa: () => {
        tablero = tableroInicial();
        tablero[52] = ""; tablero[36] = "♙";
        tablero[12] = ""; tablero[28] = "♟";
        tablero[57] = ""; tablero[42] = "♘";
    },

    gambitodama: () => {
        tablero = tableroInicial();
        tablero[51] = ""; tablero[35] = "♙";
        tablero[11] = ""; tablero[27] = "♟";
        tablero[50] = ""; tablero[34] = "♙";
    },

    londres: () => {
        tablero = tableroInicial();
        tablero[51] = ""; tablero[35] = "♙";
        tablero[11] = ""; tablero[27] = "♟";
        tablero[58] = ""; tablero[42] = "♗";
    },

    indiorey: () => {
        tablero = tableroInicial();
        tablero[62] = ""; tablero[45] = "♘";
        tablero[54] = ""; tablero[38] = "♙";
        tablero[61] = ""; tablero[46] = "♗";
    },

    inglesa: () => {
        tablero = tableroInicial();
        tablero[50] = ""; tablero[34] = "♙";
    },

    reti: () => {
        tablero = tableroInicial();
        tablero[62] = ""; tablero[45] = "♘";
        tablero[50] = ""; tablero[34] = "♙";
    },

    trompowsky: () => {
        tablero = tableroInicial();
        tablero[51] = ""; tablero[35] = "♙";
        tablero[6] = ""; tablero[21] = "♞";
        tablero[59] = ""; tablero[31] = "♗";
    }
};

/* ================================
    📝 DESCRIPCIONES DE APERTURAS
================================ */
const DESCRIPCIONES = {
    italiana: "La Apertura Italiana se caracteriza por los movimientos e4 e5 Nf3 Nc6 Bc4, buscando un desarrollo rápido y control del centro.",
    espanola: "La Apertura Española (Ruy López) inicia con e4 e5 Nf3 Nc6 Bb5, con la idea de presionar al caballo defensor de e5 y preparar un ataque en el flanco de rey.",
    escocesa: "La Apertura Escocesa comienza con e4 e5 Nf3 Nc6 d4, buscando abrir el centro rápidamente y obtener ventaja de espacio.",
    vienesa: "La Apertura Vienesa se inicia con e4 e5 Nc3, permitiendo flexibilidad para un ataque rápido o desarrollo sólido.",
    gambitodama: "El Gambito de Dama comienza con d4 d5 c4, ofreciendo un peón para lograr control del centro y juego activo.",
    londres: "El Sistema Londres inicia con d4 d5 Bf4, buscando un desarrollo sólido y fácil coordinación de piezas.",
    indiorey: "El Ataque Indio de Rey se caracteriza por Nf3 g3 Bg2, con fianchetto del alfil de rey y un juego posicional seguro.",
    inglesa: "La Apertura Inglesa empieza con c4, enfocándose en controlar la casilla d5 y preparar un desarrollo flexible.",
    reti: "La Apertura Reti se desarrolla con Nf3 c4, buscando controlar el centro indirectamente y flexibilidad estratégica.",
    trompowsky: "La Apertura Trompowsky se inicia con d4 Nf6 Bg5, atacando inmediatamente al caballo defensor y preparando juego activo."
};

/* ================================
    🔥 APLICAR APERTURA
================================ */

if (APERTURAS[apertura]) {
    APERTURAS[apertura]();
}

/* ================================
    🔄 ACTUALIZAR PANEL DE DESCRIPCIÓN Y NOMBRE
================================ */
const descripcionDiv = document.getElementById("descripcion-apertura");
const nombreDiv = document.getElementById("nombre-apertura");

// Mostrar nombre bonito usando el mapa de nombres correcto
if(apertura && NOMBRES_APERTURAS[apertura]){
    nombreDiv.textContent = NOMBRES_APERTURAS[apertura];
} else {
    nombreDiv.textContent = "Desconocida";
}

if (DESCRIPCIONES[apertura]) {
    descripcionDiv.textContent = DESCRIPCIONES[apertura];
} else {
    descripcionDiv.textContent = "Descripción no disponible para esta apertura.";
}

/* ================================
    🎨 RENDER
================================ */

function render(){

    tableroDiv.innerHTML = "";

    for(let fila = 7; fila >= 0; fila--){

        for(let col = 0; col < 8; col++){

            const i = fila * 8 + col;

            const celda = document.createElement("div");
            celda.classList.add("celda");

            celda.classList.add(
                (fila + col) % 2 === 0 ? "blanca" : "negra"
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
}

render();