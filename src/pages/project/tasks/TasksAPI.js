
import API from '../../../services/api';

export const getTasks = (project_id, page, size) => {
    return API.get(`/v1/projects/${project_id}/tasks?page=${page}&size=${size}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const getProjectByTaskPrefix = (task_prefix) => {
    return API.get(`/v1/projects/task_prefix/${task_prefix}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}
