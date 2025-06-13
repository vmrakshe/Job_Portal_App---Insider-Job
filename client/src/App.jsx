import "tailwindcss";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Applications from "./pages/Applications.jsx";
import ApplyJob from "./pages/ApplyJob.jsx";
import RecruiterLogin from "./components/RecruiterLogin.jsx";
import { useContext } from "react";
import { AppContext } from "./context/AppContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddJob from "./pages/AddJob.jsx";
import ManageJobs from "./pages/ManageJobs.jsx";
import ViewApplications from "./pages/ViewApplications.jsx";
import ForgotPasswordForm from "./components/ForgotPasswordForm.jsx";
import ResetPasswordPage from "./components/ResetPasswordPage.jsx";
import "quill/dist/quill.snow.css"; // Import Quill styles
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { showRecruiterLogin, companyToken, showForgotPassword } =
    useContext(AppContext);

  return (
    <>
      {showRecruiterLogin && <RecruiterLogin />}
      {showForgotPassword && <ForgotPasswordForm />}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-job" element={companyToken ? <AddJob /> : null} />
          <Route
            path="manage-jobs"
            element={companyToken ? <ManageJobs /> : null}
          />
          <Route
            path="view-applications"
            element={companyToken ? <ViewApplications /> : null}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
