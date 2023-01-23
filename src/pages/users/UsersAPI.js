
import API from '../../services/api';
import { } from "../../services/utils";

export const getUsers = (page, size, searchKey, showBlocked) => {
    return API.get(`/v1/emp?page=${page}&size=${size}&search=${searchKey}&block=${showBlocked}`)
        .then(response => { return response; },
            error => { return error.response.data; })
}

export const delUser = (user_id, data) => {
    console.log('delUser data',data);
    return API.put(`/v1/emp/${user_id}`, data)
        .then(response => { return response; },
            error => { return error.response.data; })
}
