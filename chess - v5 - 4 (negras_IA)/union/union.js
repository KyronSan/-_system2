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
   LEER PARAMETROS DE LA URL (REPERTORIO)
   =============================== */
const urlParams = new URLSearchParams(window.location.search);

const dificultadURL = urlParams.get("dificultad");
const aperturaURL = urlParams.get("apertura");

console.log("UNION URL dificultad:", dificultadURL);
console.log("UNION URL apertura:", aperturaURL);

/* ===============================
   MAPEO DE NOMBRES DE APERTURA
   =============================== */
const aperturaNombreAMap = {
    "Defensa Francesa": "francesa",
    "Defensa Caro-Kann": "carokann",
    "Defensa Siciliana": "siciliana",
    "Defensa Pirc": "pirc",
    "Defensa India de Rey": "india",
    "Defensa Eslava": "eslava",
    "Defensa Moderna": "moderna",
    "Defensa Alekhine": "alekhine",
    "Defensa Owen": "owen",
    "Defensa Semi-Eslava": "semieslava"
};

/* ===============================
   APERTURA SELECCIONADA
   =============================== */
let selectedOpening = null;
let aperturaClaveGlobal = null;
let difficultyGlobal = null;

/* ===============================
   CAJA DE MENSAJE EN UNION.HTML
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
    const aperturaClave = aperturaNombreAMap[aperturaURL];

    // 🔥 GUARDAR GLOBALMENTE
    difficultyGlobal = difficultyForChess;
    aperturaClaveGlobal = aperturaClave;

    const openingsMap = {
        francesa: ["e6", "d5"],
        carokann: ["c6", "d5"],
        siciliana: ["c5", "Nc6"],
        pirc: ["d6", "Nf6"],
        india: ["Nf6", "e6"],
        eslava: ["d5", "c6"],
        moderna: ["g6", "Bg7"],
        alekhine: ["Nf6", "d6"],
        owen: ["b6", "Bb7"],
        semieslava: ["d5", "e6"]
    };

    const openingMoves = openingsMap[aperturaClave];

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
                value: openingMoves
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
   RECIBIR MENSAJES DEL IFRAME
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
   RECIBIR APERTURA DESDE ANIMATION
   =============================== */
window.addEventListener("message", (e) => {

    if (!e.data || e.data.type !== "opening") return;

    const openingsMap = {

        francesa: ["e6", "d5"],
        carokann: ["c6", "d5"],
        siciliana: ["c5", "Nc6"],
        pirc: ["d6", "Nf6"],
        india: ["Nf6", "e6"],
        eslava: ["d5", "c6"],
        moderna: ["g6", "Bg7"],
        alekhine: ["Nf6", "d6"],
        owen: ["b6", "Bb7"],
        semieslava: ["d5", "e6"]

    };

    const opening = openingsMap[e.data.value];

    if (opening) {
        selectedOpening = opening;

        console.log("UNION recibió apertura:", e.data.value, "→", selectedOpening);

        chessFrame.contentWindow.postMessage({
            type: "setOpening",
            value: selectedOpening
        }, "*");
    }

});

/* ===============================
   ENVIAR DIFICULTAD AL CHESS
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
                value: selectedOpening
            }, "*");
        }

    }, 200);

    if (selectedOpening) {
        chessFrame.contentWindow.postMessage({
            type: "setOpening",
            value: selectedOpening
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

        if (window.innerWidth <= 1000 || window.innerWidth <= 700) {
            Object.assign(msg.style, {
                fontSize: "70px",
                width: "85vw",
                maxWidth: "85vw",
                padding: "300px",
                borderWidth: "3px",
                borderRadius: "8px",
                background: "rgba(0, 0, 0, 0.7)",
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            });
        }

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
    AUTO → ANIMATION (MEJORADO)
   =============================== */

let animationConfirmada = false;

// 🔹 ESCUCHAR CONFIRMACIÓN DESDE animation.js
window.addEventListener("message", (e) => {
    if (e.data?.type === "animation-ready") {
        animationConfirmada = true;
        console.log("✅ Animación confirmó recepción");
    }
});

// 🔹 FUNCIÓN PARA ENVIAR
function enviarAnimacion(apertura, dificultad) {

    if (!animationFrame || !animationFrame.contentWindow) return;

    const mapAnim = {
        facil: "facil",
        medio: "intermedio",
        dificil: "dificil"
    };

    console.log("AUTO → animación:", apertura, dificultad);

    animationFrame.contentWindow.postMessage({
        type: "autoSetup",
        apertura: apertura,
        dificultad: mapAnim[dificultad]
    }, "*");
}

// 🔹 ENVÍO INICIAL
setTimeout(() => {

    if (!aperturaClaveGlobal || !difficultyGlobal) return;

    enviarAnimacion(aperturaClaveGlobal, difficultyGlobal);

}, 100);

// 🔥 REINTENTO SI FALLA
setTimeout(() => {

    if (animationConfirmada) return;

    console.warn("⚠️ Animación NO respondió, reintentando desde URL...");

    const urlParams = new URLSearchParams(window.location.search);

    let dificultad = urlParams.get("dificultad");
    let apertura = urlParams.get("apertura");

    if (!dificultad || !apertura) return;

    // 🔹 NORMALIZAR
    apertura = apertura
        .toLowerCase()
        .replace("defensa ", "")
        .replace(/\s/g, "");

    console.log("🔁 REINTENTO → animación:", apertura, dificultad);

    enviarAnimacion(apertura, dificultad);

}, 100);

// --  BOTÓN DE REINICIO --
const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {
    resetBtn.addEventListener("click", () => {

        // 🔥 RECARGAR TODA LA PÁGINA
        window.location.reload();

    });
}
