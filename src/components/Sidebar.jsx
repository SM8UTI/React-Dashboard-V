import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, ScrollArea, Text, Box } from "@mantine/core";
import { RiArrowLeftLine, RiLogoutBoxLine } from "react-icons/ri";

const Sidebar = ({ links }) => {
  const navigate = useNavigate();

  return (
    <div className="h-dvh w-full bg-white flex flex-col">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Button
          leftSection={<RiArrowLeftLine />}
          variant="outline"
          color="primary"
          fullWidth
          onClick={() => {
            navigate("/");
          }}
        >
          Back to Services
        </Button>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div>
            <img
              src={links.icon}
              alt=""
              className="size-[40px] object-contain object-center"
            />
          </div>
          <div className="ml-3">
            <Text size="sm" fw={600} c="gray.8">
              {links.name}
            </Text>
            <Text size="xs" c="dimmed">
              services
            </Text>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="flex flex-col gap-2">
          {links.children.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center p-2 py-3 rounded-md text-sm font-normal ${
                  isActive
                    ? "bg-orange-600 text-white"
                    : "text-gray-500 bg-gray-50"
                }`
              }
            >
              <span className="ml-3 text-base">{link.name}</span>
            </NavLink>
          ))}
        </div>
      </ScrollArea>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="light"
          color="red"
          fullWidth
          fw={500}
          leftSection={<RiLogoutBoxLine size={20} />}
          onClick={() => {
            // Add logout functionality
            console.log("Logging out...");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
