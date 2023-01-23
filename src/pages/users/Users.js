import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Users.scss';
import { Stack, FormControl, Modal, Button } from "react-bootstrap";
import { FcEditImage, FcDeleteDatabase, FcRefresh } from 'react-icons/fc';
import { RiUserAddFill } from "react-icons/ri";

import { UserForm, UsersProjects, UserTimeTracked } from "./userForm/UserForm";
import { selectUsers, listUsersAsync, selectUserCount, delUserAsync, selectdelUserRes, clearApiRes } from "./usersSlice";
import { getUserAsync, getUsersProjectsAsync, clearUserForm, selectUser, getUsersTrackedTimeAsync } from "./userForm/userFormSlice";
import { showNow } from "../../components/toast/toastSlise";
import { PaginationComp } from "../../components/pagination/pagination";
import { PERMISSIONS } from "../../services/constants";

export const Users = () => {
    const dispatch = useDispatch();
    const users = useSelector(selectUsers);
    const user = useSelector(selectUser);
    const userCount = useSelector(selectUserCount);
    const delUserRes = useSelector(selectdelUserRes);

    const [pageSize, setPageSize] = useState(30);
    const [page, setPage] = useState(1);
    const [showBlocked, setShowBlocked] = useState(false);
    const [showProjectsPopup, setShowProjectsPopup] = useState(false);
    const [showTimeTrackerPopup, setShowTimeTrackerPopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showDelPopup, setShowDelPopup] = useState(false);
    const [showPerDelPopup, setShowPerDelPopup] = useState(false);
    const [showBlockDelPopup, setShowBlockDelPopup] = useState(false);
    const [userToDel, setUserToDel] = useState(null);
    const [searchKey, setSearchKey] = useState('');

    useEffect(() => { dispatch(listUsersAsync({ page, size: pageSize, searchKey, showBlocked })); }, [page, pageSize, searchKey, showBlocked]);
    useEffect(() => {
        if (delUserRes != null) {
            if (delUserRes != 1) {
                showNow({ body: delUserRes, variant: 'danger' })
            } else {
                showNow({ body: 'User updated.' })
                setShowPerDelPopup(false);
                setShowBlockDelPopup(false);
                setUserToDel(null);
                dispatch(clearApiRes());
            }
        }
    }, [delUserRes])

    const listUsers = () => { dispatch(listUsersAsync({ page, size: pageSize, searchKey, showBlocked })); }

    const editUser = (user_id) => { dispatch(getUserAsync(user_id)); setShowAddPopup(true) };

    const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const permissions = authUser && authUser.permissions ? authUser.permissions : null;

    const handleSearch = (e) => { if (e.keyCode == 13) { setSearchKey(e.target.value); setPage(1); } }
    const handleBlockedSearch = () => {
        setShowBlocked(!showBlocked);
        setSearchKey('');
        setPage(1);
    }
    const handleProjectListShow = () => { dispatch(getUsersProjectsAsync()); setShowProjectsPopup(true); }
    const handleTimeTrackerListShow = () => { dispatch(getUsersTrackedTimeAsync()); setShowTimeTrackerPopup(true); }

    const openDelPopup = (user) => { setShowDelPopup(true); setUserToDel(user); }
    const closeDelPopup = () => { setShowDelPopup(false); setUserToDel(null); }

    const openPerDelPopup = () => { setShowDelPopup(false); setShowPerDelPopup(true); }
    const closePerDelPopup = () => { setShowPerDelPopup(false); setUserToDel(null); }

    const openBlockDelPopup = () => { setShowDelPopup(false); setShowBlockDelPopup(true); }
    const closeBlockDelPopup = () => { setShowBlockDelPopup(false); setUserToDel(null); }

    const deleteUserHandle = async (type, value) => {
        if (type == 'working') value = userToDel.is_working == 1 ? 0 : 1;
        else value = 0
        await dispatch(delUserAsync({ user_id: userToDel.id, data: { type, value } }));
        listUsers();
    }

    return (
        <>
            <div className="page-header-actions mb-4">
                <Stack direction="horizontal" gap={3}>
                    <FormControl type='text' onKeyUp={handleSearch} placeholder='Search > Enter'></FormControl>
                    <Button className='btn-cut-submit-outline' variant='light' onClick={handleProjectListShow}>List</Button>
                    {permissions && permissions.includes(PERMISSIONS.users_add) &&
                        <>
                            <Button className='btn-cut-submit-outline' variant='light' onClick={handleTimeTrackerListShow}>Time&nbsp;Tracker</Button>
                            <Button className={`btn btn-cut-submit${showBlocked ? '' : '-outline'}`} variant='light'
                                onClick={handleBlockedSearch}>Blocked</Button>
                            <Button className='btn btn-cut-submit-outline' variant='light'
                                onClick={() => { dispatch(clearUserForm()); setShowAddPopup(true) }}><RiUserAddFill size={'20px'} /></Button>
                        </>
                    }
                </Stack>
            </div>
            <Stack direction='horizontal' gap={3} className="users-pg-view">
                <PaginationComp alignment={'vertical'} records={userCount} pageSize={pageSize} onChange={setPage} />
                <div className="users-view">
                    {users && users.map((user, i) => {
                        return <div key={i} className='user-view'>
                            {permissions && permissions.includes(PERMISSIONS.users_add) && <div className='action'>
                                {/* <FcViewDetails size={'20px'} tooltip="View" className='mx-1 cursor-pointer' onClick={() => alert('View')} /> */}
                                <FcEditImage size={'20px'} tooltip="Edit" className='mx-1 cursor-pointer' onClick={() => editUser(user.id)} />
                                <FcDeleteDatabase size={'20px'} tooltip="Delete" className='mx-1 cursor-pointer' onClick={() => openDelPopup(user)} />
                            </div>}
                            <div className={`detail ${permissions && permissions.includes(PERMISSIONS.users_add) == false ? 'round' : ''}`} >
                                <div className='emp_no'>
                                    <span>{user.emp_no || 'EMP No.'}</span>
                                    <span>{user.joining_date}</span>
                                </div>
                                <div className='emp_name_d'>{user.first_name} {user.last_name} <span>({user.designation_name})</span></div>
                                <div className='emp_contact'>
                                    <span>{user.email}</span>
                                </div>
                                <div className='emp_contact'>
                                    <span>{user.contact_primary}</span>
                                    <span>{user.contact_alternative}</span>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </Stack>
            {
                permissions && permissions.includes(PERMISSIONS.users_add) && <>
                    <Modal className='user-form' backdrop="static" size="xl" show={showAddPopup} onHide={() => setShowAddPopup(false)}>
                        <Modal.Header closeButton>{user && user.id ? 'Edit User' : 'Add User'}</Modal.Header>
                        <Modal.Body className='mx-3'><UserForm listUsers={listUsers} closePopup={() => { setShowAddPopup(false) }} /> </Modal.Body>
                    </Modal>
                    <Modal backdrop="static" size="md" show={showTimeTrackerPopup} onHide={() => setShowTimeTrackerPopup(false)}>
                        <Modal.Header closeButton>Time Tracked&nbsp;<FcRefresh className='cursor-pointer' onClick={() => dispatch(getUsersTrackedTimeAsync())} /></Modal.Header>
                        <Modal.Body><UserTimeTracked /> </Modal.Body>
                    </Modal>
                </>
            }

            <Modal backdrop="static" size="xl" show={showProjectsPopup} onHide={() => setShowProjectsPopup(false)}>
                <Modal.Header closeButton>Users - Projects</Modal.Header>
                <Modal.Body><UsersProjects /> </Modal.Body>
            </Modal>
            <Modal backdrop="static" size="sm" centered show={showDelPopup} onHide={closeDelPopup}>
                <Modal.Header closeButton><h4 className='m-0'>{userToDel && userToDel.first_name} {userToDel && userToDel.last_name}</h4></Modal.Header>
                <Modal.Body>
                    <Stack gap={3} className='justify-content-center'>
                        <Button size="lg" variant='success' onClick={openBlockDelPopup}>{userToDel && userToDel.is_working ? 'Block' : 'Un Block'}</Button>
                        <Button size="lg" variant='danger' onClick={openPerDelPopup}>Permanently Delete</Button>
                    </Stack>
                </Modal.Body>
            </Modal>
            <Modal backdrop="static" size="sm" centered show={showPerDelPopup} onHide={closePerDelPopup}>
                <Modal.Header closeButton><h4 className='m-0'>{userToDel && userToDel.first_name} {userToDel && userToDel.last_name}</h4></Modal.Header>
                <Modal.Body>
                    <Stack gap={3} className='justify-content-center'>
                        <h4 className='text-danger'>Are you sure ?</h4>
                        <Button size="lg" variant='danger' onClick={() => deleteUserHandle('active')}>Permanently Delete</Button>
                    </Stack>
                </Modal.Body>
            </Modal>
            <Modal backdrop="static" size="sm" centered show={showBlockDelPopup} onHide={closeBlockDelPopup}>
                <Modal.Header closeButton><h4 className='m-0'>{userToDel && userToDel.first_name} {userToDel && userToDel.last_name}</h4></Modal.Header>
                <Modal.Body>
                    <Stack gap={3} className='justify-content-center'>
                        <h4 className='text-success'>Are you sure ?</h4>
                        <Button size="lg" variant='success' onClick={() => deleteUserHandle('working')}>{userToDel && userToDel.is_working ? 'Block' : 'Un Block'}</Button>
                    </Stack>
                </Modal.Body>
            </Modal>
        </>
    )
}