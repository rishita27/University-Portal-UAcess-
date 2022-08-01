/*
Author:
  - Foram Gaikwad (foram.gaikwad@dal.ca)

  This file can be open from the navigation bar of university by clicking manage program. 
  It basically loads all the program.
*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/input";
import { useNavigate } from "react-router";
import Heading from "../../../components/heading/heading";
import "./ManageProgram.css";
import CONFIG from "../../../config";

const ProgramList = () => {
  const navigate = useNavigate();
  const [searchProgram, setSearchProgram] = useState("");
  const [programsData, setProgramsData] = useState([]);
  const [programsFilterData, setProgramsFilterData] = useState([]);
  const university_id = localStorage.getItem("university_id");

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = () => {
    const program_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/get-programs`;

    axios
      .post(
        program_url,
        { university_id },
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
          setProgramsFilterData(res.data.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          setProgramsData([]);
          setProgramsFilterData([]);
          console.log(error.response.data.message);
        }
      });
  };

  const searchProgramChange = (e) => {
    setSearchProgram(e.target.value.toLowerCase());
    let tempSearchData = [];
    tempSearchData = programsData.filter((program) => {
      return (
        program.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        program.department.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setProgramsFilterData(tempSearchData);
  };

  const sendProgramData = (program) => {
    navigate("/programDetail", { state: { program } });
  };

  const addNewProgram = (e) => {
    navigate("/programDetail", {
      state: {
        program: "new",
        university_id: university_id,
      },
    });
  };

  return (
    <>
      <NavigationBar />
      <div className="top-background">
        <br></br>
        <Heading name="Program" color="#fff" />
        <form>
          <div className="container-fluid">
            <div className="row" style={{ margin: "10px" }}>
              <div className="col">
                <Input
                  type="text"
                  placeholder="Search program"
                  id="searchprogram"
                  name="searchprogram"
                  style={{
                    boxShadow: "5px 5px #777375",
                    borderColor: "#777375",
                  }}
                  value={searchProgram}
                  onChange={(e) => searchProgramChange(e)}
                />
              </div>
            </div>
          </div>

          <br></br>
          <div className="container-fluid">
            <div className="row" style={{ justifyContent: "end" }}>
              <div className="col-md-3">
                <Button
                  label="Add Program"
                  style={{
                    color: "#fff",
                    padding: "10px",
                    fontWeight: "bold",
                    background: "#000",
                    borderWidth: "5px",
                    borderColor: "#fff",
                    fontSize: "17px",
                    float: "right",
                  }}
                  className="btn"
                  type="button"
                  onClick={addNewProgram}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {programsFilterData.length !== 0 ? (
        <>
          <div style={{ margin: "20px" }}>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Program</th>
                  <th scope="col col-lg-2">Department</th>
                </tr>
              </thead>
              <tbody>
                {programsFilterData.map((program, index) => {
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
    </>
  );
};
export default ProgramList;
