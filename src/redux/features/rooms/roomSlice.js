import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentRoom: null
}

export const roomSlice = createSlice({
    name: "roomState",
    initialState,
    reducers: {
        updateRoomInfo: (state, action) => {
            state.currentRoom = action.payload;
        },
        resetRoomState: () => {
            return initialState;
        }
    }
})

export const {
    updateRoomInfo,
    resetRoomState
} = roomSlice.actions;

export default roomSlice.reducer;