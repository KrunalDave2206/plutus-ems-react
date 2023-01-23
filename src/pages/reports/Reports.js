import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Link } from 'react-router-dom';
import { Button } from "react-bootstrap";
import './Reports.scss';

import { routePath } from "../../routelink";

export const Reports = (props) => {
    return (
        <>
            <div className="page-header-actions mb-3">
                <Button as={Link} className={`me-2 btn-cut-submit-outline`} variant="light" to={routePath.reports + '/time-spent'} >Time Spent</Button>
                <Button as={Link} className={`btn-cut-submit-outline`} variant="light" to={routePath.reports + '/activity'} >Activty</Button>
            </div>
            <Outlet />
        </>
    )
}