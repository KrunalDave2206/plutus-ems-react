import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from "react-router-dom";
import './Projects.scss';
import { Row, Col, Button, Modal, Stack } from "react-bootstrap";
import { FcEditImage, FcParallelTasks, FcConferenceCall } from 'react-icons/fc';
// import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { PERMISSIONS } from "../../services/constants";
import { ProjectForm, SearchProject, ProjectTeamForm } from "./projectForm/ProjectForm";
import { selectProjects, listProjectsAsync, selectProjectCount } from "./projectsSlice";
import { getProjectAsync, clearProject } from "./projectForm/projectFormSlice";
import { PaginationComp } from "../../components/pagination/pagination";

export const Projects = () => {
    const dispatch = useDispatch();
    const projects = useSelector(selectProjects);
    const projectCOunt = useSelector(selectProjectCount);
    const [pageSize, setPageSize] = useState(30);
    const [page, setPage] = useState(1);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showUserPopup, setShowUserPopup] = useState(false);
    useEffect(() => { dispatch(listProjectsAsync({ page, size: pageSize })); }, [page, pageSize]);
    const editProject = (project_id) => { if (authUser && authUser.role_name == 'Admin') dispatch(getProjectAsync(project_id)); }
    const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const permissions = authUser && authUser.permissions ? authUser.permissions : null;
    const searchProjects = (searchKey) => { dispatch(listProjectsAsync({ ...searchKey, page, size: pageSize })); }
    const listProjects = () => { dispatch(listProjectsAsync({ page, size: pageSize })); }

    return (
        <>
            <div className="page-header-actions mb-4">
                <Stack direction="horizontal" gap={3}>
                    <SearchProject searchProjects={searchProjects} />
                    {permissions && permissions.includes(PERMISSIONS.projects_add) &&
                        <Button variant='light' className='btn-cut-submit-outline'
                            onClick={() => { dispatch(clearProject()); setShowAddPopup(true); }}>Add New</Button>
                    }
                </Stack>
            </div>
            <Row>
                <Col xs={12} className="project-page-view">
                    <div className="me-2">
                        <PaginationComp alignment={'vertical'} records={projectCOunt} pageSize={pageSize} onChange={setPage} />
                    </div>
                    <div className='project-list'>
                        {projects && projects.map((proj, i) => {
                            return <div className='project-view' key={i}>
                                <div className='detail'>
                                    <div className="name">{proj.name} ({proj.team || 0})</div>
                                    <div className='client-detail'>
                                        <span><b>Client:</b> {proj.client_name}</span>
                                    </div>
                                    <div className='client-detail'>
                                        <span><b>Client Email:</b> {proj.client_contact}</span>
                                    </div>
                                    <div className='client-detail'>
                                        <span className='me-2'><b>PM:</b> {proj.project_manager_first_name} {proj.project_manager_last_name}</span>
                                    </div>
                                </div>
                                <div className='action'>
                                    <Link to={`/project/${proj.task_prefix}/board`} ><FcParallelTasks className='mx-1 cursor-pointer' size={'20px'} /></Link>
                                    {permissions && permissions.includes(PERMISSIONS.projects_add) &&
                                        <FcEditImage className='mx-1 cursor-pointer' size={'20px'} onClick={() => { editProject(proj.id); setShowAddPopup(true) }} />}
                                    {permissions && (permissions.includes(PERMISSIONS.projects_add) || permissions.includes(PERMISSIONS.leaves_team)) &&
                                        <FcConferenceCall className='mx-1 cursor-pointer' size={'20px'} onClick={() => { editProject(proj.id); setShowUserPopup(true) }} />}
                                </div>
                            </div>
                        })}
                    </div>
                </Col>
            </Row>
            {authUser && authUser.role_name == 'Admin' &&
                <Modal backdrop="static" size="md" show={showAddPopup} onHide={() => setShowAddPopup(false)}>
                    <Modal.Header closeButton>Project</Modal.Header>
                    <Modal.Body><ProjectForm onSubmit={() => { listProjects(); setShowAddPopup(false) }} /> </Modal.Body>
                </Modal>
            }
            {authUser && authUser.role_name == 'Admin' &&
                <Modal backdrop="static" size="lg" show={showUserPopup} onHide={() => setShowUserPopup(false)}>
                    <Modal.Header closeButton>Project's User</Modal.Header>
                    <Modal.Body><ProjectTeamForm onSubmit={() => { listProjects(); setShowUserPopup(false) }} /> </Modal.Body>
                </Modal>
            }
        </>
    )
}