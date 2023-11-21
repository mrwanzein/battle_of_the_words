import { useState } from "react";
import styled from "styled-components";
import Room from "./Room";
import { GenericButton } from "../shared_styles/sharedStyles";
import Modal from "react-modal";
import { centerModalStyles } from "../shared_styles/sharedStyles";
import ModalTopRightXButton from "../modal/ModalTopRightXButton";
import WordInputErrors from "../errors/WordInputErrors";

const modalCustomStyle = {
    content: {
        ...centerModalStyles,
        display: "flex",
        flexDirection: "column"
    }
}

const Rooms = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [roomNameInput, setRoomNameInput] = useState("");
    const [inputError, setInputError] = useState(false);
    
    const onCloseModal = () => {
        setIsOpen(false);
        setRoomNameInput("");
        setInputError(false);
    }
    
    const checkInputErrors = (input) => {
        if (input.length > 40) {
            setInputError("Please keep the room name under 40 characters");
            return true;
        }
        
        if (inputError) setInputError(false);
        return false;
    }

    return (
        <>
            <CreateRoomButton onClick={() => setIsOpen(true)}>CREATE A ROOM</CreateRoomButton>
            <RoomsWrapper>
                {
                    rooms.length ?
                    rooms.map(roomObj => <Room key={roomObj.id} roomName={roomObj.roomName} />) :
                    <p style={{textAlign: "center"}}>No rooms at the moment. Create one!</p>
                }
            </RoomsWrapper>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={onCloseModal}
                style={modalCustomStyle}
            >
                <ModalTopRightXButton onCloseFn={onCloseModal}/>

                <label htmlFor="roomNameInput">Room name</label>
                {
                    inputError ? <WordInputErrors errorMsg={inputError} /> : null
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
                />

                <CreateRoomButtonInModal>CREATE</CreateRoomButtonInModal>
            </Modal>
        </>
    )
}

export default Rooms;

const CreateRoomButton = styled(GenericButton)`
    margin: 25px 30px;
`

const RoomsWrapper = styled.div`
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
    padding: 10px;
    width: 300px;
    border-style: solid;
    border-width: 1px;
`