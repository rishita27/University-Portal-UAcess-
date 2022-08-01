/**
 * Renders the list of applications applied by a student given the user id.
 * Clicking on the view icon will display the Application Details Page.
 * Clicking on the delete icon will withdraw the application.
 *
 * @author [Amrita Krishna](amrita@dal.ca)
 */
import {Button, Container, Modal, Table} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {getApplicationsForStudent, withdrawApplication} from "../../../api/ApplicationService";
import StudentNavbar from "../../../components/StudentNavbar";
import DeleteIcon from "../../../components/icons/DeleteIcon";
import ViewIcon from "../../../components/icons/ViewIcon";
import {useNavigate} from "react-router-dom";



function ListApplications() {
    const navigate = useNavigate();
    const [withdraw, setWithdraw] = useState(false);
    const [failure, setFailure] = useState(false);
    const [applications, setApplications] = useState([]);
    const [applicationId, setApplicationId] = useState("");

    /**
     * Fetches the list of applications created by student on page load.
     */
    useEffect(() => {
        getApplicationsForStudent()
            .then(res => {
                setApplications(res.data);
            })
    }, [applicationId]);

    /**
     * Sets the withdraw flags to display the modal of confirmation
     */
    const initiateWithdrawApplication = (event) => {
        setWithdraw(true);
        setApplicationId(event);
    }

    /**
     * Redirects to the view application page
     */
    const view = (event) => {
        navigate(`/student-dashboard/view-application/${event}`);
    }

    /**
     * Invoked when user clicks confirm on the withdraw confirmation modal.
     * Closes the modal by setting withdraw flag.
     */
    const confirmWithdrawApplication = () => {
        withdrawApplication(applicationId).then(res => {
            setApplicationId("");
            setWithdraw(false);
        }).catch(res => {
            setFailure(true);
        });
    }

    return (
        <div>
            <StudentNavbar/>
            <Container className="list-applications">
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
                        <Button variant="dark" onClick={confirmWithdrawApplication}>Confirm</Button>
                    </Modal.Footer>
                </Modal>

                <h3 className="mt-5 mb-5 d-md-flex justify-content-md-center">APPLICATIONS</h3>
                <Table striped bordered hover size="sm" className="mt-5 mb-5 text-center">
                    <thead>
                    <tr>
                        <th>Application id</th>
                        <th>University</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applications.map((application) => (
                        <tr key={application.id}>
                            <td>{application.id}</td>
                            <td>{application.university}</td>
                            <td>{application.status}</td>
                            <td>
                                <Button className={{"visually-hidden": application.status==="withdrawn"}} variant="outline-secondary" onClick={() => initiateWithdrawApplication(application.id)}>
                                    <DeleteIcon/>
                                </Button>
                                <Button className="m-2" variant="outline-secondary" onClick={() => view(application.id)}>
                                    <ViewIcon/>
                                </Button>
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Container>
        </div>)
}

export default ListApplications;