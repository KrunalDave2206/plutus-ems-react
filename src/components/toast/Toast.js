import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toast, Button, ToastContainer } from "react-bootstrap";

import { selectBody, selectDelay, selectHeader, selectShow, selectVariant, hide, showNow } from "./toastSlise";

export const ToastComp = (props) => {
    const dispatch = useDispatch();
    const body = useSelector(selectBody);
    const delay = useSelector(selectDelay);
    const header = useSelector(selectHeader);
    const show = useSelector(selectShow);
    const variant = useSelector(selectVariant);

    return (
        <>
            {/* <Button onClick={() => {
                dispatch(showNow({ delay: 3000, variant: 'danger', header: 'Hello', body: 'Error is here!' }))
            }} >Show Toast</Button>
            <Button onClick={() => { dispatch(hide()); }} >Hide Toast</Button> */}
            <ToastContainer position="top-end" className='p-3'>
                <Toast bg={variant} onClose={() => { dispatch(hide()); }} show={show} delay={delay} autohide={true}>
                    {header && <Toast.Header><strong className="me-auto">{header}</strong></Toast.Header>}
                    <Toast.Body className={(variant === 'dark' || variant === 'danger') && 'text-white'} >{body}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    )
}