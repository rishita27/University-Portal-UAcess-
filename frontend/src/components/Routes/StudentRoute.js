import { Navigate, Outlet } from "react-router-dom";
import CONFIG from "../../config";
import AuthService from "../../api/AuthService";
import { useEffect, useState } from "react";

const StudentRoute = () => {
  const [error, setError] = useState();
  const accessToken = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY);
  if (accessToken === null) {
    setError(true);
  }
  useEffect(() => {
    AuthService.validateUser(accessToken)
      .then((result) => {
        const isAuthorizedLoggedInUser =
          result.data.status && result.data.data.type === "student";
        if (isAuthorizedLoggedInUser) {
          setError(false);
        }
      })
      .catch((error) => {
        setError(true);
      });
  }, []);

  if (error !== undefined) {
    if (error) return <Navigate to="/login" />;
    else return <Outlet />;
  } else {
    return <div>Loading...</div>;
  }
};

export default StudentRoute;
