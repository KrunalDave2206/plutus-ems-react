import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getDesignation, getRoles, getClients, getEmployees, getProjects, getAllEmployees, getAllProfiles } from "./masterAPI";

const initialState = {
    designations: [],
    roles: [],
    clients: [],
    employees: [],
    projects: [],
    employeesall: [],
    profiles: []
};

export const getRolesAsync = createAsyncThunk(
    'mas/roles',
    async () => {
        try {
            const response = await getRoles();
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getDesignetionAsync = createAsyncThunk(
    'mas/designation',
    async () => {
        try {
            const response = await getDesignation();
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getClientsAsync = createAsyncThunk(
    'mas/clients',
    async () => {
        try {
            const response = await getClients();
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getEmployeesAsync = createAsyncThunk(
    'mas/employees',
    async (isEmp) => {
        try {
            const response = await getEmployees(isEmp);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getProjectsAsync = createAsyncThunk(
    'mas/projects',
    async (isEmp) => {
        try {
            const response = await getProjects(isEmp);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getAllEmployeeAsync = createAsyncThunk(
    'mas/employee/all',
    async () => {
        try {
            const response = await getAllEmployees();
            console.log(response.data);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const getProfilesAsync = createAsyncThunk(
    'mas/profiles',
    async () => {
        try {
            const response = await getAllProfiles();
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
);

export const masterSlice = createSlice({
    name: 'master',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRolesAsync.fulfilled, (state, action) => {
                if (action.payload.status !== 0) state.roles = action.payload.data;
            })
            .addCase(getDesignetionAsync.fulfilled, (state, action) => {
                if (action.payload.status !== 0) state.designations = action.payload.data;
            })
            .addCase(getClientsAsync.fulfilled, (state, action) => {
                if (action.payload.status !== 0) state.clients = action.payload.data;
            })
            .addCase(getEmployeesAsync.fulfilled, (state, action) => {
                if (action.payload.status !== 0) state.employees = action.payload.data;
                
            })
            .addCase(getProjectsAsync.fulfilled, (state, action) => {
                if (action.payload.status !== 0) state.projects = action.payload.data;
            })
            .addCase(getAllEmployeeAsync.fulfilled, (state, action) => {
                if (action.payload.status !== 0) state.employeesall = action.payload.data;
            })
            .addCase(getProfilesAsync.fulfilled, (state, action) => {
                if (action.payload.status !== 0) state.profiles = action.payload.data;
            })
    },
});

// export const { loginFormChange } = masterSlice.actions;

export const selectDesignation = (state) => state.master.designations;
export const selectRoles = (state) => state.master.roles;
export const selectClients = (state) => state.master.clients;
export const selectEmployees = (state) => state.master.employees;
export const selectAllEmployees = (state) => state.master.employeesall;
export const selectProjects = (state) => state.master.projects;
export const selectProfiles = (state) => state.master.profiles;

export default masterSlice.reducer;
