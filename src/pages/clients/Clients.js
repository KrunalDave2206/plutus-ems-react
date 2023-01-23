import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from "react-router-dom";
import './Clients.scss';
import { Button, Row, Col, Card, Modal } from "react-bootstrap";
import { FcEditImage, FcDeleteDatabase, FcViewDetails } from 'react-icons/fc';

import { ClientForm } from "./clientForm/ClientForm";
import { selectClients, listClientsAsync, selectTotalCount } from "./clientsSlice";
// import { getProjectAsync } from "../../components/projectForm/projectFormSlice";
import { getClientAsync } from "./clientForm/clientFormSlice";
import { PaginationComp } from "../../components/pagination/pagination";

import { PERMISSIONS } from "../../services/constants";

export const Clients = () => {
    const dispatch = useDispatch();
    const clients = useSelector(selectClients);
    const [showAddPopup, setShowAddPopup] = useState(false)
    const [pageSize, setPageSize] = useState(20);
    const [page, setPage] = useState(1);
    const totalRecords = useSelector(selectTotalCount);
    useEffect(() => { dispatch(listClientsAsync({ page, size: pageSize })); }, [page, pageSize]);
    const getClients = () => { dispatch(listClientsAsync({ page, size: pageSize })); };
    const editClient = (client_id) => {
        dispatch(getClientAsync(client_id));
        setShowAddPopup(true)
    }
    const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const permissions = authUser.permissions ? JSON.parse(authUser.permissions) : null;
    const allowedClient = permissions ? permissions.indexOf(PERMISSIONS.clients_all) > -1 : false;

    return (
        <>
            {!allowedClient && <Navigate to="/dashboard" />}
            <Row className='mb-4'>
                <Col md={12}>
                    {authUser && permissions.indexOf(PERMISSIONS.clients_add) > -1 &&
                        <div className="page-header-actions">
                            <Button onClick={() => { setShowAddPopup(true) }} variant='light' className='btn-cut-submit-outline'>Add New</Button>
                        </div>}
                </Col>
            </Row>
            <Row>
                <Col xs={12} className="client-page-view">
                    <div className="me-2">
                        <PaginationComp alignment={'vertical'} records={totalRecords} pageSize={pageSize} onChange={setPage} />
                    </div>
                    <div className='client-list'>
                        {clients && clients.map((client, i) => {
                            return <div className='client-view' key={client.id}>
                                <div className={`detail ${permissions.includes(PERMISSIONS.clients_add) !== true ? 'round' : ''}`}>
                                    <div className="name">{client.name}</div>
                                    <div className='client-detail'>
                                        <span className='me-3'>Users: {client.team || 0}</span>
                                        <span>Projects: {client.projects || 0}</span>
                                    </div>
                                    <div className='client-detail'>
                                        <span>{client.client_contact}</span>
                                    </div>
                                </div>
                                {permissions.indexOf(PERMISSIONS.clients_add) > -1 && <div className='action'>
                                    <FcEditImage size={'25px'} tooltip="Edit" className='mx-1 cursor-pointer' onClick={() => editClient(client.id)} />
                                    <FcDeleteDatabase size={'25px'} tooltip="Delete" className='mx-1 cursor-pointer' onClick={() => alert('Delete')} />
                                </div>}
                            </div>
                        })}
                    </div>
                </Col>
            </Row>
            {authUser && permissions.indexOf(PERMISSIONS.clients_add) > -1 &&
                <Modal backdrop="static" size="md" show={showAddPopup} onHide={() => setShowAddPopup(false)}>
                    <Modal.Header closeButton> Add / Update Client </Modal.Header>
                    <Modal.Body><ClientForm onSubmit={() => { getClients(); setShowAddPopup(false) }} /> </Modal.Body>
                </Modal>
            }
        </>
    )
}