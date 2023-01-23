import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getUsers, delUser } from "./UsersAPI";

const initialState = {
    status: null,
    token: null,
    users: null,
    userCount: 0,
    deleteApiResponse: null
};

export const listUsersAsync = createAsyncThunk(
    'emp/',
    async ({ page, size, searchKey, showBlocked }) => {
        try {
            const response = await getUsers(page, size, searchKey, showBlocked);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const delUserAsync = createAsyncThunk(
    'emp/del',
    async ({ user_id, data }) => {
        try {
            const response = await delUser(user_id, data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearApiRes: (state) => {
            state.deleteApiResponse = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(listUsersAsync.pending, (state) => {
                // state.status = 'loading';
            })
            .addCase(listUsersAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    state.users = [...action.payload.data.users];
                    state.userCount = action.payload.data.count;
                }
            })
            .addCase(delUserAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.deleteApiResponse = action.payload.message;
                else state.deleteApiResponse = 1;
            });
    },
});

export const { clearApiRes } = usersSlice.actions;

export const selectStatus = (state) => state.users.status;
export const selectToken = (state) => state.users.token;
export const selectUsers = (state) => state.users.users;
export const selectUserCount = (state) => state.users.userCount;
export const selectdelUserRes = (state) => state.users.deleteApiResponse;

export default usersSlice.reducer;
