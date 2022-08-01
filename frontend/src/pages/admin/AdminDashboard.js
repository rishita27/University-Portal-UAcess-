/**
@author [Rushit Jasoliya](rushit.jasoliya@dal.ca)
*/

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavigationBar from "../../components/navigationBar/NavigationBar";
import "./AdminDashboard.css";
import Heading from "../../components/heading/heading";
import axios from "axios";
import CONFIG from "../../config";

const AdminDashboard = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tabNumber, setTabNumber] = useState(1);
  const [approvedUniversity, setApprovedUniversity] = useState([]);
  const [rejectUniversity, setRejectUniversity] = useState([]);
  const [pendingUniversity, setPendingUniversity] = useState([]);

  useEffect(() => {
    loadUniversities();
  }, []);

  function loadUniversities() {
    const get_university_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/getAllUnivesities`;

    axios
      .get(get_university_url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            CONFIG.ACCESS_TOKEN_KEY
          )}`,
        },
      })
      .then((res) => {
        if (res.data.status) {
          const approvedData = [];
          const rejectedData = [];
          const pendingData = [];
          res.data.data.map((uni) => {
            if (uni.status === "pending") {
              pendingData.push(uni);
            } else if (uni.status === "approved") {
              approvedData.push(uni);
            } else if (uni.status === "rejected") {
              rejectedData.push(uni);
            }
          });
          setApprovedUniversity(approvedData);
          setRejectUniversity(rejectedData);
          setPendingUniversity(pendingData);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.message);
        }
      });
  }

  function updateUniversity(uniId, uniStatus) {
    const update_uni_status_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/updateUniversityStatus`;

    axios
      .post(
        update_uni_status_url,
        { id: uniId, status: uniStatus },
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
          setSuccess(res.data.message);
          setTimeout(() => {
            setSuccess("");
            loadUniversities();
          }, 1500);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.message);
        }
      });
    setError("");
  }
  return (
    <>
      <NavigationBar />
      <br></br>
      <div className="container fluid">
        <ul className="nav nav-tabs nav-fill">
          <li className="nav-item">
            <Link
              className={`nav-link tab-admin-link ${
                tabNumber === 1 ? "tab-admin-link-selected" : ""
              }`}
              to="/adminDashboard"
              onClick={() => setTabNumber(1)}
            >
              New
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={`nav-link tab-admin-link ${
                tabNumber === 2 ? "tab-admin-link-selected" : ""
              }`}
              to="/adminDashboard"
              onClick={() => setTabNumber(2)}
            >
              Approved
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={`nav-link tab-admin-link ${
                tabNumber === 3 ? "tab-admin-link-selected" : ""
              }`}
              to="/adminDashboard"
              onClick={() => setTabNumber(3)}
            >
              Rejected
            </Link>
          </li>
        </ul>
        {success && <p className="success-msg">{success}</p>}
        {error && <p className="error-msg">{error}</p>}
        {tabNumber === 1 && (
          <div>
            {pendingUniversity.length !== 0 ? (
              <>
                <div style={{ margin: "20px" }}>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">University Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Address</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingUniversity.map((university, index) => {
                        return (
                          <tr key={index}>
                            <td>{university.name}</td>
                            <td>{university.email}</td>
                            <td>{university.address}</td>
                            <td>{university.phone}</td>
                            <td>
                              <img
                                className="approve"
                                src="https://img.icons8.com/external-bearicons-glyph-bearicons/30/000000/external-approve-approved-and-rejected-bearicons-glyph-bearicons.png"
                                onClick={() =>
                                  updateUniversity(university.id, "approved")
                                }
                                alt=""
                              />

                              <img
                                className="reject"
                                src="https://img.icons8.com/flat-round/30/000000/delete-sign.png"
                                alt=""
                                onClick={() =>
                                  updateUniversity(university.id, "rejected")
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <br></br>
                <center>
                  <Heading name="No New University found" color="#000" />
                </center>
              </>
            )}
          </div>
        )}
        {tabNumber === 2 && (
          <div>
            {approvedUniversity.length !== 0 ? (
              <>
                <div style={{ margin: "20px" }}>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">University Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Address</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedUniversity.map((university, index) => {
                        return (
                          <tr key={index}>
                            <td>{university.name}</td>
                            <td>{university.email}</td>
                            <td>{university.address}</td>
                            <td>{university.phone}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <br></br>
                <center>
                  <Heading name="No Approved University found" color="#000" />
                </center>
              </>
            )}
          </div>
        )}
        {tabNumber === 3 && (
          <div>
            {rejectUniversity.length !== 0 ? (
              <>
                <div style={{ margin: "20px" }}>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">University Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Address</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rejectUniversity.map((university, index) => {
                        return (
                          <tr key={index}>
                            <td>{university.name}</td>
                            <td>{university.email}</td>
                            <td>{university.address}</td>
                            <td>{university.phone}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <br></br>
                <center>
                  <Heading name="No Rejected University found" color="#000" />
                </center>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default AdminDashboard;
