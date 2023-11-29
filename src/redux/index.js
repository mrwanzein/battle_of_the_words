import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./features/game/gameSlice";
import roomReducer from "./features/rooms/roomSlice";

export const store = configureStore({
    reducer: {
        gameState: gameReducer,
        roomState: roomReducer
    }
})