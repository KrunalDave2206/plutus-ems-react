import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button, Row, Col } from 'react-bootstrap';

import loglo from '../../../assets/images/inside.svg';
import './Landing.scss';

export const CareerLanding = () => {
    return (
        <div className="career-landing align-self-center text-center">
            <div className='langin'>
                <img height={'60px'} src={loglo} ></img>
                <div className='my-4 d-grid gap-4'>
                    <Button as={Link} to={'/career/apply'} className='btn-cut-submit-outline' size="lg">New Application</Button>
                    <Button as={Link} to={'/login'} className='btn-cut-submit-outline' size="lg">Login</Button>
                </div>
            </div>
        </div>
    )
}