import React, { useContext, useState, useEffect } from "react";
//import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // optional icons
import { FaSpinner } from "react-icons/fa";

export default function RecruiterLogin() {
  const navigate = useNavigate();
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false); //for loading spinner during login,...
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);
  const {
    setShowRecruiterLogin,
    backendUrl,
    setCompanyToken,
    setCompanyData,
    setShowForgotPassword,
  } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (state === "Sign Up" && !isTextDataSubmitted) {
      return setIsTextDataSubmitted(true);
    }
    try {
      if (state === "Login") {
        setIsLoading(true);
        const { data } = await axios.post(`${backendUrl}/api/company/login`, {
          email,
          password,
        });

        if (data.success) {
          //console.log(data);
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          toast.success(data.message);
          setTimeout(() => navigate("/dashboard"), 3000);
        } else {
          toast.error(data.message);
        }
      } else {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("password", password);
        formData.append("email", email);
        formData.append("image", image);

        const { data } = await axios.post(
          `${backendUrl}/api/company/register`,
          formData
        );

        if (data.success) {
          //console.log(data);
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          toast.success(data.message);
          setTimeout(() => navigate("/dashboard"), 3000);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // scrolling is not allowed when login pop up is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  //visibility of password
  const [visible, setVisible] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-8"
      >
        <h2 className="text-2xl font-semibold text-center mb-1">
          Recruiter {state}
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Welcome back! Please {state} to continue
        </p>

        {state === "Sign Up" && isTextDataSubmitted ? (
          <>
            <div className="flex items-center gap-4 my-10">
              <label htmlFor="image" className="cursor-pointer">
                <img
                  className="w-16 rounded-full border border-gray-300 object-cover"
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt=""
                />
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  hidden
                />
              </label>
              <p className="text-sm text-gray-600 text-center mt-2">
                Upload your company logo
              </p>
            </div>
          </>
        ) : (
          <>
            {state !== "Login" && (
              <div className="border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-5 focus-within:ring-1 focus-within:ring-blue-400 transition">
                <img src={assets.person_icon} alt="" />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Compnany Name"
                  required
                />
              </div>
            )}

            <div className="border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-5 focus-within:ring-1 focus-within:ring-blue-400 transition">
              <img src={assets.email_icon} alt="" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email Id"
                required
              />
            </div>
            <div className="border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-5 focus-within:ring-1 focus-within:ring-blue-400 transition relative w-full">
              <img src={assets.lock_icon} alt="" />
              <input
                className="outline-none text-sm pr-9 w-full"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={visible ? "text" : "password"}
                placeholder="Password"
                required
              />
              <span
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setVisible((prev) => !prev)}
              >
                {visible ? (
                  <AiOutlineEyeInvisible size={18} />
                ) : (
                  <AiOutlineEye size={18} />
                )}
              </span>
            </div>

            {/* Forgot Password */}
            {state === "Login" && (
              <div className="text-right mb-1 mt-2">
                <span
                  onClick={() => {
                    setShowForgotPassword(true);
                    setShowRecruiterLogin(false);
                  }}
                  className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot password?
                </span>
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded-full font-medium mt-5 transition-colors duration-200 ${
            isLoading
              ? "bg-blue-400 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" />
              {state === "Login"
                ? "Logging in..."
                : isTextDataSubmitted
                ? "Creating account..."
                : "Processing..."}
            </div>
          ) : state === "Login" ? (
            "Login"
          ) : isTextDataSubmitted ? (
            "Create Account"
          ) : (
            "Next"
          )}
        </button>

        {state === "Login" ? (
          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-600 font-medium hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-600 font-medium hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => setShowRecruiterLogin(false)}
          alt="cross icon"
          src={assets.cross_icon}
          className="absolute top-5 right-4 cursor-pointer"
        />
      </form>
    </div>
  );
}
