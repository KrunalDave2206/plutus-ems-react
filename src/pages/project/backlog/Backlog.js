import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Dropdown, Button, Stack, Modal } from "react-bootstrap";

import { selectTasks, listTasksAsync, selectSProject, selectBackLogTasks, selectBoardTasks } from "../tasks/tasksSlice";
import { getTaskAsync, postTaskAsync } from "../tasks/add/AddTasksSlice";
import { ViewTask } from "../tasks/add/AddTasks";

import './Backlog.scss';
export const Backlog = (props) => {
    const dispatch = useDispatch();
    let { taskPrefix } = useParams();
    // const tasks = useSelector(selectTasks);
    const backLogTasks = useSelector(selectBackLogTasks);
    const boardTasks = useSelector(selectBoardTasks);
    const sProject = useSelector(selectSProject);
    const [showDetailPopup, setShowDetailPopup] = useState(false)
    const getTaskDetail = (event, task_id, number) => {
        if (task_id) {
            if (event.ctrlKey) {
                window.open(`/project/${taskPrefix}/task/${number}`)
            } else {
                setShowDetailPopup(true);
                dispatch(getTaskAsync({ task_id }))
            }
        }
    };
    const fetchTasksList = () => dispatch(listTasksAsync({ project_id: sProject.id }));
    const updateBoard = async (title, task_id, board) => {
        await dispatch(postTaskAsync({ type: 'board', title, id: task_id, board, project_id: sProject.id }))
        fetchTasksList();
    }
    return (
        <>
            <div className='bl-view'>
                <Stack gap={2} className='bl-task-list justify-content-between'>
                    <Stack className='bl-task-title justify-content-between' direction='horizontal' gap={2}>
                        <span>Board</span>
                    </Stack>
                    {boardTasks && boardTasks.length > 0 && boardTasks.map((t, i) => TaskListUI(t, getTaskDetail, updateBoard))}
                </Stack>
                <Stack gap={2} className='bl-task-list mt-5'>
                    <Stack className='bl-task-title justify-content-between' direction='horizontal' gap={2}>
                        <span>Backlog</span>
                    </Stack>
                    {backLogTasks && backLogTasks.length > 0 && backLogTasks.map((t, i) => TaskListUI(t, getTaskDetail, updateBoard))}
                </Stack>
            </div>
            <Modal backdrop="static" size="lg" show={showDetailPopup} onHide={() => setShowDetailPopup(false)}>
                <Modal.Body className='p-0'><ViewTask closeTaskMOdal={() => setShowDetailPopup(false)} fetchTasksList={fetchTasksList} /></Modal.Body>
            </Modal>
        </>
    )
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Button className='m-0 p-0' variant='link' ref={ref} onClick={(e) => { e.preventDefault(); onClick(e); }} >{children}</Button>
));

const TaskListUI = (t, getTaskDetail, updateBoard) => {
    return <Stack className='bl-task justify-content-between' direction='horizontal' gap={2} key={t.id}>
        <Stack direction='horizontal' gap={2} className='justify-content-between' >
            <div>
                <Button variant='link' onClick={(event) => getTaskDetail(event, t.id, t.number)} >{t.number || 'Task'}</Button>
                <span className='ms-2'>{t.title}</span>
            </div>
            <span onClick={(event) => getTaskDetail(event, t.id, t.number)} className={'cursor-pointer status-state ' + t.task_status}>{t.task_status}</span>
        </Stack>
        <Stack direction='horizontal' gap={2} >
            <span onClick={(event) => getTaskDetail(event, t.id, t.number)} className={'cursor-pointer priority ' + t.priority}>{t.priority}</span>
            <span onClick={(event) => getTaskDetail(event, t.id, t.number)} className='cursor-pointer sm-assign tooltip1'>{t.first_name[0]}{t.last_name[0]}
                <span className='tooltiptext'>{t.first_name} {t.last_name}</span>
            </span>
            <Dropdown >
                <Dropdown.Toggle as={CustomToggle} id="dropdown-priority">
                    <span className={'bl-move-to'}>Move to</span>
                </Dropdown.Toggle>
                <Dropdown.Menu >
                    <Dropdown.Item onClick={() => updateBoard(t.title, t.id, t.board ? 0 : 1)}>{t.board ? 'Backlog' : 'Board'}</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Stack>
    </Stack>
}