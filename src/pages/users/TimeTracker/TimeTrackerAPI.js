
import API from '../../../services/api';

export const getUsersTrackedTime = (date, all) => {
    return API.get(`/v1/emp/timetracked/all?date=${date}&all=${all}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const getUsersTrackedActivity = (emp_id, date) => {
    return API.get(`/v1/emp/timetracked/${emp_id}?date=${date}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const deleteUsersTrackedActivity = (act_id, date) => {
    return API.delete(`/v1/emp/timetracked/${act_id}?date=${date}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}