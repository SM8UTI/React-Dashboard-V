import React, { useState, useEffect } from "react";
import { API_URL } from "../../../../utils/Constant";
import axios from "axios";
import {
  TextInput,
  Select,
  FileInput,
  Button,
  Title,
  Container,
  Paper,
  Tabs,
  Group,
  Stack,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { RiFileUploadLine, RiUserAddLine } from "react-icons/ri";

const StudentAdd = () => {
  const [activeTab, setActiveTab] = useState("single");
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [student, setStudent] = useState({
    name: "",
    email: "",
    roll_number: "",
    wp_phone_number: "",
    parent_wp_number: "",
    course_id: "",
    semester_id: "",
  });

  const handleInputChange = (name, value) => {
    setStudent({ ...student, [name]: value });
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

    if (activeTab === "bulk") {
      if (!file) {
        alert("Please upload a file.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          throw new Error("Token not found in cookies");
        }

        await axios.post(`${API_URL}/students/bulk`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({
          title: "Bulk Upload Successful",
          message: "Students uploaded successfully!",
          color: "green",
        });
        setFile(null);
      } catch (error) {
        console.error("Error uploading bulk data:", error);
        notifications.show({
          title: "Bulk Upload Failed",
          message: error.response?.data?.message || "An error occurred during bulk upload.",
          color: "red",
        });
      }
    } else {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          throw new Error("Token not found in cookies");
        }

        await axios.post(`${API_URL}/students`, student, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({
          title: "Student Registered",
          message: "Student registered successfully!",
          color: "green",
        });
        setStudent({
          name: "",
          email: "",
          roll_number: "",
          wp_phone_number: "",
          parent_wp_number: "",
          course_id: "",
          semester_id: "",
        });
      } catch (error) {
        console.error("Error registering student:", error);
        notifications.show({
          title: "Registration Failed",
          message: error.response?.data?.message || "An error occurred during registration.",
          color: "red",
        });
      }
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="md" radius="md">
        <Title order={2} mb="md" ta="center">
          Add Student
        </Title>

        <Tabs value={activeTab} onChange={setActiveTab} mb="md">
          <Tabs.List grow>
            <Tabs.Tab value="single" leftSection={<RiUserAddLine size={16} />}>
              Single
            </Tabs.Tab>
            <Tabs.Tab value="bulk" leftSection={<RiFileUploadLine size={16} />}>
              Bulk
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        <form onSubmit={handleSubmit}>
          {activeTab === "bulk" ? (
            <Stack>
              <FileInput
                label="Upload File"
                placeholder="Click to upload CSV file"
                accept=".csv"
                value={file}
                onChange={setFile}
                required
              />
            </Stack>
          ) : (
            <Stack>
              <TextInput
                label="Name"
                placeholder="Enter student name"
                name="name"
                value={student.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
              <TextInput
                label="Email"
                placeholder="Enter student email"
                name="email"
                type="email"
                value={student.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
              <TextInput
                label="Roll Number"
                placeholder="Enter roll number"
                name="roll_number"
                value={student.roll_number}
                onChange={(e) => handleInputChange("roll_number", e.target.value)}
                required
              />
              <TextInput
                label="WhatsApp Phone Number"
                placeholder="Enter WhatsApp phone number"
                name="wp_phone_number"
                value={student.wp_phone_number}
                onChange={(e) => handleInputChange("wp_phone_number", e.target.value)}
                required
              />
              <TextInput
                label="Parent WhatsApp Number"
                placeholder="Enter parent WhatsApp number"
                name="parent_wp_number"
                value={student.parent_wp_number}
                onChange={(e) => handleInputChange("parent_wp_number", e.target.value)}
                required
              />
              <Select
                label="Course"
                placeholder="Select course"
                data={courses}
                value={student.course_id}
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
                value={student.semester_id}
                onChange={(value) => handleInputChange("semester_id", value)}
                required
              />
            </Stack>
          )}

          <Group justify="center" mt="xl">
            <Button
              type="submit"
              variant="filled"
              size="md"
              leftSection={activeTab === "single" ? <RiUserAddLine size={16} /> : <RiFileUploadLine size={16} />}
            >
              {activeTab === "single" ? "Add Student" : "Upload Students"}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default StudentAdd;