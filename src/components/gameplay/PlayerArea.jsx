import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GenericButton } from "../shared_styles/sharedStyles";
import { socket } from "../../services/socket";
import { setIsReadyForOnlineBattle, decrementHitPoints } from "../../redux/features/game/gameSlice";
import { calculatePercentage } from "../../utils";
import { updateRoomInfo } from "../../redux/features/rooms/roomSlice";
import toast from 'react-hot-toast';
import styled from "styled-components";
import UsedWordsTracker from "./UsedWordsTracker";
import PlayerInput from "./PlayerInput";
import PlayerHpBar from "./PlayerHpBar";
import SimpleYesNoModal from "../modals/SimpleYesNoModal";

const getReady = new Audio("/src/assets/sounds/getReady.mp3");

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
    const attackInputAmount = useSelector(state => state.gameState.amountOfInput);
    
    const dispatch = useDispatch();
    
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [opponentJoinedRoom, setOpponentJoinedRoom] = useState(currentRoom && currentRoom[1].participants.length === 2);
    const [canShakeButton, setCanShakeButton] = useState(false);
    const [surrenderModalOpen, setSurrenderModalOpen] = useState(false);

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
                if (currentRoom[1].participants.length === 1) dispatch(updateRoomInfo(updatedRoomInfo))
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
                    if (playerObj.hitPoints > 0 || oppositePlayer.hitPoints > 0) dispatch(decrementHitPoints({player: "playerTwo", amount: playerObj.hitPoints}));
                    dispatch(setIsReadyForOnlineBattle(false));
                    setOpponentJoinedRoom(false);
                    setIsPlayerReady(false);
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
        dispatch(decrementHitPoints({player: "playerOne", amount: playerObj.hitPoints}));
        
        if (isInOnlineBattle) {
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
        }

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
                    surrender &nbsp;&#128128;
                </ForfeitButton>
            </Wrapper>

            <SimpleYesNoModal
                modalIsOpen={surrenderModalOpen}
                confirmationText={"Are you sure you want to surrender?"}
                theYesFunction={surrenderOnlineMatch}
                theNoFunction={() => setSurrenderModalOpen(false)}
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
    margin: 30px 0;
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
        if ($playerHp <= 0 || $oppositePlayerHp <= 0 || $battleCounter > 0) return "none";
        if ($battleCounter <= 0) return "auto";
    }};
    opacity: ${({$playerHp}) => $playerHp <= 0 ? ".4" : "1"};
`