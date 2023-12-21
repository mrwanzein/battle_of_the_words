import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetGameState } from "../../redux/features/game/gameSlice";
import { resetRoomState } from "../../redux/features/rooms/roomSlice";
import { socket } from "../../services/socket";
import styled from "styled-components";
import SimpleYesNoModal from "../modals/SimpleYesNoModal";

const Navbar = () => {
    const gameState = useSelector(state => state.gameState);
    const currentRoom = useSelector(state => state.roomState.currentRoom);

    const [confirmLeavingMatchOpen, setConfirmLeavingMatchOpen] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const clickingGameTitle = () => {
        if (gameState.isInOnlineBattle) {
            setConfirmLeavingMatchOpen(true);
        } else {
            navigate("/");
        }
    }
    
    const onAccpetingLeavingMatch = () => {
        socket.timeout(3000).emit("player has left the match", {roomName: currentRoom[0]}, (err, res) => {
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
        
        dispatch(resetGameState({isStillInMatch: false}));
        dispatch(resetRoomState());
        setConfirmLeavingMatchOpen(false);
        navigate("/");
    }

    return (
        <NavDiv>
            <GameName onClick={clickingGameTitle}>Battle of the words</GameName>

            <SimpleYesNoModal
                modalIsOpen={confirmLeavingMatchOpen}
                confirmationText={"Are you sure you want to leave the match?"}
                theYesFunction={onAccpetingLeavingMatch}
                theNoFunction={() => setConfirmLeavingMatchOpen(false)}
            />
        </NavDiv>
    )
}

export default Navbar;

const NavDiv = styled.div`
    height: 80px;
    background-color: #3a7bd6;
    display: flex;
    align-items: center;
`

const GameName = styled.span`
    font-size: 1.5em;
    cursor: pointer;
    margin-left: 50px;
    color: white;
`