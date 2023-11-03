import { useState } from "react";
import { useXarrow } from "react-xarrows";
import { useDispatch } from "react-redux";
import { setPlayerInputToTarget, addWordToUsedWord } from "../redux/features/game/gameSlice";
import styled from "styled-components";
import XarrowInstance from "./XarrowInstance";
import UsedWordsTracker from "./usedWords/UsedWordsTracker";
import WordExistsError from "./errors/wordExistsError";

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
        input1: {},
        input2: {},
        input3: {},
        input4: {},
        input5: {},
    });

    const addArrowInstance = (attacker_input_id, word) => {
        if (word !== "") {
            const attacked_input_id = playerObj.inputTargets[`input_${attacker_input_id}`];
            const arrowKey = `${playerRole}_word_attack_input_${attacker_input_id}_attacking_input_${attacked_input_id}`;
            const wordAlreadyExists = usedWordsForBothPlayers.hasOwnProperty(word) || playerObj.usedWords.hasOwnProperty(word);
    
            if (wordAlreadyExists) {
                setErrorStates(prev => ({...prev, [`input${attacker_input_id}`]: {...prev[`input${attacker_input_id}`], "word_exists": true}}));
            } else {
                setErrorStates(prev => ({...prev, [`input${attacker_input_id}`]: {...prev[`input${attacker_input_id}`], "word_exists": false}}))
            }
            
            if (!arrows.find(arrow => arrow.key === arrowKey) && !wordAlreadyExists) {
                setArrows(prev => [...prev, <XarrowInstance key={arrowKey} elementStartId={`${playerRole}_word_attack_input_${attacker_input_id}`}  elementEndId={`${playerRole === "playerOne" ? "playerTwo" : "playerOne"}_word_attack_input_${attacked_input_id}`} />])
            }
        }
    }

    return (
        <>
            <Wrapper>
                <UsedWordsTracker playerObj={playerObj} />

                <p>HP: {playerObj.hitPoints}</p>
                
                <div>
                    {
                        errorStates.input1.word_exists ? <WordExistsError /> : null
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

                                    addArrowInstance("1", inputtedWord);
                                    dispatch(addWordToUsedWord({player: playerRole, word: inputtedWord})); // should we check if the word exists before or after dispatch
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
                        errorStates.input2.word_exists ? <WordExistsError /> : null
                    }

                    <InputWrapper>
                        {
                            playerRole === "playerOne" && <InputTarget id={`${playerRole}_target_input_1`} inputNumber={1} playerRole={playerRole}/>
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
                            playerRole === "playerTwo" && <InputTarget id={`${playerRole}_target_input_1`} inputNumber={1} playerRole={playerRole}/>
                        }
                    </InputWrapper>
                </div>

                <div>
                    {
                        errorStates.input3.word_exists ? <WordExistsError /> : null
                    }
                    
                    <InputWrapper>
                        {
                            playerRole === "playerOne" && <InputTarget id={`${playerRole}_target_input_1`} inputNumber={1} playerRole={playerRole}/>
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
                            playerRole === "playerTwo" && <InputTarget id={`${playerRole}_target_input_1`} inputNumber={1} playerRole={playerRole}/>
                        }
                    </InputWrapper>
                </div>

                <div>
                    {
                        errorStates.input4.word_exists ? <WordExistsError /> : null
                    }

                    <InputWrapper>
                        {
                            playerRole === "playerOne" && <InputTarget id={`${playerRole}_target_input_1`} inputNumber={1} playerRole={playerRole}/>
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
                            playerRole === "playerTwo" && <InputTarget id={`${playerRole}_target_input_1`} inputNumber={1} playerRole={playerRole}/>
                        }
                    </InputWrapper>
                </div>

                <div>
                    {
                        errorStates.input5.word_exists ? <WordExistsError /> : null
                    }

                    <InputWrapper>
                        {
                            playerRole === "playerOne" && <InputTarget id={`${playerRole}_target_input_1`} inputNumber={1} playerRole={playerRole}/>
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
                            playerRole === "playerTwo" && <InputTarget id={`${playerRole}_target_input_1`} inputNumber={1} playerRole={playerRole}/>
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