import React, {useEffect, useState} from "react";
import NavigationBar from "../../components/navigationBar/NavigationBar";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {getApplicationsForUniversity, updateApplicationReviewStatus} from "../../api/ApplicationService";
import universityExternalService from "../../api/UniversityExternalService";


function UniversityAssignApplication() {
    const [success, setSuccess] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [applications, setApplications] = useState([]);
    const [reviewers, setReviewers] = useState([]);

    useEffect(() => {
        universityExternalService.getStaffByUniversityId()
            .then(res => {
                console.log(res);
                setReviewers(res.data);
            });
        getApplicationsForUniversity()
            .then(res => {
                setApplications(res.data);
            });
    }, []);

    function submit(data) {
        updateApplicationReviewStatus(data.application, "in_review")
            .then(res => {
                setSuccess(true);
            }).catch(err => {
                setSuccess(true);
        });
    }

    return (
        <div>
            <NavigationBar/>
            <Container>
                <h3 className="mt-5 mb-5 d-md-flex justify-content-md-center">ASSIGN STUDENT APPLICATION</h3>
                <Card className="mt-4 mb-4 p-4" bg="light">
                    <Form noValidate onSubmit={handleSubmit(submit)}>
                        <Form.Group className="mb-3" as={Col} md>
                            <Form.Label>Select application</Form.Label>
                            <Form.Select
                                defaultValue="Choose an option"
                                isInvalid={Object.keys(errors).includes("application")}
                                {...register("application", {required: true})}
                            >
                                <option value="">Choose an option</option>
                                {applications.map(id =>
                                    (<option key={id} value={id}>{id}</option>))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.application?.type === 'required' && "Application id is required"}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" as={Col} md>
                            <Form.Label>Select a reviewer</Form.Label>
                            <Form.Select
                                defaultValue="Choose an option"
                                isInvalid={Object.keys(errors).includes("reviewer")}
                                {...register("reviewer", {required: true})}
                            >
                                <option value="">Choose an option</option>
                                {reviewers.map(reviewer =>
                                    (<option key={reviewer.id}
                                             value={reviewer.id}>{reviewer.id}, {reviewer.name}</option>))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.reviewer?.type === 'required' && "Reviewer is required"}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Row className="justify-content-md-center">
                            <Col className="mb-3 d-md-flex justify-content-md-end"><Button type="submit"
                                                                                           variant="dark"
                                                                                           size="sm">Submit</Button></Col>
                            <Col className="mb-3"><Button variant="outline-dark" size="sm">Cancel</Button></Col>
                        </Row>
                    </Form>
                </Card>
            </Container>
        </div>
    );
}

export default UniversityAssignApplication;