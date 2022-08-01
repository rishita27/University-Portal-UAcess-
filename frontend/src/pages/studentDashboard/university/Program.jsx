/*
Author:
  - Aasif Faizal (aasif@dal.ca)

Component that renders the university program card.
*/

import {Accordion, Button, Card, Col, Row} from "react-bootstrap";
import ShowMoreButton from "./ShowMoreButton";
import {useNavigate} from "react-router-dom";

const Program = (props) => {
  const navigate = useNavigate();
  const onClick = (id) => {
    navigate(`/student-dashboard/apply/${id}`)
  }
  return (
    <Card>
      <Card.Body>
        <Row className="align-items-center">
          <Col className="bld">{props.program.name}</Col>
          <Col lg="auto btn-grp">
            <ShowMoreButton eventKey={String(props.index)}/>
            {' '}
            <Button onClick={() => onClick(props.program.id)} variant="dark">Apply</Button>
          </Col>
        </Row>

        <Accordion.Collapse className="program-body mt-3" eventKey={String(props.index)}>
          <div>
            <Row  xs={1} sm={2} lg={3}>
              <Col className="mt-1">
                <span className="bld">ID: </span>{props.program.id}
              </Col>
              <Col className="mt-1">
                <span className="bld">Course Level: </span>{props.program.course_level}
              </Col>
              <Col className="mt-1">
                <span className="bld">Term Length: </span>{props.program.term_length}
              </Col>
              <Col className="mt-1">
                <span className="bld">Department: </span>{props.program.department}
              </Col>
              <Col className="mt-1">
                <span className="bld">Fees: </span>{props.program.fees} CAD
              </Col>
              <Col className="mt-1">
                <span className="bld">Scholarship: </span>{props.program.scholarship}
              </Col>
            </Row>
            <Row className="mt-1">
              <div className="bld">Description</div>
              <div>{props.program.description}</div>
            </Row>
            <Row className="mt-1">
              <div className="bld">Requirements</div>
              <div>{props.program.requirements}</div>
            </Row>
          </div>
        </Accordion.Collapse>
      </Card.Body>
    </Card>

  )
}
export default Program;