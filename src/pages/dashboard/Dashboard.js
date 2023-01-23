import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Dashboard.scss';
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Stack, Dropdown, Modal } from "react-bootstrap";
import { LeaveForm } from '../leaves/leaveForm/LeaveForm';

import { FaBirthdayCake } from "react-icons/fa";
import { FcLeave } from "react-icons/fc";
import { BsCalendarEvent } from "react-icons/bs";

import { selectCalendar, getDashCalendarAsync, selectFromDate, selectToDate, setNextMonth, setPrevMonth, selectCurrentMonthTitle, getDayFromDate } from "./dashboardSlice";

import { VacancyView } from "../hrapp/vacancy/Vacancy";
import { InterView } from "../hrapp/interview/Interview";

import { routePath } from "../../routelink";

export const Dashboard = () => {
    const dispatch = useDispatch();
    const [applyLeaveModal, setApplyLeaveModal] = useState(false);
    const fromDate = useSelector(selectFromDate);
    const toDate = useSelector(selectToDate);

    useEffect(() => { dispatch(getDashCalendarAsync({ from_date: fromDate, to_date: toDate })) }, [dispatch, fromDate, toDate]);

    const handleApplyLeaveModalOpen = () => {
        setApplyLeaveModal(true);
    }
    const handleApplyLeaveModalClose = () => {
        setApplyLeaveModal(false);
    }

    return (
        <>
            <div className="page-header-actions mb-4">
                <Stack style={{ width: '100%' }} direction="horizontal" gap={3} className='justify-content-between'>
                    <Stack direction="horizontal" gap={3}>
                        <Button className="btn-cut-submit-outline" variant="light" onClick={handleApplyLeaveModalOpen} >Apply Leave</Button>
                        <Button as={Link} className="btn-cut-submit-outline" variant="light" to={routePath.timetracker} >Activty</Button>
                    </Stack>
                    <Dropdown>
                        <Dropdown.Toggle className="btn-cut-submit hide-dd-arrow" variant="success" id="download-dropdown">
                            Download App
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="http://3.110.162.127/api/win-app-download" target='_blank'>Windows (.exe)</Dropdown.Item>
                            <Dropdown.Item href="http://3.110.162.127/api/deb-app-download" target='_blank'>Linux/debian (.deb) </Dropdown.Item>
                            <Dropdown.Item href="http://3.110.162.127/api/dmg-app-download" target='_blank'>Mac OS (.dmg) </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Stack>
            </div>
            <Stack direction="horizontal" className='dash' gap={3}>
                <div className='w-100'><CalenderComp /></div>
                <div className='w-100'><VacancyView /></div>
                <div className='w-100'><InterView /></div>
            </Stack>
            <Modal backdrop='static' size='md' show={applyLeaveModal} onHide={handleApplyLeaveModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Apply Leave</Modal.Title>
                </Modal.Header>
                <Modal.Body><LeaveForm closePopup={handleApplyLeaveModalClose} /></Modal.Body>
            </Modal>
        </>
    )
}

const CalenderComp = () => {
    const dispatch = useDispatch();
    const calendar = useSelector(selectCalendar);
    const monthTitle = useSelector(selectCurrentMonthTitle);
    console.log(Object.keys(calendar).sort())
    let dd = new Date();
    let m = dd.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let day = dd.getDate(); day = day < 10 ? '0' + day : day;
    dd = dd.getFullYear() + '-' + m + '-' + day;

    return <>
        <Card className='cust-bshadow'>
            <Card.Header>
                <div className='d-flex justify-content-between' >
                    <div style={{ padding: '3px' }} >{monthTitle}</div>
                    <div className='d-flex'>
                        <Button size='sm' onClick={() => { dispatch(setPrevMonth()) }} className='btn-cut-outline mx-2'>Prev</Button>
                        <Button size='sm' onClick={() => { dispatch(setNextMonth()) }} className='btn-cut-outline'>Next</Button>
                    </div>
                </div>
            </Card.Header>
            <Card.Body className='monthly-cal'>
                {calendar && Object.keys(calendar).sort().map((date, i) => {
                    let cal = calendar[date];
                    let Cale = date[2]
                    return <Row className={dd == date ? 'current my-1' : 'py-1'} key={i}>
                        <Col md={3} className="event-date">
                            <div>{date.split('-')[1]}-{date.split('-')[2]}</div>
                            
                            <code>{getDayFromDate(date)}</code>
                        </Col>
                        <Col md={9} className="event-data">
                            {cal && cal.length && cal.map((val, i) => {
                                return CalenderEventComp(val, i);
                            })}
                        </Col>
                    </Row>
                })}
            </Card.Body>
        </Card>
    </>
}

const CalenderEventComp = (event, i) => {
    return <div className={`${event.type} cal-event`} key={event.start + i}>
        <div className='d-flex justify-content-between'>
            <div>{event.title}</div>
            {event.type == 'leaves' && <FcLeave size={'23px'} />}
            {event.type == 'birth_day' && <FaBirthdayCake size={'20px'} />}
            {event.type == 'holiday' && <BsCalendarEvent className='mt-1' size={'18px'} />}
        </div>
    </div>

}