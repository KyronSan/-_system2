(function () {

    const buttons = document.querySelectorAll("#difficultySelector button");

    function activateDifficulty(diff) {
        buttons.forEach(btn => {
            if (btn.dataset.difficulty === diff) {
                btn.click(); // usa el flujo normal
            }
        });
    }

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const diff = btn.dataset.difficulty;

            // UI
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Remueve IA anterior
            const oldScript = document.getElementById("cgScript");
            if (oldScript) oldScript.remove();

            // Determina archivo
            let file = "";
            if (diff === "facil") file = "cg/cg_facil.js";
            else if (diff === "medio") file = "cg/cg_medio.js";
            else if (diff === "dificil") file = "cg/cg_dificil.js";

            // Carga IA
            const script = document.createElement("script");
            script.src = file;
            script.id = "cgScript";
            script.onload = () => console.log(`IA cargada: ${diff}`);
            document.body.appendChild(script);
        });
    });

    /* ===============================
       RECIBIR DESDE UNION.JS
       =============================== */
    window.addEventListener("message", (e) => {
        if (!e.data || e.data.type !== "setDifficulty") return;

        const diff = e.data.value; // "facil", "medio", "dificil"
        activateDifficulty(diff);
    });

})();
