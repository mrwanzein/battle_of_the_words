import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Xwrapper } from 'react-xarrows';
import { useNavigate, useParams } from 'react-router-dom';
import { socket } from '../../services/socket';
import { GenericButton } from '../shared_styles/sharedStyles';
import { IoIosCheckmarkCircle } from "react-icons/io";
import { resetState } from '../../redux/features/game/gameSlice';
import PlayerArea from './PlayerArea';
import styled from 'styled-components';
import BattleCounter from '../misc/BattleCounter';

const Arena = () => {
    const playerOne = useSelector(state => state.gameState.playerOne);
    const playerTwo = useSelector(state => state.gameState.playerTwo);
    const currentRoom = useSelector(state => state.roomState.currentRoom);
    
    const [activeArrows, setActiveArrows] = useState([]);
    const [bothPlayerReady, setBothPlayerReady] = useState(false);
    const [hasPressedRematchOnline, setHasPressedRematchOnline] = useState({local: false, opponent: false});

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
            });

            socket.on("both player ready for rematch", () => {
                dispatch(resetState());
                setBothPlayerReady(false);
            });

            socket.on("player wants rematch", () => {
                setHasPressedRematchOnline(prev => ({...prev, opponent: true}));
            });
        }

        return () => skippedFirstRenderOfDoubleRender.current = true;
    }, []);

    const onClickRematch = () => {
        setHasPressedRematchOnline(prev => ({...prev, local: true}));

        socket.timeout(3000).emit("player wants rematch", {roomName: currentRoom[0]}, (err, res) => {
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
        <Xwrapper>
            <Wrapper>
                {
                    playerOne.hitPoints <= 0 || playerTwo.hitPoints <= 0 ?
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
                    />
                    
                    {
                        bothPlayerReady ? <BattleCounter /> : null
                    }
                    
                    <PlayerArea 
                        playerObj={playerTwo}
                        playerRole={"playerTwo"}
                        setActiveArrows={setActiveArrows}
                        bothPlayerReady={bothPlayerReady}
                    />
                </PlayerAreaWrapper>
            </Wrapper>

            {
                activeArrows.map(arrowComponent => arrowComponent)
            }
        </Xwrapper>
    )
}

export default Arena;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;

    @media only screen and (min-height: 768px) {
        height: calc(100% - 80px);
    }
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