import { useState, useEffect } from "react";
import { GenericButton, GenericIconButton } from "../shared_styles/sharedStyles";
import { socket } from "../../services/socket";
import { FiRefreshCw } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addRoomInfoToJoinedRooms } from "../../redux/features/rooms/roomSlice";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../modals/ErrorModal";
import GenericModal from "../modals/GenericModal";
import styled, { css } from "styled-components";
import Room from "./Room";
import WordInputErrors from "../errors/WordInputErrors";
import LoadingSpinner from "../misc/LoadingSpinner";

const Rooms = () => {
    const [socketId, setSocketId] = useState("");
    
    const [rooms, setRooms] = useState([]);
    const [roomNameInput, setRoomNameInput] = useState("");
    const [roomNameInputError, setRoomNameInputError] = useState(false);
    const [searchRoomNameInput, setSearchRoomNameInput] = useState("");
    
    const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
    const [createRoomError, setCreateRoomError] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    
    const [whileCreatingRoom, setWhileCreatingRoom] = useState(false);
    const [whileGettingRooms, setWhileGettingRooms] = useState(true);
    
    const [serverErrorType, setServerErrorType] = useState("error");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        getSocketId();
        getBattleRooms();
        socket.on("auto refresh rooms", rooms => {
            refreshRooms(rooms);
        });
    }, []);

    const getSocketId = () => {
        socket.timeout(3000).emit("get socket id", (err, res) => {
            if (err) {
                triggerErrorModal("error", "Could not connect to the server. Please try again in a moment.");
            } else {
                if (res.status === "ok") {
                    setSocketId(res.socketId);
                } else if (res.status === "error") {
                    triggerErrorModal("error", "The server couldn't get your ID. Please try again in a moment.");
                }
            }
        });
    }

    const refreshRooms = (receivedRooms) => {
        const roomsFromServer = receivedRooms.length ? receivedRooms.map(room => ({
            owner: room[1].owner,
            roomName: room[0],
            roomId: room[1].id,
            participants: room[1].participants
        })) : [];
        setRooms([...roomsFromServer]);
    }

    const triggerErrorModal = (errorType, errorMessage) => {
        setServerErrorType(errorType);
        setErrorModalOpen(true);
        setCreateRoomError(errorMessage);
    }
    
    const getBattleRooms = () => {
        setWhileGettingRooms(true);
        
        socket.timeout(3000).emit("get battle rooms", (err, res) => {
            if (err) {
                triggerErrorModal("error", "Could not connect to the server. Please try again in a moment.");
            } else {
                if (res.status === "ok") {
                    refreshRooms(res.rooms);
                } else if (res.status === "error") {
                    triggerErrorModal("error", "The server couldn't get the rooms. Please try again in a moment.");
                }

            }
            
            setWhileGettingRooms(false);
        });
    }

    const onCloseCreateRoomModal = () => {
        setCreateRoomModalOpen(false);
        setWhileCreatingRoom(false);
        setRoomNameInput("");
        setRoomNameInputError(false);
    }
    
    const createRoom = () => {
        setWhileCreatingRoom(true);

        socket.timeout(3000).emit("create a battle room", roomNameInput, (err, res) => {
            if (err) {
                triggerErrorModal("error", "Could not connect to the server. Please try again in a moment.");
            } else {
                switch(res.status) {
                    case "ok":
                        const joinedRoom = res.rooms.find(room => room[0] === roomNameInput);
                        dispatch(addRoomInfoToJoinedRooms(joinedRoom));
                        navigate(`/arena/${joinedRoom[1].id}`);
                        refreshRooms(res.rooms);
                        break;
                    case "error":
                        triggerErrorModal("error", "The server couldn't create the room. Please try again in a moment.");
                        break;
                    case "warning":
                        triggerErrorModal("warning", res.errorMessage);
                        break;
                    default:
                }
                
            }
            
            onCloseCreateRoomModal();
        });
    }
    
    const checkInputErrors = (input) => {
        if (input.length > 40) {
            setRoomNameInputError("Please keep the room name under 40 characters");
            return true;
        }
        
        if (roomNameInputError) setRoomNameInputError(false);
        return false;
    }

    return (
        <>
            <CreateRoomButton onClick={() => setCreateRoomModalOpen(true)}>CREATE A ROOM</CreateRoomButton>

            <AboveRoomsWrapper>
                <SearchRoomNameInput
                    type="text"
                    placeholder="Search room name"
                    value={searchRoomNameInput}
                    onChange={e => setSearchRoomNameInput(e.target.value)}
                />
                <RefreshRoomsButton onClick={getBattleRooms} disabled={whileGettingRooms}><FiRefreshCw /></RefreshRoomsButton>
            </AboveRoomsWrapper>
            
            <RoomsWrapper $whileGettingRooms={whileGettingRooms}>
                {
                    whileGettingRooms ? <LoadingSpinner customSize={"3em"} /> :
                    rooms.length ?
                    rooms
                        .filter(roomObj => roomObj.roomName.includes(searchRoomNameInput))
                        .map((roomObj) => <Room
                            key={`${roomObj.roomName}-${roomObj.roomId}`}
                            roomName={roomObj.roomName}
                            triggerErrorModal={triggerErrorModal}
                            roomCount={roomObj.participants.length}
                            refreshRooms={refreshRooms}
                            isOwner={roomObj.owner === socketId}
                        />) :
                    <p style={{textAlign: "center"}}>No rooms at the moment. Create one!</p>
                }
            </RoomsWrapper>
            
            <GenericModal
                modalIsOpen={createRoomModalOpen}
                onCloseModalFn={onCloseCreateRoomModal}
            >
                <label htmlFor="roomNameInput">Room name</label>
                {
                    roomNameInputError ? <WordInputErrors errorMsg={roomNameInputError} /> : null
                }
                <RoomNameInput
                    id="roomNameInput"
                    type="text"
                    value={roomNameInput}
                    onChange={e => {
                        const input = e.target.value;

                        if (!checkInputErrors(input)) {
                            setRoomNameInput(input);
                        }
                    }}
                    autoComplete="off"
                />

                <CreateRoomButtonInModal
                    onClick={createRoom}
                    disabled={roomNameInput.length === 0 || roomNameInputError || whileCreatingRoom}
                >
                    {
                        whileCreatingRoom ? <LoadingSpinner /> : "CREATE ROOM"
                    }
                </CreateRoomButtonInModal>
            </GenericModal>

            <ErrorModal
                modalIsOpen={errorModalOpen}
                onCloseModalFn={() => setErrorModalOpen(false)}
                errorType={serverErrorType}
                errorMsg={createRoomError}
            />
        </>
    )
}

export default Rooms;

const CreateRoomButton = styled(GenericButton)`
    margin: 25px 30px;
`

const AboveRoomsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px 30px;
`

const RefreshRoomsButton = styled(GenericIconButton)`
    display: inline-flex;
    font-size: 1.5em;
    transition: transform .5s;

    &:hover {
        transform: rotate(360deg);
    }

    &:active {
        position: relative;
        top: 2px;
    }
`

const RoomsWrapper = styled.div`
    ${({$whileGettingRooms}) => $whileGettingRooms && css`
        display: flex;
        justify-content: center;
        align-items: center;
    `}
    margin: 35px 30px;
    margin-top: 0;
    flex: 1;
    border: 2px solid black;
    border-radius: 5px;
    overflow-y: scroll;
`

const CreateRoomButtonInModal = styled(GenericButton)`
    margin-top: 10px;
`

const RoomNameInput = styled.input`
    margin-top: 10px;
    padding: 12px;
    width: 300px;
    border-style: solid;
    border-width: 1px;
`

const SearchRoomNameInput = styled.input`
    padding: 10px;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    width: 200px;
`