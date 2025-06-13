import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import kconvert from "k-convert"; //convert number to some other format
import moment from "moment";
import { Clock, Flag } from "lucide-react";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import "react-toastify/dist/ReactToastify.css";

const ApplyJob = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // to get the job id from the url
  const [jobData, setJobData] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false); //loader for apply button

  const {
    jobs,
    backendUrl,
    userData,
    userApplications,
    fetchUserApplications,
  } = useContext(AppContext);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
        if (data.success) {
          setJobData(data.job);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchJobData();
  }, [id, backendUrl]);

  const { getToken } = useAuth();

  const onApplyHandler = async () => {
    setIsApplying(true); // Start loading
    try {
      //console.log(userData);
      if (!userData) {
        return toast.error("Login to apply for jobs");
      }
      if (!userData.resume) {
        navigate("/applications");
        return toast.info("Upload resume to apply!", {
          autoClose: 3000, // Closes after 3 seconds
        });
      }

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        {
          jobId: jobData._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchUserApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsApplying(false);
    }
  };

  //function to check whether user already applied job
  const checkAlreadyApplied = () => {
    const hasApplied = userApplications.some(
      (item) => item.jobId._id === jobData._id
    );
    setIsAlreadyApplied(hasApplied);
  };

  useEffect(() => {
    if (userApplications.length > 0 && jobData) {
      checkAlreadyApplied();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobData, userApplications, id]);

  return jobData ? (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col container px-4 2xl:px-20 mx-auto py-10">
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-18 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border border-gray-300"
                src={jobData.companyId.image}
                alt="company icon"
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-xl sm:text-4xl font-medium pb-2">
                  {jobData.title}
                </h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {jobData.companyId.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {jobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {jobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    CTC: {kconvert.convertTo(
                      jobData.salary,
                      "lakh",
                      "rupee"
                    )}{" "}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-end text-sm max-md:max-auto max-md:text-center ">
              <button
                onClick={onApplyHandler}
                className={` cursor-pointer transition-colors duration-200 p-2.5 px-10 text-white rounded ${
                  isApplying
                    ? "bg-blue-400 cursor-wait"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isAlreadyApplied
                  ? "Already Applied"
                  : isApplying
                  ? "Applying..."
                  : "Apply Now"}
              </button>
              <div className="flex items-center  text-gray-500 mt-2">
                <Clock className="w-4 h-4 mr-1" />
                <p>posted {moment(jobData.postedAt).fromNow()}</p>
              </div>
            </div>
          </div>

          {/* job description and skill and key resp. section */}
          <div className="flex flex-col lg:flex-row justify-between items-start ">
            <div className="w-full lg:w-3/4">
              <h2 className="font-semibold text-2xl text-gray-800 mb-6 border-b pb-2">
                Job Description
              </h2>

              <div
                className="text-gray-700 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              ></div>

              {!isAlreadyApplied && (
                <div className="mt-1">
                  <button
                    onClick={onApplyHandler}
                    className={` cursor-pointer transition-colors duration-200 p-2.5 px-10 text-white rounded ${
                      isApplying
                        ? "bg-blue-400 cursor-wait"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isApplying ? "Applying..." : "Apply now"}
                  </button>
                </div>
              )}
            </div>

            {/* right section more jobs */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 gap-y-1">
                More jobs from {jobData.companyId.name}
              </h2>
              {jobs
                .filter(
                  (job) =>
                    job._id !== jobData._id &&
                    job.companyId._id === jobData.companyId._id
                )
                .filter((job) => {
                  //Set of applied jobids
                  const appliedJobsIds = new Set(
                    userApplications.map((app) => app.jobId && app.jobId._id)
                  );
                  //return true if the user has not already applied for this job
                  return !appliedJobsIds.has(job._id);
                })
                .slice(0, 3)
                .map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-100  ">
        <Footer />
      </footer>
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJob;
