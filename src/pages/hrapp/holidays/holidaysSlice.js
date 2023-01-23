import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getHolidays, postHolidays } from "./holidaysAPI";

const initialState = {
    status: null,
    holidays: null,
    totalCount: 0,
    holiday: null
};

export const listHolidaysAsync = createAsyncThunk(
    'holidays/list',
    async ({ page, size }) => {
        try {
            const response = await getHolidays(page, size);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const postHolidaysAsync = createAsyncThunk(
    'holidays/post',
    async (data) => {
        try {
            const response = await postHolidays(data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const holidaysSlice = createSlice({
    name: 'holidays',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listHolidaysAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    state.holidays = [...action.payload.data.holidays];
                    state.totalCount = action.payload.data.count
                }
            })
            .addCase(postHolidaysAsync.fulfilled, (state, action) => {

            })
    },
});

// export const { loginFormChange } = projectsSlice.actions;

export const selectStatus = (state) => state.holidays.status;
export const selectHolidays = (state) => state.holidays.holidays;
export const selectHoliday = (state) => state.holidays.holiday;
export const selectTotalCount = (state) => state.holidays.totalCount;

export default holidaysSlice.reducer;
