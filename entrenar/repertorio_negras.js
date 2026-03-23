// ===== LEER PARAMETROS URL =====
const params = new URLSearchParams(window.location.search);

const dificultad = params.get("dificultad") || "medio";
const color = params.get("color") || "Blancas";

console.log("Dificultad:", dificultad);
console.log("Color:", color);

// ===== MAPEO NOMBRE → CLAVE (SOLO LAS DE UNION.JS) =====
const aperturasMap = {
    "Apertura Italiana": "italiana",
    "Apertura Española": "espanola",
    "Apertura Escocesa": "escocesa",
    "Apertura Vienesa": "vienesa",
    "Gambito de Dama": "gambitodama",
    "Sistema Londres": "londres",
    "Ataque Indio de Rey": "indiorey",
    "Apertura Inglesa": "inglesa",
    "Apertura Réti": "reti",
    "Apertura Trompowsky": "trompowsky"
};

// 🔥 SOLO PARA MOSTRAR
const aperturas = Object.keys(aperturasMap);

const listaDiv = document.getElementById("listaAperturas");
const buscador = document.getElementById("buscador");
const btnRandom = document.getElementById("btnRandom");
const btnSiguiente = document.getElementById("btnSiguiente");

let aperturaSeleccionada = "";

// ===== MOSTRAR LISTA =====
function mostrarLista(filtro = "") {
    listaDiv.innerHTML = "";

    aperturas
        .filter(ap => ap.toLowerCase().includes(filtro.toLowerCase()))
        .forEach(apertura => {

            const item = document.createElement("div");
            item.classList.add("item-apertura");
            item.textContent = apertura;

            item.onclick = () => {
                aperturaSeleccionada = apertura;

                document.querySelectorAll(".item-apertura")
                    .forEach(i => i.classList.remove("activa"));

                item.classList.add("activa");
            };

            listaDiv.appendChild(item);
        });
}

mostrarLista();

// ===== BUSCADOR =====
if (buscador) {
    buscador.addEventListener("input", () => {
        mostrarLista(buscador.value);
    });
}

// ===== ALEATORIO =====
if (btnRandom) {
    btnRandom.addEventListener("click", () => {

        const randomIndex = Math.floor(Math.random() * aperturas.length);
        aperturaSeleccionada = aperturas[randomIndex];

        mostrarLista();

        document.querySelectorAll(".item-apertura")
            .forEach(item => {
                if (item.textContent === aperturaSeleccionada) {

                    item.classList.add("activa");

                    item.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            });
    });
}

// ===== SIGUIENTE =====
if (btnSiguiente) {
    btnSiguiente.addEventListener("click", () => {

        if (!aperturaSeleccionada) {
            alert("Debes elegir una apertura.");
            return;
        }

        const clave = aperturasMap[aperturaSeleccionada];

        const url = `../chess - v6 - 1 (blancas_IA)/union/union.html?dificultad=${dificultad}&apertura=${clave}`;

        console.log("Enviando a union:", clave);

        window.location.href = url;
    });
}