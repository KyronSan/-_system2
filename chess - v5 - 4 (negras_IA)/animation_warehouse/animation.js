const image = document.getElementById('characterImage');
const textBox = document.getElementById('dialogText');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

const difficultyButtons = document.querySelectorAll('#difficultyBox button');

/* ===== NUEVO: SELECTOR DE APERTURA ===== */
const openingSelect = document.getElementById("openingSelect");

/* ===== EMOCIONES DISPONIBLES ===== */
const emotionFrames = {
    hablar: ["images/hablar_1.png", "images/hablar_2.png"],
    enojado: ["images/enojado_1.png", "images/enojado_2.png"],
    triste: ["images/triste_1.png", "images/triste_2.png"],
    llorando: ["images/llorando_1.png", "images/llorando_2.png"],
    sorprendido: ["images/sorprendido_1.png", "images/sorprendido_2.png"]
};

/* ===== DIÁLOGOS BASE ===== */
let dialog = [
    { texto: "Selecciona una dificultad.", emocion: "hablar" },
    { texto: "Cada rival piensa distinto.", emocion: "hablar" }
];

let dialogIndex = 0;
let charIndex = 0;
let frameIndex = 0;
let currentEmotion = "hablar";
let talkingInterval = null;
let typingInterval = null;

/* ===== REGISTRO GLOBAL ===== */
window.loadedCharacter = null;

window.registerCharacter = function (data) {
    window.loadedCharacter = data;
};

/* ===== ANIMACIÓN ===== */
function startTalking() {
    if (talkingInterval) return;

    talkingInterval = setInterval(() => {
        const frames = emotionFrames[currentEmotion] || emotionFrames.hablar;
        image.src = frames[frameIndex % 2];
        frameIndex++;
    }, 180);
}

function stopTalking() {
    clearInterval(talkingInterval);
    talkingInterval = null;
    image.src = (emotionFrames[currentEmotion] || emotionFrames.hablar)[0];
}

/* ===== TEXTO ===== */
function typeText(obj) {
    clearInterval(typingInterval);
    textBox.textContent = '';
    charIndex = 0;
    frameIndex = 0;

    currentEmotion = obj.emocion || "hablar";
    startTalking();

    typingInterval = setInterval(() => {
        if (charIndex < obj.texto.length) {
            textBox.textContent += obj.texto[charIndex++];
        } else {
            clearInterval(typingInterval);
            stopTalking();
        }
    }, 35);
}

/* ===== CONTROLES ===== */
nextBtn.onclick = () => {
    if (dialogIndex < dialog.length - 1) {
        dialogIndex++;
        typeText(dialog[dialogIndex]);
    }
};

prevBtn.onclick = () => {
    if (dialogIndex > 0) {
        dialogIndex--;
        typeText(dialog[dialogIndex]);
    }
};

/* ===== SELECCIÓN DE DIFICULTAD ===== */
difficultyButtons.forEach(btn => {
    btn.onclick = () => {
        const level = btn.dataset.level;
        cargarPersonaje(level);

        /* =========================================
   ENVIAR DIFICULTAD A UNION.JS - FASE 1 de 2*/
        notificarDificultad(level); // ← ESTA ES LA CLAVE

    };
});

/* ===== CARGAR PERSONAJE ===== */
function cargarPersonaje(code) {
    window.loadedCharacter = null;

    const script = document.createElement("script");
    script.src = `js_animation/${code}.js`;

    script.onload = () => {
        if (!window.loadedCharacter) {
            mostrarError();
            return;
        }
        dialog = window.loadedCharacter.dialogos;
        dialogIndex = 0;
        typeText(dialog[0]);
    };

    script.onerror = mostrarError;
    document.body.appendChild(script);
}

function mostrarError() {
    dialog = [{
        texto: "Este rival no está disponible.",
        emocion: "enojado"
    }];
    dialogIndex = 0;
    typeText(dialog[0]);
}

/* ===== INICIO ===== */
typeText(dialog[dialogIndex]);

/* ===== NUEVO: BLOQUEAR DIFICULTAD HASTA ELEGIR APERTURA ===== */
difficultyButtons.forEach(btn => {
    btn.disabled = true;
});

window.addEventListener("message", e => {
    if (e.data?.type === "emotion") {
        setEmotion(e.data.value);
    }
});

/* =========================================
   ENVIAR DIFICULTAD A UNION.JS - FASE 2 de 2
   ========================================= */
function notificarDificultad(level) {
    if (window.parent) {
        window.parent.postMessage({
            type: "difficulty",
            value: level
        }, "*");
    }
}

/* =========================================
   Mantener presionado el botón de dificultad
   ========================================= */
const buttons = document.querySelectorAll("#difficultyBox button");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

/* =========================================
   RECIBIR EVENTOS DESDE UNION (AJEDREZ)
   ========================================= */
window.addEventListener("message", (e) => {
    if (e.data?.type !== "animation-event") return;

    const ev = e.data.event;

    // SOLO escuchar al jugador (blancas)
    if (ev.color !== "w") return; // solo reaccionar al jugador

    // Detectar IA activa según dificultad cargada
    const AI =
        window.AI_FACIL ||
        window.AI_INTERMEDIO ||
        window.AI_DIFICIL;

    if (!AI) return;

    // === MOVIMIENTO ===
    if (ev.kind === "move") {
        AI.onMove && AI.onMove(ev.piece);

        if (ev.captured) {
            AI.onCapture && AI.onCapture(ev.piece);
        }

        if (ev.check) {
            AI.onCheck && AI.onCheck();
        }

        if (ev.mate) {
            AI.onCheckMate && AI.onCheckMate(ev.color === "w" ? "player" : "ai");
        }
    }

    // === ENROQUE ===
    if (ev.kind === "castle") {
        AI.onCastle && AI.onCastle();

        if (ev.check) {
            AI.onCheck && AI.onCheck();
        }

        if (ev.mate) {
            AI.onCheckMate && AI.onCheckMate(ev.color === "w" ? "player" : "ai");
        }
    }
});

/* =========================================
   SELECCIÓN DE APERTURA
   ========================================= */

if (openingSelect) {

    openingSelect.addEventListener("change", () => {

        const opening = openingSelect.value;

        if (!opening) return;

        // activar botones de dificultad
        difficultyButtons.forEach(btn => {
            btn.disabled = false;
        });

        // enviar apertura al union
        if (window.parent) {
            window.parent.postMessage({
                type: "opening",
                value: opening
            }, "*");
        }

    });

}

/* =========================================
   AUTO CONFIG DESDE UNION (SIN USUARIO)
   ========================================= */
window.addEventListener("message", (e) => {

    if (e.data?.type !== "autoSetup") return;

    const apertura = e.data.apertura;
    const dificultad = e.data.dificultad;

    console.log("ANIMATION AUTO:", apertura, dificultad);

    // ✅ seleccionar apertura en el select
    if (openingSelect) {
        openingSelect.value = apertura;

        // habilitar botones
        difficultyButtons.forEach(btn => {
            btn.disabled = false;
        });
    }

    // ✅ cargar personaje automáticamente
    if (dificultad) {
        cargarPersonaje(dificultad);

        // marcar botón activo
        difficultyButtons.forEach(b => b.classList.remove("active"));
        const btn = document.querySelector(`#difficultyBox button[data-level="${dificultad}"]`);
        if (btn) btn.classList.add("active");

        // 🔥 IMPORTANTE: notificar a union
        notificarDificultad(dificultad);
    }

    // 🔥🔥🔥 CONFIRMACIÓN A UNION 🔥🔥🔥
    if (window.parent) {
        window.parent.postMessage({
            type: "animation-ready"
        }, "*");
    }

});

// 🔥 DETECTAR SI ESTÁ DENTRO DE UN IFRAME
if (window !== window.parent) {

    const openingBox = document.getElementById("openingBox");
    const difficultyBox = document.getElementById("difficultyBox");

    if (openingBox) {
        openingBox.style.display = "none";
    }

    if (difficultyBox) {
        difficultyBox.style.display = "none";
    }
}
