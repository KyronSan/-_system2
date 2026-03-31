(function(){
    
"use strict";

let thinking = false;

/* ============================================================
   UTILIDADES DE CONVERSIÓN
   ============================================================ */

// tu tablero → tablero CG
function boardToCG(){
    const map = {
        "w_pawn":"P","w_rook":"R","w_knight":"N","w_bishop":"B","w_queen":"Q","w_king":"K",
        "b_pawn":"p","b_rook":"r","b_knight":"n","b_bishop":"b","b_queen":"q","b_king":"k",
        "":"." , null:"."
    };

    const b = [];
    for(let r=0;r<8;r++){
        const row = [];
        for(let c=0;c<8;c++){
            row.push(map[board[r][c]] || ".");
        }
        b.push(row);
    }
    return b;
}

// movimiento CG → movimiento tu motor
function applyCGMove(move){
    if(!move) return false;

    const [fx,fy] = move.from;
    const [tx,ty] = move.to;

    const fr = fy;
    const fc = fx;
    const tr = ty;
    const tc = tx;

    return movePiece(fr, fc, tr, tc);
}

/* ============================================================
   IA NEGRA CG
   ============================================================ */

function playCGMove(){
    if(thinking || gameOver || turn !== 'b') return;

    thinking = true;
    report("pensando…");

    try{
        const cgBoard = boardToCG();

        // false = negras
        const bestMove = CG.getMove(cgBoard, false);

        if(!bestMove){
            report("sin jugadas");
            thinking = false;
            return;
        }

        const beforeTurn = turn;

        applyCGMove(bestMove);

        // si el turno cambió, la jugada fue válida
        if(turn !== beforeTurn){
            report("jugada realizada");
        }else{
            report("reintentando…");
        }


    }catch(e){
        console.error(e);
        report("error interno");
    }

    thinking = false;
}

/* ============================================================
   API (OBLIGATORIA)
   ============================================================ */

window.requestBlackMove = function(){
    setTimeout(playCGMove, 200);
};

/* ============================================================
   UI
   ============================================================ */

function report(text){
    const box = document.getElementById("aiStatus");
    if(box){
        box.textContent = "IA Negra (CG): " + text;
    }
}

})();
