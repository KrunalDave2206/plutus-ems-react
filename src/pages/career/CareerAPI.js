
import API from '../../services/api';

export const getNextQuestion = (candidate_id, data) => {
    return API.post(`/v1/hire/question/next/${candidate_id}`, data)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const postCandidate = (data) => {
    return API.post(`/v1/hire/apply`, data)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const getResult = (candidate_id) => {
    return API.get(`/v1/hire/result/${candidate_id}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}