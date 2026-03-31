// ==============================
// 🔒 ESPERAR DOM
// ==============================
document.addEventListener("DOMContentLoaded", () => {

    const btnExportar = document.getElementById("exportarBtn");
    const btnImportar = document.getElementById("importarBtn");

    if (!btnExportar || !btnImportar) {
        console.error("Botones no encontrados");
        return;
    }

    // ==============================
    // 📤 EXPORTAR → DESCARGAR JSON
    // ==============================
    btnExportar.addEventListener("click", () => {

        const casillas = document.querySelectorAll("#tablero div");

        if (casillas.length === 0) {
            alert("No hay tablero");
            return;
        }

        let tablero = [];

        casillas.forEach((casilla) => {
            const pieza = casilla.textContent.trim();
            tablero.push(pieza === "" ? null : pieza);
        });

        const data = {
            tipo: "SOENAJ_TABLERO",
            version: 1,
            fecha: new Date().toISOString(),
            tablero: tablero
        };

        const json = JSON.stringify(data, null, 2);

        // 🔥 Crear archivo descargable
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "tablero_soenaj.json";
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });


    // ==============================
    // 📥 IMPORTAR → LEER ARCHIVO JSON
    // ==============================
    btnImportar.addEventListener("click", () => {

        // 🔥 Crear input oculto
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";

        input.addEventListener("change", (event) => {
            const file = event.target.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);

                    if (!data.tablero || !Array.isArray(data.tablero)) {
                        alert("❌ JSON inválido");
                        return;
                    }

                    const casillas = document.querySelectorAll("#tablero div");

                    data.tablero.forEach((pieza, index) => {
                        if (casillas[index]) {
                            casillas[index].textContent = pieza ? pieza : "";
                        }
                    });

                    alert("✅ Tablero cargado correctamente");

                } catch (error) {
                    alert("❌ Error al leer el archivo");
                }
            };

            reader.readAsText(file);
        });

        input.click();
    });

});