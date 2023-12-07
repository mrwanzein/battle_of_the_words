import { createSlice } from "@reduxjs/toolkit";

const initialInputObj = {
    target: "1",
    active: false,
    status: "attacking",
    attackingWord: null,
    wordToDefend: null,
    arrowToDefendId: null,
    arrowToDefendTimerId: null
}

const initialState = {
    isInOnlineBattle: false,
    playerOne: {
        hitPoints: 1000,
        inputTargets: {
            "input_1": initialInputObj,
            "input_2": initialInputObj,
            "input_3": initialInputObj,
            "input_4": initialInputObj,
            "input_5": initialInputObj
        },
        usedWords: {}
    },
    playerTwo: {
        hitPoints: 1000,
        inputTargets: {
            "input_1": initialInputObj,
            "input_2": initialInputObj,
            "input_3": initialInputObj,
            "input_4": initialInputObj,
            "input_5": initialInputObj
        },
        usedWords: {}
    },
    usedWordsForBothPlayer: {}
}

export const gameSlice = createSlice({
    name: "gameState",
    initialState,
    reducers: {
        setIsInOnlineBattle: (state, action) => {
            state.isInOnlineBattle = action.payload;
        },
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
            const {player, word} = action.payload;
            
            state.usedWordsForBothPlayer[word] = true;
            state[player].usedWords[word] = true;
        },
        setInputDuel: (state, action) => {
            const {
                attacker,
                word,
                attacker_input_id,
                attacked_input_id,
                attackerArrowId
            } = action.payload;
            const oppositePlayer = attacker === "playerOne" ? "playerTwo" : "playerOne";
            const attackingPlayer = state[attacker].inputTargets[`input_${attacker_input_id}`];
            const defendingPlayer = state[oppositePlayer].inputTargets[`input_${attacked_input_id}`];

            attackingPlayer.active = true;
            attackingPlayer.status = "attacking";
            attackingPlayer.attackingWord = word;

            defendingPlayer.active = true;
            defendingPlayer.status = "defending";
            defendingPlayer.wordToDefend = word;
            defendingPlayer.arrowToDefendId = attackerArrowId;
            defendingPlayer.target = attacker_input_id;
        },
        setArrowToDefendId: (state, action) => {
            const {defender, arrowTimerId, attacker_input_id} = action.payload;

            state[defender].inputTargets[`input_${attacker_input_id}`].arrowToDefendTimerId = arrowTimerId;
        },
        endInputDuel: (state, action) => {
            const {
                attacker,
                attacker_input_id,
                attacked_input_id
            } = action.payload;
            const oppositePlayer = attacker === "playerOne" ? "playerTwo" : "playerOne";
            
            state[attacker].inputTargets[`input_${attacker_input_id}`] = initialInputObj;
            state[oppositePlayer].inputTargets[`input_${attacked_input_id}`] = initialInputObj;
        }
    }
})

export const {
    decrementHitPoints,
    setPlayerInputToTarget,
    addWordToUsedWord,
    setInputDuel,
    setArrowToDefendId,
    endInputDuel,
    setIsInOnlineBattle
} = gameSlice.actions;

export default gameSlice.reducer;