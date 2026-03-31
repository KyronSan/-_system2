/* ======================================================
    PIEZAS LÓGICAS (NO TOCAR)
====================================================== */

const PIECES = {
    w:{king:'♔',queen:'♕',rook:'♖',bishop:'♗',knight:'♘',pawn:'♙'},
    b:{king:'♚',queen:'♛',rook:'♜',bishop:'♝',knight:'♞',pawn:'♟'}
};

/* ======================================================
    PIEZAS VISUALES (PERSONALIZABLE)
    🔧 AQUÍ PUEDES CAMBIAR LOS SÍMBOLOS
====================================================== */

export const DISPLAY_PIECES = {
    w:{king:'♔',queen:'♕',rook:'♖',bishop:'♗',knight:'♘',pawn:'♙'},
    b:{king:'♚',queen:'♛',rook:'♜',bishop:'♝',knight:'♞',pawn:'♟'}
};

/* ======================================================
    CONVERSIÓN LÓGICA → VISUAL
====================================================== */

function visual(piece){

    for(const color in PIECES){
        for(const type in PIECES[color]){
            if(PIECES[color][type]===piece){
                return DISPLAY_PIECES[color][type];
            }
        }
    }

    return piece;
}

/* ======================================================
    ESTADO MOTOR
====================================================== */

let derechosEnroque = {
    blancas: { corto: true, largo: true },
    negras: { corto: true, largo: true }
};

export let enPassant = null;

/* ======================================================
    TABLERO INICIAL
====================================================== */

export function tableroInicial() {

    derechosEnroque = {
        blancas: { corto: true, largo: true },
        negras: { corto: true, largo: true }
    };

    enPassant = null;

    const base = [

        PIECES.b.rook,PIECES.b.knight,PIECES.b.bishop,PIECES.b.queen,PIECES.b.king,PIECES.b.bishop,PIECES.b.knight,PIECES.b.rook,
        PIECES.b.pawn,PIECES.b.pawn,PIECES.b.pawn,PIECES.b.pawn,PIECES.b.pawn,PIECES.b.pawn,PIECES.b.pawn,PIECES.b.pawn,

        "","","","","","","","",
        "","","","","","","","",
        "","","","","","","","",
        "","","","","","","","",

        PIECES.w.pawn,PIECES.w.pawn,PIECES.w.pawn,PIECES.w.pawn,PIECES.w.pawn,PIECES.w.pawn,PIECES.w.pawn,PIECES.w.pawn,
        PIECES.w.rook,PIECES.w.knight,PIECES.w.bishop,PIECES.w.queen,PIECES.w.king,PIECES.w.bishop,PIECES.w.knight,PIECES.w.rook

    ];

    return base;
}

/* ======================================================
    UTILIDADES
====================================================== */

function esBlanca(p){ return "♙♖♘♗♕♔".includes(p); }
function esNegra(p){ return "♟♜♞♝♛♚".includes(p); }

export function fila(i){ return Math.floor(i/8); }
function col(i){ return i%8; }

function dentro(f,c){ return f>=0 && f<8 && c>=0 && c<8; }

function copia(tab){ return [...tab]; }

function enemigo(turno){
    return turno==="blancas"?"negras":"blancas";
}

function reyDe(turno){
    return turno==="blancas"?"♔":"♚";
}

function piezaDeColor(turno,p){
    return turno==="blancas"?esBlanca(p):esNegra(p);
}

function piezaEnemiga(turno,p){
    return turno==="blancas"?esNegra(p):esBlanca(p);
}

/* ======================================================
    VALIDACIÓN DE MOVIMIENTOS
====================================================== */

export function movimientoValido(tablero, desde, hasta, turno){

    const pieza = tablero[desde];

    // resetear enPassant por defecto
    enPassant = null;
    if(!pieza) return false;
    if(!piezaDeColor(turno,pieza)) return false;

    const destino = tablero[hasta];
    if(destino && piezaDeColor(turno,destino)) return false;

    const df = fila(hasta)-fila(desde);
    const dc = col(hasta)-col(desde);

    /* ================= PEONES ================= */

    if(pieza==="♙"||pieza==="♟"){

        const dir = pieza==="♙"?-1:1;
        const filaInicial = pieza==="♙"?6:1;

        if(dc===0 && df===dir && !destino){
            return true;
        }

        if(dc===0 && df===2*dir && fila(desde)===filaInicial
        && !destino
        && !tablero[(fila(desde)+dir)*8+col(desde)]){

            // casilla vulnerable al paso
            enPassant = desde + dir*8;

            return true;
        }

        if(Math.abs(dc)===1 && df===dir){
            if(destino && piezaEnemiga(turno,destino)) return true;
            if(hasta===enPassant) return true;
        }

        return false;
    }

    /* ================= TORRE ================= */

    if(pieza==="♖"||pieza==="♜"){
        if(df===0 || dc===0){
            return caminoLibre(tablero,desde,hasta);
        }
        return false;
    }

    /* ================= ALFIL ================= */

    if(pieza==="♗"||pieza==="♝"){
        if(Math.abs(df)===Math.abs(dc)){
            return caminoLibre(tablero,desde,hasta);
        }
        return false;
    }

    /* ================= DAMA ================= */

    if(pieza==="♕"||pieza==="♛"){
        if(df===0||dc===0||Math.abs(df)===Math.abs(dc)){
            return caminoLibre(tablero,desde,hasta);
        }
        return false;
    }

    /* ================= CABALLO ================= */

    if(pieza==="♘"||pieza==="♞"){
        if((Math.abs(df)===2 && Math.abs(dc)===1) ||
            (Math.abs(df)===1 && Math.abs(dc)===2)){
            return true;
        }
        return false;
    }

    /* ================= REY ================= */

    if(pieza==="♔"||pieza==="♚"){

        if(Math.abs(df)<=1 && Math.abs(dc)<=1) return true;

        /* ===== ENROQUE BLANCAS CORTO ===== */

        if(turno==="blancas" && derechosEnroque.blancas.corto
        && desde===60 && hasta===62){

            if(!tablero[61] && !tablero[62]){

                if(!casillaAtacada(tablero,60,"negras") &&
                !casillaAtacada(tablero,61,"negras") &&
                !casillaAtacada(tablero,62,"negras")){
                    return true;
                }

            }
        }

        /* ===== ENROQUE BLANCAS LARGO ===== */

        if(turno==="blancas" && derechosEnroque.blancas.largo
        && desde===60 && hasta===58){

            if(!tablero[59] && !tablero[58] && !tablero[57]){

                if(!casillaAtacada(tablero,60,"negras") &&
                !casillaAtacada(tablero,59,"negras") &&
                !casillaAtacada(tablero,58,"negras")){
                    return true;
                }

            }
        }

        /* ===== ENROQUE NEGRAS CORTO ===== */

        if(turno==="negras" && derechosEnroque.negras.corto
        && desde===4 && hasta===6){

            if(!tablero[5] && !tablero[6]){

                if(!casillaAtacada(tablero,4,"blancas") &&
                !casillaAtacada(tablero,5,"blancas") &&
                !casillaAtacada(tablero,6,"blancas")){
                    return true;
                }

            }
        }

        /* ===== ENROQUE NEGRAS LARGO ===== */

        if(turno==="negras" && derechosEnroque.negras.largo
        && desde===4 && hasta===2){

            if(!tablero[3] && !tablero[2] && !tablero[1]){

                if(!casillaAtacada(tablero,4,"blancas") &&
                !casillaAtacada(tablero,3,"blancas") &&
                !casillaAtacada(tablero,2,"blancas")){
                    return true;
                }

            }
        }

        return false;
    }

    return false;
}

/* ======================================================
    CAMINO LIBRE
====================================================== */

function caminoLibre(tablero, desde, hasta){

    const df = Math.sign(fila(hasta)-fila(desde));
    const dc = Math.sign(col(hasta)-col(desde));

    let f=fila(desde)+df;
    let c=col(desde)+dc;

    while(f!==fila(hasta)||c!==col(hasta)){
        if(tablero[f*8+c]!=="") return false;
        f+=df;
        c+=dc;
    }

    return true;
}

function casillaAtacada(tablero, casilla, atacante){

    for(let i=0;i<64;i++){

        const p = tablero[i];

        if(!p) continue;

        if(atacante==="blancas" && !esBlanca(p)) continue;
        if(atacante==="negras" && !esNegra(p)) continue;

        if(movimientoValido(tablero,i,casilla,atacante)){
            return true;
        }

    }

    return false;
}

/* ======================================================
    JAQUE
====================================================== */

export function hayJaque(tablero, turno){

    const rey = reyDe(turno);
    const posRey = tablero.indexOf(rey);

    for(let i=0;i<64;i++){

        if(tablero[i] && piezaEnemiga(turno,tablero[i])){

            if(movimientoValido(tablero,i,posRey,enemigo(turno))){
                return true;
            }

        }

    }

    return false;
}

/* ======================================================
    JAQUE MATE
====================================================== */

export function hayJaqueMate(tablero, turno){

    if(!hayJaque(tablero,turno)) return false;

    for(let i=0;i<64;i++){

        if(tablero[i] && piezaDeColor(turno,tablero[i])){

            for(let j=0;j<64;j++){

                const enPassantBackup = enPassant;

                if(movimientoValido(tablero,i,j,turno)){

                    const copiaTab = copia(tablero);

                    copiaTab[j] = copiaTab[i];
                    copiaTab[i] = "";

                    if(!hayJaque(copiaTab,turno)){
                        enPassant = enPassantBackup;
                        return false;
                    }

                }

                enPassant = enPassantBackup;

            }

        }

    }

    return true;
}