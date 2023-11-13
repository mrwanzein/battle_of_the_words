import { useState } from 'react';
import { useSelector } from 'react-redux';
import PlayerArea from './PlayerArea';
import styled from 'styled-components';
import { Xwrapper } from 'react-xarrows';

const Arena = () => {
    const PlayerOne = useSelector(state => state.gameState.playerOne);
    const PlayerTwo = useSelector(state => state.gameState.playerTwo);
    const [activeArrows, setActiveArrows] = useState([]);

    return (
        <Xwrapper>
            <Wrapper>
                <PlayerArea 
                    playerObj={PlayerOne}
                    playerRole={"playerOne"}
                    setActiveArrows={setActiveArrows}
                />
                <PlayerArea 
                    playerObj={PlayerTwo}
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