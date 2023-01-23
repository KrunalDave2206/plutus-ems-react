import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getLeaves, updateLeave } from "./LeavesAPI";

const initialState = {
    status: null,
    message: null,
    count: 0,
    leaves: null
};


export const listLeavesAsync = createAsyncThunk(
    'leave/list',
    async ({ page, size, admin, emp_id, from_date, to_date, leaveStatus }) => {
        try {
            const response = await getLeaves(page, size, admin, emp_id, from_date, to_date, leaveStatus);
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
);

export const updateLeaveAsync = createAsyncThunk(
    'leave/updateStatus',
    async ({ leave_id, leaveType }) => {
        try {
            const response = await updateLeave(leave_id, leaveType);
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

export const leaveSlice = createSlice({
    name: 'leaves',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listLeavesAsync.pending, (state) => { })
            .addCase(listLeavesAsync.fulfilled, (state, action) => {
                let leaves = [];
                for (const leave of action.payload.data.rows) {
                    let leaveType = '';
                    let leaveStatus = '';
                    switch (leave.leave_type) {
                        case 1: leaveType = "Un-planned"; break;
                        case 2: leaveType = "Compensation"; break;
                        default: leaveType = "Planned"; break;
                    }
                    switch (leave.leave_status) {
                        case 1: leaveStatus = "Approved"; break;
                        case 2: leaveStatus = "Rejected"; break;
                        case 3: leaveStatus = "Cancelled"; break;
                        default: leaveStatus = "Pending"; break;
                    }
                    leave.type = leaveType;
                    leave.status = leaveStatus
                    leaves.push(leave);
                }
                state.leaves = [...leaves];
                state.count = action.payload.data.count;
            })
            .addCase(updateLeaveAsync.pending, (state) => { })
            .addCase(updateLeaveAsync.fulfilled, (state, action) => {
                // listLeavesAsync();
            });
    },
});

export const selectStatus = (state) => state.leaves.status;
export const selectLeaves = (state) => state.leaves.leaves;
export const selectLeavesCount = (state) => state.leaves.count;

export default leaveSlice.reducer;