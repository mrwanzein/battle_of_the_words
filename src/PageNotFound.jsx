import styled from "styled-components";

const PageNotFound = () => {
    return (
        <Wrapper>
            <The404>404</The404>
            <The404Message>You've gone astray. Go back!</The404Message>
        </Wrapper>
    )
}

export default PageNotFound;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: calc(100% - 80px);
`

const The404 = styled.span`
    margin-bottom: 20px;
    font-size: 10em;
`

const The404Message = styled.span`
    font-size: 3em;
`