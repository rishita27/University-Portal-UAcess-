/*
Author:
  - Aasif Faizal (aasif@dal.ca)

The university details page rendered to students.
*/

import { useParams } from "react-router-dom"
import StudentNavbar from "../../../components/StudentNavbar";
import {Container, Card, Row, Col, Accordion, Button} from "react-bootstrap";
import { useState, useEffect} from "react";
import './index.scss'
import universityExternalService from "../../../api/UniversityExternalService";
import PageNotFound from "../../errors/PageNotFound";
import Program from "./Program";
import CONFIG from "../../../config";

const University = () => {
  let { universityID } = useParams();

  const [university, setUniversity] = useState({programs:[]})
  const [error, setError] = useState(false)
  const [contentLoaded, setContentLoaded] = useState(false)

  useEffect(() => {
    universityExternalService.fetchUniversity(universityID).then(result => {
      console.log(result.data)
      setUniversity(result.data)
      setContentLoaded(true)
    }).catch(error => {
      console.log(error)
      setError(true)
    })
  }, [universityID])
  if (error) {
    return <PageNotFound/>
  }
  if (contentLoaded) {
    return(
      <div className="university">
        <StudentNavbar/>
        <Container>
          <Row className="mt-4">
            <Col lg="auto">
              <Card className="profile-card">
                <Card.Img variant="top" src={university.image_url ? university.image_url : CONFIG.IMG_PLACEHOLDER}/>
                <Card.Header className="bld text-center">{university.name}</Card.Header>
                <Card.Body className="sec-text-size">
                  <Row className="justify-content-center">{university.address}</Row>
                  <Row className="justify-content-center">{university.phone}</Row>
                  <Row className="justify-content-center">
                    <a href="mailto:mail@dal.ca" className="text-center">{university.email}</a>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Header className="bld">About</Card.Header>
                <Card.Body>{university.description}</Card.Body>
              </Card>

              <Card className="mt-4 programs">
                <Card.Header className="bld">Programs</Card.Header>
                <Card.Body>
                  {university.programs.length ? '': <div>No programs added.</div>}
                  <Accordion >
                    {university.programs.map((program, index) => {
                      return <Program key={index} program={program} index={index}/>
                    })}
                  </Accordion>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  } else return <div>Loading...</div>
}

export default University