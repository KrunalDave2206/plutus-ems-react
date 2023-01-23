import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getInterviews, postInterviewsFeedback } from "./InterviewAPI";

const initialState = {
    status: null,
    interviews: null,
    totalCount: 0,
    fromDate: new Date().getTime(),
    toDate: new Date().getTime()
};

export const listInterviewAsync = createAsyncThunk(
    'interview/list',
    async ({ month }) => {
        try {
            const response = await getInterviews(month);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);
export const postInterviewFeedbackAsync = createAsyncThunk(
    'interview/feedback',
    async (data) => {
        try {
            const response = await postInterviewsFeedback(data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const interviewSlice = createSlice({
    name: 'interview',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listInterviewAsync.pending, (state) => { })
            .addCase(listInterviewAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    state.interviews = [...action.payload.data.interviews];
                    // state.totalCount = action.payload.data.count
                }
            })
            .addCase(postInterviewFeedbackAsync.fulfilled, (state, action) => {

             })
    },
});

// export const { loginFormChange } = interviewSlice.actions;

export const selectStatus = (state) => state.interview.status;
export const selectInterviews = (state) => state.interview.interviews;
export const selectTotalCount = (state) => state.interview.totalCount;
export const selectMonth = (state) => {
    let fd = new Date(state.interview.toDate);
    let y = fd.getFullYear(), m = (fd.getMonth() + 1);
    return `${y}-${m < 10 ? '0' + m : m}`
};

export const selectToDay = (state) => {
    let fd = new Date(state.interview.toDate);
    let y = fd.getFullYear(), m = (fd.getMonth() + 1);
    return `${y}-${m < 10 ? '0' + m : m}-${fd.getDate()}`
};

export default interviewSlice.reducer;
