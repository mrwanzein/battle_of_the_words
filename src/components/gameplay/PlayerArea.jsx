import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GenericButton } from "../shared_styles/sharedStyles";
import { socket } from "../../services/socket";
import { setIsReadyForOnlineBattle, decrementHitPoints } from "../../redux/features/game/gameSlice";
import { calculatePercentage } from "../../utils";
import { PLAYER_MAX_HP } from "../../redux/features/game/gameSlice";
import styled from "styled-components";
import UsedWordsTracker from "../usedWords/UsedWordsTracker";
import PlayerInput from "./PlayerInput";
import PlayerHpBar from "../misc/PlayerHpBar";
import GenericModal from "../modals/GenericModal";

const PlayerArea = ({
    playerObj,
    playerRole,
    setActiveArrows,
    bothPlayerReady
}) => {
    const currentRoom = useSelector(state => state.roomState.currentRoom);
    const isInOnlineBattle = useSelector(state => state.gameState.isInOnlineBattle);
    const battleCounter = useSelector(state => state.gameState.battleCounter);
    const oppositePlayer = useSelector(state => state.gameState[`${playerRole === "playerOne" ? "playerTwo" : "playerOne"}`]);
    
    const dispatch = useDispatch();
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [opponentJoinedRoom, setOpponentJoinedRoom] = useState(currentRoom && currentRoom[1].participants.length === 2);
    const [canShakeButton, setCanShakeButton] = useState(false);
    const [surrenderModalOpen, setSurrenderModalOpen] = useState(false);

    // remove for production?
    const skippedFirstRenderOfDoubleRender = useRef(false);

    useEffect(() => {
        if (isInOnlineBattle && skippedFirstRenderOfDoubleRender.current) {
            if (opponentJoinedRoom) {
                const getReady = new Audio("/src/assets/sounds/getReady.mp3");
                getReady.play();
                setCanShakeButton(true);
            }
            
            socket.on("player is ready", () => {
                if (playerRole === "playerTwo") {
                    dispatch(setIsReadyForOnlineBattle(true));
                    setIsPlayerReady(true);
                }
            });

            socket.on("opponent has joined", () => {
                const getReady = new Audio("/src/assets/sounds/playerHasJoinedGetReady.mp3");
                getReady.play();
                setCanShakeButton(true);
                setOpponentJoinedRoom(true);
            });

            socket.on("both player ready for rematch", () => {
                const getReady = new Audio("/src/assets/sounds/getReady.mp3");
                
                setIsPlayerReady(false);
                getReady.play();
            });

            socket.on("opponent has surrendered", () => {
                if (playerRole === "playerTwo") {
                    dispatch(decrementHitPoints({player: "playerTwo", amount: playerObj.hitPoints}));
                }
            });
        }

        return () => skippedFirstRenderOfDoubleRender.current = true;
    }, []);
    
    const playerIsReady = () => {
        setIsPlayerReady(true);
        
        socket.timeout(3000).emit("player is ready", {roomName: currentRoom[0]}, (err, res) => {
            if (err) {
                console.log('fatal error');
            } else {
                // TODO: finish this
                switch(res.status) {
                    case "ok":
                        
                        break;
                    case "error":
                        console.log('error');
                        break;
                    case "warning":
                        break;
                    default:
                }
            }
        });
    }

    const surrenderOnlineMatch = () => {
        dispatch(decrementHitPoints({player: "playerOne", amount: oppositePlayer.hitPoints}));
        
        socket.timeout(3000).emit("opponent has surrendered", {roomName: currentRoom[0]}, (err, res) => {
            if (err) {
                console.log('fatal error');
            } else {
                // TODO: finish this
                switch(res.status) {
                    case "ok":
                        
                        break;
                    case "error":
                        console.log('error');
                        break;
                    case "warning":
                        break;
                    default:
                }
            }
        });

        setSurrenderModalOpen(false);
    }

    return (
        <>
            <Wrapper
                $playerHp={playerObj.hitPoints}
                $oppositePlayerHp={oppositePlayer.hitPoints}
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
                            playerRole === "playerOne" ? <PlayerHpBar playerHpInPercent={calculatePercentage(playerObj.hitPoints, PLAYER_MAX_HP)} /> : null
                        }
                        
                        <ColumnWrapper>
                            <UsedWordsTracker
                                playerObj={playerObj}
                                playerRole={playerRole}
                            />

                            {
                                Array(5).fill(null).map((_, index) => 
                                    <PlayerInput
                                        key={`${playerRole}_input_${index + 1}`}
                                        playerRole={playerRole}
                                        playerObj={playerObj}
                                        inputInstanceNumber={index + 1}
                                        setActiveArrows={setActiveArrows}
                                    />
                                )
                            }

                        </ColumnWrapper>
                        
                        {
                            playerRole === "playerTwo" ? <PlayerHpBar onTheRight playerHpInPercent={calculatePercentage(playerObj.hitPoints, PLAYER_MAX_HP)} /> : null
                        }
                    </HpBarWrapper>
                </AwaitingPlayersToBeReady>

                <ForfeitButton onClick={() => setSurrenderModalOpen(true)} $playerRole={playerRole}>surrender &nbsp;&#128128;</ForfeitButton>
            </Wrapper>

            <GenericModal
                modalIsOpen={surrenderModalOpen}
                onCloseModalFn={() => {
                    setSurrenderModalOpen(false)
                }}
            >
                <SurrenderConfirmationText>Are you sure?</SurrenderConfirmationText>
                <SurrenderModalWrapper>
                    <YesNoSurrenderButton onClick={surrenderOnlineMatch}>Yes</YesNoSurrenderButton>
                    <YesNoSurrenderButton onClick={() => setSurrenderModalOpen(false)}>No</YesNoSurrenderButton>
                </SurrenderModalWrapper>
            </GenericModal>
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

    // TODO: double check for 768px bug
    @media only screen and (max-height: 768px) {
        margin-top: 25px;
    }
`

const ForfeitButton = styled(GenericButton)`
    background: red;
    width: 100%;
    margin-top: 30px;
    font-size: 1.3em;
    padding-bottom: 14px;
    visibility: ${({$playerRole}) => $playerRole === "playerTwo" ? "hidden" : "visible"};
    
    &:hover {
        background: #d60a0a;
    }
`

const AwaitingPlayersToBeReady = styled.div`
    position: relative;
    pointer-events: ${({$battleCounter, $playerHp, $oppositePlayerHp}) => {
        if ($playerHp <= 0 || $oppositePlayerHp <= 0) return "none";
        if ($battleCounter <= 0) return "auto";
    }};
    opacity: ${({$playerHp}) => $playerHp <= 0 ? ".4" : "1"};
`

const YesNoSurrenderButton = styled(GenericButton)`
    margin: 0 15px;
`

const SurrenderConfirmationText = styled.span`
    align-self: center;
    margin-bottom: 35px;
    font-size: 1.4em;
`

const SurrenderModalWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`