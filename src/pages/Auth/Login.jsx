import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { signInUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await signInUser(data.email, data.password);

      if (response.token) {
        // সফল লগইন হলে পূর্ববর্তী স্থানে বা ড্যাশবোর্ডে রিডাইরেক্ট
        navigate(location.state?.from || "/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      // সার্ভার থেকে আসা ত্রুটি মেসেজ
      setError(
        err.response?.data?.message ||
          "Login failed. Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center py-10 px-4">
      <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl border border-primary/20">
        <h3 className="text-4xl font-extrabold text-center text-primary pt-6">
          Welcome Back
        </h3>
        <p className="text-center text-gray-500 text-sm">
          Sign in to your donor account
        </p>

        <form className="card-body" onSubmit={handleSubmit(handleLogin)}>
          {/* Error Message */}
          {error && (
            <div role="alert" className="alert alert-error text-white text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="input input-bordered"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-error text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be 6 characters or longer",
                },
              })}
              className="input input-bordered"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-error text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <a className="link link-hover text-sm text-primary">
              Forgot password?
            </a>
          </div>

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary text-white text-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Login"
              )}
            </button>
          </div>

          <p className="text-center mt-4 text-sm">
            New here?{" "}
            <Link
              state={location.state}
              className="text-primary font-bold hover:underline"
              to="/register"
            >
              Register Now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
