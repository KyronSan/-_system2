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

let turn='w', selected=null, possibleMoves=[];
let pendingPromotion=null;
let promotionBaseMove='';
const moveHistory=[];

/* ======================================================
   FIN DE PARTIDA
====================================================== */
let gameOver=false;

/* ======================================================
   REGLA DE 50 JUGADAS
====================================================== */
let fiftyRuleActive=false;
let fiftyCounter=100;
let fiftyRuleInitialized=false;
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
   ELEMENTOS DOM
====================================================== */
const boardDiv=document.getElementById('board');
const statusDiv=document.getElementById('status');
const movesDiv=document.getElementById('moves');
const promoBox=document.getElementById('promotionBox');

/* ======================================================
   REGLA DE 50 JUGADAS — FUNCIONES
====================================================== */
function playerHasOnlyKing(color){
    let count=0;
    for(let r=0;r<8;r++)
        for(let c=0;c<8;c++)
            if(board[r][c]?.startsWith(color)) count++;
    return count===1;
}

function playerHasOnlyKingAndBlockedPawns(color){
    let hasPawn=false;

    for(let r=0;r<8;r++){
        for(let c=0;c<8;c++){
            if(board[r][c]?.startsWith(color)){
                const type=board[r][c].split('_')[1];
                if(type!=='king' && type!=='pawn') return false;
                if(type==='pawn'){
                    hasPawn=true;
                    if(getValidMoves(r,c).length>0) return false;
                }
            }
        }
    }
    return hasPawn;
}

function playerHasAnyCapture(color){
    for(let r=0;r<8;r++){
        for(let c=0;c<8;c++){
            if(board[r][c]?.startsWith(color)){
                const moves=getValidMoves(r,c);
                if(moves.some(m=>m.capture)) return true;
            }
        }
    }
    return false;
}

function shouldActivateFiftyRule(){
    const checkInfo=getCheckStatus(turn);

    if(checkInfo.inCheck && hasAnyLegalMove(turn)) return false;
    if(playerHasAnyCapture(turn)) return false;

    return (
        playerHasOnlyKing(turn) ||
        playerHasOnlyKingAndBlockedPawns(turn)
    );
}

/* ======================================================
   DIBUJAR TABLERO (USANDO DISPLAY_PIECES)
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

                // 👇 CAMBIO CLAVE (VISUAL)
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

    if(!checkInfo.inCheck && !hasAnyLegalMove(turn)){
        text='Ahogado : EMPATE';
        gameOver=true;
    }
    else if(checkInfo.isMate){
        text=(turn==='w'?'Turno: Blancas':'Turno: Negras')+' — JAQUE MATE';
        gameOver=true;
    }
    else{
        text=turn==='w'?'Turno: Blancas':'Turno: Negras';
        if(checkInfo.inCheck) text+=' — JAQUE';
    }

    if(fiftyRuleActive){
        text+=` | Regla de 50 jugadas: ${fiftyCounter}`;
        if(fiftyCounter<=0){
            text='Regla de 50 jugadas: EMPATE';
            gameOver=true;
        }
    }

    statusDiv.textContent=text;
}

/* ======================================================
   CLICS
====================================================== */
function handleClick(r,c){
    if(pendingPromotion || gameOver) return;

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
    btn.onclick = () => {
        if(!pendingPromotion) return;

        const piece = btn.dataset.piece;
        const { r, c, color } = pendingPromotion;

        board[r][c] = color + '_' + piece;

        let move = promotionBaseMove + '=' + pieceLetters[piece];

        const enemy = otherColor(color);
        const checkInfo = getCheckStatus(enemy);

        if(checkInfo.isMate) move += '#';
        else if(checkInfo.inCheck) move += '+';

        moveHistory.push(move);
        turn = enemy;

        if(typeof updateHistory === 'function'){
            updateHistory();
        }

        promoBox.style.display = 'none';
        pendingPromotion = null;

        drawBoard();
    };
});

/* ======================================================
   MOVER PIEZA
====================================================== */
function movePiece(r1,c1,r2,c2){
    const [color,type]=board[r1][c1].split('_');
    const enemy=otherColor(color);
    const move=possibleMoves.find(m=>m.r===r2&&m.c===c2);
    let captured=board[r2][c2]!=='' || move?.enPassant;

    /* ===== ENROQUE ===== */
    if(type === 'king' && move?.castle){
        const row = color === 'w' ? 7 : 0;

        if(move.castle === 'king'){
            board[row][6] = color + '_king';
            board[row][5] = color + '_rook';
            board[row][4] = '';
            board[row][7] = '';
        } else {
            board[row][2] = color + '_king';
            board[row][3] = color + '_rook';
            board[row][4] = '';
            board[row][0] = '';
        }

        castlingRights[color]={king:false,rookA:false,rookH:false};

        finishMove('king',c1,c2,r2,color,false,{ castle: move.castle });
        drawBoard();
        return;
    }

    if(type==='pawn' && move?.enPassant){
        board[enPassantTarget.pawnR][enPassantTarget.pawnC]='';
    }

    enPassantTarget=null;

    board[r2][c2]=board[r1][c1];
    board[r1][c1]='';

    if(type==='pawn' && Math.abs(r2-r1)===2){
        enPassantTarget={
            r:(r1+r2)/2,c:c2,pawnR:r2,pawnC:c2,byColor:enemy
        };
    }

    if(checkPawnPromotion(type,r2,c1,c2,color,captured)) return;

    finishMove(type,c1,c2,r2,color,captured);

    fiftyRuleWasActive = fiftyRuleActive;

    if(fiftyRuleActive && captured){
        fiftyRuleActive=false;
    }

    if(!fiftyRuleActive && shouldActivateFiftyRule()){
        fiftyRuleActive=true;
        if(!fiftyRuleWasActive){
            fiftyCounter=100;
        }
    }

    if(fiftyRuleActive){
        fiftyCounter--;
    }
}

// Botón escritorio
document.getElementById("btnVolver").addEventListener("click", () => {
    window.location.href = "../jugar/jugar.html";
});

// 🔴 Botón móvil
document.getElementById("btnVolverMovil").addEventListener("click", () => {
    window.location.href = "../jugar/jugar.html";
});

drawBoard();