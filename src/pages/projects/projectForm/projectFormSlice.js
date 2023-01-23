import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getProject, postProject, putTeam } from "./ProjectFormAPI";
export const defaultStatus = ['todo', 'inprogress', 'qa', 'done'];
const initialState = {
    status: null,
    token: null,
    project: null,
    team: [],
    task_status: [...defaultStatus]
};
export const postProjectAsync = createAsyncThunk(
    'project/post',
    async (data) => {
        try {
            const response = await postProject(data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const putTeamAsync = createAsyncThunk(
    'project/team/post',
    async (data) => {
        try {
            const response = await putTeam(data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getProjectAsync = createAsyncThunk(
    'project/get',
    async (project_id) => {
        try {
            const response = await getProject(project_id);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const projecrformSlice = createSlice({
    name: 'projectform',
    initialState,
    reducers: {
        updateTeam: (state, action) => {
            let i = state.team.indexOf(action.payload);
            if (i > -1) state.team = state.team.filter((t, i) => t != action.payload);
            else state.team = [...state.team, action.payload];
        },
        clearProject: (state, action) => {
            state.project = null;
            state.team = [];
        },
        addStatus: (state, action) => {
            state.task_status.push(action.payload);
        },
        removeStatus: (state, action) => {
            let i = state.task_status.indexOf(action.payload);
            state.task_status.splice(i, 1);
        },
        moveStatus: (state, action) => {
            let f = state.task_status.splice(action.payload.from, 1)[0];
            if (action.payload.to > state.task_status.length) action.payload.to = 0
            else if (action.payload.to < 0) action.payload.to = state.task_status.length;
            state.task_status.splice(action.payload.to, 0, f);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjectAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.project = action.payload.data.project;
                    state.team = action.payload.data.team.map((t, i) => {
                        return t.employee_id
                    });
                    state.task_status = action.payload.data.project.statuses ? action.payload.data.project.statuses.split(',') : [...defaultStatus]
                    state.status = null;
                }
            })
            .addCase(postProjectAsync.pending, (state) => { })
            .addCase(postProjectAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.project = null;
                    state.team = [];
                    state.status = null;
                }
            })
            .addCase(putTeamAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.project = null;
                    state.team = [];
                    state.status = null;
                }
            });
    },
});

export const { updateTeam, clearProject, addStatus, removeStatus, moveStatus } = projecrformSlice.actions;

export const selectStatus = (state) => state.projectform.status;
export const selectToken = (state) => state.projectform.token;
export const selectProject = (state) => state.projectform.project;
export const selectTeam = (state) => state.projectform.team
export const selectTaskStatus = (state) => state.projectform.task_status

export default projecrformSlice.reducer;
