import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getTasks, getProjectByTaskPrefix } from "./TasksAPI";

import { getProjects } from "../../../services/master/masterAPI";
import { defaultStatus } from "../../projects/projectForm/projectFormSlice";
const deafaultTaskList = { todo: [], inprogress: [], qa: [], done: [] };
const initialState = {
    status: null,
    tasks: { ...deafaultTaskList },
    projects: [],
    selected_project: null,
    board_tasks: null,
    backlog_task: null,
    project_team: null
};

export const listTasksAsync = createAsyncThunk(
    'task/list',
    async ({ project_id, page, size }) => {
        try {
            const response = await getTasks(project_id, page, size);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const listProjectAsync = createAsyncThunk(
    'task/list/projects/',
    async () => {
        try {
            const response = await getProjects();
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getProjectByTaskPrefixAsync = createAsyncThunk(
    'task/get/projects/',
    async ({ task_prefix }) => {
        try {
            const response = await getProjectByTaskPrefix(task_prefix);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
)

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        selectproject: (state, action) => {
            let statuses = action.payload.statuses ? action.payload.statuses.split(',') : [...defaultStatus];
            state.selected_project = { ...action.payload, statuses };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(listTasksAsync.pending, (state) => { })
            .addCase(listTasksAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    state.tasks = action.payload.data
                    let board_tasks = [], backlog_task = [];
                    action.payload.data.forEach(task => {
                        if (task.board == 1) board_tasks.push(task);
                        else backlog_task.push(task);
                    });
                    state.board_tasks = board_tasks
                    state.backlog_task = backlog_task
                }
            })
            .addCase(getProjectByTaskPrefixAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    state.selected_project = { ...action.payload.data.project };
                    state.selected_project.statuses = state.selected_project.statuses.split(',')
                    state.project_team = [...action.payload.data.team];
                }
            })
    }
});

export const { selectproject } = tasksSlice.actions;

export const selectStatus = (state) => state.tasks.status;
export const selectTasks = (state) => state.tasks.tasks;
export const selectBoardTasks = (state) => state.tasks.board_tasks;
export const selectBackLogTasks = (state) => state.tasks.backlog_task;
export const selectProjects = (state) => state.tasks.projects;
export const selectSProject = (state) => state.tasks.selected_project;
export const selectSProjectTeam = (state) => state.tasks.project_team;

export default tasksSlice.reducer;
