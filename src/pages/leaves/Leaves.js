import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { ButtonGroup, Row, Col, Stack, Form, Button, Modal, Card } from "react-bootstrap";
import { FcEditImage, FcDeleteDatabase, FcDecision } from 'react-icons/fc';
import { selectLeaves, listLeavesAsync, updateLeaveAsync, selectLeavesCount } from "./leaveSlice";

import { PaginationComp } from "../../components/pagination/pagination";

import { LeaveForm } from "./leaveForm/LeaveForm";
import { getLeaveAsync, removeLeaveData } from "./leaveForm/leaveFormSlice";

import { getEmployeesAsync, selectEmployees } from "../../services/master/masterSlice";

import './Leaves.scss';

export const Leaves = () => {
    const dispatch = useDispatch();
    const [showConfirmBox, setShowConfirmBox] = useState(false);

    const [updateLeaveID, setUpdateLeaveID] = useState(null);
    const [updateLeaveType, setUpdateLeaveType] = useState(null);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showActionPopup, setShowActionPopup] = useState(false);
    const [leaveToAction, setLeaveToAction] = useState(null);

    const records = useSelector(selectLeavesCount);
    const leaves = useSelector(selectLeaves);
    const employees = useSelector(selectEmployees);

    const loginUser = JSON.parse(localStorage.getItem('user'));
    const isAdmin = (loginUser.role_name == 'Admin') ? true : false;
    const isEmp = (loginUser.role_name == 'Admin') ? "" : loginUser.id;

    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [empId, setEmpID] = useState('');
    const [from_date, setFromDate] = useState('');
    const [to_date, setToDate] = useState('');
    const [leaveStatus, setLeaveStatus] = useState('');
    const [leaveAction, setLeaveAction] = useState(null);

    const leaveType = ['Pending', 'Approved', 'Rejected', 'Cancelled'];

    useEffect(() => { dispatch(listLeavesAsync({ page, size: pageSize, admin: isAdmin, emp_id: isEmp })); }, [dispatch, page, pageSize, isEmp]);
    useEffect(() => { dispatch(getEmployeesAsync(isEmp)) }, [dispatch, employees.lenght]);

    const editLeave = (leave_id) => { dispatch(getLeaveAsync(leave_id)); setShowAddPopup(true) }
    const fetchLeaves = () => {
        dispatch(listLeavesAsync({ page, size: pageSize, admin: isAdmin, emp_id: isEmp }));
    }

    const openLeaveActionPopup = (leave) => { setShowActionPopup(true); setLeaveToAction(leave); }
    const closeLeaveActionPopup = () => { setShowActionPopup(false); setLeaveToAction(null); }
    const confirmationBoxClose = () => { setShowConfirmBox(false); }
    const handleLeaveUpdateSave = async () => {
        await dispatch(updateLeaveAsync({ leave_id: leaveToAction.id, leaveType: leaveAction }));
        setShowConfirmBox(false);
        closeLeaveActionPopup();
        setLeaveAction(null);
        fetchLeaves();
    }

    const openConfimationBox = (type) => { setShowConfirmBox(true); setLeaveAction(type); }

    const handleChange = (e) => {
        if (e.target.name === 'from_date') setFromDate(e.target.value);
        else if (e.target.name === 'to_date') setToDate(e.target.value);
        else if (e.target.name === 'empId') setEmpID(e.target.value);
        else if (e.target.name === 'leaveStatus') setLeaveStatus(e.target.value);
    }

    const searchLeave = () => {
        dispatch(listLeavesAsync({ page, size: pageSize, admin: isAdmin, emp_id: empId != '' ? empId : isEmp, from_date: from_date, to_date: to_date, leaveStatus: leaveStatus }));
    }
    const clearSearch = () => {
        setFromDate('');
        setToDate('');
        setEmpID('');
        setLeaveStatus('');
        dispatch(listLeavesAsync({ page, size: pageSize, admin: isAdmin, emp_id: isEmp }));
    }
    return (
        <>
            <div className="page-header-actions mb-4">
                <Stack direction="horizontal" gap={3}>
                    <div className="d-flex flex-row">
                        <Form.Control className="mx-1" type="text"
                            onFocus={(e) => e.target.type = "date"}
                            onBlur={e => e.target.type = "text"}
                            name="from_date" placeholder="From Date"
                            value={from_date} onChange={handleChange} />
                        <Form.Control className="mx-1" type="text"
                            onFocus={(e) => e.target.type = "date"}
                            onBlur={e => e.target.type = "text"}
                            name="to_date" placeholder="To Date"
                            value={to_date} onChange={handleChange} />
                        {employees && employees.length > 0 &&
                            <Form.Select className="mx-1" aria-label="Default select example" name="empId" value={empId} onChange={handleChange}>
                                <option value="" >Employee</option>
                                {employees && employees.map((emp, index) => <option key={emp.id} value={emp.id}>{emp.emp_name}</option>)}
                            </Form.Select>
                        }
                        <Form.Select className="mx-1" aria-label="Default select example" name="leaveStatus" value={leaveStatus} onChange={handleChange}>
                            <option value="">Leave Type</option>
                            {leaveType.map((leave, index) => <option key={index} value={index}>{leave}</option>)}
                        </Form.Select>
                        <ButtonGroup className="mx-1" >
                            <Button className="btn-cut-outline me-2" variant="light" onClick={() => clearSearch()}>Clear</Button>
                            <Button className="btn-cut-submit-outline" variant="light" onClick={() => searchLeave()}>Search</Button>
                        </ButtonGroup>
                    </div>
                    <Button className="ms-2 btn-cut-submit-outline"
                        onClick={() => {
                            dispatch(removeLeaveData());
                            setShowAddPopup(true)
                        }} variant={'light'} >Apply</Button>
                </Stack>
            </div>
            <Stack direction="horizontal" gap={2} className="leaves-pag-view al-ss">
                <div>
                    <PaginationComp alignment={'vertical'} records={records} pageSize={pageSize} onChange={setPage} />
                </div>
                <div className="leaves-view">
                    {leaves && leaves.length > 0 && leaves.map((leave, i) => {
                        return <div className='leave-view'>
                            <div className="action">
                                <FcEditImage size={'20px'} tooltip="Edit" className='mx-1 cursor-pointer' onClick={() => editLeave(leave.id)} />
                                <FcDecision size={'20px'} tooltip="Delete" className='mx-1 cursor-pointer' onClick={() => openLeaveActionPopup(leave)} />
                            </div>
                            <div className="detail">
                                <div className='emp_no'>
                                    <span>{leave.type}</span>
                                    <span>{leave.status}</span>
                                </div>
                                <div className='emp_name_d'>{leave.emp_name}({leave.total_days}) {leave.reporting_manager && <span>({leave.reporting_manager})</span>}</div>
                                <div className='emp_no'>
                                    <span>{leave.from_date}</span>
                                    <span>{leave.to_date}</span>
                                </div>
                                <div className='emp_contact'>
                                    <span>{leave.reason}</span>
                                </div>
                                <div className='emp_no'>
                                    <span>{leave.added_date}</span>
                                    <span>{leave.created_by}</span>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
                <div style={{ width: '30%' }}>
                    {showActionPopup && <>
                        <Card className="mb-4">
                            <Card.Body>
                                <Stack gap={3}>
                                    <Stack gap={3} className='justify-content-center'>
                                        {leaveToAction && <>
                                            <Stack gap={1}>
                                                <Stack direction="horizontal" className="justify-content-between">
                                                    <span>{leaveToAction.type}</span>
                                                    <span>{leaveToAction.status}</span>
                                                </Stack>
                                                <Stack direction="horizontal" className="justify-content-start">
                                                    <h5 className="font-cust-color">{leaveToAction.emp_name}({leaveToAction.total_days})</h5>
                                                    {leaveToAction.reporting_manager && <span>({leaveToAction.reporting_manager})</span>}
                                                </Stack>
                                                <Stack direction="horizontal" className="justify-content-between">
                                                    <span>{leaveToAction.from_date}</span>
                                                    <span>{leaveToAction.to_date}</span>
                                                </Stack>
                                                <Stack direction="horizontal" className="justify-content-start font-cust-color">
                                                    <span>{leaveToAction.reason}</span>
                                                </Stack>
                                                <Stack direction="horizontal" className="justify-content-between">
                                                    <span>{leaveToAction.added_date}</span>
                                                    <span>{leaveToAction.created_by}</span>
                                                </Stack>
                                            </Stack></>}
                                    </Stack>
                                    <Stack gap={3} className='justify-content-center'>
                                        {leaveToAction.leave_status != 1 &&
                                            <Button size="lg" variant='success' onClick={() => { openConfimationBox(1); }}>Approve</Button>}
                                        {leaveToAction.leave_status != 2 &&
                                            <Button size="lg" variant='primary' onClick={() => { openConfimationBox(2); }}>Reject</Button>}
                                        <Button size="lg" variant='danger' onClick={() => { openConfimationBox(3); }}>Permanently Delete</Button>
                                        <Button size="lg" variant='secondary' onClick={closeLeaveActionPopup}>Close</Button>
                                    </Stack>
                                </Stack>
                            </Card.Body>
                        </Card>
                    </>}
                    {showAddPopup && <Card>
                        <Card.Body>
                            <LeaveForm fetchLeaves={fetchLeaves} closePopup={() => setShowAddPopup(false)} />
                        </Card.Body>
                    </Card>}
                </div>
            </Stack>
            <Modal size="sm" backdrop="static" show={showConfirmBox} onHide={() => confirmationBoxClose()}>
                <Modal.Header closeButton><Modal.Title>Confirm</Modal.Title></Modal.Header>
                <Modal.Body className="d-grid gap-2">
                    {leaveAction == 1 && <Button size="lg" variant='success' onClick={() => { handleLeaveUpdateSave(); }}>Approve</Button>}
                    {leaveAction == 2 && <Button size="lg" variant='primary' onClick={() => { handleLeaveUpdateSave(); }}>Reject</Button>}
                    {leaveAction == 3 && <Button size="lg" variant='danger' onClick={() => { handleLeaveUpdateSave(); }}>Permanently Delete</Button>}
                </Modal.Body>
            </Modal>
        </>
    )
}