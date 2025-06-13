import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const {
    setShowRecruiterLogin,
    showRecruiterLogin,
    companyToken,
    companyData,
    setCompanyToken,
    setCompanyData,
    showForgotPassword,
    backendUrl,
  } = useContext(AppContext);
  //console.log(companyData?._id)

  //function to logout
  const handleLogout = () => {
    setCompanyToken(null);
    localStorage.removeItem("companyToken");
    setCompanyData(null);
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/"), 3000);
  };

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
    <div
      className={`${
        showRecruiterLogin || showForgotPassword
          ? "sticky inset-0 bg-black/5 bg-opacity-40 backdrop-blur-sm"
          : "sticky top-0 left-0 w-full z-50 bg-white"
      } shadow py-4`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 flex flex-wrap justify-between items-center">
        {/* Logo */}
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img
            src={assets.logo}
            alt="logo"
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </div>

        {/* User / Company Section */}
        {user ? (
          <div className="flex items-center gap-3 sm:gap-6 text-gray-700 font-medium mt-3 sm:mt-0 text-sm sm:text-base">
            <Link
              to="/applications"
              className="hover:text-blue-600 transition-colors duration-150"
            >
              Applied Jobs
            </Link>

            <span className="text-gray-400 hidden sm:inline">|</span>

            <p className="hidden sm:block">
              Hi, {user.firstName} {user.lastName}
            </p>

            <div className="flex-shrink-0">
              <UserButton />
            </div>
          </div>
        ) : companyToken && companyData ? (
          <div className="flex items-center gap-3 relative mt-3 sm:mt-0">
            <p className="text-sm sm:text-xl text-gray-700 max-sm:hidden">
              Welcome, <span className="font-medium">{companyData?.name}</span>
            </p>

            {/* Profile Dropdown */}
            <div className="relative group">
              {/* Profile Image */}
              <img
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300 cursor-pointer transition-transform duration-200 group-hover:scale-105"
                src={companyData?.image}
                alt="Profile"
              />

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 z-20 w-40 bg-white border border-gray-200 rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <ul className="text-gray-700 text-sm sm:text-base">
                  <li
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2 hover:bg-gray-100 hover:text-gray-800 cursor-pointer rounded-t-md"
                  >
                    Dashboard
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
        ) : (
          <div className="flex max-sm:flex-col max-sm:items-start max-sm:gap-2 gap-4 mt-3 sm:mt-0 text-sm sm:text-base">
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className="text-white bg-gray-700 rounded-full py-2 px-6 sm:px-9"
            >
              Recruiter Login
            </button>
            <button
              onClick={() => openSignIn()}
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
