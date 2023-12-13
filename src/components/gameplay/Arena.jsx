import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Xwrapper } from 'react-xarrows';
import { useNavigate, useParams } from 'react-router-dom';
import { socket } from '../../services/socket';
import PlayerArea from './PlayerArea';
import styled from 'styled-components';
import BattleCounter from '../misc/BattleCounter';

const Arena = () => {
    const playerOne = useSelector(state => state.gameState.playerOne);
    const playerTwo = useSelector(state => state.gameState.playerTwo);
    const currentRoom = useSelector(state => state.roomState.currentRoom);
    
    const [activeArrows, setActiveArrows] = useState([]);
    const [bothPlayerReady, setBothPlayerReady] = useState(false);

    const { roomId } = useParams();
    const navigate = useNavigate();

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
        }

        return () => skippedFirstRenderOfDoubleRender.current = true;
    }, []);

    return (
        <Xwrapper>
            <Wrapper>
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
    align-items: center;

    @media only screen and (min-height: 768px) {
        height: calc(100% - 80px);
    }
`