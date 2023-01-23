import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './Interview.scss';
import { Form, Card, ListGroup, Button, Modal } from "react-bootstrap";
import { listInterviewAsync, selectInterviews, selectMonth, postInterviewFeedbackAsync, selectToDay } from "./interviewSlice";

export const InterView = () => {
    const dispatch = useDispatch();
    const interviews = useSelector(selectInterviews);
    const month = useSelector(selectMonth);
    const toDay = useSelector(selectToDay);
    const [feedbackCand, setFeedbackCand] = useState(null);
    const [feedbackValue, setFeedbackValue] = useState('');
    const [showFeedbackPopup, setFeedbackPopup] = useState(null);
    const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    useEffect(() => { 
        dispatch(listInterviewAsync({ month })); 
    }, [dispatch]);
    const openFeedbackPopup = (cand) => {
        setFeedbackPopup(true);
        setFeedbackCand(cand);
    }

    const closeFeedbackPopup = () => {
        setFeedbackPopup(false);
        setFeedbackCand(null);
        setFeedbackValue('');
    }

    const submitFeedback = async () => {
        let data = { employee_id: authUser.id, interview_id: feedbackCand.id, feedback: feedbackValue };
        console.log(data);
        await dispatch(postInterviewFeedbackAsync(data));
        closeFeedbackPopup();
    }
 
    return (
        <>
            {interviews && interviews.length > 0 && <Card className='cust-bshadow'>
                <Card.Header>
                    <div style={{ padding: '3px' }} >Interviews {toDay}</div>
                </Card.Header>
                <Card.Body className='p-0'>
                    <ListGroup as="ol" >
                        {interviews && interviews.map((inter, i) => {
                            return <ListGroup.Item as="li" className={inter.datetime.indexOf(toDay) > -1 ? 'today' : ''}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">{inter.profile_name} ({inter.round})</div>
                                        {inter.first_name} {inter.last_name}
                                    </div>
                                    <div>
                                        {inter.datetime}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end align-items-end">
                                    <a variant='link' href={inter.meeting_link} target="_blank" size='sm' className='btn-cut-outline btn btn-sm me-2'>Join Interview</a>
                                    <Button variant='light' size='sm' className='btn-cut-outline' onClick={() => openFeedbackPopup(inter)}>Feedback</Button>
                                </div>
                            </ListGroup.Item>
                        })}
                    </ListGroup>
                </Card.Body>
            </Card>}
            <Modal backdrop="static" show={showFeedbackPopup} onHide={closeFeedbackPopup}>
                <Modal.Header closeButton>Interview result for {feedbackCand && feedbackCand.first_name} {feedbackCand && feedbackCand.last_name}</Modal.Header>
                <Modal.Body>
                    <Form.Control as="textarea" className='mb-2' rows={4} onChange={(e) => { setFeedbackValue(e.target.value) }} value={feedbackValue} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='light' onClick={closeFeedbackPopup}>Clear</Button>
                    <Button variant='light' className='btn-cut' onClick={submitFeedback}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}