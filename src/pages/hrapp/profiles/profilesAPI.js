
import API from '../../../services/api';

export const getProfiles = (page, size) => {
    return API.get(`/v1/profiles?page=${page}&size=${size}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}
export const postProfiles = (data) => {
    return API.post('/v1/profiles', data)
        .then(response => { return response; },
            error => { return error.response.data; })
}
