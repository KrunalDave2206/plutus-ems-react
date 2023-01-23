import React, { useState } from 'react';
import { Row, Col, Nav } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import './header.scss'

export const HeaderComponent = (props) => {
    const authUser = JSON.parse(localStorage.getItem('user'));
    const [lgout, setLgOut] = useState(authUser ? false : true);
    const href = window.location.href;
    // let navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLgOut(true);
    }

    return (
        <Row>
            {lgout && <Navigate to="/login" />}
            <Col md={2} className="hl text-end">
                <div className='caps'>{authUser && authUser.first_name} {authUser && authUser.last_name} &nbsp;</div>
            </Col>
            <Col md={10} className="hr">
                <div className='caps'>
                    <Nav as="ul">
                        <Nav.Item as="li">
                            <Nav.Link className={href.indexOf('/dashboard') > -1 ? 'active' : ''} as={Link} to="/dashboard">Dashboard</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link className={href.indexOf('/users') > -1 ? 'active' : ''} as={Link} to="/users">Users</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link className={href.indexOf('/projects') > -1 ? 'active' : ''} as={Link} to="/projects">Projects</Nav.Link>
                        </Nav.Item>
                        {authUser && authUser.role_name == 'Admin' && <Nav.Item as="li">
                            <Nav.Link className={href.indexOf('/clients') > -1 ? 'active' : ''} as={Link} to="/clients">Clients</Nav.Link>
                        </Nav.Item>}
                        <Nav.Item as="li">
                            <Nav.Link className={href.indexOf('/leaves') > -1 ? 'active' : ''} as={Link} to="/leaves">Leaves</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link className={href.indexOf('/tasks') > -1 ? 'active' : ''} as={Link} to="/tasks">Tasks</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link className={href.indexOf('/hrapp/') > -1 ? 'active' : ''} as={Link} to="/hrapp/vacancy">HR App.</Nav.Link>
                        </Nav.Item>
                        {/* <Nav.Item as="li">
                            <Nav.Link className={href.indexOf('/policy') > -1 ? 'active' : ''} as={Link} to="/policy">Policy</Nav.Link>
                        </Nav.Item> */}
                        <Nav.Item as="li">
                            <Nav.Link onClick={handleLogout}>Log out</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
            </Col>
        </Row>
    )
};