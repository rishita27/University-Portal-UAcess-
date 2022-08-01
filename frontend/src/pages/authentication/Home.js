/**
@author [Rushit Jasoliya](rushit.jasoliya@dal.ca)
@description Home page of UAccess.
*/

import React from "react";
import { Button } from "reactstrap";
import Logo from "./../../assets/logo-trans.png";
import "./AuthenticationStyle.css";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  function navigateLogin() {
    navigate("/login");
  }
  function navigateRegister() {
    navigate("/registration");
  }

  return (
    <div className="divRow authentication">
      <div className="column-left">
        <img src={Logo} alt="logo"></img>
      </div>
      <div className="column-right">
        <br />
        <p className="heading-2">A LITTLE MORE ABOUT US</p>
        <p className="heading-3">AN EASY ACCESS TO YOUR FUTURE</p>
        <p className="heading-4">
          We are here to assist you in finding the perfect university for you. 
          In addition, once the university joins us, we provide a variety of 
          new and exciting features. If this is your first visit, please REGISTER 
          and explore all of the available options. Otherwise, LOGIN extends a 
          warm welcome to you.
        </p>
        <p className="home-button">
          <Button type="submit" onClick={navigateLogin}>
            Login
          </Button>
        </p>
        <p className="home-button">
          <Button type="submit" onClick={navigateRegister}>
            Register
          </Button>
        </p>
      </div>
    </div>
  );
};
export default Home;
