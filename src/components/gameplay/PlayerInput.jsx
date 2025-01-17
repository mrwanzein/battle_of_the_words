import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addWordToUsedWord,
    setInputDuel,
    setArrowToDefendId,
    decrementHitPoints,
    endInputDuel,
    setPlayerInputToTarget
} from "../../redux/features/game/gameSlice";
import { calculatePercentage } from "../../utils";
import { useXarrow } from "react-xarrows";
import { socket } from "../../services/socket";
import Xarrow from "react-xarrows"
import WordInputErrors from "../errors/WordInputErrors";
import { formattedEnglishDictionary, formattedFrenchDictionary, formattedSpanishDictionary } from "../../language_dictionaries";
import styled, {css} from "styled-components";
import WordLengthTrackingBar from "../misc/WordLengthTrackingBar";
import ErrorModal from "../modals/ErrorModal";

const PlayerInput = ({
    playerRole,
    playerObj,
    inputInstanceNumber,
    setActiveArrows,
    activeArrows,
    lastInstance
}) => {
    const isInOnlineBattle = useSelector(state => state.gameState.isInOnlineBattle);
    const usedWordsForBothPlayers = useSelector(state => state.gameState.usedWordsForBothPlayer);
    const oppositePlayer = useSelector(state => state.gameState[`${playerRole === "playerOne" ? "playerTwo" : "playerOne"}`]);
    const currentRoom = useSelector(state => state.roomState.currentRoom);
    const wordExpireTime = useSelector(state => state.gameState.wordExpireTime);
    const playingLanguage = useSelector(state => state.gameState.language);
    const currentInputObj = playerObj.inputControls[`input_${inputInstanceNumber}`];
    
    const dispatch = useDispatch();
    useXarrow();

    const [inputVal, setInputVal] = useState("");
    const [inputError, setInputError] = useState(false);

    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [serverErrorType, setServerErrorType] = useState("error");
    const [createRoomErrorMsg, setCreateRoomErrorMsg] = useState("");

    const inputRef = useRef();
    // remove for production
    // const skippedFirstRenderOfDoubleRender = useRef(false);

    useEffect(() => {
        // if (isInOnlineBattle && skippedFirstRenderOfDoubleRender.current) {
            socket.on("show typing words from opponent", ({inputVal, inputInstanceFromServer}) => {
                if (playerRole === "playerTwo" && inputInstanceFromServer === inputInstanceNumber) {
                    setInputVal(inputVal);
                }
            });
    
            socket.on("process entered word from opponent", ({
                inputtedWord,
                inputInstanceFromServer,
                attacked_input_id,
                oldArrowToDelete,
                playerStatus
            }) => {
                if (playerRole === "playerTwo" && inputInstanceFromServer === inputInstanceNumber) {
                    dispatch(addWordToUsedWord({player: "playerTwo", word: inputtedWord}));
                    invokeBattleOnline(attacked_input_id, inputtedWord, inputInstanceFromServer, oldArrowToDelete, playerStatus);
                }
            });

            socket.on("clear old attacking word", ({attacked_input_id}) => {
                if (playerRole === "playerTwo" && attacked_input_id === inputInstanceNumber) {
                    setInputVal("");
                }
            });
        // }

        // return () => skippedFirstRenderOfDoubleRender.current = true;
    }, []);

    useEffect(() => {
        if (playerObj.hitPoints <= 0 || oppositePlayer.hitPoints <= 0) {
            inputRef.current.blur();
            setInputVal("");
            setInputError(false);
            activeArrows.forEach(arrow => {
                const arrowElement = document.getElementById(arrow.key);
                const arrowTimerElement = document.getElementById(arrow.props.children.props.labels.end.props.id);
                
                arrowElement.style.visibility = "hidden";
                arrowTimerElement.innerText = 0;
            });
        }
    }, [playerObj.hitPoints, oppositePlayer.hitPoints]);

    const triggerErrorModal = (errorType, errorMessage) => {
        setServerErrorType(errorType);
        setErrorModalOpen(true);
        setCreateRoomErrorMsg(errorMessage);
    }

    const invokeBattle = (
        attackerArrowKey,
        defender,
        attacked_input_id,
        inputtedWord,
        playerStatus = "attacking"
    ) => {
        setActiveArrows(prev => [
            ...prev,
            <div id={attackerArrowKey} key={attackerArrowKey}>
                <Xarrow
                    start={`${playerRole}_word_attack_input_${inputInstanceNumber}`}
                    end={`${defender}_word_attack_input_${attacked_input_id}`}
                    labels={{
                        end: <div
                                id={`${playerRole}_active_arrow_timer_${inputInstanceNumber}`}
                                style={{
                                    border: "2px solid lightgrey",
                                    padding: "5px 12px",
                                    background: "#4d4d4d",
                                    color: "white",
                                    marginBottom: "15px",
                                    marginLeft: "5px",
                                    marginRight: "5px"
                                }}
                            >
                                {wordExpireTime}
                            </div>
                    }}
                    animateDrawing={0.3}
                    color={`${playerRole === "playerTwo" ? "red" : "blue"}`}
                />
            </div>
        ]);

        const arrowTimerId = setInterval(() => {
            const arrowTimerDiv = document.getElementById(`${playerRole}_active_arrow_timer_${inputInstanceNumber}`);
            
            arrowTimerDiv.innerText = arrowTimerDiv.innerText - 1;
            if (arrowTimerDiv.innerText <= 0) {
                clearInterval(arrowTimerId);
                
                setActiveArrows(prev => prev.filter(arrow => arrow.key !== attackerArrowKey));
                
                if (playerObj.hitPoints > 0 && oppositePlayer.hitPoints > 0) dispatch(decrementHitPoints({player: defender, amount: inputtedWord.length}));
                dispatch(endInputDuel({attacker: playerRole, attacker_input_id: inputInstanceNumber, attacked_input_id}));
            }
        }, 1000);

        if (isInOnlineBattle) {
            socket.timeout(3000).emit("send entered word to opponent",
            {
                inputtedWord,
                inputInstanceNumber,
                attacked_input_id,
                roomName: currentRoom[0],
                arrowId: attackerArrowKey,
                arrowTimerId,
                playerStatus
            },
            (err, res) => {
                if (err) {
                    triggerErrorModal("error", "The server seems to be down. Please try again in a moment.");
                } else {
                    switch(res.status) {
                        case "ok":
                            break;
                        case "error":
                            triggerErrorModal("error", "The server couldn't process the action. Please try again in a moment.");
                            break;
                        case "warning":
                            break;
                        default:
                    }
                }
            });
        }

        dispatch(setInputDuel({
            attacker: playerRole,
            word: inputtedWord,
            attacker_input_id: inputInstanceNumber,
            attacked_input_id,
            attackerArrowId: attackerArrowKey
        }));

        dispatch(setArrowToDefendId({defender, arrowTimerId, attacker_input_id: attacked_input_id}));
    }

    const invokeBattleOnline = (attacked_input_id, inputtedWord, inputInstanceFromServer, oldArrowToDelete, playerStatus) => {
        if (playerStatus === "defending") {
            socket.timeout(3000).emit("clear old attacking word", {attacked_input_id, roomName: currentRoom[0]}, (err, res) => {
                if (err) {
                    triggerErrorModal("error", "The server seems to be down. Please try again in a moment.");
                } else {
                    switch(res.status) {
                        case "ok":
                            break;
                        case "error":
                            triggerErrorModal("error", "The server couldn't process the action. Please try again in a moment.");
                            break;
                        case "warning":
                            break;
                        default:
                    }
                }
            });
        }
        
        if (oldArrowToDelete) {
            setActiveArrows(prev => prev.filter(arrow => arrow.key !== oldArrowToDelete.arrowId));
            clearInterval(oldArrowToDelete.arrowTimerId);
        }
        
        const attackerArrowKey = `playerTwo_word_attack_input_${inputInstanceFromServer}_attacking_input_${attacked_input_id}`;
        
        setActiveArrows(prev => [
            ...prev,
            <div id={attackerArrowKey} key={attackerArrowKey}>
                <Xarrow
                    start={`playerTwo_word_attack_input_${inputInstanceFromServer}`}
                    end={`playerOne_word_attack_input_${attacked_input_id}`}
                    labels={{
                        end: <div
                                id={`playerTwo_active_arrow_timer_${inputInstanceNumber}`}
                                style={{
                                    border: "2px solid lightgrey",
                                    padding: "5px 12px",
                                    background: "#4d4d4d",
                                    color: "white",
                                    marginBottom: "15px",
                                    marginLeft: "5px",
                                    marginRight: "5px"
                                }}
                            >
                                {wordExpireTime}
                            </div>
                    }}
                    animateDrawing={0.3}
                    color={`${playerRole === "playerTwo" ? "red" : "blue"}`}
                />
            </div>
        ]);
        
        dispatch(setInputDuel({
            attacker: "playerTwo",
            word: inputtedWord,
            attacker_input_id: inputInstanceFromServer,
            attacked_input_id,
            attackerArrowId: attackerArrowKey
        }));

        const arrowTimerId = setInterval(() => {
            const arrowTimerDiv = document.getElementById(`playerTwo_active_arrow_timer_${inputInstanceFromServer}`);
            
            arrowTimerDiv.innerText = arrowTimerDiv.innerText - 1;
            if (arrowTimerDiv.innerText <= 0) {
                clearInterval(arrowTimerId);
                
                if (inputInstanceFromServer === inputInstanceNumber) setInputVal("");

                setActiveArrows(prev => prev.filter(arrow => arrow.key !== attackerArrowKey));

                if (playerObj.hitPoints > 0 && oppositePlayer.hitPoints > 0) dispatch(decrementHitPoints({player: "playerOne", amount: inputtedWord.length}));
                dispatch(endInputDuel({attacker: "playerTwo", attacker_input_id: inputInstanceFromServer, attacked_input_id}));
            }
        }, 1000);
        
        dispatch(setArrowToDefendId({defender: "playerOne", arrowTimerId, attacker_input_id: attacked_input_id}));
    }
    
    const showToOpponentTypingWords = (e) => {
        const inputVal = e.target.value;
        setInputVal(inputVal);

        if (isInOnlineBattle) {
            socket.timeout(3000).emit("send typing words to opponent", {inputVal, inputInstanceNumber, roomName: currentRoom[0]}, (err, res) => {
                if (err) {
                    triggerErrorModal("error", "The server seems to be down. Please try again in a moment.");
                } else {
                    switch(res.status) {
                        case "ok":
                            break;
                        case "error":
                            triggerErrorModal("error", "The server couldn't process the action. Please try again in a moment.");
                            break;
                        case "warning":
                            break;
                        default:
                    }
                }
            });
        }
    }

    const targetInputWithClick = () => {
        if (isInOnlineBattle && playerRole === "playerTwo") {
            dispatch(setPlayerInputToTarget({player: "playerOne", target: inputInstanceNumber}));
        }
    }

    const checkInputErrors = (word, playerStatus) => {
        const wordAlreadyExists = usedWordsForBothPlayers.hasOwnProperty(word) || playerObj.usedWords.hasOwnProperty(word);
        const inputAlreadyHaveError = inputError;
        const inEnglishDictionary = formattedEnglishDictionary[word];
        const inFrenchDictionary = formattedFrenchDictionary[word];
        const inSpanishDictionary = formattedSpanishDictionary[word];
        const targetIsAlreadyActive = oppositePlayer.inputControls[`input_${playerObj.currentTarget}`]?.active;
        const wordToDefend = currentInputObj.wordToDefend;

        if (word === "") {
            setInputError("input can not be empty");
            return true;
        }

        if (playerStatus === "defending" && wordToDefend[wordToDefend.length - 1] !== word[0]) {
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
        
        switch(playingLanguage) {
            case "english":
                if (!inEnglishDictionary) {
                    setInputError("this is not an English word");
                    return true;
                }
                break;
            
            case "french":
                if (!inFrenchDictionary) {
                    setInputError("this is not a French word");
                    return true;
                }
                break;
            
            case "spanish":
                if (!inSpanishDictionary) {
                    setInputError("this is not a Spanish word");
                    return true;
                }
                break;
        }

        if (!playerObj.currentTarget && !playerObj.inputControls[`input_${inputInstanceNumber}`].targetIfDefending) {
            setInputError("choose a target!");
            return true;
        }

        if (isInOnlineBattle && playerStatus === "attacking" && targetIsAlreadyActive) {
            setInputError("the target is already in a duel");
            return true;
        }

        if (playerStatus === "attacking" && targetIsAlreadyActive) {
            setInputError("the target is already in a duel");
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
            
            <div>
                {
                    currentInputObj.active &&
                    currentInputObj.status === "attacking" ?
                    <WordHUDWrapper>
                        <span>{currentInputObj.attackingWord}</span>
                        <span>{currentInputObj.attackingWord.length}</span>
                    </WordHUDWrapper> : null
                }

                {
                    currentInputObj.status === "defending" &&
                    <WordHUDWrapper>
                        <WordLengthTrackingBar
                            trackingPercentage={calculatePercentage(inputVal.length, currentInputObj.wordToDefend.length)}
                        />
                        <TrackingBarNumericalFeedBack>{inputVal.length >= currentInputObj.wordToDefend.length ? "👍" : inputVal.length}</TrackingBarNumericalFeedBack>
                    </WordHUDWrapper>
                }
                
                <StyledInput
                    $targeted={playerObj.opponentsTarget === inputInstanceNumber && playerRole === "playerTwo"}
                    $playerTwoOnline={isInOnlineBattle && playerRole === "playerTwo"}
                    $lastInstance={lastInstance}
                    ref={inputRef}
                    type="text"
                    id={`${playerRole}_word_attack_input_${inputInstanceNumber}`}
                    value={inputVal}
                    onChange={showToOpponentTypingWords}
                    onClick={targetInputWithClick}
                    placeholder={
                        currentInputObj.active &&
                        currentInputObj.status === "defending" &&
                        currentInputObj.wordToDefend ?
                        currentInputObj.wordToDefend[currentInputObj.wordToDefend.length - 1] : null
                    }
                    readOnly={currentInputObj.active && currentInputObj.status === "attacking" || isInOnlineBattle && playerRole === "playerTwo"}
                    onKeyDown={e => {
                        if (e.code === "Enter" && playerRole === "playerOne") {
                            const inputtedWord = e.target.value;
                            const defender = playerRole === "playerOne" ? "playerTwo" : "playerOne";
                            const playerStatus = currentInputObj.status;
                            const attacked_input_id = playerStatus === "defending" ?
                                playerObj.inputControls[`input_${inputInstanceNumber}`].targetIfDefending :
                                playerObj.currentTarget;
                            const attackerArrowKey = `${playerRole}_word_attack_input_${inputInstanceNumber}_attacking_input_${attacked_input_id}`;
                            const defenderArrowKey = `${defender}_word_attack_input_${attacked_input_id}_attacking_input_${inputInstanceNumber}`;

                            if (!checkInputErrors(inputtedWord, playerStatus)) {
                                dispatch(addWordToUsedWord({player: playerRole, word: inputtedWord}));
                                setInputVal("");
                                
                                if (playerStatus === "defending") {
                                    clearInterval(currentInputObj.arrowToDefendTimerId);
                                    setActiveArrows(prev => prev.filter(arrow => arrow.key !== defenderArrowKey));
                                    
                                    invokeBattle(
                                        attackerArrowKey,
                                        defender,
                                        attacked_input_id,
                                        inputtedWord,
                                        playerStatus
                                    );
                                }

                                if (playerStatus === "attacking") {
                                    invokeBattle(
                                        attackerArrowKey,
                                        defender,
                                        attacked_input_id,
                                        inputtedWord
                                    );
                                }
                            }
                        }
                    }}
                />
            </div>

            <ErrorModal
                modalIsOpen={errorModalOpen}
                onCloseModalFn={() => setErrorModalOpen(false)}
                errorType={serverErrorType}
                errorMsg={createRoomErrorMsg}
            />
        </>
    )
}

export default PlayerInput;

const StyledInput = styled.input`
    margin-bottom: ${({$lastInstance}) => $lastInstance ? "0" : "15px"};
    margin-top: 15px;
    padding: 10px;
    width: 372px;
    border: 1px solid black;
    border-radius: 5px;
    cursor: ${({$playerTwoOnline}) => $playerTwoOnline ? "crosshair" : "initial"};
    ${
        ({$targeted}) => $targeted && css`
            -webkit-box-shadow: 0px 0px 7px 2px rgba(28,98,255,0.72); 
            box-shadow: 0px 0px 7px 2px rgba(28,98,255,0.72);
            outline: none;
        `
    }
`

const WordHUDWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;
    margin-bottom: -10px;
`

const TrackingBarNumericalFeedBack = styled.span`
    position: relative;
    bottom: 2px;
`