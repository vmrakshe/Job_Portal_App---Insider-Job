import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
//import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // New state for success
  const { backendUrl, setShowForgotPassword } = useContext(AppContext);
  const navigate = useNavigate(); // Add useNavigate hook

  // scrolling is not allowed when login pop up is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/company/forgot-password`,
        { email }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setIsSuccess(true); // Set success state to true
        setTimeout(() => {
          setShowForgotPassword(false); // Close modal
        }, 10000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/30 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">✅ Reset Link Sent!</h2>
          <p className="mb-4">
            We've sent a password reset link to your email. You can safely close
            this tab.
          </p>
          <button
            onClick={() => {
              setShowForgotPassword(false);
              navigate("/");
            }}
            className="w-full py-2 bg-blue-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          🤔 Forgot Password?
        </h2>
        <input
          type="email"
          required
          placeholder="Enter your email"
          className="w-full p-3 border border-gray-300 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-medium transition-colors duration-200 ${
            isLoading
              ? "bg-blue-400 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </span>
          ) : (
            "Send Reset Link"
          )}
        </button>
        {/* cross mark to close the form */}
        <button
          type="button"
          onClick={() => setShowForgotPassword(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
