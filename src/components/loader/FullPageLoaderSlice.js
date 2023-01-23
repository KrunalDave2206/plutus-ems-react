import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false
};

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        changeLoading: (state, action) => {
            state.isLoading = action.payload
        }
    },
});

export const { changeLoading } = loadingSlice.actions;

export const selectIsLoading = (state) => state.loading.isLoading;

export default loadingSlice.reducer;