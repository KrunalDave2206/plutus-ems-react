import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getClient, postClient } from "./ClientFormAPI";

const initialState = {
    status: null,
    token: null,
    client: null,
};
export const postClientAsync = createAsyncThunk(
    'client/post',
    async (data) => {
        try {
            const response = await postClient(data);
            if (response.status == 0) return response; else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getClientAsync = createAsyncThunk(
    'client/get',
    async (project_id) => {
        try {
            const response = await getClient(project_id);
            if (response.status == 0) return response; else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const clientformSlice = createSlice({
    name: 'clientform',
    initialState,
    reducers: {
        clearClient: (state) => {
            state.client = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getClientAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.client = action.payload.data;
                    state.status = null;
                }
            })
            .addCase(postClientAsync.pending, (state) => { })
            .addCase(postClientAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.client = null;
                    state.status = null;
                }
            });
    },
});

export const { clearClient } = clientformSlice.actions;

export const selectStatus = (state) => state.clientform.status;
export const selectClient = (state) => state.clientform.client;

export default clientformSlice.reducer;
