import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getCandidates, postCandidates, getCandidate, postInterview, getInterview } from "./candidatesAPI";


export const dummyCandidate = {
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    contact_number: '',
    alternate_contact_number: '',
    gender: '',
    marital_status: '',
    profile_id: '',
    resume: '',
    work_from: '',
    job_description: '',
    current_ctc: '',
    expected_ctc: '',
    current_location: '',
    preferred_location: '',
    total_experience: '',
    relevant_experience: '',
    source: '',
    communication: '',
    notes: '',
    notice_period: '',
    reason_for_change: '',
    hr: ''
}

const initialState = {
    status: null,
    candidates: [],
    candidate: { ...dummyCandidate },
    totalCount: 0,
    interviePanel: [],
    displayInterviews: [],
    displayInterviePanel: [],
};

export const listCandidatesAsync = createAsyncThunk(
    'candidates/list',
    async ({ page, size, searchKey }) => {
        try {
            const response = await getCandidates(page, size, searchKey);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getCandidateAsync = createAsyncThunk(
    'candidates/get',
    async ({ candidate_id }) => {
        try {
            const response = await getCandidate(candidate_id);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const postCandidatesAsync = createAsyncThunk(
    'candidates/post',
    async (data) => {
        try {
            const response = await postCandidates(data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);
export const postInterviewAsync = createAsyncThunk(
    'candidates/Interview/post',
    async (data) => {
        try {
            const response = await postInterview(data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getInterviewAsync = createAsyncThunk(
    'candidates/Interview/get',
    async ({ candidate_id }) => {
        try {
            const response = await getInterview(candidate_id);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const candidatesSlice = createSlice({
    name: 'candidates',
    initialState,
    reducers: {
        updateCandidate: (state, action) => { state.candidate = action.payload },
        clearCandidate: (state, action) => { state.candidate = { ...dummyCandidate } },
        updateInterviewPanel: (state, action) => {
            let i = state.interviePanel.indexOf(action.payload);
            if (i > -1) state.interviePanel = state.interviePanel.filter((t, i) => t != action.payload);
            else state.interviePanel = [...state.interviePanel, action.payload];
        },
        replaceInterviewPanel: (state, action) => {
            state.interviePanel = [...action.payload];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(listCandidatesAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    state.candidates = [...action.payload.data.candidates];
                    state.totalCount = action.payload.data.count
                }
            })
            .addCase(postCandidatesAsync.fulfilled, (state, action) => { state.candidate = { ...dummyCandidate } })
            .addCase(getCandidateAsync.fulfilled, (state, action) => { state.candidate = { ...action.payload.data.candidate } })
            .addCase(postInterviewAsync.fulfilled, (state, action) => { state.interviePanel = [] })
            .addCase(getInterviewAsync.fulfilled, (state, action) => {
                state.displayInterviews = [...action.payload.data.interviews]
                state.displayInterviePanel = [...action.payload.data.panel]
            })
    },
});

export const { updateCandidate, clearCandidate, updateInterviewPanel, replaceInterviewPanel } = candidatesSlice.actions;

export const selectStatus = (state) => state.candidates.status;
export const selectCandidates = (state) => state.candidates.candidates;
export const selectCandidate = (state) => state.candidates.candidate;
export const selectTotalCount = (state) => state.candidates.totalCount;
export const selectInterviePanel = (state) => state.candidates.interviePanel;
export const selectIntervieDisplay = (state) => {
    return { interviews: state.candidates.displayInterviews, panel: state.candidates.displayInterviePanel }
};

export default candidatesSlice.reducer;
