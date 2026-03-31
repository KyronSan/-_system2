import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

import { tableroInicial, movimientoValido, hayJaque, hayJaqueMate, fila, enPassant, DISPLAY_PIECES } from "./motor_ajedrez.js";
import { aplicarSkin } from "./skin.js";

const firebaseConfig = {
  apiKey: "AIzaSyD6h5bKHoUK9CXFRTlcL5jVlsIJVkMTNRQ",
  authDomain: "ajedrez-online-c86ad.firebaseapp.com",
  projectId: "ajedrez-online-c86ad",
  storageBucket: "ajedrez-online-c86ad.firebasestorage.app",
  messagingSenderId: "353967747429",
  appId: "1:353967747429:web:e25502a60e65f8cb72718c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let codigoPartida=null;
let tablero=[];
let turno="blancas";
let seleccion=null;
let miColor=null;

let modoEditor = false;
let stickerSeleccionado = null;

const crearBtn=document.getElementById("crearBtn");
const unirseBtn=document.getElementById("unirseBtn");
const codigoInput=document.getElementById("codigoInput");
const codigoGenerado=document.getElementById("codigoGenerado");
const estado=document.getElementById("estado");
const turnoTexto=document.getElementById("turnoTexto");
const tableroDiv=document.getElementById("tablero");

const blancasBtn=document.getElementById("blancasBtn");
const negrasBtn=document.getElementById("negrasBtn");

/* ===== BOTONES EDITOR ===== */

const editarBtn = document.getElementById("editarBtn");
const jugarBtn = document.getElementById("jugarBtn");
const stickers = document.querySelectorAll(".sticker");
const panelStickers = document.getElementById("panelStickers");
const limpiarTableroBtn = document.getElementById("limpiarTablero");

editarBtn.onclick = () => {

    modoEditor = true;

    editarBtn.classList.add("activo");
    jugarBtn.classList.remove("activo");

    estado.textContent = "Modo editor activado";

    panelStickers.style.opacity="1";
};

jugarBtn.onclick = () => {

    modoEditor = false;
    stickerSeleccionado = null;

    jugarBtn.classList.add("activo");
    editarBtn.classList.remove("activo");

    estado.textContent = "Modo juego activado";

    panelStickers.style.opacity="0.3";
};

stickers.forEach(btn => {

    btn.onclick = () => {

        if(!modoEditor) return;

        stickerSeleccionado = btn.dataset.piece;

        /* quitar selección previa */
        stickers.forEach(s => s.classList.remove("activo"));

        /* marcar sticker actual */
        btn.classList.add("activo");

        console.log("Sticker seleccionado:", stickerSeleccionado);

    };

});

/* ===== SELECCION COLOR ===== */

blancasBtn.onclick = () => {
    miColor = "blancas";
    estado.textContent = "Jugarás con piezas blancas";
    document.getElementById("boardWrapper").classList.remove("rotated");
    render();
};

negrasBtn.onclick = () => {
    miColor = "negras";
    estado.textContent = "Jugarás con piezas negras";
    document.getElementById("boardWrapper").classList.add("rotated");
    render();
};

function generarCodigo(){
    return Math.random().toString(36).substring(2,7).toUpperCase();
}

function elegirPromocion(color){

    return new Promise(resolve => {

        const piezas = color==="blancas"
        ? ["♕","♖","♗","♘"]
        : ["♛","♜","♝","♞"];

        const fondo = document.createElement("div");
        fondo.style.position="fixed";
        fondo.style.top="0";
        fondo.style.left="0";
        fondo.style.width="100%";
        fondo.style.height="100%";
        fondo.style.background="rgba(0,0,0,0.6)";
        fondo.style.display="flex";
        fondo.style.alignItems="center";
        fondo.style.justifyContent="center";
        fondo.style.zIndex="9999";

        const caja = document.createElement("div");
        caja.style.background="#222";
        caja.style.padding="20px";
        caja.style.borderRadius="10px";
        caja.style.display="flex";
        caja.style.gap="20px";
        caja.style.fontSize="40px";

        piezas.forEach(p => {

            const btn=document.createElement("div");
            btn.textContent=p;
            btn.style.cursor="pointer";

            btn.onclick=()=>{
                document.body.removeChild(fondo);
                resolve(p);
            };

            caja.appendChild(btn);

        });

        fondo.appendChild(caja);
        document.body.appendChild(fondo);

    });

}

function render(){

    if(miColor) aplicarSkin(miColor);

    tableroDiv.innerHTML="";
    turnoTexto.textContent="Turno: "+turno;

    for(let i=0;i<64;i++){

        const index = miColor==="negras" ? 63-i : i;

        const celda=document.createElement("div");
        celda.classList.add("celda");
        celda.classList.add((Math.floor(index/8)+index%8)%2===0?"blanca":"negra");

        if(index===seleccion) celda.classList.add("seleccionada");

        const pieza = tablero[index];

        if(pieza){

            if("♙♖♘♗♕♔".includes(pieza)){

                const tipo = {
                    "♙":"pawn",
                    "♖":"rook",
                    "♘":"knight",
                    "♗":"bishop",
                    "♕":"queen",
                    "♔":"king"
                }[pieza];

                celda.textContent = DISPLAY_PIECES.w[tipo];
                celda.classList.add("white-piece");
            }

            if("♟♜♞♝♛♚".includes(pieza)){

                const tipo = {
                    "♟":"pawn",
                    "♜":"rook",
                    "♞":"knight",
                    "♝":"bishop",
                    "♛":"queen",
                    "♚":"king"
                }[pieza];

                celda.textContent = DISPLAY_PIECES.b[tipo];
                celda.classList.add("black-piece");
            }

        }

        celda.onclick=()=>clickCelda(index);
        tableroDiv.appendChild(celda);
    }
}

async function clickCelda(i){

    /* ===== MODO EDITOR ===== */

    if(modoEditor){

        if(!stickerSeleccionado) return;

        if(stickerSeleccionado==="delete"){
            tablero[i]="";
        }
        else{
            tablero[i]=stickerSeleccionado;
        }

        render();
        return;
    }

    /* ===== MODO JUEGO ===== */


    if(seleccion===null){
        seleccion=i;
    }else{

        const piezaSeleccionada = tablero[seleccion];

        let colorMovimiento =
            "♙♖♘♗♕♔".includes(piezaSeleccionada)
            ? "blancas"
            : "negras";

        if(movimientoValido(tablero,seleccion,i,colorMovimiento)){

            const copia=[...tablero];
            const pieza = copia[seleccion];

            copia[i] = pieza;
            copia[seleccion] = "";

            if(i === enPassant){

                if(pieza === "♙") copia[i+8] = "";
                if(pieza === "♟") copia[i-8] = "";

            }

            if(pieza==="♔" && seleccion===60 && i===62){
                copia[61] = copia[63];
                copia[63] = "";
            }

            if(pieza==="♔" && seleccion===60 && i===58){
                copia[59] = copia[56];
                copia[56] = "";
            }

            if(pieza==="♚" && seleccion===4 && i===6){
                copia[5] = copia[7];
                copia[7] = "";
            }

            if(pieza==="♚" && seleccion===4 && i===2){
                copia[3] = copia[0];
                copia[0] = "";
            }

            if(!hayJaque(copia,colorMovimiento)){

                if(pieza === "♙" && fila(i) === 0){
                    copia[i] = await elegirPromocion("blancas");
                }

                if(pieza === "♟" && fila(i) === 7){
                    copia[i] = await elegirPromocion("negras");
                }

                tablero = copia;

                guardar();
            }
        }

        seleccion=null;
    }

    render();
}

async function guardar(){
    await setDoc(doc(db,"partidas",codigoPartida),{
        tablero,
        turno,
        blancas: miColor==="blancas",
        negras: miColor==="negras"
    },{merge:true});
}

function escuchar(){

    onSnapshot(doc(db,"partidas",codigoPartida),(snap)=>{

        if(snap.exists()){

            const data=snap.data();
            tablero=data.tablero;
            turno=data.turno;

            if(hayJaqueMate(tablero,turno)){
                estado.textContent="JAQUE MATE - Ganan "+
                    (turno==="blancas"?"negras":"blancas");
            }

            else if(hayJaque(tablero,turno)){
                estado.textContent="JAQUE a "+turno;
            }

            else{
                estado.textContent="";
            }

            render();
        }
    });
}

crearBtn.onclick=async()=>{

    if(!miColor){
        estado.textContent="Debes seleccionar un color de pieza primero";
        return;
    }

    codigoPartida=generarCodigo();
    codigoGenerado.textContent="Código: "+codigoPartida;

    estado.textContent="Esperando jugador...";

    tablero=tableroInicial();
    turno="blancas";

    await guardar();
    escuchar();
};

unirseBtn.onclick=async()=>{

    codigoPartida=codigoInput.value.toUpperCase();

    const ref = doc(db,"partidas",codigoPartida);
    const snap = await getDoc(ref);

    if(!snap.exists()){
        estado.textContent="Partida no encontrada";
        return;
    }

    const data = snap.data();

    if(data.blancas){
        miColor="negras";
    }else{
        miColor="blancas";
    }

    estado.textContent="Conectado como "+miColor;

    render();
    escuchar();
};

/* ===== LIMPIAR TABLERO ===== */

limpiarTableroBtn.onclick = () => {

    if(!modoEditor) return;

    tablero = Array(64).fill("");
    seleccion = null;

    render();

};