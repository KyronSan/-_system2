import { DISPLAY_PIECES } from "./motor_ajedrez.js";

export function aplicarSkin(miColor){

    console.log("aplicarSkin llamada con:", miColor);

    // Si eres blancas → cambias tus piezas
    if(miColor === "blancas"){

        DISPLAY_PIECES.w = {
            king:'♚',
            queen:'♛',
            rook:'♜',
            bishop:'♝',
            knight:'♞',
            pawn:'♟'
        };

        console.log("Skin aplicada a blancas");
    }

    // Si eres negras → cambias las blancas (tu oponente)
    if(miColor === "negras"){

        DISPLAY_PIECES.w = {
            king:'♚',
            queen:'♛',
            rook:'♜',
            bishop:'♝',
            knight:'♞',
            pawn:'♟'
        };

        console.log("Skin aplicada al oponente (blancas)");
    }

}