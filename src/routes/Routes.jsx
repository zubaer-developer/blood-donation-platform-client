import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "../Root/Root";
import Home from "../pages/Home/Home";
import ErrorPage from "../pages/Error/ErrorPage";
import Registration from "../pages/Auth/Registration";
import Login from "../pages/Auth/Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../layouts/Dashboard";
import DonorProfile from "../pages/Dashboard/Donor/DonorProfile";
import CreateDonationRequest from "../pages/Dashboard/Donor/CreateDonationRequest";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        index: true,
        Component: Home,
      },
      // Auth Routes
      {
        path: "/register",
        Component: Registration,
      },
      {
        path: "/login",
        Component: Login,
      },
    ],
  },

  // Dashboard Layout Route
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "profile",
        element: <DonorProfile />,
      },
      {
        index: true,
        element: <DonorProfile />,
      },
      {
        path: "/create-request",
        element: <CreateDonationRequest></CreateDonationRequest>,
      },
    ],
  },
]);
