import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../_auth/Login";
import RouterData from "./RouterData";
import { Suspense } from "react";
import { Loader } from "@mantine/core";

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
        {route.element}
      </Suspense>
    ),

    children: route.children ? mapRoutes(route.children) : undefined,
  }));
};

let Router = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  ...mapRoutes(RouterData),
];

const AppRouter = createBrowserRouter(Router);

export default AppRouter;
