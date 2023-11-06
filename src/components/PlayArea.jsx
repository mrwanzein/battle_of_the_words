import { useSelector } from 'react-redux';
import Player from './Player';
import styled from 'styled-components';
import { Xwrapper } from 'react-xarrows';

const PlayArea = () => {
    const PlayerOne = useSelector(state => state.gameState.playerOne);
    const PlayerTwo = useSelector(state => state.gameState.playerTwo);
    const usedWordsForBothPlayers = useSelector(state => state.gameState.usedWordsForBothPlayer);
    
    return (
        <Xwrapper>
            <Wrapper>
                <Player 
                    playerObj={PlayerOne}
                    playerRole={"playerOne"}
                    usedWordsForBothPlayers={usedWordsForBothPlayers}
                />
                <Player 
                    playerObj={PlayerTwo}
                    playerRole={"playerTwo"}
                    usedWordsForBothPlayers={usedWordsForBothPlayers}
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