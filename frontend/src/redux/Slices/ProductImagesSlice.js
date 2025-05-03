import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
};

export const productImageSlice = createSlice({
  name: 'productImages',
  initialState,
  reducers: {
    setProductImages: (state, action) => {
      // Loop through each key-value pair in the new payload
      for (const key in action.payload) {
        if (action.payload.hasOwnProperty(key)) {
          // If the key already exists, append the new images to the existing ones
          if (state.value[key]) {
            state.value[key].additionalImages = [
              ...state.value[key].additionalImages,
              ...action.payload[key].additionalImages
            ];
          } else {
            // If the key doesn't exist, simply assign the value
            state.value[key] = action.payload[key];
          }
        }
      }
    },
  },
});

export const { setProductImages } = productImageSlice.actions;

export default productImageSlice.reducer;
