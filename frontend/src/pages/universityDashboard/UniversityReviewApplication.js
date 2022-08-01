import {useLocation, useNavigate} from "react-router-dom";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {getApplicationById, updateApplicationReviewStatus} from "../../api/ApplicationService";
import React, {useEffect, useState} from "react";
import NavigationBar from "../../components/navigationBar/NavigationBar";
import DocumentService from "../../api/DocumentService";
import CONFIG from "../../config";


function UniversityReviewApplication() {
    const navigate = useNavigate()
    const {state} = useLocation();
    const [application, setApplication] = useState({});
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const accessToken = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY)
    console.log(state);

    function reviewApplication(status) {
        updateApplicationReviewStatus(state.applicationId, status)
            .then(res => {
                setSuccess(true)
                navigate("/review")
            }).catch(err => {
            setFailure(true);
        });
    }

    useEffect(() => {
        getApplicationById(state.applicationId)
            .then(res => {
                console.log(res.data);
                setApplication(res.data);

            })
    }, []);

    return (<div>
        <NavigationBar/>
        <h3 className="mt-5 mb-5 d-md-flex justify-content-md-center">REVIEW STUDENT APPLICATION</h3>
        <Container>
            <Row>
                <Col><Card className="mt-4 mb-4" bg="light">
                    <Card.Header className="fw-bold text-center"><h5>Personal Details</h5></Card.Header>
                    <Card.Text>
                        <Row className="px-5 pt-2 pb-1"><Col className="fw-bold">First
                            name:</Col><Col>{application.first_name}</Col></Row>
                        <Row className="px-5 pt-2 pb-1"><Col className="fw-bold">Middle
                            name:</Col><Col>{application.middle_name}</Col></Row>
                        <Row className="px-5 pt-2 pb-1"><Col className="fw-bold">Last
                            name:</Col><Col>{application.last_name}</Col></Row>
                        <Row className="px-5 pt-2 pb-1"><Col className="fw-bold">Address line
                            1:</Col><Col>{application.address_line_1}</Col></Row>
                        <Row className="px-5 pt-2 pb-1"><Col className="fw-bold">Address line
                            2:</Col><Col>{application.address_line_2}</Col></Row>
                        <Row className="px-5 pt-2 pb-1"><Col
                            className="fw-bold">City:</Col><Col>{application.city}</Col></Row>
                        <Row className="px-5 pt-2 pb-1"><Col
                            className="fw-bold">Country:</Col><Col>{application.country}</Col></Row>
                        <Row className="px-5 pt-2 pb-1"><Col
                            className="fw-bold">Province:</Col><Col>{application.province}</Col></Row>
                    </Card.Text>
                </Card></Col>
                <Col><Card className="mt-4 mb-4" bg="light">
                    <Card.Header className="fw-bold text-center"><h5>Academic Details</h5></Card.Header>
                    <Card.Text>
                        <Row className="px-5 pt-2 pb-1"><Col className="fw-bold">Institution
                            name:</Col><Col>{application.applicant_institutions && application.applicant_institutions[0].name}</Col></Row>
                        <Row className="px-5 pt-2 pb-1"><Col className="fw-bold">
                            Degree:</Col><Col>{application.applicant_institutions && application.applicant_institutions[0].degree}</Col></Row>
                        <Row className="px-5 pt-2 pb-1"><Col className="fw-bold">
                            Course:</Col><Col>{application.applicant_institutions && application.applicant_institutions[0].course}</Col></Row>
                        <Row className="px-5 pt-2 pb-1"><Col className="fw-bold">
                            Major:</Col><Col>{application.applicant_institutions && application.applicant_institutions[0].major}</Col></Row>
                        <Row className="px-5 pt-2 pb-1"><Col className="fw-bold">
                            CGPA:</Col><Col>{application.applicant_institutions && application.applicant_institutions[0].cgpa}</Col></Row>
                        <Row className="px-5 pt-2 pb-1"><Col
                            className="fw-bold">City:</Col><Col>{application.applicant_institutions && application.applicant_institutions[0].city}</Col></Row>
                        <Row className="px-5 pt-2 pb-1"><Col
                            className="fw-bold">Country:</Col><Col>{application.applicant_institutions && application.applicant_institutions[0].country}</Col></Row>
                        <Row className="px-5 pt-2 pb-1"><Col
                            className="fw-bold">Status:</Col><Col>{application.applicant_institutions && application.applicant_institutions[0].completion_status}</Col></Row>
                    </Card.Text>
                </Card></Col></Row>
            <Row><Col><Card className="mt-4 mb-4" bg="light">
                <Card.Header className="fw-bold text-center"><h5>Statement of purpose</h5></Card.Header>
                <Card.Text><Row className="px-5 pt-2 pb-1">{application.sop}</Row></Card.Text>
            </Card></Col></Row>

            <Row><Col><Card className="mt-4 mb-4 pb-1" bg="light">
                <Card.Header>Language Test details</Card.Header>
                <Card.Text>
                    <Row className="px-5 pt-2 pb-1"><Col className="fw-bold">Test taken
                        :</Col><Col>{application.language_test && application.language_test.type}</Col></Row>
                    <Row className="px-5 pt-2 pb-1"><Col className="fw-bold">
                        Reading:</Col><Col>{application.language_test && application.language_test.reading}</Col></Row>
                    <Row className="px-5 pt-2 pb-1"><Col className="fw-bold">
                        Writing:</Col><Col>{application.language_test && application.language_test.writing}</Col></Row>
                    <Row className="px-5 pt-2 pb-1"><Col className="fw-bold">
                        Listening:</Col><Col>{application.language_test && application.language_test.listening}</Col></Row>
                    <Row className="px-5 pt-2 pb-1"><Col className="fw-bold">
                        Speaking:</Col><Col>{application.language_test && application.language_test.speaking}</Col></Row>
                    <Row className="px-5 pt-2 pb-1"><Col
                        className="fw-bold">Overall:</Col><Col>{application.language_test && application.language_test.overall}</Col></Row>
                </Card.Text>
            </Card></Col>
                <Col><Card className="mt-4 mb-4 pb-3" bg="light">
                    <Card.Header>Documents submitted</Card.Header>
                    <Card.Text>
                        <br/>
                        <Row className="px-5 pt-2 pb-1">
                            <Col className="fw-bold">
                                Resume:
                            </Col>
                            <Col>
                                <Button
                                    variant="outline-dark"
                                    onClick={() => DocumentService.downloadReviewDocument(accessToken, application.id, application.resume_doc_id, 'Resume.pdf')}
                                >
                                    Download
                                </Button>
                            </Col>
                        </Row>
                        <br/>
                        <Row className="px-5 pt-2 pb-1">
                            <Col className="fw-bold">
                                Transcript:
                            </Col>
                            <Col>
                                <Button
                                    variant="outline-dark"
                                    onClick={() => DocumentService.downloadReviewDocument(accessToken, application.id, application.transcript_doc_id, 'Transcript.pdf')}
                                >
                                    Download
                                </Button>
                            </Col>
                        </Row>
                        <br/>
                        <Row className="px-5 pt-2 pb-1">
                            <Col className="fw-bold">
                                Language Test:
                            </Col>
                            <Col>
                                <Button
                                    variant="outline-dark"
                                    onClick={() => DocumentService.downloadReviewDocument(accessToken, application.id, application.language_test_doc_id, 'Language Test.pdf')}
                                >
                                    Download
                                </Button>
                            </Col>
                        </Row>
                        <br/>
                    </Card.Text>

                </Card></Col></Row>
            <Row className="justify-content-md-center">
                <Col className="mb-3 d-md-flex justify-content-md-end"><Button type="submit"
                                                                               variant="dark"
                                                                               size="sm" onClick={() => reviewApplication("approved")}>Approve</Button></Col>
                <Col className="mb-3"><Button variant="outline-dark" size="sm" onClick={() => reviewApplication("rejected")}>Reject</Button></Col>
            </Row>
        </Container>
    </div>);
}

export default UniversityReviewApplication;