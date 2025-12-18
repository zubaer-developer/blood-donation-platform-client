import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaHistory,
  FaDonate,
  FaUsers,
  FaTasks,
} from "react-icons/fa";

const Dashboard = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const role = user?.role || "donor";

  const handleLogout = async () => {
    await signOutUser();
    navigate("/login");
  };

  const navLinks = {
    donor: [
      { name: "Profile", path: "/dashboard/profile", icon: <FaUser /> },
      {
        name: "Create Donation Request",
        path: "/dashboard/create-request",
        icon: <FaDonate />,
      },
      {
        name: "My Donation Requests",
        path: "/dashboard/my-requests",
        icon: <FaHistory />,
      },
      {
        name: "Content Management",
        path: "/dashboard/content-management",
        icon: <FaTasks />,
      },
    ],
    volunteer: [
      {
        name: "Volunteer Home",
        path: "/dashboard/volunteer-home",
        icon: <FaUser />,
      },
      {
        name: "Donation Requests (All)",
        path: "/dashboard/all-requests",
        icon: <FaHistory />,
      },
    ],
    admin: [
      { name: "Admin Home", path: "/dashboard/admin-home", icon: <FaHome /> },
      { name: "All Users", path: "/dashboard/all-users", icon: <FaUsers /> },
      {
        name: "All Blood Donation Requests",
        path: "/dashboard/all-requests",
        icon: <FaHistory />,
      },
      {
        name: "Content Management",
        path: "/dashboard/content-management",
        icon: <FaTasks />,
      },
    ],
  };

  const dashboardLinks = navLinks[role] || navLinks.donor;

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col p-4 bg-gray-50">
        {/* Page content - Header for mobile/tablet */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary capitalize">
            {role} Dashboard
          </h2>
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Open Menu
          </label>
        </div>
        {/* Main content area for Nested Routes */}
        <Outlet />
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-64 min-h-full bg-base-200 text-base-content flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-primary mb-6">BDP</h2>
            <h3 className="text-xl font-semibold mb-4 capitalize">
              Role: {role}
            </h3>
            {/* Dashboard Links */}
            {dashboardLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="flex items-center gap-2 text-lg"
                >
                  {link.icon} {link.name}
                </Link>
              </li>
            ))}
          </div>

          <div>
            <div className="divider">General</div>
            <li>
              <Link to="/" className="flex items-center gap-2 text-lg">
                <FaHome /> Go to Home
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-lg text-error"
              >
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
