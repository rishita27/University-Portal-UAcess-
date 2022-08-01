import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import NavigationBar from "../../components/navigationBar/NavigationBar";
import Input from "../../components/input/input";
import Button from "../../components/button/Button";
import { PasswordValidation } from "./Validation";
import CONFIG from "../../config";
import FormData from "form-data";

const UniversityProfile = () => {
  const navigate = useNavigate();
  const [imageData, setImageData] = useState(null);
  const [universityData, setUniversityData] = useState({
    name: "",
    email: "",
    type: "university",
    password: "",
    address: "",
    phone: "",
    description: "",
    university_id: "",
    id: "",
    image_url: "",
  });

  const {
    name,
    email,
    type,
    password,
    phone,
    description,
    address,
    university_id,
    id,
    image_url,
  } = universityData;

  useEffect(() => {
    loadUniversity();
  }, []);

  const [error, setError] = useState("");

  const loadUniversity = () => {
    const university_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/get-university`;
    const u_uid = localStorage.getItem("university_id");
    axios
      .post(
        university_url,
        { id: u_uid },
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
          console.log(error.response.data.message);
        }
      });
  };

  function handleDetailsChange({ target: { name, value } }) {
    setUniversityData((prev) => ({ ...prev, [name]: value }));
  }

  function saveUniversity(event) {
    event.preventDefault();
    if (!name) {
      return setError("University name name cannot be empty.");
    }
    if (!phone) {
      return setError("Phone number cannot be empty.");
    }
    if (!description) {
      return setError("Description cannot be empty.");
    }
    if (!address) {
      return setError("Address cannot be empty.");
    }
    if (!password) {
      return setError("Old Password cannot be empty.");
    }
    if (!PasswordValidation(password)) {
      return setError(
        "Old Password should contains at least one lower case, one upper case, one number, one special Character and length should be minimum 8 chatacters !!!"
      );
    }
    console.log("All Passed");
    const user_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/user/updateUser`;

    axios
      .post(
        user_url,
        { username: name, email, password },
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
          console.log("User Updated");
          const university_url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/update-university`;
          let fData = new FormData();
          fData.append("filename", imageData.name);
          fData.append("name", universityData.name);
          fData.append("email", universityData.email);
          fData.append("description", universityData.description);
          fData.append("address", universityData.address);
          fData.append("phone", universityData.phone);
          fData.append("id", universityData.id);
          fData.append("content", imageData);

          axios
            .put(university_url, fData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem(
                  CONFIG.ACCESS_TOKEN_KEY
                )}`,
              },
            })
            .then((res) => {
              if (res.data.status) {
                navigate("/universityDashboard");
              }
            })
            .catch((error) => {
              if (error.response) {
                console.log(error.response.data.message);
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

  return (
    <>
      <NavigationBar />
      <h2 style={{ margin: "2%" }}>University Detail</h2>
      <form>
        <div className="container-fluid">
          <div className="row" style={{ margin: "10px" }}>
            <div className="col">
              <Input
                type="text"
                placeholder="University Name"
                id="name"
                name="name"
                style={{ boxShadow: "2px 2px #777375", borderColor: "#777375" }}
                value={name}
                onChange={handleDetailsChange}
              />
            </div>
            <div className="col">
              <Input
                type="text"
                placeholder="Address"
                id="address"
                name="address"
                style={{ boxShadow: "2px 2px #777375", borderColor: "#777375" }}
                value={address}
                onChange={handleDetailsChange}
              />
            </div>
          </div>
          <div className="row" style={{ margin: "10px" }}>
            <div className="col">
              <Input
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                style={{ boxShadow: "2px 2px #777375", borderColor: "#777375" }}
                value={email}
                disabled
              />
            </div>
            <div className="col">
              <Input
                type="phone"
                placeholder="Phone number"
                id="phone"
                name="phone"
                style={{ boxShadow: "2px 2px #777375", borderColor: "#777375" }}
                value={phone}
                onChange={handleDetailsChange}
              />
            </div>
          </div>
          <div className="row" style={{ margin: "10px" }}>
            <div className="col">
              <div className="comment-area">
                <textarea
                  className="form-control"
                  placeholder="Description"
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
                type="password"
                placeholder="Password"
                id="password"
                name="password"
                style={{ boxShadow: "2px 2px #777375", borderColor: "#777375" }}
                value={password}
                onChange={handleDetailsChange}
              />
            </div>
          </div>
          <div className="row" style={{ margin: "10px" }}>
            <div className="col">
              <div class="mb-3">
                <label for="image_url" class="form-label">
                  Upload Image
                </label>
                <input
                  class="form-control"
                  type="file"
                  accept="image/*"
                  name="image_url"
                  id="image_url"
                  onChange={(event) => {
                    setImageData(event.target.files[0]);
                  }}
                />
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
                onClick={saveUniversity}
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
export default UniversityProfile;
