/**
@author [Rushit Jasoliya](rushit.jasoliya@dal.ca)
@description This page covers Student and University registration to UAccess system including frontend validation.
*/

import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  NameValidation,
  EmailValidation,
  PasswordValidation,
} from "./Validation";
import Logo from "./../../assets/logo-trans.png";
import "./AuthenticationStyle.css";
import CONFIG from "../../config";

const Registration = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: "",
    userType: "",
    address: "",
    phone: "",
  });
  const { username, email, password, cpassword, userType, address, phone } =
    userDetails;

  function handleDetailsChange({ target: { name, value } }) {
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  }

  function registerUser(event) {
    event.preventDefault();
    if (!username) {
      return setError("Name should not be blank !!!");
    }
    if (!NameValidation(username)) {
      return setError("Name should contains only letters !!!");
    }

    if (!email) {
      return setError("Email Address should not be blank !!!");
    }
    if (!EmailValidation(email)) {
      return setError("Email Address in not in valid format !!!");
    }

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

    if (!userType) {
      return setError("Please select either Student or University !!!");
    }

    const register_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/user/registerUser`;
    axios
      .post(register_url, { name: username, email, password, type: userType })
      .then((res) => {
        if (res.data.status) {
          if (userType === "university") {
            const register_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/createUniversity`;
            axios
              .post(register_url, {
                name: username,
                description: "",
                address,
                phone,
                email,
                status: "pending",
              })
              .then((res) => {
                if (res.data.status) {
                  setSuccess("Signed Up Sucessfully !!!");
                  navigate("/login");
                }
              })
              .catch((error) => {
                if (error.response) {
                  setError(error.response.data.message);
                }
              });
          }
          setSuccess("Signed Up Sucessfully !!!");
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
    <div className="divRow authentication">
      <div className="column-left">
        <img src={Logo} alt="logo"></img>
      </div>
      <div className="column-right">
        <p className="heading">Welcome</p>
        <p className="heading-2">Register yourself</p>
        <Form className="form">
          <FormGroup>
            <Label className="input-label">Name</Label>
            <Input
              type="text"
              name="username"
              value={username}
              placeholder="Enter Name here..."
              onChange={handleDetailsChange}
            />
          </FormGroup>
          <FormGroup>
            <Label className="input-label">Email Address</Label>
            <Input
              type="email"
              name="email"
              value={email}
              placeholder="Enter Email Address here..."
              onChange={handleDetailsChange}
            />
          </FormGroup>
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
          {userType === "university" && (
            <>
              <FormGroup>
                <Label className="input-label">Phone number</Label>
                <Input
                  type="phone"
                  name="phone"
                  value={phone}
                  placeholder="Enter Your Phone number here..."
                  onChange={handleDetailsChange}
                />
              </FormGroup>
              <FormGroup>
                <Label className="input-label">Address</Label>
                <Input
                  type="text"
                  name="address"
                  value={address}
                  placeholder="Enter Your Address here..."
                  onChange={handleDetailsChange}
                />
              </FormGroup>
            </>
          )}
          <Label className="input-label">You are</Label>
          <div
            className="btn-group"
            role="group"
            aria-label="Basic radio toggle button group"
            style={{ width: "100%" }}
          >
            <input
              type="radio"
              className="btn-check"
              name="userType"
              id="student"
              value="student"
              onChange={handleDetailsChange}
            />
            <label
              className="btn btn-outline-primary d-flex radio-img"
              for="student"
            >
              <img
                src="https://img.icons8.com/external-kiranshastry-solid-kiranshastry/50/000000/external-student-online-learning-kiranshastry-solid-kiranshastry-1.png"
                alt=""
              />
              Student
            </label>

            <input
              type="radio"
              className="btn-check "
              name="userType"
              id="university"
              value="university"
              onChange={handleDetailsChange}
            />
            <label
              className="btn btn-outline-primary d-flex radio-img"
              for="university"
            >
              <img
                src="https://img.icons8.com/ios-filled/50/000000/university.png"
                alt=""
              />
              University
            </label>
          </div>
          <br />
          <br />
          {success && <p className="success-msg">{success}</p>}
          {error && <p className="error-msg">{error}</p>}
          <p className="center">
            <Button type="submit" onClick={registerUser}>
              Register now
            </Button>
          </p>
          <p className="center">
            Already have an account?{"    "}
            <Link className="link" to="/login">
              <b>Login here</b>
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};
export default Registration;
