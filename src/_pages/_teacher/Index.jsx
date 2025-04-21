import React from "react";
import { Outlet } from "react-router-dom";
import { FindRoute } from "../../router/RouterData";
import Sidebar from "../../components/Sidebar";
import { Button } from "@mantine/core";
import { RiMenu2Line } from "react-icons/ri";

const Index = () => {
  const result = FindRoute("/teacher");

  console.log(result);

  return (
    <div className="flex flex-row">
      <div className="sticky top-0 hidden lg:flex left-0 shrink-0 w-64 max-h-max">
        <Sidebar links={result || {}} />
      </div>
      <div className="flex-1 pt-0">
        <div className="flex flex-row sticky top-0 bg-white px-4 items-center gap-2 border-b border-black/10 py-4">
          <div className="lg:hidden">
            <Button px={12}>
              <RiMenu2Line />
            </Button>
          </div>
          <h3 className="text-2xl font-primary font-medium text-gray-500">
            Teacher
          </h3>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Index;
