import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postUser, getUser, getUserWithProjects, getProfile, getUsersTrackedTime, postChangePassword, putChangeWorkPreference } from "./UserFormAPI";

const initialState = {
    status: null,
    token: null,
    user: null,
    users_projects: null,
    prfoile: null,
    timetracked: null
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

export const putWorkPreferenceAsync = createAsyncThunk(
    'work_preference/put',
    async (data) => {
        try {
            const response = await putChangeWorkPreference(data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const postChangePasswordAsync = createAsyncThunk(
    'user/changepassword/post',
    async (data) => {
        try {
            const response = await postChangePassword(data);
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

export const getUsersTrackedTimeAsync = createAsyncThunk(
    'user/trackedtime/get',
    async (user_id) => {
        try {
            const response = await getUsersTrackedTime();
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getProfileAsync = createAsyncThunk(
    'profile/get',
    async (user_id) => {
        try {
            const response = await getProfile(user_id);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getUsersProjectsAsync = createAsyncThunk(
    'user/get/see/projects',
    async () => {
        try {
            const response = await getUserWithProjects();
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
    reducers: {
        clearUserForm: (state) => { state.user = null; },
        clearStatus: (state) => { state.status = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.user = action.payload.data;
                    if (!state.user.permissions) state.user.permissions = [];
                    else state.user.permissions = JSON.parse(state.user.permissions);
                    state.status = null;
                }
            })
            .addCase(putWorkPreferenceAsync.fulfilled, (state) => { 
                
            })
            .addCase(postUserAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.data[0].msg;
                else {
                    state.user = null;
                    state.status = 1;
                }
            })
            .addCase(getProfileAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.profile = action.payload.data;
                    state.status = null;
                }
            })
            .addCase(getUsersProjectsAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    let data = {};
                    // action.payload.data.forEach(t => {
                    for (let t of action.payload.data) {
                        if (!data[t.employee]) data[t.employee] = [];
                        // if (t.project_name) data[t.employee].push(`<span>${t.project_name}<br/>${t.project_manager}</span>`)
                        // if (t.project_name) data[t.employee].push(`${t.project_name}${t.project_manager ? ` (${t.project_manager})` : ''}`)
                        if (t.project_name) data[t.employee].push({ project_name: t.project_name, project_manager: t.project_manager })
                    }
                    // })
                    let fData = [];
                    for (let d in data) {
                        fData.push({ employee: d, project_name: data[d] })
                    }
                    state.users_projects = fData;
                    state.status = null;
                }
            })
            .addCase(getUsersTrackedTimeAsync.fulfilled, (state, action) => {
                state.timetracked = action.payload.data
            })
            .addCase(postChangePasswordAsync.fulfilled, (state, action) => {
                
            })
    },
});

export const { clearUserForm, clearStatus } = userformSlice.actions;

export const selectStatus = (state) => state.userform.status;
export const selectToken = (state) => state.userform.token;
export const selectUser = (state) => state.userform.user;
export const selectProfile = (state) => state.userform.profile;
export const selectUsersProjects = (state) => state.userform.users_projects;
export const selectUsersTimeTracked = (state) => state.userform.timetracked

export default userformSlice.reducer;
