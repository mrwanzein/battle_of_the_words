import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentRoom: null
}

export const roomSlice = createSlice({
    name: "roomState",
    initialState,
    reducers: {
        addRoomInfo: (state, action) => {
            state.currentRoom = action.payload;
        }
    }
})

export const {
    addRoomInfo
} = roomSlice.actions;

export default roomSlice.reducer;