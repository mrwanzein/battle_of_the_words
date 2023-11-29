import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    joinedRooms: []
}

export const roomSlice = createSlice({
    name: "roomState",
    initialState,
    reducers: {
        addRoomInfoToJoinedRooms: (state, action) => {
            state.joinedRooms.push(action.payload);
        }
    }
})

export const {
    addRoomInfoToJoinedRooms
} = roomSlice.actions;

export default roomSlice.reducer;