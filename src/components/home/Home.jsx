import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Home = () => {
    return (
        <Wrapper>
            <CustomP>
                Hi, I'm Mrwan Zein and this is battle of the words. It's a free word game that I created after being inspired by <a href="https://shiritorigame.com/" target="_blank" rel="noopener noreferrer">Shiritori game</a>. 
                I found that version of the game to be too unidimensional, so I added my own flavor by making it more dynamic. The game doesn't support playing against
                the computer for now, but it will be a feature in the future.
            </CustomP>

            <p>
                Press <NavLink to="/tutorial">here</NavLink> to learn how to play the game.
            </p>

            <p>
                <NavLink to="/rooms">Create a room</NavLink> and tell a friend to start playing!
            </p>

            <p>
                The dictionaries are based on the word lists from this <a href="https://github.com/lorenbrichter/Words/tree/master/Words" target="_blank" rel="noopener noreferrer">github repository </a>.
            </p>

            <p>
                To contact me, it can be by email at mrwanzein@outlook.com or through <a href="https://www.linkedin.com/in/mrwanzein" target="_blank" rel="noopener noreferrer">linkedin</a>.
            </p>
        </Wrapper>
    )
}

export default Home;

const Wrapper = styled.div`
    margin: 10px 20px;
    padding: 15px;
    line-height: 1.75;
    font-family: akasha;
    font-size: 1.6em;
`

const CustomP = styled.p`
    margin: 0;
`