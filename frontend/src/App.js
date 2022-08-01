/**
 * Contains the App component which is rendered first
 *
 *
 * @author [Aasif Faizal](aasif@dal.ca)
 * @author [Amrita Krishna](amrita@dal.ca)
 * @author [Foram Prashant Gaikwad](foram.gaikwad@dal.ca)
 * @author [Rishita Kotiyal](rs677988@dal.ca)
 * @author [Rushit Jasoliya](rushit.jasoliya@dal.ca)
 */
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProgramList from "./pages/universityDashboard/manageProgram/ProgramList";
import UniversityDashboard from "./pages/universityDashboard/UniversityDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProgramDetail from "./pages/universityDashboard/manageProgram/ProgramDetail";
import StaffMemberDetail from "./pages/universityDashboard/manageStaffMembers/StaffMemberDetail";
import StaffMemberList from "./pages/universityDashboard/manageStaffMembers/StaffMemberList";
import UniversityProfile from "./pages/authentication/UniversityProfile";
import Login from "./pages/authentication/Login";
import Registration from "./pages/authentication/Registration";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import StudentProfile from "./pages/authentication/StudentProfile";
import ChangePassword from "./pages/authentication/ChangePassword";
import ResetCode from "./pages/authentication/ResetCode";
import Home from "./pages/authentication/Home";
import ProgramApplication from "./pages/studentDashboard/application/ProgramApplication";
import ListApplications from "./pages/studentDashboard/application/ListApplications";
import SearchUniversity from "./pages/studentDashboard/searchUniversity";
import ViewApplication from "./pages/studentDashboard/application/ViewApplication";
import University from "./pages/studentDashboard/university";
import PageNotFound from "./pages/errors/PageNotFound";
import UniversityStaffApplicationList from "./pages/universityDashboard/UniversityStaffApplicationList";
import UniversityReviewApplication from "./pages/universityDashboard/UniversityReviewApplication";
import UniversityAssignApplication from "./pages/universityDashboard/UniversityAssignApplication";
import StudentRoute from "./components/Routes/StudentRoute";
import Logout from "./components/Logout/Logout";
import FileManagement from "./pages/studentDashboard/fileManagement";
import CONFIG from "./config";

function isUniLoggedIn() {
  const accessToken = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY);
  if (accessToken != null && accessToken !== undefined && accessToken !== "") {
    const userType = localStorage.getItem("user-type");
    if (
      userType != null &&
      userType !== undefined &&
      userType !== "" &&
      (userType === "university" || userType === "staff")
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function isAdminLoggedIn() {
  const accessToken = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY);
  if (accessToken != null && accessToken !== undefined && accessToken !== "") {
    const userType = localStorage.getItem("user-type");
    if (
      userType != null &&
      userType !== undefined &&
      userType !== "" &&
      userType === "admin"
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function isStudentLoggedIn() {
  const accessToken = localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY);
  if (accessToken != null && accessToken !== undefined && accessToken !== "") {
    const userType = localStorage.getItem("user-type");
    if (
      userType != null &&
      userType !== undefined &&
      userType !== "" &&
      userType === "student"
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

const PrivateUniversityRoute = ({ children }) => {
  const uniLogin = isUniLoggedIn();
  return uniLogin ? children : <Navigate to="/login" replace={true} />;
};
const PrivateAdminRoute = ({ children }) => {
  const adminLogin = isAdminLoggedIn();
  return adminLogin ? children : <Navigate to="/login" replace={true} />;
};
const PrivateStudentRoute = ({ children }) => {
  const studentLogin = isStudentLoggedIn();
  return studentLogin ? children : <Navigate to="/login" replace={true} />;
};
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/universityDashboard"
            element={
              <PrivateUniversityRoute>
                <UniversityDashboard />
              </PrivateUniversityRoute>
            }
          />
          <Route
            path="/adminDashboard"
            element={
              <PrivateAdminRoute>
                <AdminDashboard />
              </PrivateAdminRoute>
            }
          />
          <Route
            path="/programList"
            element={
              <PrivateUniversityRoute>
                <ProgramList />
              </PrivateUniversityRoute>
            }
          />
          <Route
            path="/programDetail"
            element={
              <PrivateUniversityRoute>
                <ProgramDetail />
              </PrivateUniversityRoute>
            }
          />
          <Route
            path="/staffMemberDetail"
            element={
              <PrivateUniversityRoute>
                <StaffMemberDetail />
              </PrivateUniversityRoute>
            }
          />
          <Route
            path="/staffMemberList"
            element={
              <PrivateUniversityRoute>
                <StaffMemberList />
              </PrivateUniversityRoute>
            }
          />
          <Route
            path="/universityProfile"
            element={
              <PrivateUniversityRoute>
                <UniversityProfile />
              </PrivateUniversityRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/registration" element={<Registration />} />
          <Route
            path="/studentProfile"
            element={
              <PrivateStudentRoute>
                <StudentProfile />
              </PrivateStudentRoute>
            }
          />
          <Route path="/resetCode" element={<ResetCode />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route
            path="/review"
            element={
              <PrivateUniversityRoute>
                <UniversityStaffApplicationList />
              </PrivateUniversityRoute>
            }
          />
          <Route
            path="/review-application"
            element={
              <PrivateUniversityRoute>
                <UniversityReviewApplication />
              </PrivateUniversityRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/assign-application"
            element={
              <PrivateUniversityRoute>
                <UniversityAssignApplication />
              </PrivateUniversityRoute>
            }
          />

          {/* The Student Route takes care of checking if the user exists.*/}
          <Route path="/student-dashboard" element={<StudentRoute />}>
            <Route path="university-search" element={<SearchUniversity />} />
            <Route path="university/:universityID" element={<University />} />
            <Route path="apply/:programID" element={<ProgramApplication />} />
            <Route path="list" element={<ListApplications />} />
            <Route
              path="view-application/:applicationId"
              element={<ViewApplication />}
            />
            <Route path="files" element={<FileManagement />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
