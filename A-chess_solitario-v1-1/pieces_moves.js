function getValidMoves(r,c){
    return getPseudoMoves(r,c).filter(m=>!leavesKingInCheck(r,c,m.r,m.c));
}

function getPseudoMoves(r,c, forAttack=false){

    if(!board[r][c]) return [];

    const [color,type]=board[r][c].split('_');
    const dir=color==='w'?-1:1;
    let moves=[];

    const add=(rr,cc,extra={})=>{
        if(rr>=0&&rr<8&&cc>=0&&cc<8 &&
           (!board[rr][cc]||!board[rr][cc].startsWith(color)))
            moves.push({r:rr,c:cc,...extra});
    };

    /* ================== PEÓN ================== */
    if(type==='pawn'){

        if(board[r+dir]?.[c]==='') add(r+dir,c);

        if((r===6&&color==='w'||r===1&&color==='b') &&
           board[r+dir][c]==='' && board[r+2*dir][c]==='')
            add(r+2*dir,c);

        for(let dc of [-1,1]){
            const cc=c+dc;
            if(board[r+dir]?.[cc] && !board[r+dir][cc].startsWith(color))
                add(r+dir,cc);
        }

        /* ===== PEÓN AL PASO ===== */
        if(!forAttack && enPassantTarget && enPassantTarget.byColor === color){
            if(
                Math.abs(c - enPassantTarget.c) === 1 &&
                r === enPassantTarget.pawnR
            ){
                add(enPassantTarget.r, enPassantTarget.c, { enPassant:true });
            }
        }

        return moves;
    }

    /* ================== CABALLO ================== */
    if(type==='knight'){
        [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
        .forEach(([dr,dc])=>add(r+dr,c+dc));
        return moves;
    }

    /* ================== REY ================== */
    if(type==='king'){

        // movimientos normales del rey
        for(let dr=-1;dr<=1;dr++)
            for(let dc=-1;dc<=1;dc++)
                if(dr||dc) add(r+dr,c+dc);

        // ⚠️ SOLO evaluar enroque si NO estamos calculando ataques
        if(!forAttack){

            const baseRow = color === 'w' ? 7 : 0;

            if(r === baseRow && c === 4){

                // Enroque corto
                if(
                    board[baseRow][5] === '' &&
                    board[baseRow][6] === '' &&
                    board[baseRow][7] === color + '_rook' &&
                    !isSquareAttacked(baseRow, 4, otherColor(color)) &&
                    !isSquareAttacked(baseRow, 5, otherColor(color)) &&
                    !isSquareAttacked(baseRow, 6, otherColor(color))
                ){
                    moves.push({ r: baseRow, c: 6, castle: 'king' });
                }

                // Enroque largo
                if(
                    board[baseRow][1] === '' &&
                    board[baseRow][2] === '' &&
                    board[baseRow][3] === '' &&
                    board[baseRow][0] === color + '_rook' &&
                    !isSquareAttacked(baseRow, 4, otherColor(color)) &&
                    !isSquareAttacked(baseRow, 3, otherColor(color)) &&
                    !isSquareAttacked(baseRow, 2, otherColor(color))
                ){
                    moves.push({ r: baseRow, c: 2, castle: 'queen' });
                }
            }
        }

        return moves;
    }

    /* ================== TORRE / ALFIL / REINA ================== */
    const dirs=[];
    if(type==='rook'||type==='queen') dirs.push([1,0],[-1,0],[0,1],[0,-1]);
    if(type==='bishop'||type==='queen') dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);

    for(const [dr,dc] of dirs){
        let rr=r+dr,cc=c+dc;
        while(rr>=0&&rr<8&&cc>=0&&cc<8){
            if(!board[rr][cc]) add(rr,cc);
            else{
                if(!board[rr][cc].startsWith(color)) add(rr,cc);
                break;
            }
            rr+=dr; cc+=dc;
        }
    }

    return moves;
}

/* ====================================================== */

function leavesKingInCheck(r1,c1,r2,c2){

    const a = board[r1][c1];
    const b = board[r2][c2];
    const color = a.split('_')[0];

    board[r2][c2] = a;
    board[r1][c1] = '';

    const bad = isKingInCheck(color);

    board[r1][c1] = a;
    board[r2][c2] = b;

    return bad;
}

function isKingInCheck(color){

    let kr,kc;

    for(let r=0;r<8;r++)
        for(let c=0;c<8;c++)
            if(board[r][c]===color+'_king'){
                kr=r;
                kc=c;
            }

    for(let r=0;r<8;r++)
        for(let c=0;c<8;c++)
            if(board[r][c]?.startsWith(otherColor(color)))
                if(getPseudoMoves(r,c,true).some(m=>m.r===kr&&m.c===kc))
                    return true;

    return false;
}

function hasAnyLegalMove(color){

    for(let r=0;r<8;r++)
        for(let c=0;c<8;c++)
            if(board[r][c]?.startsWith(color))
                if(getValidMoves(r,c).length>0)
                    return true;

    return false;
}

function getCheckStatus(color){
    const inCheck = isKingInCheck(color);
    const isMate = inCheck && !hasAnyLegalMove(color);
    return { inCheck, isMate };
}

function isSquareAttacked(r, c, byColor){

    for(let rr=0; rr<8; rr++){
        for(let cc=0; cc<8; cc++){
            if(board[rr][cc]?.startsWith(byColor)){
                if(getPseudoMoves(rr,cc,true).some(m => m.r===r && m.c===c))
                    return true;
            }
        }
    }

    return false;
}
