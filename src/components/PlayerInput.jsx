import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addWordToUsedWord,
    setInputDuel,
    setArrowToDefendId,
    decrementHitPoints
} from "../redux/features/game/gameSlice";
import Xarrow from "react-xarrows"
import { useXarrow } from "react-xarrows";
import WordInputErrors from "./errors/WordInputErrors";
import PlayerTargetInput from "./PlayerTargetInput";
import englishDictionary from "../../english_words_dictionary.json";
import styled from "styled-components";

const PlayerInput = ({
    playerRole,
    playerObj,
    inputInstanceNumber,
    setActiveArrows
}) => {
    const usedWordsForBothPlayers = useSelector(state => state.gameState.usedWordsForBothPlayer);
    const dispatch = useDispatch();
    const currentInputObj = playerObj.inputTargets[`input_${inputInstanceNumber}`];

    useXarrow();

    const [inputVal, setInputVal] = useState("");
    const [inputError, setInputError] = useState(false);

    const invokeBattle = (
        attackerArrowKey,
        defender,
        attacked_input_id,
        inputtedWord
    ) => {
        setActiveArrows(prev => [
            ...prev,
            <Xarrow
                key={attackerArrowKey}
                start={`${playerRole}_word_attack_input_${inputInstanceNumber}`}
                end={`${defender}_word_attack_input_${attacked_input_id}`}
                labels={
                    <div
                        id={`${playerRole}_active_arrow_timer_${inputInstanceNumber}`}
                        style={{
                            border: "2px solid lightgrey",
                            padding: "5px 12px",
                            background: "#4d4d4d",
                            color: "white"
                        }}
                    >
                        5
                    </div>
                }
                animateDrawing={0.3}
            />
        ]);

        dispatch(setInputDuel({
            attacker: playerRole,
            word: inputtedWord,
            attacker_input_id: inputInstanceNumber,
            attacked_input_id,
            attackerArrowId: attackerArrowKey
        }));
        
        const arrowTimerId = setInterval(() => {
            const arrowTimerDiv = document.getElementById(`${playerRole}_active_arrow_timer_${inputInstanceNumber}`);
            
            arrowTimerDiv.innerText = arrowTimerDiv.innerText - 1;
            if (arrowTimerDiv.innerText < 0) {
                setActiveArrows(prev => prev.filter(arrow => arrow.key !== attackerArrowKey));
                clearInterval(arrowTimerId);
                dispatch(decrementHitPoints({player: defender, amount: inputtedWord.length}));
            }
        }, 1000);
        
        dispatch(setArrowToDefendId({defender, arrowTimerId, attacker_input_id: attacked_input_id }));
    }

    const checkInputErrors = (word) => {
        const wordAlreadyExists = usedWordsForBothPlayers.hasOwnProperty(word) || playerObj.usedWords.hasOwnProperty(word);
        const inputAlreadyHaveError = inputError;
        const inEnglishDictionary = englishDictionary[word];
        const alreadyAttacking = currentInputObj.active;
        const targetIsAlreadyBeingAttacked = Object.values(playerObj.inputTargets).find(targetObj => targetObj.target === currentInputObj.target && targetObj.active);
        const wordToDefend = currentInputObj.wordToDefend

        if (word == "") {
            setInputError("input can not be empty");
            return true;
        }

        if (currentInputObj.status === "defending" && wordToDefend[wordToDefend.length - 1] !== word[0]) {
            setInputError("word must be shiritori");
            return true;
        }

        if (wordToDefend && word.length < wordToDefend.length) {
            setInputError("defending word length must be equal or higher");
            return true;
        }

        if (wordAlreadyExists) {
            setInputError("this word exists already");
            return true;
        }

        if (!inEnglishDictionary) {
            setInputError("this is not an English word");
            return true;
        }

        if (alreadyAttacking && !currentInputObj.active) {
            setInputError("this target is already used");
            return true;
        }

        if (targetIsAlreadyBeingAttacked && currentInputObj.status === "attacking") {
            setInputError("this target is already attacked");
            return true;
        }

        if (inputAlreadyHaveError) setInputError(false);
        return false;
    }
    
    return (
        <>
            {
                inputError ? <WordInputErrors errorMsg={inputError}/> : null
            }

            <InputWrapper>
                {
                    playerRole === "playerOne" &&
                    <PlayerTargetInput
                        inputNumber={inputInstanceNumber}
                        playerRole={playerRole}
                        playerObj={playerObj}
                    />
                }

                <StyledInput
                    type="text"
                    id={`${playerRole}_word_attack_input_${inputInstanceNumber}`}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder={
                        currentInputObj.active &&
                        currentInputObj.status === "defending" &&
                        currentInputObj.wordToDefend ?
                        currentInputObj.wordToDefend[currentInputObj.wordToDefend.length - 1] : null
                    }
                    disabled={currentInputObj.active && currentInputObj.status === "attacking"}
                    onKeyDown={e => {
                        if (e.code === "Enter") {
                            const inputtedWord = e.target.value;
                            const defender = playerRole === "playerOne" ? "playerTwo" : "playerOne";
                            const attacked_input_id = currentInputObj.target;
                            const attackerArrowKey = `${playerRole}_word_attack_input_${inputInstanceNumber}_attacking_input_${attacked_input_id}`;
                            const defenderArrowKey = `${defender}_word_attack_input_${attacked_input_id}_attacking_input_${inputInstanceNumber}`;

                            if (!checkInputErrors(inputtedWord)) {
                                dispatch(addWordToUsedWord({player: playerRole, word: inputtedWord}));
                                setInputVal("");
                                
                                if (currentInputObj.status === "defending") {
                                    clearInterval(currentInputObj.arrowToDefendTimerId);
                                    setActiveArrows(prev => prev.filter(arrow => arrow.key !== defenderArrowKey));
                                    invokeBattle(
                                        attackerArrowKey,
                                        defender,
                                        attacked_input_id,
                                        inputtedWord,
                                    );
                                }

                                if (currentInputObj.status === "attacking") {
                                    invokeBattle(
                                        attackerArrowKey,
                                        defender,
                                        attacked_input_id,
                                        inputtedWord,
                                    );
                                }
                            }
                        }
                    }}
                />

                {
                    playerRole === "playerTwo" &&
                    <PlayerTargetInput
                        inputNumber={inputInstanceNumber}
                        playerRole={playerRole}
                        playerObj={playerObj}
                    />
                }
            </InputWrapper>
        </>
    )
}

export default PlayerInput;

const InputWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const StyledInput = styled.input`
    margin: 15px;
    padding: 10px;
    width: 300px;
`