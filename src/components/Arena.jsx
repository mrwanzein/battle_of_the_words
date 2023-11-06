import { useSelector } from 'react-redux';
import PlayerArea from './PlayerArea';
import styled from 'styled-components';
import { Xwrapper } from 'react-xarrows';

const Arena = () => {
    const PlayerOne = useSelector(state => state.gameState.playerOne);
    const PlayerTwo = useSelector(state => state.gameState.playerTwo);
    
    return (
        <Xwrapper>
            <Wrapper>
                <PlayerArea 
                    playerObj={PlayerOne}
                    playerRole={"playerOne"}
                />
                <PlayerArea 
                    playerObj={PlayerTwo}
                    playerRole={"playerTwo"}
                />
            </Wrapper>
        </Xwrapper>
    )
}

export default Arena;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`