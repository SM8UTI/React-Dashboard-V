import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import '@mantine/dates/styles.css';
import { createTheme, MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import AppRouter from "./router/AppRouter.jsx";
import { Notifications } from "@mantine/notifications";
import axios from "axios";
import { API_URL } from "../utils/Constant";
import React, { useEffect } from "react";
import Cookies from "js-cookie";


const theme = createTheme({
  fontFamily: "Instrument Sans",
  primaryColor: "primary",
  colors: {
    primary: [
      "#fdf3f2", // 50
      "#f9e7e5", // 100
      "#edcac6", // 200
      "#e2ada8", // 300
      "#d79089", // 400
      "#b33f2b", // 500 - primary color
      "#a13928", // 600
      "#8f331f", // 700
      "#7d2d15", // 800
      "#6b270c", // 900
    ],
    secondary: [
      "#f5eeef", // 50
      "#ecdddf", // 100
      "#d9bbbf", // 200
      "#c69aa0", // 300
      "#b37880", // 400
      "#854a4d", // 500 - secondary color
      "#784345", // 600
      "#6a3c3d", // 700
      "#5d3435", // 800
      "#502d2d", // 900
    ],
  },
});

const App = () => {
  // useEffect(() => {
  //   const checkTokenValidity = async () => {
  //     const token = Cookies.get("token");
  //     if (token) {
  //       try {
  //         const response = await axios.get(`${API_URL}/is-token-valid`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         });
  //         if (response.data.error === "Invalid token") {
  //           Cookies.remove("token");
  //           window.location.href = "/login";
  //         }
  //       } catch (error) {
  //         Cookies.remove("token");
  //         window.location.href = "/login";
  //       }
  //     } else {
  //       window.location.href = "/login";
  //     }
  //   };

  //   checkTokenValidity();
  // }, []);

  return (
    <StrictMode>
      <MantineProvider theme={theme}>
        <Notifications zIndex={1000000000} />
        <RouterProvider router={AppRouter} />
      </MantineProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<App />);
