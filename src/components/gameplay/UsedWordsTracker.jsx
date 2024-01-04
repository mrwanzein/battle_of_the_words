import styled from "styled-components";
import { UsedWordBadge } from "../shared_styles/sharedStyles";

const UsedWordsTracker = ({ playerObj }) => {
    const usedWords = Object.keys(playerObj.usedWords);

    return (
        <Wrapper>
            <Title>Used words</Title>
            <WordsAreaWrapper>
                {
                    usedWords.sort().map(word => <UsedWordBadge key={word}>{word}</UsedWordBadge>)
                }
            </WordsAreaWrapper>
        </Wrapper>
    )
}

export default UsedWordsTracker;

const Wrapper = styled.div`
    width: 100%;
`

const WordsAreaWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    align-items: center;
    margin: 25px 0;
    box-shadow: 0px 0px 8px -3px #000000;
    border-radius: 6px;
    height: 200px;
    overflow-y: scroll;
    padding: 15px;
`

const Title = styled.div`
    margin-top: 20px;
    font-size: 1.5em;
    text-align: center;
    font-family: sofachrome
`