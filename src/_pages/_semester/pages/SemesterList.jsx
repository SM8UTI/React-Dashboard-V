import React, { useMemo, useEffect, useState } from "react";
import {
  Box,
  Text,
  Badge,
  Group,
  ActionIcon,
  Menu,
  Select,
} from "@mantine/core";
import {
  BiEdit,
  BiTrash,
  BiDotsVerticalRounded,
} from "react-icons/bi";
import DynamicDataTable from "../../../components/DynamicDataTable";
import axios from "axios";
import { API_URL } from "../../../../utils/Constant";

const SemesterActions = ({ semester }) => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray">
          <BiDotsVerticalRounded size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<BiEdit size={14} />}>Edit</Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" leftSection={<BiTrash size={14} />}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const SemesterList = () => {
  const [semesterData, setSemesterData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          throw new Error("Token not found in cookies");
        }

        const response = await axios.get(`${API_URL}/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const activeCourses = response.data
          .filter((course) => course.is_active === 1)
          .map((course) => ({ value: course.id.toString(), label: course.name }));

        setCourses(activeCourses);

        if (activeCourses.length > 0) {
          setSelectedCourse(activeCourses[0].value); // Set the first course as default
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;

    const fetchSemesters = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          throw new Error("Token not found in cookies");
        }

        const response = await axios.get(
          `${API_URL}/semesters?courseId=${selectedCourse}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.map((semester) => ({
          id: semester.id,
          name: semester.sem_name,
          duration: `${semester.duration} months`,
          startMonth: semester.start_month,
          endMonth: semester.end_month,
          isActive: semester.is_active ? "Active" : "Inactive",
        }));
        setSemesterData(data);
      } catch (error) {
        console.error("Error fetching semester data:", error);
      }
    };

    fetchSemesters();
  }, [selectedCourse]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Semester Name",
        cell: ({ row }) => (
          <Text size="sm" fw={500}>
            {row.original.name}
          </Text>
        ),
      },
      {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => (
          <Text size="sm">{row.original.duration}</Text>
        ),
      },
      {
        accessorKey: "startMonth",
        header: "Start Month",
        cell: ({ row }) => (
          <Text size="sm">{row.original.startMonth}</Text>
        ),
      },
      {
        accessorKey: "endMonth",
        header: "End Month",
        cell: ({ row }) => (
          <Text size="sm">{row.original.endMonth}</Text>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.isActive;
          const color = status === "Active" ? "green" : "red";
          return (
            <Badge color={color} variant="light">
              {status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <SemesterActions semester={row.original} />,
      },
    ],
    []
  );

  return (
    <Box p="md">
      <Group justify="space-between" mb="xl">
        <Box>
          <Text size="xl" fw={700} c="primary.5">
            Semester Management
          </Text>
          <Text size="sm" c="dimmed">
            Manage and view all semester information
          </Text>
        </Box>
        <Select
          data={courses}
          value={selectedCourse}
          onChange={setSelectedCourse}
          placeholder="Select a course"
          label="Course"
          clearable
        />
      </Group>

      <DynamicDataTable
        data={semesterData}
        columns={columns}
        enableSorting
        enableFiltering
        enablePagination
      />
    </Box>
  );
};

export default SemesterList;