
import API from '../../services/api';

export const getClients = (page, size) => {
    return API.get(`/v1/clients?page=${page}&size=${size}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}
