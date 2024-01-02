import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetGameState } from "../../redux/features/game/gameSlice";
import { resetRoomState } from "../../redux/features/rooms/roomSlice";
import { socket } from "../../services/socket";
import styled from "styled-components";
import SimpleYesNoModal from "../modals/SimpleYesNoModal";
import ErrorModal from "../modals/ErrorModal";

const Navbar = () => {
    const gameState = useSelector(state => state.gameState);
    const currentRoom = useSelector(state => state.roomState.currentRoom);

    const [confirmLeavingMatchOpen, setConfirmLeavingMatchOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [serverErrorType, setServerErrorType] = useState("error");
    const [createRoomErrorMsg, setCreateRoomErrorMsg] = useState("");
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const triggerErrorModal = (errorType, errorMessage) => {
        setServerErrorType(errorType);
        setErrorModalOpen(true);
        setCreateRoomErrorMsg(errorMessage);
    }

    const clickingGameTitle = () => {
        if (gameState.isInOnlineBattle) {
            setConfirmLeavingMatchOpen(true);
        } else {
            navigate("/");
        }
    }
    
    const onAcceptingLeavingMatch = () => {
        socket.timeout(3000).emit("player has left the match", {roomName: currentRoom[0]}, (err, res) => {
            if (err) {
                triggerErrorModal("error", "The server seems to be down. Please try again in a moment.");
            } else {
                switch(res.status) {
                    case "ok":
                        break;
                    case "error":
                        triggerErrorModal("error", "There was an error in the server. Please try again in a moment.");
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
                theYesFunction={onAcceptingLeavingMatch}
                theNoFunction={() => setConfirmLeavingMatchOpen(false)}
            />

            <ErrorModal
                modalIsOpen={errorModalOpen}
                onCloseModalFn={() => setErrorModalOpen(false)}
                errorType={serverErrorType}
                errorMsg={createRoomErrorMsg}
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