import React, { useState } from 'react';
import { NavbarComponent } from "../components/navbar02/Navbar";
import { Container, Row, Col } from "react-bootstrap";
import bg from '../assets/images/bg.svg';

export function Protected(props) {
    return (
        <Container fluid className='p-0'>
            <div className='root-container'>
                <div className='root-nav'><NavbarComponent /></div>
                <div className='root-main'>
                    <img src={bg} style={{ position: "absolute", opacity: "0.2", top: "0", border: "0", left: "0", right: "0", zIndex: "-1" }} />
                    {props.children}
                </div>
            </div>
        </Container>
    )
}