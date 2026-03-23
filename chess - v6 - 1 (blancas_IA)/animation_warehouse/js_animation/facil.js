(function(){

const AI_STATE = {
    mirrorChecked: false,
    moveCount: 0,
    lastMoves: [],
    fiftyRuleWarnedSelf: false,
    fiftyRuleMockedEnemy: false
};

function pick(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}

function speakFrom(arr){
    if(!window.loadedCharacter) return;
    const d = pick(arr);
    window.loadedCharacter.dialogos = [d];
    if(typeof window.typeText === "function"){
        window.typeText(d);
    }
}

/* ===== DIALOGOS INICIALES ===== */
const START_DIALOGS = [
    {texto:"Hola.\nVeo tus movimientos.\nAprendamos juntos.",emocion:"hablar"},
    {texto:"Bienvenido.\nCada jugada tuya cuenta.\nAnalicemos con calma.",emocion:"hablar"},
    {texto:"Empecemos.\nTus decisiones marcarán la partida.",emocion:"hablar"},
    {texto:"No tengas prisa.\nObservo cada jugada que haces.",emocion:"hablar"},
    {texto:"Estoy listo.\nQue tus movimientos me enseñen.",emocion:"hablar"},
    {texto:"Una nueva partida.\nTus estrategias me interesan.",emocion:"hablar"},
    {texto:"Aquí estoy.\nAprenderemos de cada jugada tuya.",emocion:"hablar"},
    {texto:"Comencemos.\nTus movimientos guiarán esta historia.",emocion:"hablar"},
    {texto:"Hola otra vez.\nVeo cómo planeas cada pieza.",emocion:"hablar"},
    {texto:"Bien.\nQue tus acciones hablen primero.",emocion:"hablar"}
];

window.registerCharacter({
    codigo:"facil",
    dialogos:[pick(START_DIALOGS)]
});

/* ===== MOVIMIENTOS DEL JUGADOR ===== */
const PAWN_MOVES = [
    {texto:"Veo cómo avanzas tu peón.",emocion:"hablar"},
    {texto:"Tu peón abre camino.\nInteresante.",emocion:"hablar"},
    {texto:"Avanzaste un peón.\nObservando...",emocion:"hablar"},
    {texto:"Peón en marcha.\nAprendiendo de ti.",emocion:"hablar"},
    {texto:"Buen movimiento de peón.",emocion:"hablar"},
    {texto:"Tus peones construyen la posición.",emocion:"hablar"},
    {texto:"Peón avanzado. Lo noto.",emocion:"hablar"},
    {texto:"Interesante empuje de peón.",emocion:"hablar"},
    {texto:"Paso a paso con tus peones.",emocion:"hablar"},
    {texto:"Tus peones cumplen su función.",emocion:"hablar"}
];

const KNIGHT_MOVES = [
    {texto:"Tu caballo hace un salto curioso.",emocion:"sorprendido"},
    {texto:"Veo el movimiento de tu caballo.",emocion:"sorprendido"},
    {texto:"Un salto inesperado de tu caballo.",emocion:"sorprendido"},
    {texto:"Tu caballo sorprende.",emocion:"sorprendido"},
    {texto:"Buen salto de tu caballo.",emocion:"sorprendido"},
    {texto:"Interesante recorrido con el caballo.",emocion:"sorprendido"},
    {texto:"Tu caballo avanza ágilmente.",emocion:"sorprendido"},
    {texto:"Movimiento creativo de caballo.",emocion:"sorprendido"},
    {texto:"Veo tu caballo bien usado.",emocion:"sorprendido"},
    {texto:"Saltos precisos con tu caballo.",emocion:"sorprendido"}
];

const BISHOP_MOVES = [
    {texto:"Tu alfil entra en acción.",emocion:"hablar"},
    {texto:"Diagonal limpia de tu alfil.",emocion:"hablar"},
    {texto:"Buen movimiento de alfil.",emocion:"hablar"},
    {texto:"Veo la posición de tu alfil.",emocion:"hablar"},
    {texto:"Tu alfil apunta lejos.",emocion:"hablar"},
    {texto:"Alfil activo y bien colocado.",emocion:"hablar"},
    {texto:"Controlando diagonales con tu alfil.",emocion:"hablar"},
    {texto:"Movimiento estratégico de alfil.",emocion:"hablar"},
    {texto:"Alfil en buena posición.",emocion:"hablar"},
    {texto:"Tu alfil se mueve tranquilamente.",emocion:"hablar"}
];

const ROOK_MOVES = [
    {texto:"Tu torre gana actividad.",emocion:"hablar"},
    {texto:"Buen desplazamiento de torre.",emocion:"hablar"},
    {texto:"Veo tu torre bien posicionada.",emocion:"hablar"},
    {texto:"Movimiento sólido de torre.",emocion:"hablar"},
    {texto:"La torre entra en juego.",emocion:"hablar"},
    {texto:"Desplazamiento estratégico de torre.",emocion:"hablar"},
    {texto:"Tu torre se libera.",emocion:"hablar"},
    {texto:"Buen control con la torre.",emocion:"hablar"},
    {texto:"La torre se posiciona bien.",emocion:"hablar"},
    {texto:"Movimiento estable de torre.",emocion:"hablar"}
];

const QUEEN_MOVES = [
    {texto:"Tu dama hace un movimiento poderoso.",emocion:"sorprendido"},
    {texto:"Veo cómo mueves la dama.",emocion:"sorprendido"},
    {texto:"Movimiento importante de tu dama.",emocion:"sorprendido"},
    {texto:"Tu dama toma espacio.",emocion:"sorprendido"},
    {texto:"Uso estratégico de la dama.",emocion:"sorprendido"},
    {texto:"Tu dama observa el tablero.",emocion:"sorprendido"},
    {texto:"Buen control con la dama.",emocion:"sorprendido"},
    {texto:"La dama en acción.",emocion:"sorprendido"},
    {texto:"Movimiento arriesgado de dama.",emocion:"sorprendido"},
    {texto:"Dama bien posicionada.",emocion:"sorprendido"}
];

const KING_MOVES = [
    {texto:"Tu rey se mueve con cuidado.",emocion:"triste"},
    {texto:"Veo la posición de tu rey.",emocion:"triste"},
    {texto:"Movimiento delicado de rey.",emocion:"triste"},
    {texto:"Tu rey cambia de lugar.",emocion:"triste"},
    {texto:"Protegiendo tu rey.",emocion:"triste"},
    {texto:"Decisión arriesgada con tu rey.",emocion:"triste"},
    {texto:"El rey se expone un poco.",emocion:"triste"},
    {texto:"Atento a tu rey.",emocion:"triste"},
    {texto:"Movimientos clave del rey.",emocion:"triste"},
    {texto:"Tu rey avanza estratégicamente.",emocion:"triste"}
];

/* ===== CAPTURAS DEL JUGADOR ===== */
const CAPTURE_LIGHT = [
    {texto:"Capturaste una pieza pequeña.",emocion:"hablar"},
    {texto:"Pequeña ganancia para ti.",emocion:"hablar"},
    {texto:"Intercambio leve, lo noto.",emocion:"hablar"},
    {texto:"Captura simple.",emocion:"hablar"},
    {texto:"Pieza menor capturada.",emocion:"hablar"},
    {texto:"Movimiento útil con captura.",emocion:"hablar"},
    {texto:"Un peón menos para mí.",emocion:"hablar"},
    {texto:"Intercambio ligero.",emocion:"hablar"},
    {texto:"Sumaste una pieza.",emocion:"hablar"},
    {texto:"Pequeña acción efectiva.",emocion:"hablar"}
];

const CAPTURE_MEDIUM = [
    {texto:"Intercambio importante a tu favor.",emocion:"sorprendido"},
    {texto:"Pieza relevante capturada.",emocion:"sorprendido"},
    {texto:"Movimiento notable del oponente.",emocion:"sorprendido"},
    {texto:"Captura significativa.",emocion:"sorprendido"},
    {texto:"Lo siento, esa pieza era clave.",emocion:"sorprendido"},
    {texto:"Buen movimiento estratégico.",emocion:"sorprendido"},
    {texto:"Captura interesante.",emocion:"sorprendido"},
    {texto:"Cambio de posición importante.",emocion:"sorprendido"},
    {texto:"Movimiento clave detectado.",emocion:"sorprendido"},
    {texto:"Pieza relevante tomada.",emocion:"sorprendido"}
];

const CAPTURE_HEAVY = [
    {texto:"Pérdida fuerte de pieza.",emocion:"llorando"},
    {texto:"Vaya golpe en el tablero.",emocion:"llorando"},
    {texto:"Gran impacto con tu captura.",emocion:"llorando"},
    {texto:"Pieza muy valiosa fuera.",emocion:"llorando"},
    {texto:"Eso cambia la partida.",emocion:"llorando"},
    {texto:"Consecuencia importante.",emocion:"llorando"},
    {texto:"Difícil de recuperar.",emocion:"llorando"},
    {texto:"Pérdida significativa.",emocion:"llorando"},
    {texto:"Momento crítico en el tablero.",emocion:"llorando"},
    {texto:"Eso pesa mucho.",emocion:"llorando"}
];

/* ===== CHECKS, ENROQUES, CORONACIONES ===== */
const CHECK_DIALOGS = Array.from({length:10},(_,i)=>({texto:`¡Cuidado!\nJaque de tu parte (${i+1}).`,emocion:"sorprendido"}));
const CHECKMATE_WIN = Array.from({length:10},(_,i)=>({texto:`Jaque mate.\nBien jugado por ti (${i+1}).`,emocion:"triste"}));
const CHECKMATE_LOSE = Array.from({length:10},(_,i)=>({texto:`Jaque mate.\nAprendamos (${i+1}).`,emocion:"hablar"}));
const CASTLE_DIALOGS = Array.from({length:10},(_,i)=>({texto:`Buen enroque del jugador (${i+1}).`,emocion:"hablar"}));
const PROMOTION_PLAYER = Array.from({length:10},(_,i)=>({texto:`¡Coronación tuya! (${i+1}).`,emocion:"sorprendido"}));
const PROMOTION_AI = Array.from({length:10},(_,i)=>({texto:`He coronado yo (${i+1}).`,emocion:"hablar"}));
const EN_PASSANT_DIALOGS = Array.from({length:10},(_,i)=>({texto:`Captura al paso de tu parte (${i+1}).`,emocion:"sorprendido"}));
const MIRROR_DIALOGS = Array.from({length:10},(_,i)=>({texto:`Partida espejo de tus movimientos (${i+1}).`,emocion:"sorprendido"}));
const FIFTY_SELF = Array.from({length:10},(_,i)=>({texto:`Muchas jugadas tuyas (${i+1}).`,emocion:"triste"}));
const FIFTY_ENEMY = Array.from({length:10},(_,i)=>({texto:`Pocas capturas tuyas (${i+1}).`,emocion:"hablar"}));

/* ===== IA FACIL ===== */
window.AI_FACIL = {
    onMove(piece){
        ({
            pawn:PAWN_MOVES,
            knight:KNIGHT_MOVES,
            bishop:BISHOP_MOVES,
            rook:ROOK_MOVES,
            queen:QUEEN_MOVES,
            king:KING_MOVES
        }[piece]) && speakFrom({
            pawn:PAWN_MOVES,
            knight:KNIGHT_MOVES,
            bishop:BISHOP_MOVES,
            rook:ROOK_MOVES,
            queen:QUEEN_MOVES,
            king:KING_MOVES
        }[piece]);
    },
    onCapture(piece){
        const s={pawn:1,knight:2,bishop:2,rook:3,queen:4}[piece]||1;
        speakFrom(s<=1?CAPTURE_LIGHT:s<=3?CAPTURE_MEDIUM:CAPTURE_HEAVY);
    },
    onCheck(){speakFrom(CHECK_DIALOGS);},
    onCheckMate(w){speakFrom(w==="player"?CHECKMATE_WIN:CHECKMATE_LOSE);},
    onCastle(){speakFrom(CASTLE_DIALOGS);},
    onPromotion(w){speakFrom(w==="player"?PROMOTION_PLAYER:PROMOTION_AI);},
    onEnPassant(){speakFrom(EN_PASSANT_DIALOGS);},
    onMoveHistory(m){
        if(AI_STATE.mirrorChecked) return;
        AI_STATE.lastMoves.push(m);
        if(AI_STATE.lastMoves.length===6){
            const[a,b,c,d,e,f]=AI_STATE.lastMoves;
            if(a===b&&c===d&&e===f)speakFrom(MIRROR_DIALOGS);
            AI_STATE.mirrorChecked=true;
        }
    },
    onFiftyRule(_,a){
        if(a==="self"&&!AI_STATE.fiftyRuleWarnedSelf){speakFrom(FIFTY_SELF);AI_STATE.fiftyRuleWarnedSelf=true;}
        if(a==="enemy"&&!AI_STATE.fiftyRuleMockedEnemy){speakFrom(FIFTY_ENEMY);AI_STATE.fiftyRuleMockedEnemy=true;}
    }
};

})();
