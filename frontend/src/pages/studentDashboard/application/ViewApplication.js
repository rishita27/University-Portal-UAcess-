/**
 * Renders the details of an application.
 *
 * Provides withdraw button to withdraw the application.
 *
 * The url of this page must contain the application uuid as a path param.
 *
 * @author [Amrita Krishna](amrita@dal.ca)
 */
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Button, Card, Col, Container, Modal, Row} from "react-bootstrap";
import {getApplicationById, withdrawApplication} from "../../../api/ApplicationService";
import React, {useEffect, useState} from "react";
import StudentNavbar from "../../../components/StudentNavbar";


function ViewApplication() {
    const navigate = useNavigate()
    const {applicationId} = useParams();
    const [application, setApplication] = useState({});
    const [withdraw, setWithdraw] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    console.log(applicationId);

    /**
     * Withdraws the application and navigates to the list of applications page.
     */
    function withdrawTheApplication(status) {
        withdrawApplication(applicationId)
            .then(res => {
                setSuccess(true);
                navigate("/student-dashboard/list");
            }).catch(err => {
            setFailure(true);
        });
    }

    /**
     * Sets the withdraw flags to display the modal of confirmation
     */
    const initiateWithdrawApplication = (event) => {
        setWithdraw(true);
    }

    /**
     * Fetches the application created by student on page load.
     */
    useEffect(() => {
        getApplicationById(applicationId)
            .then(res => {
                console.log(res.data);
                setApplication(res.data);
            })
    }, []);

    /**
     * Navigates to the applications list.
     */
    function cancelView() {
        navigate("/student-dashboard/list");
    }

    return (<div>
        <StudentNavbar/>
        <Modal className="text-center" show={withdraw} onHide={() => setWithdraw(false)}>
            <Modal.Header closeButton>
                <Modal.Title>UAccess</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="fw-bold">Are you sure you want to withdraw the application?</p>
                <p>This will stop the review process and your application will no longer be considered by the
                    University.</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline-dark" onClick={() => setWithdraw(false)}>Close</Button>
                <Button variant="dark" onClick={withdrawTheApplication}>Confirm</Button>
            </Modal.Footer>
        </Modal>
        <h3 className="mt-5 p-4 d-md-flex justify-content-md-center">APPLICATION INFORMATION</h3>

        <Container><Card className="mt-4 mb-4 p-4 justify-content-md-center" bg="light">
            <div className="mx-5 mt-5">
                <Row><Col>Application id:</Col><Col>{application.id}</Col></Row>
                <hr className="mb-3 mt-1"/>
                <Row><Col>University name:</Col><Col>{application.university}</Col></Row>
                <hr className="mb-3 mt-1"/>
                <Row><Col>Program name:</Col><Col>{application.program}</Col></Row>
                <hr className="mb-3 mt-1"/>
                <Row><Col>Program requirements:</Col><Col>{application.program_requirements}</Col></Row>
                <hr className="mb-3 mt-1"/>
                <Row><Col>Application status:</Col><Col>{application.status}</Col></Row>
                <hr className="mb-3 mt-1"/>
                <Row><Col>Application managed by:</Col><Col>{application.reviewer_name}</Col></Row>
            </div>
            <Row className="justify-content-md-center mt-5">
                <Col className="mb-3 d-md-flex justify-content-md-end"><Button onClick={() => initiateWithdrawApplication()}
                                                                               variant="dark"
                                                                               size="sm"
                                                                               className={{"visually-hidden": application.status==="withdrawn"}}>Withdraw</Button></Col>
                <Col className="mb-3"><Button onClick={() => cancelView()} variant="outline-dark" size="sm">Cancel</Button></Col>
            </Row>

        </Card></Container>

        <p className="text-center fst-italic"><div className="fw-bold">Please note:</div><div>Application processing time varies with Universities and the enrollment
            numbers in various
            programs.
            <br/>
            For any queries regarding the application processing, please contact the University directly and mention the
            application id given above.</div> </p>
    </div>);
}

export default ViewApplication;