/*
Author:
  - Foram Gaikwad (foram.gaikwad@dal.ca)

  This file can be open from the navigation bar of university by clicking manage staff members. 
  It basically loads all the staff members.
*/
import React, { useState, useEffect } from "react";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import Button from "../../../components/button/Button";
import { useNavigate } from "react-router";
import Heading from "../../../components/heading/heading";
import axios from "axios";
import CONFIG from "../../../config";

const StaffMemberList = () => {
  const navigate = useNavigate();
  const [staffMemberData, setStaffMemberData] = useState([]);
  const [filterStaff, setFilterStaff] = useState([]);
  const [tabNumber, setTabNumber] = useState(1);
  const university_id = localStorage.getItem("university_id");

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const loadStaffMembers = () => {
    const staffMembers_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/get-university-user`;

    axios
      .post(
        staffMembers_url,
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
          setStaffMemberData(res.data.data);
          setFilterStaff(res.data.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          setStaffMemberData([]);
          console.log(error.response.data.message);
        }
      });
  };

  const sendStaffData = (staff) => {
    navigate("/staffMemberDetail", { state: { staff } });
  };
  const addNewStaffMember = (e) => {
    navigate("/staffMemberDetail", {
      state: {
        staff: "new",
        university_id: university_id,
      },
    });
  };
  const filterSort = (e, num) => {
    console.log("Num : ", num);
    let tempSearchData = [];

    if (num === 1) {
      tempSearchData = staffMemberData.sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
    } else if (num === 2) {
      tempSearchData = staffMemberData.sort((a, b) =>
        a.name < b.name ? 1 : -1
      );
    } else {
      tempSearchData = staffMemberData.sort((a, b) =>
        a.department > b.department ? 1 : -1
      );
    }
    setFilterStaff(tempSearchData);
    console.log("Data : ", filterStaff);
  };

  return (
    <>
      <NavigationBar />
      <div style={{ background: "black" }}>
        <br></br>
        <div className="col-md-12 text-left">
          <Heading
            name="Staff"
            color="#fff"
            style={{ float: "left" }}
            className="btn btn-md btn-primary ml-2 button-icon rounded-small"
          />
        </div>

        <div className="col-md-12 text-right">
          <Button
            label="Add Staff Member"
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
            type="button"
            onClick={addNewStaffMember}
            className="btn"
          />
          <br></br>
        </div>
        <br></br>
      </div>

      <ul className="list-group list-group-horizontal">
        <li className="list-group-item border-end">Filters:</li>
        <li className="list-group-item border-end filter-list">
          <div onClick={() => setTabNumber(1)}>A-Z</div>
        </li>
        <li className="list-group-item border-end filter-list">
          <div onClick={() => setTabNumber(2)}>Z-A</div>
        </li>
        <li className="list-group-item filter-list">
          <div onClick={() => setTabNumber(3)}>Department</div>
        </li>
      </ul>

      {filterStaff.length !== 0 ? (
        <>
          <div style={{ margin: "20px" }}>
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
                {tabNumber === 1 && (
                  <>
                    {filterStaff
                      .sort((a, b) => (a.name > b.name ? 1 : -1))
                      .map((staff, index) => {
                        return (
                          <tr
                            key={staff.id}
                            onClick={() => sendStaffData(staff)}
                          >
                            <td>{index + 1}</td>
                            <td>{staff.name}</td>
                            <td>{staff.email}</td>
                            <td>{staff.department}</td>
                            <td>{staff.qualification}</td>
                          </tr>
                        );
                      })}
                  </>
                )}
                {tabNumber === 2 && (
                  <>
                    {filterStaff
                      .sort((a, b) => (a.name < b.name ? 1 : -1))
                      .map((staff, index) => {
                        return (
                          <tr
                            key={staff.id}
                            onClick={() => sendStaffData(staff)}
                          >
                            <td>{index + 1}</td>
                            <td>{staff.name}</td>
                            <td>{staff.email}</td>
                            <td>{staff.department}</td>
                            <td>{staff.qualification}</td>
                          </tr>
                        );
                      })}
                  </>
                )}
                {tabNumber === 3 && (
                  <>
                    {filterStaff
                      .sort((a, b) => (a.department > b.department ? 1 : -1))
                      .map((staff, index) => {
                        return (
                          <tr
                            key={staff.id}
                            onClick={() => sendStaffData(staff)}
                          >
                            <td>{index + 1}</td>
                            <td>{staff.name}</td>
                            <td>{staff.email}</td>
                            <td>{staff.department}</td>
                            <td>{staff.qualification}</td>
                          </tr>
                        );
                      })}
                  </>
                )}
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
  );
};
export default StaffMemberList;
