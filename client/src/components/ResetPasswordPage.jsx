import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { backendUrl, setShowRecruiterLogin } = useContext(AppContext);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/company/reset-password/${token}`,
        { password }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setMessage(res.data.message);
        setIsRedirecting(true);

        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate("/");
          setShowRecruiterLogin(true);
        }, 5000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
      setMessage(err.response?.data?.message || "Error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isRedirecting) {
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">
            ✅ Password Reset Successful!
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <ClipLoader color="#36d7b7" size={20} />
            <p>Redirecting to home page...</p>
          </div>
          <p className="text-sm text-gray-600">
            You'll be automatically redirected. If not,
            <button
              onClick={() => {
                navigate("/");
                setShowRecruiterLogin(true);
              }}
              className="text-blue-600 ml-1 hover:underline"
            >
              click here
            </button>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        onSubmit={handleReset}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Reset Your Password
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              required
              minLength={8}
              placeholder="Enter new password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              minLength={8}
              placeholder="Confirm new password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-medium mt-6 hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <ClipLoader color="#ffffff" size={20} />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>

        {message && (
          <p
            className={`text-sm mt-4 text-center ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ResetPasswordPage;
