/*
Author:
  - Aasif Faizal (aasif@dal.ca)

This component acts as a generic main navbar.
*/
import {Container, Image, Navbar} from "react-bootstrap";
import './index.scss'
const MainNavbar = ({children}) => (
  <Navbar className="main-nav" sticky="top" bg="dark" variant="dark" expand="lg">
    <Container>
      <Navbar.Brand>
        <Image className="logo" fluid src="/logo.png"/>
      </Navbar.Brand>
      {children}
    </Container>
  </Navbar>
)

export default MainNavbar;