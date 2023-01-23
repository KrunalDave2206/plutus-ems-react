import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getProjects } from "./ProjectAPI";

const initialState = {
    status: null,
    projects: null
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

export const projectSlice = createSlice({
    name: 'project',
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
                    if (action.payload.data)
                        state.projects = [...action.payload.data];
                }
            });
    },
});

// export const { loginFormChange } = projectsSlice.actions;

export const selectStatus = (state) => state.project.status;
export const selectToken = (state) => state.project.token;
export const selectProjects = (state) => state.project.projects;

export default projectSlice.reducer;
