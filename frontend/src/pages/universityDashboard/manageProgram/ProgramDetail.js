/*
Author:
  - Foram Gaikwad (foram.gaikwad@dal.ca)

  This file takes all the details of the program.
*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import Input from "../../../components/input/input";
import Button from "../../../components/button/Button";
import CONFIG from "../../../config";

const ProgramDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [programData, setProgramData] = useState({
    name: "",
    course_level: "",
    department: "",
    requirements: "",
    description: "",
    fees: "",
    term_length: "",
    scholarship: "",
    university_id: "",
    id: "",
  });

  const {
    name,
    course_level,
    department,
    requirements,
    description,
    fees,
    term_length,
    scholarship,
    university_id,
    id,
  } = programData;

  function handleDetailsChange({ target: { name, value } }) {
    setProgramData((prev) => ({ ...prev, [name]: value }));
  }
  useEffect(() => {
    if (state?.program !== "new") {
      setProgramData(state?.program);
    }
  }, []);

  function saveProgram(event) {
    event.preventDefault();
    if (!name) {
      return setError("Program name cannot be empty.");
    }
    if (!course_level) {
      return setError("Course Level cannot be empty.");
    }
    if (
      course_level.toLowerCase() !== "graduate" &&
      course_level.toLowerCase() !== "under_graduate"
    ) {
      return setError("Course Level can either be graduate or under_graduate.");
    }
    if (!term_length) {
      return setError("Duration cannot be empty.");
    }
    if (term_length <= 0) {
      return setError("Duration cannot be 0 or less.");
    }
    if (!department) {
      return setError("Department cannot be empty.");
    }
    if (!description) {
      return setError("Description cannot be empty.");
    }
    if (description.length < 50) {
      return setError("Description cannot be less than 50 words.");
    }
    if (!fees) {
      return setError("Fees cannot be empty.");
    }
    if (fees <= 0) {
      return setError("Fees cannot be 0 or less.");
    }
    if (!scholarship) {
      return setError("Scholarship cannot be empty.");
    }
    if (!requirements) {
      return setError("Requirements cannot be empty.");
    }
    programData.course_level = course_level.toLowerCase();

    if (state?.program !== "new") {
      const program_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/update-program`;
      axios
        .post(program_url, programData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              CONFIG.ACCESS_TOKEN_KEY
            )}`,
          },
        })
        .then((res) => {
          if (res.data.status) {
            navigate("/programList");
          }
        })
        .catch((error) => {
          if (error.response) {
            setError(error.response.data.message);
          }
        });
    } else {
      programData.university_id = state?.university_id;

      const program_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/add-program`;
      axios
        .post(program_url, programData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              CONFIG.ACCESS_TOKEN_KEY
            )}`,
          },
        })
        .then((res) => {
          if (res.data.status) {
            navigate("/programList");
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
      <h2 style={{ margin: "2%" }}>Program Detail</h2>
      <form>
        <div className="container-fluid">
          <div className="row" style={{ margin: "10px" }}>
            <div className="col">
              <Input
                type="text"
                placeholder="Program Name"
                id="name"
                name="name"
                style={{ boxShadow: "2px 2px #777375", borderColor: "#777375" }}
                value={name}
                onChange={handleDetailsChange}
                required
              />
            </div>
            <div className="col">
              <Input
                type="number"
                placeholder="Duration"
                id="term_length"
                name="term_length"
                style={{ boxShadow: "2px 2px #777375", borderColor: "#777375" }}
                value={term_length}
                onChange={handleDetailsChange}
              />
            </div>
          </div>
          <div className="row" style={{ margin: "10px" }}>
            <div className="col">
              <Input
                type="text"
                placeholder="Course level"
                id="course_level"
                name="course_level"
                style={{ boxShadow: "2px 2px #777375", borderColor: "#777375" }}
                value={course_level}
                onChange={handleDetailsChange}
              />
            </div>
            <div className="col">
              <Input
                type="text"
                placeholder="Department"
                id="department"
                name="department"
                style={{ boxShadow: "2px 2px #777375", borderColor: "#777375" }}
                value={department}
                onChange={handleDetailsChange}
              />
            </div>
          </div>
          <div className="row" style={{ margin: "10px" }}>
            <div className="col">
              <div className="comment-area">
                <textarea
                  className="form-control"
                  placeholder="Description [minimum words: 50]"
                  id="description"
                  name="description"
                  rows="4"
                  style={{
                    boxShadow: "2px 2px #777375",
                    borderColor: "#777375",
                  }}
                  required
                  value={description}
                  onChange={handleDetailsChange}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="row" style={{ margin: "10px" }}>
            <div className="col">
              <Input
                type="number"
                placeholder="Fees"
                id="fees"
                name="fees"
                style={{ boxShadow: "2px 2px #777375", borderColor: "#777375" }}
                value={fees}
                onChange={handleDetailsChange}
              />
            </div>
            <div className="col">
              <div className="row">
                <div className="col-md-2">
                  <p>Scholarship</p>
                </div>
                <div className="col-md-4">
                  <div className="row">
                    <div className="col">
                      <div className="form-check" role="group">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="scholarship"
                          id="yes"
                          value="yes"
                          checked={scholarship === "yes"}
                          onChange={handleDetailsChange}
                        />
                        <label className="form-check-label" for="yes">
                          Yes
                        </label>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="scholarship"
                          id="no"
                          value="no"
                          checked={scholarship === "no"}
                          onChange={handleDetailsChange}
                        />
                        <label className="form-check-label" for="no">
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row" style={{ margin: "10px" }}>
            <div className="col">
              <div className="comment-area">
                <textarea
                  className="form-control"
                  placeholder="Entry Requirement"
                  id="requirements"
                  name="requirements"
                  rows="4"
                  style={{
                    boxShadow: "2px 2px #777375",
                    borderColor: "#777375",
                  }}
                  required
                  onChange={handleDetailsChange}
                  value={requirements}
                ></textarea>
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
                onClick={saveProgram}
              />
            </div>

            {/* <div className="col-md-3 pl-button">
              <Button
                label="Delete"
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
                type="button"
                onClick={handleClick}
              />
            </div> */}
          </div>
        </div>
      </form>
      <br></br>
    </>
  );
};
export default ProgramDetail;
