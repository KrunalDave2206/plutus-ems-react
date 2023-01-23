import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { postUser, getUser } from "./UserFormAPI";

const initialState = {
    status: null,
    token: null,
    user: null
};
export const postUserAsync = createAsyncThunk(
    'user/post',
    async (data) => {
        try {
            const response = await postUser(data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getUserAsync = createAsyncThunk(
    'user/get',
    async (user_id) => {
        try {
            const response = await getUser(user_id);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const userformSlice = createSlice({
    name: 'userform',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.user = action.payload.data;
                    state.status = null;
                }
            })
            .addCase(postUserAsync.pending, (state) => {  })
            .addCase(postUserAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.user = null;
                    state.status = null;
                }
            });
    },
});

// export const { loginFormChange } = userformSlice.actions;

export const selectStatus = (state) => state.userform.status;
export const selectToken = (state) => state.userform.token;
export const selectUser = (state) => state.userform.user;

export default userformSlice.reducer;
