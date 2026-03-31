function finishMove(type, c1, c2, r, color, captured, extra = {}) {

    /* ===== ENROQUE ===== */
    if (extra.castle) {
        let move = extra.castle === 'king' ? 'O-O' : 'O-O-O';

        const enemy = otherColor(color);
        const checkInfo = getCheckStatus(enemy);

        if (checkInfo.isMate) move += '#';
        else if (checkInfo.inCheck) move += '+';

        moveHistory.push(move);
        turn = enemy;
        updateHistory();
        return;
    }

    /* ===== MOVIMIENTO NORMAL ===== */
    let move = '';

    if (type === 'pawn') {
        if (captured) move += files[c1] + 'x';
        move += files[c2] + (8 - r);
    } else {
        move += pieceLetters[type];
        if (captured) move += 'x';
        move += files[c2] + (8 - r);
    }

    const enemy = otherColor(color);
    const checkInfo = getCheckStatus(enemy);

    if (checkInfo.isMate) move += '#';
    else if (checkInfo.inCheck) move += '+';

    moveHistory.push(move);
    turn = enemy;
    updateHistory();
}


/* ===== HISTORIAL EN FORMATO BLANCAS / NEGRAS ===== */
function updateHistory() {
    movesDiv.innerHTML = '';

    for (let i = 0; i < moveHistory.length; i += 2) {
        const moveNumber = Math.floor(i / 2) + 1;
        const whiteMove = moveHistory[i] || '';
        const blackMove = moveHistory[i + 1] || '';

        movesDiv.innerHTML += `
            <div>
                ${moveNumber}. ${whiteMove}ㅤㅤㅤㅤㅤ${blackMove}
            </div>
        `;
    }

    // 👇 AUTO-SCROLL A LA ÚLTIMA JUGADA
    movesDiv.scrollTop = movesDiv.scrollHeight;
}
