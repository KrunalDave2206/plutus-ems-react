
import API from '../../../services/api';

export const getInterviews = (toDate) => {
    return API.get(`/v1/candidates/interview/mylist?date=${toDate}`)
        .then(response => { 
            return response; },
            error => { return error.response.data; })
}

export const postInterviewsFeedback = (data) => {
    return API.post(`/v1/candidates/interview/feedback`, data)
        .then(response => { return response; },
            error => { return error.response.data; })
}
