import React, { useState, useEffect } from "react";
import { API_URL } from "../../../../utils/Constant";
import axios from "axios";
import {
  TextInput,
  Select,
  Button,
  Title,
  Container,
  Paper,
  Group,
  Stack,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { RiAddLine } from "react-icons/ri";

const SubjectAdd = () => {
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [subject, setSubject] = useState({
    name: "",
    code: "",
    course_id: "",
    semester_id: "",
  });

  const handleInputChange = (name, value) => {
    setSubject({ ...subject, [name]: value });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("Token not found in cookies");
      }

      await axios.post(`${API_URL}/subjects`, subject, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notifications.show({
        title: "Subject Added",
        message: "Subject added successfully!",
        color: "green",
      });
      setSubject({
        name: "",
        code: "",
        course_id: "",
        semester_id: "",
      });
    } catch (error) {
      console.error("Error adding subject:", error);
      notifications.show({
        title: "Addition Failed",
        message: error.response?.data?.message || "An error occurred while adding the subject.",
        color: "red",
      });
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="md" radius="md">
        <Title order={2} mb="md" ta="center">
          Add Subject
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Subject Name"
              placeholder="Enter subject name"
              name="name"
              value={subject.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
            <TextInput
              label="Subject Code"
              placeholder="Enter subject code"
              name="code"
              value={subject.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              required
            />
            <Select
              label="Course"
              placeholder="Select course"
              data={courses}
              value={subject.course_id}
              onChange={(value) => {
                handleInputChange("course_id", value);
                setSelectedCourse(value);
              }}
              required
            />
            <Select
              label="Semester"
              placeholder="Select semester"
              data={semesters}
              value={subject.semester_id}
              onChange={(value) => handleInputChange("semester_id", value)}
              required
            />
          </Stack>

          <Group justify="center" mt="xl">
            <Button
              type="submit"
              variant="filled"
              size="md"
              leftSection={<RiAddLine size={16} />}
            >
              Add Subject
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default SubjectAdd;