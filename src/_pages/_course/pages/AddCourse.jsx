import React, { useState } from "react";
import { API_URL } from "../../../../utils/Constant";
import axios from "axios";
import {
  TextInput,
  Button,
  Title,
  Container,
  Paper,
  Group,
  Stack
} from '@mantine/core';
import { notifications } from "@mantine/notifications";
import { RiAddCircleLine } from "react-icons/ri";

const AddCourse = () => {
  const [course, setCourse] = useState({
    course_name: "",
  });

  const handleInputChange = (name, value) => {
    setCourse({ ...course, [name]: value });
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

      const response = await axios.post(`${API_URL}/courses`, course, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notifications.show({
        title: "Course Added",
        message: "Course added successfully!",
        color: "green",
      });
      setCourse({
        course_name: "",
      });
    } catch (error) {
      console.error("Error adding course:", error);
      notifications.show({
        title: "Addition Failed",
        message: error.response?.data?.message || "An error occurred while adding the course.",
        color: "red",
      });
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="md" radius="md">
        <Title order={2} mb="md" ta="center">Add Course</Title>

        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Course Name"
              placeholder="Enter course name"
              name="course_name"
              value={course.course_name}
              onChange={(e) => handleInputChange("course_name", e.target.value)}
              required
            />
          </Stack>

          <Group justify="center" mt="xl">
            <Button
              type="submit"
              variant="filled"
              size="md"
              leftSection={<RiAddCircleLine size={16} />}
            >
              Add Course
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default AddCourse;