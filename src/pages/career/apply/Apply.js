import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Row, Col, Form, InputGroup } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { getBase64 } from "../../../services/utils";

import loglo from '../../../assets/images/inside.svg';
import './Apply.scss';

import { postCandidateAsync, selectCadToken } from "../careerSlice";

import { useFormik } from 'formik';
const emailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
const numberOnly = new RegExp(/^\d+$/);
const validate = values => {
    const errors = {};
    if (!values.first_name || !values.first_name.trim()) errors.first_name = 'Required';
    if (!values.middle_name || !values.middle_name.trim()) errors.middle_name = 'Required';
    if (!values.last_name || !values.last_name.trim()) errors.last_name = 'Required';
    if (!values.gender || !values.gender.trim()) errors.gender = 'Required';

    if (!values.email || !values.email.trim()) errors.email = 'Required';
    else if (!emailRegex.test(values.email)) errors.email = 'Email is incorrrect.';

    if (!values.gender) errors.gender = 'Required';
    if (values.contact_number) values.contact_number = values.contact_number.trim()

    if (!values.contact_number) errors.contact_number = 'Required';
    else if (`${values.contact_number.trim()}`.length != 10) errors.contact_number = 'must be 10 digit';

    if (values.ssc_percentage && (values.ssc_percentage > 100 || values.ssc_percentage < 0)) errors.ssc_percentage = 'between 0 to 100';
    if (values.hsc_percentage && (values.hsc_percentage > 100 || values.hsc_percentage < 0)) errors.hsc_percentage = 'between 0 to 100';
    if (values.gr_course_cgpa && (values.gr_course_cgpa > 10 || values.gr_course_cgpa < 0)) errors.gr_course_cgpa = 'between 0 to 10';
    if (values.pg_course_cgpa && (values.pg_course_cgpa > 10 || values.pg_course_cgpa < 0)) errors.pg_course_cgpa = 'between 0 to 10';
    // if (!values.expected_salary) errors.expected_salary = '';

    if (values.contact_reference_1 && `${values.contact_reference_1.trim()}`.length != 10) errors.contact_reference_1 = 'must be 10 digit';
    if (values.contact_reference_2 && `${values.contact_reference_2.trim()}`.length != 10) errors.contact_reference_2 = 'must be 10 digit';

    if (values.resume) {
        values.resume = values.resume.toLowerCase();
        let allow = false;
        allow = values.resume.endsWith('.doc');
        if (!allow) allow = values.resume.endsWith('.docx');
        if (!allow) allow = values.resume.endsWith('.pdf');
        if (allow == false) errors.resume = "only pdf and doc files"
    }

    return errors;
};

export const CareerApply = () => {
    const dispatch = useDispatch();
    const cadToken = useSelector(selectCadToken);
    const [resumeFile, setResumeFile] = useState('');
    const formik = useFormik({
        initialValues: {},
        enableReinitialize: true,
        validate,
        onSubmit: async values => {
            let qualifications = [
                { university: values.pg_university_name || '', course: values.pg_course || '', year: values.pg_course_year || '', percentage: values.pg_course_cgpa || '' },
                { university: values.gr_university_name || '', course: values.gr_course || '', year: values.gr_course_year || '', percentage: values.gr_course_cgpa || '' },
                { university: values.hsc_school_name || '', course: "HSC", year: values.hsc_passout_year || '', percentage: values.hsc_percentage || '' },
                { university: values.ssc_school_name || '', course: "SSC", year: values.ssc_passout_year || '', percentage: values.ssc_percentage || '' },
            ]
            let data = { ...values, resume: resumeFile, qualifications }
            dispatch(postCandidateAsync(data));
        },
    });

    const onResumeChange = async (e) => {
        let resume = await getBase64(e.target.files[0]);
        setResumeFile(resume);
    }
    const numberOnlyInput = (event) => {
        if (event.which != 8 && isNaN(String.fromCharCode(event.which))) {
            event.preventDefault(); //stop character from entering input
        }
    }
    return (
        <div className="career-apply">
            {cadToken ? <Navigate to={'/career/exam'} /> : null}
            <div className='langin'>
                <img className='my-3' height={'60px'} src={loglo} ></img>
                <Card>
                    <Card.Body>
                        <Form onSubmit={formik.handleSubmit}>
                            <div className='personal_details'>
                                <h4>Personal Details</h4>
                                <Row>
                                    <Col xs={3}>
                                        <Form.Group className="mb-2" controlId="first_name">
                                            <Form.Label column="sm">First Name*{formik.errors.first_name ? <code> {formik.errors.first_name}</code> : null}</Form.Label>
                                            <Form.Control size='sm' type="text" placeholder="First Name" onChange={formik.handleChange}
                                                maxLength="20" value={formik.values.first_name || ''} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3}>
                                        <Form.Group className="mb-2" controlId="middle_name">
                                            <Form.Label column="sm">Middle Name*{formik.errors.middle_name ? <code> {formik.errors.middle_name}</code> : null}</Form.Label>
                                            <Form.Control size='sm' type="text" placeholder="Middle Name" onChange={formik.handleChange}
                                                maxLength="20" value={formik.values.middle_name || ''} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3}>
                                        <Form.Group className="mb-2" controlId="last_name">
                                            <Form.Label column="sm">Last Name*{formik.errors.last_name ? <code> {formik.errors.last_name}</code> : null}</Form.Label>
                                            <Form.Control size='sm' type="text" placeholder="Last Name" onChange={formik.handleChange}
                                                maxLength="20" value={formik.values.last_name || ''} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3}>
                                        <Form.Group className='form-group' controlId="gender">
                                            <Form.Label column="sm">Gender*{formik.errors.gender ? <code> {formik.errors.gender}</code> : null}</Form.Label>
                                            <Form.Select size='sm' aria-label="Select Gender" onChange={formik.handleChange} value={formik.values.gender || ''}>
                                                <option value="">Select Gender</option>
                                                <option value={1}>Female</option>
                                                <option value={2}>Male</option>
                                                <option value={3}>Other</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={4}>
                                        <Form.Group className="mb-2" controlId="email">
                                            <Form.Label column="sm">Email*{formik.errors.email ? <code> {formik.errors.email}</code> : null}</Form.Label>
                                            <Form.Control size='sm' type="email" placeholder="Email" onChange={formik.handleChange}
                                                value={formik.values.email || ''} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={4}>
                                        <Form.Group className="mb-2" controlId="contact_number">
                                            <Form.Label column="sm">Contact Number*{formik.errors.contact_number ? <code> {formik.errors.contact_number}</code> : null}</Form.Label>
                                            <Form.Control size='sm' onKeyDown={numberOnlyInput} type="text" placeholder="Contact Number" onChange={formik.handleChange}
                                                value={formik.values.contact_number || ''} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={4}>
                                        <Form.Group className="mb-2" >
                                            <Form.Label column="sm">Resume{formik.errors.resume ? <code> *{formik.errors.resume}</code> : null}</Form.Label>
                                            <Form.Control id="resume" accept=".doc, .docx , .pdf" size='sm' type="file" placeholder="Resume"
                                                onChange={(e) => { formik.handleChange(e); onResumeChange(e); }} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    {/* <Col xs={4}>
                                        <Form.Group className="mb-2" controlId="password">
                                            <Form.Label column="sm">Password{formik.errors.password ? <code> *{formik.errors.password}</code> : null}</Form.Label>
                                            <Form.Control size='sm' type="text" placeholder="Password" onChange={formik.handleChange}
                                                value={formik.values.password || ''} />
                                        </Form.Group>
                                    </Col> */}
                                    <Col xs={4}>
                                        <Form.Group className="mb-2" controlId="technology_of_interest">
                                            <Form.Label column="sm">Technology of interest{formik.errors.technology_of_interest ? <code> *{formik.errors.technology_of_interest}</code> : null}</Form.Label>
                                            <Form.Select className="select" size='sm' type="select" onChange={formik.handleChange}
                                                value={formik.values.technology_of_interest || ''}>
                                                <option value="">Select Technology</option>
                                                <option value="MEAN">MEAN</option>
                                                <option value="MERN">MERN</option>
                                                <option value="LAMP">LAMP (PHP, Magento, Laravel, Wordpress)</option>
                                                <option value=".Net">.Net</option>
                                                <option value="Python">Python</option>
                                                <option value="iOS">iOS</option>
                                                <option value="Android">Android</option>
                                                <option value="Flutter">Flutter</option>
                                                <option value="QA">QA</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={4}>
                                        <Form.Group className="mb-2" controlId="expected_salary">
                                            <Form.Label column="sm">Expected Salary{formik.errors.expected_salary ? <code> *{formik.errors.expected_salary}</code> : null}</Form.Label>
                                            {/* <InputGroup> */}
                                                {/* <Form.Control onKeyDown={numberOnlyInput} size='sm' type="text" placeholder="Expected Salary" onChange={formik.handleChange}
                                                    value={formik.values.expected_salary || ''} aria-describedby="expected_salary" />
                                                <InputGroup.Text size='sm' id="expected_salary">PA</InputGroup.Text> */}
                                                <Form.Select size='sm' aria-label="Select Gender" onChange={formik.handleChange} value={formik.values.expected_salary || ''}>
                                                    <option value="">Select Salary</option>
                                                    <option value={1}>1 LPA</option>
                                                    <option value={2}>2 LPA</option>
                                                    <option value={3}>3 LPA</option>
                                                    <option value={4}>4 LPA</option>
                                                    <option value={5}>5 LPA</option>
                                                    <option value={6}>6 LPA</option>
                                                    <option value={7}>7 LPA</option>
                                                    <option value={8}>8 LPA</option>
                                                    <option value={9}>9 LPA</option>
                                                    <option value={10}>10 LPA</option>
                                                    <option value={11}>11 LPA</option>
                                                    <option value={12}>12 LPA</option>
                                                    <option value={13}>13 LPA</option>
                                                    <option value={14}>14 LPA</option>
                                                    <option value={15}>15 LPA</option>
                                                </Form.Select>
                                            {/* </InputGroup> */}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={4}>
                                        <Form.Group className="mb-2" controlId="current_address">
                                            <Form.Label column="sm">Current Address{formik.errors.current_address ? <code> *{formik.errors.current_address}</code> : null}</Form.Label>
                                            <Form.Control size='sm' as="textarea" placeholder="Current Address" onChange={formik.handleChange}
                                                value={formik.values.current_address || ''} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={4}>
                                        <Form.Group className="mb-2" controlId="permanent_address">
                                            <Form.Label column="sm">Permanent Address{formik.errors.permanent_address ? <code> *{formik.errors.permanent_address}</code> : null}</Form.Label>
                                            <Form.Control size='sm' as="textarea" placeholder="Permanent Address" onChange={formik.handleChange}
                                                value={formik.values.permanent_address || ''} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={4}>
                                        <Form.Group className="mb-2" controlId="extra_note">
                                            <Form.Label column="sm">Note{formik.errors.extra_note ? <code> *{formik.errors.extra_note}</code> : null}</Form.Label>
                                            <Form.Control size='sm' as="textarea" placeholder="Note" onChange={formik.handleChange}
                                                value={formik.values.extra_note || ''} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                            <hr />
                            {/* </Col>
                                <Col xs={12} md={6}> */}
                            <div className="qualification_details">
                                <h4>Qualification Details</h4>
                                <Row>
                                    <Col xs={3}>
                                        <Form.Group className="mb-2" controlId="pg_university_name">
                                            <Form.Label column="sm">University Name{formik.errors.pg_university_name ? <code> *{formik.errors.pg_university_name}</code> : null}</Form.Label>
                                            <Form.Control size='sm' type="text" placeholder="University Name" onChange={formik.handleChange}
                                                maxLength="100" value={formik.values.pg_university_name || ''} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3}>
                                        <Form.Group className="mb-2" controlId="pg_course">
                                            <Form.Label column="sm">PG Course{formik.errors.pg_course ? <code> *{formik.errors.pg_course}</code> : null}</Form.Label>
                                            <Form.Control maxLength="20" size='sm' type="text" placeholder="PG Course" onChange={formik.handleChange}
                                                value={formik.values.pg_course || ''} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3}>
                                        <Form.Group className="mb-2" controlId="pg_course_year">
                                            <Form.Label column="sm">Year of passing{formik.errors.pg_course_year ? <code> *{formik.errors.pg_course_year}</code> : null}</Form.Label>
                                            <Form.Select size='sm' aria-label="Select Year" onChange={formik.handleChange} value={formik.values.pg_course_year || ''}>
                                                <option value="">Select Year</option>
                                                <option value={2010}>2010</option>
                                                <option value={2011}>2011</option>
                                                <option value={2012}>2012</option>
                                                <option value={2013}>2013</option>
                                                <option value={2014}>2014</option>
                                                <option value={2015}>2015</option>
                                                <option value={2016}>2016</option>
                                                <option value={2017}>2017</option>
                                                <option value={2018}>2018</option>
                                                <option value={2019}>2019</option>
                                                <option value={2020}>2020</option>
                                                <option value={2021}>2021</option>
                                                <option value={2022}>2022</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3}>
                                        <Form.Group className="mb-2" controlId="pg_course_cgpa">
                                            <Form.Label column="sm">CGPA{formik.errors.pg_course_cgpa ? <code> *{formik.errors.pg_course_cgpa}</code> : null}</Form.Label>
                                            <Form.Control size='sm' max={10} min={0} type="number" placeholder="CGPA" onChange={formik.handleChange}
                                                value={formik.values.pg_course_cgpa || ''} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={3}>
                                        <Form.Group className="mb-2" controlId="gr_university_name">
                                            <Form.Label column="sm">University Name{formik.errors.gr_university_name ? <code> *{formik.errors.gr_university_name}</code> : null}</Form.Label>
                                            <Form.Control size='sm' type="text" placeholder="University Name" onChange={formik.handleChange}
                                                maxLength="100" value={formik.values.gr_university_name || ''} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3}>
                                        <Form.Group className="mb-2" controlId="gr_course">
                                            <Form.Label column="sm">Graduation Course{formik.errors.gr_course ? <code> *{formik.errors.gr_course}</code> : null}</Form.Label>
                                            <Form.Control maxLength="20" size='sm' type="text" placeholder="Graduation Course" onChange={formik.handleChange}
                                                value={formik.values.gr_course || ''} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3}>
                                        <Form.Group className="mb-2" controlId="gr_course_year">
                                            <Form.Label column="sm">Year of passing{formik.errors.gr_course_year ? <code> *{formik.errors.gr_course_year}</code> : null}</Form.Label>
                                            <Form.Select size='sm' aria-label="Select Year" onChange={formik.handleChange} value={formik.values.gr_course_year || ''}>
                                                <option value="">Select Year</option>
                                                <option value={2010}>2010</option>
                                                <option value={2011}>2011</option>
                                                <option value={2012}>2012</option>
                                                <option value={2013}>2013</option>
                                                <option value={2014}>2014</option>
                                                <option value={2015}>2015</option>
                                                <option value={2016}>2016</option>
                                                <option value={2017}>2017</option>
                                                <option value={2018}>2018</option>
                                                <option value={2019}>2019</option>
                                                <option value={2020}>2020</option>
                                                <option value={2021}>2021</option>
                                                <option value={2022}>2022</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3}>
                                        <Form.Group className="mb-2" controlId="gr_course_cgpa">
                                            <Form.Label column="sm">CGPA{formik.errors.gr_course_cgpa ? <code> *{formik.errors.gr_course_cgpa}</code> : null}</Form.Label>
                                            <Form.Control size='sm' max={10} min={0} type="number" placeholder="CGPA" onChange={formik.handleChange}
                                                value={formik.values.gr_course_cgpa || ''} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={4}>
                                        <Form.Group className="mb-2" controlId="hsc_school_name">
                                            <Form.Label column="sm">HSC School Name{formik.errors.hsc_school_name ? <code> *{formik.errors.hsc_school_name}</code> : null}</Form.Label>
                                            <Form.Control size='sm' type="text" placeholder="HSC School Name" onChange={formik.handleChange}
                                                maxLength="100" value={formik.values.hsc_school_name || ''} />
                                        </Form.Group>
                                    </ Col>
                                    <Col xs={4}>
                                        <Form.Group className="mb-2" controlId="hsc_passout_year">
                                            <Form.Label column="sm">HSC Year of passing{formik.errors.hsc_passout_year ? <code> *{formik.errors.hsc_passout_year}</code> : null}</Form.Label>
                                            <Form.Select size='sm' aria-label="Select Year" onChange={formik.handleChange} value={formik.values.hsc_passout_year || ''}>
                                                <option value="">Select Year</option>
                                                <option value={2010}>2010</option>
                                                <option value={2011}>2011</option>
                                                <option value={2012}>2012</option>
                                                <option value={2013}>2013</option>
                                                <option value={2014}>2014</option>
                                                <option value={2015}>2015</option>
                                                <option value={2016}>2016</option>
                                                <option value={2017}>2017</option>
                                                <option value={2018}>2018</option>
                                                <option value={2019}>2019</option>
                                                <option value={2020}>2020</option>
                                                <option value={2021}>2021</option>
                                                <option value={2022}>2022</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </ Col>
                                    <Col xs={4}>
                                        <Form.Group className="mb-2" controlId="hsc_percentage">
                                            <Form.Label column="sm">Percentage{formik.errors.hsc_percentage ? <code> *{formik.errors.hsc_percentage}</code> : null}</Form.Label>
                                            <Form.Control size='sm' max={100} min={0} type="number" placeholder="Percentage" onChange={formik.handleChange}
                                                value={formik.values.hsc_percentage || ''} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={4}>
                                        <Form.Group className="mb-2" controlId="ssc_school_name">
                                            <Form.Label column="sm">SSC School Name{formik.errors.ssc_school_name ? <code> *{formik.errors.ssc_school_name}</code> : null}</Form.Label>
                                            <Form.Control size='sm' type="text" placeholder="SSC School Name" onChange={formik.handleChange}
                                                value={formik.values.ssc_school_name || ''} />
                                        </Form.Group>
                                    </ Col>
                                    <Col xs={4}>
                                        <Form.Group className="mb-2" controlId="ssc_passout_year">
                                            <Form.Label column="sm">SSC Year of passing{formik.errors.ssc_passout_year ? <code> *{formik.errors.ssc_passout_year}</code> : null}</Form.Label>
                                            {/* <Form.Control size='sm' type="number" placeholder="SSC Year of passing" onChange={formik.handleChange}
                                                value={formik.values.ssc_passout_year || ''} /> */}
                                            <Form.Select size='sm' aria-label="Select Year" onChange={formik.handleChange} value={formik.values.ssc_passout_year || ''}>
                                                <option>Select Year</option>
                                                <option value={2010}>2010</option>
                                                <option value={2011}>2011</option>
                                                <option value={2012}>2012</option>
                                                <option value={2013}>2013</option>
                                                <option value={2014}>2014</option>
                                                <option value={2015}>2015</option>
                                                <option value={2016}>2016</option>
                                                <option value={2017}>2017</option>
                                                <option value={2018}>2018</option>
                                                <option value={2019}>2019</option>
                                                <option value={2020}>2020</option>
                                                <option value={2021}>2021</option>
                                                <option value={2022}>2022</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </ Col>
                                    <Col xs={4}>
                                        <Form.Group className="mb-2" controlId="ssc_percentage">
                                            <Form.Label column="sm">Percentage{formik.errors.ssc_percentage ? <code> *{formik.errors.ssc_percentage}</code> : null}</Form.Label>
                                            <Form.Control size='sm' max={100} min={0} type="number" placeholder="Percentage" onChange={formik.handleChange}
                                                value={formik.values.ssc_percentage || ''} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={3}>
                                        <Form.Group className="mb-2" controlId="reference_1">
                                            <Form.Label column="sm">Reference 1{formik.errors.reference_1 ? <code> *{formik.errors.reference_1}</code> : null}</Form.Label>
                                            <Form.Control size='sm' type="text" placeholder="Reference" onChange={formik.handleChange}
                                                value={formik.values.reference_1 || ''} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3}>
                                        <Form.Group className="mb-2" controlId="contact_reference_1">
                                            <Form.Label column="sm">Contact{formik.errors.contact_reference_1 ? <code> *{formik.errors.contact_reference_1}</code> : null}</Form.Label>
                                            <Form.Control size='sm' type="text" onKeyDown={numberOnlyInput} placeholder="Contact" onChange={formik.handleChange}
                                                value={formik.values.contact_reference_1 || ''} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3}>
                                        <Form.Group className="mb-2" controlId="reference_2">
                                            <Form.Label column="sm">Reference 2{formik.errors.reference_2 ? <code> *{formik.errors.reference_2}</code> : null}</Form.Label>
                                            <Form.Control size='sm' type="text" placeholder="Reference" onChange={formik.handleChange}
                                                value={formik.values.reference_2 || ''} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={3}>
                                        <Form.Group className="mb-2" controlId="contact_reference_2">
                                            <Form.Label column="sm">Contact{formik.errors.contact_reference_2 ? <code> *{formik.errors.contact_reference_2}</code> : null}</Form.Label>
                                            <Form.Control size='sm' type="text" onKeyDown={numberOnlyInput} placeholder="Contact" onChange={formik.handleChange}
                                                value={formik.values.contact_reference_2 || ''} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                            {/* </Col>
                            </Row> */}
                            <div className='mt-4 text-center'>
                                <Button className='btn-cut-submit-outline' type='submit' size="lg">Start Test</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}