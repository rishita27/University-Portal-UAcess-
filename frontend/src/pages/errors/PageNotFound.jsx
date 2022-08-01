/*
Author:
  - Aasif Faizal (aasif@dal.ca)

This is a 404 error page.
*/

import {Container} from "react-bootstrap";
import MainNavbar from "../../components/MainNavbar";

const PageNotFound = () => (
  <div>
    <MainNavbar/>
    <Container className="mt-5">
      <h2>404</h2>
      <p>Oops..., Seems like you have entered a wrong url.</p>
    </Container>
  </div>
)

export default PageNotFound