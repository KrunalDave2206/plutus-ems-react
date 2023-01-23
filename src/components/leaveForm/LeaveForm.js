import React, { useEffect } from "react";
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button, ButtonGroup } from "react-bootstrap";
import { postLeaveAsync, selectLeaves } from "./leaveFormSlice";
import { getEmployeesAsync, selectEmployees } from "../../services/master/masterSlice";

import API from '../../services/api';
import './LeaveForm.scss';
import { NowTimer } from "@fullcalendar/react";

export const LeaveForm = () => {
    const dispatch = useDispatch();
    const loginUser = JSON.parse(localStorage.getItem('user'));
    const leaveData = useSelector(selectLeaves);
    const employees = useSelector(selectEmployees);
    const isAdmin = (loginUser.role_name == 'Admin') ? true : false;
    const isEmp = (loginUser.role_name == 'Admin') ? "" : loginUser.id;

    const intialValue = {
        id: "",
        emp_id: "",
        leave_type: "0",
        day_type: "0",
        half_day: "",
        reason: "",
        from_date: "",
        to_date: "",
        leaves: "0",
        holidays: "0",
        total_days: "0",
        created_by: loginUser.id,
        employees: [],
        showHalfDayDiv: "hidden"
    }


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
        onSubmit: values => {
            dispatch(postLeaveAsync(values))
        },
    });

    useEffect(() => {
        if (formik.values.day_type == 0 && new Date(formik.values.from_date) <= new Date(formik.values.to_date)) {
            getLeaveCount(formik.values.from_date, formik.values.to_date);
        } else {
            formik.setFieldValue("total_days", (formik.values.day_type == 0) ? 0 : 0.5);
            formik.setFieldValue("holidays", 0);
            formik.setFieldValue("leaves", 0);
        }

        (formik.values.half_day == '') ? formik.setFieldValue("showHalfDayDiv", 'hidden') : formik.setFieldValue("showHalfDayDiv", '');


        dispatch(getEmployeesAsync(isEmp));

    }, [dispatch, formik.values.from_date, formik.values.to_date, isEmp]);

    const getLeaveCount = (from_date, to_date) => {
        let data = {
            from_date: from_date,
            to_date: to_date,
        }
        API.post('/v1/leave/getLeaveCount', data).then(response => {
            formik.setFieldValue("total_days", response.data.data.totalDays);
            formik.setFieldValue("holidays", response.data.data.holiDays);
            formik.setFieldValue("leaves", response.data.data.leaveDays);
            return response;
        },
            error => { return error.response.data; })
    }

    return (
        <>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Control type="text" placeholder="leave_id" name="id" value={formik.values.id || ''} />
                <Row>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="leave_type">
                            <Form.Label column="sm">Leave Type{formik.errors.leave_type ? <code> *{formik.errors.leave_type}</code> : null}</Form.Label>
                            <br></br>
                            <ButtonGroup size="md" className="mb-2">
                                <Button onClick={() => setLeaveType(0)} variant={(formik.values.leave_type == 0) ? 'primary' : 'secondary'}>Planned</Button>
                                <Button onClick={() => setLeaveType(1)} variant={(formik.values.leave_type == 1) ? 'primary' : 'secondary'}>Unplanned</Button>
                                <Button onClick={() => setLeaveType(2)} variant={(formik.values.leave_type == 2) ? 'primary' : 'secondary'}>Compensation</Button>
                            </ButtonGroup>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="day_type">
                            <Form.Label column="sm">Leave Day{formik.errors.day_type ? <code> *{formik.errors.day_type}</code> : null}</Form.Label>
                            <br></br>
                            <ButtonGroup size="md" className="mb-2">
                                <Button onClick={() => setDayType(0)} variant={(formik.values.day_type == 0) ? 'primary' : 'secondary'}>Full Day(s)</Button>
                                <Button onClick={() => setDayType(1)} variant={(formik.values.day_type == 1) ? 'primary' : 'secondary'}>Half Day</Button>
                            </ButtonGroup>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} className="mb-2" >
                        <Form.Group className={formik.values.showHalfDayDiv} controlId="half_day" >
                            <Form.Label column="sm">Half Leave</Form.Label>
                            <br></br>
                            <ButtonGroup size="md" className="mb-2">
                                <Button onClick={() => formik.setFieldValue("half_day", 0)} variant={(formik.values.half_day == 0) ? 'primary' : 'secondary'}>First Half</Button>
                                <Button onClick={() => formik.setFieldValue("half_day", 1)} variant={(formik.values.half_day == 1) ? 'primary' : 'secondary'}>Second Half</Button>
                            </ButtonGroup>
                        </Form.Group>
                    </Col>
                    {
                        (isAdmin || employees && employees.length > 0) ?
                            <Col xs={12} md={4} >
                                <Form.Group className="mb-2" controlId="emp_id">
                                    <Form.Label column="sm">Employees{formik.errors.emp_id ? <code> *{formik.errors.emp_id}</code> : null}</Form.Label>
                                    <br></br>
                                    <Form.Select aria-label="Default select example" onChange={formik.handleChange}
                                        value={formik.values.emp_id || ''}>
                                        <option value="" >--Select Employee Name --</option>
                                        {employees && employees.map((emp, index) => {
                                            return <option key={emp.id} value={emp.id}>{emp.emp_name}</option>
                                        })}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            :
                            <Form.Control type="text" placeholder="login_user_id" name="emp_id" value={formik.values.emp_id || loginUser} onChange={formik.handleChange} />
                    }
                    <Col xs={12} md={(isAdmin || employees && employees.length > 0) ? 8 : 4}>
                        <Form.Group className="mb-2" controlId="reason">
                            <Form.Label column="sm">Leave Reason{formik.errors.reason ? <code> *{formik.errors.reason}</code> : null}</Form.Label>
                            <Form.Control as="textarea" rows={4} onChange={formik.handleChange}
                                value={formik.values.reason || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="from_date" >
                            <Form.Label column="sm">From Date{formik.errors.from_date ? <code> *{formik.errors.from_date}</code> : null}</Form.Label>
                            <Form.Control type="date" placeholder="From Date" onChange={formik.handleChange}
                                value={formik.values.from_date || ''} min={new Date().toISOString().slice(0, 10)} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label column="sm">Leaves : {formik.values.leaves}</Form.Label>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label column="sm">Holidays (Sat-Sun-Holidays) : {formik.values.holidays}</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="to_date" >
                            <Form.Label column="sm">To Date{formik.errors.to_date ? <code> *{formik.errors.to_date}</code> : null}</Form.Label>
                            <Form.Control type="date" placeholder="To Date" min={new Date().toISOString().slice(0, 10)} onChange={formik.handleChange}
                                value={formik.values.to_date || ''} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label column="sm">Total No. Days : {formik.values.total_days} {formik.errors.total_days ? <code> *{formik.errors.total_days}</code> : null}</Form.Label>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label column="sm">Excluding [Saturday & Sunday & Holiday]</Form.Label>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} >
                        <div className="d-flex justify-content-end">
                            <Button className='mx-2' variant="light" type="reset">Reset</Button>
                            <Button className='mx-2' variant="primary" type="submit">Submit</Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

