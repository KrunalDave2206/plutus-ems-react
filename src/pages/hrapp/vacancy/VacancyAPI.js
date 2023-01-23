
import API from '../../../services/api';

export const getVacancies = (page, size) => {
    return API.get(`/v1/vacancies?page=${page}&size=${size}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}
export const postVacancies = (data) => {
    return API.post('/v1/vacancies', data)
        .then(response => { return response; },
            error => { return error.response.data; })
}
