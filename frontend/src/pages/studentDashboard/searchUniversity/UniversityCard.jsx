/*
Author:
  - Aasif Faizal (aasif@dal.ca)

This component renders the University card required f
or University SearchUniversity component.
*/
import {Card, Button, Row, Col, Image} from "react-bootstrap";
import "./universityCard.scss"
import CONFIG from "../../../config";
import {useNavigate} from "react-router-dom";

const UniversityCard = (props) => {
  const navigate = useNavigate();
  const onClick = (universityID) => {
    navigate(`/student-dashboard/university/${universityID}`)
  }
  return  (
    <div className="university-card">
      <Card className="mt-4">
        <Card.Body>
          <Row className="title">
            <Col className="img-wrapper" xs="auto">
              <Image height={60} src={props.university.image_url ? props.university.image_url: CONFIG.IMG_PLACEHOLDER}/>
            </Col>
            <Col className="d-flex flex-column justify-content-center">
              <Row className="bld">{props.university.name}</Row>
              <Row className="ter-txt-size">{props.university.address}</Row>
            </Col>
          </Row>
          <div className="mt-2 mb-2">
            <Row>
              <Col className="attr bld">Programs:</Col>
              <Col>{props.university.programs}</Col>
            </Row>
            <Row>
              <Col className="attr bld">Average Fees:</Col>
              <Col>{props.university.avg_fees? props.university.avg_fees: 'NA'}</Col>
            </Row>
          </div>
          <Row className="justify-content-center mt-3">
            <Button onClick={() => onClick(props.university.id)} variant="outline-secondary">
              More Details
            </Button>
          </Row>
        </Card.Body>
      </Card>
    </div>
  )
}

export default UniversityCard;