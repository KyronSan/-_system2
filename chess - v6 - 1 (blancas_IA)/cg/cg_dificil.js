/* ============================================================
   CG.JS — MOTOR DE AJEDREZ JAVASCRIPT (IA BASE)
   ------------------------------------------------------------
   ✔ Motor completo sin dependencias
   ✔ Pensado para funcionar con file://
   ✔ Compatible con tableros 8x8 clásicos
   ✔ Generación de movimientos legales
   ✔ Evaluación mejorada (centro, desarrollo, movilidad)
   ✔ Minimax + alpha-beta
   ✔ Negras piensan más profundo
   ------------------------------------------------------------
   Autor: CG (ChatGPT)
   ============================================================ */

"use strict";

/* ============================================================
   CONFIGURACIÓN GENERAL
   ============================================================ */

const CG = {};
CG.VERSION = "1.1.0";

// ===== ESTADO INTERNO PARA APERTURAS =====
CG.openingLine = null;
CG.openingIndex = 0;
CG.MAX_OPENING_PLIES = 4; // 2 jugadas negras

/* ============================================================
   REPRESENTACIÓN DEL TABLERO
   ============================================================ */

CG.EMPTY = ".";

CG.INIT_BOARD = [
    ["r","n","b","q","k","b","n","r"],
    ["p","p","p","p","p","p","p","p"],
    [".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".","."],
    ["P","P","P","P","P","P","P","P"],
    ["R","N","B","Q","K","B","N","R"]
];

/* ============================================================
   UTILIDADES
   ============================================================ */

CG.cloneBoard = function(board) {
    return board.map(row => row.slice());
};

CG.isWhite = function(piece) {
    return piece !== "." && piece === piece.toUpperCase();
};

CG.isBlack = function(piece) {
    return piece !== "." && piece === piece.toLowerCase();
};

CG.inBounds = function(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
};

/* ============================================================
   VALORES DE PIEZAS
   ============================================================ */

CG.PIECE_VALUES = {
    "P": 100, "p": -100,
    "N": 320, "n": -320,
    "B": 330, "b": -330,
    "R": 500, "r": -500,
    "Q": 900, "q": -900,
    "K": 20000, "k": -20000
};

// ===== LIBRO DE APERTURAS (REPERTORIO BLANCAS IA) =====
CG.OPENINGS = [
    ["e4", "Nf3"],     // Apertura Italiana
    ["e4", "Bb5"],     // Española
    ["e4", "d4"],      // Escocesa
    ["e4", "Nc3"],     // Vienesa
    ["d4", "c4"],      // Gambito de Dama
    ["d4", "Bf4"],     // Sistema Londres
    ["Nf3", "g3"],     // Ataque Indio de Rey
    ["c4", "Nc3"],     // Inglesa
    ["Nf3", "c4"],     // Reti
    ["d4", "Bg5"]      // Trompowsky
];

/* ============================================================
   📌 NUEVO — HEURÍSTICAS POSICIONALES
   ============================================================ */

CG.CENTER_SQUARES = [
    [3,3],[4,3],[3,4],[4,4]
];

CG.DEVELOPMENT_SQUARES = {
    n: [[1,2],[6,2]],
    b: [[2,2],[5,2]]
};

/* ============================================================
   EVALUACIÓN DEL TABLERO (REEMPLAZADA)
   ============================================================ */

CG.evaluateBoard = function(board) {
    let score = 0;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const piece = board[y][x];
            if (piece === ".") continue;

            // material
            score += CG.PIECE_VALUES[piece] || 0;

            const isWhite = CG.isWhite(piece);
            const sign = isWhite ? 1 : -1;
            const lower = piece.toLowerCase();

            /* ===============================
               CONTROL DEL CENTRO
            =============================== */
            for (let [cx,cy] of CG.CENTER_SQUARES) {
                if (x === cx && y === cy) {
                    score += 30 * sign;
                }
            }

            /* ===============================
               DESARROLLO DE PIEZAS
            =============================== */
            if (lower === "n" || lower === "b") {
                if ((isWhite && y < 7) || (!isWhite && y > 0)) {
                    score += 20 * sign;
                }
            }

            /* ===============================
               CASTIGO TORRES TEMPRANAS
            =============================== */
            if (lower === "r") {
                if ((isWhite && y === 7) || (!isWhite && y === 0)) {
                    score -= 25 * sign;
                }
            }

            /* ===============================
               REY EN EL CENTRO (MALO)
            =============================== */
            if (lower === "k") {
                if (x >= 2 && x <= 5 && y >= 2 && y <= 5) {
                    score -= 40 * sign;
                }
            }
        }
    }

    /* ===============================
       MOVILIDAD
    =============================== */
    const whiteMoves = CG.generateMoves(board, true).length;
    const blackMoves = CG.generateMoves(board, false).length;
    score += (whiteMoves - blackMoves) * 2;

    return score;
};

/* ============================================================
   GENERACIÓN DE MOVIMIENTOS
   ============================================================ */

CG.generateMoves = function(board, isWhiteTurn) {
    const moves = [];

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const piece = board[y][x];
            if (piece === ".") continue;

            if (isWhiteTurn && !CG.isWhite(piece)) continue;
            if (!isWhiteTurn && !CG.isBlack(piece)) continue;

            const lower = piece.toLowerCase();

            if (lower === "p") CG.genPawnMoves(board, x, y, moves);
            if (lower === "n") CG.genKnightMoves(board, x, y, moves);
            if (lower === "b") CG.genSlidingMoves(board, x, y, moves, [[1,1],[1,-1],[-1,1],[-1,-1]]);
            if (lower === "r") CG.genSlidingMoves(board, x, y, moves, [[1,0],[-1,0],[0,1],[0,-1]]);
            if (lower === "q") CG.genSlidingMoves(board, x, y, moves, [[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]);
            if (lower === "k") CG.genKingMoves(board, x, y, moves);
        }
    }

    return moves;
};

/* ============================================================
   PEÓN
   ============================================================ */

CG.genPawnMoves = function(board, x, y, moves) {
    const piece = board[y][x];
    const dir = CG.isWhite(piece) ? -1 : 1;
    const startRow = CG.isWhite(piece) ? 6 : 1;

    if (CG.inBounds(x, y + dir) && board[y + dir][x] === ".") {
        moves.push({from:[x,y], to:[x,y+dir]});
        if (y === startRow && board[y + 2*dir][x] === ".") {
            moves.push({from:[x,y], to:[x,y+2*dir]});
        }
    }

    for (let dx of [-1,1]) {
        const nx = x + dx;
        const ny = y + dir;
        if (!CG.inBounds(nx, ny)) continue;
        const target = board[ny][nx];
        if (target !== "." && CG.isWhite(piece) !== CG.isWhite(target)) {
            moves.push({from:[x,y], to:[nx,ny]});
        }
    }
};

/* ============================================================
   CABALLO
   ============================================================ */

CG.genKnightMoves = function(board, x, y, moves) {
    const piece = board[y][x];
    const deltas = [
        [1,2],[2,1],[-1,2],[-2,1],
        [1,-2],[2,-1],[-1,-2],[-2,-1]
    ];

    for (let [dx,dy] of deltas) {
        const nx = x + dx;
        const ny = y + dy;
        if (!CG.inBounds(nx, ny)) continue;
        const target = board[ny][nx];
        if (target === "." || CG.isWhite(target) !== CG.isWhite(piece)) {
            moves.push({from:[x,y], to:[nx,ny]});
        }
    }
};

/* ============================================================
   DESLIZANTES
   ============================================================ */

CG.genSlidingMoves = function(board, x, y, moves, directions) {
    const piece = board[y][x];

    for (let [dx,dy] of directions) {
        let nx = x + dx;
        let ny = y + dy;
        while (CG.inBounds(nx, ny)) {
            const target = board[ny][nx];
            if (target === ".") {
                moves.push({from:[x,y], to:[nx,ny]});
            } else {
                if (CG.isWhite(target) !== CG.isWhite(piece)) {
                    moves.push({from:[x,y], to:[nx,ny]});
                }
                break;
            }
            nx += dx;
            ny += dy;
        }
    }
};

/* ============================================================
   REY
   ============================================================ */

CG.genKingMoves = function(board, x, y, moves) {
    const piece = board[y][x];
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (!CG.inBounds(nx, ny)) continue;
            const target = board[ny][nx];
            if (target === "." || CG.isWhite(target) !== CG.isWhite(piece)) {
                moves.push({from:[x,y], to:[nx,ny]});
            }
        }
    }
};

/* ============================================================
   APLICAR MOVIMIENTO
   ============================================================ */

CG.makeMove = function(board, move) {
    const newBoard = CG.cloneBoard(board);
    const [fx,fy] = move.from;
    const [tx,ty] = move.to;
    newBoard[ty][tx] = newBoard[fy][fx];
    newBoard[fy][fx] = ".";
    return newBoard;
};

/* ============================================================
   SI EL REY ESTA EN JAQUE
   ============================================================ */

CG.isKingInCheck = function(board, isWhiteTurn) {
    const kingChar = isWhiteTurn ? "K" : "k";
    let kingPos = null;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[y][x] === kingChar) {
                kingPos = [x, y];
                break;
            }
        }
        if (kingPos) break;
    }

    if (!kingPos) return true; // Rey perdido = jaque mate

    // Generar movimientos enemigos **solo si el rey existe**
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const piece = board[y][x];
            if (piece === ".") continue;
            if (CG.isWhite(piece) === isWhiteTurn) continue; // ignorar aliados

            const lower = piece.toLowerCase();
            const moves = [];
            if (lower === "p") CG.genPawnMoves(board, x, y, moves);
            if (lower === "n") CG.genKnightMoves(board, x, y, moves);
            if (lower === "b") CG.genSlidingMoves(board, x, y, moves, [[1,1],[1,-1],[-1,1],[-1,-1]]);
            if (lower === "r") CG.genSlidingMoves(board, x, y, moves, [[1,0],[-1,0],[0,1],[0,-1]]);
            if (lower === "q") CG.genSlidingMoves(board, x, y, moves, [[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]);
            if (lower === "k") CG.genKingMoves(board, x, y, moves);

            for (let move of moves) {
                const [tx, ty] = move.to;
                if (tx === kingPos[0] && ty === kingPos[1]) return true;
            }
        }
    }

    return false;
};

CG.generateLegalMoves = function(board, isWhiteTurn) {
    const moves = CG.generateMoves(board, isWhiteTurn);
    const legalMoves = [];

    for (let move of moves) {
        const newBoard = CG.makeMove(board, move);
        if (!CG.isKingInCheck(newBoard, isWhiteTurn)) {
            legalMoves.push(move);
        }
    }

    // Si no hay movimientos legales, devolver null para evitar errores
    if (legalMoves.length === 0) return [];
    return legalMoves;
};


/* ============================================================
   MINIMAX + ALPHA BETA
   ============================================================ */

CG.minimax = function(board, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0) {
        return CG.evaluateBoard(board);
    }

    const moves = CG.generateLegalMoves(board, maximizingPlayer);

    if (maximizingPlayer) {
        let maxScore = -Infinity;
        for (let move of moves) {
            const newBoard = CG.makeMove(board, move);
            const score = CG.minimax(newBoard, depth - 1, alpha, beta, false);
            maxScore = Math.max(maxScore, score);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
        }
        return maxScore;
    } else {
        let minScore = Infinity;
        for (let move of moves) {
            const newBoard = CG.makeMove(board, move);
            const score = CG.minimax(newBoard, depth - 1, alpha, beta, true);
            minScore = Math.min(minScore, score);
            beta = Math.min(beta, score);
            if (beta <= alpha) break;
        }
        return minScore;
    }
};

/* ============================================================
   MEJOR MOVIMIENTO
   ============================================================ */

// ===== TRADUCTOR NOTACIÓN SIMPLE → MOVIMIENTO =====
CG.findMoveByNotation = function(board, isWhiteTurn, notation) {

    const moves = CG.generateLegalMoves(board, isWhiteTurn);

    for (let move of moves) {

        const [fx, fy] = move.from;
        const [tx, ty] = move.to;
        const piece = board[fy][fx].toLowerCase();

        const file = "abcdefgh"[tx];
        const rank = 8 - ty;

        // peón
        if (piece === "p" && notation === file + rank) {
            return move;
        }

        // piezas
        if (piece === notation[0].toLowerCase()) {
            if (notation.slice(1) === file + rank) {
                return move;
            }
        }

    }

    return null;
};

/* ============================================================
   BUSCAR MEJOR MOVIMIENTO (RAÍZ DEL MINIMAX)
   ============================================================ */

CG.findBestMove = function(board, isWhiteTurn, depth) {
    let bestMove = null;
    let bestScore = isWhiteTurn ? -Infinity : Infinity;

    const moves = CG.generateLegalMoves(board, isWhiteTurn);

    if (!moves || moves.length === 0) return null; // evita error interno

    for (let move of moves) {
        const newBoard = CG.makeMove(board, move);
        const score = CG.minimax(newBoard, depth - 1, -Infinity, Infinity, !isWhiteTurn);

        if (isWhiteTurn) {
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        } else {
            if (score < bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
    }

    return bestMove;
};

/* ============================================================
   API PÚBLICA
   ============================================================ */

CG.getMove = function(board, isWhiteTurn) {

    // ===== APERTURA SOLO PARA LA IA (BLANCAS) =====
    if (isWhiteTurn && CG.openingLine) {

        if (CG.openingIndex < CG.openingLine.length) {

            const notation = CG.openingLine[CG.openingIndex];
            const move = CG.findMoveByNotation(board, true, notation);

            if (move) {
                CG.openingIndex++;
                return move;
            }

        }
    }

    // ===== MOTOR NORMAL =====
    const depth = 3;
    return CG.findBestMove(board, isWhiteTurn, depth);
};

/* ============================================================
    RECIBIR APERTURA DESDE UNION.JS
   ============================================================ */

window.addEventListener("message", (e) => {

    if (e.data?.type === "setOpening") {

        CG.openingLine = e.data.value;
        CG.openingIndex = 0;

        console.log("CG_FACIL recibió apertura:", CG.openingLine);

    }

});

/* ============================================================
    PROMOCIÓN (La IA elige automáticamente la mejor pieza según heurísticas simples)
    ============================================================ */
    
CG.choosePromotion = function(board, color){

    const pieces = ["queen","rook","bishop","knight"];
    let bestPiece = "queen";
    let bestScore = -Infinity;

    for(let piece of pieces){

        const testBoard = CG.cloneBoard(board);

        // buscar el peón que acaba de promocionar
        for(let y=0;y<8;y++){
            for(let x=0;x<8;x++){
                if(testBoard[y][x] === (color === 'w' ? 'P' : 'p')){
                    
                    // simular promoción
                    testBoard[y][x] = (color === 'w'
                        ? piece[0].toUpperCase()
                        : piece[0].toLowerCase());

                    const score = CG.evaluateBoard(testBoard);

                    if(score > bestScore){
                        bestScore = score;
                        bestPiece = piece;
                    }

                    testBoard[y][x] = (color === 'w' ? 'P' : 'p');
                }
            }
        }
    }

    return bestPiece;
};

window.CG = CG;