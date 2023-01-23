import React, { useEffect } from "react";
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button, ButtonGroup, Stack } from "react-bootstrap";
import { postLeaveAsync, selectLeaves, removeLeaveData } from "./leaveFormSlice";
import { getEmployeesAsync, selectEmployees } from "../../../services/master/masterSlice";
import { PERMISSIONS } from "../../../services/constants";
import API from '../../../services/api';
import './LeaveForm.scss';

export const LeaveForm = (props) => {
    const dispatch = useDispatch();
    const loginUser = JSON.parse(localStorage.getItem('user'));
    const leaveData = useSelector(selectLeaves);
    const employees = useSelector(selectEmployees);
    console.log(employees)
    const isAdmin = (loginUser.role_name == 'Admin') ? true : false;
    const isEmp = (loginUser.role_name == 'Admin') ? "" : loginUser.id;
    const permissions = loginUser ? JSON.parse(loginUser.permissions) : null;

    const intialValue = {
        id: "",
        emp_id: loginUser.id,
        leave_type: "0",
        day_type: "0",
        half_day: "",
        reason: "",
        from_date: "",
        to_date: "",
        leaves: "0",
        holidays: "0",
        total_days: null,
        created_by: loginUser.id,
        employees: [],
        showHalfDayDiv: "hidden"
    }
    console.log(intialValue);

    const validate = inputs => {
        const errors = {};
        if (!inputs.reason != '') errors.reason = 'Required';
        if (!inputs.from_date != '') errors.from_date = 'Required';
        if (!inputs.emp_id != '') errors.emp_id = 'Required';
        if (new Date(inputs.from_date) > new Date(inputs.to_date)) errors.to_date = 'please select greater or equal date of from date';
        if (formik.values.total_days <= 0) errors.total_days = 'Total days must be greater than 0';
        return errors;
    }

    const setLeaveType = (value) => {
        formik.setFieldValue("leave_type", value);
    };
    const setDayType = (value) => {
        formik.setFieldValue("day_type", value);
        formik.setFieldValue("from_date", '');
        formik.setFieldValue("to_date", '');
        if (value === 1) {
            formik.setFieldValue("showHalfDayDiv", '');
        } else {
            formik.setFieldValue("showHalfDayDiv", 'hidden');
        }
    };

    const formik = useFormik({
        initialValues: leaveData && leaveData.id ? leaveData : intialValue,
        enableReinitialize: true,
        validate,
        onSubmit: async values => {
            await dispatch(postLeaveAsync(values));
            if (props.closePopup) props.closePopup();
            if (props.fetchLeaves) props.fetchLeaves();            
        }
    });
    
    useEffect(() => { dispatch(getEmployeesAsync(isEmp)); }, [dispatch, isEmp])
    useEffect(() => {
        if (formik.values.day_type == 0 && new Date(formik.values.from_date) <= new Date(formik.values.to_date)) {
            getLeaveCount(formik.values.from_date, formik.values.to_date);
        } else {
            formik.setFieldValue("total_days", (formik.values.day_type == 0) ? 0 : 0.5);
            formik.setFieldValue("holidays", 0);
            formik.setFieldValue("leaves", 0);
        }

        (formik.values.half_day == '') ? formik.setFieldValue("showHalfDayDiv", 'hidden') : formik.setFieldValue("showHalfDayDiv", '');
    }, [dispatch, formik.values.from_date, formik.values.to_date, isEmp]);

    const getLeaveCount = (from_date, to_date) => {
        let data = { from_date: from_date, to_date: to_date, }
        API.post('/v1/leave/getLeaveCount', data)
            .then(response => {
                formik.setFieldValue("total_days", response.data.data.totalDays);
                formik.setFieldValue("holidays", response.data.data.holiDays);
                formik.setFieldValue("leaves", response.data.data.leaveDays);
                return response;
            },
                error => { return error.response.data; })
    }
    console.log(formik.values);
    return (
        <Form onSubmit={formik.handleSubmit} className='leave-form'>
            <Stack gap={2}>
                {permissions
                    && (permissions.indexOf(PERMISSIONS.leaves_all) > -1 || permissions.indexOf(PERMISSIONS.leaves_team) > -1)
                    && employees && employees.length > 0 &&
                    <Form.Group controlId="emp_id">
                        <Form.Label column="sm">Employees {formik.errors.emp_id && <code> *{formik.errors.emp_id}</code>}</Form.Label>
                        <br></br>
                        <Form.Select aria-label="Default select example" onChange={formik.handleChange} value={formik.values.emp_id || ''}>
                            <option value="" >--Select Employee Name --</option>
                            {employees.map((emp, index) => <option key={emp.id} value={emp.id}>{emp.emp_name}</option>)}
                        </Form.Select>
                    </Form.Group>
                }
                <Form.Group controlId="leave_type">
                    <Form.Label column="sm">Leave Type{formik.errors.leave_type ? <code> *{formik.errors.leave_type}</code> : null}</Form.Label>
                    <Stack direction="horizontal" gap={2} >
                        <Button size="sm" variant='light'
                            className={(formik.values.leave_type == 0) ? 'btn-cut-submit' : 'btn-cut-outline'}
                            onClick={() => setLeaveType(0)} >Planned</Button>
                        <Button size="sm" variant='light'
                            className={(formik.values.leave_type == 1) ? 'btn-cut-submit' : 'btn-cut-outline'}
                            onClick={() => setLeaveType(1)} >Unplanned</Button>
                        <Button size="sm" variant='light'
                            className={(formik.values.leave_type == 2) ? 'btn-cut-submit' : 'btn-cut-outline'}
                            onClick={() => setLeaveType(2)} >Compensation</Button>
                    </Stack>
                </Form.Group>
                <Stack direction="horizontal" gap={1}>
                    <Form.Group controlId="day_type" className="w-50">
                        <Form.Label column="sm">Leave Day{formik.errors.day_type ? <code> *{formik.errors.day_type}</code> : null}</Form.Label>
                        <Stack direction="horizontal" gap={2} >
                            <Button size="sm" variant='light'
                                className={(formik.values.day_type == 0) ? 'btn-cut-submit' : 'btn-cut-outline'}
                                onClick={() => setDayType(0)} >Full Day</Button>
                            <Button size="sm" variant='light'
                                className={(formik.values.day_type == 1) ? 'btn-cut-submit' : 'btn-cut-outline'}
                                onClick={() => setDayType(1)} >Half Day</Button>
                        </Stack>
                    </Form.Group>
                    <Form.Group className={formik.values.showHalfDayDiv} controlId="half_day" >
                        <Form.Label column="sm">Half Leave</Form.Label>
                        <Stack direction="horizontal" gap={2} >
                            <Button size="sm" variant='light'
                                className={(formik.values.half_day == 0) ? 'btn-cut-submit' : 'btn-cut-outline'}
                                onClick={() => formik.setFieldValue("half_day", 0)} >First Half</Button>
                            <Button size="sm" variant='light'
                                className={(formik.values.half_day == 1) ? 'btn-cut-submit' : 'btn-cut-outline'}
                                onClick={() => formik.setFieldValue("half_day", 1)} >Second Half</Button>
                        </Stack>
                    </Form.Group>
                </Stack>
                <Stack direction="horizontal" gap={2} className='justify-content-between'>
                    <Form.Group controlId="from_date" className="w-50" >
                        <Form.Label column="sm">From Date{formik.errors.from_date && <code> *{formik.errors.from_date}</code>}</Form.Label>
                        <Form.Control type="date" placeholder="From Date" onChange={formik.handleChange}
                            value={formik.values.from_date || ''} min={new Date().toISOString().slice(0, 10)} />
                    </Form.Group>
                    <Form.Group controlId="to_date" className="w-50">
                        <Form.Label column="sm">To Date{formik.errors.to_date ? <code> *{formik.errors.to_date}</code> : null}</Form.Label>
                        <Form.Control type="date" placeholder="To Date" min={new Date().toISOString().slice(0, 10)} onChange={formik.handleChange}
                            value={formik.values.to_date || ''} />
                    </Form.Group>
                </Stack>
                <Form.Group controlId="reason">
                    <Form.Label column="sm">Leave Reason{formik.errors.reason && <code> *{formik.errors.reason}</code>}</Form.Label>
                    <Form.Control as="textarea" rows={2} onChange={formik.handleChange} value={formik.values.reason || ''} />
                </Form.Group>
                <Form.Group>
                    <Form.Label column="sm">Leaves : {formik.values.leaves} <code>Excluding [Saturday & Sunday & Holiday]</code></Form.Label>
                </Form.Group>
                <Form.Group>
                    <Form.Label column="sm">Holidays (Sat-Sun-Holidays) : {formik.values.holidays}</Form.Label>
                </Form.Group>
                <Form.Group>
                    <Form.Label column="sm">Total No. Days : {formik.values.total_days} {formik.errors.total_days ? <code> *{formik.errors.total_days}</code> : null}</Form.Label>
                </Form.Group>
            </Stack>
            <Row>
                <Col xs={12} >
                    <div className="d-flex justify-content-end">
                        {props.closePopup && <Button className='mx-2'
                            onClick={() => {
                                dispatch(removeLeaveData());
                                props.closePopup()
                            }} variant="secondary" type="button">Close</Button>}
                        <Button className='mx-2'
                            onClick={() => {
                                dispatch(removeLeaveData());
                            }} variant="light" type="button">Reset</Button>
                        <Button className='mx-2 btn-cut-submit' variant="primary" type="submit">Apply</Button>
                    </div>
                </Col>
            </Row>
        </Form>
    )
}

