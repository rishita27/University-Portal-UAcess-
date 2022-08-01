/*
Author:
  - Foram Gaikwad (foram.gaikwad@dal.ca)

  This file is used to display the university details, programs and staff members for a registered university.
  */
import React, { useState, useEffect } from "react";
import axios from "axios";
import NavigationBar from "../../components/navigationBar/NavigationBar";
import { useNavigate, useLocation } from "react-router";
import Heading from "../../components/heading/heading";
import CONFIG from "../../config";

const UniversityDashboard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [programsData, setProgramsData] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [universityData, setUniversityData] = useState([]);

  if (state != null) {
    localStorage.setItem("university_id", state?.id);
    localStorage.setItem("user-type", state?.type);
  }

  useEffect(() => {
    loadUniversity();
    loadPrograms();
    loadStaff();
  }, []);

  const loadUniversity = () => {
    const university_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/get-university`;

    axios
      .post(
        university_url,
        { id: localStorage.getItem("university_id") },
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
          setUniversityData(res.data.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          setUniversityData([]);
          console.log(error.response.data.message);
        }
      });
  };

  const loadPrograms = () => {
    const program_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/get-programs`;
    axios
      .post(
        program_url,
        {
          university_id: localStorage.getItem("university_id"),
        },
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
          setProgramsData(res.data.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          setProgramsData([]);
          console.log(error.response.data.message);
        }
      });
  };

  const loadStaff = () => {
    const staffMembers_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/get-university-user`;
    axios
      .post(
        staffMembers_url,
        {
          university_id: localStorage.getItem("university_id"),
        },
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
          setStaffData(res.data.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          setStaffData([]);
          console.log(error.response.data.message);
        }
      });
  };

  const sendProgramData = (program) => {
    navigate("/programDetail", { state: { program } });
  };

  const sendStaffData = (staff) => {
    navigate("/staffMemberDetail", { state: { staff } });
  };

  return (
    <>
      <NavigationBar />
      <div style={{ background: "black" }}>
        <br></br>
        <ul className="list-group">
          <li className="list-group-item bg-dark">
            <Heading name={universityData.name} color="#fff" />
          </li>
          <li className="list-group-item bg-dark">
            {" "}
            <p
              style={{ color: "#fff", marginLeft: "30px", marginRight: "30px" }}
            >
              {universityData.description}
            </p>
          </li>
        </ul>
        <br></br>
        <br></br>
      </div>

      {programsData.length !== 0 ? (
        <>
          <Heading name="Programs" color="#000" />
          <div className="table-responsive" style={{ margin: "20px" }}>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Program</th>
                  <th scope="col col-lg-2">Department</th>
                </tr>
              </thead>
              <tbody>
                {programsData.map((program, index) => {
                  return (
                    <tr key={index} onClick={() => sendProgramData(program)}>
                      <td>{index + 1}</td>
                      <td>{program.name}</td>
                      <td>{program.department}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <center>
          <Heading name="No programs found" color="#000" />
        </center>
      )}

      {localStorage.getItem("user-type") === "university" && (
        <>
          {staffData.length !== 0 ? (
            <>
              <Heading name="Staff members" color="#000" />
              <div className="table-responsive" style={{ margin: "20px" }}>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col col-lg-2">Email</th>
                      <th scope="col col-lg-2">Department</th>
                      <th scope="col col-lg-2">Qualification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffData.map((staff, index) => {
                      return (
                        <tr key={index} onClick={() => sendStaffData(staff)}>
                          <td>{index + 1}</td>
                          <td>{staff.name}</td>
                          <td>{staff.email}</td>
                          <td>{staff.department}</td>
                          <td>{staff.qualification}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <center>
              <Heading name="No staff members found or added" color="#000" />
            </center>
          )}
        </>
      )}
    </>
  );
};
export default UniversityDashboard;
