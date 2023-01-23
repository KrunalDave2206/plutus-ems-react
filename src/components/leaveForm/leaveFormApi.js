import API from '../../services/api';

export const addLeaves = (data) => {
    return API.post(`/v1/leave`, data)
    .then(response => { return response; }, error => { return error.response.data; })
}

export const getLeave = (leave_id)  => {
    return API.get(`/v1/leave/${leave_id}`)
    .then(response => { return response; }, error => { return error.response.data; })
};