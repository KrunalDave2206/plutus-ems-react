import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FcEditImage, FcCheckmark, FcCancel } from 'react-icons/fc';
import './Holidays.scss';
import { Row, Col, ListGroup, Button, Card, Form } from "react-bootstrap";

import { listHolidaysAsync, postHolidaysAsync, selectHolidays, selectTotalCount } from "./holidaysSlice";
import { PaginationComp } from "../../../components/pagination/pagination";

export const Holidays = () => {
    const dispatch = useDispatch();
    const holidays = useSelector(selectHolidays);
    const totalRecords = useSelector(selectTotalCount);
    const [pageSize, setPageSize] = useState(15);
    const [page, setPage] = useState(1);
    const [holiday, setHoliday] = useState({ name: '', id: '', date: '' });
    useEffect(() => { dispatch(listHolidaysAsync({ page, size: pageSize })); }, [dispatch, page, pageSize]);

    const submitHoliday = async () => {
        if (holiday.name) {
            await dispatch(postHolidaysAsync(holiday));
            setHoliday({ name: '', id: '', date: '' });
            dispatch(listHolidaysAsync({ page, size: pageSize }));
        }
    }

    return (
        <>
            <Row className='holidays'>
                <Col xs={12} md={12}>
                    <Card className='cust-bshadow'>
                        <Card.Header>
                            <div className='d-flex justify-content-between' >
                                <div style={{ padding: '3px' }} >Holidays</div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup as="ol" >
                                <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start" >
                                    <Row>
                                        <Col md={4} className="pe-0">
                                            <Form.Control type="date" placeholder="Holiday date" onChange={(e) => {
                                                setHoliday({ date: e.target.value, name: holiday.name, id: holiday.id })
                                            }} value={holiday.date} />
                                        </Col>
                                        <Col md={5} className="pe-0">
                                            <Form.Control type="text" placeholder="Name" onChange={(e) => {
                                                setHoliday({ date: holiday.date, name: e.target.value, id: holiday.id })
                                            }} value={holiday.name} />
                                        </Col>
                                        <Col md={3} className="mt-1 px-0">
                                            <FcCancel size={'25px'} onClick={() => setHoliday({ name: '', id: '', date: '' })} className='my-1 mx-3 cursor-pointer' />
                                            <FcCheckmark size={'25px'} onClick={() => submitHoliday()} className='my-1 cursor-pointer' />
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {holidays && holidays.length > 0 && holidays.map((holi, i) => {
                                    return <ListGroup.Item as="li" key={holi.id} className="d-flex justify-content-between align-items-start" >
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold"><code>{holi.date}</code> {holi.name}</div>
                                        </div>
                                        <div>
                                            <FcEditImage size={'25px'} onClick={() => setHoliday(holi)} tooltip="Edit" className='mx-1 cursor-pointer' />
                                        </div>
                                    </ListGroup.Item>
                                })}
                            </ListGroup>
                        </Card.Body>
                        <Card.Footer>
                            <PaginationComp records={totalRecords} pageSize={pageSize} onChange={setPage} />
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </>
    )
}