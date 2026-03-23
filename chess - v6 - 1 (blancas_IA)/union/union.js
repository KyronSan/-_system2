const chessFrame = document.getElementById("chessFrame");
const animationFrame = document.getElementById("animationFrame");
const blueBox = document.getElementById("blueBox");

// ===============================
// AUTO-REFRESH SOLO UNA VEZ
// ===============================
const vieneDeRepertorio =
    document.referrer.includes("repertorio_blancas") ||
    document.referrer.includes("repertorio_negras");

const yaRecargo = sessionStorage.getItem("union_recargado");

if (vieneDeRepertorio && !yaRecargo) {
    sessionStorage.setItem("union_recargado", "true");

    console.log("Auto-recargando por entrada desde repertorio...");
    location.reload();
}

/* ===============================
   LEER PARAMETROS DE LA URL
   =============================== */
const urlParams = new URLSearchParams(window.location.search);

const dificultadURL = urlParams.get("dificultad");
const aperturaURL = urlParams.get("apertura");

console.log("UNION URL dificultad:", dificultadURL);
console.log("UNION URL apertura:", aperturaURL);

/* ===============================
   APERTURA SELECCIONADA
   =============================== */
let selectedOpening = null;
let aperturaClaveGlobal = null;
let difficultyGlobal = null;

/* ===============================
   CAJA DE MENSAJE
   =============================== */
const infoBox = document.createElement("div");
infoBox.id = "unionInfo";
infoBox.textContent = "Esperando selección de dificultad…";

Object.assign(infoBox.style, {
    margin: "10px",
    padding: "10px",
    background: "#111",
    color: "rgb(255, 255, 255)",
    border: "2px solid rgb(30, 42, 151)",
    fontFamily: "monospace",
    textAlign: "center",
    display: "none"
});

document.body.appendChild(infoBox);

/* ===============================
   AUTO CONFIGURAR DESDE URL
   =============================== */
window.addEventListener("load", () => {

    if (!dificultadURL || !aperturaURL) return;

    const dificultadMap = {
        facil: "facil",
        medio: "medio",
        dificil: "dificil"
    };

    const difficultyForChess = dificultadMap[dificultadURL];

    const openingsMap = {
        italiana: ["e4", "Nf3"],
        espanola: ["e4", "Bb5"],
        escocesa: ["e4", "d4"],
        vienesa: ["e4", "Nc3"],
        gambitodama: ["d4", "c4"],
        londres: ["d4", "Bf4"],
        indiorey: ["Nf3", "g3"],
        inglesa: ["c4", "Nc3"],
        reti: ["Nf3", "c4"],
        trompowsky: ["d4", "Bg5"]
    };

    const openingMoves = openingsMap[aperturaURL];

    // 🔥 GUARDAR GLOBAL
    difficultyGlobal = difficultyForChess;
    aperturaClaveGlobal = aperturaURL;

    console.log("AUTO dificultad:", difficultyForChess);
    console.log("AUTO apertura:", openingMoves);

    setTimeout(() => {

        // ✅ enviar dificultad
        if (difficultyForChess) {
            chessFrame.contentWindow.postMessage({
                type: "setDifficulty",
                value: difficultyForChess
            }, "*");
        }

        // ✅ enviar apertura
        if (openingMoves) {
            chessFrame.contentWindow.postMessage({
                type: "setOpening",
                value: openingMoves,
                firstMove: 'w'
            }, "*");

            selectedOpening = openingMoves;
        }

        // ✅ ocultar bloqueo azul
        if (blueBox) {
            blueBox.style.display = "none";
            blueBox.style.pointerEvents = "none";
        }

    }, 800);

});

/* ===============================
   RECIBIR DIFICULTAD DEL IFRAME
   =============================== */
window.addEventListener("message", (e) => {
    if (!e.data || e.data.type !== "difficulty") return;

    const nombres = {
        facil: "FÁCIL",
        intermedio: "INTERMEDIA",
        dificil: "DIFÍCIL"
    };

    infoBox.textContent = `Se seleccionó: ${nombres[e.data.value]}`;
});

/* ===============================
   RECIBIR APERTURA (MANUAL)
   =============================== */
window.addEventListener("message", (e) => {

    if (!e.data || e.data.type !== "opening") return;

    const openingsMap = {
        italiana: ["e4", "Nf3"],
        espanola: ["e4", "Bb5"],
        escocesa: ["e4", "d4"],
        vienesa: ["e4", "Nc3"],
        gambitodama: ["d4", "c4"],
        londres: ["d4", "Bf4"],
        indiorey: ["Nf3", "g3"],
        inglesa: ["c4", "Nc3"],
        reti: ["Nf3", "c4"],
        trompowsky: ["d4", "Bg5"]
    };

    const opening = openingsMap[e.data.value];

    if (opening) {
        selectedOpening = opening;

        console.log("UNION recibió apertura:", e.data.value, "→", selectedOpening);

        chessFrame.contentWindow.postMessage({
            type: "setOpening",
            value: selectedOpening,
            firstMove: 'w'
        }, "*");
    }

});

/* ===============================
   RECIBIR DIFICULTAD (MANUAL)
   =============================== */
window.addEventListener("message", (e) => {

    if (!e.data || e.data.type !== "difficulty") return;

    const map = {
        facil: "facil",
        intermedio: "medio",
        dificil: "dificil"
    };

    const difficultyForChess = map[e.data.value];
    if (!difficultyForChess) return;

    chessFrame.contentWindow.postMessage({
        type: "setDifficulty",
        value: difficultyForChess
    }, "*");

    setTimeout(() => {

        if (selectedOpening) {
            chessFrame.contentWindow.postMessage({
                type: "setOpening",
                value: selectedOpening,
                firstMove: 'w'
            }, "*");
        }

    }, 200);

    if (selectedOpening) {
        chessFrame.contentWindow.postMessage({
            type: "setOpening",
            value: selectedOpening,
            firstMove: 'w'
        }, "*");
    }

    if (blueBox) {
        blueBox.style.display = "none";
        blueBox.style.pointerEvents = "none";
    }

});

/* ===============================
   MENSAJE SI NO ELIGEN DIFICULTAD
   =============================== */
if (blueBox) {

    blueBox.addEventListener("click", () => {

        if (blueBox.querySelector(".blueMessage")) return;

        const msg = document.createElement("div");
        msg.className = "blueMessage";
        msg.textContent = "Selecciona una dificultad.";

        Object.assign(msg.style, {
            color: "#fff",
            fontFamily: "monospace",
            fontSize: "32px",
            padding: "210px 120px",
            border: "3px solid #ffffff",
            borderRadius: "6px",
            background: "rgba(0, 0, 0, 0.55)",
            textAlign: "center"
        });

        blueBox.style.display = "flex";
        blueBox.style.alignItems = "center";
        blueBox.style.justifyContent = "center";

        blueBox.appendChild(msg);

        setTimeout(() => {
            msg.remove();
        }, 2500);

    });

}

/* ===============================
   AUTO → ANIMATION
   =============================== */
setTimeout(() => {

    if (!animationFrame || !animationFrame.contentWindow) return;
    if (!aperturaClaveGlobal || !difficultyGlobal) return;

    console.log("AUTO → animación:", aperturaClaveGlobal, difficultyGlobal);

    const mapAnim = {
        facil: "facil",
        medio: "intermedio",
        dificil: "dificil"
    };

    animationFrame.contentWindow.postMessage({
        type: "autoSetup",
        apertura: aperturaClaveGlobal,
        dificultad: mapAnim[difficultyGlobal]
    }, "*");

}, 100);


// --  BOTÓN DE REINICIO --
const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {
    resetBtn.addEventListener("click", () => {

        // 🔥 RECARGAR TODA LA PÁGINA
        window.location.reload();

    });
}