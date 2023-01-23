import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import './Navbar.scss';

import { Navbar, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";

import { routePath } from "../../routelink";
import loglo from '../../assets/images/logoonly.svg';

import {
    FcConferenceCall, FcBusinessman, FcHome, FcManager, FcLeave,
    FcTimeline, FcStatistics, FcOrgUnit, FcDownLeft
} from "react-icons/fc";


import { PERMISSIONS } from "../../services/constants";

const iconSize = '30px';
const overlayDelay = { show: 50, hide: 100 };


export const NavbarComponent = (props) => {
    const authUser = JSON.parse(localStorage.getItem('user'));
    const [lgout, setLgOut] = useState(authUser ? false : true);
    const href = window.location.href;
    const permissions = authUser ? JSON.parse(authUser.permissions) : null;
    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setLgOut(true); }
    const activeLink = (path) => { return href.indexOf(`${path}`) > -1 ? 'active' : ''; }

    return (
        <>
            {lgout && <Navigate to="/login" />}
            <Navbar expand={false} className="navigation">
                <Navbar.Brand href="#"><img src={loglo} ></img></Navbar.Brand>
                <ListGroup>
                    <OverlayTrigger placement="right" delay={overlayDelay} overlay={<Tooltip id="button-tooltip-2">Dashboard</Tooltip>} >
                        <ListGroup.Item as={Link} className={activeLink(routePath.dashboard)} to={routePath.dashboard}>
                            <FcHome size={iconSize} />
                        </ListGroup.Item>
                    </OverlayTrigger>
                    <OverlayTrigger placement="right" delay={overlayDelay} overlay={<Tooltip id="button-tooltip-1">Reports</Tooltip>} >
                        <ListGroup.Item as={Link} className={activeLink(routePath.reports)} to={routePath.reports+'/time-spent'}>
                            <FcStatistics size={iconSize} />
                        </ListGroup.Item>
                    </OverlayTrigger>      
                    <OverlayTrigger placement="right" delay={overlayDelay} overlay={<Tooltip id="button-tooltip-1">Projects</Tooltip>} >
                        <ListGroup.Item as={Link} className={activeLink(routePath.project)} to={routePath.projects}>
                            <FcTimeline size={iconSize} />
                        </ListGroup.Item>
                    </OverlayTrigger>              
                    {permissions && permissions.indexOf(PERMISSIONS.clients_all) > -1 &&
                        <OverlayTrigger placement="right" delay={overlayDelay} overlay={<Tooltip id="button-tooltip-1">Clients</Tooltip>} >
                            <ListGroup.Item as={Link} className={activeLink(routePath.clients)} to={routePath.clients}>
                                <FcBusinessman size={iconSize} />
                            </ListGroup.Item>
                        </OverlayTrigger>}
                    <OverlayTrigger placement="right" delay={overlayDelay} overlay={<Tooltip id="button-tooltip-1">Team</Tooltip>} >
                        <ListGroup.Item as={Link} className={activeLink(routePath.users)} to={routePath.users}>
                            <FcConferenceCall size={iconSize} />
                        </ListGroup.Item>
                    </OverlayTrigger>
                    <OverlayTrigger placement="right" delay={overlayDelay} overlay={<Tooltip id="button-tooltip-1">Leaves</Tooltip>} >
                        <ListGroup.Item as={Link} className={activeLink(routePath.leaves)} to={routePath.leaves}>
                            <FcLeave size={iconSize} />
                        </ListGroup.Item>
                    </OverlayTrigger>
                    {permissions && permissions.indexOf(PERMISSIONS.hr_dept) > -1 &&
                        <OverlayTrigger placement="right" delay={overlayDelay} overlay={<Tooltip id="button-tooltip-1">HR Dept.</Tooltip>} >
                            <ListGroup.Item as={Link} className={activeLink('/hrapp/')} to={routePath.vacancy}>
                                <FcOrgUnit size={iconSize} />
                            </ListGroup.Item>
                        </OverlayTrigger>}
                    <OverlayTrigger placement="right" delay={overlayDelay} overlay={<Tooltip id="button-tooltip-1">Me</Tooltip>} >
                        <ListGroup.Item as={Link} className={activeLink(routePath.profile)} to={routePath.profile}>
                            <FcManager size={iconSize} />
                        </ListGroup.Item>
                    </OverlayTrigger>
                    <OverlayTrigger placement="right" delay={overlayDelay} overlay={<Tooltip id="button-tooltip-1">Log out</Tooltip>} >
                        <ListGroup.Item className='cursor-pointer' onClick={handleLogout}>
                            <FcDownLeft size={iconSize} />
                        </ListGroup.Item>
                    </OverlayTrigger>
                </ListGroup>
            </Navbar>
        </>
    )
}