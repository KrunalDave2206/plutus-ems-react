import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import './Questions.scss';
import { Row, Col, ListGroup, Button, Card, Form, } from "react-bootstrap";
import { FcEditImage, FcCheckmark, FcCancel } from 'react-icons/fc';

import { PaginationComp } from "../../../components/pagination/pagination";
import { listQuestionTypesAsync, postQuestionTypesAsync, selectTypes, selectType, updateType, dummyQuestionType } from "./questionsSlice";
import { listQuestionAsync, postQuestionsAsync, selectQuestion, selectQuestions, updateQuestion, dummyQuestion, selectQuestionCount } from "./questionsSlice";


const validateQue = values => {
    const errors = {};
    if (!values.type_id) errors.type = 'Required';
    if (!values.question) errors.weightage = 'Required';
    if (!values.answers) errors.type = 'Required';
    if (!values.correct_ans) errors.weightage = 'Required';

    return errors;
};

const validateType = values => {
    const errors = {};
    if (!values.type) errors.type = 'Required';
    if (!values.weightage) errors.weightage = 'Required';

    return errors;
};

export const Questions = () => {
    const dispatch = useDispatch();
    const types = useSelector(selectTypes);
    const type = useSelector(selectType);
    const [addType, setAddType] = useState(false);

    const questions = useSelector(selectQuestions);
    const question = useSelector(selectQuestion);
    const questionCount = useSelector(selectQuestionCount);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [addQue, setAddQue] = useState(false);

    useEffect(() => { dispatch(listQuestionTypesAsync()) }, [dispatch])
    useEffect(() => { dispatch(listQuestionAsync({ page, size: pageSize })) }, [dispatch, page])

    const listQuestions = () => { dispatch(listQuestionAsync({ page, size: pageSize })); }

    const typeFormik = useFormik({
        initialValues: type,
        enableReinitialize: true,
        validateType,
        onSubmit: async values => {
            await dispatch(postQuestionTypesAsync(values));
            dispatch(updateType({ ...dummyQuestionType }));
            typeFormik.resetForm();
            dispatch(listQuestionTypesAsync())
        },
    });

    const openTypeUpdate = (type) => {
        setAddType(true);
        dispatch(updateType(type));
    }
    const closeTypeUpdate = () => {
        setAddType(false);
        dispatch(updateType({ ...dummyQuestionType }));
        typeFormik.resetForm();
    }

    const questionFormik = useFormik({
        initialValues: question,
        enableReinitialize: true,
        validateQue,
        onSubmit: async values => {
            let data = { ...values }
            data.answers = JSON.stringify([data.answer1, data.answer2, data.answer3, data.answer4]);
            delete data.answer1; delete data.answer2; delete data.answer3; delete data.answer4;
            questionFormik.resetForm();
            await dispatch(postQuestionsAsync(data));
            dispatch(updateQuestion({ ...dummyQuestion }));
            listQuestions();
            dispatch(listQuestionTypesAsync())
        },
    });

    const openQuestionUpdate = (que) => {
        let question = { ...que };
        //type_id
        question.answers = JSON.parse(question.answers);
        question.answer1 = question.answers[0];
        question.answer2 = question.answers[1];
        question.answer3 = question.answers[2];
        question.answer4 = question.answers[3];
        setAddQue(true);
        dispatch(updateQuestion(question));
    }
    const closeQuestionUpdate = () => {
        setAddQue(false);
        dispatch(updateQuestion({ ...dummyQuestion }));
        questionFormik.resetForm();
    }

    return (
        <>
            <Row className='questions'>
                <Col xs={9}>
                    <Card className='cust-bshadow'>
                        <Card.Header>
                            <div className='d-flex justify-content-between' >
                                <div style={{ padding: '3px' }} >Questions</div>
                                <Button size='sm' variant='light' onClick={() => setAddQue(!addQue)} >Add</Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup as="ol" >
                                {addQue && <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start" >
                                    <Form className='w-100'>
                                        <Row>
                                            <Col xs={6}>
                                                <div>Type</div>
                                                {/* <Form.Control id="type_id" type="text" placeholder="Type" onChange={questionFormik.handleChange} value={questionFormik.values.type_id} /> */}
                                                <Form.Select size='sm' id="type_id" aria-label="Type" onChange={questionFormik.handleChange} value={questionFormik.values.type_id || ''}>
                                                    <option>Select Type</option>
                                                    {types && types.length > 0 && types.map((type, i) => {
                                                        return <option value={type.id}>{type.type} ({type.weightage})</option>
                                                    })}
                                                </Form.Select>
                                            </Col>
                                            <Col xs={6}>
                                                <div>Correct Answer</div>
                                                <Form.Control size='sm' id="correct_ans" type="text" placeholder="Correct Answer" onChange={questionFormik.handleChange} value={questionFormik.values.correct_ans} />
                                            </Col>
                                            <Col xs={12}>
                                                <div>Question</div>
                                                <Form.Control size='sm' id="question" type="text" placeholder="Question" onChange={questionFormik.handleChange} value={questionFormik.values.question} />
                                            </Col>
                                            <Col xs={12}>Answers</Col>
                                            <Col xs={6}>
                                                {/* <div>Answer A</div> */}
                                                <Form.Control size='sm' id="answer1" type="text" placeholder="Answer A" onChange={questionFormik.handleChange} value={questionFormik.values.answer1} />
                                            </Col>
                                            <Col xs={6} className="mb-2">
                                                {/* <div>Answer B</div> */}
                                                <Form.Control size='sm' id="answer2" type="text" placeholder="Answer B" onChange={questionFormik.handleChange} value={questionFormik.values.answer2} />
                                            </Col>
                                            <Col xs={6} className="mb-2">
                                                {/* <div>Answer 3</div> */}
                                                <Form.Control size='sm' id="answer3" type="text" placeholder="Answer C" onChange={questionFormik.handleChange} value={questionFormik.values.answer3} />
                                            </Col>
                                            <Col xs={6}>
                                                {/* <div>Answer 4</div> */}
                                                <Form.Control size='sm' id="answer4" type="text" placeholder="Answer D" onChange={questionFormik.handleChange} value={questionFormik.values.answer4} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={6}></Col>
                                            <Col xs={6}>
                                                <div className="d-flex justify-content-end">
                                                    <FcCancel size={'25px'} onClick={() => closeQuestionUpdate()} className='my-1 mx-3 cursor-pointer' />
                                                    <FcCheckmark size={'25px'} onClick={() => questionFormik.handleSubmit()} className='my-1 cursor-pointer' />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </ListGroup.Item>}
                                {questions && questions.length > 0 && questions.map((que, i) => {
                                    let ans = JSON.parse(que.answers);
                                    return <ListGroup.Item as="li" key={que.id} className="ques-list d-flex justify-content-between align-items-start" >
                                        <div className="ms-2 me-auto">
                                            <div>{que.type}</div>
                                            <div className="fw-bold">{que.question}</div>
                                            <div className='answers'>
                                                <div><b>A.</b> {ans[0]}</div>
                                                <div><b>B.</b> {ans[1]}</div>
                                                <div><b>C.</b> {ans[2]}</div>
                                                <div><b>D.</b> {ans[3]}</div>
                                            </div>
                                            <div><span className="fw-bold">Ans:</span> {que.correct_ans}</div>
                                        </div>
                                        <div>
                                            <FcEditImage size={'25px'} onClick={() => openQuestionUpdate(que)} tooltip="Edit" className='mx-2 cursor-pointer' />
                                        </div>
                                    </ListGroup.Item>
                                })}
                            </ListGroup>
                        </Card.Body>
                        <Card.Footer>
                            <PaginationComp records={questionCount} pageSize={pageSize} onChange={setPage} />
                        </Card.Footer>
                    </Card>
                </Col>
                <Col xs={6} md={3}>
                    <Card className='cust-bshadow'>
                        <Card.Header>
                            <div className='d-flex justify-content-between' >
                                <div style={{ padding: '3px' }} >Question Category</div>
                                <Button size='sm' variant='light' onClick={() => setAddType(!addType)} >Add</Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup as="ol" >
                                {addType && <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start" >
                                    <Form className='w-100'>
                                        <Row>
                                            <Col xs={6}>
                                                <div>Type</div>
                                                <Form.Control id="type" type="text" placeholder="Type" onChange={typeFormik.handleChange} value={typeFormik.values.type} />
                                            </Col>
                                            <Col xs={6}>
                                                <div>Number of Que.</div>
                                                <Form.Control id="weightage" type="number" placeholder="Number of Que." onChange={typeFormik.handleChange} value={typeFormik.values.weightage} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={6}></Col>
                                            <Col xs={6}>
                                                <div className="d-flex justify-content-end">
                                                    <FcCancel size={'25px'} onClick={() => closeTypeUpdate()} className='my-1 mx-3 cursor-pointer' />
                                                    <FcCheckmark size={'25px'} onClick={() => typeFormik.handleSubmit()} className='my-1 cursor-pointer' />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </ListGroup.Item>}
                                {types && types.length > 0 && types.map((type, i) => {
                                    return <ListGroup.Item as="li" key={type.id} className="d-flex justify-content-between align-items-start" >
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">{type.type}</div>
                                            <div>Number of Que.: {type.weightage} / {type.questions}</div>
                                        </div>
                                        <div>
                                            <FcEditImage size={'25px'} onClick={() => openTypeUpdate(type)} tooltip="Edit" className='mx-2 cursor-pointer' />
                                        </div>
                                    </ListGroup.Item>
                                })}
                            </ListGroup>
                        </Card.Body>
                        {/* <Card.Footer>
                            <code>Total Weightage must not go above 100</code>
                        </Card.Footer> */}
                    </Card>
                </Col>
            </Row>
        </>
    )
}