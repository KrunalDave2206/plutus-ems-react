import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FcEditImage, FcViewDetails, FcPlus, FcPositiveDynamic } from 'react-icons/fc';
import { Link } from "react-router-dom";

import { Row, Col, Button, Card, Form, InputGroup, Modal, Accordion, FormControl } from "react-bootstrap";
import { useFormik } from 'formik';
import './Candidates.scss';

import { selectTotalCount, listCandidatesAsync, selectCandidate, selectCandidates, postCandidatesAsync, getCandidateAsync, clearCandidate, selectInterviePanel, updateInterviewPanel, postInterviewAsync, selectIntervieDisplay, getInterviewAsync, replaceInterviewPanel } from "./candidatesSlice";
import { PaginationComp } from "../../../components/pagination/pagination";
import { getProfilesAsync, selectProfiles, selectAllEmployees, getAllEmployeeAsync } from "../../../services/master/masterSlice";

const validate = values => {
    const errors = {};
    if (!values.first_name) errors.first_name = 'Required';
    if (!values.profile_id) errors.profile_id = 'Required';

    return errors;
};

const interviewFormValidate = values => {
    const errors = {};
    if (!values.name) errors.name = 'Required';

    return errors;
};

export const Candidates = () => {
    const dispatch = useDispatch();
    const profiles = useSelector(selectProfiles);
    const employees = useSelector(selectAllEmployees);
    const totalRecords = useSelector(selectTotalCount);
    const candidates = useSelector(selectCandidates);
    const candidate = useSelector(selectCandidate);
    const [pageSize, setPageSize] = useState(15);
    const [page, setPage] = useState(1);

    const interviePanel = useSelector(selectInterviePanel);
    const handleUpdateTeam = (emp_id) => { dispatch(updateInterviewPanel(emp_id)); }
    const [searchEmpKey, setSearchEmpKey] = useState('');

    const [showCandidatePopup, setShowCandidatePopup] = useState(false);
    const [candidateId, setCandidateId] = useState(null);

    const [showInterviewResultPopup, setInterviewResultPopup] = useState(false);
    const displayIntervie = useSelector(selectIntervieDisplay);

    useEffect(() => { dispatch(getProfilesAsync()); dispatch(getAllEmployeeAsync()) }, [dispatch]);
    useEffect(() => { dispatch(listCandidatesAsync({ page, size: pageSize })); }, [dispatch, page, pageSize]);

    const formik = useFormik({
        initialValues: candidate,
        enableReinitialize: true,
        validate,
        onSubmit: async values => {
            await dispatch(postCandidatesAsync(values));
            dispatch(listCandidatesAsync({ page, size: pageSize }));
        },
    });

    const editCandidate = async (candidate_id) => {
        await dispatch(getCandidateAsync({ candidate_id: candidate_id }));
        setShowCandidatePopup(true);
    }

    const clearForm = () => { dispatch(clearCandidate()) }
    const openInterviewResiltPopup = (candidate) => {
        setInterviewResultPopup(true);
        setCandidateId(candidate);
        dispatch(getInterviewAsync({ candidate_id: candidate.id }));
        dispatch(replaceInterviewPanel([]))
    }

    const dummyInterview = { round: "", date: "", time: "", meeting_link: "", interviwee: [] }
    const interviewForm = useFormik({
        initialValues: dummyInterview,
        enableReinitialize: true,
        interviewFormValidate,
        onSubmit: async (values) => {
            let data = { ...values, interviwee: [...interviePanel], datetime: `${values.date} ${values.time}:00`, candidate_id: candidateId.id }
            await dispatch(postInterviewAsync(data));
            await dispatch(getInterviewAsync({ candidate_id: data.candidate_id }));
            interviewForm.resetForm();
        },
    });

    const editInterview = (interview) => {
        interviewForm.setFieldValue('id', interview.id);
        interviewForm.setFieldValue('round', interview.round);
        interviewForm.setFieldValue('date', interview.datetime.split(' ')[0]);
        interviewForm.setFieldValue('time', interview.datetime.split(' ')[1]);
        interviewForm.setFieldValue('meeting_link', interview.meeting_link);
        let ePanel = [];
        for (let pan of displayIntervie.panel) { if (interview.id == pan.interview_id) ePanel.push(pan.employee_id) }
        dispatch(replaceInterviewPanel(ePanel))
    }

    const clearInterviewFOrm = () => {
        interviewForm.resetForm();
        dispatch(replaceInterviewPanel([]))
    }

    const handleSearch = (e) => {
        if (e.charCode == 13)
            dispatch(listCandidatesAsync({ page, size: pageSize, searchKey: e.target.value }));
    }

    return (
        <>
            <Row>
                <Col xs={12} className="candidate-pg-view">
                    <div className='me-3'>
                        <PaginationComp alignment={'vertical'} records={totalRecords} pageSize={pageSize} onChange={setPage} />
                    </div>
                    <div className="candidatef-view">
                        <div className='mb-3 search'>
                            <FormControl type='text' onKeyPress={handleSearch} placeholder='Search > Enter'></FormControl>
                            <FcPlus size={'30px'} className='m-1 cursor-pointer' onClick={() => { clearForm(); setShowCandidatePopup(true) }} />
                        </div>
                        <div className='list'>
                            {candidates && candidates.length > 0 && candidates.map((cad, i) => {
                                return <div className='candidate-view' key={cad.id}>
                                    <div className='detail'>
                                        <div className='emp_no'>
                                            <span>Score: {cad.answer || 'CAD No.'}</span>
                                            <span>Feedback: {cad.feedback}</span>
                                        </div>
                                        <div className='emp_name_d'>{cad.first_name} {cad.last_name} <span>({cad.profile_name})</span></div>
                                        <div className='emp_contact'>
                                            <span>{cad.email}</span>
                                            <span>{cad.contact_number}</span>
                                        </div>
                                        <div className='emp_contact'>
                                            <span>{cad.created_at}</span>
                                            <span>{cad.updated_at}</span>
                                        </div>
                                    </div>
                                    <div className='action'>
                                        <FcViewDetails size={'25px'} tooltip="View" className='mx-1 cursor-pointer' onClick={() => openInterviewResiltPopup(cad)} />
                                        <FcEditImage size={'25px'} tooltip="Edit" className='mx-1 cursor-pointer' onClick={() => editCandidate(cad.id)} />
                                        <Link to={'/career/result/' + cad.id} ><FcPositiveDynamic size={'20px'} tooltip="Result" className='mx-2 cursor-pointer' /></Link>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal backdrop="static" size='xl' className='interview-popup' show={showInterviewResultPopup} onHide={() => setInterviewResultPopup(false)}>
                <Modal.Header closeButton>Interview result for {candidateId && candidateId.first_name} {candidateId && candidateId.last_name}</Modal.Header>
                <Modal.Body>
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex flex-wrap scheduls'>
                            {displayIntervie.interviews && displayIntervie.interviews.map((inter, i) => {
                                return <Card className='me-2 mb-2 align-self-baseline' key={inter.id}>
                                    <Card.Header className='d-flex justify-content-between'>
                                        <div>{inter.round} round</div>
                                        <FcEditImage size={'20px'} onClick={() => editInterview(inter)} />
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Title className='mb-2 h6'>Date: {inter.datetime}</Card.Title>
                                        <h6>Panel:</h6>
                                        <Accordion alwaysOpen>
                                            {displayIntervie.panel.map((pan, i) => {
                                                if (inter.id == pan.interview_id)
                                                    return <Accordion.Item eventKey={i}>
                                                        <Accordion.Header>{pan.interviewee}</Accordion.Header>
                                                        <Accordion.Body><pre>{pan.feedback}</pre></Accordion.Body>
                                                    </Accordion.Item>
                                            })}
                                        </Accordion>
                                    </Card.Body>
                                    <Card.Footer>
                                        <Card.Link href={inter.meeting_link}>Start Meeting</Card.Link>
                                    </Card.Footer>
                                </Card>
                            })}
                        </div>
                        <div style={{ width: '500px' }}>
                            <Form onSubmit={interviewForm.handleSubmit}>
                                <Card>
                                    <Card.Header>Add new</Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xs={12} md={6} >
                                                <Form.Group className="mb-2" controlId="round">
                                                    <Form.Label column="sm">Round{interviewForm.errors.round ? <code> *{interviewForm.errors.round}</code> : null}</Form.Label>
                                                    <Form.Control type="text" placeholder="Round" onChange={interviewForm.handleChange} value={interviewForm.values.round || ''} />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="date">
                                                    <Form.Label column="sm">Date{interviewForm.errors.date ? <code> *{interviewForm.errors.date}</code> : null}</Form.Label>
                                                    <Form.Control type="date" placeholder="Date Time" onChange={interviewForm.handleChange} value={interviewForm.values.date || ''} />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="time">
                                                    <Form.Label column="sm">Time{interviewForm.errors.time ? <code> *{interviewForm.errors.time}</code> : null}</Form.Label>
                                                    <Form.Control type="time" placeholder="Date Time" onChange={interviewForm.handleChange} value={interviewForm.values.time || ''} />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="meeting_link">
                                                    <Form.Label column="sm">Meeting Link{interviewForm.errors.meeting_link ? <code> *{interviewForm.errors.meeting_link}</code> : null}</Form.Label>
                                                    <Form.Control type="text" placeholder="Meeting Link" onChange={interviewForm.handleChange} value={interviewForm.values.meeting_link || ''} />
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12} md={6} className="interview-panel">
                                                <Form.Label column="sm">Interview Panel</Form.Label>
                                                <Form.Control type="text" className='mb-1' placeholder="Search" onChange={(e) => { setSearchEmpKey(e.target.value) }} value={searchEmpKey} />
                                                <div className='team-list'>
                                                    {employees && employees.map((emp, i) => {
                                                        if (interviePanel.indexOf(emp.id) > -1)
                                                            return <div className="caps active" key={emp.id} onClick={() => handleUpdateTeam(emp.id)}>{emp.first_name} {emp.last_name}</div>
                                                    })}
                                                </div>
                                                <div className='team-list'>
                                                    {employees && employees.map((emp, i) => {
                                                        if (interviePanel.indexOf(emp.id) == -1 && ((searchEmpKey && (emp.first_name.toLowerCase().startsWith(searchEmpKey.toLowerCase()) || emp.last_name.toLowerCase().startsWith(searchEmpKey.toLowerCase()))) || searchEmpKey == ''))
                                                            return <div className="caps" key={emp.id} onClick={() => handleUpdateTeam(emp.id)}>{emp.first_name} {emp.last_name}</div>
                                                    })}
                                                </div>
                                                {/* <ListGroup>
                                                    {employees && employees.map((emp, i) => {
                                                        if ((searchEmpKey && (emp.first_name.toLowerCase().startsWith(searchEmpKey.toLowerCase()) || emp.last_name.toLowerCase().startsWith(searchEmpKey.toLowerCase()))) || searchEmpKey == '')
                                                            return <ListGroup.Item key={emp.id} type='button' active={interviePanel.indexOf(emp.id) > -1} action onClick={() => handleUpdateTeam(emp.id)}>{emp.first_name} {emp.last_name}</ListGroup.Item>
                                                    })}
                                                </ListGroup> */}
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                    <Card.Footer>
                                        <div className="d-flex justify-content-end">
                                            <Button className='mx-2' variant="light" type="button" onClick={clearInterviewFOrm}>Clear</Button>
                                            <Button className='mx-2 btn-cut-primary' variant="primary" onClick={interviewForm.handleSubmit} type="button">Submit</Button>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Form>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal backdrop="static" size="xl" show={showCandidatePopup} onHide={() => setShowCandidatePopup(false)}>
                <Modal.Header closeButton>Candidate</Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Row>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="profile_id">
                                    <Form.Label column="sm">Profile{formik.errors.profile_id ? <code> *{formik.errors.profile_id}</code> : null}</Form.Label>
                                    <Form.Select aria-label="Profile" onChange={formik.handleChange}
                                        value={formik.values.profile_id || ''}>
                                        <option>Select Profile</option>
                                        {profiles && profiles.length > 0 && profiles.map((prof, i) => { return <option key={prof.id} value={prof.id}>{prof.name}</option> })}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="hr">
                                    <Form.Label column="sm">HR{formik.errors.hr ? <code> *{formik.errors.hr}</code> : null}</Form.Label>
                                    <Form.Select aria-label="HR" onChange={formik.handleChange}
                                        value={formik.values.hr || ''}>
                                        <option>Select HR</option>
                                        {employees && employees.length > 0 && employees.map((emp, i) => { return <option key={emp.id} value={emp.id}>{emp.emp_name}</option> })}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="refered_by">
                                    <Form.Label column="sm">Refered By{formik.errors.refered_by ? <code> *{formik.errors.refered_by}</code> : null}</Form.Label>
                                    <Form.Select aria-label="HR" onChange={formik.handleChange}
                                        value={formik.values.refered_by || ''}>
                                        <option>Select Employee</option>
                                        {employees && employees.length > 0 && employees.map((emp, i) => { return <option key={emp.id} value={emp.id}>{emp.emp_name}</option> })}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="first_name">
                                    <Form.Label column="sm">First Name{formik.errors.first_name ? <code> *{formik.errors.first_name}</code> : null}</Form.Label>
                                    <Form.Control type="text" placeholder="First Name" onChange={formik.handleChange}
                                        value={formik.values.first_name || ''} />
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="middle_name">
                                    <Form.Label column="sm">Middle Name{formik.errors.middle_name ? <code> *{formik.errors.middle_name}</code> : null}</Form.Label>
                                    <Form.Control type="text" placeholder="Middle Name" onChange={formik.handleChange}
                                        value={formik.values.middle_name || ''} />
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="last_name">
                                    <Form.Label column="sm">Last Name{formik.errors.last_name ? <code> *{formik.errors.last_name}</code> : null}</Form.Label>
                                    <Form.Control type="text" placeholder="Last Name" onChange={formik.handleChange}
                                        value={formik.values.last_name || ''} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="email">
                                    <Form.Label column="sm">Email{formik.errors.email ? <code> *{formik.errors.email}</code> : null}</Form.Label>
                                    <Form.Control type="text" placeholder="Email" onChange={formik.handleChange}
                                        value={formik.values.email || ''} />
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="contact_number">
                                    <Form.Label column="sm">Contact number{formik.errors.contact_number ? <code> *{formik.errors.contact_number}</code> : null}</Form.Label>
                                    <Form.Control type="text" placeholder="Contact number" onChange={formik.handleChange}
                                        value={formik.values.contact_number || ''} />
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="alternate_contact_number">
                                    <Form.Label column="sm">Alt. Contact Number{formik.errors.alternate_contact_number ? <code> *{formik.errors.alternate_contact_number}</code> : null}</Form.Label>
                                    <Form.Control type="text" placeholder="Alt. Contact Number" onChange={formik.handleChange}
                                        value={formik.values.alternate_contact_number || ''} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="current_location">
                                    <Form.Label column="sm">Current location{formik.errors.current_location ? <code> *{formik.errors.current_location}</code> : null}</Form.Label>
                                    <Form.Control type="text" placeholder="Current location" onChange={formik.handleChange}
                                        value={formik.values.current_location || ''} />
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="preferred_location">
                                    <Form.Label column="sm">Preferred location{formik.errors.preferred_location ? <code> *{formik.errors.preferred_location}</code> : null}</Form.Label>
                                    <Form.Control type="text" placeholder="Preferred location" onChange={formik.handleChange}
                                        value={formik.values.preferred_location || ''} />
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="resume">
                                    <Form.Label column="sm">Resume{formik.errors.resume ? <code> *{formik.errors.resume}</code> : null}</Form.Label>
                                    <Form.Control type="file" placeholder="Resume" onChange={formik.handleChange}
                                        value={formik.values.resume || ''} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="gender">
                                    <Form.Label column="sm">Gender{formik.errors.gender ? <code> *{formik.errors.gender}</code> : null}</Form.Label>
                                    <Form.Select aria-label="Gender" onChange={formik.handleChange}
                                        value={formik.values.gender || ''}>
                                        <option>Select Gender</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="current_ctc">
                                    <Form.Label column="sm">Current CTC{formik.errors.current_ctc ? <code> *{formik.errors.current_ctc}</code> : null}</Form.Label>
                                    <InputGroup>
                                        <Form.Control type="number" placeholder="Current CTC" onChange={formik.handleChange}
                                            value={formik.values.current_ctc || ''} aria-describedby="current_ctc2" />
                                        <InputGroup.Text id="current_ctc2">LPA</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="expected_ctc">
                                    <Form.Label column="sm">Expected CTC{formik.errors.expected_ctc ? <code> *{formik.errors.expected_ctc}</code> : null}</Form.Label>
                                    <InputGroup>
                                        <Form.Control type="number" placeholder="Expected CTC" onChange={formik.handleChange}
                                            value={formik.values.expected_ctc || ''} aria-describedby="expected_ctc2" />
                                        <InputGroup.Text id="expected_ctc2">LPA</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="marital_status">
                                    <Form.Label column="sm">Marital Status{formik.errors.marital_status ? <code> *{formik.errors.marital_status}</code> : null}</Form.Label>
                                    <Form.Select aria-label="Marital Status" onChange={formik.handleChange}
                                        value={formik.values.marital_status || ''}>
                                        <option>Select Marital Status</option>
                                        <option>Single</option>
                                        <option>Married</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="total_experience">
                                    <Form.Label column="sm">Total Experience{formik.errors.total_experience ? <code> *{formik.errors.total_experience}</code> : null}</Form.Label>
                                    <Form.Control type="number" placeholder="Total Experience" onChange={formik.handleChange}
                                        value={formik.values.total_experience || ''} />
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="relevant_experience">
                                    <Form.Label column="sm">Relevant Experience{formik.errors.relevant_experience ? <code> *{formik.errors.relevant_experience}</code> : null}</Form.Label>
                                    <Form.Control type="number" placeholder="Relevant Experience" onChange={formik.handleChange}
                                        value={formik.values.relevant_experience || ''} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="source">
                                    <Form.Label column="sm">Source{formik.errors.source ? <code> *{formik.errors.source}</code> : null}</Form.Label>
                                    <Form.Select aria-label="Source" onChange={formik.handleChange}
                                        value={formik.values.source || ''}>
                                        <option>Select Gender</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="communication">
                                    <Form.Label column="sm">Communication{formik.errors.communication ? <code> *{formik.errors.communication}</code> : null}</Form.Label>
                                    <Form.Control type="text" placeholder="Communication" onChange={formik.handleChange}
                                        value={formik.values.communication || ''} />
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="notice_period">
                                    <Form.Label column="sm">Notice Period{formik.errors.notice_period ? <code> *{formik.errors.notice_period}</code> : null}</Form.Label>
                                    <InputGroup>
                                        <Form.Control type="number" placeholder="Notice Period" onChange={formik.handleChange}
                                            value={formik.values.notice_period || ''} aria-describedby="notice_period2" />
                                        <InputGroup.Text id="notice_period2">Month</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="job_description">
                                    <Form.Label column="sm">Job Description{formik.errors.job_description ? <code> *{formik.errors.job_description}</code> : null}</Form.Label>
                                    <Form.Control as="textarea" rows={4} placeholder="Job Description" onChange={formik.handleChange}
                                        value={formik.values.job_description || ''} />
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="notes">
                                    <Form.Label column="sm">Notes{formik.errors.notes ? <code> *{formik.errors.notes}</code> : null}</Form.Label>
                                    <Form.Control as="textarea" rows={4} placeholder="Notes" onChange={formik.handleChange}
                                        value={formik.values.notes || ''} />
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-2" controlId="reason_for_change">
                                    <Form.Label column="sm">Reason for change{formik.errors.reason_for_change ? <code> *{formik.errors.reason_for_change}</code> : null}</Form.Label>
                                    <Form.Control as="textarea" rows={4} placeholder="Reason for change" onChange={formik.handleChange}
                                        value={formik.values.reason_for_change || ''} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex justify-content-end">
                        <Button className='mx-2' onClick={clearForm} variant="light" type="reset">Clear</Button>
                        <Button className='mx-2 btn-cut-primary' variant="primary" type="button" onClick={formik.handleSubmit}>Submit</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}