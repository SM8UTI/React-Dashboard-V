import React, { useMemo, useEffect, useState } from "react";
import {
  Box,
  Text,
  Badge,
  Group,
  ActionIcon,
  Avatar,
  Menu,
} from "@mantine/core";
import {
  BiEdit,
  BiTrash,
  BiDotsVerticalRounded,
  BiMailSend,
  BiPhone,
  BiCalendarEvent,
} from "react-icons/bi";
import DynamicDataTable from "../../../components/DynamicDataTable";
import axios from "axios";
import { API_URL } from "../../../../utils/Constant";

const TeacherActions = ({ teacher }) => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray">
          <BiDotsVerticalRounded size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<BiEdit size={14} />}>Edit</Menu.Item>
        {/* <Menu.Item leftSection={<BiMailSend size={14} />}>Send Email</Menu.Item> */}
        {/* <Menu.Item leftSection={<BiCalendarEvent size={14} />}>
          View Schedule
        </Menu.Item> */}
        <Menu.Divider />
        <Menu.Item color="red" leftSection={<BiTrash size={14} />}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const TeacherList = () => {
  const [teacherData, setTeacherData] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          throw new Error("Token not found in cookies");
        }

        const response = await axios.get(`${API_URL}/teachers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Teacher Data:", response.data);
        const data = response.data.map((teacher) => ({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          phone: "N/A", // Add phone if available
          subjects: teacher.subjects, // Add subjects if available
          department: teacher.is_admin ? "Admin" : "Staff",
          status: "active", // Adjust status if available
          joiningDate: "N/A", // Add joining date if available
          avatar: null,
        }));
        setTeacherData(data);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchTeachers();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Teacher",
        cell: ({ row }) => (
          <Group gap="sm">
            <Avatar
              name={row.original.name}
              color="primary"
              radius="xl"
              size="md"
            />
            <Box>
              <Text size="sm" fw={500}>
                {row.original.name}
              </Text>
              <Text size="xs" c="dimmed">
                {row.original.department}
              </Text>
            </Box>
          </Group>
        ),
      },
      {
        accessorKey: "email",
        header: "Contact",
        cell: ({ row }) => (
          <Box>
            <Group gap="xs">
              <BiMailSend size={14} />
              <Text size="sm">{row.original.email}</Text>
            </Group>
            <Group gap="xs" mt={4}>
              <BiPhone size={14} />
              <Text size="sm">{row.original.phone}</Text>
            </Group>
          </Box>
        ),
      },
      {
        accessorKey: "subjects",
        header: "Subjects",
        cell: ({ row }) => (
          <Group gap={4}>
            {row.original.subjects.map((subject, index) => (
              <Badge key={index} color="primary" variant="light" size="sm">
                {subject}
              </Badge>
            ))}
          </Group>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const color =
            status === "active"
              ? "green"
              : status === "on_leave"
              ? "yellow"
              : "red";
          return (
            <Badge color={color} variant="light">
              {status.replace("_", " ").toUpperCase()}
            </Badge>
          );
        },
      },
      {
        accessorKey: "joiningDate",
        header: "Joining Date",
        cell: ({ row }) => (
          <Text size="sm" c="dimmed">
            {row.original.joiningDate}
          </Text>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <TeacherActions teacher={row.original} />,
      },
    ],
    []
  );

  return (
    <Box p="md">
      <Group justify="space-between" mb="xl">
        <Box>
          <Text size="xl" fw={700} c="primary.5">
            Teacher Management
          </Text>
          <Text size="sm" c="dimmed">
            Manage and view all teacher information
          </Text>
        </Box>
        {/* Add additional actions here if needed, like "Add Teacher" button */}
      </Group>

      <DynamicDataTable
        data={teacherData}
        columns={columns}
        enableSorting
        enableFiltering
        enablePagination
      />
    </Box>
  );
};

export default TeacherList;
