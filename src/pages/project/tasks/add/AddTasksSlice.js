import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getTask, getTaskByNumber, addTask, addTaskComment, deleteTaskComment, listTaskComment, listTaskHistory, addTaskCWorklog, listTaskWorklog } from "./AddTasksAPI";

const dummyTask = {
    title: "",
    description: "",
    asignee: "",
    project_id: ""
}
const dummyComment = {
    comment: "",
    employee_id: ""
}

export const dummyWorkLog = {
    detail: '',
    employee_id: '',
    hours: '',
    minutes: '',
    log_date: '',
    priority: 'low'
}

const initialState = {
    status: null,
    task: { ...dummyTask },
    displayTask: null,
    comments: null,
    comment: { ...dummyComment },
    history: null,
    workLogs: null,
    worklog: { ...dummyWorkLog }
};

export const getTaskAsync = createAsyncThunk(
    'addtask/get',
    async ({ task_id }) => {
        try {
            const response = await getTask(task_id);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getTaskByNumberAsync = createAsyncThunk(
    'addtask/getbynumber',
    async ({ task_id }) => {
        try {
            const response = await getTaskByNumber(task_id);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const postTaskAsync = createAsyncThunk(
    'addtask/post',
    async (data) => {
        try {
            const response = await addTask(data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const lisrCommentAsync = createAsyncThunk(
    'comment/get',
    async ({ task_id }) => {
        try {
            const response = await listTaskComment(task_id);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const postCommentAsync = createAsyncThunk(
    'comment/post',
    async ({ task_id, data }) => {
        try {
            const response = await addTaskComment(task_id, data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const deleteCommentAsync = createAsyncThunk(
    'comment/delete',
    async ({ comment_id }) => {
        try {
            const response = await deleteTaskComment(comment_id);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const lisrTaskHistoryAsync = createAsyncThunk(
    'history/get',
    async ({ task_id }) => {
        try {
            const response = await listTaskHistory(task_id);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
)

export const postWorkLogAsync = createAsyncThunk(
    'worklog/post',
    async ({ task_id, data }) => {
        try {
            const response = await addTaskCWorklog(task_id, data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);;

export const lisrWorkLogAsync = createAsyncThunk(
    'worklog/list',
    async ({ task_id }) => {
        try {
            const response = await listTaskWorklog(task_id);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const addTasksSlice = createSlice({
    name: 'addtask',
    initialState,
    reducers: {
        setProject: (state, action) => {
            state.task.project_id = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTaskAsync.pending, (state) => { })
            .addCase(getTaskAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0) state.status = action.payload.message;
                else {
                    state.status = null;
                    state.displayTask = action.payload.data[0]
                }
            })
            .addCase(getTaskByNumberAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0) state.status = action.payload.message;
                else {
                    state.status = null;
                    state.displayTask = action.payload.data[0]
                }
            })
            .addCase(postTaskAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0) state.status = action.payload.message;
                else {
                    state.status = null;
                    state.task = { ...dummyTask };
                }
            })
            .addCase(lisrCommentAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0) state.status = action.payload.message;
                else {
                    state.status = null;
                    state.comments = action.payload.data;
                }
            })
            .addCase(postCommentAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0) state.status = action.payload.message;
                else {
                    state.status = null;
                    state.comment = { ...dummyComment };
                }
            })
            .addCase(lisrTaskHistoryAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0) state.status = action.payload.message;
                else {
                    state.status = null;
                    state.history = action.payload.data;
                }
            })
            .addCase(lisrWorkLogAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0) state.status = action.payload.message;
                else {
                    state.status = null;
                    state.workLogs = action.payload.data;
                }
            })
            .addCase(postWorkLogAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0) state.status = action.payload.message;
                else {
                    state.status = null;
                    state.worklog = { ...dummyWorkLog }
                }
            })
    }
});

export const { setProject } = addTasksSlice.actions;

export const selectStatus = (state) => state.addtask.status;
export const selectTask = (state) => state.addtask.task;
export const selectTasktoDisplay = (state) => state.addtask.displayTask
export const selectCommentList = (state) => state.addtask.comments
export const selectComment = (state) => state.addtask.comment
export const selectHistory = (state) => state.addtask.history
export const selectWorkLogList = (state) => state.addtask.workLogs
export const selectWorkLog = (state) => state.addtask.workLog || dummyWorkLog

export default addTasksSlice.reducer;
