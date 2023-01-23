import API from '../../services/api';

export const getDashCalendar = (from_date, to_date) => {
    return API.get(`/v1/mas/dash/calendar?from_date=${from_date}&to_date=${to_date}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}

