import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getProjects } from "./ProjectsAPI";

const initialState = {
    status: null,
    projects: null,
    projectCount: 0
};

export const listProjectsAsync = createAsyncThunk(
    'projects/list',
    async ({ page, size, name, client_id, team }) => {
        try {
            const response = await getProjects(page, size, name, client_id, team);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listProjectsAsync.pending, (state) => {
                // state.status = 'loading';
            })
            .addCase(listProjectsAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    if (action.payload.data){
                        state.projects = [...action.payload.data.projects];
                        state.projectCount = action.payload.data.count
                    }
                }
            });
    },
});

// export const { loginFormChange } = projectsSlice.actions;

export const selectStatus = (state) => state.projects.status;
export const selectToken = (state) => state.projects.token;
export const selectProjects = (state) => state.projects.projects;
export const selectProjectCount = (state) => state.projects.projectCount;

export default projectsSlice.reducer;
