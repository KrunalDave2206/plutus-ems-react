
import API from '../../../services/api';

export const postUser = (data) => {
    return API.post('/v1/emp/', data)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const getUser = (user_id) => {
    return API.get('/v1/emp/' + user_id)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const getProfile = (user_id) => {
    return API.get('/v1/emp/profile?user_id=' + user_id)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const getUserWithProjects = () => {
    return API.get('/v1/emp/see/projects')
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const getUsersTrackedTime = () => {
    return API.get('/v1/emp/timetracked/all')
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const postChangePassword = (data) => {
    return API.post('/v1/emp/change_password', data)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const putChangeWorkPreference = (data) => {
    return API.put('/v1/emp/work_preference', data)
        .then(response => { return response; },
            error => { return error.response.data; })
}
