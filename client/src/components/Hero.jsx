import { assets } from "../assets/assets";
import { useContext, useRef } from "react";
import { AppContext } from "../context/AppContext";

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const handleSearch = () => {
    const title = titleRef.current.value;
    const location = locationRef.current.value;
    if (!title && !location) {
      alert("Please enter a job title or location");
      return;
    }
    setSearchFilter({ title, location });
    setIsSearched(true);
    //console.log(title,location)
  };
  return (
    <div className="container 2xl:px-20 mx-auto my-8 ">
      <div className="bg-gradient-to-r from-purple-800 to-purple-950 py-16 mx-2 rounded-lg  text-white text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
          Find Your Dream Job
        </h2>
        <p className="mb-8 max-w-xl mx-auto text-sm font-light px-5">
          Your Next Big Career Move Starts Right Here - Explore thousands of job
          opportunities and take the first step Towards Your Future!!
        </p>
        <div className="flex bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto justify-between items-center">
          <div className="flex items-center">
            <img className="h-4 sm:h-5" src={assets.search_icon} alt="" />
            <input
              type="text"
              placeholder="Search for jobs"
              className="max-sm:text-xs p-2 rounded outline-none w-full"
              ref={titleRef}
            />
          </div>
          <div className="flex items-center">
            <img className="h-4 sm:h-5" src={assets.location_icon} alt="" />
            <input
              type="text"
              placeholder="Search by location"
              className="max-sm:text-xs p-2 rounded outline-none w-full"
              ref={locationRef}
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 px-6 py-2 rounded text-white m-1 cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg flex mx-2 mt-5 p-6 bg-white shadow-md ">
        <div className="flex justify-center gap-10 lg:gap-15 flex-wrap">
          <p className="font-medium">Trusted by</p>
          <img className="h-6" src={assets.microsoft_logo} alt="trusted by" />
          <img className="h-6" src={assets.walmart_logo} alt="trusted by" />
          <img className="h-6" src={assets.accenture_logo} alt="trusted by" />
          <img className="h-6" src={assets.samsung_logo} alt="trusted by" />
          <img className="h-6" src={assets.accenture_logo} alt="trusted by" />
          <img className="h-6" src={assets.adobe_logo} alt="trusted by" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
