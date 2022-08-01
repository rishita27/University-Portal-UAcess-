/**
 * Renders the application form to apply for a given program within a university.
 * The url of this page must contain the program uuid as a path param.
 * The list of countries and states/provinces are fetched dynamically with a backend API.
 *
 * @author [Amrita Krishna](amrita@dal.ca)
 */
import {Button, Card, Col, Container, Form, FormGroup, Modal, Row, Spinner} from "react-bootstrap";
import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import StudentNavbar from "../../../components/StudentNavbar";
import {getCountries} from "../../../api/CountryService";
import {sendApplication, uploadApplicationDocuments} from "../../../api/ApplicationService";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";


function ProgramApplication() {
    const navigate = useNavigate();
    const {programID} = useParams();
    const [countries, setCountries] = useState([])
    const [provinces, setProvinces] = useState([])
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm();
    const language_test_values = Array.from(new Array(19),(val, index) => index * 0.5);

    /**
     * The function is invoked when user clicks submit on application form.
     * Uploads the documents followed by creation of application.
     * Displays modal on success/failure.
     */
    const onSubmit = data => {
        setLoading(true);
        const formData = new FormData();
        formData.append('resume', data.resumeFile[0]);
        formData.append('language_test', data.languageFile[0])
        formData.append('transcript', data.transcriptFile[0])
        uploadApplicationDocuments(formData).then(result => (
            sendApplication(data, result.data, programID, result.data.user_id).then(res=> {
                setLoading(false);
                setSuccess(true)
            }).catch(err => {
                setLoading(false);
                setFailure(true)
            })
        ))

    }

    /**
     * Sets country value to display relevant states in the province dropdown
     */
    const setCountry = (event) => {
        const selected = event.target.value
        const states = countries.filter(country => country.name === selected)[0].states
        setProvinces(states)
    }

    /**
     * Fetches the list of countries and corresponding states on page load
     */
    useEffect(() => {
        getCountries()
            .then(res => {
                setCountries(res.data);
            })
    }, []);

    /**
     * Closes the modal and redirects to applications list.
     */
    function closeModal() {
        setSuccess(false);
        setFailure(false);
        navigate("/student-dashboard/list")
    }

    return (
        <div>
            <StudentNavbar/>
            <Container>
                <Modal className="text-center" show={success} onHide={() => closeModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title>UAccess</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>You have successfully submitted your application.</p>
                        <p>Please check the applications page to view the status.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => closeModal()}>Close</Button>
                    </Modal.Footer>
                </Modal>

                <Modal className="text-center" show={failure} onHide={() => closeModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title>UAccess</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Unable to complete the request to apply for the program.</p>
                        <p>Please check the details and refill the form or try again later.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => closeModal()}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <h3 className="mt-5 mb-5 d-md-flex justify-content-md-center">APPLY FOR PROGRAM</h3>
                <Card className="mt-4 mb-4 p-4" bg="light">
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-lg-5 personal-details">
                            <Row>
                                <h4 className="mb-4">1. Personal details</h4>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3 md-3" as={Col} md>
                                    <Form.Label>First name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="First name"
                                        isInvalid={Object.keys(errors).includes("firstName")}
                                        {...register("firstName", {required: true, pattern: /^[a-z]+$/gi})}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.firstName?.type === 'required' && "First name is required"}
                                        {errors.firstName?.type === 'pattern' && "First name should be alphabets"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3 md-3" as={Col} md>
                                    <Form.Label>Middle name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Middle name"
                                        isInvalid={Object.keys(errors).includes("middleName")}
                                        {...register("middleName", {pattern: /^[a-z]+$/gi})}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.middleName?.type === 'pattern' && "Middle name should be alphabets"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3 md-3" as={Col} md>
                                    <Form.Label>Last name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Last name"
                                        isInvalid={Object.keys(errors).includes("lastName")}
                                        {...register("lastName", {required: true, pattern: /^[a-z]+$/gi})}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.lastName?.type === 'required' && "Last name is required"}
                                        {errors.middleName?.type === 'pattern' && "Last name should be alphabets"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Address line 1</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Address line 1"
                                        isInvalid={Object.keys(errors).includes("address1")}
                                        {...register("address1", {required: true})}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.address1?.type === 'required' && "Address line 1 is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Address line 2</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Address line 2"
                                        {...register("address2")}
                                    />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="City"
                                        isInvalid={Object.keys(errors).includes("city")}
                                        {...register("city", {required: true})}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.city?.type === 'required' && "City is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Country</Form.Label>
                                    <Form.Select
                                        defaultValue="Choose an option"
                                        isInvalid={Object.keys(errors).includes("country")}
                                        onChangeCapture={setCountry}
                                        {...register("country", {required: true})}
                                    >
                                        <option value="">Choose an option</option>
                                        {countries.map(country =>
                                            (<option key={country.name} value={country.name}>{country.name}</option>))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.country?.type === 'required' && "Country is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Province</Form.Label>
                                    <Form.Select
                                        defaultValue="Choose an option"
                                        isInvalid={Object.keys(errors).includes("province")}
                                        {...register("province", {required: true})}
                                    >
                                        <option value="">Choose an option</option>
                                        {provinces.map(province =>
                                            (<option key={province} value={province}>{province}</option>))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.province?.type === 'required' && "Province is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Zip code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Zip code"
                                        isInvalid={Object.keys(errors).includes("zipCode")}
                                        {...register("zipCode", {required: true})}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.zipCode?.type === 'required' && "First name is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Phone number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Phone number"
                                        isInvalid={Object.keys(errors).includes("phoneNumber")}
                                        {...register("phoneNumber", {required: true, pattern: /^[0-9]+$/gi})}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phoneNumber?.type === 'required' && "Phone number is required"}
                                        {errors.phoneNumber?.type === 'pattern' && "Phone number should be numbers"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                        </div>
                        <hr className="m-5"/>
                        <div className="p-lg-5 academic-details">
                            <Row><h4 className="mb-4">2. Academic details</h4></Row>
                            <Row>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Institution name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Institution name"
                                        isInvalid={Object.keys(errors).includes("institution")}
                                        {...register("institution", {required: true})}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.institution?.type === 'required' && "Institution is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Degree</Form.Label>
                                    <Form.Select
                                        defaultValue="Choose an option"
                                        isInvalid={Object.keys(errors).includes("degree")}
                                        {...register("degree", {required: true})}
                                    >
                                        <option value="">Choose an option</option>
                                        <option>Masters</option>
                                        <option>Bachelors</option>
                                        <option>Diploma</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.degree?.type === 'required' && "Degree is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Course</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Course"
                                        isInvalid={Object.keys(errors).includes("course")}
                                        {...register("course", {required: true})}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.course?.type === 'required' && "Course is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Major</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Major"
                                        isInvalid={Object.keys(errors).includes("major")}
                                        {...register("major", {required: true})}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.major?.type === 'required' && "Major is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>CGPA</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="CGPA"
                                        isInvalid={Object.keys(errors).includes("cgpa")}
                                        {...register("cgpa", {required: true, pattern: /^[0-9]+(\.[0-9]+)?$/gi})}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.cgpa?.type === 'required' && "CGPA is required"}
                                        {errors.cgpa?.type === 'pattern' && "CGPA should be a numeric value"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="City"
                                        isInvalid={Object.keys(errors).includes("instituteCity")}
                                        {...register("instituteCity", {required: true})}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.instituteCity?.type === 'required' && "City is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Country</Form.Label>
                                    <Form.Select
                                        defaultValue="Choose an option"
                                        isInvalid={Object.keys(errors).includes("institutionCountry")}
                                        {...register("institutionCountry", {required: true})}
                                    >
                                        <option value="">Choose an option</option>
                                        {countries.map(country =>
                                            (<option key={country.name} value={country.name}>{country.name}</option>))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.institutionCountry?.type === 'required' && "Country is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        defaultValue="Choose an option"
                                        isInvalid={Object.keys(errors).includes("status")}
                                        {...register("status", {required: true})}
                                    >
                                        <option value="">Choose an option</option>
                                        <option value="completed">Completed</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="not_completed">Incomplete</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.status?.type === 'required' && "Status is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                        </div>
                        <hr className="m-5"/>
                        <div className="p-lg-5 sop">
                            <Row><h4 className="mb-4">3. Statement of Intent</h4></Row>
                            <Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tell us why you wish to be part of this program. (Word limit 1500
                                        words)</Form.Label>
                                    <Form.Control as="textarea"
                                                  rows={6}
                                                  isInvalid={Object.keys(errors).includes("sop")}
                                                  {...register("sop", {required: true})}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.sop?.type === 'required' && "SOP is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                        </div>
                        <hr className="m-5"/>
                        <div className="p-lg-5 language">
                            <Row><h4 className="mb-4">4. Language proficiency</h4></Row>
                            <Row>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Test taken</Form.Label>
                                    <Form.Select
                                        defaultValue="Choose an option"
                                        isInvalid={Object.keys(errors).includes("test")}
                                        {...register("test", {required: true})}
                                    >
                                        <option value="">Choose an option</option>
                                        <option value="ielts">IELTS</option>
                                        <option value="toefl">TOEFL</option>
                                        <option value="pte">PTE</option>
                                        <option value="other">OTHER</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.test?.type === 'required' && "Test is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Reading</Form.Label>
                                    <Form.Select
                                        defaultValue="Choose an option"
                                        {...register("reading")}
                                    >
                                        <option value="">Choose an option</option>
                                        {language_test_values.map(value => (
                                            <option key={value} value={value}>{value}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Listening</Form.Label>
                                    <Form.Select
                                        defaultValue="Choose an option"
                                        {...register("listening")}
                                    >
                                        <option value="">Choose an option</option>
                                        {language_test_values.map(value => (
                                            <option key={value} value={value}>{value}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Writing</Form.Label>
                                    <Form.Select
                                        defaultValue="Choose an option"
                                        {...register("writing")}
                                    >
                                        <option value="">Choose an option</option>
                                        {language_test_values.map(value => (
                                            <option key={value} value={value}>{value}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Speaking</Form.Label>
                                    <Form.Select
                                        defaultValue="Choose an option"
                                        {...register("speaking")}
                                    >
                                        <option value="">Choose an option</option>
                                        {language_test_values.map(value => (
                                            <option key={value} value={value}>{value}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md>
                                    <Form.Label>Overall</Form.Label>
                                    <Form.Select
                                        defaultValue="Choose an option"
                                        {...register("overall")}
                                    >
                                        <option value="">Choose an option</option>
                                        {language_test_values.map(value => (
                                            <option key={value} value={value}>{value}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                        </div>
                        <hr className="m-5"/>
                        <div className="p-lg-5 upload">
                            <Row><h4 className="mb-4">4. Upload documents</h4></Row>
                            <Row>
                                <Form.Group className="mb-3 justify-content-md-center" as={Row}>
                                    <Form.Label className="d-md-flex justify-content-md-end" column
                                                sm={2}>Transcript</Form.Label>
                                    <Col sm={4}>
                                        <Form.Control
                                            type="file"
                                            size="sm"
                                            isInvalid={Object.keys(errors).includes("transcriptFile")}
                                            accept=".pdf"
                                            {...register("transcriptFile", {required: true})}
                                        />
                                    </Col>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.transcriptFile?.type === 'required' && "Transcript is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3 justify-content-md-center" as={Row}>
                                    <Form.Label className="d-md-flex justify-content-md-end" column sm={2}>Language
                                        test</Form.Label>
                                    <Col sm={4}>
                                        <Form.Control
                                            type="file"
                                            size="sm"
                                            isInvalid={Object.keys(errors).includes("languageFile")}
                                            accept=".pdf"
                                            {...register("languageFile", {required: true})}
                                        />
                                    </Col>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.languageFile?.type === 'required' && "Language test file is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3 justify-content-md-center" as={Row}>
                                    <Form.Label className="d-md-flex justify-content-md-end" column
                                                sm={2}>Resume/CV</Form.Label>
                                    <Col sm={4}>
                                        <Form.Control
                                            type="file"
                                            size="sm"
                                            isInvalid={Object.keys(errors).includes("resumeFile")}
                                            accept=".pdf"
                                            {...register("resumeFile", {required: true})}
                                        />
                                    </Col>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.resumeFile?.type === 'required' && "Resume/CV is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                        </div>
                        <div className="p-lg-5 confirm">
                            <Row className="d-flex justify-content-md-center">
                                <FormGroup className="mb-3" as={Col} md>
                                    <Form.Check
                                        type="checkbox"
                                        label="I accept the terms and conditions"
                                        isInvalid={Object.keys(errors).includes("accept")}
                                        {...register("accept", {required: true})}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.accept?.type === 'required' && "Accept the terms and conditions to submit"}
                                    </Form.Control.Feedback>
                                </FormGroup>
                            </Row>
                            <Row className="justify-content-md-center">
                                <Col className="mb-3 d-md-flex justify-content-md-end">
                                    <Button type="submit" variant="dark" size="sm">
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className={{"visually-hidden": !loading}}
                                        /> Submit</Button></Col>
                                <Col className="mb-3"><Button variant="outline-dark" size="sm">Cancel</Button></Col>
                            </Row>
                        </div>
                    </Form>
                </Card>
            </Container>
        </div>
    );
}

export default ProgramApplication;