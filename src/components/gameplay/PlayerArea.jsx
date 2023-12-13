import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GenericButton } from "../shared_styles/sharedStyles";
import { socket } from "../../services/socket";
import { setIsReadyForOnlineBattle } from "../../redux/features/game/gameSlice";
import styled from "styled-components";
import UsedWordsTracker from "../usedWords/UsedWordsTracker";
import PlayerInput from "./PlayerInput";

 // TODO: add animation announcing opponent has joined?

const PlayerArea = ({
    playerObj,
    playerRole,
    setActiveArrows,
    bothPlayerReady
}) => {
    const currentRoom = useSelector(state => state.roomState.currentRoom);
    const isInOnlineBattle = useSelector(state => state.gameState.isInOnlineBattle);
    const battleCounter = useSelector(state => state.gameState.battleCounter);
    
    const dispatch = useDispatch();
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [opponentJoinedRoom, setOpponentJoinedRoom] = useState(currentRoom && currentRoom[1].participants.length === 2);

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

            socket.on("opponent has joined", () => {
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
                    <ReadyButton onClick={playerIsReady} disabled={isPlayerReady || !opponentJoinedRoom}>
                        {
                            !opponentJoinedRoom ? "Waiting for opponent to join..." :
                            isPlayerReady ? "Alright!" : "Are you ready?"
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

                <AwaitingPlayersToBeReady $battleCounter={isInOnlineBattle ? battleCounter : -1}>
                    <UsedWordsTracker
                        playerObj={playerObj}
                        playerRole={playerRole}
                    />

                    <p style={{fontSize: "1.3em"}}>HP: {playerObj.hitPoints} <span>{playerObj.hitPoints <= 0 ? "You lose!" : null}</span></p>
                    
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

const ReadyButton = styled(GenericButton)`
    width: 100%;
    margin-bottom: 15px;

    // TODO: double check for 768px bug
    @media only screen and (max-height: 768px) {
        margin-top: 25px;
    }
`

const AwaitingPlayersToBeReady = styled.div`
    pointer-events: ${({$battleCounter}) => $battleCounter <= 0 ? "auto" : "none"};
`