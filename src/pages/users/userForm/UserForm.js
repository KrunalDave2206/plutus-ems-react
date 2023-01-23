import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './UserForm.scss';
import { useFormik } from 'formik';
import { Form, Button, Table, FormControl, Card, Stack, ListGroup, Modal, Dropdown } from "react-bootstrap";

import { putWorkPreferenceAsync, postUserAsync, selectUser, selectUsersProjects, selectProfile, getProfileAsync, selectStatus, clearStatus, selectUsersTimeTracked, postChangePasswordAsync } from "./userFormSlice";
import { getDesignetionAsync, selectDesignation, getAllEmployeeAsync, selectAllEmployees } from "../../../services/master/masterSlice";

import { showNow } from "../../../components/toast/toastSlise";
import { PERMISSIONS } from "../../../services/constants";

const validate = values => {
    const errors = {};
    if (!values.first_name || values.first_name.trim().length == 0) errors.first_name = 'Required';
    if (!values.email || values.email.trim().length == 0) { errors.email = 'Required'; }

    if (!values.designation) { errors.designation = 'Required'; }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) { errors.email = 'Invalid email address'; }
    if (values.birth_date) {
        let dob = new Date(values.birth_date); dob.setHours(0, 0, 0, 0)
        let now = new Date(); now.setHours(0, 0, 0, 0);
        if (dob >= now) errors.birth_date = 'cann\'t be in future'
    }
    return errors;
};
const passRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*(?=.*[#$^+=!*()@%&]).{8,15}$');

export function UserForm(props) {
    const dispatch = useDispatch();
    const designations = useSelector(selectDesignation);
    const user = useSelector(selectUser);
    const alEMployees = useSelector(selectAllEmployees);
  
    // const roles = useSelector(selectRoles);
    const apiStatus = useSelector(selectStatus);
    const dummyUser = {
        emp_no: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: 0,
        email: "",
        password: "",
        birth_date: null,
        contact_primary: "",
        contact_alternative: "",
        contact_emergency: "",
        role: "",
        designation: "",
        c_address: "",
        p_address: "",
        reporting_employee_id: "",
        joining_date: null,
        experience_years: "",
        experience_month: "",
        personal_email: "",
        reference_employee_id: null,
        machine_id: null,
        aadhar_card_number: "",
        pancard_number: "",
        bank_account_number: "",
        bank_name: "",
        bank_address: "",
        user_aud: false,
        permissions: []
    }

    useEffect(() => {
        dispatch(getDesignetionAsync());
        dispatch(getAllEmployeeAsync());
    }, [dispatch])

    useEffect(() => {
        if (apiStatus != 1 && apiStatus != null) {
            dispatch(showNow({ variant: 'danger', body: apiStatus }));
        } else if (apiStatus == 1) {
            if (props.closePopup) props.closePopup();
            if (props.listUsers) props.listUsers();
        }
        dispatch(clearStatus());
    }, [apiStatus])

    const formik = useFormik({
        initialValues: user && user.id ? user : dummyUser,
        enableReinitialize: true,
        validate,
        onSubmit: async values => {
            await dispatch(postUserAsync({ ...values }));
            // if (props.closePopup) props.closePopup();
            // if (props.listUsers) props.listUsers();
        },
    });
    
    return (
        <>
            <Form onSubmit={formik.handleSubmit} className="user-form">
                <Stack direction='horizontal' gap={3} >
                    <Stack gap={2}>
                        <h4 className='mb-0'>Personal</h4>
                        <Form.Group className='form-group' controlId="first_name">
                            <Form.Label column="sm">First Name{formik.errors.first_name ? <code> *{formik.errors.first_name}</code> : null}</Form.Label>
                            <Form.Control maxLength={20} size="sm" type="text" placeholder="First Name" onChange={formik.handleChange}
                                value={formik.values.first_name || ''} />
                        </Form.Group>
                        <Form.Group className='form-group' controlId="middle_name">
                            <Form.Label column="sm">Middle Name{formik.errors.middle_name ? <code> *{formik.errors.middle_name}</code> : null}</Form.Label>
                            <Form.Control maxLength={20} size="sm" type="text" placeholder="Middle Name" onChange={formik.handleChange}
                                value={formik.values.middle_name || ''} />
                        </Form.Group>
                        <Form.Group className='form-group' controlId="last_name">
                            <Form.Label column="sm">Last Name{formik.errors.last_name ? <code> *{formik.errors.last_name}</code> : null}</Form.Label>
                            <Form.Control maxLength={20} size="sm" type="text" placeholder="Last Name" onChange={formik.handleChange}
                                value={formik.values.last_name || ''} />
                        </Form.Group>
                        <Form.Group className='form-group' controlId="gender">
                            <Form.Label column="sm">Gender{formik.errors.gender ? <code> *{formik.errors.gender}</code> : null}</Form.Label>
                            <Form.Select size='sm' aria-label="Select Gender" onChange={formik.handleChange} value={formik.values.gender || ''}>
                                <option>Select Gender</option>
                                <option value={1}>Female</option>
                                <option value={2}>Male</option>
                                <option value={3}>Other</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className='form-group' controlId="birth_date" >
                            <Form.Label column="sm">Birth Date{formik.errors.birth_date ? <code> *{formik.errors.birth_date}</code> : null}</Form.Label>
                            <Form.Control maxLength={20} size="sm" type="date" placeholder="Birth Date" onChange={formik.handleChange}
                                value={formik.values.birth_date || ''} />
                        </Form.Group>
                    </Stack>
                    <Stack gap={2}>
                        <h4 className='mb-0'>Contact</h4>
                        <Form.Group className='form-group' controlId="contact_primary">
                            <Form.Label column="sm">Contact{formik.errors.contact_primary ? <code> *{formik.errors.contact_primary}</code> : null}</Form.Label>
                            <Form.Control maxLength={10} size="sm" type="text" placeholder="Contact" onChange={formik.handleChange}
                                value={formik.values.contact_primary || ''} />
                        </Form.Group>
                        <Form.Group className='form-group' controlId="contact_alternative">
                            <Form.Label column="sm">Alternative Contact{formik.errors.contact_alternative ? <code> *{formik.errors.contact_alternative}</code> : null}</Form.Label>
                            <Form.Control maxLength={10} size="sm" type="text" placeholder="Alternative Contact" onChange={formik.handleChange}
                                value={formik.values.contact_alternative || ''} />
                        </Form.Group>
                        <Form.Group className='form-group' controlId="personal_email" >
                            <Form.Label column="sm">Personal Email{formik.errors.personal_email ? <code> *{formik.errors.personal_email}</code> : null}</Form.Label>
                            <Form.Control maxLength={50} size="sm" type="email" placeholder="Personal Email" onChange={formik.handleChange}
                                value={formik.values.personal_email || ''} />
                        </Form.Group>
                        <Form.Group className='form-group' controlId="c_address">
                            <Form.Label column="sm">Current Address{formik.errors.c_address ? <code> *{formik.errors.c_address}</code> : null}</Form.Label>
                            <Form.Control maxLength={100} size="sm" as="textarea" rows={3} onChange={formik.handleChange}
                                value={formik.values.c_address || ''} />
                        </Form.Group>
                        <Form.Group className='form-group' controlId="p_address">
                            <Form.Label column="sm">Permanent Address{formik.errors.p_address ? <code> *{formik.errors.p_address}</code> : null}</Form.Label>
                            <Form.Control maxLength={100} size="sm" as="textarea" rows={3} onChange={formik.handleChange}
                                value={formik.values.p_address || ''} />
                        </Form.Group>
                    </Stack>
                    <Stack gap={2}>
                        <h4 className='mb-0'>Employment</h4>
                        <Form.Group className='form-group' controlId="emp_no" >
                            <Form.Label column="sm">Employee No.{formik.errors.emp_no ? <code> *{formik.errors.emp_no}</code> : null}</Form.Label>
                            <Form.Control maxLength={10} size="sm" type="text" placeholder="Employee No." onChange={formik.handleChange}
                                value={formik.values.emp_no || ''} />
                        </Form.Group>
                        <Form.Group className='form-group' controlId="email" >
                            <Form.Label column="sm">Email{formik.errors.email ? <code> *{formik.errors.email}</code> : null}</Form.Label>
                            <Form.Control maxLength={50} size="sm" type="email" placeholder="Email" onChange={formik.handleChange}
                                value={formik.values.email || ''} />
                        </Form.Group>
                        <Form.Group className='form-group' controlId="designation">
                            <Form.Label column="sm">Designation{formik.errors.designation ? <code> *{formik.errors.designation}</code> : null}</Form.Label>
                            <Form.Select size='sm' aria-label="Default select example" onChange={formik.handleChange}
                                value={formik.values.designation || ''}>
                                <option>Select Designation</option>
                                {designations && designations.slice().sort((item1, item2) => item1.name > item2.name ? 1 : -1).map((item, index) => {
                                    return <option key={item.id} value={item.id}>{item.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>
                        {/* <Form.Group className='form-group' controlId="role">
                            <Form.Label column="sm">Role{formik.errors.role ? <code> *{formik.errors.role}</code> : null}</Form.Label>
                            <Form.Select size='sm' aria-label="Default select example" onChange={formik.handleChange}
                                value={formik.values.role || ''}>
                                <option>Select Role</option>
                                {roles && roles.map((item, index) => {
                                    return <option key={item.id} value={item.id}>{item.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group> */}
                        
                        <Form.Group className='form-group' controlId="reporting_employee_id">
                            <Form.Label column="sm">Reporting To{formik.errors.reporting_employee_id ? <code> *{formik.errors.reporting_employee_id}</code> : null}</Form.Label>
                            <Form.Select size='sm' aria-label="Default select example" onChange={formik.handleChange}
                                value={formik.values.reporting_employee_id || ''}>
                                <option>Select Reporting to</option>
                                

                                {alEMployees && alEMployees.slice().sort((item1, item2) => item1.emp_name > item2.emp_name ? 1 : -1).map((item, index) => {
                                    return <option key={item.id} value={item.id}>{item.emp_name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className='form-group' controlId="joining_date">
                            <Form.Label column="sm">Join Date{formik.errors.joining_date ? <code> *{formik.errors.joining_date}</code> : null}</Form.Label>
                            <Form.Control size="sm" type="date" placeholder="Join Date" onChange={formik.handleChange}
                                value={formik.values.joining_date || ''} />
                        </Form.Group>
                        <Form.Group className='form-group' >
                            <Form.Label column="sm">Experience
                                {formik.errors.experience_years ? <code> *{formik.errors.experience_years}</code> : null}
                                
                                {formik.errors.experience_month ? <code> *{formik.errors.experience_month}</code> : null}
                            </Form.Label>
                            <Stack direction='horizontal' gap={3} >
                                <Form.Control size="sm" id="experience_years" type="num" min="0" inputmode="numeric" placeholder="Year(s)"  pattern="^[0-9]*$" onChange={formik.handleChange}
                                    value={formik.values.experience_years || ''} />   
                                <Form.Select size='sm' id="experience_month" aria-label="Default select example" onChange={formik.handleChange}
                                    value={formik.values.experience_month || ''}>
                                    <option>Month</option>
                                    <option value="0">Zero</option> 
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
                            </Stack>
                        </Form.Group>
                    </Stack>
                    <Stack gap={2}>
                        <h4 className='mb-0'>Financial</h4>
                        <Form.Group className='form-group' controlId="pancard_number">
                            <Form.Label column="sm">PAN Card No{formik.errors.pancard_number ? <code> *{formik.errors.pancard_number}</code> : null}</Form.Label>
                            <Form.Control maxLength={10} size="sm" type="text" placeholder="PAN Card No" onChange={formik.handleChange}
                                value={formik.values.pancard_number || ''} />
                        </Form.Group>
                        <Form.Group className='form-group' controlId="aadhar_card_number">
                            <Form.Label column="sm">Adhar Card No{formik.errors.aadhar_card_number ? <code> *{formik.errors.aadhar_card_number}</code> : null}</Form.Label>
                            <Form.Control maxLength={20} size="sm" type="text" placeholder="Adhar Card No" onChange={formik.handleChange}
                                value={formik.values.aadhar_card_number || ''} />
                        </Form.Group>
                        <Form.Group className='form-group' controlId="bank_account_number">
                            <Form.Label column="sm">Bank Account No{formik.errors.bank_account_number ? <code> *{formik.errors.bank_account_number}</code> : null}</Form.Label>
                            <Form.Control maxLength={30} size="sm" type="text" placeholder="Bank Account No" onChange={formik.handleChange}
                                value={formik.values.bank_account_number || ''} />
                        </Form.Group>
                        <Form.Group className='form-group' controlId="bank_name">
                            <Form.Label column="sm">Bank Name{formik.errors.bank_name ? <code> *{formik.errors.bank_name}</code> : null}</Form.Label>
                            <Form.Select size='sm' aria-label="Default select example" onChange={formik.handleChange}
                                value={formik.values.bank_name || ''}>
                                <option value="default" >Select Bank Name</option>
                                <option value="axis">Axis Bank</option>
                                <option value="bob">Bank Of Baroda</option>
                                <option value="SBI">State Bank Of India</option>
                                <option value="hdfc">HDFC Bank</option>
                                <option value="icici">ICICI Bank</option>
                                <option value="indus">IndusInd Bank</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className='form-group' controlId="bank_address">
                            <Form.Label column="sm">Bank Address{formik.errors.bank_address ? <code> *{formik.errors.bank_address}</code> : null}</Form.Label>
                            <Form.Control maxLength={100} size="sm" as="textarea" rows={4} onChange={formik.handleChange}
                                value={formik.values.bank_address || ''} />
                        </Form.Group>
                    </Stack>
                    <Stack gap={1}>
                        <h4>Permissions</h4>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <h6 className='font-cust-color mb-0'>HR Dept.</h6>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf(PERMISSIONS.hr_dept) > -1}
                                    name="permissions" value={PERMISSIONS.hr_dept} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <h6 className='font-cust-color mb-0'>Users</h6>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>All</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf(PERMISSIONS.users_all) > -1}
                                    name="permissions" value={PERMISSIONS.users_all} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>Team</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'}
                                    checked={formik.values.permissions.indexOf(PERMISSIONS.users_team) > -1}
                                    name="permissions" value={PERMISSIONS.users_team} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>Add</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf(PERMISSIONS.users_add) > -1}
                                    name="permissions" value={PERMISSIONS.users_add} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <h6 className='font-cust-color m-0'>Projects</h6>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>All</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf(PERMISSIONS.projects_all) > -1}
                                    name="permissions" value={PERMISSIONS.projects_all} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>Team mgt.</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf(PERMISSIONS.projects_team) > -1}
                                    name="permissions" value={PERMISSIONS.projects_team} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>Add</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf(PERMISSIONS.projects_add) > -1}
                                    name="permissions" value={PERMISSIONS.projects_add} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <h6 className='font-cust-color m-0'>Clients</h6>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>All</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf(PERMISSIONS.clients_all) > -1}
                                    name="permissions" value={PERMISSIONS.clients_all} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>Add</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf(PERMISSIONS.clients_add) > -1}
                                    name="permissions" value={PERMISSIONS.clients_add} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <h6 className='font-cust-color m-0'>Leaves</h6>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>All</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf(PERMISSIONS.leaves_all) > -1}
                                    name="permissions" value={PERMISSIONS.leaves_all} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>Add</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf(PERMISSIONS.leaves_add) > -1}
                                    name="permissions" value={PERMISSIONS.leaves_add} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>Team</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf(PERMISSIONS.leaves_team) > -1}
                                    name="permissions" value={PERMISSIONS.leaves_team} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>Take Action</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf(PERMISSIONS.leaves_action) > -1}
                                    name="permissions" value={PERMISSIONS.leaves_action} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <h6 className='font-cust-color m-0'>Time Tracker</h6>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>All</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf(PERMISSIONS.timetrack_view_all) > -1}
                                    name="permissions" value={PERMISSIONS.timetrack_view_all} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>Team</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf(PERMISSIONS.timetrack_view_team) > -1}
                                    name="permissions" value={PERMISSIONS.timetrack_view_team} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>Delete Team/All</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf(PERMISSIONS.timetrack_delete) > -1}
                                    name="permissions" value={PERMISSIONS.timetrack_delete} onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                    </Stack>
                    {/* <Stack gap={1}>
                        <h4>Permissions</h4>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>Users</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf("user") > -1}
                                    name="permissions" value="user" onClick={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>Projects</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf("project") > -1}
                                    name="permissions" value="project" onChange={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>Clients</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf("client") > -1}
                                    name="permissions" value="client" onChange={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>Leaves</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf("leaves") > -1}
                                    name="permissions" value="leaves" onChange={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                        <Stack direction='horizontal' className='justify-content-between'>
                            <span>HR Dept.</span>
                            <Form.Check type={'switch'} >
                                <Form.Check.Input type={'checkbox'} checked={formik.values.permissions.indexOf("hrdept") > -1}
                                    name="permissions" value="hrdept" onChange={formik.handleChange} />
                            </Form.Check>
                        </Stack>
                    </Stack> */}
                </Stack>
                <hr />
                <Stack direction='horizontal' gap={3} className="justify-content-end">
                    {/* <Button className='mx-2' variant="light" onClick={() => dispatch(clearUserForm())} type="button">Reset</Button> */}
                    <Button className='mx-2 btn-cut-submit' variant="light" type="submit">Submit</Button>
                </Stack>
            </Form>
        </>
    )
}

export const UsersProjects = () => {
    const users = useSelector(selectUsersProjects);
    const [searchKey, setSearchKey] = useState('');
    const handleSearch = (e) => { setSearchKey(e.target.value); }
    return (
        <>
            <div className='mb-2'><FormControl type='text' onKeyUp={handleSearch} placeholder='Search'></FormControl></div>
            <Table striped bordered className='user-projects'>
                <thead>
                    <tr><th>Employee</th><th>Projects</th></tr>
                </thead>
                <tbody>
                    {users && users.length > 0 && users.map((u, i) => {
                        if (searchKey && searchKey.length > 0)
                            if (u.employee.startsWith(searchKey))
                                return <tr key={i}><td>{u.employee}</td><td className='up-pj'>
                                    {u.project_name && u.project_name.length > 0 ? u.project_name.map((pj, pi) => {
                                        return <div className='pjm-block'>
                                            <div className='pj'>{pj.project_name}</div>
                                            {pj.project_manager && <div className='pjm'>({pj.project_manager})</div>}
                                        </div>
                                    }) : <span>&nbsp;</span>}
                                </td></tr>
                            else return ''
                        else
                            return <tr key={i}><td>{u.employee}</td><td className='up-pj'>
                                {u.project_name && u.project_name.length > 0 ? u.project_name.map((pj, pi) => {
                                    return <div className='pjm-block'>
                                        <div className='pj'>{pj.project_name}</div>
                                        {pj.project_manager && <div className='pjm'>({pj.project_manager})</div>}
                                    </div>
                                }) : <span>&nbsp;</span>}
                            </td></tr>
                    })}
                </tbody>
            </Table>
        </>
    )
}

const changePasswordvalidate = values => {

    const errors = {};
    if (!values.current_pass || values.current_pass.trim().length == 0) errors.current_pass = 'Required';
    if (!values.new_pass || values.new_pass.trim().length == 0
        || values.new_pass.trim().length > 15 || values.new_pass.trim().length < 8) errors.new_pass = 'Min 8 and Max 15 char required';
    else if (!passRegex.test(values.new_pass)) errors.new_pass = 'Required 1 Caps, 1 small, 1 special charactor, 1 number';

    if (!values.new_pass_again || values.new_pass_again.trim().length == 0
        || values.new_pass_again.trim().length > 15 || values.new_pass_again.trim().length < 8) errors.new_pass_again = 'Required';
    else if (!passRegex.test(values.new_pass_again)) errors.new_pass_again = 'Required 1 Caps, 1 small, 1 special charactor, 1 number';
    else if (values.new_pass_again !== values.new_pass) errors.new_pass_again = 'Password do not match';

    return errors;
};

export const UserProfile = (props) => {
    const dispatch = useDispatch();
    const authUser = JSON.parse(localStorage.getItem('user'));
    const user_id = authUser.id;
    const user = useSelector(selectProfile);
    const [openChangPass, setOpenChangPass] = useState(false);
    const fpFormik = useFormik({
        initialValues: { current_pass: '', new_pass: '', new_pass_again: '' },
        enableReinitialize: true,
        validate: changePasswordvalidate,
        onSubmit: async values => {
      
            dispatch(postChangePasswordAsync({ ...values, user_id }));
            setOpenChangPass(false);
        },
    });

    useEffect(() => { dispatch(getProfileAsync(user_id)); }, [dispatch])

    const handleWorkPreference = async (wpref) => {
        await dispatch(putWorkPreferenceAsync({ work_from: wpref }));
        dispatch(getProfileAsync(user_id));
    }

    return (
        <>
            <div className="page-header-actions mb-4">
                <Stack style={{ width: '100%' }} direction="horizontal" gap={3} className='justify-content-between'>
                    <Button className="btn-cut-submit-outline" variant="light" onClick={() => setOpenChangPass(true)} >Change Password</Button>
                </Stack>
            </div>
            {user && <>
                <Stack direction='horizontal' gap={3} className='al-baseline'>
                    <Stack direction='horizontal' gap={3} className='al-baseline w-50'>
                        <Stack direction='vertical' gap={3} className='al-baseline w-50'>
                            <Card className='w-100'>
                                <Card.Header>Personal</Card.Header>
                                <Card.Body>
                                    <Stack gap={3}>
                                        <div className='d-flex justify-content-between'><b>Employee No:</b> <span>{user.emp_no}</span></div>
                                        <div className='d-flex justify-content-between'><b>Name:</b> <span> {user.first_name} {user.last_name}</span></div>
                                        <div className='d-flex justify-content-between'><b>Gender:</b> <span> {user.gender == 1 ? 'Female' : (user.gender == 2 ? 'Male' : 'Other')}</span></div>
                                        <div className='d-flex justify-content-between'><b>Birth Date:</b> <span> {user.birth_date}</span></div>
                                        <div className='d-flex justify-content-between'><b>Account Status:</b> <span> {user.account_status == 1 ? 'Active' : 'Inactive'}</span></div>
                                    </Stack>
                                </Card.Body>
                            </Card>
                            <Card className='w-100'>
                                <Card.Header>Contact</Card.Header>
                                <Card.Body>
                                    <Stack gap={3}>
                                        <div className='d-flex justify-content-between'><b>Email:</b><span> {user.email}</span></div>
                                        <div className='d-flex justify-content-between'><b>Contact No:</b><span> {user.contact_primary}</span></div>
                                        <div className='d-flex justify-content-between'><b>Alt. Contact No:</b><span> {user.contact_alternative}</span></div>
                                        <div><div><b>Currunt Address:</b></div><div> {user.c_address}</div></div>
                                        <div><div><b>Permanent Address:</b></div><div> {user.p_address}</div></div>
                                    </Stack>
                                </Card.Body>
                            </Card>
                        </Stack>
                        <Stack direction='vertical' gap={3} className='al-baseline w-50'>
                            <Card className='w-100'>
                                <Card.Header>Employment</Card.Header>
                                <Card.Body>
                                    <Stack gap={3}>
                                        <div className='d-flex justify-content-between'><b>Designation / Role:</b><span> {user.designation}</span></div>
                                        <div className='d-flex justify-content-between'><b>Reporting To:</b><span> {user.reporting_employee}</span></div>
                                        <div className='d-flex justify-content-between'><b>Joining Date:</b><span> {user.joining_date}</span></div>
                                        <div className='d-flex justify-content-between'><b>Account Status:</b><span> {user.account_status == 1 ? 'Active' : 'Inactive'}</span></div>
                                    </Stack>
                                </Card.Body>
                            </Card>
                            <Card className='w-100'>
                                <Card.Header>Finacial</Card.Header>
                                <Card.Body>
                                    <Stack gap={3}>
                                        <div className='d-flex justify-content-between'><b>AADHAR No:</b><span> {user.aadhar_card_number}</span></div>
                                        <div className='d-flex justify-content-between'><b>PAN Card No:</b><span> {user.pancard_number}</span></div>
                                        <div className='d-flex justify-content-between'><b>Bank Account No:</b><span> {user.bank_account_number}</span></div>
                                        <div className='d-flex justify-content-between'><b>Bank Name:</b><span> {user.bank_name}</span></div>
                                        <div className='d-flex justify-content-between'><b>Bank Address:</b><span> {user.bank_address}</span></div>
                                    </Stack>
                                </Card.Body>
                            </Card>
                        </Stack>
                    </Stack>
                    <Stack direction='horizontal' gap={3} className='al-baseline'>
                        <Dropdown>
                            <Dropdown.Toggle className="btn-cut-submit hide-dd-arrow" variant="success" id="dropdown-basic">
                                Work From ? {`${user.work_preference ? '( ' + user.work_preference + ' )' : ''}`}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleWorkPreference('office')} >Office</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleWorkPreference('home')} >Home</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Stack>
                </Stack>
            </>}
            <Modal backdrop="static" size="sm" centered show={openChangPass} onHide={() => setOpenChangPass(false)}>
                <Modal.Header closeButton>Change Password</Modal.Header>

                <Modal.Body>
                    <Form onSubmit={fpFormik.handleSubmit} className="user-form">
                        <Stack gap={1} className='justify-content-center'>
                            <Form.Group className='form-group' controlId="current_pass">
                                <Form.Label column="sm">Current Password{fpFormik.errors.current_pass ? <code> *{fpFormik.errors.current_pass}</code> : null}</Form.Label>
                                <Form.Control maxLength={15} size="sm" type="password" placeholder="Current Password" onChange={fpFormik.handleChange}
                                    value={fpFormik.values.current_pass || ''} />
                            </Form.Group>
                            <Form.Group className='form-group' controlId="new_pass">
                                <Form.Label column="sm">New Password{fpFormik.errors.new_pass ? <code> *{fpFormik.errors.new_pass}</code> : null}</Form.Label>
                                <Form.Control maxLength={15} size="sm" type="password" placeholder="New Password" onChange={fpFormik.handleChange}
                                    value={fpFormik.values.new_pass || ''} />
                            </Form.Group>
                            <Form.Group className='form-group' controlId="new_pass_again">
                                <Form.Label column="sm">Confirm Password{fpFormik.errors.new_pass_again ? <code> *{fpFormik.errors.new_pass_again}</code> : null}</Form.Label>
                                <Form.Control maxLength={15} size="sm" type="password" placeholder="Confirm Password" onChange={fpFormik.handleChange}
                                    value={fpFormik.values.new_pass_again || ''} />
                            </Form.Group>
                        </Stack>
                        <hr />
                        <Stack direction='horizontal' gap={3} className="justify-content-end">
                            <Button className="btn-cut-submit" variant="light" type="submit" size='sm' >Update</Button>
                        </Stack>
                    </Form>
                </Modal.Body>

            </Modal>
        </>
    )
}

export const UserTimeTracked = (props) => {
    const timeTracked = useSelector(selectUsersTimeTracked)

    return (
        <>
            <ListGroup>
                {timeTracked && timeTracked.map((time, index) => {
                    return <ListGroup.Item key={index}>
                        <Stack direction="horizontal" gap={3} className='justify-content-between'>
                            <div><small>Name</small><br />{time.emp_name}</div>
                            <Stack direction="horizontal" gap={3} >
                                <div><small>Active</small><br />{time.active}</div>
                                <div><small>Total</small><br />{time.total}</div>
                                <div><small>Activity</small><br />{time.activity}</div>
                            </Stack>
                        </Stack>
                    </ListGroup.Item>
                })}
            </ListGroup>
        </>
    )
}