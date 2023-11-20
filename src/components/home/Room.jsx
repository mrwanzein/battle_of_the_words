import styled from "styled-components";
import { JoinRoomButtonGeneric } from "../shared_styles/sharedStyles";

const Room = () => {
    return (
        <RoomWrapper>
            <RoomContentWrapper>
                <HostAndOpponentWrapper>
                    <RoomsName>Rooms name</RoomsName>
                </HostAndOpponentWrapper>

                <JoinRoomButtonRoomsArea>JOIN ROOM</JoinRoomButtonRoomsArea>
            </RoomContentWrapper>
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

const JoinRoomButtonRoomsArea = styled(JoinRoomButtonGeneric)`
    margin: 10px;
    margin-left: auto;
    font-size: .8em;
    padding: 10px 25px;
`

const RoomsName = styled.span`
    margin: 0 15px;
`