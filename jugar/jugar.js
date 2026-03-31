document.addEventListener("DOMContentLoaded", () => {

    const btnLocal = document.getElementById("btnLocal");
    const btnOnline = document.getElementById("btnOnline");
    const btnVolver = document.getElementById("btnVolver");

    /* ======================
       JUGAR LOCAL
    ====================== */

    btnLocal.addEventListener("click", () => {

        // luego puedes cambiar esto a tu archivo real
        window.location.href = "../A-chess_solitario-v1-1/chess_game.html";

    });

    /* ======================
       JUGAR ONLINE
    ====================== */

    btnOnline.addEventListener("click", () => {

        // luego puedes cambiarlo al modo online
        window.location.href = "../a-Ajedrez_distanciav1-6/ajedrez_online.html";

    });

    /* ======================
       VOLVER
    ====================== */

    btnVolver.addEventListener("click", () => {

        window.location.href = "../index.html";

    });

});