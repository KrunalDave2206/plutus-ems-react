import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsersReport } from './ReportsAPI';

const dd = new Date()
const initialState = {
    reportCount: 0,
    users: [],
    activity: {},

    tsMonth: dd.getMonth(),
    tsYear: dd.getFullYear()
}

export const listUsersReportAsync = createAsyncThunk(
    'report/user',
    async ({ date }) => {
        try {
            const response = await getUsersReport(date);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        changeTsMonth: (state, action) => { state.tsMonth = action.payload; },
        changeTsYear: (state, action) => { state.tsYear = action.payload; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(listUsersReportAsync.fulfilled, (state, action) => {
                  
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    let userIds = [];
                    let users = [];
                    let leaveUsers = [];
                    let activity = {};
                    let leave = {};
                  
                    for (const rep of action.payload.data.rows) {
                    
                        if (userIds.indexOf(rep.id) == -1) {
                            userIds.push(rep.id)
                            users.push({ id: rep.id, name: `${rep.first_name} ${rep.last_name}`, work_from: rep.work_preference })
                        }
                        if (!activity[rep.id]) activity[rep.id] = {}
                        if (rep.start_time && !activity[rep.id][rep.start_time]) activity[rep.id][rep.start_time] = { total: rep.total, activity: rep.activity };
                   
                    }
                    for(const rep1 of action.payload.data.leave)
                    {
                        // console.log(userIds.indexOf(rep1.id));

                            // users.push({id:rep1.id, leave:rep1.leaves, date:rep1.from_date})
                            if (!leave[rep1.id]) leave[rep1.id] = {}
                            if (rep1.from_date.slice(0,10) && !leave[rep1.id][rep1.from_date.slice(0,10)]) leave[rep1.id][rep1.from_date.slice(0,10)] = { leave: rep1.leaves , halfLeave:rep1.total_days, half_day: rep1.half_day};
                      
                        }
                        
                   
                    state.users = users;
                    state.activity = activity
                    state.leave = leave
                }
            })
    }
})

export const { changeTsMonth, changeTsYear } = reportsSlice.actions;

export const selectUser = (state) => state.reports.users;
export const selectActivity = (state) => state.reports.activity;
export const selectLeaveData = (state) => state.reports.leave;
export const selectTsMonth = (state) => state.reports.tsMonth;
export const selectTsYear = (state) => state.reports.tsYear;

export default reportsSlice.reducer;