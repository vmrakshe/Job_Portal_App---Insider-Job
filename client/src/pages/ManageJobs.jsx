import React, { useContext, useEffect, useState, useCallback } from "react";
//import { manageJobsData } from "../assets/assets";
import moment from "moment"; //format the date
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { FaTrashAlt, FaSpinner } from "react-icons/fa";

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(false);
  const { backendUrl, companyToken,fetchUserApplications } = useContext(AppContext);
  const [loadingJobId, setLoadingJobId] = useState(null); //loading checkbox button

  //Function to fetch company job application data
  const fetchCompanyJobs = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
        headers: { token: companyToken },
      });
      if (data.success) {
        setJobs(data.jobsData.reverse());
        //console.log(data.jobsData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendUrl, companyToken]);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
    }
  }, [companyToken, fetchCompanyJobs]);

  //function to change the job visibility
  const changeJobVisibility = async (id) => {
    setLoadingJobId(id); // start loading for this job
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        {
          id,
        },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCompanyJobs();
        await fetchUserApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingJobId(null); // stop loading
    }
  };

  //delete the particular job

  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "your deleting this job from this portal. Are you sure you want to delete this job? "
    );
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/jobs/delete-job/${id}`,
        {
          headers: { token: companyToken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return jobs ? (
    jobs.length === 0 ? (
      <div>
        <div className="flex items-center justify-center h-[60vh] ">
          <div className="text-center p-8 bg-white rounded-xl  max-w-md">
            <h2 className="text-xl font-semibold text-gray-800">
              No Jobs Available or Posted
            </h2>
            <p className="mt-2 text-gray-500 text-sm">
              You haven't added any job listings yet. Click the button below to
              post your first job.
            </p>
            <button
              onClick={() => navigate("/dashboard/add-job")}
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Post a Job
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div className="p-6 sm:p-8 min-h-screen ">
        <div className="max-w-6xl mx-auto">
          <div className="overflow-x-auto border border-gray-300 rounded-lg">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left  max-sm:hidden">#</th>
                  <th className="py-3 px-3 text-left w-3/12">Job Title</th>
                  <th className="py-3 px-2 text-left w-2/12 max-sm:hidden">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left w-2/14 max-sm:hidden">
                    Location
                  </th>
                  <th className="py-3 px-2 text-center w-1/14">Applicants</th>
                  <th className="py-3 px-4 text-center w-2/12">Visible</th>
                  <th className="py-3 px-4 text-center w-1/12">Delete</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-300 hover:bg-gray-50 group"
                  >
                    <td className="py-4 px-4 max-sm:hidden">{index + 1}</td>

                    <td className="py-4 px-3">{job.title}</td>

                    <td className="py-4 px-2 max-sm:hidden">
                      {moment(job.postedAt).format("ll")}
                    </td>

                    <td className="py-4 px-2 max-sm:hidden">{job.location}</td>

                    <td className="py-4 px-2 text-center">{job.applicants}</td>

                    <td className="py-4 px-4 text-center">
                      {loadingJobId === job._id ? (
                        <FaSpinner className="animate-spin text-blue-600 mx-auto" />
                      ) : (
                        <input
                          onChange={() => changeJobVisibility(job._id)}
                          type="checkbox"
                          checked={job.visible}
                          className="form-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                      )}
                    </td>

                    {/* Delete Button Column */}
                    <td className="py-4 px-2 text-center">
                      <button
                        onClick={() => deleteJob(job._id)}
                        className="text-red-600 opacity-25 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                        title="Delete Job"
                      >
                        <FaTrashAlt className="mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate("/dashboard/add-job")}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Add new job
            </button>
          </div>
        </div>
      </div>
    )
  ) : (
    <Loading />
  );
};

export default ManageJobs;
