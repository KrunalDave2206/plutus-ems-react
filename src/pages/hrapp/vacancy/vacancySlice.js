import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getVacancies, postVacancies } from "./VacancyAPI";
export const dummyOppening = { id: '', vacancies: 0, profile_id: '', experiance: '', closed: 0 }
const initialState = {
    status: null,
    oppenings: null,
    totalCount: 0,
    oppening: { ...dummyOppening }
};

export const listVacancyAsync = createAsyncThunk(
    'Vacancy/list',
    async ({ page, size }) => {
        try {
            const response = await getVacancies(page, size);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const postVacancyAsync = createAsyncThunk(
    'Vacancy/post',
    async (data) => {
        try {
            const response = await postVacancies(data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const vacancySlice = createSlice({
    name: 'vacancy',
    initialState,
    reducers: {
        updateOppening: (state, action) => {
            state.oppening = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(listVacancyAsync.pending, (state) => {
                // state.status = 'loading';
            })
            .addCase(listVacancyAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    state.oppenings = [...action.payload.data.vacancies];
                    state.totalCount = action.payload.data.count
                }
            })
            .addCase(postVacancyAsync.fulfilled, (state, action) => {
                state.oppening = { ...dummyOppening }
            })
    },
});

export const { updateOppening } = vacancySlice.actions;

export const selectStatus = (state) => state.vacancy.status;
export const selectOppenings = (state) => state.vacancy.oppenings;
export const selectOppening = (state) => state.vacancy.oppening;
export const selectTotalCount = (state) => state.vacancy.totalCount;

export default vacancySlice.reducer;
