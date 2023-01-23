import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getUsersTrackedTime, getUsersTrackedActivity, deleteUsersTrackedActivity } from "./TimeTrackerAPI";

const initialState = {
    status: null,
    token: null,
    timetracked: null,
    activity: null,
    activityImage: null,
    isDESC: true
};

export const getUsersTrackedTimeAsync = createAsyncThunk(
    'timetracked/get',
    async ({ date, all }) => {
        try {
            const response = await getUsersTrackedTime(date, all);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getUsersTrackedActivityAsync = createAsyncThunk(
    'activitytracked/get',
    async ({ emp_id, date }) => {
        try {
            const response = await getUsersTrackedActivity(emp_id, date);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const deleteUsersTrackedActivityAsync = createAsyncThunk(
    'activitytracked/delete',
    async ({ act_id, date }) => {
        try {
            const response = await deleteUsersTrackedActivity(act_id, date);
            if (response.status == 0) return { ...response, act_id };
            else return { ...response.data, act_id };
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const timeTrackedSlice = createSlice({
    name: 'timetracked',
    initialState,
    reducers: {
        changeStatus: (state) => {
            state.status = null;
        },
        activityASC: (state) => {
            state.activity = state.activity.sort((a, b) => {
                return a.start_time - b.start_time;
            })
            state.isDESC = false;
        },
        activityDesc: (state) => {
            state.activity = state.activity.sort((a, b) => {
                return b.start_time - a.start_time;
            })
            state.isDESC = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsersTrackedTimeAsync.fulfilled, (state, action) => {
                if (action.payload.status == 1) {
                    for (const act of action.payload.data)
                        act.activity = parseInt(act.activity)

                    action.payload.data = action.payload.data.sort((a, b) => a.emp_name > b.emp_name ? 1 : -1)
                    state.timetracked = action.payload.data
                }
            })
            .addCase(getUsersTrackedActivityAsync.fulfilled, (state, action) => {
                console.log('getUsersTrackedActivityAsync', action.payload)
                if (action.payload.status == 1) {
                    state.status = action.payload.status
                    // let projectList = [];
                    for (const act of action.payload.data) {
                        act.start_time = new Date(act.start_time)
                        act.end_time = new Date(act.end_time)
                        act.start = act.start_time.toLocaleTimeString('en-US');//.split(', ')[1];
                        act.end = act.end_time.toLocaleTimeString('en-US');//.split(', ')[1];
                        act.active = act.active.slice(-5)
                        act.total = act.total.slice(-5)
                        // projectList.push(act.project_name);
                    }
                    // console.log('action.payload.data', action.payload.data);
                    state.activity = action.payload.data;
                }
                else if (action.payload.status == 0) {
                    state.status = action.payload.status
                }
            })
            .addCase(deleteUsersTrackedActivityAsync.fulfilled, (state, action) => {
                let index = -1;
                for (const i in state.activity) {
                    if (Object.hasOwnProperty.call(state.activity, i)) {
                        const element = state.activity[i];
                        if (element.id == action.payload.act_id) index = i
                    }
                }
                if (index > -1) {
                    state.activity.splice(index, 1);
                }
            })
    },
});


export const { changeStatus, activityASC, activityDesc } = timeTrackedSlice.actions;

export const selectStatus = (state) => state.timetracked.status;
export const selectUsersTimeTracked = (state) => state.timetracked.timetracked
export const selectUsersActivityTracked = (state) => state.timetracked.activity
export const selectUsersActivityisDESC = (state) => state.timetracked.isDESC


export default timeTrackedSlice.reducer;