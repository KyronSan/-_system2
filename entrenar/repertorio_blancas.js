// ===== LEER PARAMETROS URL =====
const params = new URLSearchParams(window.location.search);

const dificultad = params.get("dificultad") || "medio";
const color = params.get("color") || "Negras";

console.log("Dificultad:", dificultad);
console.log("Color:", color);

// ===== LISTA DE APERTURAS =====
const aperturas = [
    "Defensa Francesa",
    "Defensa Caro-Kann",
    "Defensa Siciliana",
    "Defensa Pirc",
    "Defensa India de Rey",
    "Defensa Eslava",
    "Defensa Moderna",
    "Defensa Alekhine",
    "Defensa Owen",
    "Defensa Semi-Eslava"
];

const listaDiv = document.getElementById("listaAperturas");
const buscador = document.getElementById("buscador");
const btnRandom = document.getElementById("btnRandom");
const btnSiguiente = document.getElementById("btnSiguiente");
const btnPreview = document.getElementById("btnPreview");

let aperturaSeleccionada = "";
btnPreview.classList.add("disabled");
let ultimaApertura = null; // 🔥 NUEVO

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
                // 🔥 ACTIVAR BOTON
                btnPreview.classList.remove("disabled");
            };

            listaDiv.appendChild(item);
        });
}

mostrarLista();

// ===== BUSCADOR =====
buscador.addEventListener("input", () => {
    mostrarLista(buscador.value);
});

// ===== ALEATORIO =====
btnRandom.addEventListener("click", () => {
    btnPreview.classList.remove("disabled");

    let nuevaApertura;

    do {
        const randomIndex = Math.floor(Math.random() * aperturas.length);
        nuevaApertura = aperturas[randomIndex];
    } while (nuevaApertura === ultimaApertura && aperturas.length > 1);

    aperturaSeleccionada = nuevaApertura;
    ultimaApertura = nuevaApertura;

    mostrarLista();

    document.querySelectorAll(".item-apertura")
        .forEach(item => {
            if (item.textContent === aperturaSeleccionada) {
                item.classList.add("activa");

                // 🔥 scroll automático
                item.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
});

// ===== SIGUIENTE =====
btnSiguiente.addEventListener("click", () => {

    if (!aperturaSeleccionada) {
        alert("Debes elegir una apertura.");
        return;
    }

    const url = `../chess - v5 - 4 (negras_IA)/union/union.html?dificultad=${dificultad}&apertura=${encodeURIComponent(aperturaSeleccionada)}`;
    window.location.href = url;
});

// ===== PREVIEW =====
btnPreview.addEventListener("click", () => {

    if (!aperturaSeleccionada) {
        alert("Elija una apertura primero");
        return;
    }

    const url = `opening_examples/opening_changes.html?apertura=${encodeURIComponent(aperturaSeleccionada)}`;
    window.location.href = url;
});