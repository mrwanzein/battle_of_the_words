import styled from "styled-components";

const PlayerOne = () => {
    return (
        <Wrapper>
            <StyledInput
                type="text"
                id="player_1_input_1"
            />
            <StyledInput
                type="text"
                id="player_1_input_2"
            />
            <StyledInput
                type="text"
                id="player_1_input_3"
            />
            <StyledInput
                type="text"
                id="player_1_input_4"
            />
            <StyledInput
                type="text"
                id="player_1_input_5"
            />
        </Wrapper>
    )
}

export default PlayerOne;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0 200px; 
`

const StyledInput = styled.input`
    margin: 15px;
    padding: 10px;
    width: 300px;
`