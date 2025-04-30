import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FindRoute } from "../../router/RouterData";
import Sidebar from "../../components/Sidebar";
import { Button, Drawer } from "@mantine/core";
import { RiMenu2Line } from "react-icons/ri";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if(location.pathname === "/attendance" || location.pathname === "/attendance/") {
      navigate("/attendance/sheet");
    }
    document.title = "Attendance | School Management System";
  }, []);
  const result = FindRoute("/attendance");
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className="flex flex-row">
      <div className="sticky top-0 hidden lg:flex left-0 shrink-0 w-64 max-h-max border-r  border-gray-200">
        <Sidebar links={result || {}} />
      </div>
      <div className="flex-1 pt-0">
        <div className="flex flex-row sticky top-0 bg-white px-4 items-center gap-2 border-b border-black/10 py-4">
          <div className="lg:hidden">
            <Button px={12} onClick={open} variant="light">
              <RiMenu2Line />
            </Button>
          </div>
          <h3 className="text-2xl font-primary font-medium text-gray-500">
            Attendance
          </h3>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
      <Drawer opened={opened} onClose={close} title="Menu" p={4} size={260}>
        <Sidebar links={result || {}} />
      </Drawer>
    </div>
  );
};

export default Index;
