import styled from "styled-components"
import { UsedWordBadge } from "../shared_styles/sharedStyles";

const UsedWordsTracker = ({ playerObj }) => {
    const usedWords = Object.keys(playerObj.usedWords);

    return (
        <Wrapper>
            <Title>Used words</Title>
            <WordsAreaWrapper>
                {
                    usedWords.map(word => <UsedWordBadge key={word}>{word}</UsedWordBadge>)
                }
            </WordsAreaWrapper>
        </Wrapper>
    )
}

export default UsedWordsTracker;

const Wrapper = styled.div`
    width: -webkit-fill-available;
`

const WordsAreaWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
    box-shadow: 0px 0px 8px -3px #000000;
    width: -webkit-fill-available;
    border-radius: 6px;
    height: 150px;
    overflow-y: scroll;
    flex-wrap: wrap;
`

const Title = styled.div`
    margin-bottom: 20px;
    text-decoration: underline;
    font-size: 1.5em;
    text-align: center;
`