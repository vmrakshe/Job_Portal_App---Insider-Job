import { useState, useEffect, useContext } from "react";
import { FiDownload } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
//import { viewApplicationsPageData } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState(false);
  const navigate = useNavigate();

  //function to fetch company job applications data

  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken },
      });
      if (data.success) {
        setApplicants(data.applications.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications();
    }
  }, [companyToken]);

  const [openMenuId, setOpenMenuId] = useState(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".dropdown-toggle")) {
        setOpenMenuId(null);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  //Function to update the job application status
  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        fetchCompanyJobApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return applicants ? (
    applicants.length === 0 ? (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center p-8 bg-white  max-w-md mx-4">
          <ClipboardDocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            No job postings yet
          </h2>
          <p className="mt-2 text-gray-600">
            You haven't created any job listings. Post your first job to start
            receiving applications.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/dashboard/add-job")} // Adjust to your job posting route
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Post a Job Now
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div className="p-6 sm:p-8 min-h-screen ">
        <div className="bg-white shadow border border-gray-300 rounded-lg overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-4 px-4">#</th>
                <th className="py-4 px-6 text-left">Applicant Name</th>
                <th className="py-4 px-6 hidden sm:table-cell">Job Title</th>
                <th className="py-4 px-6 hidden sm:table-cell">Location</th>
                <th className="py-4 px-7">Resume</th>
                <th className="py-4 px-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants
                ?.filter((item) => item.jobId && item.userId)
                .map((applicant, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-300 hover:bg-gray-50 relative"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-6 flex items-center gap-2">
                      <img
                        src={applicant?.userId?.image}
                        alt="avatar"
                        className="w-8 h-8 rounded-full hidden sm:block"
                      />
                      {applicant?.userId?.name}
                    </td>
                    <td className="py-3 px-6 hidden sm:table-cell">
                      {applicant.jobId?.title}
                    </td>
                    <td className="py-3 px-6 hidden sm:table-cell">
                      {applicant.jobId?.location}
                    </td>
                    <td className="py-1 px-6">
                      <a
                        href={applicant.userId?.resume}
                        target="_blank"
                        className="bg-blue-100 text-blue-700 px-4 py-1  rounded-full flex items-center gap-1 hover:bg-blue-200 w-max"
                      >
                        resume <FiDownload className="text-sm" />
                      </a>
                    </td>
                    <td className="py-3 px-6 relative">
                      {applicant.status === "Pending" ? (
                        <>
                          <button
                            className="dropdown-toggle p-2 hover:bg-gray-200 rounded-full cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(
                                openMenuId === index ? null : index
                              );
                            }}
                          >
                            <BsThreeDotsVertical />
                          </button>

                          {openMenuId === index && (
                            <div className="absolute z-20 right-0 mt-2 w-28 bg-white border border-gray-300 rounded shadow-md">
                              <button
                                onClick={() =>
                                  changeJobApplicationStatus(
                                    applicant._id,
                                    "Accepted"
                                  )
                                }
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 text-blue-600"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  changeJobApplicationStatus(
                                    applicant._id,
                                    "Rejected"
                                  )
                                }
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-500"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          className={`${
                            applicant.status === "Accepted"
                              ? "text-blue-500"
                              : "text-red-500"
                          }`}
                        >
                          {applicant.status}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  ) : (
    <Loading />
  );
};

export default ViewApplications;
