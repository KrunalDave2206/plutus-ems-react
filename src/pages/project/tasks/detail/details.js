import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ViewTask } from "../add/AddTasks";
import { useParams } from 'react-router-dom'

import { Row, Col } from "react-bootstrap";

import { getTaskAsync, getTaskByNumberAsync } from "../add/AddTasksSlice";
import { BsWindowSidebar } from 'react-icons/bs';

export const TaskDetail = () => {
    const dispatch = useDispatch();
    const { task_id } = useParams();
    if (!task_id) BsWindowSidebar.close();
    useEffect(() => { dispatch(getTaskByNumberAsync({ task_id })) }, [dispatch, task_id]);
    return (
        <Row>
            <Col xs={12} md={{ span: 10, offset: 1 }}>
                <ViewTask />
            </Col>
        </Row>
    )
}