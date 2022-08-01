/**
@author [Rushit Jasoliya](rushit.jasoliya@dal.ca)
@description To display student's data and allow to update the same.
*/

import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import {
  NameValidation,
  EmailValidation,
  PasswordValidation,
} from "./Validation";
import StudentNavbar from "../../components/StudentNavbar";
import axios from "axios";
import { useNavigate } from "react-router";
import CONFIG from "../../config";

const StudentProfile = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { username, email, password } = userDetails;
  function handleDetailsChange({ target: { name, value } }) {
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  }
  useEffect(() => {
    getUserDetails();
  }, []);

  function getUserDetails() {
    const login_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/user/getUser`;
    axios
      .post(
        login_url,
        { email: localStorage.getItem("email-address") },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              CONFIG.ACCESS_TOKEN_KEY
            )}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          setError("");
          setUserDetails({
            username: res.data.data.name,
            email: res.data.data.email,
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message);
        }
      });
  }

  function updateUser(event) {
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
      return setError("Old Password should not be blank !!!");
    }
    if (!PasswordValidation(password)) {
      return setError(
        "Old Password should contains at least one lower case, one upper case, one number, one special Character and length should be minimum 8 chatacters !!!"
      );
    }

    const update_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/user/updateUser`;
    axios
      .post(
        update_url,
        { username, email, password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              CONFIG.ACCESS_TOKEN_KEY
            )}`,
          },
        }
      )
      .then((res) => {
        if (res.data.status) {
          setError("");
          setSuccess(res.data.message);
          setTimeout(() => {
            setSuccess("");
            navigate("/student-dashboard/university-search");
          }, 1500);
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
    <div className="authentication">
      <StudentNavbar />
      <div className="container-fluid">
        <div className="profile-row">
          <div className="profile-left-row">
            <div className="profile-left-col">
              <img
                className="profile-image"
                src="https://img.icons8.com/wired/250/000000/circled-user.png"
                alt=""
              />
            </div>
          </div>
          <div className="profile-right-row">
            <div className="profile-right-col">
              <p className="heading">Personal Details</p>
              <Form className="form" autoComplete="off">
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
                    onChange={handleDetailsChange}
                    disabled
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="input-label">Old Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={password}
                    placeholder="Enter Your old Password here..."
                    onChange={handleDetailsChange}
                  />
                </FormGroup>

                {success && <p className="success-msg">{success}</p>}
                {error && <p className="error-msg">{error}</p>}
                <div
                  className="profile-row"
                  style={{ justifyContent: "space-evenly" }}
                >
                  <p className="center col">
                    <Button type="submit" onClick={updateUser}>
                      Save
                    </Button>
                  </p>
                  <p className="center col"></p>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentProfile;
