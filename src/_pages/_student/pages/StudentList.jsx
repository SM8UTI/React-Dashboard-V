import React, { useMemo, useEffect, useState } from "react";
import {
  Box,
  Text,
  Badge,
  Group,
  ActionIcon,
  Avatar,
  Menu,
  Select,
} from "@mantine/core";
import {
  BiEdit,
  BiTrash,
  BiDotsVerticalRounded,
  BiMailSend,
  BiPhone,
} from "react-icons/bi";
import DynamicDataTable from "../../../components/DynamicDataTable";
import axios from "axios";
import { API_URL } from "../../../../utils/Constant";

const StudentActions = () => {
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

const StudentList = () => {
  const [studentData, setStudentData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
        const response = await axios.get(`${API_URL}/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Courses:", response.data);
        setCourses(
          response.data
            .filter((course) => course.is_active === 1)
            .map((course) => ({ value: course.id.toString(), label: course.name }))
        );
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchSemesters = async () => {
      if (!selectedCourse) return;
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
        const response = await axios.get(`${API_URL}/semesters?courseId=${selectedCourse}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSemesters(
          response.data
            .filter((semester) => semester.is_active === 1)
            .map((semester) => ({
              value: semester.id.toString(),
              label: semester.sem_name,
            }))
        );
      } catch (error) {
        console.error("Error fetching semesters:", error);
      }
    };

    fetchSemesters();
  }, [selectedCourse]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourse || !selectedSemester) return;
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
        const response = await axios.get(`${API_URL}/students/${selectedCourse}/${selectedSemester}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.map((student) => ({
          id: student.id,
          name: student.name,
          rollNumber: student.roll_number,
          email: student.email,
          wpPhoneNumber: student.wp_phone_number,
          parentWpNumber: student.parent_wp_number,
          status: student.is_active ? "active" : "inactive",
        }));
        setStudentData(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudents();
  }, [selectedCourse, selectedSemester]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Student",
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
                Roll No: {row.original.rollNumber}
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
              <Text size="sm">{row.original.wpPhoneNumber}</Text>
            </Group>
          </Box>
        ),
      },
      {
        accessorKey: "parentWpNumber",
        header: "Parent Contact",
        cell: ({ row }) => (
          <Group gap="xs">
            <BiPhone size={14} />
            <Text size="sm">{row.original.parentWpNumber}</Text>
          </Group>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const color = status === "active" ? "green" : "red";
          return (
            <Badge color={color} variant="light">
              {status.toUpperCase()}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <StudentActions student={row.original} />,
      },
    ],
    []
  );

  return (
    <Box>
      <Group position="apart" mb="xl">
        <Box>
          <Text size="xl" fw={700} c="primary.5">
            Student Management
          </Text>
          <Text size="sm" c="dimmed">
            Manage and view all student information
          </Text>
        </Box>
        <Group>
          <Select
            placeholder="Select Course"
            data={courses}
            value={selectedCourse}
            onChange={setSelectedCourse}
          />
          <Select
            placeholder="Select Semester"
            data={semesters}
            value={selectedSemester}
            onChange={setSelectedSemester}
            disabled={!selectedCourse}
          />
        </Group>
      </Group>

      <DynamicDataTable
        data={studentData}
        columns={columns}
        enableSorting
        enableFiltering
        enablePagination
      />
    </Box>
  );
};

export default StudentList;
