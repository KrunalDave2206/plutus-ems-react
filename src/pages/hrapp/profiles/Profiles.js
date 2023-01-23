import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FcEditImage, FcCheckmark, FcCancel } from 'react-icons/fc';
import './Profiles.scss';
import { Row, Col, ListGroup, Button, Card, Form } from "react-bootstrap";

import { listProfilesAsync, selectProfiles, selectTotalCount, postProfilesAsync } from "./profilesSlice";
import { PaginationComp } from "../../../components/pagination/pagination";
import { getProfilesAsync } from "../../../services/master/masterSlice";
import { Vacancy } from "../vacancy/Vacancy";
import { Holidays } from "../holidays/Holidays";
// import { Candidates } from "../candidates/Candidates";


export const Profiles = () => {
    const dispatch = useDispatch();
    const profiles = useSelector(selectProfiles);
    const totalRecords = useSelector(selectTotalCount);
    const [pageSize, setPageSize] = useState(7);
    const [page, setPage] = useState(1);
    const [profile, setProfile] = useState({ name: '', id: '' });
    useEffect(() => { dispatch(listProfilesAsync({ page, size: pageSize })); }, [dispatch, page, pageSize]);

    const submitProfile = async () => {
        if (profile.name) {
            await dispatch(postProfilesAsync(profile));
            setProfile({ name: '', id: '' });
            dispatch(listProfilesAsync({ page, size: pageSize }));
            dispatch(getProfilesAsync())
        }
    }

    return (
        <>
            {/* <Row className='mb-4'>
                <Candidates />
            </Row> */}
            <Row className='profiles'>
                <Col xs={6} md={4}>
                    <Card className='cust-bshadow'>
                        <Card.Header>
                            <div className='d-flex justify-content-between' >
                                <div style={{ padding: '3px' }} >Profiles</div>
                                {/* <div className='d-flex'>
                                    <Button size='sm' onClick={() => { }} className='btn-cut-outline mx-2'>Add</Button>
                                </div> */}
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup as="ol" >
                                <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start" >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">
                                            <Form.Control type="text" placeholder="Profile name" onChange={(e) => {
                                                setProfile({ name: e.target.value, id: profile.id })
                                            }} value={profile.name} />
                                        </div>
                                    </div>
                                    <div>
                                        <FcCancel size={'25px'} onClick={() => setProfile({ name: '', id: '' })} className='my-1 mx-3 cursor-pointer' />
                                        <FcCheckmark size={'25px'} onClick={() => submitProfile()} className='my-1 cursor-pointer' />
                                    </div>
                                </ListGroup.Item>
                                {profiles && profiles.length > 0 && profiles.map((prof, i) => {
                                    return <ListGroup.Item as="li" key={prof.id} className="d-flex justify-content-between align-items-start" >
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">{prof.name}</div>
                                        </div>
                                        <div>
                                            <FcEditImage size={'25px'} onClick={() => setProfile(prof)} tooltip="Edit" className='mx-1 cursor-pointer' />
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
                <Col xs={6} md={4}><Vacancy /></Col>
                <Col xs={6} md={4}><Holidays /></Col>
            </Row>
        </>
    )
}