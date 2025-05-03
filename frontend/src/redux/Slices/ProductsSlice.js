import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
};

export const prdouctSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductsState: (state,value) => {
      state.value = [...state.value, ...value.payload];
    },
  },
});

export const { setProductsState } = prdouctSlice.actions

export default prdouctSlice.reducer