import { useState, useEffect } from "react";
import { GenericButton, GenericIconButton } from "../shared_styles/sharedStyles";
import { socket } from "../../services/socket";
import { FiRefreshCw } from "react-icons/fi";
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
import ErrorModal from "../modals/ErrorModal";
import GenericModal from "../modals/GenericModal";
import styled, { css } from "styled-components";
import Room from "./Room";
import WordInputErrors from "../errors/WordInputErrors";
import LoadingSpinner from "../misc/LoadingSpinner";

const Rooms = () => {
    const [socketId, setSocketId] = useState("");
    
    const [rooms, setRooms] = useState([]);
    const [roomParams, setRoomParams] = useState({
        roomName: "",
        inputAmount: 3,
        maxHealth: 50,
        wordExpireTime: 15,
        language: "english"
    });
    const [roomNameInputError, setRoomNameInputError] = useState(false);
    const [searchRoomNameInput, setSearchRoomNameInput] = useState("");
    
    const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
    const [createRoomErrorMsg, setCreateRoomErrorMsg] = useState("");
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [serverErrorType, setServerErrorType] = useState("error");
    
    const [whileCreatingRoom, setWhileCreatingRoom] = useState(false);
    const [whileGettingRooms, setWhileGettingRooms] = useState(true);
    
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
            participants: room[1].participants,
            roomParams: room[1].roomParams
        })) : [];
        setRooms([...roomsFromServer]);
    }

    const triggerErrorModal = (errorType, errorMessage) => {
        setServerErrorType(errorType);
        setErrorModalOpen(true);
        setCreateRoomErrorMsg(errorMessage);
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
        setRoomParams({
            roomName: "",
            inputAmount: 3,
            maxHealth: 50,
            wordExpireTime: 15,
            language: "english"
        });
        setRoomNameInputError(false);
    }
    
    const createRoom = () => {
        setWhileCreatingRoom(true);

        socket.timeout(3000).emit("create a battle room", roomParams, (err, res) => {
            if (err) {
                triggerErrorModal("error", "Could not connect to the server. Please try again in a moment.");
            } else {
                switch(res.status) {
                    case "ok":
                        const joinedRoom = res.rooms.find(room => room[0] === roomParams.roomName);
                        
                        dispatch(setIsInOnlineBattle(true));
                        dispatch(updateRoomInfo(joinedRoom));
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
    
    const checkRoomNameErrors = (input) => {
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
                    id="searchRoomNameInput"
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
                            roomParams={roomObj.roomParams}
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
                    value={roomParams.roomName}
                    onChange={e => {
                        const input = e.target.value;

                        if (!checkRoomNameErrors(input)) {
                            setRoomParams(state => ({
                                ...state,
                                roomName: input
                            }));
                        }
                    }}
                    onKeyDown={e => {
                        if (e.code === "Enter") {
                            if (roomParams.length !== 0 && !roomNameInputError && !whileCreatingRoom) createRoom();
                        }
                    }}
                    autoComplete="off"
                    autoFocus
                />

                <InputAmountLabel htmlFor="attackInputAmount">Amount of inputs <InputAmountDisplay>{roomParams.inputAmount}</InputAmountDisplay></InputAmountLabel>
                <InputAmount
                    id="attackInputAmount"
                    type="range"
                    value={roomParams.inputAmount}
                    min={3}
                    max={5}
                    onChange={e => {
                        const amount = Number(e.target.value);
                        
                        dispatch(setAmountOfInput(amount));
                        setRoomParams(state => ({
                            ...state,
                            inputAmount: amount
                        }));
                    }}
                />

                <MaxHealthAmountLabel htmlFor="MaxHealthAmount">Max health <MaxHealthAmountDisplay>{roomParams.maxHealth}</MaxHealthAmountDisplay></MaxHealthAmountLabel>
                <MaxHealthAmount
                    id="MaxHealthAmount"
                    type="range"
                    value={roomParams.maxHealth}
                    min={50}
                    max={120}
                    onChange={e => {
                        const amount = Number(e.target.value);
                        
                        dispatch(setMaxHealth(amount));
                        setRoomParams(state => ({
                            ...state,
                            maxHealth: amount
                        }));
                    }}
                />

                <WordExpireTimeLabel htmlFor="WordExpireTimeAmount">Word expiration time <WordExpireTimeAmountDisplay>{roomParams.wordExpireTime}</WordExpireTimeAmountDisplay></WordExpireTimeLabel>
                <WordExpireTimeAmount
                    id="WordExpireTimeAmount"
                    type="range"
                    value={roomParams.wordExpireTime}
                    min={5}
                    max={25}
                    onChange={e => {
                        const amount = Number(e.target.value);
                        
                        dispatch(setWordExpireTime(amount));
                        setRoomParams(state => ({
                            ...state,
                            wordExpireTime: amount
                        }));
                    }}
                />

                <LanguageLabel htmlFor="PlayingLanguage">Language</LanguageLabel>
                <PlayingLanguage
                    id="PlayingLanguage"
                    name="PlayingLanguage"
                    onChange={e => {
                        const languageVal = e.target.value;

                        dispatch(setPlayingLanguage(languageVal));
                        setRoomParams(state => ({
                            ...state,
                            language: languageVal
                        }));
                    }}
                >
                    <option value="english">English</option>
                    <option value="french">Français</option>
                    <option value="spanish">Español</option>
                </PlayingLanguage>

                <CreateRoomButtonInModal
                    onClick={createRoom}
                    disabled={roomParams.roomName.length === 0 || roomNameInputError || whileCreatingRoom}
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
                errorMsg={createRoomErrorMsg}
            />
        </>
    )
}

export default Rooms;

const CreateRoomButton = styled(GenericButton)`
    margin: 25px 30px;
    font-family: rexlia;
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
    margin-top: 25px;
`

const RoomNameInput = styled.input`
    margin: 10px 0;
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

const InputAmountLabel = styled.label`
    margin-top: 20px;
`

const InputAmount = styled.input`
    margin: 15px 0;
`

const InputAmountDisplay = styled.span`
    float: right;
`

const MaxHealthAmountLabel = styled.label`
    margin-top: 20px;
`

const MaxHealthAmount = styled.input`
    margin: 15px 0;
`

const MaxHealthAmountDisplay = styled.span`
    float: right;
`

const WordExpireTimeLabel = styled.label`
    margin-top: 20px;
`

const WordExpireTimeAmount = styled.input`
    margin: 15px 0;
`

const WordExpireTimeAmountDisplay = styled.span`
    float: right;
`

const LanguageLabel = styled.label`
    margin-top: 20px;
`

const PlayingLanguage = styled.select`
    padding: 5px;
    margin: 15px 0;
    border: 2px solid black;
`