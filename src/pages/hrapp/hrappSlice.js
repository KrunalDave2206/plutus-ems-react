import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getProjects } from "./HrappAPI";

const initialState = {
    status: null,
    clients: null
};

export const listClientsAsync = createAsyncThunk(
    'projects/',
    async ({ page, size }) => {
        try {
            const response = await getProjects(page, size);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const hrappSlice = createSlice({
    name: 'hrapp',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listClientsAsync.pending, (state) => {
                // state.status = 'loading';
            })
            .addCase(listClientsAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    state.clients = [...action.payload.data];
                }
            });
    },
});

// export const { loginFormChange } = projectsSlice.actions;

export const selectStatus = (state) => state.hrapp.status;
export const selectClients = (state) => state.hrapp.clients;

export default hrappSlice.reducer;
