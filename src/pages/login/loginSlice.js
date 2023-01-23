import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { postLogin } from "./LoginAPI";

const initialState = {
    status: null,
    token: null
};

export const loginAsync = createAsyncThunk(
    'login/postLogin',
    async (data) => {
        try {
            const response = await postLogin(data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                // state.status = 'loading';
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    let user = action.payload.data;
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('token', user.token);
                    state.status = null;
                    state.token = user.token;
                }
            });
    },
});

export const { loginFormChange } = loginSlice.actions;

export const selectStatus = (state) => state.login.status;
// export const selectToken = (state) => state.login.token;
export const selectToken = (state) => localStorage.getItem('token');

export default loginSlice.reducer;
