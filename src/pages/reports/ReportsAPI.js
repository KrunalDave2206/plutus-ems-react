import API from '../../services/api';

export const getUsersReport = (date) => {
    return API.get(`/v1/report/tracked?date=${date}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}

