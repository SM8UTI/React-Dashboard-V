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
} from "react-icons/bi";
import DynamicDataTable from "../../../components/DynamicDataTable";
import axios from "axios";
import { API_URL } from "../../../../utils/Constant";

const SubjectActions = () => {
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

const SubjectList = () => {
  const [subjectData, setSubjectData] = useState([]);
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
    const fetchSubjects = async () => {
      if (!selectedCourse || !selectedSemester) return;
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
        const response = await axios.get(
          `${API_URL}/subjects?course_id=${selectedCourse}&semester_id=${selectedSemester}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.map((subject) => ({
          id: subject.id,
          name: subject.name,
          code: subject.code,
          status: subject.is_active ? "active" : "inactive",
        }));
        setSubjectData(data);
      } catch (error) {
        console.error("Error fetching subject data:", error);
      }
    };

    fetchSubjects();
  }, [selectedCourse, selectedSemester]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Subject Name",
        cell: ({ row }) => (
          <Text size="sm" fw={500}>
            {row.original.name}
          </Text>
        ),
      },
      {
        accessorKey: "code",
        header: "Subject Code",
        cell: ({ row }) => (
          <Text size="sm" fw={500}>
            {row.original.code}
          </Text>
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
        cell: ({ row }) => <SubjectActions subject={row.original} />,
      },
    ],
    []
  );

  return (
    <Box>
      <Group position="apart" mb="xl">
        <Box>
          <Text size="xl" fw={700} c="primary.5">
            Subject Management
          </Text>
          <Text size="sm" c="dimmed">
            Manage and view all subject information
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
        data={subjectData}
        columns={columns}
        enableSorting
        enableFiltering
        enablePagination
      />
    </Box>
  );
};

export default SubjectList;