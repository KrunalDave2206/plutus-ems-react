import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './ClientForm.scss';
import { useFormik } from 'formik';

import { Row, Col, Form, Button, ListGroup } from "react-bootstrap";

import { postClientAsync, selectClient, clearClient } from "./clientFormSlice";
// import { listClientsAsync } from "../clientsSlice";
const validate = values => {
    const errors = {};
    if (!values.name) errors.name = 'Required';

    return errors;
};
export const ClientForm = (props) => {
    const dispatch = useDispatch();
    const client = useSelector(selectClient);
    const dummyClient = { name: "", client_contact: "", username: "", password: "" }
    const formik = useFormik({
        initialValues: client && client.id ? client : dummyClient,
        enableReinitialize: true,
        validate,
        onSubmit: async values => {
            await dispatch(postClientAsync({ ...values }))
            if (props.onSubmit) props.onSubmit();
        },
    });
    return (
        <>
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                    <Col xs={12} md={6} >
                        <Form.Group className="mb-2" controlId="name">
                            <Form.Label column="sm">Name{formik.errors.name ? <code> *{formik.errors.name}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="Name" onChange={formik.handleChange} value={formik.values.name || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6} >
                        <Form.Group className="mb-2" controlId="client_contact">
                            <Form.Label column="sm">Contact{formik.errors.client_contact ? <code> *{formik.errors.client_contact}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="Contact" onChange={formik.handleChange} value={formik.values.client_contact || ''} />
                        </Form.Group>
                    </Col>
                    {/* <Col xs={12} md={6} >
                        <Form.Group className="mb-2" controlId="username">
                            <Form.Label column="sm">Username{formik.errors.username ? <code> *{formik.errors.username}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="Username" onChange={formik.handleChange} value={formik.values.username || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6} >
                        <Form.Group className="mb-2" controlId="password">
                            <Form.Label column="sm">Password{formik.errors.password ? <code> *{formik.errors.password}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="password" onChange={formik.handleChange} value={formik.values.password || ''} />
                        </Form.Group>
                    </Col> */}
                </Row>
                <Row className='mt-3'>
                    <Col xs={12} >
                        <div className="d-flex justify-content-end">
                            <Button className='mx-2' variant="light" onClick={() => { dispatch(clearClient()) }} type="reset">Reset</Button>
                            <Button className='mx-2 btn-cut-submit' variant="primary" type="submit">Submit</Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </>
    )
}