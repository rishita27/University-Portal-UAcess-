import {Button, Container, Table} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import NavigationBar from "../../components/navigationBar/NavigationBar";
import ViewIcon from "../../components/icons/ViewIcon";
import {getApplicationsForReviewer} from "../../api/ApplicationService";
import {useNavigate} from "react-router-dom";


function UniversityStaffApplicationList() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [applicationId, setApplicationId] = useState("");

    const reviewer_id = "8e22a7e7-6dbb-4c13-a2b4-8d78284dec74";

    useEffect(() => {
        getApplicationsForReviewer()
            .then(res => {
                setApplications(res.data);
            })
    }, []);

    const viewApplication = (event) => {
        navigate("/review-application", {
            state: {
                applicationId: event,
                reviewerId: reviewer_id
            }
        });
    }

    return (
        <div>
            <NavigationBar/>
            <Container className="list-applications">
                <h3 className="mt-5 mb-5 d-md-flex justify-content-md-center">APPLICATIONS FOR REVIEW</h3>
                <Table striped bordered hover size="sm" className="mt-5 mb-5 text-center">
                    <thead>
                    <tr>
                        <th>Application id</th>
                        <th>Program</th>
                        <th>Student</th>
                        <th>Status</th>
                        <th>View</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applications.map((application) => (
                        <tr key={application.id}>
                            <td>{application.id}</td>
                            <td>{application.program}</td>
                            <td>{application.student}</td>
                            <td>{application.status}</td>
                            <td>
                                <Button variant="outline-secondary" onClick={() => viewApplication(application.id)}>
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

export default UniversityStaffApplicationList;