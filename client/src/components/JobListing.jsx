import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";
import Loading from "./Loading";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const JobListing = () => {
  const { searchFilter, isSearched, setSearchFilter, jobs } =
    useContext(AppContext);
  const [showFilter, setshowFilter] = useState(false); //hide the filter by default
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]); //to get filter results from categories
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filteredJobs, setFilterdJobs] = useState(jobs);

  //loading state
  const [isLoading, setIsLoading] = useState(true);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      return prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category];
    });
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) => {
      return prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location];
    });
  };

  useEffect(() => {
    // Filter jobs based on selected categories and locations && search filters

    const matchesCategory = (job) =>
      selectedCategories.length === 0 ||
      selectedCategories.includes(job.category);
    const matchesLocation = (job) =>
      selectedLocations.length === 0 ||
      selectedLocations.includes(job.location);

    const matchesSearchTitle = (job) =>
      searchFilter.title === "" ||
      job.title.toLowerCase().includes(searchFilter.title.toLowerCase());

    const matchesSearchLocation = (job) =>
      searchFilter.location === "" ||
      job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

    const newFilterdJobs = jobs
      .slice()
      .reverse()
      .filter(
        (job) =>
          matchesCategory(job) &&
          matchesLocation(job) &&
          matchesSearchTitle(job) &&
          matchesSearchLocation(job)
      );

    setFilterdJobs(newFilterdJobs);
    setCurrentPage(1); // Reset to the first page when filters change
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [jobs, selectedCategories, selectedLocations, searchFilter]);
  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8 ">
      {/* sidebar */}
      <div className=" w-full lg:w-1/4 bg-white rounded-lg shadow-md px-4 ">
        {/* search filter from here components */}
        {isSearched &&
          (searchFilter.title !== "" || searchFilter.location !== "") && (
            <>
              <h3 className="font-medium text-lg mb-4">Current Search</h3>
              <div className="mb-4 text-gray-600  ">
                {searchFilter.title && (
                  <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 text-blue-600 text-sm font-medium px-2.5 py-0.5 rounded-full mx-1 ">
                    {searchFilter.title}
                    <img
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, title: "" }))
                      }
                      className="cursor-pointer"
                      src={assets.cross_icon}
                      alt=""
                    />
                  </span>
                )}
                {searchFilter.location && (
                  <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 text-blue-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {searchFilter.location}
                    <img
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, location: "" }))
                      }
                      className="cursor-pointer"
                      src={assets.cross_icon}
                      alt=""
                    />
                  </span>
                )}
              </div>
            </>
          )}

        <button
          onClick={() => setshowFilter((prev) => !prev)}
          className="px-6 py-1.5 rounded border border-gray-400 lg:hidden mb-4 bg-blue-600 text-white"
        >
          {showFilter ? "Hide" : "Show"} filter
        </button>

        {/* category filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4">Search by Categories</h4>
          <ul className="space-y-4 text-gray-600 ">
            {JobCategories?.map((category, index) => (
              <li key={index} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="scale-110 accent-blue-600 cursor-pointer"
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                />
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/*location filter  */}
        <div className={showFilter ? "" : "max-lg:hidden "}>
          <h4 className="font-medium text-lg py-4 pt-12">Search by Location</h4>
          <ul className="space-y-4 text-gray-600 mb-5  ">
            {JobLocations?.map((location, index) => (
              <li key={index} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="scale-110 accent-blue-600 cursor-pointer"
                  onChange={() => handleLocationChange(location)}
                  checked={selectedLocations.includes(location)}
                />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Jog listing */}
      {isLoading ? (
        <div className="flex justify-center items-center min-w-[1000px] pb-10">
          <Loading />
        </div>
      ) : (
        <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4 bg-white rounded-lg shadow-md px-4 ml-1 py-4">
          <h3 className="font-medium text-3xl py-2 " id="job-list">
            Latest Jobs
          </h3>
          <p className="mb-8">Get your desired job from top companies</p>
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 mt-6 px-4 bg-white rounded-lg ">
              <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-400" />

              <h2 className="mt-6 text-2xl font-semibold text-gray-800">
                No jobs found
              </h2>

              <p className="mt-2 text-base text-gray-600">
                Try adjusting your keywords or location to see more results.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xg:grid-cols-3 gap-4">
              {/* Job card */}
              {filteredJobs
                .slice((currentPage - 1) * 6, currentPage * 6)
                .map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
            </div>
          )}

          {/* pagination */}
          {filteredJobs.length > 6 && (
            <div className="flex items-center justify-center space-x-2 mt-8 mb-4">
              <a href="#job-list">
                <img
                  onClick={() => {
                    setCurrentPage(Math.max(currentPage - 1, 1));
                  }}
                  className="hover:h-4 hover:w-4 transition-all duration-1000 cursor-pointer"
                  src={assets.left_arrow_icon}
                />
              </a>
              {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map(
                (_, index) => (
                  <a href="#job-list" key={index}>
                    <button
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-6 h-6 flex items-center justify-center border border-gray-300 rounded ${
                        currentPage === index + 1
                          ? `bg-blue-100 text-blue-500`
                          : `text-gray-500`
                      }`}
                    >
                      {index + 1}
                    </button>
                  </a>
                )
              )}
              <a href="#job-list">
                <img
                  onClick={() => {
                    setCurrentPage(
                      Math.min(
                        currentPage + 1,
                        Math.ceil(filteredJobs.length / 6)
                      )
                    );
                  }}
                  className="hover:h-4 hover:w-4 transition-all duration-1000 cursor-pointer"
                  src={assets.right_arrow_icon}
                />
              </a>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default JobListing;
