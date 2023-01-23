import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from "react-router-dom";
import { Button, Row, Col } from 'react-bootstrap';

import loglo from '../../../assets/images/inside.svg';
import './Exam.scss';


import { getNextQuestionAsync, selectCadToken, selectQuestion, setAnswer, selectAnswer, selectCadName, logOut, selectCount, selectApiIsOn } from "../careerSlice";

export const CareerExam = () => {
    const dispatch = useDispatch();
    const cadToken = useSelector(selectCadToken);
    const question = useSelector(selectQuestion);
    const answer = useSelector(selectAnswer);
    const canName = useSelector(selectCadName);
    const counter = useSelector(selectCount);
    const apiIsOn = useSelector(selectApiIsOn);

    useEffect(() => {
        console.log(cadToken)
        if (cadToken)
            dispatch(getNextQuestionAsync({ candidate_id: cadToken, data: null }));
    }, [dispatch]);

    const onAnswerSelect = (question_id, sAnswer) => {
        dispatch(setAnswer({ question_id: question_id, answer: sAnswer }));
    }
    const submitAswer = () => {
        if (answer && answer.answer)
            dispatch(getNextQuestionAsync({ candidate_id: cadToken, data: answer }));
    }
    const logoutSubmit = () => {
        localStorage.removeItem('cad_user');
        localStorage.removeItem('cad_token');
        localStorage.removeItem('cad_name');
        dispatch(logOut());
    }
    return (
        <div className="career-exam align-self-center text-center">
            {!cadToken ? <Navigate to={'/career/apply'} /> : null}
            <div className='langin container'>
                <img height={'60px'} src={loglo} ></img>
                <h3>{canName} {counter && <span>({counter.answers}/{counter.questions})</span>}</h3>
                {question && <div className='my-4'>
                    <Row>
                        <Col xs={12} className="que-card">
                            <div className='selected'><b>{parseInt(counter.answers) + 1}.</b> {question.question}</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} className="que-card">
                            <div className={answer && answer.answer == question.answers[0] ? 'selected' : ''}
                                onClick={() => { onAnswerSelect(question.question_id, question.answers[0]) }}>
                                {question.answers[0]}
                            </div>
                        </Col>
                        <Col xs={6} className="que-card">
                            <div className={answer && answer.answer == question.answers[1] ? 'selected' : ''}
                                onClick={() => { onAnswerSelect(question.question_id, question.answers[1]) }}>
                                {question.answers[1]}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} className="que-card"><div className={answer && answer.answer == question.answers[2] ? 'selected' : ''}
                            onClick={() => { onAnswerSelect(question.question_id, question.answers[2]) }}>
                            {question.answers[2]}
                        </div></Col>
                        <Col xs={6} className="que-card"><div className={answer && answer.answer == question.answers[3] ? 'selected' : ''}
                            onClick={() => { onAnswerSelect(question.question_id, question.answers[3]) }}>
                            {question.answers[3]}
                        </div></Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col><Button disabled={apiIsOn} className='btn-cut-submit' onClick={submitAswer}>Submit & Next</Button></Col>
                    </Row>
                </div>}
                {!question && <div>
                    {counter && <h2>You Scored: {counter.correct_answers}/{counter.questions}</h2>}
                    <h3 className='my-4'>Great {canName}! Exam is concluded.<br /> Please wait for your next round.</h3>
                    <Button className='btn-cut-submit' onClick={logoutSubmit}>Logout</Button>
                </div>}
            </div>
        </div>
    )
}