/* ======================================================
   PIEZAS (LÓGICA — NO TOCAR)
====================================================== */
const PIECES = {
    w:{king:'♔',queen:'♕',rook:'♖',bishop:'♗',knight:'♘',pawn:'♙'},
    b:{king:'♚',queen:'♛',rook:'♜',bishop:'♝',knight:'♞',pawn:'♟'}
};

/* ======================================================
   PIEZAS (VISUAL — PERSONALIZABLE)
====================================================== */
const DISPLAY_PIECES = {
    w:{king:'♚',queen:'♛',rook:'♜',bishop:'♝',knight:'♞',pawn:'♟'},
    b:{king:'♚',queen:'♛',rook:'♜',bishop:'♝',knight:'♞',pawn:'♟'}
};

/* ======================================================
   NOTACIÓN
====================================================== */
const pieceLetters = { king:'R', queen:'D', rook:'T', bishop:'A', knight:'C', pawn:'' };
const files = 'abcdefgh';

function otherColor(c){ return c==='w'?'b':'w'; }

/* ======================================================
   ESTADO DEL JUEGO
====================================================== */
let board = [
["b_rook","b_knight","b_bishop","b_queen","b_king","b_bishop","b_knight","b_rook"],
["b_pawn","b_pawn","b_pawn","b_pawn","b_pawn","b_pawn","b_pawn","b_pawn"],
["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
["w_pawn","w_pawn","w_pawn","w_pawn","w_pawn","w_pawn","w_pawn","w_pawn"],
["w_rook","w_knight","w_bishop","w_queen","w_king","w_bishop","w_knight","w_rook"]
];

let turn='w';
let selected=null;
let possibleMoves=[];
let pendingPromotion=null;
let promotionBaseMove='';
const moveHistory=[];
let gameOver=false;

/* ======================================================
   REGLA DE 50 JUGADAS
====================================================== */
let fiftyRuleActive=false;
let fiftyCounter=100;
let fiftyRuleWasActive=false;

/* ======================================================
   PEÓN AL PASO
====================================================== */
let enPassantTarget=null;

/* ======================================================
   ENROQUE
====================================================== */
let castlingRights={
    w:{king:true,rookA:true,rookH:true},
    b:{king:true,rookA:true,rookH:true}
};

/* ======================================================
   DOM
====================================================== */
const boardDiv=document.getElementById('board');
const statusDiv=document.getElementById('status');
const movesDiv=document.getElementById('moves');
const promoBox=document.getElementById('promotionBox');

/* ======================================================
   DIBUJAR TABLERO
====================================================== */
function drawBoard(){
    boardDiv.innerHTML='';
    const checkInfo=getCheckStatus(turn);

    for(let r=0;r<8;r++){
        for(let c=0;c<8;c++){
            const cell=document.createElement('div');
            cell.className=`cell ${(r+c)%2?'black':'white'}`;

            if(selected && selected.r===r && selected.c===c)
                cell.classList.add('selected');

            if(possibleMoves.some(m=>m.r===r && m.c===c))
                cell.classList.add('possible');

            if(board[r][c]){
                const [col,t]=board[r][c].split('_');
                cell.textContent = DISPLAY_PIECES[col][t];
                cell.classList.add(col==='w'?'white-piece':'black-piece');

                if(t==='king' && col===turn && checkInfo.inCheck){
                    cell.classList.add(
                        checkInfo.isMate?'checkmate-king':'check-king'
                    );
                }
            }

            cell.onclick=()=>handleClick(r,c);
            boardDiv.appendChild(cell);
        }
    }

    let text='';

    if(checkInfo.isMate){
        text=(turn==='w'?'Turno: Blancas':'Turno: Negras')+' — JAQUE MATE';
        gameOver=true;
    }
    else if(checkInfo.inCheck){
        text=(turn==='w'?'Turno: Blancas':'Turno: Negras')+' — JAQUE';
    }
    else if(!hasAnyLegalMove(turn)){
        text='Ahogado : EMPATE';
        gameOver=true;
    }
    else{
        text=turn==='w'?'Turno: Blancas':'Turno: Negras';
    }

    statusDiv.textContent=text;
}

/* ======================================================
   CLICS
====================================================== */
function handleClick(r,c){
    if(pendingPromotion || gameOver) return;
    if(turn==='b') return;

    if(!selected){
        if(board[r][c]?.startsWith(turn)){
            selected={r,c};
            possibleMoves=getValidMoves(r,c);
        }
        drawBoard();
        return;
    }

    if(possibleMoves.some(m=>m.r===r && m.c===c))
        movePiece(selected.r,selected.c,r,c);

    selected=null;
    possibleMoves=[];
    drawBoard();
}

/* ======================================================
    PROMOCIÓN
====================================================== */
function checkPawnPromotion(type,r2,c1,c2,color,captured){

    if(type==='pawn' && (r2===0||r2===7)){

        const isAI = color === 'b';

        // ===== PROMOCIÓN IA =====
        if(isAI){

            let promoteTo = "queen";

            try{
                if(window.CG && CG.choosePromotion){
                    promoteTo = CG.choosePromotion(boardToCG(), color);
                }
            }catch(e){
                console.warn("CG promotion fallback → queen");
            }

            board[r2][c2] = color + "_" + promoteTo;

            const enemy = otherColor(color);
            turn = enemy;

            drawBoard();

            if(turn === 'w' && window.requestBlackMove)
                setTimeout(()=>window.requestBlackMove(),300);

            return true;
        }

        // ===== PROMOCIÓN HUMANO =====
        promotionBaseMove=(captured?files[c1]+'x':'')+files[c2]+(8-r2);
        pendingPromotion={r:r2,c:c2,color};
        promoBox.style.display='block';
        return true;
    }

    return false;
}

/* ======================================================
    CONFIRMAR PROMOCIÓN
====================================================== */
document.querySelectorAll('#promotionBox button').forEach(btn=>{
    btn.onclick=()=>{
        if(!pendingPromotion) return;

        const piece=btn.dataset.piece;
        const {r,c,color}=pendingPromotion;

        board[r][c]=color+'_'+piece;

        const enemy=otherColor(color);
        turn=enemy;

        promoBox.style.display='none';
        pendingPromotion=null;

        drawBoard();

        if(turn==='b' && window.requestBlackMove)
            setTimeout(()=>window.requestBlackMove(),300);
    };
});

/* ======================================================
   MOVER PIEZA (ENROQUE + E.P.)
====================================================== */
function movePiece(r1,c1,r2,c2){
    const [color,type]=board[r1][c1].split('_');
    const enemy=otherColor(color);
    const move=possibleMoves.find(m=>m.r===r2&&m.c===c2);
    let captured = board[r2][c2]!=='' || move?.enPassant;

    /* ===== ENROQUE ===== */
    if(type==='king' && move?.castle){
        const row=color==='w'?7:0;

        if(move.castle==='king'){
            board[row][6]=color+'_king';
            board[row][5]=color+'_rook';
            board[row][4]='';
            board[row][7]='';
        }else{
            board[row][2]=color+'_king';
            board[row][3]=color+'_rook';
            board[row][4]='';
            board[row][0]='';
        }

        castlingRights[color]={king:false,rookA:false,rookH:false};
        finishMove('king',c1,c2,r2,color,false,{castle:move.castle});
        drawBoard();

        // ✅ ESTO FALTABA
        if(turn === 'b' && window.requestBlackMove)
            setTimeout(() => window.requestBlackMove(), 300);

        return;
    }

    /* ===== PEÓN AL PASO ===== */
    if(type==='pawn' && move?.enPassant){
        board[enPassantTarget.pawnR][enPassantTarget.pawnC]='';
    }

    enPassantTarget=null;

    board[r2][c2]=board[r1][c1];
    board[r1][c1]='';

    if(type==='pawn' && Math.abs(r2-r1)===2){
        enPassantTarget={
            r:(r1+r2)/2,
            c:c2,
            pawnR:r2,
            pawnC:c2,
            byColor:enemy
        };
    }

    if(checkPawnPromotion(type,r2,c1,c2,color,captured)) return;

    finishMove(type,c1,c2,r2,color,captured);
    drawBoard();

    if(turn==='b' && window.requestBlackMove)
        setTimeout(()=>window.requestBlackMove(),300);
}

drawBoard();
