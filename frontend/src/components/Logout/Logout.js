/**
@author [Rushit Jasoliya](rushit.jasoliya@dal.ca)
@description To logout student from the system and navidate to login page again.

*/

import { useNavigate } from "react-router";
import { useEffect } from "react";
import CONFIG from "../../config";

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem(CONFIG.ACCESS_TOKEN_KEY, "");
    window.localStorage.clear();
    navigate("/login");
  }, []);

  return <></>;
};
export default Logout;
