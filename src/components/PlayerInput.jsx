import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addWordToUsedWord,
    setInputDuel,
    setArrowToDefendId
} from "../redux/features/game/gameSlice";
import Xarrow from "react-xarrows"
import { useXarrow } from "react-xarrows";
import WordInputErrors from "./errors/WordInputErrors";
import PlayerTargetInput from "./PlayerTargetInput";
import englishDictionary from "../../english_words_dictionary.json";
import styled from "styled-components";

const PlayerInput = ({
    setArrows,
    playerRole,
    playerObj,
    inputInstanceNumber
}) => {
    const usedWordsForBothPlayers = useSelector(state => state.gameState.usedWordsForBothPlayer);
    const dispatch = useDispatch();

    useXarrow();

    const [inputError, setInputError] = useState(false);

    const addArrowInstance = (attacked_input_id, arrowKey) => {
        
        setArrows(prev => [
            ...prev,
            <div id={arrowKey} key={arrowKey}>
                <Xarrow
                    start={`${playerRole}_word_attack_input_${inputInstanceNumber}`}
                    end={`${playerRole === "playerOne" ? "playerTwo" : "playerOne"}_word_attack_input_${attacked_input_id}`}
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
            </div>
        ]);
    }

    const checkInputErrors = (activeInput, word) => {
        const wordAlreadyExists = usedWordsForBothPlayers.hasOwnProperty(word) || playerObj.usedWords.hasOwnProperty(word);
        const inputAlreadyHaveError = inputError;
        const inEnglishDictionary = englishDictionary[word];
        const alreadyAttacking = activeInput.active;
        const targetIsAlreadyBeingAttacked = Object.values(playerObj.inputTargets).find(targetObj => targetObj.target === activeInput.target && targetObj.active);

        if (word == "") {
            setInputError("input can not be empty");
            return true;
        }

        if (activeInput.status === "defending" && activeInput.wordToDefend[activeInput.wordToDefend.length - 1] !== word[0]) {
            setInputError("word must be shiritori");
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

        if (alreadyAttacking && !activeInput.active) {
            setInputError("this target is already used");
            return true;
        }

        if (targetIsAlreadyBeingAttacked && activeInput.status === "attacking") {
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
                    onKeyDown={e => {
                        if (e.code === "Enter") {
                            const inputtedWord = e.target.value;
                            const activeInput = playerObj.inputTargets[`input_${inputInstanceNumber}`];
                            const defender = playerRole === "playerOne" ? "playerTwo" : "playerOne";
                            const attacked_input_id = activeInput.target;
                            const arrowKey = `${playerRole}_word_attack_input_${inputInstanceNumber}_attacking_input_${attacked_input_id}`;

                            if (!checkInputErrors(activeInput, inputtedWord, activeInput)) {
                                dispatch(addWordToUsedWord({player: playerRole, word: inputtedWord}));
                                
                                if (activeInput.status === "defending") {
                                    clearInterval(activeInput.arrowToDefendTimerId);
                                    document.getElementById(activeInput.arrowToDefendId).remove();
                                    
                                    addArrowInstance(attacked_input_id, arrowKey);
                                    dispatch(setInputDuel({
                                        attacker: playerRole,
                                        word: inputtedWord,
                                        attacker_input_id: inputInstanceNumber,
                                        attacked_input_id,
                                        attackerArrowId: arrowKey
                                    }));
                                    
                                    const arrowTimerId = setInterval(() => {
                                        const arrowTimerDiv = document.getElementById(`${playerRole}_active_arrow_timer_${inputInstanceNumber}`);
                                        
                                        arrowTimerDiv.innerText = arrowTimerDiv.innerText - 1;
                                        if (arrowTimerDiv.innerText <= 0) clearInterval(arrowTimerId);
                                    }, 1000);
                                    
                                    dispatch(setArrowToDefendId({defender, arrowTimerId, attacker_input_id: activeInput.target }));
                                }

                                if (activeInput.status === "attacking") {
                                    addArrowInstance(attacked_input_id, arrowKey);
                                    dispatch(setInputDuel({
                                        attacker: playerRole,
                                        word: inputtedWord,
                                        attacker_input_id: inputInstanceNumber,
                                        attacked_input_id,
                                        attackerArrowId: arrowKey
                                    }));
                                    
                                    const arrowTimerId = setInterval(() => {
                                        const arrowTimerDiv = document.getElementById(`${playerRole}_active_arrow_timer_${inputInstanceNumber}`);
                                        
                                        arrowTimerDiv.innerText = arrowTimerDiv.innerText - 1;
                                        if (arrowTimerDiv.innerText <= 0) clearInterval(arrowTimerId);
                                    }, 1000);
                                    
                                    dispatch(setArrowToDefendId({defender, arrowTimerId, attacker_input_id: activeInput.target }));
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