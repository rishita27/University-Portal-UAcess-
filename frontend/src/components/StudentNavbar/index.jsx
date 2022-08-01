/*
Author:
  - Aasif Faizal (aasif@dal.ca)

This component renders the navbar visible for students once they are logged in.
*/

import { Navbar, Nav, NavDropdown } from "react-bootstrap";

import MainNavbar from "../MainNavbar";
const StudentNavbar = () => (
  <MainNavbar>
    <Navbar.Toggle />
    <Navbar.Collapse>
      <Nav className="me-auto">
        <Nav.Link href="/student-dashboard/university-search/">
          Dashboard
        </Nav.Link>
        <Nav.Link href="/student-dashboard/list/">Application</Nav.Link>
        <Nav.Link href="/student-dashboard/files">File Management</Nav.Link>
      </Nav>
      <Nav>
        <NavDropdown title="Profile">
          <NavDropdown.Item href="/studentProfile">Settings</NavDropdown.Item>
          <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </MainNavbar>
);

export default StudentNavbar;
