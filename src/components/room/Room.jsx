import { useState } from "react";
import { JoinRoomButtonGeneric } from "../shared_styles/sharedStyles";
import { socket } from "../../services/socket";
import { useDispatch } from "react-redux";
import { updateRoomInfo } from "../../redux/features/rooms/roomSlice";
import { useNavigate } from "react-router-dom";
import {
    setIsInOnlineBattle,
    setAmountOfInput,
    setMaxHealth,
    setWordExpireTime,
    setPlayingLanguage
} from "../../redux/features/game/gameSlice";
import styled from "styled-components";
import LoadingSpinner from "../misc/LoadingSpinner";
import GenericModal from "../modals/GenericModal";

const Room = ({
    roomName,
    triggerErrorModal,
    roomCount,
    refreshRooms,
    isOwner,
    roomParams
}) => {
    const [whileJoiningRoom, setWhileJoiningRoom] = useState(false);
    const [whileDeletingRoom, setWhileDeletingRoom] = useState(false);
    const [roomInfoModalOpen, setRoomInfoModalOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const joinRoom = () => {
        setWhileJoiningRoom(true);
        
        socket.timeout(3000).emit("join battle room", roomName, (err, res) => {
            if (err) {
                triggerErrorModal("error", "Could not connect to the server. Please try again in a moment.");
            } else {
                switch(res.status) {
                    case "ok":
                        const joinedRoom = res.rooms.find(room => room[0] === roomName);
                        
                        dispatch(setAmountOfInput(joinedRoom[1].roomParams.inputAmount));
                        dispatch(setMaxHealth(joinedRoom[1].roomParams.maxHealth));
                        dispatch(setWordExpireTime(joinedRoom[1].roomParams.wordExpireTime));
                        dispatch(setPlayingLanguage(joinedRoom[1].roomParams.language));
                        dispatch(setIsInOnlineBattle(true));
                        dispatch(updateRoomInfo(joinedRoom));
                        navigate(`/arena/${joinedRoom[1].id}`);
                        refreshRooms(res.rooms);
                        break;
                    case "error":
                        triggerErrorModal("error", "The server couldn't join the room. Make sure the room still exists and try again.");
                        break;
                    case "warning":
                        triggerErrorModal("warning", res.errorMessage);
                        break;
                    default:
                }
            }

            setWhileJoiningRoom(false);
        });
    }

    const deleteRoom = () => {
        setWhileDeletingRoom(true);
        
        socket.timeout(3000).emit("delete battle room", roomName, (err, res) => {
            if (err) {
                triggerErrorModal("error", "Could not connect to the server. Please try again in a moment.");
            } else {
                switch(res.status) {
                    case "ok":
                        refreshRooms(res.rooms);
                        break;
                    case "error":
                        triggerErrorModal("error", "The server couldn't delete the room. Please try again.");
                        break;
                    case "warning":
                        triggerErrorModal("warning", res.errorMessage);
                        break;
                    default:
                }
            }

            setWhileDeletingRoom(false);
        });
    }
    
    return (
        <RoomWrapper>
            <RoomContentWrapper>
                <HostAndOpponentWrapper>
                    <RoomsName>{roomName}</RoomsName>
                    <RoomInfoButton onClick={() => setRoomInfoModalOpen(true)}>Room info</RoomInfoButton>
                </HostAndOpponentWrapper>

                <ButtonsWrapperOnRoomInstance>
                    <PeopleInRoom>{`${roomCount}/2`}</PeopleInRoom>
                    {isOwner ? <DeleteRoomButton onClick={deleteRoom} disabled={whileDeletingRoom}>{whileDeletingRoom ? <LoadingSpinner /> : "DELETE"}</DeleteRoomButton> : null}
                    <JoinRoomButtonRoomsArea onClick={joinRoom} disabled={whileJoiningRoom || roomCount === 2}>{whileJoiningRoom ? <LoadingSpinner /> : "JOIN"}</JoinRoomButtonRoomsArea>
                </ButtonsWrapperOnRoomInstance>
            </RoomContentWrapper>
            
            <GenericModal
                modalIsOpen={roomInfoModalOpen}
                onCloseModalFn={() => setRoomInfoModalOpen(false)}
            >
                <RoomParamText>Input amount <RoomParamSpan>{roomParams.inputAmount}</RoomParamSpan></RoomParamText>
                <RoomParamText>Max health <RoomParamSpan>{roomParams.maxHealth} HP</RoomParamSpan></RoomParamText>
                <RoomParamText>Word expiration time <RoomParamSpan>{roomParams.wordExpireTime}s</RoomParamSpan></RoomParamText>
                <RoomParamText>Language <RoomParamSpan>{{english: "english", french: "Français", spanish: "Español"}[roomParams.language]}</RoomParamSpan></RoomParamText>
            </GenericModal>
        </RoomWrapper>
    )
}

export default Room;

const RoomWrapper = styled.div`
    margin: 20px;
    border: 2px solid black;
    border-radius: 8px;
`

const RoomContentWrapper = styled.div`
    display: flex;
    -webkit-box-shadow: 0px 0px 6px 2px rgba(0,0,0,0.2); 
    box-shadow: 0px 0px 6px 2px rgba(0,0,0,0.2);
`

const HostAndOpponentWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const ButtonsWrapperOnRoomInstance = styled.div`
    margin-left: auto;
`

const JoinRoomButtonRoomsArea = styled(JoinRoomButtonGeneric)`
    margin: 10px;
    font-size: .8em;
    padding: 10px 25px;
`

const DeleteRoomButton = styled(JoinRoomButtonGeneric)`
    background-color: #ff3f3f;
    margin: 10px;
    font-size: .8em;
    padding: 10px 25px;
`

const RoomsName = styled.span`
    margin: 0 15px;
`

const PeopleInRoom = styled.span`
    margin: 0 20px;
`

const RoomInfoButton = styled.button`
    margin-left: 5px;
    border: 2px solid black;
    padding: 7px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        opacity: .7;
    }
`

const RoomParamSpan = styled.span`
    float: right;
    margin-left: 50px;
`

const RoomParamText= styled.p`
    border-bottom: 1px solid;
    margin: 20px 0;
`