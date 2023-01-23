import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";

import './Tasks.scss';
import { Row, Col, Stack, Button, Modal, Card } from "react-bootstrap";

import { AddTasks, ViewTask } from "./add/AddTasks";
import { getTaskAsync, setProject } from "./add/AddTasksSlice";
import { listTasksAsync, selectTasks, selectSProject, getProjectByTaskPrefixAsync, selectSProjectTeam, selectBoardTasks } from "./tasksSlice";

export const Tasks = (props) => {
    const dispatch = useDispatch();
    let { taskPrefix } = useParams();
    const tasks = useSelector(selectBoardTasks);
    const sProject = useSelector(selectSProject);
    const spTeam = useSelector(selectSProjectTeam);
    const [showDetailPopup, setShowDetailPopup] = useState(false)
    const [filterMate, setFilterMate] = useState(null)

    const fetchProjectList = () => dispatch(listTasksAsync({ project_id: sProject.id }));

    useEffect(() => {
        if (sProject && sProject.id) dispatch(listTasksAsync({ project_id: sProject.id }));
    }, [dispatch, sProject]);

    useEffect(() => {
        if (taskPrefix) dispatch(getProjectByTaskPrefixAsync({ task_prefix: taskPrefix }));
    }, [dispatch, taskPrefix]);

    const getTaskDetail = (event, task_id, number) => {
        dispatch(setProject(sProject.id));
        if (task_id) {
            if (event.ctrlKey) {
                window.open(`/project/${taskPrefix}/task/${number}`)
            } else {
                setShowDetailPopup(true);
                dispatch(getTaskAsync({ task_id }))
            }
        }
    };

    const addTeamFilter = (team) => {
        if (filterMate == team) setFilterMate(null);
        else setFilterMate(team);
    }

    return (
        <>
            <Stack direction='horizontal' gap={2} className='project-taem'>
                {spTeam && spTeam.length > 0 && spTeam.map((t, i) => {
                    return <span className={`team-mem ${filterMate == t.employee_id ? 'sel' : ''}`}
                        onClick={() => { addTeamFilter(t.employee_id) }}
                        title={t.emp_name}>{t.first_name[0]}{t.last_name[0]}</span>
                })}
            </Stack>
            <Stack direction='horizontal' gap={3} className='task-list al-baseline'>
                {sProject && sProject.statuses && sProject.statuses.map((s, i) => {
                    return <Card className='p-0 status-box' >
                        <Card.Header className='text-capitalize'>{s}</Card.Header>
                        <Card.Body className='p-0'>
                            {tasks && tasks.length > 0 && tasks.map((t, i) => {
                                if (t.task_status === s && (filterMate == null || filterMate == t.assigned)) return TaskListUI(t, getTaskDetail, filterMate)
                            })}
                        </Card.Body>
                    </Card>
                })}
            </Stack>
            <Modal backdrop="static" size="lg" show={showDetailPopup} onHide={() => setShowDetailPopup(false)}>
                <Modal.Body className='p-0'><ViewTask closeTaskMOdal={() => setShowDetailPopup(false)} fetchProjectList={fetchProjectList} /></Modal.Body>
            </Modal>
        </>
    )
}

const TaskListUI = (t, getTaskDetail) => {
    return <Card className='p-0 mb-2 task-card' key={t.id}>
        <Card.Body className={'task-detail ' + t.priority}>
            <div className='task-row' key={t.id}>
                <div className='detail'>
                    {t.title}
                    <div className='d-flex mt-1 justify-content-between'>
                        <div onClick={(event) => getTaskDetail(event, t.id, t.number)}>
                            <span className='cursor-pointer me-2 sm-assign tooltip1'>{t.first_name && t.first_name[0]}{t.last_name && t.last_name[0]}
                                <span className='tooltiptext'>{t.first_name} {t.last_name}</span>
                            </span>
                            <span className={'cursor-pointer priority ' + t.priority}>{t.priority}</span>
                        </div>
                        <Button variant='link' onClick={(event) => getTaskDetail(event, t.id, t.number)} >{t.number || 'Task'}</Button>
                    </div>
                </div>
            </div>
        </Card.Body>
    </Card>
}