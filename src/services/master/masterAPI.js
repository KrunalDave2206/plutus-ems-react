
import API from '../../services/api';

export const getRoles = () => {
    return API.get('/v1/mas/roles')
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const getDesignation = () => {
    return API.get('/v1/mas/designations')
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const getClients = () => {
    return API.get('/v1/mas/clients')
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const getProjects = (page, size) => {
    return API.get(`/v1/projects?page=${page}&size=${size}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}

// export const getEmployees = () => {
//     return API.get(`/v1/emp?page=0`)
//         .then(response => { return response; },
//             error => { return error.response.data; })
// }

export const getEmployees = (isEmp) => {
    let isLoginEmp = (isEmp != '' && isEmp != undefined) ? '?emp_id=' + isEmp : '';
    return API.get(`/v1/mas/employees${isLoginEmp}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const getAllEmployees = () => {
    return API.get(`/v1/mas/employees/all`)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const getAllProfiles = () => {
    return API.get(`/v1/mas/profiles`)
        .then(response => { return response; },
            error => { return error.response.data; })
}