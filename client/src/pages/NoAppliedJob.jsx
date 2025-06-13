//import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const NoAppliedJob = () => {

  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
      {/* <BriefcaseIcon className="w-20 h-20 text-gray-400 mb-6" /> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-20 h-20 text-gray-400 mb-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 6h3M3 9.75C3 8.50736 4.00736 7.5 5.25 7.5h13.5C19.9926 7.5 21 8.50736 21 9.75v7.5c0 1.2426-1.0074 2.25-2.25 2.25H5.25C4.00736 19.5 3 18.4926 3 17.25v-7.5z"
        />
      </svg>

      <h2 className="text-xl font-semibold mb-2">No Applications Yet</h2>
      <p className="text-sm max-w-md">
        You haven’t applied to any jobs yet. Start exploring opportunities and
        apply to get started with your career journey.
      </p>
      <button onClick={()=>navigate("/")} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition cursor-pointer">
        Browse Jobs
      </button>
    </div>
  );
};

export default NoAppliedJob;
