import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    playerOne: {
        hitPoints: 1000,
        inputTargets: {
            "input_1": null,
            "input_2": null,
            "input_3": null,
            "input_4": null,
            "input_5": null
        }
    },
    playerTwo: {
        hitPoints: 1000,
        inputTargets: {
            "input_1": null,
            "input_2": null,
            "input_3": null,
            "input_4": null,
            "input_5": null
        }
    }
}

export const gameSlice = createSlice({
    name: "gameState",
    initialState,
    reducers: {
        decrementHitPoints: (state, action) => {
            const {player, amount} = action.payload;
            state[player].hitPoints -= amount;
        },
        setPlayerInputToTarget: (state, action) => {
            const {player, selectedInput, target} = action.payload;
            state[player].inputTargets[`input_${selectedInput}`] = target;
        }
    }
})

export const {
    decrementHitPoints,
    setPlayerInputToTarget
} = gameSlice.actions;

export default gameSlice.reducer;