import styled from 'styled-components'
import PlayerOne from "./PlayerOne"
import PlayerTwo from "./PlayerTwo"
import Xarrow from 'react-xarrows'

const PlayArea = () => {
    return (
        <Wrapper>
            <PlayerOne />
            <PlayerTwo />
            <Xarrow
                start="player_1_input_1"
                end="player_2_input_5"
            />
        </Wrapper>
    )
}

export default PlayArea;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`