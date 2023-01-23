import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { addLeaves, getLeave } from "./leaveFormApi";

const initialState = {
    status: null,
    leave: null
};

export const postLeaveAsync = createAsyncThunk(
    'leave/post',
    async (req, res) => {
        try {
            const response = await addLeaves(req);
            if (response.status == 0) {
                return response;
            } else {
                return response.data;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }
)

export const getLeaveAsync = createAsyncThunk(
    'leave/get',
    async (leave_id) => {
        try {
            const response = await getLeave(leave_id);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
)

export const leaveFormSlice = createSlice({
    name: 'leaveform',
    initialState,
    reducers: {
        removeLeaveData: (state) => {
            state.leave = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLeaveAsync.pending, (state) => { })
            .addCase(getLeaveAsync.fulfilled, (state, action) => {
                state.leave = action.payload.data
            })
            .addCase(postLeaveAsync.pending, (state) => { })
            .addCase(postLeaveAsync.fulfilled, (state, action) => {
                if (action.payload.status == 0)
                    state.status = action.payload.message;
                else {
                    state.status = null;
                    state.leave = null;
                }
            })
    },
});

export const { removeLeaveData } = leaveFormSlice.actions;

export const selectStatus = (state) => state.leaveform.status;
export const selectLeaves = (state) => state.leaveform.leave;

export default leaveFormSlice.reducer;