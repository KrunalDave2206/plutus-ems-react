import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Navigate } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import './Login.scss';
import loglo from '../../assets/images/logo.svg';
import bg from '../../assets/images/bg.svg';

import { loginAsync, selectStatus, selectToken } from "./loginSlice";

const validate = values => {
    const errors = {};
    if (!values.password) { errors.password = 'Required'; }
    else if (values.password.length < 8) { errors.password = 'Must be 8 characters or more'; }

    if (!values.email) { errors.email = 'Required'; }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) { errors.email = 'Invalid email address'; }

    return errors;
};

export function Login() {

    const status = useSelector(selectStatus);
    const token = useSelector(selectToken);
    const dispatch = useDispatch();
    // let token = localStorage.getItem('token');
    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validate,
        onSubmit: values => { dispatch(loginAsync(values)); },
    });
    return (
        <>
            <img src={bg} style={{ position: "fixed", opacity: "0.2", top: "0", border: "0", left: "0", right: "0", "z-index": "-1" }} />
            <Row className='m-0 h-100vh'>
                <Col md={{ span: 6, offset: 3 }} className="align-self-center">
                    <div className='login-view'>
                        {token ? <Navigate to={'/'} /> : null}
                        <Row>
                            <Col md={8} className="left-pan d-flex flex-column">
                                <div className="h-100 d-flex flex-column align-items-center text-center justify-content-center">
                                    {/* <h1>inside</h1> */}
                                    <img className='logi' src={loglo} ></img>
                                    {/* <img className='logi' src={insideLogo} ></img> */}

                                    {/* <h3>Employee Management System</h3> */}
                                    {/* &copy;{new Date().getFullYear()} Plutus Technologies PVT. LTD. */}
                                </div>
                                {/* <div className="w-100 text-end">
                                    <Link to="/career" className='text-decoration-none d-inline-block '>
                                        <h3 className="">career</h3>
                                    </Link>
                                </div> */}
                            </Col>

                            <Col md={4} className="right-pan">
                                {status ? <code>*{status}</code> : null}
                                <Form onSubmit={formik.handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email address{formik.errors.email ? <code>*{formik.errors.email}</code> : null}</Form.Label>
                                        <Form.Control
                                            name="email"
                                            type="email"
                                            onChange={formik.handleChange}
                                            value={formik.values.email}
                                            placeholder="Enter email" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Password{formik.errors.password ? <code>*{formik.errors.password}</code> : null}</Form.Label>
                                        <Form.Control
                                            name="password"
                                            type="password"
                                            onChange={formik.handleChange}
                                            value={formik.values.password}
                                            placeholder="Password" />
                                    </Form.Group>
                                    <div className="d-grid gap-2">
                                        <Button variant="primary" className='btn-cut-outline' type="submit">Log In</Button>
                                        {/* <Button to="/career" as={Link} variant="primary" className='btn-cut-outline' type="submit">Career</Button> */}
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </>
    )
}