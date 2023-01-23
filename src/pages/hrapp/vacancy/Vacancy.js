import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FcEditImage, FcCheckmark, FcCancel } from 'react-icons/fc';
import { useFormik } from 'formik';
import './Vacancy.scss';
import { Row, Col, ListGroup, Button, Card, Form, Badge } from "react-bootstrap";

import { listVacancyAsync, selectOppenings, selectOppening, selectTotalCount, postVacancyAsync, updateOppening, dummyOppening } from "./vacancySlice";
import { getProfilesAsync, selectProfiles } from "../../../services/master/masterSlice";
// import { PaginationComp } from "../../../components/pagination/pagination";

const validate = values => {
    const errors = {};
    if (!values.profile_id) errors.profile_id = 'Required';

    return errors;
};

export const Vacancy = () => {
    const dispatch = useDispatch();
    const profiles = useSelector(selectProfiles);
    // const totalRecords = useSelector(selectTotalCount);
    const oppenings = useSelector(selectOppenings);
    const oppening = useSelector(selectOppening);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [add, setAdd] = useState(false);
    useEffect(() => { dispatch(getProfilesAsync()) }, [dispatch])
    useEffect(() => { dispatch(listVacancyAsync({ page, size: pageSize })); }, [dispatch, page, pageSize]);

    const formik = useFormik({
        initialValues: oppening,
        enableReinitialize: true,
        validate,
        onSubmit: async values => {
            await dispatch(postVacancyAsync(values));
            setAdd(false);
            dispatch(listVacancyAsync({ page, size: pageSize }));
        },
    });

    const openUpdate = (vac) => {
        setAdd(true);
        dispatch(updateOppening(vac));
    }
    const closeUpdate = () => {
        setAdd(false);
        dispatch(updateOppening({ ...dummyOppening }));
    }

    return (
        <>
            <Row className='profiles'>
                <Col xs={12}>
                    <Card className='cust-bshadow'>
                        <Card.Header>
                            <div className='d-flex justify-content-between' >
                                <div style={{ padding: '3px' }} >Vacancies</div>
                                <Button size='sm' variant='light' onClick={() => setAdd(!add)} >Add</Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup as="ol" >
                                {add && <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start" >
                                    <Form className='w-100'>
                                        <Row>
                                            <Col xs={6}>
                                                <div>Profile{formik.errors.profile_id ? <code> *{formik.errors.profile_id}</code> : null}</div>
                                                <Form.Select id="profile_id" onChange={formik.handleChange} value={formik.values.profile_id}>
                                                    <option>Select Profile</option>
                                                    {profiles && profiles.length > 0 && profiles.map((prof, i) => {
                                                        return <option key={prof.id} value={prof.id}>{prof.name}</option>
                                                    })}
                                                </Form.Select>
                                            </Col>
                                            <Col xs={6}>
                                                <div>Vacancies</div>
                                                <Form.Control id="vacancies" type="number" placeholder="Vacancies" onChange={formik.handleChange} value={formik.values.vacancies} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={6}>
                                                <div>Experiance</div>
                                                <Form.Control id="experiance" type="text" placeholder="Experiance" onChange={formik.handleChange} value={formik.values.experiance} />
                                            </Col>
                                            <Col xs={6}>
                                                <div>Closed</div>
                                                <Form.Control id="closed" type="number" placeholder="Closed" onChange={formik.handleChange} value={formik.values.closed} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={6}></Col>
                                            <Col xs={6}>
                                                <div className="d-flex justify-content-end">
                                                    <FcCancel size={'25px'} onClick={() => closeUpdate()} className='my-1 mx-3 cursor-pointer' />
                                                    <FcCheckmark size={'25px'} onClick={() => formik.handleSubmit()} className='my-1 cursor-pointer' />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </ListGroup.Item>}
                                {oppenings && oppenings.length > 0 && oppenings.map((vac, i) => {
                                    return <ListGroup.Item as="li" key={vac.id} className="d-flex justify-content-between align-items-start" >
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">{vac.profile_name}</div>
                                            <div>Experiance: {vac.experiance}</div>
                                        </div>
                                        <div>
                                            <Badge bg="primary" pill>{vac.closed}/{vac.vacancies}</Badge>
                                            <FcEditImage size={'25px'} onClick={() => openUpdate(vac)} tooltip="Edit" className='mx-2 cursor-pointer' />
                                        </div>
                                    </ListGroup.Item>
                                })}
                            </ListGroup>
                        </Card.Body>
                        {/* <Card.Footer>
                            <PaginationComp records={totalRecords} pageSize={pageSize} onChange={setPage} />
                        </Card.Footer> */}
                    </Card>
                </Col>
            </Row>
        </>
    )
}


export const VacancyView = () => {
    const dispatch = useDispatch();
    const oppenings = useSelector(selectOppenings);
    useEffect(() => { dispatch(listVacancyAsync({})); }, [dispatch]);
    return (
        <>
            {oppenings && oppenings.length > 0 && <Row className='profiles'>
                <Col xs={12}>
                    <Card className='cust-bshadow'>
                        <Card.Header>
                            <div>
                                <div style={{ padding: '3px' }} >Vacancies</div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup as="ol" >
                                {oppenings && oppenings.length > 0 && oppenings.map((vac, i) => {
                                    return <ListGroup.Item as="li" key={vac.id} className="d-flex justify-content-between align-items-start" >
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">{vac.profile_name}</div>
                                            <div>Experiance: {vac.experiance}</div>
                                        </div>
                                        <Badge bg="success" pill>{vac.closed}/{vac.vacancies}</Badge>
                                    </ListGroup.Item>
                                })}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>}
        </>
    )
}