import styled from "styled-components";
import Room from "./Room";
import { GenericButton } from "../shared_styles/sharedStyles";

const Rooms = () => {
    return (
        <>
            <CreateRoomButton>CREATE A ROOM</CreateRoomButton>
            <RoomsWrapper>
                <Room />
            </RoomsWrapper>
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