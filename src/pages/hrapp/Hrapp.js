import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate } from "react-router-dom";
import './Hrapp.scss';
import { Row, Col, Navbar, Container, Nav } from "react-bootstrap";

import { routePath } from "../../routelink";
import { PERMISSIONS } from "../../services/constants";


export const HrApp = (props) => {
    
    const loginUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const permissions = loginUser ? JSON.parse(loginUser.permissions) : null;
    const allowedHrDept = permissions ? permissions.indexOf(PERMISSIONS.hr_dept) > -1 : false;

    const href = window.location.href;

    return (
        <>
            {!allowedHrDept && <Navigate to="/dashboard" />}
            <Row className='mb-3 hrapp'>
                <Col md={12}>
                    <div className="page-header-actions">
                        <Navbar expand="md">
                            <Container>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="me-auto">
                                        <Nav.Link as={Link} to={routePath.vacancy} className={href.indexOf(routePath.vacancy) > -1 ? 'active' : ''} >Profiles / Vacancies / Holidays</Nav.Link>
                                        <Nav.Link as={Link} to={routePath.candidates} className={href.indexOf(routePath.candidates) > -1 ? 'active' : ''}>Candidates</Nav.Link>
                                        <Nav.Link as={Link} to={routePath.policy} className={href.indexOf(routePath.policy) > -1 ? 'active' : ''}>Policy</Nav.Link>
                                        <Nav.Link as={Link} to={routePath.questions} className={href.indexOf(routePath.questions) > -1 ? 'active' : ''}>Questions</Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                    </div>
                </Col>
            </Row>
            <Row className='hrapp'>
                <Col md={12}>{props.children}</Col>
            </Row>
        </>
    )
}