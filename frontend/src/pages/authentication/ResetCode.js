/**
@author [Rushit Jasoliya](rushit.jasoliya@dal.ca)
@description This page helps to send verification code on entered email address.

*/

import React, { useState } from "react";
import Logo from "./../../assets/logo-trans.png";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import "./AuthenticationStyle.css";
import { CodeValidation } from "./Validation";
import { useNavigate, useLocation } from "react-router";
import PageNotFound from "./../errors/PageNotFound";

const ResetCode = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  function confirmCode(event) {
    event.preventDefault();
    if (!code) {
      return setError("Code should not be blank !!!");
    }
    if (!CodeValidation(code)) {
      return setError("Code in not in valid format !!!");
    }

    if (code === state?.otp) {
      setSuccess("Verification Code is Correct !!!");
      const email = state?.email;
      navigate("/changePassword", {
        state: { email },
      });
    } else {
      return setError("Wrong Verification Code is entered !!!");
    }
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
                  <Label className="input-label">Reset Code</Label>
                  <Input
                    type="number"
                    name="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter reset code here..."
                  />
                </FormGroup>
                <br />
                {success && <p className="success-msg">{success}</p>}
                {error && <p className="error-msg">{error}</p>}
                <p className="center">
                  <Button type="button" onClick={confirmCode}>
                    Confirm
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
export default ResetCode;
