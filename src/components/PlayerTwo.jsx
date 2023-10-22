import styled from "styled-components";

const PlayerTwo = () => {
    return (
        <Wrapper>
            <StyledInput
                type="text"
            />
            <StyledInput
                type="text"
            />
            <StyledInput
                type="text"
            />
            <StyledInput
                type="text"
            />
            <StyledInput
                type="text"
            />
        </Wrapper>
    )
}

export default PlayerTwo;

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