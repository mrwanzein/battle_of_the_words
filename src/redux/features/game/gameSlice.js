import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    playerOne: {
        hitPoints: 1000,
        inputTargets: {
            "input_1": {target: "1", active: false},
            "input_2": {target: "1", active: false},
            "input_3": {target: "1", active: false},
            "input_4": {target: "1", active: false},
            "input_5": {target: "1", active: false}
        },
        usedWords: {}
    },
    playerTwo: {
        hitPoints: 1000,
        inputTargets: {
            "input_1": {target: "1", active: false},
            "input_2": {target: "1", active: false},
            "input_3": {target: "1", active: false},
            "input_4": {target: "1", active: false},
            "input_5": {target: "1", active: false}
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
            const playerInput = state[player].inputTargets[`input_${selectedInput}`];

            playerInput.target = target;
        },
        addWordToUsedWord: (state, action) => {
            const {player, word, attacker_input_id} = action.payload;
            
            state.usedWordsForBothPlayer[word] = true;
            state[player].usedWords[word] = true;
            state[player].inputTargets[`input_${attacker_input_id}`].active = true;

        }
    }
})

export const {
    decrementHitPoints,
    setPlayerInputToTarget,
    addWordToUsedWord
} = gameSlice.actions;

export default gameSlice.reducer;