
import API from '../../services/api';

export const getProjects = (page, size, name, client_id, team) => {
    return API.get(`/v1/projects?page=${page}&size=${size}&name=${name}&client_id=${client_id}&team=${team}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}
