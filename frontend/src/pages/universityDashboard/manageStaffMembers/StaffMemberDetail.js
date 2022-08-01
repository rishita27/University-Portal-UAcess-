/*
Author:
  - Foram Gaikwad (foram.gaikwad@dal.ca)

  This file takes all the details of the staff member.
*/
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import Input from "../../../components/input/input";
import Button from "../../../components/button/Button";
import axios from "axios";
import { EmailValidation } from "../../authentication/Validation";
import CONFIG from "../../../config";

const StaffMemberDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [staffData, setStaffData] = useState({
    name: "",
    email: "",
    type: "staff",
    password: "",
    date_of_birth: "",
    department: "",
    qualification: "",
    gender: "",
    image_url: "",
    university_id: "",
    id: "",
  });

  const {
    name,
    email,
    type,
    password,
    date_of_birth,
    department,
    qualification,
    gender,
    image_url,
    university_id,
    id,
  } = staffData;
  const [error, setError] = useState("");

  function handleDetailsChange({ target: { name, value } }) {
    setStaffData((prev) => ({ ...prev, [name]: value }));
  }
  useEffect(() => {
    if (state?.staff !== "new") {
      setStaffData(state?.staff);
    }
  }, []);

  // converting IOString date to yyyy-dd-mm
  function convertDate(db) {
    const dt = new Date(staffData.date_of_birth.replaceAll("-", "/"));
    console.log('dt: ', dt)
    let day = dt.getDate() + 1;
    let month = dt.getMonth() + 1;
    let year = dt.getFullYear();
  
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return year + "-" + month + "-" + day;
  }

  function saveStaffMember(event) {
    event.preventDefault();
    if (!name) {
      return setError("Staff Member name cannot be empty.");
    }
    if (!email) {
      return setError("Email cannot be empty.");
    }
    if (!EmailValidation(email)) {
      return setError("Email Address in not in valid format !!!");
    }
    if (!type) {
      return setError("Type cannot be empty.");
    }
    if (!date_of_birth) {
      return setError("Date of Birth cannot be empty.");
    }
    if (!department) {
      return setError("Department cannot be empty.");
    }
    if (!qualification) {
      return setError("Qualification cannot be empty.");
    }
    if (!gender) {
      return setError("Gender cannot be empty.");
    }

    if (state?.staff !== "new") {
      const user_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/user/updateUser`;
      axios
        .post(
          user_url,
          { username: name, email, password: staffData.password },
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
            const uni_user_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/update-university-user`;
            axios
              .put(uni_user_url, staffData, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    CONFIG.ACCESS_TOKEN_KEY
                  )}`,
                },
              })
              .then((res) => {
                if (res.data.status) {
                  navigate("/staffMemberList");
                }
              })
              .catch((error) => {
                if (error.response) {
                  setError(error.response.data.message);
                }
              });
          }
        })
        .catch((error) => {
          if (error.response) {
            setError(error.response.data.message);
          }
        });
    } else {
      staffData.university_id = state?.university_id;
      const chars =
        "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var password = "";
      for (var i = 0; i <= 10; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
      }
      staffData.password = password;
      
      const user_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/user/registerUser`;
      axios
        .post(user_url, { name, email, password, type })
        .then((res) => {
          if (res.data.status) {
            staffData.id = res.data.data.id;
            const uni_user_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/add-university_user`;
            axios
              .post(uni_user_url, staffData, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    CONFIG.ACCESS_TOKEN_KEY
                  )}`,
                },
              })
              .then((res) => {
                if (res.data.status) {
                  navigate("/staffMemberList");
                }
              })
              .catch((error) => {
                if (error.response) {
                  setError(error.response.data.message);
                }
              });
          }
        })
        .catch((error) => {
          if (error.response) {
            setError(error.response.data.message);
          }
        });
    }
  }

  return (
    <>
      <NavigationBar />
      <h2 style={{ margin: "2%" }}>Member Detail</h2>
      <form>
        <div className="container-fluid">
          <div className="row" style={{ margin: "10px" }}>
            <div className="col">
              <Input
                type="text"
                placeholder="Name"
                id="name"
                name="name"
                value={name}
                onChange={handleDetailsChange}
                style={{ boxShadow: "2px 2px #777375", borderColor: "#777375" }}
              />
            </div>
            <div className="col">
              <Input
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                value={email}
                onChange={handleDetailsChange}
                disabled={state?.staff !== "new"}
                style={{ boxShadow: "2px 2px #777375", borderColor: "#777375" }}
              />
            </div>
          </div>
          <div className="row" style={{ margin: "10px" }}>
            <div className="col">
              <Input
                type="date"
                placeholder="Date of birth"
                id="date_of_birth"
                name="date_of_birth"
                value={convertDate(date_of_birth)}
                onChange={handleDetailsChange}
                style={{ boxShadow: "2px 2px #777375", borderColor: "#777375" }}
              />
            </div>
            <div className="col">
              <Input
                type="text"
                placeholder="Department"
                id="department"
                name="department"
                value={department}
                onChange={handleDetailsChange}
                style={{ boxShadow: "2px 2px #777375", borderColor: "#777375" }}
              />
            </div>
          </div>
          <div className="row" style={{ margin: "10px" }}>
            <div className="col">
              <Input
                type="text"
                placeholder="Qualification"
                id="qualification"
                name="qualification"
                value={qualification}
                onChange={handleDetailsChange}
                style={{ boxShadow: "2px 2px #777375", borderColor: "#777375" }}
              />
            </div>
            <div className="col">
              <div className="row">
                <div className="col-md-2">
                  <p>Gender</p>
                </div>
                <div className="col-md-4">
                  <div className="row">
                    <div className="col">
                      <div className="form-check" role="group">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="male"
                          value="male"
                          checked={gender === "male"}
                          onChange={handleDetailsChange}
                        />
                        <label className="form-check-label" for="male">
                          Male
                        </label>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="transgender"
                          value="transgender"
                          checked={gender === "transgender"}
                          onChange={handleDetailsChange}
                        />
                        <label className="form-check-label" for="transgender">
                          Transgender
                        </label>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="female"
                          value="female"
                          checked={gender === "female"}
                          onChange={handleDetailsChange}
                        />
                        <label className="form-check-label" for="female">
                          Female
                        </label>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="unreveal"
                          value="unreveal"
                          checked={gender === "unreveal"}
                          onChange={handleDetailsChange}
                        />
                        <label className="form-check-label" for="unreveal">
                          Unreveal
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {error && (
          <p className="error-msg" style={{ margin: "30px" }}>
            {error}
          </p>
        )}
        <div className="container-fluid">
          <div
            className="row"
            style={{ margin: "10px", justifyContent: "center" }}
          >
            <div className="col-md-3 pl-button">
              <Button
                label="Save"
                style={{
                  color: "#fff",
                  padding: "10px",
                  fontWeight: "bold",
                  background: "#000",
                  borderWidth: "5px",
                  borderColor: "#fff",
                  fontSize: "17px",
                  width: "100%",
                }}
                type="submit"
                onClick={saveStaffMember}
              />
            </div>
          </div>
        </div>
      </form>

      <br></br>
    </>
  );
};
export default StaffMemberDetail;
