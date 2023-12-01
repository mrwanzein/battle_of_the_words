import { useDispatch } from "react-redux";
import { setPlayerInputToTarget } from "../../redux/features/game/gameSlice";

const PlayerTargetInput = ({ playerRole, inputNumber, playerObj }) => {
    const dispatch = useDispatch();
    const currentTargetInput = playerObj.inputTargets[`input_${inputNumber}`];
    
    return (
        <select
            id={`${playerRole}_target_input_${inputNumber}`}
            value={currentTargetInput.target}
            onChange={e => {
                dispatch(setPlayerInputToTarget({player: playerRole, selectedInput: inputNumber, target: e.target.value}))
            }}
            disabled={currentTargetInput.active}
        >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
    )
}

export default PlayerTargetInput;