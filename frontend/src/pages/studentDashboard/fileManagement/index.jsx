import StudentNavbar from "../../../components/StudentNavbar";
import {Button, Container, Row, Table} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Upload} from "react-bootstrap-icons";
import FilesTable from "./FilesTable";
import UploadModal from "./UploadModal";
import DocumentService from "../../../api/DocumentService";
import CONFIG from "../../../config";

const FileManagement = () => {
  const [files, setFiles] = useState([]);
  const [show, setShow] = useState(false)
  const accessToken = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY)
  const onClose = () => {
    setShow(false)
  }
  const reloadFiles = () => {
    DocumentService.fetchDocuments(accessToken).then(res => {
      setFiles(res.data.documents)
    }).catch(err => console.log(err))
  }
  useEffect(() => {
    reloadFiles()
  }, [])
  return (
    <div>
      <StudentNavbar/>
      <Container>
        <h3 className="mt-5 d-md-flex justify-content-md-center text-uppercase">File Management</h3>
        <div className="d-flex justify-content-end my-3">
          <Button onClick={() => setShow(true)} variant="dark" className="d-flex align-items-center">
            <span className="me-1">Upload</span>
            <Upload/>
          </Button>
        </div>
        <Row>
          <FilesTable files={files}/>
        </Row>
        <UploadModal show={show} onClose={onClose} reloadFiles={reloadFiles}/>
      </Container>
    </div>
  )
}

export default FileManagement;