import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getNextQuestion, postCandidate, getResult } from "./CareerAPI";
import { shuffle } from "../../services/utils";
const initialState = {
    status: null,
    question: null,
    answer: null,
    result: null,
    candidate: localStorage.getItem('cad_token') || null,
    cadeName: localStorage.getItem('cad_name') || null,
    count: null,
    fromEndDate: null,
    apiIsOn: false
};

export const getNextQuestionAsync = createAsyncThunk(
    'hirecareer/question/get',
    async ({ candidate_id, data }) => {
        try {
            const response = await getNextQuestion(candidate_id, data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const postCandidateAsync = createAsyncThunk(
    'hirecareer/apply/post',
    async (data) => {
        try {
            const response = await postCandidate(data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getResultAsync = createAsyncThunk(
    'hirecareer/result/get',
    async ({ candidate_id }) => {
        try {
            const response = await getResult(candidate_id);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const hirecareerSlice = createSlice({
    name: 'hirecareer',
    initialState,
    reducers: {
        setAnswer: (state, action) => {
            state.answer = { ...action.payload }
        },
        logOut: (state) => {
            state.candidate = null
            state.cadeName = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNextQuestionAsync.pending, (state) => {
                state.apiIsOn = true;
            })
            .addCase(getNextQuestionAsync.fulfilled, (state, action) => {
                state.apiIsOn = false;
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    if (action.payload.data) {
                        let question = action.payload.data.question;
                        if (question && question.answers) {
                            question.answers = JSON.parse(question.answers);
                            question.answers = shuffle(question.answers);
                        }
                        state.question = question;
                        state.answer = null;
                        state.count = action.payload.data.count;
                    }
                }
            })
            .addCase(postCandidateAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    let user = action.payload.data;
                    localStorage.setItem('cad_user', JSON.stringify(user));
                    localStorage.setItem('cad_token', user.candidate_id);
                    localStorage.setItem('cad_name', user.first_name + ' ' + user.last_name);
                    state.candidate = user.candidate_id
                    state.cadeName = user.first_name + ' ' + user.last_name
                    state.status = null;
                }
            })
            .addCase(getResultAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    let types = [];
                    let types_question = []
                    let summary = { Total: { total: 0, pass: 0 } };

                    if (action.payload.data && action.payload.data.questions)
                        for (let index = 0; index < action.payload.data.questions.length; index++) {
                            const que = action.payload.data.questions[index];
                            if (types.indexOf(que.type) == -1) types.push(que.type);
                            if (!types_question[que.type]) types_question[que.type] = []
                            types_question[que.type].push(que);
                            if (!summary[que.type]) summary[que.type] = { total: 0, pass: 0 };
                            summary[que.type].total++;
                            summary['Total'].total++;
                            if (que.correct_ans == que.answer) {
                                summary[que.type].pass++;
                                summary['Total'].pass++;
                            }
                            if (index == action.payload.data.questions.length - 1) {
                                let start = action.payload.data.detail.created_at
                                let end = que.updated_at
                                let diff = '';
                                if (start && end) {
                                    start = new Date(start);
                                    end = new Date(end);
                                    let diffMs = (end - start);
                                    let diffDays = Math.floor(diffMs / 86400000); // days
                                    let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
                                    let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                                    // diff = diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes";
                                    diff = diffHrs + " hours, " + diffMins + " minutes";
                                }
                                state.fromEndDate = {
                                    start_date: action.payload.data.detail.created_at,
                                    end_date: que.updated_at,
                                    diff: diff
                                }
                            }
                        }

                    let interviews = [];
                    if (action.payload.data && action.payload.data.interview) {
                        let round = {};
                        for (let index = 0; index < action.payload.data.interview.length; index++) {
                            const inter = action.payload.data.interview[index];
                            if (!round[inter.round]) round[inter.round] = [];
                            round[inter.round].push(inter);
                        }
                        for (const iterator in round) {
                            interviews.push({ round: iterator, datetime: round[iterator][0].datetime, interview: round[iterator] })
                        }
                    }
                    state.result = {
                        types: types,
                        summary: summary,
                        types_question: types_question,
                        questions: action.payload.data.questions,
                        detail: action.payload.data.detail,
                        qualifications: action.payload.data.qualification,
                        interview: interviews,
                    }
                }
            });
    },
});

export const { setAnswer, logOut } = hirecareerSlice.actions;

export const selectStatus = (state) => state.hirecareer.status;
export const selectQuestion = (state) => state.hirecareer.question;
export const selectAnswer = (state) => state.hirecareer.answer;
export const selectResult = (state) => state.hirecareer.result;
export const selectCount = (state) => state.hirecareer.count;
export const selectStartEnd = (state) => state.hirecareer.fromEndDate;
export const selectApiIsOn = (state) => state.hirecareer.apiIsOn
export const selectCadToken = (state) => localStorage.getItem('cad_token') ? localStorage.getItem('cad_token') : state.hirecareer.candidate;
export const selectCadName = (state) => localStorage.getItem('cad_name') ? localStorage.getItem('cad_name') : state.hirecareer.cadeName;

export default hirecareerSlice.reducer;
