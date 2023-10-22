import styled from 'styled-components'
import PlayerOne from "./PlayerOne"
import PlayerTwo from "./PlayerTwo"

const PlayArea = () => {
    return (
        <Wrapper>
            <PlayerOne />
            <PlayerTwo />
        </Wrapper>
    )
}

export default PlayArea;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`