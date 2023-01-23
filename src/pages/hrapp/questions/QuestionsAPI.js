
import API from '../../../services/api';

export const getQuestionTypes = () => {
    return API.get(`/v1/hire/question/types`)
        .then(response => { return response; },
            error => { return error.response.data; })
}
export const getQuestions = (page, size) => {
    return API.get(`/v1/hire/questions?page=${page}&size=${size}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}
export const postQuestionTypes = (data) => {
    return API.post('/v1/hire/question/types', data)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const postQuestions = (data) => {
    return API.post('/v1/hire/questions', data)
        .then(response => { return response; },
            error => { return error.response.data; })
}
