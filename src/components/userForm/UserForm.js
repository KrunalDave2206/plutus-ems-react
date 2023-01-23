import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './UserForm.scss';
import { useFormik } from 'formik';

import { Row, Col, Form, Button } from "react-bootstrap";

import { postUserAsync, selectUser } from "./userFormSlice";
import { getDesignetionAsync, getRolesAsync, selectDesignation, selectRoles } from "../../services/master/masterSlice";
const validate = values => {
    const errors = {};
    if (!values.first_name) errors.first_name = 'Required';
    if (!values.email) { errors.email = 'Required'; }
    if (!values.role) { errors.role = 'Required'; }
    if (!values.designation) { errors.designation = 'Required'; }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) { errors.email = 'Invalid email address'; }

    return errors;
};
export function UserForm() {
    const dispatch = useDispatch();
    const designations = useSelector(selectDesignation);
    const user = useSelector(selectUser);
    const roles = useSelector(selectRoles);
    const dummyUser = {
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        password: "",
        birth_date: "",
        contact_primary: "",
        contact_alternative: "",
        contact_emergency: "",
        role: "",
        designation: "",
        current_address: "",
        permanent_address: "",
        reporting_to: "",
        join_date: "",
        experience_years: "",
        experience_month: "",
        personal_email: "",
        reference_employee_id: null,
        joining_date: "",
        machine_id: null,
        aadhar_card_number: "",
        pan_card_number: "",
        bank_account: "",
        bank_name: "",
        bank_address: ""
    }
    const onlyNum = (res) => {
        
        if (res != '') {
            if (isNaN(res)) {
                  
                ip.value = "";
                 
                fm.reset();
                return false;
            } else {
                return true
            }
        }
    }
    useEffect(() => { dispatch(getDesignetionAsync()); dispatch(getRolesAsync()); }, [dispatch])
    const formik = useFormik({
        initialValues: user && user.id ? user : dummyUser,
        enableReinitialize: true,
        validate,
        onSubmit: values => { dispatch(postUserAsync({ ...values, password: 'plutus@123' })) },
    });
    return (
        <>
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                    <Col xs={12} ><h3>Personal</h3></Col>
                    <hr />
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="first_name">
                            <Form.Label column="sm">Fisrt Name{formik.errors.first_name ? <code> *{formik.errors.first_name}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="Fisrt Name" onChange={formik.handleChange}
                                value={formik.values.first_name || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="middle_name">
                            <Form.Label column="sm">Middle Name{formik.errors.middle_name ? <code> *{formik.errors.middle_name}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="Middle Name" onChange={formik.handleChange}
                                value={formik.values.middle_name || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="last_name">
                            <Form.Label column="sm">Last Name{formik.errors.last_name ? <code> *{formik.errors.last_name}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="Last Name" onChange={formik.handleChange}
                                value={formik.values.last_name || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="contact_primary">
                            <Form.Label column="sm">Contact{formik.errors.contact_primary ? <code> *{formik.errors.contact_primary}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="Contact" onChange={formik.handleChange}
                                value={formik.values.contact_primary || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="contact_alternative">
                            <Form.Label column="sm">Alternative Contact{formik.errors.contact_alternative ? <code> *{formik.errors.contact_alternative}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="Alternative Contact" onChange={formik.handleChange}
                                value={formik.values.contact_alternative || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="contact_emergency">
                            <Form.Label column="sm">Emergency Contact{formik.errors.contact_emergency ? <code> *{formik.errors.contact_emergency}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="Emergency Contact" onChange={formik.handleChange}
                                value={formik.values.contact_emergency || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="personal_email" >
                            <Form.Label column="sm">Personal Email{formik.errors.personal_email ? <code> *{formik.errors.personal_email}</code> : null}</Form.Label>
                            <Form.Control type="email" placeholder="Personal Email" onChange={formik.handleChange}
                                value={formik.values.personal_email || ''} />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="birth_date" >
                            <Form.Label column="sm">Birth Date{formik.errors.birth_date ? <code> *{formik.errors.birth_date}</code> : null}</Form.Label>
                            <Form.Control type="date" placeholder="Birth Date" onChange={formik.handleChange}
                                value={formik.values.birth_date || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="current_address">
                            <Form.Label column="sm">Current Address{formik.errors.current_address ? <code> *{formik.errors.current_address}</code> : null}</Form.Label>
                            <Form.Control as="textarea" rows={4} onChange={formik.handleChange}
                                value={formik.values.current_address || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="permanent_address">
                            <Form.Label column="sm">Permanent Address{formik.errors.permanent_address ? <code> *{formik.errors.permanent_address}</code> : null}</Form.Label>
                            <Form.Control as="textarea" rows={4} onChange={formik.handleChange}
                                value={formik.values.permanent_address || ''} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className='mt-2'>
                    <Col xs={12} ><h3>Official</h3></Col>
                    <hr />
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="email" >
                            <Form.Label column="sm">Email{formik.errors.email ? <code> *{formik.errors.email}</code> : null}</Form.Label>
                            <Form.Control type="email" placeholder="Email" onChange={formik.handleChange}
                                value={formik.values.email || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="designation">
                            <Form.Label column="sm">Designation{formik.errors.designation ? <code> *{formik.errors.designation}</code> : null}</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={formik.handleChange}
                                value={formik.values.designation || ''}>
                                <option>Select Designation</option>
                                {designations && designations.slice().sort((item1, item2) => item1.name > item2.name ? 1 : -1).map((item, index) => {
                                    return <option key={item.id} value={item.id}>{item.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="role">
                            <Form.Label column="sm">Role{formik.errors.role ? <code> *{formik.errors.role}</code> : null}</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={formik.handleChange}
                                value={formik.values.role || ''}>
                                <option>Select Role</option>
                                {roles && roles.map((item, index) => {
                                    return <option key={item.id} value={item.id}>{item.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="reporting_to">
                            <Form.Label column="sm">Reporting To{formik.errors.reporting_to ? <code> *{formik.errors.reporting_to}</code> : null}</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={formik.handleChange}
                                value={formik.values.reporting_to || ''}>
                                <option>Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="join_date">
                            <Form.Label column="sm">Join Date{formik.errors.join_date ? <code> *{formik.errors.join_date}</code> : null}</Form.Label>
                            <Form.Control type="date" placeholder="Join Date" onChange={formik.handleChange}
                                value={formik.values.join_date || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" >
                            <Form.Label column="sm">Experience{formik.errors.experience_years ? <code> *{formik.errors.experience_years}</code> : null}{formik.errors.experience_month ? <code> *{formik.errors.experience_month}</code> : null}</Form.Label>
                            <Row>
                                <Col xs={6}>
                                    <Form.Control id="experience_years" type="text" placeholder="Year(s)" onChange={formik.handleChange}
                                        value={formik.values.experience_years || ''} />
                                </Col>
                                <Col xs={6}>
                                    <Form.Select id="experience_month" aria-label="Default select example" onChange={formik.handleChange}
                                        value={formik.values.experience_month || ''}>
                                        <option>Select Month</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                        <option value="4">Four</option>
                                        <option value="5">Five</option>
                                        <option value="6">Six</option>
                                        <option value="7">Seven</option>
                                        <option value="8">Eight</option>
                                        <option value="9">Nine</option>
                                        <option value="10">Ten</option>
                                        <option value="11">Eleven</option>
                                        <option value="12">Twelve</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className='mt-2'>
                    <Col xs={12} ><h3>Financial</h3></Col>
                    <hr />
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="pan_card_number">
                            <Form.Label column="sm">PAN Card No{formik.errors.pan_card_number ? <code> *{formik.errors.pan_card_number}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="PAN Card No" onChange={formik.handleChange}
                                value={formik.values.pan_card_number || ''} />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="aadhar_card_number">
                            <Form.Label column="sm">Adhar Card No{formik.errors.aadhar_card_number ? <code> *{formik.errors.aadhar_card_number}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="Adhar Card No" onChange={formik.handleChange}
                                value={formik.values.aadhar_card_number || ''} />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="bank_account">
                            <Form.Label column="sm">Bank Account No{formik.errors.bank_account ? <code> *{formik.errors.bank_account}</code> : null}</Form.Label>
                            <Form.Control type="text" placeholder="Bank Account No" onChange={formik.handleChange}
                                value={formik.values.bank_account || ''} />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="bank_name">
                            <Form.Label column="sm">Bank Name{formik.errors.bank_name ? <code> *{formik.errors.bank_name}</code> : null}</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={formik.handleChange}
                                value={formik.values.bank_name || ''}>
                                <option value="default" >--Select Bank Name --</option>
                                <option value="axis">Axis Bank</option>
                                <option value="bob">Bank Of Baroda</option>
                                <option value="SBI">State Bank Of India</option>
                                <option value="hdfc">HDFC Bank</option>
                                <option value="icici">ICICI Bank</option>
                                <option value="indus">IndusInd Bank</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4} >
                        <Form.Group className="mb-2" controlId="bank_address">
                            <Form.Label column="sm">Bank Address{formik.errors.bank_address ? <code> *{formik.errors.bank_address}</code> : null}</Form.Label>
                            <Form.Control as="textarea" rows={4} onChange={formik.handleChange}
                                value={formik.values.bank_address || ''} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} >
                        <div className="d-flex justify-content-end">
                            <Button className='mx-2' variant="light" type="reset">Reset</Button>
                            <Button className='mx-2' variant="primary" type="submit">Submit</Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </>
    )
}