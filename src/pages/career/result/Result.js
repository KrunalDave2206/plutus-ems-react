import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Row, Col } from 'react-bootstrap';

import loglo from '../../../assets/images/inside.svg';
import './Result.scss';

import { getResultAsync, selectResult, selectStartEnd } from "../careerSlice";
import { postInterviewFeedbackAsync } from "../../hrapp/interview/interviewSlice";

export const CareerResult = () => {
    const dispatch = useDispatch();
    let { cadId } = useParams();
    const result = useSelector(selectResult);
    const startEnd = useSelector(selectStartEnd);
    const [feedbackValue, setFeedbackValue] = useState('');
    const authUser = JSON.parse(localStorage.getItem('user'));
    useEffect(() => {
        if (cadId)
            dispatch(getResultAsync({ candidate_id: cadId }));
    }, [dispatch]);
    const submitFeedback = async (interview_id,) => {
        let data = { employee_id: authUser.id, interview_id, feedback: feedbackValue };
        await dispatch(postInterviewFeedbackAsync(data));
    }
    return (
        <>
            <div className="career-result align-self-center text-center">
                <div className='langin'>
                    <img height={'60px'} src={loglo} ></img>
                </div>
            </div>
            <Row className='m-0'>
                <Col xs={12} md={4}>
                    {result && result.detail && <div className="cad-detail">
                        <h3>{result.detail.first_name} {result.detail.last_name}</h3>
                        <div>{result.detail.email} ({result.detail.password})</div>
                        <h6>Technology of Interest: {result.detail.technology_of_interest}</h6>
                        <div className='mt-3'>
                            <h4>Aptitude Summary</h4>
                            <div>{result.summary && Object.keys(result.summary).map((type, i) => {
                                return <span className='me-3'>{type}: {result.summary[type].pass}/{result.summary[type].total} </span>
                            })}</div>
                            <hr />
                            <div><b>Start Time:</b> {startEnd && startEnd.start_date}</div>
                            <div><b>End Time:</b> {startEnd && startEnd.end_date}</div>
                            <div><b>Time taken:</b> {startEnd.diff}</div>
                        </div>
                        <div className='mt-3'>
                            <h4>Qualifications</h4>
                            {result.qualifications && result.qualifications.length > 0 && result.qualifications.map((qua, i) => {
                                return <Row className='cad-qua' key={qua.id} >
                                    <Col xs={3}>{qua.course || ''}</Col>
                                    <Col xs={3}>{qua.passing_year || ''}</Col>
                                    <Col xs={3}>{qua.university || ''}</Col>
                                    <Col xs={3}>{qua.percentage || ''}</Col>
                                </Row>
                            })}
                        </div>
                        <div className='mt-3'>
                            <h4>Notes</h4>
                            <div>{result.detail.notes}</div>
                        </div>
                        {result.detail.resume && <div className='mt-3'>
                            <Button as={'a'} target="_blank" className='btn-cut-submit' href={'https://inside.plutustec.com/resume/' + result.detail.resume} size='sm' >View Resume</Button>
                        </div>}
                    </div>}
                </Col>
                <Col xs={12} md={4} className="qanda">
                    {result && result.types && result.types.length > 0 && result.types.map((type, i) => {
                        return <><h6>{type}: {result.summary[type].pass}/{result.summary[type].total}</h6>
                            {
                                result && result.types_question && result.types_question[type].map((que, i) => {
                                    return <div className='que-ans' key={que.question_id} >
                                        <div className='que'>{que.updated_at}</div>
                                        <div className='que'>{que.question}</div>
                                        <div className={que.correct_ans == que.answer ? 'ans true' : 'ans'}>
                                            <span>{que.correct_ans}</span>
                                            <span>{que.answer}</span>
                                        </div>
                                    </div>
                                })
                            }
                        </>
                    })}
                </Col>
                <Col xs={12} md={4}>
                    {result && result.interview && result.interview.length > 0 && result.interview.map((inter, i) => {
                        return <div className='que-ans' key={inter.datetime + i} >
                            <div className='que'>{inter.round} ({inter.datetime})</div>
                            <div className={'inter'}>
                                {inter.interview && inter.interview.map((interv, j) => {
                                    return <div key={interv.employee_id + j} className="interviewee">
                                        <span>{interv.interviewee}</span>
                                        {authUser && authUser.id != interv.employee_id && <span>{interv.feedback}</span>}
                                        {authUser && authUser.id == interv.employee_id && <div className='feedback'>
                                            <Form.Control as="textarea" className='mb-2' rows={4}
                                                onChange={(e) => { setFeedbackValue(e.target.value) }}
                                                value={feedbackValue || interv.feedback} />
                                            <Button className='btn-cut-submit float-end' onClick={() => { submitFeedback(interv.interview_id) }} size='sm' >Submit</Button>
                                        </div>}
                                    </div>
                                })}
                            </div>
                        </div>
                    })}
                </Col>
            </Row>
        </>
    )
}