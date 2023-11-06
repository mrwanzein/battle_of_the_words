import styled from "styled-components";

const WordInputErrors = ({ errorMsg }) => {
    return (
        <Message>{errorMsg}</Message>
    )
}

export default WordInputErrors;

const Message = styled.p`
    color: red;
    text-align: center;
`