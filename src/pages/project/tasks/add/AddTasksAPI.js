
import API from '../../../../services/api';

export const getTask = (task_id) => {
    return API.get(`/v1/tasks/${task_id}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const getTaskByNumber = (number) => {
    return API.get(`/v1/tasks/numb/${number}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const addTask = (data) => {
    return API.post(`/v1/tasks/`, data)
        .then(response => { return response; },
            error => { return error.response.data; })
}
export const listTaskComment = (task_id) => {
    return API.get(`/v1/tasks/${task_id}/comment`)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const addTaskComment = (task_id, data) => {
    return API.post(`/v1/tasks/${task_id}/comment`, data)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const deleteTaskComment = (comment_id) => {
    return API.delete(`/v1/tasks/comment/${comment_id}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const listTaskHistory = (task_id) => {
    return API.get(`/v1/tasks/${task_id}/history`)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const listTaskWorklog = (task_id) => {
    return API.get(`/v1/tasks/${task_id}/worklog`)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const addTaskCWorklog = (task_id, data) => {
    return API.post(`/v1/tasks/${task_id}/worklog`, data)
        .then(response => { return response; },
            error => { return error.response.data; })
}
