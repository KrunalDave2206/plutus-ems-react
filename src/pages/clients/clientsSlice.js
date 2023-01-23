import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getClients } from "./ClientsAPI";

const initialState = {
    status: null,
    clients: null,
    totalCount: 0
};

export const listClientsAsync = createAsyncThunk(
    'client/list',
    async ({ page, size }) => {
        try {
            const response = await getClients(page, size);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const clientsSlice = createSlice({
    name: 'clients',
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
                    state.clients = [...action.payload.data.clients];
                    state.totalCount = action.payload.data.count
                }
            });
    },
});

// export const { loginFormChange } = projectsSlice.actions;

export const selectStatus = (state) => state.clients.status;
export const selectClients = (state) => state.clients.clients;
export const selectTotalCount = (state) => state.clients.totalCount;

export default clientsSlice.reducer;
