/**
@author [Rushit Jasoliya](rushit.jasoliya@dal.ca)
@description This file includes UI portion of Forgot Passward task of UAccess system. It also checks for front-end validation.
*/

import React, { useState } from "react";
import Logo from "./../../assets/logo-trans.png";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";
import "./AuthenticationStyle.css";
import { EmailValidation } from "./Validation";
import { useNavigate } from "react-router";
import axios from "axios";
import CONFIG from "../../config";

const ForgotPassword = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  function sendLink(event) {
    event.preventDefault();

    if (!email) {
      return setError("Email Address should not be blank !!!");
    }
    if (!EmailValidation(email)) {
      return setError("Email Address in not in valid format !!!");
    }
    const forgotPassword_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/user/forgotPassword`;
    axios
      .post(forgotPassword_url, { email })
      .then((res) => {
        if (res.data.status) {
          setError("");
          setSuccess("Reset link sent to email addresss !!!");
          navigate("/resetCode", {
            state: { otp: res.data.otp, email },
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message);
        }
      });
    setError("");
  }

  return (
    <div className="divRow authentication">
      <div className="column-left">
        <img src={Logo} alt="logo"></img>
      </div>
      <div className="column-right">
        <p className="heading">Opps...</p>
        <p className="heading-2">Reset your password</p>
        <Form className="form" autoComplete="off">
          <FormGroup>
            <Label className="input-label">Email Address</Label>
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address here..."
            />
          </FormGroup>
          <br />
          {success && <p className="success-msg">{success}</p>}
          {error && <p className="error-msg">{error}</p>}
          <p className="center">
            <Button type="button" onClick={sendLink}>
              Send Reset Link
            </Button>
          </p>
          <p className="right-align">
            <Link className="link" to="/login">
              <b>Back to login</b>
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};
export default ForgotPassword;
