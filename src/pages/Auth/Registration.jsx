import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

// Environment Variables
const IMAGEBB_API_KEY = import.meta.env.VITE_IMAGEBB_API_KEY;

const Registration = () => {
  const { registerUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const watchedDistrictId = watch("district");

  const filteredUpazilas = upazilas.filter(
    (u) => u.district_id === watchedDistrictId
  );

  useEffect(() => {
    setValue("upazila", "");
  }, [watchedDistrictId, setValue]);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const districtRes = await fetch("/districts.json");
        const upazilaRes = await fetch("/upazilas.json");

        const districtData = await districtRes.json();
        const upazilaData = await upazilaRes.json();

        setDistricts(districtData);
        setUpazilas(upazilaData);
      } catch (err) {
        console.error("Failed to load location data:", err);
      }
    };
    loadLocations();
  }, []);

  // ImageBB API use for image upload
  const handleImageUpload = async (imageFile) => {
    const DEFAULT_AVATAR = "https://i.ibb.co/23Kdk9qQ/20549.jpg";

    if (!imageFile || imageFile.length === 0) {
      return DEFAULT_AVATAR;
    }

    const formData = new FormData();
    formData.append("image", imageFile[0]);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMAGEBB_API_KEY}`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      return response.data.success ? response.data.data.url : DEFAULT_AVATAR;
    } catch (err) {
      console.error("Image upload API error:", err);
      return DEFAULT_AVATAR;
    }
  };

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    if (data.password !== data.confirm_password) {
      setError("Password and Confirm Password do not match.");
      setLoading(false);
      return;
    }

    try {
      const avatarUrl = await handleImageUpload(data.avatar);

      const selectedDistrict = districts.find((d) => d.id === data.district);
      const districtName = selectedDistrict
        ? selectedDistrict.name
        : data.district; // fallback

      const registrationData = {
        name: data.name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
        avatar: avatarUrl,
        bloodGroup: data.bloodGroup,
        district: districtName,
        upazila: data.upazila,
      };

      const response = await registerUser(registrationData);

      if (response.token) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Registration Error:", err);
      setError(
        err.response?.data?.message ||
          "Registration failed. Please check your inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  if (districts.length === 0 && upazilas.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center py-10 px-4">
      <div className="card w-full max-w-xl shadow-2xl bg-base-100 border border-primary/20">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-4xl font-extrabold text-center text-primary mb-2">
            Become a Donor
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Join the community, save lives.
          </p>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Your Full Name"
                className="input input-bordered"
                {...register("name", { required: "Name is required." })}
              />
              {errors.name && (
                <span className="text-error text-xs mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                {...register("email", { required: "Email is required." })}
              />
              {errors.email && (
                <span className="text-error text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Blood Group */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Blood Group</span>
              </label>
              <select
                className="select select-bordered"
                {...register("bloodGroup", {
                  required: "Blood Group is required.",
                })}
              >
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  )
                )}
              </select>
              {errors.bloodGroup && (
                <span className="text-error text-xs mt-1">
                  {errors.bloodGroup.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Avatar (Image)</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered file-input-sm w-full"
                {...register("avatar")}
              />
            </div>

            {/* District */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">District</span>
              </label>
              <select
                className="select select-bordered"
                {...register("district", { required: "District is required." })}
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.district && (
                <span className="text-error text-xs mt-1">
                  {errors.district.message}
                </span>
              )}
            </div>

            {/* Upazila */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Upazila</span>
              </label>
              <select
                className="select select-bordered"
                {...register("upazila", { required: "Upazila is required." })}
                disabled={!watchedDistrictId || filteredUpazilas.length === 0}
              >
                <option value="">Select Upazila</option>
                {filteredUpazilas.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
              {errors.upazila && (
                <span className="text-error text-xs mt-1">
                  {errors.upazila.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters.",
                  },
                  pattern: {
                    value:
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
                    message:
                      "Must include uppercase, lowercase, number, and special character.",
                  },
                })}
              />
              {errors.password && (
                <span className="text-error text-xs mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="input input-bordered"
                {...register("confirm_password", {
                  required: "Confirm Password is required.",
                })}
              />
              {errors.confirm_password && (
                <span className="text-error text-xs mt-1">
                  {errors.confirm_password.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn btn-primary text-white text-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Register"
              )}
            </button>
          </div>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
