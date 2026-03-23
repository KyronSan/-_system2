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

const START=[
{texto:"Silencio.\nLa partida empieza ahora.",emocion:"enojado"},
{texto:"Concentración máxima.\nJuega.",emocion:"enojado"},
{texto:"Esto se decide con cálculo, no suerte.",emocion:"enojado"},
{texto:"Primer movimiento.\nTe observo.",emocion:"enojado"},
{texto:"Empieza.\nCada jugada cuenta.",emocion:"enojado"},
{texto:"No cometeré errores.",emocion:"enojado"},
{texto:"Aquí se juega serio.",emocion:"enojado"},
{texto:"Veamos tu nivel real.",emocion:"enojado"},
{texto:"No subestimes esta partida.",emocion:"enojado"},
{texto:"Comienza el análisis.",emocion:"enojado"}
];

window.registerCharacter({codigo:"dificil",dialogos:[pick(START)]});

const PAWN=[
{texto:"Un avance menor.",emocion:"hablar"},
{texto:"Eso apenas altera la posición.",emocion:"hablar"},
{texto:"Movimiento estándar.",emocion:"hablar"},
{texto:"Peón sin presión.",emocion:"hablar"},
{texto:"No genera amenazas.",emocion:"hablar"},
{texto:"Demasiado tímido.",emocion:"hablar"},
{texto:"Eso no cambia nada.",emocion:"hablar"},
{texto:"Avance previsible.",emocion:"hablar"},
{texto:"Juego lento.",emocion:"hablar"},
{texto:"Paso irrelevante.",emocion:"hablar"}
];

const KNIGHT=[
{texto:"Ese salto no mejora tu posición.",emocion:"sorprendido"},
{texto:"Caballo sin impacto.",emocion:"sorprendido"},
{texto:"Ruta ineficiente.",emocion:"sorprendido"},
{texto:"Eso no crea amenazas.",emocion:"sorprendido"},
{texto:"Movimiento superficial.",emocion:"sorprendido"},
{texto:"No hay profundidad ahí.",emocion:"sorprendido"},
{texto:"Caballo mal coordinado.",emocion:"sorprendido"},
{texto:"Demasiado evidente.",emocion:"sorprendido"},
{texto:"Eso ya estaba calculado.",emocion:"sorprendido"},
{texto:"No me preocupa.",emocion:"sorprendido"}
];

const BISHOP=[
{texto:"Diagonal sin propósito.",emocion:"hablar"},
{texto:"Alfil pasivo.",emocion:"hablar"},
{texto:"No ejerce presión real.",emocion:"hablar"},
{texto:"Control limitado.",emocion:"hablar"},
{texto:"Eso no mejora tu juego.",emocion:"hablar"},
{texto:"Alfil mal sincronizado.",emocion:"hablar"},
{texto:"Sin objetivos claros.",emocion:"hablar"},
{texto:"Movimiento flojo.",emocion:"hablar"},
{texto:"Poca influencia.",emocion:"hablar"},
{texto:"Nada crítico.",emocion:"hablar"}
];

const ROOK=[
{texto:"Torre sin actividad.",emocion:"hablar"},
{texto:"Columna mal aprovechada.",emocion:"hablar"},
{texto:"Eso no domina el tablero.",emocion:"hablar"},
{texto:"Falta coordinación.",emocion:"hablar"},
{texto:"Movimiento prematuro.",emocion:"hablar"},
{texto:"Torre ineficiente.",emocion:"hablar"},
{texto:"No ejerce presión.",emocion:"hablar"},
{texto:"Eso no intimida.",emocion:"hablar"},
{texto:"Poca visión.",emocion:"hablar"},
{texto:"Mal momento.",emocion:"hablar"}
];

const QUEEN=[
{texto:"Dama expuesta innecesariamente.",emocion:"enojado"},
{texto:"Eso debilita tu posición.",emocion:"enojado"},
{texto:"Movimiento arriesgado.",emocion:"enojado"},
{texto:"La dama no debía ir ahí.",emocion:"enojado"},
{texto:"Error estratégico.",emocion:"enojado"},
{texto:"Te adelantas demasiado.",emocion:"enojado"},
{texto:"Eso se puede castigar.",emocion:"enojado"},
{texto:"Falta de precisión.",emocion:"enojado"},
{texto:"Decisión dudosa.",emocion:"enojado"},
{texto:"Eso no fue correcto.",emocion:"enojado"}
];

const KING=[
{texto:"Ese rey queda vulnerable.",emocion:"llorando"},
{texto:"Has debilitado tu defensa.",emocion:"llorando"},
{texto:"Movimiento peligroso.",emocion:"llorando"},
{texto:"El rey no estaba seguro.",emocion:"llorando"},
{texto:"Eso se puede explotar.",emocion:"llorando"},
{texto:"Error grave.",emocion:"llorando"},
{texto:"Defensa comprometida.",emocion:"llorando"},
{texto:"Eso no es sostenible.",emocion:"llorando"},
{texto:"Riesgo innecesario.",emocion:"llorando"},
{texto:"Mala decisión.",emocion:"llorando"}
];

const CAP_LIGHT=[
{texto:"Intercambio menor.",emocion:"hablar"},
{texto:"Ganancia insignificante.",emocion:"hablar"},
{texto:"Eso no compensa.",emocion:"hablar"},
{texto:"Cambio trivial.",emocion:"hablar"},
{texto:"Nada decisivo.",emocion:"hablar"},
{texto:"Impacto mínimo.",emocion:"hablar"},
{texto:"Eso no altera el balance.",emocion:"hablar"},
{texto:"Captura menor.",emocion:"hablar"},
{texto:"Poco relevante.",emocion:"hablar"},
{texto:"Nada importante.",emocion:"hablar"}
];

const CAP_MED=[
{texto:"Eso empieza a doler.",emocion:"sorprendido"},
{texto:"Pérdida considerable.",emocion:"sorprendido"},
{texto:"Eso debilita tu juego.",emocion:"sorprendido"},
{texto:"Empiezas a ceder.",emocion:"sorprendido"},
{texto:"Intercambio desfavorable.",emocion:"sorprendido"},
{texto:"Pierdes control.",emocion:"sorprendido"},
{texto:"Ventaja creciente.",emocion:"sorprendido"},
{texto:"Eso cambia la posición.",emocion:"sorprendido"},
{texto:"Mal cálculo.",emocion:"sorprendido"},
{texto:"Te equivocas.",emocion:"sorprendido"}
];

const CAP_HEAVY=[
{texto:"Eso decide la partida.",emocion:"enojado"},
{texto:"Error crítico.",emocion:"enojado"},
{texto:"Pérdida irreparable.",emocion:"enojado"},
{texto:"Ventaja decisiva.",emocion:"enojado"},
{texto:"Te hundes.",emocion:"enojado"},
{texto:"No hay compensación.",emocion:"enojado"},
{texto:"Eso es terminal.",emocion:"enojado"},
{texto:"Colapso total.",emocion:"enojado"},
{texto:"La partida se inclina.",emocion:"enojado"},
{texto:"Esto se acaba.",emocion:"enojado"}
];

const CHECK=Array.from({length:10},(_,i)=>({texto:`Jaque.\nPosición comprometida (${i+1}).`,emocion:"sorprendido"}));
const MATE_WIN=Array.from({length:10},(_,i)=>({texto:`Jaque mate.\nSuperioridad confirmada (${i+1}).`,emocion:"enojado"}));
const MATE_LOSE=Array.from({length:10},(_,i)=>({texto:`Jaque mate.\nFallo inaceptable (${i+1}).`,emocion:"llorando"}));
const CASTLE=Array.from({length:10},(_,i)=>({texto:`Enroque.\nEra necesario (${i+1}).`,emocion:"hablar"}));
const PROMO_P=Array.from({length:10},(_,i)=>({texto:`Coronación.\nAún insuficiente (${i+1}).`,emocion:"enojado"}));
const PROMO_A=Array.from({length:10},(_,i)=>({texto:`Coronación lograda.\nVentaja clara (${i+1}).`,emocion:"enojado"}));
const ENP=Array.from({length:10},(_,i)=>({texto:`Captura al paso.\nFalta de atención (${i+1}).`,emocion:"sorprendido"}));
const MIRROR=Array.from({length:10},(_,i)=>({texto:`Juego simétrico.\nNo me alcanzas (${i+1}).`,emocion:"enojado"}));
const FIFTY_S=Array.from({length:10},(_,i)=>({texto:`Demasiadas jugadas sin progreso (${i+1}).`,emocion:"llorando"}));
const FIFTY_E=Array.from({length:10},(_,i)=>({texto:`Te ahogas lentamente (${i+1}).`,emocion:"hablar"}));

window.AI_DIFICIL={
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
