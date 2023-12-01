import { useSelector } from 'react-redux';
import Player from './Player';
import styled from 'styled-components';
import { Xwrapper } from 'react-xarrows';

const PlayArea = () => {
    const PlayerOne = useSelector(state => state.gameState.playerOne);
    const PlayerTwo = useSelector(state => state.gameState.playerTwo);
    
    return (
        <Xwrapper>
            <Wrapper>
                <Player 
                    playerObj={PlayerOne}
                    playerRole={"playerOne"}
                />
                <Player 
                    playerObj={PlayerTwo}
                    playerRole={"playerTwo"}
                />
            </Wrapper>
        </Xwrapper>
    )
}

export default PlayArea;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`