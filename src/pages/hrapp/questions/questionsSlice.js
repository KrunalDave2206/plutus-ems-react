import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getQuestionTypes, getQuestions, postQuestionTypes, postQuestions } from "./QuestionsAPI";
export const dummyQuestionType = { id: '', type: '', weightage: '' }
export const dummyQuestion = { id: '', type_id: '', question: '', answers: '', correct_ans: '' }
const initialState = {
    status: null,
    oppenings: null,
    totalCount: 0,
    type: { ...dummyQuestionType },
    question: { ...dummyQuestion },
    questionTotalCount: 0
};

export const listQuestionTypesAsync = createAsyncThunk(
    'QuestionTypes/list',
    async () => {
        try {
            const response = await getQuestionTypes();
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const postQuestionTypesAsync = createAsyncThunk(
    'QuestionTypes/post',
    async (data) => {
        try {
            const response = await postQuestionTypes(data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const listQuestionAsync = createAsyncThunk(
    'Questions/list',
    async ({ page, size }) => {
        try {
            const response = await getQuestions(page, size);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const postQuestionsAsync = createAsyncThunk(
    'Questions/post',
    async (data) => {
        try {
            const response = await postQuestions(data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const questionsSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        updateType: (state, action) => {
            state.type = action.payload;
        },
        updateQuestion: (state, action) => {
            state.question = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(listQuestionTypesAsync.pending, (state) => {
                // state.status = 'loading';
            })
            .addCase(listQuestionTypesAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    state.types = [...action.payload.data.types];
                }
            })
            .addCase(postQuestionTypesAsync.fulfilled, (state, action) => {
                state.type = { ...dummyQuestionType }
            })
            .addCase(listQuestionAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    state.questions = [...action.payload.data.questions];
                    state.questionTotalCount = action.payload.data.count;
                }
            })
            .addCase(postQuestionsAsync.fulfilled, (state, action) => {
                state.question = { ...dummyQuestion }
            })
    },
});

export const { updateType, updateQuestion } = questionsSlice.actions;

export const selectStatus = (state) => state.questions.status;
export const selectTypes = (state) => state.questions.types;
export const selectType = (state) => state.questions.type;
export const selectQuestions = (state) => state.questions.questions;
export const selectQuestion = (state) => state.questions.question;
export const selectQuestionCount = (state) => state.questions.questionTotalCount;

export default questionsSlice.reducer;
