
import API from '../../../services/api';

export const postProject = (data) => {
    return API.post('/v1/projects/', data)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const putTeam = (data) => {
    return API.put('/v1/projects/team', data)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const getProject = (project_id) => {
    return API.get('/v1/projects/' + project_id)
        .then(response => { return response; },
            error => { return error.response.data; })
}
