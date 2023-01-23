import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getDashCalendar } from "./DashboardAPI";

const initialState = {
    status: null,
    calendar: [],
    fromDate: new Date().getTime(),
    toDate: new Date().getTime()
};

export const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const getDayFromDate = (date) => {
    let d = new Date(date);
    return days[d.getDay()];
}

export const getDashCalendarAsync = createAsyncThunk(
    'dash/calendar/get',
    async ({ from_date, to_date }) => {
        try {
            const response = await getDashCalendar(from_date, to_date);
            if (response.status == 0) return response;
            else return response.data;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
)

export const dashboardSlice = createSlice({
    name: 'dash',
    initialState,
    reducers: {
        setNextMonth: (state) => {
            let fd = new Date(state.fromDate);
            fd.setMonth(fd.getMonth() + 1);
            state.fromDate = fd.getTime();

            let td = new Date(state.toDate);
            td.setMonth(td.getMonth() + 1);
            state.toDate = td.getTime();
        },
        setPrevMonth: (state) => {
            let fd = new Date(state.fromDate);
            fd.setMonth(fd.getMonth() - 1);
            state.fromDate = fd.getTime();

            let td = new Date(state.toDate);
            td.setMonth(td.getMonth() - 1);
            state.toDate = td.getTime();
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDashCalendarAsync.pending, (state) => { })
            .addCase(getDashCalendarAsync.fulfilled, (state, action) => {
                action.payload.data = action.payload.data.sort((a, b) => {
                    var dateA = new Date(a.start);
                    var dateB = new Date(b.start);

                    if (dateA < dateB) return -1;
                    else if (dateA > dateB) return 1;
                    else return 0;
                });
                let data = {};
                let fYear = new Date(state.fromDate).getFullYear()
                for (let d of action.payload.data) {
                    let dYear = d.start.split('-')[0];
                    if (d.start == d.end) {
                        if (fYear != dYear) {
                            let dd = d.start.split('-')
                            dd[0] = fYear;
                            d.start = dd.join('-');
                        }
                        if (!data[d.start]) data[d.start] = []
                        data[d.start].push(d);
                    } else {
                        let sSplit = d.start.split('-');
                        let eSplit = d.end.split('-');
                        let dateOne = new Date(sSplit[0] + '-' + (parseInt(sSplit[1]) + 1) + '-' + sSplit[2]);
                        let dateTwo = new Date(eSplit[0] + '-' + (parseInt(eSplit[1]) + 1) + '-' + eSplit[2]);
                        for (var i = dateOne; i <= dateTwo; i.setDate(i.getDate() + 1)) {
                            let m = i.getMonth();
                            m = m < 10 ? '0' + m : m;
                            let dd = i.getFullYear() + '-' + m + '-' + i.getDate();
                            if (!data[dd]) data[dd] = []
                            data[dd].push(d);
                        }
                    }
                }
                state.calendar = data;
            })
    },
});

export const { setNextMonth, setPrevMonth } = dashboardSlice.actions;

export const selectStatus = (state) => state.dash.status;
export const selectCalendar = (state) => state.dash.calendar;
export const selectFromDate = (state) => {
    let fd = new Date(state.dash.fromDate);
    let y = fd.getFullYear(), m = (fd.getMonth() + 1);
    return `${y}-${m < 10 ? '0' + m : m}-01`
};
export const selectToDate = (state) => {
    let fd = new Date(state.dash.toDate);
    let y = fd.getFullYear(), m = (fd.getMonth() + 1);
    return `${y}-${m < 10 ? '0' + m : m}-31`
};

export const selectCurrentMonthTitle = (state) => {
    let fd = new Date(state.dash.toDate);
    return `${monthNames[fd.getMonth()]} ${fd.getFullYear()}`;
};
export default dashboardSlice.reducer;