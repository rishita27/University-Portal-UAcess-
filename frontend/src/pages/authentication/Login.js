/**
@author [Rushit Jasoliya](rushit.jasoliya@dal.ca)
@description This file covers Login task of UAccess system. Redirecting to related Dashboard of user based on type of user.

*/

import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import axios from "axios";
import { EmailValidation } from "./Validation";
import Logo from "./../../assets/logo-trans.png";
import "./AuthenticationStyle.css";
import CONFIG from "../../config";

const Login = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const { email, password } = credentials;

  function handleCredentialChange({ target: { name, value } }) {
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }
  function loginUser(event) {
    event.preventDefault();
    setSuccess("");

    if (!email) {
      return setError("Email Address should not be blank !!!");
    }
    if (!EmailValidation(email)) {
      return setError("Email Address in not in valid format !!!");
    }

    if (!password) {
      return setError("Password should not be blank !!!");
    }

    const login_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/user/loginUser`;
    axios
      .post(login_url, { email, password })
      .then((res) => {
        if (res.data.status) {
          localStorage.setItem(CONFIG.ACCESS_TOKEN_KEY, res.data.access_token);
          if (res.data.data.type === "student") {
            setSuccess("Logged In Sucessfully !!!");

            localStorage.setItem("user-type", "student");
            localStorage.setItem("email-address", res.data.data.email);
            navigate("/student-dashboard/university-search", {
              state: {
                id: res.data.data.id,
              },
            });
          } else if (res.data.data.type === "university") {
            localStorage.setItem("user-type", "university");
            const uni_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/get-university-email`;
            axios
              .post(
                uni_url,
                { email },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      CONFIG.ACCESS_TOKEN_KEY
                    )}`,
                  },
                }
              )
              .then((resp) => {
                if (resp.data.status) {
                  if (resp.data.data.status === "approved") {
                    navigate("/universityDashboard", {
                      state: {
                        id: resp.data.data.id,
                        type: "university",
                      },
                    });
                  } else {
                    localStorage.removeItem(CONFIG.ACCESS_TOKEN_KEY);
                    setError("University is not approved yet.");
                  }
                }
              })
              .catch((error) => {
                if (error.response) {
                  setError(error.response.data.message);
                }
              });
          } else if (res.data.data.type === "staff") {
            localStorage.setItem("user-type", "staff");
            const uni_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/getUniversityUserId`;
            const id = res.data.data.id;
            axios
              .post(
                uni_url,
                { id },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      CONFIG.ACCESS_TOKEN_KEY
                    )}`,
                  },
                }
              )
              .then((response) => {
                if (response.data.status) {
                  navigate("/universityDashboard", {
                    state: {
                      id: response.data.data.university_id,
                      type: "staff",
                    },
                  });
                }
              })
              .catch((error) => {
                if (error.response) {
                  setError(error.response.data.message);
                }
              });
          } else if (res.data.data.type === "admin") {
            localStorage.setItem("user-type", "admin");
            navigate("/adminDashboard");
          }
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
        <p className="heading">Welcome back...</p>
        <p className="heading-2">Login here</p>
        <Form className="form" autoComplete="off">
          <FormGroup>
            <Label className="input-label">Email Address</Label>
            <Input
              type="email"
              name="email"
              onChange={handleCredentialChange}
              placeholder="Enter Email Address here..."
            />
          </FormGroup>
          <FormGroup>
            <Label className="input-label">Password</Label>
            <Input
              type="password"
              name="password"
              onChange={handleCredentialChange}
              placeholder="Enter Your Password here..."
            />
          </FormGroup>
          <p className="right-align">
            <Link className="link" to="/forgotPassword">
              <b>Forgot Password?</b>
            </Link>
          </p>
          <br />
          {success && <p className="success-msg">{success}</p>}
          {error && <p className="error-msg">{error}</p>}
          <p className="center">
            <Button type="button" onClick={loginUser}>
              Login now
            </Button>
          </p>
          <br />
          <br />
          <p className="center">
            Don't have an account?{"    "}
            <Link className="link" to="/registration">
              <b>Join free today</b>
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};
export default Login;
