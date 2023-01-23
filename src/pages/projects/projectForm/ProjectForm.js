import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './ProjectForm.scss';
import { useFormik } from 'formik';

import { Row, Col, Form, Button, ListGroup, InputGroup, Stack } from "react-bootstrap";
import { CgRemove } from "react-icons/cg";
import { BsArrowDownCircle, BsArrowUpCircle } from "react-icons/bs";

import { postProjectAsync, selectProject, selectTeam, updateTeam, selectTaskStatus, addStatus, removeStatus, moveStatus, putTeamAsync } from "./projectFormSlice";
import { getClientsAsync, selectClients, getEmployeesAsync, selectEmployees } from "../../../services/master/masterSlice";

import { PERMISSIONS } from "../../../services/constants";
const validate = values => {
    const errors = {};
    if (!values.name) errors.name = 'Required';
    if (!values.task_prefix) errors.task_prefix = 'Required';

    return errors;
};

export const ProjectForm = (props) => {
    const dispatch = useDispatch();
    // const [searchEmpKey, setSearchEmpKey] = useState('');
    // const [searchPMKey, setSearchPMKey] = useState('');
    const [addTStatus, setAddTStatus] = useState('');
    const clients = useSelector(selectClients);
    const employees = useSelector(selectEmployees);
    const project = useSelector(selectProject);
    const team = useSelector(selectTeam);
    const taskStatus = useSelector(selectTaskStatus);
    const dummyProject = {
        name: "",
        description: "",
        details: "",
        task_prefix: "",
        hours_per_week: "",
        client_id: "",
        project_manager: "",
        project_bde: ""
    }
    useEffect(() => { dispatch(getClientsAsync()); }, [dispatch, clients.length])
    useEffect(() => { dispatch(getEmployeesAsync()); }, [dispatch, employees.length])
    const formik = useFormik({
        initialValues: project && project.id ? project : dummyProject,
        enableReinitialize: true,
        validate,
        onSubmit: async values => {
            await dispatch(postProjectAsync({ ...values, team, statuses: taskStatus }))
            if (props.onSubmit) props.onSubmit();
        },
    });
    const handleUpdateTeam = (emp_id) => { dispatch(updateTeam(emp_id)); }
    const handlePMUpdate = (emp_id) => { formik.setFieldValue('project_manager', emp_id) }
    const addStatusHandle = () => { if (addTStatus.length) { dispatch(addStatus(addTStatus)); setAddTStatus('') } }
    const removeTatusHandle = (status) => { dispatch(removeStatus(status)); }
    const moveTStatus = (from, to) => { dispatch(moveStatus({ from, to })) }
    return (
        <>
            <Form onSubmit={formik.handleSubmit}>
                <Stack gap={2}>
                    <Form.Group controlId="name" className='d-flex'>
                        <Form.Label column="sm">Name{formik.errors.name ? <code> *{formik.errors.name}</code> : null}</Form.Label>
                        <Form.Control className='w-70' type="text" placeholder="Name" onChange={formik.handleChange}
                            value={formik.values.name || ''} />
                    </Form.Group>
                    <Form.Group controlId="client_id" className='d-flex'>
                        <Form.Label column="sm">Client{formik.errors.client_id ? <code> *{formik.errors.client_id}</code> : null}</Form.Label>
                        <Form.Select className='w-70' aria-label="Default select example" onChange={formik.handleChange}
                            value={formik.values.client_id || ''}>
                            <option>Select Client</option>
                            {clients && clients.map((item, index) => {
                                return <option key={item.id} value={item.id}>{item.name}</option>
                            })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="hours_per_week" className='d-flex'>
                        <Form.Label column="sm">Hours Per Week{formik.errors.hours_per_week ? <code> *{formik.errors.hours_per_week}</code> : null}</Form.Label>
                        <Form.Control className='w-70' type="text" placeholder="Hours Per Week" onChange={formik.handleChange}
                            value={formik.values.hours_per_week || ''} />
                    </Form.Group>
                    <Form.Group controlId="task_prefix" className='d-flex'>
                        <Form.Label column="sm">Task Prefix{formik.errors.task_prefix ? <code> *{formik.errors.task_prefix}</code> : null}</Form.Label>
                        <Form.Control className='w-70' type="text" placeholder="Task Prefix" onChange={formik.handleChange}
                            value={formik.values.task_prefix || ''} />
                    </Form.Group>
                    <Form.Label>Custome Status:</Form.Label>
                    <InputGroup>
                        <Form.Control placeholder="Add status" aria-label="Add status" aria-describedby="basic-addon2"
                            value={addTStatus} onChange={e => setAddTStatus(e.target.value)} />
                        <Button variant="light" onClick={addStatusHandle} >Add</Button>
                    </InputGroup>
                    <ListGroup className='status-list'>
                        {taskStatus && taskStatus.map((st, i) => {
                            return <ListGroup.Item key={i} type='button' className='py-0' style={{ 'padding-right': '0px' }} >
                                <div className='float-start mt-2'>{st}</div>
                                <Button variant='light' className='float-end'><CgRemove style={{ color: '#dc3545' }} onClick={() => removeTatusHandle(st)} /></Button>
                                <Button variant='light' className='float-end'><BsArrowDownCircle onClick={() => moveTStatus(i, i + 1)} /></Button>
                                <Button variant='light' className='float-end'><BsArrowUpCircle onClick={() => moveTStatus(i, i - 1)} /></Button>
                            </ListGroup.Item>
                        })}
                    </ListGroup>
                </Stack>
                <Stack direction='horizontal' gap={3} className="justify-content-end mt-3">
                    <Button className='mx-2' variant="light" type="reset">Reset</Button>
                    <Button className='mx-2 btn-cut-submit' variant="primary" type="submit">Submit</Button>
                </Stack>
            </Form>
        </>
    )
}

export const ProjectTeamForm = (props) => {
    const dispatch = useDispatch();
    const [searchEmpKey, setSearchEmpKey] = useState('');
    const [searchPMKey, setSearchPMKey] = useState('');
    // const [addTStatus, setAddTStatus] = useState('');
    const employees = useSelector(selectEmployees);
    const project = useSelector(selectProject);
    const team = useSelector(selectTeam);
    const dummyProject = {
        name: "",
        description: "",
        details: "",
        task_prefix: "",
        hours_per_week: "",
        client_id: "",
        project_manager: "",
        project_bde: ""
    }
    useEffect(() => { dispatch(getEmployeesAsync()); }, [dispatch])
    const formik = useFormik({
        initialValues: project && project.id ? project : dummyProject,
        enableReinitialize: true,
        validate,
        onSubmit: async values => {
            await dispatch(putTeamAsync({
                team: [...team],
                project_id: project.id,
                project_manager: values.project_manager
            }))
            if (props.onSubmit) props.onSubmit();
        },
    });
    const handleUpdateTeam = (emp_id) => { dispatch(updateTeam(emp_id)); }
    const handlePMUpdate = (emp_id) => { formik.setFieldValue('project_manager', emp_id) }
    return (
        <>
            <Form onSubmit={formik.handleSubmit}>
                <Stack direction='horizontal' gap={4} >
                    <Stack gap={2} className="proj-team w-50">
                        <h5 column="sm">Team</h5>
                        <Form.Control type="text" className='mb-2' placeholder="Search" onChange={(e) => { setSearchEmpKey(e.target.value) }} value={searchEmpKey} />
                        <div className='team-list'>
                            {employees && employees.map((emp, i) => {
                                if (team.indexOf(emp.id) > -1) {
                                    return <div className="caps active" key={emp.id}
                                        onClick={() => handleUpdateTeam(emp.id)}>{emp.first_name} {emp.last_name}</div>
                                }
                            })}
                        </div>
                        <div className='team-list'>
                            {employees && employees.map((emp, i) => {
                                if (((searchEmpKey && (emp.first_name.toLowerCase().startsWith(searchEmpKey.toLowerCase()) || emp.last_name.toLowerCase().startsWith(searchEmpKey.toLowerCase()))) || searchEmpKey == '') && team.indexOf(emp.id) == -1) {
                                    return <div className="caps" key={emp.id}
                                        onClick={() => handleUpdateTeam(emp.id)}>{emp.first_name} {emp.last_name}</div>
                                }
                            })}
                        </div>
                    </Stack>
                    <Stack gap={2} className="proj-team w-50">
                        <h5 column="sm">Manger</h5>
                        <Form.Control type="text" className='mb-2' placeholder="Search" onChange={(e) => { setSearchPMKey(e.target.value) }} value={searchPMKey} />
                        <div className='team-list'>
                            {employees && employees.map((emp, i) => {
                                if (formik.values.project_manager == emp.id) {
                                    return <div className="caps active" key={emp.id} >{emp.first_name} {emp.last_name}</div>
                                }
                            })}
                        </div>
                        <div className='team-list'>
                            {employees && employees.map((emp, i) => {
                                if (((searchPMKey && (emp.first_name.toLowerCase().startsWith(searchPMKey.toLowerCase()) || emp.last_name.toLowerCase().startsWith(searchPMKey.toLowerCase()))) || searchPMKey == '') && formik.values.project_manager !== emp.id) {
                                    return <div className="caps" key={emp.id}
                                        onClick={() => handlePMUpdate(emp.id)}>{emp.first_name} {emp.last_name}</div>
                                }
                            })}
                        </div>
                    </Stack>
                </Stack>
                <Stack direction='horizontal' gap={3} className="justify-content-end mt-3">
                    <Button className='mx-2' variant="light" type="reset">Reset</Button>
                    <Button className='mx-2 btn-cut-submit' variant="primary" type="submit">Submit</Button>
                </Stack>
            </Form>
        </>
    )
}

export const ProjectForm_old = (props) => {
    const dispatch = useDispatch();
    const [searchEmpKey, setSearchEmpKey] = useState('');
    const [searchPMKey, setSearchPMKey] = useState('');
    const [addTStatus, setAddTStatus] = useState('');
    const clients = useSelector(selectClients);
    const employees = useSelector(selectEmployees);
    const project = useSelector(selectProject);
    const team = useSelector(selectTeam);
    const taskStatus = useSelector(selectTaskStatus);
    const dummyProject = {
        name: "",
        description: "",
        details: "",
        task_prefix: "",
        hours_per_week: "",
        client_id: "",
        project_manager: "",
        project_bde: ""
    }
    useEffect(() => { dispatch(getClientsAsync()); }, [dispatch, clients.length])
    useEffect(() => { dispatch(getEmployeesAsync()); }, [dispatch, employees.length])
    const formik = useFormik({
        initialValues: project && project.id ? project : dummyProject,
        enableReinitialize: true,
        validate,
        onSubmit: async values => {
            await dispatch(postProjectAsync({ ...values, team, statuses: taskStatus }))
            if (props.onSubmit) props.onSubmit();
        },
    });
    const handleUpdateTeam = (emp_id) => { dispatch(updateTeam(emp_id)); }
    const handlePMUpdate = (emp_id) => { formik.setFieldValue('project_manager', emp_id) }
    const addStatusHandle = () => { if (addTStatus.length) { dispatch(addStatus(addTStatus)); setAddTStatus('') } }
    const removeTatusHandle = (status) => { dispatch(removeStatus(status)); }
    const moveTStatus = (from, to) => { dispatch(moveStatus({ from, to })) }
    return (
        <>
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                    <Col xs={12} md={3} >
                        <Form.Group className="mb-2" controlId="name">
                            <Form.Label column="sm">Name{formik.errors.name ? <code> *{formik.errors.name}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="Name" onChange={formik.handleChange}
                                value={formik.values.name || ''} />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="client_id">
                            <Form.Label column="sm">Client{formik.errors.client_id ? <code> *{formik.errors.client_id}</code> : null}</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={formik.handleChange}
                                value={formik.values.client_id || ''}>
                                <option>Select Client</option>
                                {clients && clients.map((item, index) => {
                                    return <option key={item.id} value={item.id}>{item.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="hours_per_week">
                            <Form.Label column="sm">Hours Per Week{formik.errors.hours_per_week ? <code> *{formik.errors.hours_per_week}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="Hours Per Week" onChange={formik.handleChange}
                                value={formik.values.hours_per_week || ''} />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="task_prefix">
                            <Form.Label column="sm">Task Prefix{formik.errors.task_prefix ? <code> *{formik.errors.task_prefix}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="Task Prefix" onChange={formik.handleChange}
                                value={formik.values.task_prefix || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3} className="proj-team">
                        <Form.Label column="sm">Team</Form.Label>
                        <Form.Control type="text" className='mb-2' placeholder="Search" onChange={(e) => { setSearchEmpKey(e.target.value) }} value={searchEmpKey} />
                        <div className='team-list'>
                            {employees && employees.map((emp, i) => {
                                if (team.indexOf(emp.id) > -1) {
                                    return <div className="caps active" key={emp.id}
                                        onClick={() => handleUpdateTeam(emp.id)}>{emp.first_name} {emp.last_name}</div>
                                }
                            })}
                        </div>
                        <div className='team-list'>
                            {employees && employees.map((emp, i) => {
                                if (((searchEmpKey && (emp.first_name.toLowerCase().startsWith(searchEmpKey.toLowerCase()) || emp.last_name.toLowerCase().startsWith(searchEmpKey.toLowerCase()))) || searchEmpKey == '') && team.indexOf(emp.id) == -1) {
                                    return <div className="caps" key={emp.id}
                                        onClick={() => handleUpdateTeam(emp.id)}>{emp.first_name} {emp.last_name}</div>
                                }
                            })}
                        </div>
                    </Col>
                    <Col xs={12} md={3} className="proj-team">
                        <Form.Label column="sm">Project Manger</Form.Label>
                        <Form.Control type="text" className='mb-2' placeholder="Search" onChange={(e) => { setSearchPMKey(e.target.value) }} value={searchPMKey} />
                        <div className='team-list'>
                            {employees && employees.map((emp, i) => {
                                if (formik.values.project_manager == emp.id) {
                                    return <div className="caps active" key={emp.id} >{emp.first_name} {emp.last_name}</div>
                                }
                            })}
                        </div>
                        <div className='team-list'>
                            {employees && employees.map((emp, i) => {
                                if (((searchPMKey && (emp.first_name.toLowerCase().startsWith(searchPMKey.toLowerCase()) || emp.last_name.toLowerCase().startsWith(searchPMKey.toLowerCase()))) || searchPMKey == '') && formik.values.project_manager !== emp.id) {
                                    return <div className="caps" key={emp.id}
                                        onClick={() => handlePMUpdate(emp.id)}>{emp.first_name} {emp.last_name}</div>
                                }
                            })}
                        </div>
                    </Col>
                    <Col xs={12} md={3} >
                        <Form.Label column="sm">Custome Status:</Form.Label>
                        <InputGroup className="mb-1">
                            <Form.Control placeholder="Add status" aria-label="Add status" aria-describedby="basic-addon2"
                                value={addTStatus} onChange={e => setAddTStatus(e.target.value)} />
                            <Button variant="light" onClick={addStatusHandle} >Add</Button>
                        </InputGroup>
                        <ListGroup className='status-list'>
                            {taskStatus && taskStatus.map((st, i) => {
                                return <ListGroup.Item key={i} type='button' className='py-0' style={{ 'padding-right': '0px' }} >
                                    <div className='float-start mt-2'>{st}</div>
                                    <Button variant='light' className='float-end'><CgRemove style={{ color: '#dc3545' }} onClick={() => removeTatusHandle(st)} /></Button>
                                    <Button variant='light' className='float-end'><BsArrowDownCircle onClick={() => moveTStatus(i, i + 1)} /></Button>
                                    <Button variant='light' className='float-end'><BsArrowUpCircle onClick={() => moveTStatus(i, i - 1)} /></Button>
                                </ListGroup.Item>
                            })}
                        </ListGroup>

                    </Col>
                </Row>
                <Row>
                    <Col xs={6} md={6} >
                        <Form.Group className="mb-2" controlId="description">
                            <Form.Label column="sm">Description{formik.errors.description ? <code> *{formik.errors.description}</code> : null}</Form.Label>
                            <Form.Control as="textarea" rows={4} onChange={formik.handleChange}
                                value={formik.values.description || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={6} md={6} >
                        <Form.Group className="mb-2" controlId="details">
                            <Form.Label column="sm">Technical Specification:{formik.errors.details ? <code> *{formik.errors.details}</code> : null}</Form.Label>
                            <Form.Control as="textarea" rows={4} onChange={formik.handleChange}
                                value={formik.values.details || ''} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <Col xs={12} >
                        <div className="d-flex justify-content-end">
                            <Button className='mx-2' variant="light" type="reset">Reset</Button>
                            <Button className='mx-2 btn-cut-submit' variant="primary" type="submit">Submit</Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export const SearchProject = (props) => {
    const dispatch = useDispatch();
    const authUser = JSON.parse(localStorage.getItem('user'));
    const clients = useSelector(selectClients);
    const employees = useSelector(selectEmployees);
    const permissions = authUser && authUser.permissions ? authUser.permissions : null;

    useEffect(() => { dispatch(getClientsAsync()); }, [dispatch, clients.length])
    useEffect(() => { dispatch(getEmployeesAsync()); }, [dispatch, employees.length])
    const dummyProject = { name: "", client_id: "", team: "" }
    const formik = useFormik({
        initialValues: dummyProject,
        enableReinitialize: true,
        onSubmit: values => { props.searchProjects(values) },
    });
    return (
        <>
            <Form onSubmit={formik.handleSubmit}>
                <Stack direction="horizontal" gap={3}>
                    <Form.Group controlId="name">
                        <Form.Control type="text" placeholder="Name" onChange={formik.handleChange}
                            value={formik.values.name || ''} />
                    </Form.Group>
                    {permissions && permissions.includes(PERMISSIONS.clients_add) && <>
                        <Form.Group controlId="client_id">
                            <Form.Select aria-label="Default select example" onChange={formik.handleChange}
                                value={formik.values.client_id || ''}>
                                <option>Select Client</option>
                                {clients && clients.map((item, index) => {
                                    return <option key={item.id} value={item.id}>{item.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="team">
                            <Form.Select aria-label="Default select example" onChange={formik.handleChange}
                                value={formik.values.team || ''}>
                                <option>Employee</option>
                                {employees && employees.map((item, index) => {
                                    return <option key={item.id} value={item.id}>{item.first_name} {item.last_name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>
                    </>}
                    <Button className='btn-cut-outline' variant="light" onClick={() => { formik.resetForm(); props.searchProjects(dummyProject); }} type="reset">Reset</Button>
                    <Button className='btn-cut-submit-outline' variant="light" type="submit">Search</Button>
                </Stack>
            </Form>
        </>
    )
}