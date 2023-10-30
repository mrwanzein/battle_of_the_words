import { useSelector, useDispatch } from "react-redux";
import { setPlayerInputToTarget } from "../redux/features/game/gameSlice";
import styled from "styled-components";

const InputTarget = ({ id, inputNumber }) => {
    const dispatch = useDispatch();
    
    return (
        <select
            id={id}
            onChange={e => {
                dispatch(setPlayerInputToTarget({player: "playerTwo", selectedInput: inputNumber, target: e.target.value}))
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

const PlayerTwo = () => {
    const playerTwoHP = useSelector(state => state.gameState.playerOne.hitPoints);
    
    return (
        <Wrapper>
            <p>HP: {playerTwoHP}</p>
            
            <InputWrapper>
                <StyledInput
                    type="text"
                    id="player_2_input_1"
                />

                <InputTarget id={"player_2_target_input_1"} inputNumber={1} />
            </InputWrapper>

            <InputWrapper>
                <StyledInput
                    type="text"
                    id="player_2_input_2"
                />

                <InputTarget id={"player_2_target_input_2"} inputNumber={2} />
            </InputWrapper>

            <InputWrapper>
                <StyledInput
                    type="text"
                    id="player_2_input_3"
                />

                <InputTarget id={"player_2_target_input_3"} inputNumber={3} />
            </InputWrapper>

            <InputWrapper>
                <StyledInput
                    type="text"
                    id="player_2_input_4"
                />

                <InputTarget id={"player_2_target_input_4"} inputNumber={4} />
            </InputWrapper>

            <InputWrapper>
                <StyledInput
                    type="text"
                    id="player_2_input_5"
                />

                <InputTarget id={"player_2_target_input_5"} inputNumber={5} />
            </InputWrapper>
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