
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiBriefcase, FiArrowRight } from "react-icons/fi";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:border-gray-400/100 transition-shadow duration-200 bg-white p-6 flex flex-col justify-between h-full">
      {/* Company Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={job?.companyId?.image}
          alt="company-logo"
          className="w-10 h-10 rounded-full border border-gray-300 object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {job.companyId?.name}
          </h2>
          <p className="text-sm text-gray-500">
            {job.companyId?.industry || "Hiring Now"}
          </p>
        </div>
      </div>

      {/* Job Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1 bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">
          <FiMapPin className="text-xs" />
          {job.location}
        </span>
        <span className="flex items-center gap-1 bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full">
          <FiBriefcase className="text-xs" />
          {job.level}
        </span>
      </div>

      {/* Description Preview */}
      <p
        className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3"
        dangerouslySetInnerHTML={{ __html: job.description.slice(0, 160) }}
      ></p>

      {/* CTA Buttons */}
      <div className="mt-auto flex gap-4">
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo(0, 0);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Apply Now <FiArrowRight />
        </button>
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo(0, 0);
          }}
          className="flex items-center gap-2 text-gray-600 border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default JobCard;
