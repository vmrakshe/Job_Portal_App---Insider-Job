import { useContext, useEffect, useState } from "react";
import { FaClipboardList, FaPlus, FaUserCheck } from "react-icons/fa";
//import { MdLogout, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { NavLink, Outlet } from "react-router-dom";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const {
    companyData,
    setCompanyData,
    setCompanyToken,
    backendUrl,
    companyToken,
  } = useContext(AppContext);

  //function to logout
  const handleLogout = () => {
    setCompanyToken(null);
    localStorage.removeItem("companyToken");
    setCompanyData(null);
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/"), 3000);
  };

  useEffect(() => {
    if (companyData) {
      navigate("/dashboard/manage-jobs");
    }
  }, [companyData]);

  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your company account?  All your data will be lost!"
    );

    if (!confirm) return;

    try {
      setDeleting(true);
      const response = await axios.delete(`${backendUrl}/api/company/delete`, {
        headers: { token: companyToken },
      });

      if (response.data.success) {
        toast.success("Company account deleted successfully");
        setCompanyToken(null);
        setCompanyData(null);
        localStorage.removeItem("companyToken");
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        toast.error(
          response.data.message || "Failed to delete company account"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error deleting company account"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen h-screen flex flex-col">
        {/* navbar for recruiter panel */}
        <div className="sticky top-0 left-0 w-full z-50 bg-white shadow py-4">
          <div className="flex justify-between items-center px-9">
            <img
              onClick={() => navigate("/")}
              className="max-sm:w-32 cursor-pointer"
              src={assets.logo}
              alt=""
            />
            {companyData && (
              <div className="flex items-center gap-3 relative mr-6">
                <p className="hidden sm:block text-[18px] text-gray-700 font-medium">
                  Welcome, {companyData.name}
                </p>

                <div className="relative group">
                  <img
                    src={companyData.image}
                    alt="Profile"
                    className="w-9 h-9 object-cover rounded-full border border-gray-300 cursor-pointer transition-transform duration-200 group-hover:scale-105"
                  />

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-10 z-20 w-40 hidden group-hover:block min-w-[140px] bg-white border border-gray-200 rounded-lg shadow-md transition-all duration-200">
                    <ul className="text-gray-700">
                      <li
                        onClick={() => navigate("/")}
                        className="px-4 py-2 hover:bg-gray-100 hover:text-gray-800 cursor-pointer rounded-t-md"
                      >
                        Home
                      </li>
                      <li
                        onClick={handleLogout}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700 hover:text-red-600"
                      >
                        Logout
                      </li>
                      <li
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 cursor-pointer text-red-600 hover:bg-red-100 rounded-b-md"
                      >
                        {deleting ? "Deleting..." : "Delete Account"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/*left Sidebar */}

          <div className="sticky top-[68px] h-[calc(100vh-68px)] overflow-y-auto border-r-2 border-gray-200 font-sans font-medium bg-white">
            <ul className="flex flex-col items-start mt-4 space-y-2 px-4 text-gray-800">
              <NavLink
                to={"/dashboard/add-job"}
                className={({ isActive }) =>
                  `flex items-center p-3 sm:px-6 gap-1 w-full hover:bg-blue-100 rounded-lg border border-transparent hover:border-blue-400 mb-1.5 ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-semibold shadow"
                      : ""
                  }`
                }
              >
                <FaPlus className="mr-2" />
                <p className="max-sm:hidden">Add Job</p>
              </NavLink>
              <NavLink
                to={"/dashboard/manage-jobs"}
                className={({ isActive }) =>
                  `flex items-center p-3 sm:px-6 gap-1 w-full hover:bg-blue-100 rounded-lg mb-1.5 border border-transparent hover:border-blue-400 ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-semibold shadow"
                      : ""
                  }`
                }
              >
                <FaClipboardList className="mr-2" />
                <p className="max-sm:hidden">Manage Jobs</p>
              </NavLink>
              <NavLink
                to={"/dashboard/view-applications"}
                className={({ isActive }) =>
                  `flex items-center p-3 sm:px-6 gap-1 w-full hover:bg-blue-100 border border-transparent hover:border-blue-400 rounded-lg ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-semibold shadow"
                      : ""
                  }`
                }
              >
                <FaUserCheck className="mr-2" />
                <p className="max-sm:hidden">View Applications</p>
              </NavLink>
            </ul>
          </div>
          {/* Main Content Area - Now scrollable independently */}
          <div className="flex-1 overflow-y-auto p-1 sm:p-5">
            <Outlet />
            {/* This Outlet will render the nested routes like AddJob, ManageJobs, and ViewApplications */}
          </div>
        </div>
      </div>
      <footer className="bg-gray-100  ">
        <Footer />
      </footer>
    </>
  );
};

export default Dashboard;
