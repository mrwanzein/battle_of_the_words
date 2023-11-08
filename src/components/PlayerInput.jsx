import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWordToUsedWord } from "../redux/features/game/gameSlice";
import { useXarrow } from "react-xarrows";
import WordInputErrors from "./errors/WordInputErrors";
import PlayerTargetInput from "./PlayerTargetInput";
import XarrowInstance from "./XarrowInstance";
import englishDictionary from "../../english_words_dictionary.json";
import styled from "styled-components";

const PlayerInput = ({
    arrows,
    setArrows,
    playerRole,
    playerObj,
    inputInstanceNumber
}) => {
    const usedWordsForBothPlayers = useSelector(state => state.gameState.usedWordsForBothPlayer);
    const dispatch = useDispatch();

    useXarrow();

    const [inputError, setInputError] = useState(false);

    const addArrowInstance = (attacker_input_id, inputtedWord) => {
        const playerInputTarget = playerObj.inputTargets[`input_${attacker_input_id}`];
        const attacked_input_id = playerInputTarget.target;
        const alreadyAttacking = playerInputTarget.active;
        const targetIsAlreadyBeingAttacked = Object.values(playerObj.inputTargets).find(targetObj => targetObj.target === attacked_input_id && targetObj.active);
        const arrowKey = `${playerRole}_word_attack_input_${attacker_input_id}_attacking_input_${attacked_input_id}`;

        if (alreadyAttacking) {
            setInputError("this target is already used");
            return;
        }

        if (targetIsAlreadyBeingAttacked) {
            setInputError("this target is already attacked");
            return;
        }
        
            setArrows(prev => [...prev, <XarrowInstance key={arrowKey} elementStartId={`${playerRole}_word_attack_input_${attacker_input_id}`}  elementEndId={`${playerRole === "playerOne" ? "playerTwo" : "playerOne"}_word_attack_input_${attacked_input_id}`} />]);
            dispatch(addWordToUsedWord({player: playerRole, word: inputtedWord, attacker_input_id}));
    }

    const checkInputErrors = (word) => {
        const wordAlreadyExists = usedWordsForBothPlayers.hasOwnProperty(word) || playerObj.usedWords.hasOwnProperty(word);
        const inputAlreadyHaveError = inputError;
        const inEnglishDictionary = englishDictionary[word];

        if (word == "") {
            setInputError("input can not be empty");
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

                            if (!checkInputErrors(inputtedWord)) {
                                addArrowInstance(inputInstanceNumber, inputtedWord);
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