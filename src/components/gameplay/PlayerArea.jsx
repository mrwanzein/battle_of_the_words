import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GenericButton } from "../shared_styles/sharedStyles";
import { socket } from "../../services/socket";
import { setIsReadyForOnlineBattle, decrementHitPoints, resetGameState } from "../../redux/features/game/gameSlice";
import { calculatePercentage } from "../../utils";
import { updateRoomInfo } from "../../redux/features/rooms/roomSlice";
import toast from 'react-hot-toast';
import styled, {css} from "styled-components";
import UsedWordsTracker from "./UsedWordsTracker";
import PlayerInput from "./PlayerInput";
import PlayerHpBar from "./PlayerHpBar";
import SimpleYesNoModal from "../modals/SimpleYesNoModal";
import ErrorModal from "../modals/ErrorModal";

const getReady = new Audio("/src/assets/sounds/getReady.mp3");

const PlayerArea = ({
    playerObj,
    playerRole,
    setActiveArrows,
    bothPlayerReady,
    activeArrows
}) => {
    const currentRoom = useSelector(state => state.roomState.currentRoom);
    const isInOnlineBattle = useSelector(state => state.gameState.isInOnlineBattle);
    const battleCounter = useSelector(state => state.gameState.battleCounter);
    const oppositePlayer = useSelector(state => state.gameState[`${playerRole === "playerOne" ? "playerTwo" : "playerOne"}`]);
    const attackInputAmount = useSelector(state => state.gameState.amountOfInput);
    
    const dispatch = useDispatch();
    
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [opponentJoinedRoom, setOpponentJoinedRoom] = useState(currentRoom && currentRoom[1].participants.length === 2);
    const [canShakeButton, setCanShakeButton] = useState(false);
    const [surrenderModalOpen, setSurrenderModalOpen] = useState(false);

    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [serverErrorType, setServerErrorType] = useState("error");
    const [createRoomErrorMsg, setCreateRoomErrorMsg] = useState("");

    // remove for production?
    const skippedFirstRenderOfDoubleRender = useRef(false);

    useEffect(() => {
        if (isInOnlineBattle && skippedFirstRenderOfDoubleRender.current) {
            socket.on("player is ready", () => {
                if (playerRole === "playerTwo") {
                    dispatch(setIsReadyForOnlineBattle(true));
                    setIsPlayerReady(true);
                }
            });

            socket.on("opponent has joined", ({updatedRoomInfo}) => {
                getReady.play();
                dispatch(updateRoomInfo(updatedRoomInfo));
                dispatch(resetGameState({isStillInMatch: true, roomParamHealth: currentRoom[1].roomParams.maxHealth}));
                setCanShakeButton(true);
                setOpponentJoinedRoom(true);
            });

            socket.on("both player want rematch", () => {
                setIsPlayerReady(false);
                getReady.play();
            });

            socket.on("opponent has surrendered", () => {
                if (playerRole === "playerTwo") {
                    toast.success("Opponent has surrendered!", {duration: 5000});
                    dispatch(decrementHitPoints({player: "playerTwo", amount: oppositePlayer.hitPoints}));
                }
            });

            socket.on("player has left the match", () => {
                    toast.error("Player has left the room", {duration: 5000});
                    dispatch(decrementHitPoints({player: "playerTwo", amount: oppositePlayer.hitPoints, specialCase: "player left match"}));
                    dispatch(setIsReadyForOnlineBattle(false));
                    setOpponentJoinedRoom(false);
                    setIsPlayerReady(false);
            });
        }

        return () => skippedFirstRenderOfDoubleRender.current = true;
    }, []);

    const triggerErrorModal = (errorType, errorMessage) => {
        setServerErrorType(errorType);
        setErrorModalOpen(true);
        setCreateRoomErrorMsg(errorMessage);
    }
    
    const playerIsReady = () => {
        setIsPlayerReady(true);
        
        socket.timeout(3000).emit("player is ready", {roomName: currentRoom[0]}, (err, res) => {
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

    const surrenderOnlineMatch = () => {
        dispatch(decrementHitPoints({player: "playerOne", amount: playerObj.hitPoints}));
        
        if (isInOnlineBattle) {
            socket.timeout(3000).emit("opponent has surrendered", {roomName: currentRoom[0]}, (err, res) => {
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

        setSurrenderModalOpen(false);
    }

    return (
        <>
            <Wrapper
                $playerHp={playerObj.hitPoints}
                $oppositePlayerHp={oppositePlayer.hitPoints}
                $playerRole={playerRole}
            >
                {
                    !bothPlayerReady && isInOnlineBattle && playerRole === "playerOne" ?
                    <ReadyButton onClick={playerIsReady} disabled={isPlayerReady || !opponentJoinedRoom} $canPlay={canShakeButton}>
                        {
                            !opponentJoinedRoom ? "Waiting for opponent to join..." :
                            isPlayerReady ? "Alright!" : "Press to get ready!"
                        }
                    </ReadyButton>
                    : null
                }

                {
                    !bothPlayerReady && isInOnlineBattle && playerRole === "playerTwo" ?
                    <ReadyButton disabled={true}>
                        {
                            playerObj.isReadyForOnlineBattle ?
                            "Ready for battle!" :
                            opponentJoinedRoom ?
                            "Opponent has joined! Getting ready... " :
                            "Waiting for opponent to join..."
                        }
                    </ReadyButton>
                    : null
                }

                <AwaitingPlayersToBeReady
                    $battleCounter={isInOnlineBattle ? battleCounter : -1}
                    $playerHp={playerObj.hitPoints}
                    $oppositePlayerHp={oppositePlayer.hitPoints}
                >
                    <HpBarWrapper>
                        {
                            playerRole === "playerOne" ? <PlayerHpBar playerHpInPercent={calculatePercentage(playerObj.hitPoints, playerObj.maxHitPoints)} /> : null
                        }
                        
                        <ColumnWrapper>
                            <UsedWordsTracker
                                playerObj={playerObj}
                                playerRole={playerRole}
                            />

                            {
                                Array(attackInputAmount).fill(null).map((_, index) => 
                                    <PlayerInput
                                        key={`${playerRole}_input_${index + 1}`}
                                        playerRole={playerRole}
                                        playerObj={playerObj}
                                        inputInstanceNumber={index + 1}
                                        setActiveArrows={setActiveArrows}
                                        activeArrows={activeArrows}
                                        lastInstance={index + 1 === attackInputAmount}
                                    />
                                )
                            }
                        </ColumnWrapper>
                        
                        {
                            playerRole === "playerTwo" ? <PlayerHpBar onTheRight playerHpInPercent={calculatePercentage(playerObj.hitPoints, playerObj.maxHitPoints)} /> : null
                        }
                    </HpBarWrapper>
                </AwaitingPlayersToBeReady>

                <ForfeitButton
                    onClick={() => setSurrenderModalOpen(true)}
                    $playerRole={playerRole}
                    disabled={playerObj.hitPoints <= 0 || oppositePlayer.hitPoints <= 0 || battleCounter > 0}
                >
                    SURRENDER &nbsp;&#128128;
                </ForfeitButton>
            </Wrapper>

            <SimpleYesNoModal
                modalIsOpen={surrenderModalOpen}
                confirmationText={"Are you sure you want to surrender?"}
                theYesFunction={surrenderOnlineMatch}
                theNoFunction={() => setSurrenderModalOpen(false)}
            />

            <ErrorModal
                modalIsOpen={errorModalOpen}
                onCloseModalFn={() => setErrorModalOpen(false)}
                errorType={serverErrorType}
                errorMsg={createRoomErrorMsg}
            />
        </>
    )
}

export default PlayerArea;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0 ${({$playerHp, $oppositePlayerHp}) => $playerHp <= 0 || $oppositePlayerHp <= 0 ? 150 : 200}px;
    border: 4px solid #3a3a3a37;;
    padding: 15px 30px;
    border-radius: 6px;
    background: white;
    box-shadow: ${({$playerRole}) => $playerRole === "playerOne" ? "-15px 15px 30px #bebebe, -15px -15px 30px #ffffff" : "15px 15px 30px #bebebe, -15px -15px 30px #ffffff"};
    ${
        ({$playerRole}) => $playerRole === "playerOne" ? css`
            border-right: none;
        ` :
        css`
            border-left: none;
        `
    }

    @media only screen and (max-width: 1450px) {
        margin: 0 140px;
    }
`

const HpBarWrapper = styled.div`
    display: flex;
`

const ColumnWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const ReadyButton = styled(GenericButton)`
    @keyframes shake {
        25% {
            margin-left: -15px;
        }

        50% {
            margin-left: 15px;
        }

        75% {
            margin-right: 15px;
        }

        100% {
            margin-right: -15px;
        }
    }
    
    width: 100%;
    margin-bottom: 15px;
    border-bottom: 7px solid #045ba8;
    animation-name: ${({$canPlay}) => $canPlay ? "shake" : "null"};
    animation-duration: .4s;
    animation-iteration-count: 5;
    animation-timing-function: linear;

    &:active {
        border-bottom: 4px solid #045ba8;
    }

    @media only screen and (max-height: 768px) {
        margin-top: 25px;
    }
`

const ForfeitButton = styled(GenericButton)`
    background: red;
    width: 100%;
    margin-top: 40px;
    font-size: 1.1em;
    padding-bottom: 14px;
    visibility: ${({$playerRole}) => $playerRole === "playerTwo" ? "hidden" : "visible"};
    font-family: rexlia;
    
    &:hover {
        background: #d60a0a;
    }
`

const AwaitingPlayersToBeReady = styled.div`
    position: relative;
    pointer-events: ${({$battleCounter, $playerHp, $oppositePlayerHp}) => {
        if ($playerHp <= 0 || $oppositePlayerHp <= 0 || $battleCounter > 0) return "none";
        if ($battleCounter <= 0) return "auto";
    }};
    opacity: ${({$playerHp}) => $playerHp <= 0 ? ".4" : "1"};
`