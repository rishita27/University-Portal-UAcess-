/*
Author:
  - Foram Gaikwad (foram.gaikwad@dal.ca)

This component behaves as a navigation bar for the University and staff members once logged in.
*/
import React from "react";
import "./NavigationBar.css";
import logo from "./../../assets/logo.png";
import profile from "./../../assets/profile-icon.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import CONFIG from "../../config";

const NavigationBar = () => {
  const navigate = useNavigate();
  function logout() {
    localStorage.setItem(CONFIG.ACCESS_TOKEN_KEY, "");
    window.localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="university-nav">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          {localStorage.getItem("user-type") === "university" ||
          localStorage.getItem("user-type") === "staff" ? (
            <>
              <Link className="navbar-brand" to="/universityDashboard">
                <img
                  src={logo}
                  alt=""
                  height="40"
                  width="auto"
                  className="d-inline-block"
                />
              </Link>

              <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link" aria-current="page" to="/review">
                      Review Application
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/assign-application">
                      Assign Application
                    </Link>
                  </li>
                  {localStorage.getItem("user-type") !== "staff" && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/staffMemberList">
                          Manage Staff Member
                        </Link>
                      </li>
                    </>
                  )}

                  <li className="nav-item">
                    <Link className="nav-link" to="/programList">
                      Manage Program
                    </Link>
                  </li>
                </ul>
                <ul className="navbar-nav ms-auto">
                  <li className="dropdown">
                    <img
                      className="nav-link dropdown-toggle"
                      id="navbarDropdownMenuLink"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      src={profile}
                      alt=""
                    />
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="navbarDropdownMenuLink"
                    >
                      {localStorage.getItem("user-type") !== "staff" && (
                        <>
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/universityProfile"
                            >
                              Profile
                            </Link>
                          </li>
                        </>
                      )}

                      <li>
                        <Link
                          className="dropdown-item"
                          onClick={logout}
                          to="/login"
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link className="navbar-brand" to="/adminDashboard">
                <img
                  src={logo}
                  alt=""
                  height="40"
                  width="auto"
                  className="d-inline-block"
                />
              </Link>
              <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      aria-current="page"
                      onClick={logout}
                      to="/login"
                    >
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
    </div>
  );
};
export default NavigationBar;
