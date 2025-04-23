import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Login from "../_auth/Login";
import RouterData from "./RouterData";
import { Suspense } from "react";
import { Loader } from "@mantine/core";

// Utility function to check for token in cookies
const hasToken = () => {
  return document.cookie.split(";").some((item) => item.trim().startsWith("token="));
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  return hasToken() ? children : <Navigate to="/login" replace />;
};

// Public Route Wrapper
const PublicRoute = ({ children }) => {
  return hasToken() ? <Navigate to="/" replace /> : children;
};

const mapRoutes = (routes) => {
  return routes.map((route) => ({
    path: route.path,
    element: (
      <Suspense
        fallback={
          <div className="grid place-content-center h-dvh text-center gap-2">
            <Loader />
          </div>
        }
      >
        {route.protected ? (
          <ProtectedRoute>{route.element}</ProtectedRoute>
        ) : (
          route.element
        )}
      </Suspense>
    ),
    children: route.children ? mapRoutes(route.children) : undefined,
  }));
};

let Router = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <PublicRoute><Login /></PublicRoute>,
  },
  ...mapRoutes(RouterData),
];

const AppRouter = createBrowserRouter(Router);

export default AppRouter;
