import React, { useEffect, useState } from 'react';
import { Stack, ListGroup, FormControl, Card, Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FcNumericalSorting12, FcNumericalSorting21 } from "react-icons/fc";
import { IoIosRefreshCircle } from "react-icons/io";
import { MdWork, MdClose } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import './TimeTracker.scss';
import { changeLoading, selectIsLoading } from '../../../components/loader/FullPageLoaderSlice'
import { loading } from '../../../components/loader/FullPageLoader'

import { PERMISSIONS } from "../../../services/constants";

import {
    selectUsersTimeTracked, getUsersTrackedTimeAsync,
    getUsersTrackedActivityAsync, selectUsersActivityTracked,
    deleteUsersTrackedActivityAsync,
    selectStatus, changeStatus,
    selectUsersActivityisDESC, activityASC, activityDesc
} from "./TimeTrackerSlice";

export const TimeTracked = () => {
    const dispatch = useDispatch();

    let date = new Date().toISOString().split('T')[0]
    const [searchDate, setSearchDate] = useState(date);
    const [searchKey, setSearchKey] = useState('');
    const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const permissions = authUser && authUser.permissions ? authUser.permissions : null;
    const timeTracked = useSelector(selectUsersTimeTracked)
    const isLoading = useSelector(selectIsLoading);
    const status = useSelector(selectStatus);
    const [empId, setEmpId] = useState(null);
    const [isTeam, setIsTeam] = useState(true);


    const onViewHandle = (emp_id) => {
        dispatch(changeLoading(true))
        setEmpId(emp_id);
        dispatch(getUsersTrackedActivityAsync({ emp_id, date: searchDate }));
    }

    useEffect(() => {
        if (status === 1) {
            dispatch(changeLoading(false))
            dispatch(changeStatus());
        }
    }, [status])

    useEffect(() => { dispatch(getUsersTrackedTimeAsync({ date: searchDate, all: !isTeam })) }, [dispatch, searchDate, isTeam]);
    const handleRefresh = () => { dispatch(getUsersTrackedTimeAsync({ date: searchDate, all: !isTeam })) }
    const handleSearch = (e) => { if (e.keyCode == 13) { setSearchKey(e.target.value); } }

    return (
        <>
            {isLoading && loading}
            <Stack direction='horizontal' gap={3} className='al-ss'>
                <div className='user-list'>
                    {permissions && permissions.includes(PERMISSIONS.clients_all) && <div>
                        <div direction='horizontal' gap={2} className="mb-2 filter" >
                            <Button size='sm' onClick={() => setIsTeam(true)} className={`filter-item btn-cut-submit${isTeam ? '' : '-outline'}`} variant='light'>Team</Button>
                            <Button size='sm' onClick={() => setIsTeam(false)} className={`filter-item btn-cut-submit${isTeam ? '-outline' : ''}`} variant='light'>All</Button>
                            <FormControl className='filter-item' type='text' onKeyUp={handleSearch} placeholder='Search > Enter'></FormControl>
                            <FormControl className='filter-item' type='date' value={searchDate} onChange={e => { setSearchDate(e.target.value) }}></FormControl>
                            <IoIosRefreshCircle className='filter-item' onClick={handleRefresh} />
                        </div>
                    </div>}
                    <ListGroup className='user-time-tracked'>
                        {timeTracked && timeTracked.map((time, index) => {
                            if (((!searchKey || searchKey.length == 0) || (searchKey && time.emp_name.startsWith(searchKey))))
                                return <ListGroup.Item key={index} onClick={() => { onViewHandle(time.emp_id) }} className={empId == time.emp_id ? 'cursor-pointer active' : 'cursor-pointer'}>
                                    <Stack direction="horizontal" gap={3} className='justify-content-between'>
                                        <div><small>Name</small><br />{time.emp_name}</div>
                                        <Stack direction="horizontal" gap={3} >
                                            <div><small>Active</small><br />{time.active}</div>
                                            <div><small>Total</small><br />{time.total}</div>
                                            <div><small>Activity</small><br />{time.activity}%</div>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="horizontal" gap={3} className='justify-content-between'>
                                        <div>
                                            {time.work_from && time.work_from == 'home' ? <FaHome /> : time.work_from == 'office' ? <MdWork /> : ''}
                                        </div>
                                        <div>
                                            <code>key: {time.key_activity}%</code>
                                            <code>click: {time.click_activity}%</code>
                                            <code>move: {time.move_activity}%</code>
                                        </div>
                                    </Stack>
                                </ListGroup.Item>
                        })}
                    </ListGroup>
                </div>
                <div className='actiity-list'><UserActivityTracked date={searchDate} /></div>
            </Stack>
        </>
    )
};

const UserActivityTracked = (props) => {
    const dispatch = useDispatch();

    const activityTracked = useSelector(selectUsersActivityTracked);
    const isUserActivityDESC = useSelector(selectUsersActivityisDESC);
    const [activity, setActivity] = useState(null);
    const [deletAct, setDeletAct] = useState(null);

    const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const permissions = authUser && authUser.permissions ? authUser.permissions : null;

    const handleDeletActivity = async () => {
        await dispatch(deleteUsersTrackedActivityAsync({ act_id: deletAct.id, date: props.date }))
        setDeletAct(null);
    }

    const sortUserActivty = () => {
        if (isUserActivityDESC) dispatch(activityASC())
        else dispatch(activityDesc());
    }

    return (
        <>
            <Stack direction='horizontal' gap={2} className="mb-2 me-4 justify-content-end" >
                <Button size='sm' className='btn-cut-outline' onClick={sortUserActivty} variant='light'>{isUserActivityDESC ? <FcNumericalSorting21 size={'20px'} /> : <FcNumericalSorting12 size={'20px'} />}</Button>
            </Stack>
            <div className='activity-images-2'>
                {activityTracked && activityTracked.map((time, index) => {
                    return <Card className={activityTracked[index - 1] && activityTracked[index - 1].start == time.start ? 'copy' : ''}>
                        {/* <ListGroup className="list-group-flush text-center">
                            <ListGroup.Item>{time.project_name}</ListGroup.Item>
                        </ListGroup> */}
                        <Card.Body className='activity'>
                            <Stack direction='vertical' gap={0}>
                                <div className='project-name'>{time.project_name}</div>
                                <Stack direction='horizontal' gap={2}>
                                    <img onClick={() => setActivity(time)} src={time.image} />
                                    <Stack direction='vertical' gap={0} className='justify-content-evenly start-end'>
                                        <span>{time.start}</span>
                                        <span>{time.end}</span>
                                    </Stack>
                                    <Stack direction='vertical' gap={0} className='justify-content-evenly'>
                                        <span>{time.active}</span>
                                        <span>{time.total}</span>
                                    </Stack>
                                    <Stack direction='vertical' gap={0} className='justify-content-evenly'>
                                        <code>key: {time.keyup}%</code>
                                        <code>click: {time.mouseclick}%</code>
                                        <code>move: {time.mousemove}%</code>
                                    </Stack>
                                    <Stack direction='vertical' gap={0} className='justify-content-evenly'>
                                        <span>{time.activity}%</span>
                                        {((permissions && permissions.includes(PERMISSIONS.timetrack_delete)) || time.emp_id == authUser.id) && <RiDeleteBin6Fill fill='red' className='cursor-pointer' onClick={() => setDeletAct(time)} />}
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Card.Body>
                    </Card>
                })}
            </div>
            <Modal backdrop="static" size="xl" centered className='activity-modal'
                show={activity && activity.start ? true : false}
                onHide={() => setActivity(null)}>
                <Modal.Body>
                    {activity && activity.start &&
                        <Stack direction='horizontal' gap={3} >
                            <img style={{ width: '85%' }} src={activity.image}></img>
                            <Stack direction='vertical' gap={2} className='activity-modal-detail justify-content-between' >
                                <div>
                                    <Stack direction='horizontal' gap={3} className='justify-content-between'>
                                        <div>Start</div>
                                        <div>{activity.start}</div>
                                    </Stack>
                                    <Stack direction='horizontal' gap={3} className='justify-content-between' >
                                        <div>End</div>
                                        <div>{activity.end}</div>
                                    </Stack>
                                    <hr className='my-2' />
                                    <Stack direction='horizontal' gap={3} className='justify-content-between' >
                                        <div>Active</div>
                                        <div>{activity.active}</div>
                                    </Stack>
                                    <Stack direction='horizontal' gap={3} className='justify-content-between' >
                                        <div>Total</div>
                                        <div>{activity.total}</div>
                                    </Stack>
                                    <hr className='my-2' />
                                    <Stack direction='horizontal' gap={3} className='justify-content-between' >
                                        <div>Key</div>
                                        <div>{activity.keyup}%</div>
                                    </Stack>
                                    <Stack direction='horizontal' gap={3} className='justify-content-between' >
                                        <div>Click</div>
                                        <div>{activity.mouseclick}%</div>
                                    </Stack>
                                    <Stack direction='horizontal' gap={3} className='justify-content-between' >
                                        <div>Move</div>
                                        <div>{activity.mousemove}%</div>
                                    </Stack>
                                    <Stack direction='horizontal' gap={3} className='justify-content-between' >
                                        <div>Activity</div> {activity.activity}%
                                    </Stack>
                                </div>
                                <Stack direction='horizontal' gap={3} className='justify-content-end pt-1 pb-2'>
                                    <MdClose className='cursor-pointer' onClick={() => setActivity(null)} size={'21px'} />
                                </Stack>
                            </Stack>
                        </Stack>}
                </Modal.Body>
            </Modal>
            <Modal backdrop="static" centered size="sm" show={deletAct && deletAct.id ? true : false} onHide={() => setDeletAct(null)}>
                <Modal.Header>Delete Activity</Modal.Header>
                <Modal.Body>
                    <div>Are you sure?</div>
                    <div>You want to delete this activity?</div>
                    <code>This action can not be undone.</code>
                    {deletAct && deletAct.id && <div className='mt-2'>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <div>{deletAct.start}</div>
                            <div>{deletAct.active}</div>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <div>{deletAct.end}</div>
                            <div>{deletAct.total}</div>
                        </Stack></div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='ligh' size='sm' onClick={() => setDeletAct(null)}>Close</Button>
                    <Button variant='danger' size='sm' onClick={handleDeletActivity} >Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const UserActivityTracked_old = (props) => {
    const dispatch = useDispatch();

    const activityTracked = useSelector(selectUsersActivityTracked);
    const isUserActivityDESC = useSelector(selectUsersActivityisDESC);
    const [activity, setActivity] = useState(null);
    const [deletAct, setDeletAct] = useState(null);

    const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const permissions = authUser && authUser.permissions ? authUser.permissions : null;

    const handleDeletActivity = async () => {
        await dispatch(deleteUsersTrackedActivityAsync({ act_id: deletAct.id, date: props.date }))
        setDeletAct(null);
    }

    const sortUserActivty = () => {
        if (isUserActivityDESC) dispatch(activityASC())
        else dispatch(activityDesc());
    }

    return (
        <>
            <Stack direction='horizontal' gap={2} className="mb-2 me-4 justify-content-end" >
                <Button size='sm' className='btn-cut-outline' onClick={sortUserActivty} variant='light'>{isUserActivityDESC ? <FcNumericalSorting21 size={'20px'} /> : <FcNumericalSorting12 size={'20px'} />}</Button>
            </Stack>
            <div className='activity-images'>
                {activityTracked && activityTracked.map((time, index) => {
                    return <Card className={activityTracked[index - 1] && activityTracked[index - 1].start == time.start ? 'copy' : ''}>
                        <ListGroup className="list-group-flush text-center">
                            <ListGroup.Item>{time.project_name}</ListGroup.Item>
                        </ListGroup>
                        <Card.Img onClick={() => setActivity(time)} variant="top" src={time.image} />
                        <Card.Body className='activity'>
                            <Stack direction='horizontal' className='justify-content-between'>
                                <div>{time.start}</div>
                                <div>{time.end}</div>
                            </Stack>
                            <Stack direction='horizontal' className='justify-content-between'>
                                <div>{time.active}</div>
                                <div>{time.total}</div>
                            </Stack>
                            <Stack direction='horizontal' className='justify-content-between'>
                                <code>key: {time.keyup}%</code>
                                <code>click: {time.mouseclick}%</code>
                                <code>move: {time.mousemove}%</code>
                            </Stack>
                        </Card.Body>
                        <ListGroup className="list-group-flush text-center">
                            <ListGroup.Item>
                                <Stack direction='horizontal' className='justify-content-between'>
                                    <div>{time.activity}%</div>
                                    {((permissions && permissions.includes(PERMISSIONS.timetrack_delete)) || time.emp_id == authUser.id) && <RiDeleteBin6Fill fill='red' className='cursor-pointer' onClick={() => setDeletAct(time)} />}
                                </Stack>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                })}
            </div>
            <Modal backdrop="static" size="xl"
                show={activity && activity.start ? true : false}
                onHide={() => setActivity(null)}>
                <Modal.Header closeButton>Activity</Modal.Header>
                <Modal.Body>
                    {activity && activity.start &&
                        <Stack direction='vertical' gap={3} >
                            <img style={{ width: '100%' }} src={activity.image}></img>
                            <Stack direction='horizontal' gap={3} >
                                <h5>Start</h5>
                                <div>{activity.start}</div>
                                <h5>End</h5>
                                <div>{activity.end}</div>
                                <h5>Active Time</h5>
                                <div>{activity.active}</div>
                                <h5>Total Time</h5>
                                <div>{activity.total}</div>
                                <h5>Activity:</h5> {activity.activity}%
                            </Stack>
                        </Stack>}
                </Modal.Body>
            </Modal>
            <Modal backdrop="static" centered size="sm" show={deletAct && deletAct.id ? true : false} onHide={() => setDeletAct(null)}>
                <Modal.Header>Delete Activity</Modal.Header>
                <Modal.Body>
                    <div>Are you sure?</div>
                    <div>You want to delete this activity?</div>
                    <code>This action can not be undone.</code>
                    {deletAct && deletAct.id && <div className='mt-2'>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <div>{deletAct.start}</div>
                            <div>{deletAct.active}</div>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <div>{deletAct.end}</div>
                            <div>{deletAct.total}</div>
                        </Stack></div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='ligh' size='sm' onClick={() => setDeletAct(null)}>Close</Button>
                    <Button variant='danger' size='sm' onClick={handleDeletActivity} >Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}