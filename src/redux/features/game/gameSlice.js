import { createSlice } from "@reduxjs/toolkit";

const initialInputObj = {
    active: false,
    status: "attacking",
    attackingWord: null,
    wordToDefend: null,
    arrowToDefendId: null,
    arrowToDefendTimerId: null,
    targetIfDefending: null
}

const initialState = {
    battleCounter: 3,
    isInOnlineBattle: false,
    amountOfInput: 3,
    wordExpireTime: 15,
    playerOne: {
        maxHitPoints: 50,
        hitPoints: 50,
        currentTarget: null,
        opponentsTarget: null,
        inputControls: {
            "input_1": initialInputObj,
            "input_2": initialInputObj,
            "input_3": initialInputObj,
            "input_4": initialInputObj,
            "input_5": initialInputObj
        },
        usedWords: {}
    },
    playerTwo: {
        isReadyForOnlineBattle: false,
        maxHitPoints: 50,
        hitPoints: 50,
        currentTarget: null,
        opponentsTarget: null,
        inputControls: {
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
        resetGameState: (_, action) => {
            const {isStillInMatch} = action.payload;
            
            return {
                ...initialState,
                isInOnlineBattle: isStillInMatch
            };
        },
        setIsInOnlineBattle: (state, action) => {
            state.isInOnlineBattle = action.payload;
        },
        decrementHitPoints: (state, action) => {
            const {player, amount} = action.payload;
            state[player].hitPoints -= amount;
        },
        setPlayerInputToTarget: (state, action) => {
            const {player, target} = action.payload;
            const oppositePlayer = player === "playerOne" ? "playerTwo" : "playerOne";

            state[player].currentTarget = target;
            state[oppositePlayer].opponentsTarget = target;
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
            const attackingPlayer = state[attacker].inputControls[`input_${attacker_input_id}`];
            const defendingPlayer = state[oppositePlayer].inputControls[`input_${attacked_input_id}`];

            attackingPlayer.active = true;
            attackingPlayer.status = "attacking";
            attackingPlayer.attackingWord = word;

            defendingPlayer.active = true;
            defendingPlayer.status = "defending";
            defendingPlayer.wordToDefend = word;
            defendingPlayer.arrowToDefendId = attackerArrowId;
            defendingPlayer.targetIfDefending = attacker_input_id;
        },
        setArrowToDefendId: (state, action) => {
            const {defender, arrowTimerId, attacker_input_id} = action.payload;

            state[defender].inputControls[`input_${attacker_input_id}`].arrowToDefendTimerId = arrowTimerId;
        },
        endInputDuel: (state, action) => {
            const {
                attacker,
                attacker_input_id,
                attacked_input_id
            } = action.payload;
            const oppositePlayer = attacker === "playerOne" ? "playerTwo" : "playerOne";
            
            state[attacker].inputControls[`input_${attacker_input_id}`] = initialInputObj;
            state[oppositePlayer].inputControls[`input_${attacked_input_id}`] = initialInputObj;
        },
        setIsReadyForOnlineBattle: (state, action) => {
            state.playerTwo.isReadyForOnlineBattle = action.payload;
        },
        decrementBattleCounter: (state) => {
            state.battleCounter--;
        },
        setAmountOfInput: (state, action) => {
            state.amountOfInput = action.payload;
        },
        setMaxHealth: (state, action) => {
            const amount = action.payload;

            state.playerOne.maxHitPoints = amount;
            state.playerOne.hitPoints = amount;
            state.playerTwo.maxHitPoints = amount;
            state.playerTwo.hitPoints = amount;
        },
        setWordExpireTime: (state, action) => {
            state.wordExpireTime = action.payload;
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
    setIsInOnlineBattle,
    setIsReadyForOnlineBattle,
    decrementBattleCounter,
    resetGameState,
    setAmountOfInput,
    setMaxHealth,
    setWordExpireTime
} = gameSlice.actions;

export default gameSlice.reducer;