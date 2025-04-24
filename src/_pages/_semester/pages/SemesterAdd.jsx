import React, { useState, useEffect } from "react";
import { API_URL } from "../../../../utils/Constant";
import axios from "axios";
import {
  TextInput,
  Select,
  NumberInput,
  Button,
  Title,
  Container,
  Paper,
  Group,
  Stack,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

const SemesterAdd = () => {
  const [semester, setSemester] = useState({
    course_id: "",
    sem_name: "",
    duration: "",
    start_month: "",
    end_month: "",
  });
  const [courses, setCourses] = useState([]);

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
        setCourses(
          response.data
            .filter((course) => course.is_active === 1)
            .map((course) => ({ value: course.id.toString(), label: course.name }))
        );
        if (response.data.length > 0) {
          setSemester((prevSemester) => ({
            ...prevSemester,
            course_id: response.data[0].id,
          }));
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        notifications.show({
          title: "Error",
          message: "Failed to fetch courses.",
          color: "red",
        });
      }
    };

    fetchCourses();
  }, []);

  const handleInputChange = (name, value) => {
    setSemester({ ...semester, [name]: value });
  };

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

      const response = await axios.post(`${API_URL}/semesters`, semester, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      notifications.show({
        title: "Semester Added",
        message: "Semester added successfully!",
        color: "green",
      });

      setSemester({
        course_id: "",
        sem_name: "",
        duration: "",
        start_month: "",
        end_month: "",
      });
    } catch (error) {
      console.error("Error adding semester:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to add semester.",
        color: "red",
      });
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="md" radius="md">
        <Title order={2} mb="md" ta="center">
          Add Semester
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack>
            <Select
                label="Course"
                placeholder="Select course"
                data={courses}
                value={semester.course_id}
                onChange={(value) => {
                  handleInputChange("course_id", value);
                  setSelectedCourse(value);
                }}
                required
              />
            <TextInput
              label="Semester Name"
              placeholder="Enter semester name"
              value={semester.sem_name}
              onChange={(e) => handleInputChange("sem_name", e.target.value)}
              required
            />
            <NumberInput
              label="Duration (months)"
              placeholder="Enter duration"
              value={semester.duration}
              onChange={(value) => handleInputChange("duration", value)}
              required
            />
            <TextInput
              label="Start Month"
              placeholder="Enter start month"
              value={semester.start_month}
              onChange={(e) => handleInputChange("start_month", e.target.value)}
              required
            />
            <TextInput
              label="End Month"
              placeholder="Enter end month"
              value={semester.end_month}
              onChange={(e) => handleInputChange("end_month", e.target.value)}
              required
            />
          </Stack>

          <Group justify="center" mt="xl">
            <Button type="submit" variant="filled" size="md">
              Add Semester
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default SemesterAdd;
