import styled from 'styled-components'
import PlayerOne from "./PlayerOne"
import PlayerTwo from "./PlayerTwo"
import { Xwrapper } from 'react-xarrows'

const PlayArea = () => {
    return (
        <Xwrapper>
            <Wrapper>
                <PlayerOne />
                <PlayerTwo />
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