import styled from "styled-components";

const WordExistsError = () => {
    return (
        <Message>word already exists</Message>
    )
}

export default WordExistsError;

const Message = styled.p`
    color: red;
    text-align: center;
`