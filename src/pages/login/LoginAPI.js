
import API from '../../services/api';

export const postLogin = (data) => {
    return API.post('/v1/emp/login', data)
        .then(response => { return response; },
            error => { return error.response.data; })
}
