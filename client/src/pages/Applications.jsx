import React, { useContext, useEffect, useState } from "react";
import { FaUpload, FaTrash } from "react-icons/fa"; // Make sure to install react-icons
import Navbar from "../components/Navbar";
//import { jobsApplied } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import NoAppliedJob from "./NoAppliedJob";
import Loading from "../components/Loading";

const statusColors = {
  Pending: "bg-blue-100 text-blue-600",
  Accepted: "bg-green-100 text-green-600",
  Rejected: "bg-red-100 text-red-600",
  Deleted: "bg-red-100 text-red-600",
};

export default function Application() {
  const { user, isLoaded } = useUser();
  //console.log(useUser());

  const { getToken } = useAuth();

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false); //loader for save button

  const {
    backendUrl,
    userData,
    userApplications,
    fetchUserData,
    fetchUserApplications,
  } = useContext(AppContext);

  const updateResume = async () => {
    setIsUploading(true); // Start loading
    try {
      const formData = new FormData();
      formData.append("resume", resume);

      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    setIsEdit(false);
    setResume(null);
    setIsUploading(false);
  };

  useEffect(() => {
    //isLoaded is true when user has information/data
    if (isLoaded && user) {
      //console.log(isLoaded);
      fetchUserData();
      fetchUserApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user]);

  //simulate a loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulated load delay or use actual fetch callback

    return () => clearTimeout(timer);
  }, []);

  //delete the job application
  const handleDeleteApplication = async (applicationId) => {
    try {
      const token = await getToken();
      const { data } = await axios.delete(
        `${backendUrl}/api/users/delete-application/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchUserApplications(); // Refresh the list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.message ? error.message : "Something went wrong. Try again."
      );
    }
  };

  return (
    <>
      <Navbar />
      {loading || !isLoaded ? (
        <Loading />
      ) : (
        <div className=" container min-h-[65vh] 2xl:px-20  mx-auto px-4 my-10">
          {/* Resume Section */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Resume
            </h2>
            <div className="flex mt-3 items-center gap-3">
              {isEdit || (userData && userData.resume === "") ? (
                <>
                  <label className="flex items-center" htmlFor="resumeUpload">
                    <p className="bg-blue-100 text-blue-700 px-4 py-2 rounded shadow-sm text-sm font-medium mr-2">
                      {resume ? resume.name : "Select Resume"}
                    </p>
                    <input
                      id="resumeUpload"
                      onChange={(e) => setResume(e.target.files[0])}
                      accept="application/pdf"
                      type="file"
                      hidden
                    />
                    <div className="bg-blue-500 text-white p-2.5 rounded shadow hover:bg-blue-600">
                      <FaUpload />
                    </div>

                    <button
                      onClick={updateResume}
                      disabled={isUploading}
                      className={`flex items-center justify-center gap-2 bg-green-100 px-4 py-2 rounded shadow-sm text-sm font-medium ml-2 text-green-700 hover:bg-green-200 ${
                        isUploading && "opacity-60 cursor-not-allowed"
                      }`}
                    >
                      {isUploading ? (
                        <div className="h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </label>
                </>
              ) : (
                <div className="flex gap-2">
                  <a
                    target="_blank"
                    href={userData?.resume}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded shadow-sm text-sm font-medium cursor-pointer"
                  >
                    Resume
                  </a>
                  <button
                    onClick={() => setIsEdit(true)}
                    className="bg-white border border-gray-300 px-4 py-2 rounded shadow-sm text-sm font-medium hover:bg-gray-100 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Jobs Applied Section */}
          {userApplications.length === 0 ? (
            <NoAppliedJob />
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Jobs Applied
              </h2>

              <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 w-[20%]">
                        Company
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 w-[20%]">
                        Job Title
                      </th>
                      <th className="px-2 py-3 text-left text-sm font-semibold text-gray-700 w-[20%] max-sm:hidden">
                        Location
                      </th>
                      <th className="px-2 py-3 text-left text-sm font-semibold text-gray-700 w-[20%] max-sm:hidden">
                        Date
                      </th>
                      <th className="px-2 py-3 text-left text-sm font-semibold text-gray-700 w-[15%]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userApplications.map((job, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        {/* Company */}
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              className="w-8 h-8 object-contain"
                              src={job.companyId.image}
                              alt={job.companyId.name}
                            />
                            <span className="text-gray-800 truncate">
                              {job?.companyId?.name}
                            </span>
                          </div>
                        </td>

                        {/* Job Title */}
                        <td className="px-3 py-3 text-gray-800 truncate">
                          {job.status === "Deleted" ? (
                            <span className="text-red-500">Not Available</span>
                          ) : (
                            job.jobId.title
                          )}
                        </td>

                        {/* Location */}
                        <td className="px-2 py-3 text-gray-800 truncate max-sm:hidden">
                          {job.status === "Deleted"
                            ? "-"
                            : job?.jobId?.location}
                        </td>

                        {/* Date */}
                        <td className="px-2 py-3 text-gray-800 whitespace-nowrap max-sm:hidden">
                          {moment(job?.appliedAt).format("ll")}
                        </td>

                        {/* Status - Compact with minimal right space */}
                        <td className="px-2 py-3">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                statusColors[job.status]
                              } truncate`}
                            >
                              {job.status === "Deleted" ? "N/A" : job.status}
                            </span>

                            {job.status === "Deleted" && (
                              <button
                                onClick={() => handleDeleteApplication(job._id)}
                                className="p-1 text-red-500 hover:text-red-600 ml-auto"
                                title="Delete this application"
                              >
                                <FaTrash size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <footer className="bg-gray-100  ">
        <Footer />
      </footer>
    </>
  );
}
