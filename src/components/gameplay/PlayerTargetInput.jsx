import { useDispatch } from "react-redux";
import { setPlayerInputToTarget } from "../../redux/features/game/gameSlice";
import { socket } from "../../services/socket";
import styled from "styled-components";

const PlayerTargetInput = ({ playerRole, inputNumber, playerObj, isInOnlineBattle, currentRoom}) => {
    const dispatch = useDispatch();
    const currentTargetInput = playerObj.inputTargets[`input_${inputNumber}`];
    
    return (
        <CustomSelect
            id={`${playerRole}_target_input_${inputNumber}`}
            value={currentTargetInput.target}
            onChange={e => {
                const targetVal = e.target.value;

                if (playerObj.isInOnlineBattle) {
                    socket.timeout(3000).emit("send input target update", {targetVal, inputNumber, roomName: currentRoom}, (err, res) => {
                        if (err) {
                            console.log('fatal error');
                        } else {
                            // TODO: finish this
                            switch(res.status) {
                                case "ok":
                                    
                                    break;
                                case "error":
                                    console.log('error');
                                    break;
                                case "warning":
                                    break;
                                default:
                            }
                        }
                    });
                }

                dispatch(setPlayerInputToTarget({player: playerRole, selectedInput: inputNumber, target: targetVal}));
            }}
            disabled={currentTargetInput.active || playerRole === "playerTwo" && isInOnlineBattle}
        >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </CustomSelect>
    )
}

export default PlayerTargetInput;

const CustomSelect = styled.select`
    &:disabled {
        opacity: 1;
        background: white;
    }
`