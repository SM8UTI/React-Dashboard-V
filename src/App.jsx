import { Button } from "@mantine/core";
import { RiLogoutBoxLine } from "react-icons/ri";
import RouterData from "./router/RouterData";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const App = () => {
  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/login";
  };

  return (
    <div className="font-primary bg-gray-50/50">
      <div className="p-4 flex border-b sticky bg-white top-0 left-0 border-black/10 flex-row items-center justify-between gap-4 ">
        <img
          src="https://vsbm.odishavikash.com/assets/img/VSBM.png"
          alt="logo"
          className="w-full max-w-[140px]"
        />
        <div className="flex flex-row items-center gap-6">
          <div className=" hidden sm:flex flex-col text-right">
            <h3 className="text-xl font-bold">Admin Dashboard</h3>
            <p className="text-xs text-gray-500">Welcome back, Admin!</p>
          </div>
          <Button
            size="md"
            variant="light"
            rightSection={<RiLogoutBoxLine />}
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>
      <div className="w-full h-full min-h-[calc(100dvh_-_180px)]  max-w-[600px] mx-auto">
        <div className="text-center mt-10">
          <h3 className="text-2xl font-primary font-bold text-gray-700">
            Explore Services
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 p-4">
          {RouterData.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className="flex flex-col items-center border border-black/10 p-2 rounded-lg"
            >
              <div className="bg-gray-50 p-4 border border-black/5 rounded-sm">
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-full max-w-[200px] mb-2"
                />
              </div>
              <h4 className="text-lg font-medium py-4  text-gray-500">
                {item.name}
              </h4>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col border-t border-black/10 text-sm items-center py-4 justify-center text-center text-gray-500">
        <p>Copyright © {new Date().getFullYear()} All rights reserved. </p>
      </div>
    </div>
  );
};

export default App;
