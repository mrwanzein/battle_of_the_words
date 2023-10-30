import { useSelector, useDispatch } from "react-redux";
import { setPlayerInputToTarget } from "../redux/features/game/gameSlice";
import styled from "styled-components";
import Xarrow from 'react-xarrows'

const InputTarget = ({ id, inputNumber }) => {
    const dispatch = useDispatch();
    
    return (
        <select
            id={id}
            onChange={e => {
                dispatch(setPlayerInputToTarget({player: "playerOne", selectedInput: inputNumber, target: e.target.value}))
            }}
        >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
    )
}

const PlayerOne = () => {
    const playerOneHP = useSelector(state => state.gameState.playerOne.hitPoints);
    const theState = useSelector(state => state.gameState)
    
    return (
        <Wrapper>
            <p>HP: {playerOneHP}</p>
            
            <InputWrapper>
                <InputTarget id={"player_1_target_input_1"} inputNumber={1}/>

                <StyledInput
                    type="text"
                    id="player_1_word_attack_input_1"
                    onKeyDown={e => {
                        if (e.code === "Enter") console.log(theState)
                    }}
                />
            </InputWrapper>

            <InputWrapper>
                <InputTarget id={"player_1_target_input_2"} inputNumber={2}/>

                <StyledInput
                    type="text"
                    id="player_1_word_attack_input_2"
                />
            </InputWrapper>

            <InputWrapper>
                <InputTarget id={"player_1_target_input_3"} inputNumber={3}/>

                <StyledInput
                    type="text"
                    id="player_1_word_attack_input_3"
                />
            </InputWrapper>

            <InputWrapper>
                <InputTarget id={"player_1_target_input_4"} inputNumber={4}/>

                <StyledInput
                    type="text"
                    id="player_1_word_attack_input_4"
                />
            </InputWrapper>

            <InputWrapper>
                <InputTarget id={"player_1_target_input_5"} inputNumber={5}/>

                <StyledInput
                    type="text"
                    id="player_1_word_attack_input_5"
                />
            </InputWrapper>
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

const InputWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const StyledInput = styled.input`
    margin: 15px;
    padding: 10px;
    width: 300px;
`