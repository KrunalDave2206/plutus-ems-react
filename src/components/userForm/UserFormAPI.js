
import API from '../../services/api';

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
