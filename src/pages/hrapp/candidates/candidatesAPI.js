
import API from '../../../services/api';

export const getCandidates = (page, size, searchKey = null) => {
    return API.get(`/v1/candidates?page=${page}&size=${size}&searchKey=${searchKey}`)
        .then(response => { return response; }, error => { return error.response.data; })
}
export const postCandidates = (data) => {
    return API.post('/v1/candidates', data)
        .then(response => { return response; }, error => { return error.response.data; })
}

export const getCandidate = (cadidate_id) => {
    return API.get(`/v1/candidates/${cadidate_id}`)
        .then(response => { return response; }, error => { return error.response.data; })
}

export const postInterview = (data) => {
    return API.post('/v1/candidates/interview', data)
        .then(response => { return response; }, error => { return error.response.data; })
}

export const getInterview = (cadidate_id) => {
    return API.get(`/v1/candidates/interview/${cadidate_id}`)
        .then(response => { return response; }, error => { return error.response.data; })
}