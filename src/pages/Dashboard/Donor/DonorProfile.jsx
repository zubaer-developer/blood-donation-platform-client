import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaTint,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const DonorProfile = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading || !user) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const profileData = {
    name: user.name || "Donor Name",
    email: user.email,
    role: user.role,
    status: user.status,
    avatar: user.avatar || "https://i.ibb.co/23Kdk9qQ/20549.jpg",
    bloodGroup: user.bloodGroup || "O+",
    district: user.district || "Dhaka",
    upazila: user.upazila || "Savar",
    lastDonationDate: "2024-06-15",
    donationCount: 5,
    isAvailable: true,
  };

  const {
    name,
    email,
    role,
    status,
    avatar,
    bloodGroup,
    district,
    upazila,
    lastDonationDate,
    donationCount,
    isAvailable,
  } = profileData;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg border border-primary/10">
      <div className="flex justify-between items-start border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaUser className="text-primary" /> My Profile
        </h1>
        <Link
          to="/dashboard/edit-profile"
          className="btn btn-sm btn-outline btn-primary flex items-center gap-1"
        >
          <FaEdit /> Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Picture and Status */}
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="avatar">
            <div className="w-36 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={avatar} alt={`${name}'s Avatar`} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-4">{name}</h2>
          <p className="text-sm text-gray-500 capitalize">{role}</p>

          <div
            className={`badge mt-3 text-white ${
              status === "active" ? "badge-success" : "badge-warning"
            }`}
          >
            Status: {status}
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-4">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-2 text-primary">
              Contact & Location
            </h3>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-sm text-gray-600" />{" "}
              <strong>Email:</strong> {email}
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-sm text-gray-600" />{" "}
              <strong>Location:</strong> {upazila}, {district}
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-2 text-primary">
              Donation Information
            </h3>
            <p className="flex items-center gap-2">
              <FaTint className="text-sm text-red-500" />{" "}
              <strong>Blood Group:</strong>{" "}
              <span className="font-bold text-red-600">{bloodGroup}</span>
            </p>
            <p>
              <strong>Total Donations:</strong> {donationCount} times
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-2 text-primary">
              Availability
            </h3>
            <p className="flex items-center gap-2">
              {isAvailable ? (
                <span className="text-success flex items-center gap-1 font-semibold">
                  <FaCheckCircle /> Available for Donation
                </span>
              ) : (
                <span className="text-error flex items-center gap-1 font-semibold">
                  <FaTimesCircle /> Currently Unavailable
                </span>
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Last Donated on: {lastDonationDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;
