import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from "react-router-dom";

import './AddTasks.scss';
import { Row, Col, Form, Button, Card, FormControl, Dropdown, Tab, Modal, Nav, Stack } from "react-bootstrap";
import { FcDeleteRow, FcCheckmark, FcCancel } from 'react-icons/fc';
import { AiOutlineClose } from 'react-icons/ai';
import { FaUserCircle } from "react-icons/fa";

import { useFormik } from 'formik';

import {
    selectTask, postTaskAsync, selectTasktoDisplay, getTaskAsync,
    lisrCommentAsync, postCommentAsync, selectComment, selectCommentList, deleteCommentAsync,
    lisrTaskHistoryAsync, selectHistory, selectWorkLog, dummyWorkLog,
    postWorkLogAsync, lisrWorkLogAsync, selectWorkLogList
} from "./AddTasksSlice";
import { selectSProject, getProjectByTaskPrefixAsync, selectSProjectTeam } from "../tasksSlice";
import { getAllEmployeeAsync, selectAllEmployees } from "../../../../services/master/masterSlice";
// import { PaginationComp } from "../../components/pagination/pagination";
const validate = values => {
    const errors = {};
    if (!values.title) errors.title = 'Required';
    if (values.board == undefined) errors.title = 'Required';

    return errors;
};
export const AddTasks = (props) => {
    const dispatch = useDispatch();
    // const task = useSelector(selectTask);
    const sProject = useSelector(selectSProject);
    const spTeam = useSelector(selectSProjectTeam);
    const employees = useSelector(selectAllEmployees);
    const formik = useFormik({
        initialValues: { title: "", description: "", asignee: "", project_id: "", board: 0 },
        enableReinitialize: true,
        validate,
        onSubmit: async values => {
            console.log('values', values)
            await dispatch(postTaskAsync({ ...values, project_id: sProject.id }))
            if (props.fetchTasksList) props.fetchTasksList();
        },
    });

    useEffect(() => { dispatch(getAllEmployeeAsync()); }, [dispatch, employees.length]);

    return (
        <Form onSubmit={formik.handleSubmit} className='task-form'>
            <Stack gap={2}>
                <Stack className='justify-content-around' direction='horizontal' gap={3}>
                    <Form.Check
                        type={'radio'}
                        id={`baclog`}
                        name='board'
                        value={0}
                        label={`Backlog`}
                        checked={formik.values.board == 0}
                        onChange={formik.handleChange}
                    />
                    <Form.Check
                        type={'radio'}
                        id={`board`}
                        name='board'
                        value={1}
                        label={`Board`}
                        checked={formik.values.board == 1}
                        onChange={formik.handleChange}
                    />
                </Stack>
                {formik.errors.board ? <code> *{formik.errors.board}</code> : null}
                <Stack direction='horizontal' gap={3}>
                    <Form.Label column="sm">Title{formik.errors.title ? <code> *{formik.errors.title}</code> : null}</Form.Label>
                    <Form.Control id="title" type="text" placeholder="Title" onChange={formik.handleChange} value={formik.values.title || ''} />
                </Stack>
                <Stack direction='horizontal' gap={3}>
                    <Form.Label column="sm">Description{formik.errors.description ? <code> *{formik.errors.description}</code> : null}</Form.Label>
                    <Form.Control id="description" as="textarea" rows={4} onChange={formik.handleChange}
                        value={formik.values.description || ''} />
                </Stack>
                <Stack direction='horizontal' gap={3}>
                    <Form.Label column="sm">Status{formik.errors.task_status ? <code> *{formik.errors.task_status}</code> : null}</Form.Label>
                    <Form.Select id="task_status" aria-label="Default select example" className='text-capitalize' onChange={formik.handleChange} value={formik.values.task_status || 'todo'}>
                        {sProject && sProject.statuses && sProject.statuses.map((s, i) => {
                            return <option className='text-capitalize' key={s + i} value={s}>{s}</option>
                        })}
                    </Form.Select>
                </Stack>
                <Stack direction='horizontal' gap={3}>
                    <Form.Label column="sm">Asignee{formik.errors.asignee ? <code> *{formik.errors.asignee}</code> : null}</Form.Label>
                    <Form.Select id="asignee" aria-label="Asignee" onChange={formik.handleChange} value={formik.values.asignee || ''}>
                        <option value={''}>Select Asignee</option>
                        {spTeam && spTeam.map((item, index) => {
                            return <option value={item.employee_id} key={item.employee_id} >{item.emp_name}</option>
                        })}
                        {/* {employees && employees.map((item, index) => {
                            return <option key={item.id} value={item.id}>{item.emp_name}</option>
                        })} */}
                    </Form.Select>
                </Stack>
                <Stack direction='horizontal' gap={3}>
                    <Form.Label column="sm">Priority</Form.Label>
                    <Form.Select id="priority" aria-label="Priority" onChange={formik.handleChange} value={formik.values.priority || 'low'}>
                        <option value={'lowest'}>lowest</option>
                        <option value={'low'}>Low</option>
                        <option value={'medium'}>Midium</option>
                        <option value={'high'}>High</option>
                        <option value={'highest'}>Highest</option>
                    </Form.Select>
                </Stack>
            </Stack>
            <Stack direction='horizontal' className='mt-3 justify-content-end' gap={3}>
                <Button className='mx-2' variant="light" type="reset">Reset</Button>
                <Button className='mx-2 btn-cut-submit' variant="light" type="submit">Submit</Button>
            </Stack>
        </Form>
    )
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Button variant='link' ref={ref} onClick={(e) => { e.preventDefault(); onClick(e); }} >{children}</Button>
));

const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <FormControl
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <ul className="list-unstyled">
                    {React.Children.toArray(children).filter(
                        (child) => !value || child.props.children.toLowerCase().startsWith(value),
                    )}
                </ul>
            </div>
        );
    },
);

export const ViewTask = (props) => {
    const dispatch = useDispatch();
    const task = useSelector(selectTasktoDisplay);
    let { taskPrefix } = useParams();
    const employees = useSelector(selectAllEmployees);
    const sProject = useSelector(selectSProject);
    const spTeam = useSelector(selectSProjectTeam);
    const [editDesc, setEditdesc] = useState(false);
    const [descriptionVal, setDescriptionVal] = useState(task && task.description ? task.description : '');
    const [editTitle, setEditTitle] = useState(false);
    const [titleVal, setTitleVal] = useState(task && task.title ? task.title : '');

    useEffect(() => {
        if (taskPrefix) dispatch(getProjectByTaskPrefixAsync({ task_prefix: taskPrefix }));
    }, [dispatch, taskPrefix]);

    useEffect(() => { dispatch(getAllEmployeeAsync()); }, [dispatch, employees.length]);

    useEffect(() => {
        if (task && task.title) {
            setTitleVal(task.title);
            setDescriptionVal(task.description);
        }
    }, [dispatch, task]);

    const titleChanged = () => { let ttask = { ...task, title: titleVal, type: 'title' }; updateData(ttask); }
    const descriptionChanged = () => { let ttask = { ...task, description: descriptionVal, type: 'description' }; updateData(ttask); }
    const assigneeChanged = (emp_id) => { let ttask = { ...task, assigned: emp_id, type: 'assigned' }; updateData(ttask); }
    const statusChanged = (status) => { let ttask = { ...task, task_status: status, type: 'status' }; updateData(ttask); }
    const priorityChanged = (priority) => { let ttask = { ...task, priority: priority, type: 'priority' }; updateData(ttask); }
    const updateData = async (ttask) => {
        await dispatch(postTaskAsync(ttask));
        await dispatch(getTaskAsync({ task_id: ttask.id }));
        dispatch(lisrTaskHistoryAsync({ task_id: task.id }));
        props.fetchTasksList();
    }

    return (
        <>
            {task && task.id && <Card className='p-0 task-view'>
                <Card.Header className='d-flex justify-content-between tv-header'>
                    <div>
                        <div className='my-1'>{sProject.name} &gt; <span className='me-2 font-cust-color' variant='link'>{task.number}</span></div>
                    </div>
                    {props.closeTaskMOdal && <span className='tv-close'>
                        <AiOutlineClose className='float-end cursor-pointer mx-1 my-2' onClick={() => props.closeTaskMOdal()} />
                    </span>}
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={9} className="details-pan">
                            <Stack gap={1} className='ps-3 border-b-1 mb-2'>
                                <div className='mb-2'>
                                    {!editTitle && <div className='my-1'>
                                        <span onClick={() => setEditTitle(!editTitle)}>{task.title}</span>
                                    </div>}
                                    {editTitle && <div className='d-flex'>
                                        <Form.Control type="text" placeholder="Title" onChange={(e) => setTitleVal(e.target.value)} value={titleVal} />
                                        <FcCancel size={'25px'} className='mt-1 mx-3 cursor-pointer' onClick={(e) => { setTitleVal(task.title); setEditTitle(!editTitle) }} />
                                        <FcCheckmark size={'25px'} onClick={() => { titleChanged(); setEditTitle(!editTitle); }} className='mt-1 cursor-pointer' />
                                    </div>}
                                </div>
                                <b className='mb-1'>Discription:</b>
                                {!editDesc && <pre onClick={() => setEditdesc(!editDesc)}>{descriptionVal || 'Click me to Edit'}</pre>}
                                {editDesc && <div className='mb-2'>
                                    <Form.Control as="textarea" className='mb-2' rows={4} onChange={(e) => { setDescriptionVal(e.target.value) }} value={descriptionVal} />
                                    <div className='d-flex justify-content-end'>
                                        <FcCancel size={'20px'} className='cursor-pointer' onClick={(e) => { setDescriptionVal(task.description); setEditdesc(!editDesc) }} />
                                        <FcCheckmark size={'20px'} onClick={() => { descriptionChanged(); setEditdesc(!editDesc) }} className='mx-3 cursor-pointer' />
                                    </div>
                                </div>}
                            </Stack>
                            <Tab.Container defaultActiveKey="comments">
                                <Row className='mb-2 mx-0 d-flex'>
                                    <Nav variant="pills" className="flex-row justify-content-end">
                                        <Nav.Item>
                                            <Nav.Link as={Button} variant="light" eventKey="comments" className='px-2 py-0 me-1'>Comments</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link as={Button} variant="light" eventKey="worklog" className='px-2 py-0 me-1'>Work log</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link as={Button} variant="light" eventKey="history" className='px-2 py-0'>History</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Row>
                                <Row className='m-0'>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="comments"><TaskCommentComp /></Tab.Pane>
                                        <Tab.Pane eventKey="history"><TaskHistoryComp /></Tab.Pane>
                                        <Tab.Pane eventKey={'worklog'}><TaskWorkLogComp /></Tab.Pane>
                                    </Tab.Content>
                                </Row>
                            </Tab.Container>
                        </Col>
                        <Col md={3}>
                            <Stack className='assigned-user' gap={2}>
                                <Dropdown className='priority'>
                                    <Dropdown.Toggle as={CustomToggle} id="dropdown-priority">
                                        <span className={'text-capitalize priority-state ' + task.priority}>{task.priority}</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu >
                                        <Dropdown.Item onClick={() => priorityChanged("lowest")}>Lowest</Dropdown.Item>
                                        <Dropdown.Item onClick={() => priorityChanged("low")}>Low</Dropdown.Item>
                                        <Dropdown.Item onClick={() => priorityChanged("medium")}>Medium</Dropdown.Item>
                                        <Dropdown.Item onClick={() => priorityChanged("high")}>High</Dropdown.Item>
                                        <Dropdown.Item onClick={() => priorityChanged("highest")}>Highest</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown className='status'>
                                    <Dropdown.Toggle as={CustomToggle} id="dropdown-status">
                                        <span className={'text-capitalize status-state ' + task.task_status}>{task.task_status}</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu >
                                        {sProject && sProject.statuses && sProject.statuses.map((s, i) => {
                                            return <Dropdown.Item className='text-capitalize' key={i} eventKey={i} onClick={() => statusChanged(s)}>{s}</Dropdown.Item>
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown className='assignee'>
                                    <Dropdown.Toggle as={CustomToggle} id="dropdown-assignee">
                                        <span className='assignee-name'>
                                            <FaUserCircle size={'18px'} className='me-2' />
                                            {task.first_name ? task.first_name + ' ' + task.last_name : 'Choose'}
                                        </span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu as={CustomMenu}>
                                        {spTeam && spTeam.map((item, index) => {
                                            return <Dropdown.Item onClick={() => assigneeChanged(item.employee_id)} value={item.id} key={item.id} eventKey={item.id}>{item.emp_name}</Dropdown.Item>
                                        })}
                                        {/* {employees && employees.map((item, index) => {
                                            return <Dropdown.Item onClick={() => assigneeChanged(item.id)} value={item.id} key={item.id} eventKey={item.id}>{item.emp_name}</Dropdown.Item>
                                        })} */}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <div className='task-created'>Created: {task.created_at}</div>
                            </Stack>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>}
        </>
    )
}
const validateCommentForm = values => {
    const errors = {};
    if (!values.comment) errors.comment = 'Required';

    return errors;
};
const TaskCommentComp = (props) => {
    const dispatch = useDispatch();
    const task = useSelector(selectTasktoDisplay);
    const comments = useSelector(selectCommentList);
    const comment = useSelector(selectComment);
    const [showForm, setShowForm] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [commentId, setCommentId] = useState('')
    const authUser = JSON.parse(localStorage.getItem('user'));

    // useEffect(() => { 
    //     console.log('TaskCommentComp task.id', task.id)
    //     if (task && task.id) dispatch(lisrCommentAsync({ task_id: task.id })); 
    // }, [dispatch, task, task.id]);
    useEffect(() => {
        dispatch(lisrCommentAsync({ task_id: task.id }));
    }, []);
    const closeDeleteCommentPopup = () => {
        setCommentId('');
        setShowAddPopup(false);
    }
    const deleteCommentHandle = (comment_id) => {
        setCommentId(comment_id);
        setShowAddPopup(true);
    }
    const deleteComment = async () => {
        await dispatch(deleteCommentAsync({ comment_id: commentId }));
        await dispatch(lisrCommentAsync({ task_id: task.id }));
        setCommentId('');
        setShowAddPopup(false);

    }
    const formik = useFormik({
        initialValues: comment,
        enableReinitialize: true,
        validate: validateCommentForm,
        onSubmit: async (values, { resetForm }) => {
            let data = {
                task_id: task.id,
                comment: values.comment,
                employee_id: authUser.id
            }
            await dispatch(postCommentAsync({ task_id: data.task_id, data }));
            dispatch(lisrCommentAsync({ task_id: data.task_id }));
            dispatch(lisrTaskHistoryAsync({ task_id: task.id }));
            resetForm();
            setShowForm(false);
        },
    });

    return (
        <>
            <Row className='mb-2'>
                {!showForm && <Col xs={12} className="d-flex justify-content-end">
                    {/* <Button className='p-0' variant="link" onClick={() => setShowForm(true)} type="button">+ Comment</Button> */}
                    <Form.Control type='text' onFocus={() => setShowForm(true)} placeholder="Write Comment" />
                </Col>}
                {showForm && <Form onSubmit={formik.handleSubmit}>
                    <Row>
                        <Col xs={12} >
                            <Form.Group className="mb-2" controlId="comment">
                                <Form.Label column="sm">Comment{formik.errors.comment ? <code> *{formik.errors.comment}</code> : null}</Form.Label>
                                <Form.Control as="textarea" rows={4} onChange={formik.handleChange} value={formik.values.comment || ''} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} className="d-flex justify-content-end">
                            <FcCancel size={'20px'} className='my-1 mx-3 cursor-pointer' onClick={() => setShowForm(false)} />
                            <FcCheckmark size={'20px'} onClick={formik.handleSubmit} className='my-1 cursor-pointer' />
                        </Col>
                    </Row>
                </Form>}
            </Row>
            <Row className='p-2 comments'>
                {comments && comments.length > 0 && comments.map((com, index) => {
                    return <>
                        <Stack gap={1} className='mb-3'>
                            <Stack direction="horizontal" gap={3} className='justify-content-between'>
                                <div>
                                    <b className='me-2'>{com.first_name}&nbsp;{com.last_name}</b>
                                    <span className='tvc-date'>{com.created_at}</span>
                                </div>
                                {com.employee_id === authUser.id && <div className="d-flex justify-content-end" ><FcDeleteRow onClick={() => deleteCommentHandle(com.id)} size={'20px'} /></div>}
                            </Stack>
                            <div>{com.comment}</div>
                        </Stack>
                    </>
                })}
            </Row>
            <Modal backdrop="static" show={showAddPopup} onHide={closeDeleteCommentPopup}>
                <Modal.Header closeButton> <Modal.Title> Delete Comment</Modal.Title> </Modal.Header>
                <Modal.Body> Are you sure, You want to delete the comment ? </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={closeDeleteCommentPopup} >Close</Button>
                    <Button variant="danger" onClick={deleteComment}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const TaskHistoryComp = (props) => {
    const dispatch = useDispatch();
    const task = useSelector(selectTasktoDisplay);
    const history = useSelector(selectHistory);
    // useEffect(() => { if (task && task.id) dispatch(lisrTaskHistoryAsync({ task_id: task.id })); }, [dispatch, task, task.id]);

    useEffect(() => { dispatch(lisrTaskHistoryAsync({ task_id: task.id })); }, []);

    return (
        <Stack gap={4} className='mb-2 task-history'>
            {history && history.length > 0 && history.map((his, i) => {
                return <Stack gap={1}>
                    <Stack direction="horizontal" gap={3}>
                        <div>
                            <b className='me-2'>{his.first_name}&nbsp;{his.last_name}</b>
                            <span className='tvc-date'>{his.created_at}</span>
                        </div>
                    </Stack>
                    <div>
                        {his.type === 'description' && <div>
                            Description changed from <pre>{his.old_value}</pre> to <pre>{his.new_value} </pre>
                        </div>}
                        {his.type === 'title' && <div>
                            Title changed from <span>{his.old_value}</span> to <span>{his.new_value} </span>
                        </div>}
                        {his.type === 'status' && <div>
                            Status changed from <span className='from_state'>{his.old_value}</span> to <span className='to_state'>{his.new_value} </span>
                        </div>}
                        {his.type === 'board' && <div>
                            Board changed from <span className='from_state'>{his.old_value == 0 ? 'Backlog' : 'Board'}</span> to <span className='to_state'>{his.new_value == 0 ? 'Backlog' : 'Board'} </span>
                        </div>}
                        {his.type === 'assigned' && <div>
                            This task assigned to <code>{his.old_assignee}</code> {his.new_assignee && <span>from <code>{his.new_assignee}</code></span>}
                        </div>}
                        {his.type === 'priority' && <div>
                            Priority changed from <span className='from_state'>{his.old_value}</span> to <span className='to_state'>{his.new_value} </span>
                        </div>}
                    </div>
                </Stack>
            })}
        </Stack>
    )
}

const validateWorklogForm = values => {
    const errors = {};
    if (!values.hours) errors.comment = 'Required';

    return errors;
};

const TaskWorkLogComp = (prop) => {
    const dispatch = useDispatch();
    const task = useSelector(selectTasktoDisplay);
    const worklog = useSelector(selectWorkLog);
    const worklogs = useSelector(selectWorkLogList);
    const [showForm, setShowForm] = useState(false);
    const authUser = JSON.parse(localStorage.getItem('user'));

    // useEffect(() => { if (task && task.id) dispatch(lisrWorkLogAsync({ task_id: task.id })); }, [dispatch, task, task.id]);

    useEffect(() => { dispatch(lisrWorkLogAsync({ task_id: task.id })); }, []);

    const formik = useFormik({
        initialValues: worklog || dummyWorkLog,
        enableReinitialize: true,
        validate: validateWorklogForm,
        onSubmit: async (values, { resetForm }) => {
            let data = {
                task_id: task.id,
                detail: values.detail,
                hours: values.hours,
                minutes: values.minutes,
                log_date: values.log_date,
                employee_id: authUser.id
            }
            await dispatch(postWorkLogAsync({ task_id: data.task_id, data }));
            dispatch(lisrWorkLogAsync({ task_id: data.task_id }));
            dispatch(lisrTaskHistoryAsync({ task_id: task.id }));
            resetForm();
            setShowForm(false);
        },
    });

    return (
        <>
            <Modal backdrop="static" size='md' show={showForm} onHide={() => setShowForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Work log</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={() => { }}>
                        <Row>
                            <Col xs={12} >
                                <Form.Group className="mb-2" controlId="log_date">
                                    <Form.Label column="sm">Log date{formik.errors.log_date ? <code> *{formik.errors.log_date}</code> : null}</Form.Label>
                                    <Form.Control type='date' rows={4} onChange={formik.handleChange} value={formik.values.log_date || ''} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} >
                                <Form.Group className="mb-2" controlId="hours">
                                    <Form.Label column="sm">Hours{formik.errors.hours ? <code> *{formik.errors.hours}</code> : null}</Form.Label>
                                    <Form.Control type="number" onChange={formik.handleChange} value={formik.values.hours || ''} />
                                </Form.Group>
                            </Col>
                            <Col xs={6} >
                                <Form.Group className="mb-2" controlId="minutes">
                                    <Form.Label column="sm">Minutes{formik.errors.minutes ? <code> *{formik.errors.minutes}</code> : null}</Form.Label>
                                    <Form.Control type="number" onChange={formik.handleChange} value={formik.values.minutes || ''} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} >
                                <Form.Group className="mb-2" controlId="detail">
                                    <Form.Label column="sm">Detail{formik.errors.detail ? <code> *{formik.errors.detail}</code> : null}</Form.Label>
                                    <Form.Control as="textarea" rows={4} onChange={formik.handleChange} value={formik.values.detail || ''} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Row className='mt-3'>
                        <Col xs={12} className="d-flex justify-content-end">
                            <Button variant='light' className='me-2' onClick={() => setShowForm(false)}>Cancel</Button>
                            <Button className='btn-cut-submit' variant='light' onClick={formik.handleSubmit}>Submit</Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
            <div className="d-flex justify-content-end">
                <Button size='sm' variant="light" onClick={() => setShowForm(true)} type="button">+ Work log</Button>
            </div>
            <Row className='p-2 comments'>
                {worklogs && worklogs.length > 0 && worklogs.map((wlog, index) => {
                    return <>
                        <Stack gap={1} className='mb-3'>
                            <Stack direction="horizontal" gap={3}>
                                <div>
                                    <b className='me-2'>{wlog.employee}</b>
                                    <span className='tvc-date'>{wlog.log_date} <b>({wlog.hours}h {wlog.minutes}m)</b></span>
                                </div>
                            </Stack>
                            <div>{wlog.detail}</div>
                        </Stack>
                    </>
                })}
            </Row>
        </>
    )

}