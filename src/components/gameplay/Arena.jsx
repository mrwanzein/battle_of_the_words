import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Xwrapper } from 'react-xarrows';
import { useNavigate, useParams } from 'react-router-dom';
import { socket } from '../../services/socket';
import { GenericButton } from '../shared_styles/sharedStyles';
import { IoIosCheckmarkCircle } from "react-icons/io";
import { resetGameState } from '../../redux/features/game/gameSlice';
import { updateRoomInfo, resetRoomState } from '../../redux/features/rooms/roomSlice';
import PlayerArea from './PlayerArea';
import styled from 'styled-components';
import BattleCounter from './BattleCounter';
import SimpleYesNoModal from '../modals/SimpleYesNoModal';
import ErrorModal from '../modals/ErrorModal';

const Arena = () => {
    const playerOne = useSelector(state => state.gameState.playerOne);
    const playerTwo = useSelector(state => state.gameState.playerTwo);
    const currentRoom = useSelector(state => state.roomState.currentRoom);
    const isInOnlineBattle = useSelector(state => state.gameState.isInOnlineBattle);

    const [activeArrows, setActiveArrows] = useState([]);
    const [bothPlayerReady, setBothPlayerReady] = useState(false);
    const [hasPressedRematchOnline, setHasPressedRematchOnline] = useState({local: false, opponent: false});
    const [confirmLeavingMatchOpen, setConfirmLeavingMatchOpen] = useState(false);
    const [canSeeRematchButton, setCanSeeRematchButton] = useState(true);

    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [serverErrorType, setServerErrorType] = useState("error");
    const [createRoomErrorMsg, setCreateRoomErrorMsg] = useState("");

    const { roomId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // remove for production?
    const skippedFirstRenderOfDoubleRender = useRef(false);

    useEffect(() => {
        const isInRoomThatExists = currentRoom && currentRoom[1].id === roomId;

        if (roomId && !isInRoomThatExists) {
            navigate("/");
        }

        if (skippedFirstRenderOfDoubleRender.current) {
            socket.on("players are ready to battle online", () => {
                setBothPlayerReady(true);
                setCanSeeRematchButton(true);
            });

            socket.on("both player want rematch", () => {
                dispatch(resetGameState({isStillInMatch: true, roomParamHealth: currentRoom[1].roomParams.maxHealth}));
                setBothPlayerReady(false);
                setHasPressedRematchOnline({local: false, opponent: false});
            });

            socket.on("player wants rematch", () => {
                setHasPressedRematchOnline(prev => ({...prev, opponent: true}));
            });

            socket.on("player has left the match", ({updatedRoomState}) => {
                dispatch(updateRoomInfo(updatedRoomState));
                setBothPlayerReady(false);
                setCanSeeRematchButton(false);
            });
        }

        return () => skippedFirstRenderOfDoubleRender.current = true;
    }, []);

    const triggerErrorModal = (errorType, errorMessage) => {
        setServerErrorType(errorType);
        setErrorModalOpen(true);
        setCreateRoomErrorMsg(errorMessage);
    }

    const onClickRematch = () => {
        setHasPressedRematchOnline(prev => ({...prev, local: true}));

        if (isInOnlineBattle) {
            socket.timeout(3000).emit("player wants rematch", {roomName: currentRoom[0]}, (err, res) => {
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

    const onClickLeaveRoom = () => {
        if (isInOnlineBattle) {
            socket.timeout(3000).emit("player has left the match", {roomName: currentRoom[0]}, (err, res) => {
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
            
            dispatch(resetRoomState());
            setBothPlayerReady(false);
        }
        
        dispatch(resetGameState({isStillInMatch: false}));
        
        if (isInOnlineBattle) {
            navigate("/rooms");
        } else {
            navigate("/");
        }
        
        setConfirmLeavingMatchOpen(false);
    }

    return (
        <Xwrapper>
            <Wrapper>
                <LeaveRoomButton onClick={() => setConfirmLeavingMatchOpen(true)}>Leave room</LeaveRoomButton>

                {
                    (playerOne.hitPoints <= 0 || playerTwo.hitPoints <= 0) && canSeeRematchButton ?
                    <RematchWrapper>
                        <IoIosCheckmarkCircle style={{marginRight: "20px", fill: hasPressedRematchOnline.local ? "lightgreen" : "#2f2f2f4a"}} size={"2.3em"} />
                        <RematchButton onClick={onClickRematch}>Rematch?</RematchButton>
                        <IoIosCheckmarkCircle style={{marginLeft: "20px", fill: hasPressedRematchOnline.opponent ? "lightgreen" : "#2f2f2f4a"}} size={"2.3em"} />
                    </RematchWrapper>
                    : null
                }

                <PlayerAreaWrapper>
                    <PlayerArea 
                        playerObj={playerOne}
                        playerRole={"playerOne"}
                        setActiveArrows={setActiveArrows}
                        bothPlayerReady={bothPlayerReady}
                        activeArrows={activeArrows}
                    />
                    
                    {
                        bothPlayerReady ? <BattleCounter /> : null
                    }

                    {
                        playerOne.hitPoints <= 0 ?
                        <WinnerSign>
                            <CrownIcon>👑</CrownIcon>
                            <WinnerText>Player 2 wins!</WinnerText>
                        </WinnerSign> :
                        null
                    }

                    {
                        playerTwo.hitPoints <= 0 ?
                        <WinnerSign>
                            <CrownIcon>👑</CrownIcon>
                            <WinnerText>Player 1 wins!</WinnerText>
                        </WinnerSign> :
                        null
                    }

                    <PlayerArea 
                        playerObj={playerTwo}
                        playerRole={"playerTwo"}
                        setActiveArrows={setActiveArrows}
                        bothPlayerReady={bothPlayerReady}
                        activeArrows={activeArrows}
                    />
                </PlayerAreaWrapper>
            </Wrapper>

            {
                activeArrows.map(arrowComponent => arrowComponent)
            }

            <SimpleYesNoModal
                modalIsOpen={confirmLeavingMatchOpen}
                confirmationText={"Are you sure you want to leave the match?"}
                theYesFunction={onClickLeaveRoom}
                theNoFunction={() => setConfirmLeavingMatchOpen(false)}
            />

            <ErrorModal
                modalIsOpen={errorModalOpen}
                onCloseModalFn={() => setErrorModalOpen(false)}
                errorType={serverErrorType}
                errorMsg={createRoomErrorMsg}
            />
        </Xwrapper>
    )
}

export default Arena;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
`

const PlayerAreaWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const RematchWrapper = styled.div`
    display: flex;
    align-items: center;
    align-self: center;
`

const RematchButton = styled(GenericButton)`
    border-bottom: 7px solid #045ba8;
    width: 280px;

    &:active {
        border-bottom: 4px solid #045ba8;
    }

    @media only screen and (max-height: 768px) {
        margin-top: 25px;
    }
`

const LeaveRoomButton = styled(GenericButton)`
    border-bottom: 3px solid lightgrey;
    width: 150px;
    margin: 25px 30px 40px 30px;
    background: red;
    padding-bottom: 10px;
    align-self: center;

    &:active {
        border-bottom: 1px solid lightgrey;
    }

    &:hover {
        background: #c90404;
    }

    @media only screen and (max-height: 768px) {
        margin-top: 25px;
    }
`

const WinnerSign = styled.div`
    display: flex;
    flex-direction: column;
`

const WinnerText = styled.span`
    text-wrap: nowrap;
    font-size: 2em;
`

const CrownIcon = styled.span`
    align-self: center;
    margin-bottom: 25px;
    transform: scale(2.5);
`