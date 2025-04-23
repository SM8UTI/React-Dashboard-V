import React, { useState } from "react";
import { API_URL } from "../../../../utils/Constant";
import axios from "axios";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Container,
  Paper,
  Tabs,
  Group,
  FileInput,
  Box,
  Stack
} from '@mantine/core';
import { notifications } from "@mantine/notifications";
import { RiFileUploadLine, RiUserAddLine } from "react-icons/ri";

const TeacherAdd = () => {
  const [activeTab, setActiveTab] = useState("single");
  const [file, setFile] = useState(null);
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    password: "",
    is_admin: false,
  });

  const handleInputChange = (name, value) => {
    setTeacher({ ...teacher, [name]: value });
  };

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

        const response = await axios.post(`${API_URL}/teachers/bulk`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({
          title: "Bulk Upload Successful",
          message: "Teachers uploaded successfully!",
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

        const response = await axios.post(`${API_URL}/teachers/register`, teacher, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({
          title: "Teacher Registered",
          message: "Teacher registered successfully!",
          color: "green",
        });
        setTeacher({
          name: "",
          email: "",
          password: "",
          is_admin: false,
        });
      } catch (error) {
        console.error("Error registering teacher:", error);
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
        <Title order={2} mb="md" ta="center">Add Teacher</Title>

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
                placeholder="Enter teacher name"
                name="name"
                value={teacher.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
              <TextInput
                label="Email"
                placeholder="Enter teacher email"
                name="email"
                type="email"
                value={teacher.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
              <PasswordInput
                label="Password"
                placeholder="Enter password"
                name="password"
                value={teacher.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
              <Checkbox
                label="Is Admin"
                checked={teacher.is_admin}
                onChange={(e) => handleInputChange("is_admin", e.target.checked)}
                mt="xs"
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
              {activeTab === "single" ? "Add Teacher" : "Upload Teachers"}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default TeacherAdd;