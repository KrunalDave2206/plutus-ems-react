import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    show: false,
    delay: 3000,
    variant: 'Llight',
    headertext: '',
    bodytext: ''
}
//variant : 'Primary', 'Secondary', 'Success', 'Danger', 'Warning', 'Info', 'Light', 'Dark',
export const toastCompSlice = createSlice({
    name: 'toastcomp',
    initialState,
    reducers: {
        showNow: (state, action) => {
            let payload = action.payload;
            if (payload.body) {
                state.show = true;
                state.delay = payload.delay || 3000;
                state.variant = payload.variant || 'light';
                state.headertext = payload.header || '';
                state.bodytext = payload.body
            }
        },
        hide: (state, action) => {
            state.show = initialState.show;
            state.delay = initialState.delay || 3000;
            state.variant = initialState.variant || 'light';
            state.headertext = initialState.header || '';
            state.bodytext = initialState.body
        }
    },
})

export const { showNow, hide } = toastCompSlice.actions;

export const selectShow = (state) => state.toastcomp.show;
export const selectDelay = (state) => state.toastcomp.delay;
export const selectVariant = (state) => state.toastcomp.variant;
export const selectHeader = (state) => state.toastcomp.headertext;
export const selectBody = (state) => state.toastcomp.bodytext;

export default toastCompSlice.reducer;