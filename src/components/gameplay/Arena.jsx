import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Xwrapper } from 'react-xarrows';
import { useNavigate, useParams } from 'react-router-dom';
import PlayerArea from './PlayerArea';
import styled from 'styled-components';

const Arena = () => {
    const playerOne = useSelector(state => state.gameState.playerOne);
    const playerTwo = useSelector(state => state.gameState.playerTwo);
    const currentRoom = useSelector(state => state.roomState.currentRoom);
    
    const [activeArrows, setActiveArrows] = useState([]);

    const { roomId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const isInRoomThatExists = currentRoom && currentRoom[1].id === roomId;

        if (roomId && !isInRoomThatExists) {
            navigate("/");
        }

    }, []);

    return (
        <Xwrapper>
            <Wrapper>
                <PlayerArea 
                    playerObj={playerOne}
                    playerRole={"playerOne"}
                    setActiveArrows={setActiveArrows}
                />
                <PlayerArea 
                    playerObj={playerTwo}
                    playerRole={"playerTwo"}
                    setActiveArrows={setActiveArrows}
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
    justify-content: space-between;
    align-items: center;
`