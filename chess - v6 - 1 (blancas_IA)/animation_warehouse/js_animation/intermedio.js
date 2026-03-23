(function(){

const AI_STATE={
mirrorChecked:false,
lastMoves:[],
fiftyRuleWarnedSelf:false,
fiftyRuleMockedEnemy:false
};

function pick(a){return a[Math.floor(Math.random()*a.length)];}
function speakFrom(a){
if(!window.loadedCharacter)return;
const d=pick(a);
window.loadedCharacter.dialogos=[d];
if(typeof window.typeText==="function")window.typeText(d);
}

/* ===== INICIO ===== */
const START=[
{texto:"Bien.\nVeamos qué tan sólido es tu juego.",emocion:"hablar"},
{texto:"Empezamos.\nAnalizaré cada una de tus decisiones.",emocion:"hablar"},
{texto:"Nueva partida.\nAquí los errores se notan.",emocion:"hablar"},
{texto:"Prepárate.\nEstoy atento a tus fallos.",emocion:"hablar"},
{texto:"Juguemos.\nLa estrategia será clave.",emocion:"hablar"},
{texto:"Interesante inicio.\nObservando tu planteamiento.",emocion:"hablar"},
{texto:"Estoy listo.\nTus jugadas dirán tu nivel.",emocion:"hablar"},
{texto:"Comencemos.\nNada pasa desapercibido.",emocion:"hablar"},
{texto:"Veamos qué tan preciso eres.",emocion:"hablar"},
{texto:"Partida iniciada.\nConcéntrate bien.",emocion:"hablar"}
];

window.registerCharacter({codigo:"intermedio",dialogos:[pick(START)]});

/* ===== MOVIMIENTOS ===== */
const PAWN=[
{texto:"Avance correcto de tu peón.",emocion:"hablar"},
{texto:"Tu peón gana espacio.",emocion:"hablar"},
{texto:"Eso define tu estructura.",emocion:"hablar"},
{texto:"Peón bien usado.",emocion:"hablar"},
{texto:"Movimiento lógico por tu parte.",emocion:"hablar"},
{texto:"Así construyes tu posición.",emocion:"hablar"},
{texto:"Buen empuje.",emocion:"hablar"},
{texto:"Tus peones marcarán el final.",emocion:"hablar"},
{texto:"Avance estratégico detectado.",emocion:"hablar"},
{texto:"La estructura cambia con tu jugada.",emocion:"hablar"}
];

const KNIGHT=[
{texto:"Buen salto de tu caballo.",emocion:"sorprendido"},
{texto:"Tu caballo mejora su posición.",emocion:"sorprendido"},
{texto:"Movimiento activo.",emocion:"sorprendido"},
{texto:"Eso genera amenazas.",emocion:"sorprendido"},
{texto:"Caballo bien centralizado.",emocion:"sorprendido"},
{texto:"Buen cálculo de tu parte.",emocion:"sorprendido"},
{texto:"Tu caballo presiona.",emocion:"sorprendido"},
{texto:"Movimiento táctico interesante.",emocion:"sorprendido"},
{texto:"Ruta bien elegida.",emocion:"sorprendido"},
{texto:"Ese caballo empieza a molestar.",emocion:"sorprendido"}
];

const BISHOP=[
{texto:"Diagonal fuerte que abriste.",emocion:"hablar"},
{texto:"Buen alfil.",emocion:"hablar"},
{texto:"Control a largo plazo con tu alfil.",emocion:"hablar"},
{texto:"Eso incomoda bastante.",emocion:"hablar"},
{texto:"Alfil activo.",emocion:"hablar"},
{texto:"Buena presión diagonal.",emocion:"hablar"},
{texto:"Diagonal dominante.",emocion:"hablar"},
{texto:"Movimiento preciso.",emocion:"hablar"},
{texto:"Alfil bien colocado.",emocion:"hablar"},
{texto:"Buen concepto estratégico.",emocion:"hablar"}
];

const ROOK=[
{texto:"Tu torre entra con fuerza.",emocion:"hablar"},
{texto:"Elegiste bien la columna.",emocion:"hablar"},
{texto:"Buena coordinación.",emocion:"hablar"},
{texto:"Eso pesa en la posición.",emocion:"hablar"},
{texto:"Torre activa.",emocion:"hablar"},
{texto:"Buena colocación.",emocion:"hablar"},
{texto:"Tu torre empieza a mandar.",emocion:"hablar"},
{texto:"Columna bien controlada.",emocion:"hablar"},
{texto:"Buen momento para mover la torre.",emocion:"hablar"},
{texto:"Movimiento sólido.",emocion:"hablar"}
];

const QUEEN=[
{texto:"Tu dama entra en escena.",emocion:"sorprendido"},
{texto:"Movimiento delicado de dama.",emocion:"sorprendido"},
{texto:"Eso puede ser peligroso.",emocion:"sorprendido"},
{texto:"La dama presiona fuerte.",emocion:"sorprendido"},
{texto:"Buen uso de la dama.",emocion:"sorprendido"},
{texto:"Movimiento ambicioso.",emocion:"sorprendido"},
{texto:"Tu dama apunta con intención.",emocion:"sorprendido"},
{texto:"Eso genera amenazas.",emocion:"sorprendido"},
{texto:"Cuidado con tu dama activa.",emocion:"sorprendido"},
{texto:"Juego agresivo detectado.",emocion:"sorprendido"}
];

const KING=[
{texto:"Moviste el rey.\nRiesgoso.",emocion:"triste"},
{texto:"Eso puede costarte caro.",emocion:"triste"},
{texto:"Tu rey queda expuesto.",emocion:"triste"},
{texto:"Movimiento delicado.",emocion:"triste"},
{texto:"No parece seguro.",emocion:"triste"},
{texto:"El rey pierde protección.",emocion:"triste"},
{texto:"Decisión peligrosa.",emocion:"triste"},
{texto:"El rey sale demasiado pronto.",emocion:"triste"},
{texto:"Eso abre líneas contra ti.",emocion:"triste"},
{texto:"Atención con tu rey.",emocion:"triste"}
];

/* ===== CAPTURAS ===== */
const CAP_LIGHT=[
{texto:"Intercambio menor a tu favor.",emocion:"hablar"},
{texto:"Ganancia pequeña.",emocion:"hablar"},
{texto:"Nada decisivo todavía.",emocion:"hablar"},
{texto:"Captura aceptable.",emocion:"hablar"},
{texto:"Eso suma.",emocion:"hablar"},
{texto:"Pequeña ventaja.",emocion:"hablar"},
{texto:"Cambio leve.",emocion:"hablar"},
{texto:"Intercambio lógico.",emocion:"hablar"},
{texto:"Movimiento normal.",emocion:"hablar"},
{texto:"Nada crítico aún.",emocion:"hablar"}
];

const CAP_MED=[
{texto:"Eso ya se siente.",emocion:"sorprendido"},
{texto:"Intercambio importante.",emocion:"sorprendido"},
{texto:"Pieza relevante capturada.",emocion:"sorprendido"},
{texto:"Eso cambia los planes.",emocion:"sorprendido"},
{texto:"Captura fuerte.",emocion:"sorprendido"},
{texto:"Buen golpe táctico.",emocion:"sorprendido"},
{texto:"Eso pesa en la partida.",emocion:"sorprendido"},
{texto:"Ventaja clara.",emocion:"sorprendido"},
{texto:"Intercambio serio.",emocion:"sorprendido"},
{texto:"Movimiento clave.",emocion:"sorprendido"}
];

const CAP_HEAVY=[
{texto:"Eso duele mucho.",emocion:"llorando"},
{texto:"Golpe casi decisivo.",emocion:"llorando"},
{texto:"Difícil de compensar.",emocion:"llorando"},
{texto:"Pérdida grave.",emocion:"llorando"},
{texto:"Eso inclina la balanza.",emocion:"llorando"},
{texto:"Momento crítico.",emocion:"llorando"},
{texto:"Muy costoso.",emocion:"llorando"},
{texto:"Gran ventaja obtenida.",emocion:"llorando"},
{texto:"Eso marca la partida.",emocion:"llorando"},
{texto:"Situación complicada.",emocion:"llorando"}
];

/* ===== EVENTOS ===== */
const CHECK=Array.from({length:10},(_,i)=>({texto:`Jaque.\nBuena precisión (${i+1}).`,emocion:"sorprendido"}));
const MATE_WIN=Array.from({length:10},(_,i)=>({texto:`Jaque mate.\nBuen cálculo (${i+1}).`,emocion:"triste"}));
const MATE_LOSE=Array.from({length:10},(_,i)=>({texto:`Jaque mate.\nError decisivo (${i+1}).`,emocion:"hablar"}));
const CASTLE=Array.from({length:10},(_,i)=>({texto:`Enroque correcto de tu parte (${i+1}).`,emocion:"hablar"}));
const PROMO_P=Array.from({length:10},(_,i)=>({texto:`Coronación merecida (${i+1}).`,emocion:"sorprendido"}));
const PROMO_A=Array.from({length:10},(_,i)=>({texto:`He coronado.\nVentaja (${i+1}).`,emocion:"hablar"}));
const ENP=Array.from({length:10},(_,i)=>({texto:`Captura al paso bien vista (${i+1}).`,emocion:"sorprendido"}));
const MIRROR=Array.from({length:10},(_,i)=>({texto:`Partida espejo.\nCurioso (${i+1}).`,emocion:"sorprendido"}));
const FIFTY_S=Array.from({length:10},(_,i)=>({texto:`Muchas jugadas sin avance (${i+1}).`,emocion:"triste"}));
const FIFTY_E=Array.from({length:10},(_,i)=>({texto:`Tu juego se estanca (${i+1}).`,emocion:"hablar"}));

/* ===== IA ===== */
window.AI_INTERMEDIO={
onMove(p){
const m={pawn:PAWN,knight:KNIGHT,bishop:BISHOP,rook:ROOK,queen:QUEEN,king:KING}[p];
if(m)speakFrom(m);
},
onCapture(p){
const s={pawn:1,knight:2,bishop:2,rook:3,queen:4}[p]||1;
speakFrom(s<=1?CAP_LIGHT:s<=3?CAP_MED:CAP_HEAVY);
},
onCheck(){speakFrom(CHECK);},
onCheckMate(w){speakFrom(w==="player"?MATE_WIN:MATE_LOSE);},
onCastle(){speakFrom(CASTLE);},
onPromotion(w){speakFrom(w==="player"?PROMO_P:PROMO_A);},
onEnPassant(){speakFrom(ENP);},
onMoveHistory(m){
if(AI_STATE.mirrorChecked)return;
AI_STATE.lastMoves.push(m);
if(AI_STATE.lastMoves.length===6){
const[a,b,c,d,e,f]=AI_STATE.lastMoves;
if(a===b&&c===d&&e===f)speakFrom(MIRROR);
AI_STATE.mirrorChecked=true;
}
},
onFiftyRule(_,a){
if(a==="self"&&!AI_STATE.fiftyRuleWarnedSelf){speakFrom(FIFTY_S);AI_STATE.fiftyRuleWarnedSelf=true;}
if(a==="enemy"&&!AI_STATE.fiftyRuleMockedEnemy){speakFrom(FIFTY_E);AI_STATE.fiftyRuleMockedEnemy=true;}
}
};

})();
