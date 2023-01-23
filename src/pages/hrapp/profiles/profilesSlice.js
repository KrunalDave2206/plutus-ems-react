import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getProfiles, postProfiles } from "./profilesAPI";

const initialState = {
    status: null,
    profiles: null,
    totalCount: 0,
    profile: null
};

export const listProfilesAsync = createAsyncThunk(
    'profiles/list',
    async ({ page, size }) => {
        try {
            const response = await getProfiles(page, size);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const postProfilesAsync = createAsyncThunk(
    'profiles/post',
    async (data) => {
        try {
            const response = await postProfiles(data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const profilesSlice = createSlice({
    name: 'profiles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listProfilesAsync.pending, (state) => {
                // state.status = 'loading';
            })
            .addCase(listProfilesAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    state.profiles = [...action.payload.data.profiles];
                    state.totalCount = action.payload.data.count
                }
            })
            .addCase(postProfilesAsync.fulfilled, (state, action) => {

            })
    },
});

// export const { loginFormChange } = projectsSlice.actions;

export const selectStatus = (state) => state.profiles.status;
export const selectProfiles = (state) => state.profiles.profiles;
export const selectProfile = (state) => state.profiles.profile;
export const selectTotalCount = (state) => state.profiles.totalCount;

export default profilesSlice.reducer;
