
import API from '../../../services/api';

export const postClient = (data) => {
    return API.post('/v1/clients/', data)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const getClient = (client_id) => {
    return API.get('/v1/clients/' + client_id)
        .then(response => { return response; },
            error => { return error.response.data; })
}
