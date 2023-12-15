import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GenericButton } from "../shared_styles/sharedStyles";
import { socket } from "../../services/socket";
import { setIsReadyForOnlineBattle } from "../../redux/features/game/gameSlice";
import { calculatePercentage } from "../../utils";
import styled from "styled-components";
import UsedWordsTracker from "../usedWords/UsedWordsTracker";
import PlayerInput from "./PlayerInput";
import PlayerHpBar from "../misc/PlayerHpBar";

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

    return (
        <>
            <Wrapper>
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

                <AwaitingPlayersToBeReady $battleCounter={isInOnlineBattle ? battleCounter : -1} $playerHp={playerObj.hitPoints}>
                    {
                        playerObj.hitPoints <= 0 ? <WinOrLoseSign>Defeated!</WinOrLoseSign> : null
                    }

                    {
                        playerRole === "playerOne" && oppositePlayer.hitPoints <= 0 ? <WinOrLoseSign $winOrLose="win">You Win!</WinOrLoseSign> : null
                    }
                    
                    <HpBarWrapper>
                        {
                            playerRole === "playerOne" ? <PlayerHpBar playerHpInPercent={calculatePercentage(playerObj.hitPoints, 60)} /> : null
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
                            playerRole === "playerTwo" ? <PlayerHpBar onTheRight playerHpInPercent={calculatePercentage(playerObj.hitPoints, 60)} /> : null
                        }
                    </HpBarWrapper>
                </AwaitingPlayersToBeReady>
            </Wrapper>
        </>
    )
}

export default PlayerArea;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0 200px; 
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

const AwaitingPlayersToBeReady = styled.div`
    position: relative;
    pointer-events: ${({$battleCounter}) => $battleCounter <= 0 ? "auto" : "none"};
    opacity: ${({$playerHp}) => $playerHp <= 0 ? ".4" : "1"};
`

const WinOrLoseSign = styled.span`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(8, 6);
    color: ${({$winOrLose}) => $winOrLose === "win" ? "#32f932" : "red"};
    text-shadow: 0px 0px 1px black;
`