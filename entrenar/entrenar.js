document.addEventListener("DOMContentLoaded", () => {

    const btnEntrar = document.getElementById("btnEntrar");
    const btnVolverInicio = document.getElementById("btnVolverInicio");

    btnEntrar.addEventListener("click", () => {

        const color = document.getElementById("colorSelect").value;
        const dificultad = document.getElementById("dificultadSelect").value;

        if (!color || !dificultad) {
            alert("Debes elegir color y dificultad.");
            return;
        }

        const params = `?dificultad=${dificultad}`;

        if (color === "blancas") {
            window.location.href = "repertorio_blancas.html" + params;
        } else {
            window.location.href = "repertorio_negras.html" + params;
        }

    });

    btnVolverInicio.addEventListener("click", () => {
        window.location.href = "../index.html";
    });

});