import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Link } from 'react-router-dom';

import { Stack, Modal } from "react-bootstrap";
import { FcRefresh, FcPlus, FcLeft } from 'react-icons/fc';
import { BsFillKanbanFill } from "react-icons/bs";
import { GrTasks } from "react-icons/gr";

import { selectSProject, listTasksAsync } from "./tasks/tasksSlice";
import { AddTasks } from "./tasks/add/AddTasks";


export const Project = () => {
    const dispatch = useDispatch();
    const sProject = useSelector(selectSProject);
    const [showAddPopup, setShowAddPopup] = useState(false)

    const fetchTasksList = () => dispatch(listTasksAsync({ project_id: sProject.id }));

    return (
        <>
            <Modal backdrop="static" show={showAddPopup} onHide={() => setShowAddPopup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{sProject ? sProject.name : ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body><AddTasks fetchTasksList={() => { fetchTasksList(); setShowAddPopup(false); }} /></Modal.Body>
            </Modal>

            <Stack direction='horizontal' gap={3} className="page-header-actions mb-2 task-header justify-content-between">
                <Stack direction='horizontal' gap={3}>
                    <Link to={'/projects'} ><FcLeft size={'25px'} /></Link>
                    <h5 className='m-0'>{sProject && sProject.name}</h5>
                </Stack>
                {sProject && sProject.id !== '0' &&
                    <Stack direction='horizontal' gap={3}>
                        <FcRefresh className='cursor-pointer' onClick={fetchTasksList} size={'25px'} />
                        <FcPlus className='cursor-pointer' size={'25px'} onClick={() => setShowAddPopup(true)} />
                        <Link to={`/project/${sProject.task_prefix}/backlog`} >
                            <GrTasks className='cursor-pointer task-header-icon' size={'20px'} />
                        </Link>
                        <Link to={`/project/${sProject.task_prefix}/board`} >
                            <BsFillKanbanFill className='cursor-pointer task-header-icon' size={'20px'} />
                        </Link>
                    </Stack>
                }
            </Stack>
            <Outlet />
        </>
    )
}