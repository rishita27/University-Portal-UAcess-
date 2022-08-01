import {Button, Col, Form, Modal, Row, Spinner} from "react-bootstrap";
import React, {useState} from "react";
import DocumentService from "../../../api/DocumentService";
import CONFIG from "../../../config";

const UploadModal = (props) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false)
  const accessToken = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY)
  const modalProps = props;

  const onUpload = () => {
    setSubmitted(true)
    if (file === null || fileType === null) return
    setLoading(true)
    DocumentService.upload(file, fileType, accessToken).then(res => {
      modalProps.reloadFiles()
      setLoading(false)
      modalProps.onClose()
    }).catch(err => console.log(err))
  }
  return (
    <Modal show={props.show}>
      <Modal.Header>
        <Modal.Title>Upload file</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="py-3">
          <Row className="mb-3">
            <Col>
              <Form.Control
                onChange={(e) => setFile(e.target.files[0])}
                size="md"
                type="file"
                accept=".pdf"
                isInvalid={submitted && file === null}
              />
              <Form.Control.Feedback className="ms-1" type="invalid">File required</Form.Control.Feedback>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Select
                defaultValue=""
                onChange={(e) => setFileType(e.target.value)}
                isInvalid={submitted && fileType === null}
              >
                <option value="">Choose File type</option>
                <option value="resume">Resume</option>
                <option value="transcript">Transcript</option>
                <option value="language_test">Language Test</option>
              </Form.Select>
              <Form.Control.Feedback className="ms-1" type="invalid">Select file type</Form.Control.Feedback>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onClose} variant="outline-secondary">Close</Button>
        <Button disabled={loading} onClick={onUpload} variant="dark">
          {loading ?
            <div>
              Loading...
              <Spinner
                as="span"
                className="ms-1"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            </div>
          : 'Upload'
          }
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UploadModal;