/**
@author [Rushit Jasoliya](rushit.jasoliya@dal.ca)
@description This file includes UI portion of Change Password of UAccess system. It also checks for Password validation as a front-end validation.
*/

import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { PasswordValidation } from "./Validation";
import Logo from "./../../assets/logo-trans.png";
import "./AuthenticationStyle.css";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import PageNotFound from "./../errors/PageNotFound";
import CONFIG from "../../config";

const ChangePassword = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userDetails, setUserDetails] = useState({
    password: "",
    cpassword: "",
  });
  const { password, cpassword } = userDetails;
  const navigate = useNavigate();
  const { state } = useLocation();

  function handleDetailsChange({ target: { name, value } }) {
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  }

  function savePassword(event) {
    event.preventDefault();
    if (!password) {
      return setError("Password should not be blank !!!");
    }
    if (!PasswordValidation(password)) {
      return setError(
        "Password should contains at least one lower case, one upper case, one number, one special Character and length should be minimum 8 chatacters !!!"
      );
    }

    if (!cpassword) {
      return setError("Confirm Password should not be blank !!!");
    }
    if (cpassword !== password) {
      return setError("Password did not match !!!");
    }
    const changePassword_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/user/changePassword`;
    const email = state?.email;
    axios
      .post(changePassword_url, { email, password })
      .then((res) => {
        if (res.data.status) {
          setError("");
          setSuccess(res.data.message);
          navigate("/login");
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
    <>
      {state !== null ? (
        <>
          <div className="divRow authentication">
            <div className="column-left">
              <img src={Logo} alt="logo"></img>
            </div>
            <div className="column-right">
              <p className="heading">Opps...</p>
              <p className="heading-2">Reset your password</p>
              <Form className="form" autoComplete="off">
                <FormGroup>
                  <Label className="input-label">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={password}
                    placeholder="Enter Your Password here..."
                    onChange={handleDetailsChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="input-label">Confirm Password</Label>
                  <Input
                    type="password"
                    name="cpassword"
                    value={cpassword}
                    placeholder="Re-enter Your Password here..."
                    onChange={handleDetailsChange}
                  />
                </FormGroup>
                <br />
                {success && <p className="success-msg">{success}</p>}
                {error && <p className="error-msg">{error}</p>}
                <p className="center">
                  <Button type="submit" onClick={savePassword}>
                    Submit
                  </Button>
                </p>
              </Form>
            </div>
          </div>
        </>
      ) : (
        <PageNotFound />
      )}
    </>
  );
};
export default ChangePassword;
