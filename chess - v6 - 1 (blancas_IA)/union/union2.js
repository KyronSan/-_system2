const logBox = document.getElementById("eventLog");

window.addEventListener("message", (e) => {
    if (e.data?.type !== "chess-event") return;

    const ev = e.data.event;

    let msg = "";

    if (ev.kind === "move") {
        msg = `Movimiento: ${ev.color === "w" ? "Blancas" : "Negras"} 
${ev.piece} ${ev.from} → ${ev.to}`;

        if (ev.captured) msg += " (captura)";
        if (ev.check) msg += " +Jaque";
        if (ev.mate) msg += " #Mate";
    }

    if (ev.kind === "castle") {
        msg = `Enroque ${ev.side === "king" ? "corto" : "largo"} 
(${ev.color === "w" ? "Blancas" : "Negras"})`;

        if (ev.check) msg += " +Jaque";
        if (ev.mate) msg += " #Mate";
    }

    // ✅ LO QUE YA FUNCIONA (NO SE TOCA)
    logBox.textContent = msg;

    // 📤 NUEVO: reenviar a animation.html SIN afectar la UI
    const animFrame = document.getElementById("animationFrame");
    if (animFrame && animFrame.contentWindow) {
        animFrame.contentWindow.postMessage({
            type: "animation-event",
            event: ev,
            text: msg
        }, "*");
    }
});
