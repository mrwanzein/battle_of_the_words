import { useState } from "react";
import { useXarrow } from "react-xarrows";
import { useDispatch } from "react-redux";
import { setPlayerInputToTarget, addWordToUsedWord } from "../redux/features/game/gameSlice";
import styled from "styled-components";
import XarrowInstance from "./XarrowInstance";
import UsedWordsTracker from "./usedWords/UsedWordsTracker";
import WordInputErrors from "./errors/WordInputErrors";
import englishDictionary from "../../english_words_dictionary.json";

const InputTarget = ({ id, inputNumber, playerRole }) => {
    const dispatch = useDispatch();
    
    return (
        <select
            id={id}
            onChange={e => {
                dispatch(setPlayerInputToTarget({player: playerRole, selectedInput: inputNumber, target: e.target.value}))
            }}
        >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
    )
}

const Player = ({ playerObj, playerRole, usedWordsForBothPlayers }) => {
    useXarrow();
    const dispatch = useDispatch();
    
    const [arrows, setArrows] = useState([]);
    const [errorStates, setErrorStates] = useState({
        input1: false,
        input2: false,
        input3: false,
        input4: false,
        input5: false,
    });

    const addArrowInstance = (attacker_input_id) => {
        const attacked_input_id = playerObj.inputTargets[`input_${attacker_input_id}`];
        const arrowKey = `${playerRole}_word_attack_input_${attacker_input_id}_attacking_input_${attacked_input_id}`;
        
        if (!arrows.find(arrow => arrow.key === arrowKey)) setArrows(prev => [...prev, <XarrowInstance key={arrowKey} elementStartId={`${playerRole}_word_attack_input_${attacker_input_id}`}  elementEndId={`${playerRole === "playerOne" ? "playerTwo" : "playerOne"}_word_attack_input_${attacked_input_id}`} />])
    }
    
    const checkInputErrors = (attacker_input_id, word) => {
        const wordAlreadyExists = usedWordsForBothPlayers.hasOwnProperty(word) || playerObj.usedWords.hasOwnProperty(word);
        const inputAlreadyHaveError = errorStates[`input${attacker_input_id}`];
        const inEnglishDictionary = englishDictionary[word];

        if (word == "") {
            setErrorStates(prev => ({...prev, [`input${attacker_input_id}`]: "input can not be empty"}));
            return true;
        }

        if (wordAlreadyExists) {
            setErrorStates(prev => ({...prev, [`input${attacker_input_id}`]: "this word exists already"}));
            return true;
        }

        if (!inEnglishDictionary) {
            setErrorStates(prev => ({...prev, [`input${attacker_input_id}`]: "this is not an English word"}));
            return true;
        }

        if (inputAlreadyHaveError) setErrorStates(prev => ({...prev, [`input${attacker_input_id}`]: false}));
        return false;
    }

    return (
        <>
            <Wrapper>
                <UsedWordsTracker playerObj={playerObj} />

                <p>HP: {playerObj.hitPoints}</p>
                
                <div>
                    {
                        errorStates.input1 ? <WordInputErrors errorMsg={errorStates.input1}/> : null
                    }

                    <InputWrapper>
                        {
                            playerRole === "playerOne" && <InputTarget id={`${playerRole}_target_input_1`} inputNumber={1} playerRole={playerRole}/>
                        }

                        <StyledInput
                            type="text"
                            id={`${playerRole}_word_attack_input_1`}
                            onKeyDown={e => {
                                if (e.code === "Enter") {
                                    const inputtedWord = e.target.value;

                                    if (!checkInputErrors("1", inputtedWord)) {
                                        addArrowInstance("1");
                                        dispatch(addWordToUsedWord({player: playerRole, word: inputtedWord}));
                                    }
                                }
                            }}
                        />

                        {
                            playerRole === "playerTwo" && <InputTarget id={`${playerRole}_target_input_1`} inputNumber={1} playerRole={playerRole}/>
                        }
                    </InputWrapper>
                </div>

                <div>
                    {
                        errorStates.input2 ? <WordInputErrors errorMsg={errorStates.input1}/> : null
                    }

                    <InputWrapper>
                        {
                            playerRole === "playerOne" && <InputTarget id={`${playerRole}_target_input_2`} inputNumber={1} playerRole={playerRole}/>
                        }

                        <StyledInput
                            type="text"
                            id={`${playerRole}_word_attack_input_2`}
                            onKeyDown={e => {
                                if (e.code === "Enter") {
                                    const inputtedWord = e.target.value;

                                    addArrowInstance("2", inputtedWord);
                                    dispatch(addWordToUsedWord({player: playerRole, word: inputtedWord}));
                                }
                            }}
                        />

                        {
                            playerRole === "playerTwo" && <InputTarget id={`${playerRole}_target_input_2`} inputNumber={1} playerRole={playerRole}/>
                        }
                    </InputWrapper>
                </div>

                <div>
                    {
                        errorStates.input3 ? <WordInputErrors errorMsg={errorStates.input1}/> : null
                    }
                    
                    <InputWrapper>
                        {
                            playerRole === "playerOne" && <InputTarget id={`${playerRole}_target_input_3`} inputNumber={1} playerRole={playerRole}/>
                        }

                        <StyledInput
                            type="text"
                            id={`${playerRole}_word_attack_input_3`}
                            onKeyDown={e => {
                                if (e.code === "Enter") {
                                    const inputtedWord = e.target.value;

                                    addArrowInstance("3", inputtedWord);
                                    dispatch(addWordToUsedWord({player: playerRole, word: inputtedWord}));
                                }
                            }}
                        />

                        {
                            playerRole === "playerTwo" && <InputTarget id={`${playerRole}_target_input_3`} inputNumber={1} playerRole={playerRole}/>
                        }
                    </InputWrapper>
                </div>

                <div>
                    {
                        errorStates.input4 ? <WordInputErrors errorMsg={errorStates.input1}/> : null
                    }

                    <InputWrapper>
                        {
                            playerRole === "playerOne" && <InputTarget id={`${playerRole}_target_input_4`} inputNumber={1} playerRole={playerRole}/>
                        }

                        <StyledInput
                            type="text"
                            id={`${playerRole}_word_attack_input_4`}
                            onKeyDown={e => {
                                if (e.code === "Enter") {
                                    const inputtedWord = e.target.value;

                                    addArrowInstance("4", inputtedWord);
                                    dispatch(addWordToUsedWord({player: playerRole, word: inputtedWord}));
                                }
                            }}
                        />

                        {
                            playerRole === "playerTwo" && <InputTarget id={`${playerRole}_target_input_4`} inputNumber={1} playerRole={playerRole}/>
                        }
                    </InputWrapper>
                </div>

                <div>
                    {
                        errorStates.input5 ? <WordInputErrors errorMsg={errorStates.input1}/> : null
                    }

                    <InputWrapper>
                        {
                            playerRole === "playerOne" && <InputTarget id={`${playerRole}_target_input_5`} inputNumber={1} playerRole={playerRole}/>
                        }

                        <StyledInput
                            type="text"
                            id={`${playerRole}_word_attack_input_5`}
                            onKeyDown={e => {
                                if (e.code === "Enter") {
                                    const inputtedWord = e.target.value;

                                    addArrowInstance("5", inputtedWord);
                                    dispatch(addWordToUsedWord({player: playerRole, word: inputtedWord}));
                                }
                            }}
                        />

                        {
                            playerRole === "playerTwo" && <InputTarget id={`${playerRole}_target_input_5`} inputNumber={1} playerRole={playerRole}/>
                        }
                    </InputWrapper>
                </div>

                {
                    arrows.map(arrowComponent => arrowComponent)
                }
            </Wrapper>
        </>
    )
}

export default Player;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0 200px; 
`

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