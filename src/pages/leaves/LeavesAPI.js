import API from '../../services/api';

export const getLeaves = (page, size, admin, emp_id, from_date, to_date, leaveStatus) => {
    page = (page != '' && page != undefined) ? 'page=' + page : '';
    size = (size != '' && size != undefined) ? '&size=' + size : '';
    let isAdmin = (admin != '' && admin != undefined) ? '&isAdmin=' + admin : '';
    let empParam = (emp_id != '' && emp_id != undefined) ? '&emp_id=' + emp_id : '';
    let fromDate = (from_date != '' && from_date != undefined) ? '&from_date=' + from_date : '';
    let toDate = (to_date != '' && to_date != undefined) ? '&to_date=' + to_date : '';
    leaveStatus = (leaveStatus != '' && leaveStatus != undefined) ? '&leave_status=' + leaveStatus : '';
    return API.get(`/v1/leave?${page + size + isAdmin + empParam + fromDate + toDate + leaveStatus}`)
        .then(response => { return response }, error => { return error.response.data; })
};


export const updateLeave = (leave_id, leaveType) => {
    let data = { "id": leave_id, "status": leaveType };
    return API.put(`/v1/leave`, data)
        .then(response => { return response; }, error => { return error.response.data; })
}; 