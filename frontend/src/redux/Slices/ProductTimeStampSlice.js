import { createSlice } from '@reduxjs/toolkit';

const productTimeStampSlice = createSlice({
    name: 'productTimeStamp',
    initialState: {
        timestamp: null
    },
    reducers: {
        setTimestamp: (state, action) => {
            state.timestamp = action.payload;
            console.log("Timestamp updated to: ", state.timestamp);
        }
    }
});

export const { setTimestamp, resetTimestamp } = productTimeStampSlice.actions;
export default productTimeStampSlice.reducer;