import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    playerOne: {
        hitPoints: 1000,
        inputTargets: {
            "input_1": "1",
            "input_2": "1",
            "input_3": "1",
            "input_4": "1",
            "input_5": "1"
        },
        usedWords: {}
    },
    playerTwo: {
        hitPoints: 1000,
        inputTargets: {
            "input_1": "1",
            "input_2": "1",
            "input_3": "1",
            "input_4": "1",
            "input_5": "1"
        },
        usedWords: {}
    },
    usedWordsForBothPlayer: {}
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
        },
        addWordToUsedWord: (state, action) => {
            const {player, word} = action.payload;
            if (!state.usedWordsForBothPlayer[word] && word !== "") {
                state.usedWordsForBothPlayer[word] = true;
                
                if (!state[player].usedWords[word]) state[player].usedWords[word] = true;
            }
        }
    }
})

export const {
    decrementHitPoints,
    setPlayerInputToTarget,
    addWordToUsedWord
} = gameSlice.actions;

export default gameSlice.reducer;