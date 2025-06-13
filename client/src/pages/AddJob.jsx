import React, { useContext, useEffect } from "react";
import Quill from "quill";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddJob = () => {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState("");
  const [location, setLocation] = React.useState("Bangalore");
  const [category, setCategory] = React.useState("Software Development");
  const [level, setLevel] = React.useState("Beginner level");
  const [salary, setSalary] = React.useState(0);
  const { backendUrl, companyToken } = useContext(AppContext);

  const editRef = React.useRef(null);
  const quillRef = React.useRef(null);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const description = quillRef.current.root.innerHTML;
      const { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        {
          title,
          description,
          location,
          salary,
          category,
          level,
        },
        { headers: { token: companyToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setSalary(0);
        quillRef.current.root.innerHTML = "";
        setTimeout(() => {
          navigate("/dashboard/manage-jobs");
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    //initialise Quill editor only once
    if (!quillRef.current && editRef.current) {
      quillRef.current = new Quill(editRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="max-w-3xl w-full p-4 space-y-6  pb-20"
    >
      <div>
        <label className="block mb-1.5 font-medium">Job Title</label>
        <input
          type="text"
          placeholder="Type here"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-1 focus:ring-blue-400 outline-none"
        />
      </div>

      <div>
        <label className="block mb-1.5 font-medium">Job Description</label>
        <div
          ref={editRef}
          contentEditable
          className="w-full min-h-[96px] max-h-[240px] overflow-y-auto border border-gray-300 rounded-md px-4 py-2 focus:ring-1 focus:ring-blue-400 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1.5 font-medium">Job Category</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-blue-400"
            onChange={(e) => setCategory(e.target.value)}
          >
            {JobCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1.5 font-medium">Job Location</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-blue-400"
            onChange={(e) => setLocation(e.target.value)}
          >
            {JobLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1.5 font-medium">Job Level</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-blue-400"
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="Beginner level">Beginner level</option>
            <option value="Intermediate level">Intermediate level</option>
            <option value="Senior level">Senior level</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-1.5 font-medium">Salary</label>
        <input
          min={0}
          type="number"
          placeholder="0"
          className="w-55 border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-400 outline-none"
          onChange={(e) => setSalary(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-32 py-2 mt-4 bg-black text-white flex items-center justify-center rounded gap-2 hover:bg-gray-800 font-medium"
      >
        ADD
      </button>
    </form>
  );
};

export default AddJob;
