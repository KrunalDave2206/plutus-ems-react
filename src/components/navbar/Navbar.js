import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import './Navbar.scss';

import { Navbar, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

import { routePath } from "../../routelink";
import loglo from '../../assets/images/inside.svg';

// const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
//     <Navbar.Toggle ref={ref} onClick={e => { e.preventDefault(); onClick(e); }}>
//         {/* &#x25bc; */}
//         {/* {children} */}
//     </Navbar.Toggle>
// ));

export const NavbarComponent = (props) => {
    const authUser = JSON.parse(localStorage.getItem('user'));
    const [lgout, setLgOut] = useState(authUser ? false : true);
    // let navigate = useNavigate();
    const href = window.location.href;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLgOut(true);
    }
    const activeLink = (path) => {
        return href.indexOf(`${path}`) > -1 ? 'active' : '';
    }
    return (
        <>
            {lgout && <Navigate to="/login" />}
            <Navbar expand={false} className="navigation">
                <Navbar.Brand href="#"><img src={loglo} ></img></Navbar.Brand>
                <ListGroup variant="flush" className='w-100'>
                    <ListGroup.Item as={Link} className={activeLink(routePath.profile)} to={routePath.profile}>{authUser && authUser.first_name} {authUser && authUser.last_name}</ListGroup.Item>
                    <ListGroup.Item as={Link} className={activeLink(routePath.dashboard)} to={routePath.dashboard}>Dashboard</ListGroup.Item>
                    <ListGroup.Item as={Link} className={activeLink(routePath.users)} to={routePath.users}>Users</ListGroup.Item>
                    <ListGroup.Item as={Link} className={activeLink(routePath.leaves)} to={routePath.leaves}>Leaves</ListGroup.Item>
                    {authUser && authUser.role_name == 'Admin' &&
                        <ListGroup.Item as={Link} className={activeLink(routePath.clients)} to={routePath.clients}>Clients</ListGroup.Item>}
                    <ListGroup.Item as={Link} className={activeLink(routePath.projects)} to={routePath.projects}>Projects</ListGroup.Item>
                    <ListGroup.Item as={Link} className={activeLink('/task')} to={routePath.tasks}>Tasks</ListGroup.Item>
                    <ListGroup.Item as={Link} className={activeLink('/hrapp/')} to={routePath.vacancy}>HR App.</ListGroup.Item>
                    {/* <ListGroup.Item as={Link} className={activeLink(routePath.policy)} to={routePath.policy}>Policy</ListGroup.Item> */}
                    <ListGroup.Item className='cursor-pointer' onClick={handleLogout}>Log out</ListGroup.Item>
                </ListGroup>
            </Navbar>
            {/* <div className='ems-footer'>
                &copy; {new Date().getFullYear()} Plutus Technologies Pvt. Ltd.
            </div> */}
        </>
    )
}