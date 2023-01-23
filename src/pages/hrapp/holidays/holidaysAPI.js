
import API from '../../../services/api';

export const getHolidays = (page, size) => {
    return API.get(`/v1/holidays?page=${page}&size=${size}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}
export const postHolidays = (data) => {
    return API.post('/v1/holidays', data)
        .then(response => { return response; },
            error => { return error.response.data; })
}
