import {Button, Table} from "react-bootstrap";
import {Download} from "react-bootstrap-icons";
import React from "react";
import CONFIG from "../../../config";
import DocumentService from "../../../api/DocumentService";


const FilesTable = (props) => {
  const accessToken = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY);
  return (
    <Table striped bordered hover responsive>
      <thead>
      <tr>
        <th width={120}>#</th>
        <th>Name</th>
        <th>Type</th>
        <th className="text-center" width="120">Actions</th>
      </tr>
      </thead>
      <tbody>
      {props.files.map((file, index) => {
        return (
        <tr key={index}>
          <td className="align-middle">{index + 1}</td>
          <td className="align-middle">{file.name}</td>
          <td className="align-middle text-capitalize">{file.type}</td>
          <td className="text-center">
            <Button onClick={() => DocumentService.downloadDocument(accessToken, file.id, file.name)} variant="outline-secondary"><Download/></Button>
          </td>
        </tr>
        )
      })}

      </tbody>
    </Table>

  )
}

export default FilesTable;