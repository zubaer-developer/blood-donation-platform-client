import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaHeart, FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CreateDonationRequest = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const watchedDistrictId = watch("district");

  // Location data fetch
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const districtRes = await fetch("/districts.json");
        const upazilaRes = await fetch("/upazilas.json");

        if (!districtRes.ok || !upazilaRes.ok) {
          throw new Error("Failed to load location files.");
        }

        const districtData = await districtRes.json();
        const upazilaData = await upazilaRes.json();

        setDistricts(districtData);
        setUpazilas(upazilaData);
      } catch (err) {
        console.error("Failed to load location data:", err);
        setFetchError("Could not load district/upazila data.");
      }
    };
    loadLocations();
  }, []);

  // Filter upazilas based on selected district
  const filteredUpazilas = upazilas.filter(
    (u) => u.district_id === watchedDistrictId
  );

  useEffect(() => {
    setValue("upazila", "");
  }, [watchedDistrictId, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const selectedDistrict = districts.find((d) => d.id === data.district);
      const districtName = selectedDistrict ? selectedDistrict.name : "N/A";
      const upazilaName = data.upazila;

      const requestData = {
        requesterEmail: user.email,
        requesterName: user.name || "Donor",
        recipientName: data.recipientName,
        recipientBloodGroup: data.bloodGroup,
        donationDate: data.donationDate,
        donationTime: data.donationTime,
        hospitalName: data.hospitalName,
        fullAddress: data.fullAddress,
        district: districtName,
        upazila: upazilaName,
        requestMessage: data.requestMessage,
        requestStatus: "pending",
      };

      const res = await axiosSecure.post("/requests", requestData);

      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Donation Request created successfully.",
          showConfirmButton: false,
          timer: 2000,
        });
        reset();
        navigate("/dashboard/my-donation-requests");
      }
    } catch (error) {
      console.error("Donation Request Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Failed to create request.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchError) {
    return (
      <div className="alert alert-error max-w-lg mx-auto mt-10">
        {fetchError} Please check your location JSON files.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg border border-primary/10">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3 mb-6">
        <FaPlusCircle className="text-primary" /> Create New Donation Request
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Recipient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Recipient Name *</span>
            </label>
            <input
              type="text"
              placeholder="Patient Name"
              className="input input-bordered w-full"
              {...register("recipientName", {
                required: "Recipient name is required.",
              })}
            />
            {errors.recipientName && (
              <span className="text-error text-xs mt-1">
                {errors.recipientName.message}
              </span>
            )}
          </div>

          {/* Blood Group */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Required Blood Group *</span>
            </label>
            <select
              className="select select-bordered w-full"
              {...register("bloodGroup", {
                required: "Blood Group is required.",
              })}
            >
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            {errors.bloodGroup && (
              <span className="text-error text-xs mt-1">
                {errors.bloodGroup.message}
              </span>
            )}
          </div>
        </div>

        {/* Location (District & Upazila) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* District */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">District *</span>
            </label>
            <select
              className="select select-bordered w-full"
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
              <span className="label-text">Upazila *</span>
            </label>
            <select
              className="select select-bordered w-full"
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
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Donation Date *</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              {...register("donationDate", {
                required: "Donation Date is required.",
              })}
            />
            {errors.donationDate && (
              <span className="text-error text-xs mt-1">
                {errors.donationDate.message}
              </span>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Donation Time (Approx) *</span>
            </label>
            <input
              type="time"
              className="input input-bordered w-full"
              {...register("donationTime", {
                required: "Donation Time is required.",
              })}
            />
            {errors.donationTime && (
              <span className="text-error text-xs mt-1">
                {errors.donationTime.message}
              </span>
            )}
          </div>
        </div>

        {/* Hospital and Address */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Hospital Name *</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Dhaka Medical College Hospital"
            className="input input-bordered w-full"
            {...register("hospitalName", {
              required: "Hospital name is required.",
            })}
          />
          {errors.hospitalName && (
            <span className="text-error text-xs mt-1">
              {errors.hospitalName.message}
            </span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Full Address (Road, Block etc.) *
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24 w-full"
            placeholder="Detailed address where the blood is needed."
            {...register("fullAddress", {
              required: "Full address is required.",
            })}
          ></textarea>
          {errors.fullAddress && (
            <span className="text-error text-xs mt-1">
              {errors.fullAddress.message}
            </span>
          )}
        </div>

        {/* Request Message */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Request Message / Reason</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24 w-full"
            placeholder="Optional: Why is this request urgent? (e.g., patient condition)"
            {...register("requestMessage")}
          ></textarea>
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
              <span className="flex items-center gap-2">
                <FaHeart /> Submit Request
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
