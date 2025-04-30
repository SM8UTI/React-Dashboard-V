import React, { useMemo, useEffect, useState } from "react";
import {
  Box,
  Text,
  Badge,
  Group,
  ActionIcon,
  Avatar,
  Menu,
  Modal,
  TextInput,
  Checkbox,
  Button,
  Stack,
  MultiSelect,
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
import { notifications } from "@mantine/notifications";

const TeacherEditModal = ({ isOpen, onClose, teacher, onTeacherUpdated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subjects: [],
    is_admin: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [availableSubjects] = useState([
    "Mathematics", "Science", "History", "English", "Physics", 
    "Chemistry", "Biology", "Computer Science", "Geography", "Art"
  ]);

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
        subjects: teacher.subjects || [],
        is_admin: teacher.department === "Admin",
      });
    }
  }, [teacher]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("Token not found in cookies");
      }

      const response = await axios.put(`${API_URL}/teachers/${teacher.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      notifications.show({
        title: "Success",
        message: "Teacher information updated successfully",
        color: "green",
      });
      
      onTeacherUpdated(teacher.id, {
        ...teacher,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        is_admin: formData.is_admin,
      });
      
      onClose();
    } catch (error) {
      console.error("Error updating teacher:", error);
      notifications.show({
        title: "Update Failed",
        message: error.response?.data?.message || "An error occurred while updating teacher information.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit Teacher Information" size="md">
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Name"
            placeholder="Enter teacher name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
          
          <TextInput
            label="Email"
            placeholder="Enter teacher email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
          
          <TextInput
            label="Phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
          
          {/* <MultiSelect
            label="Subjects"
            placeholder="Select teaching subjects"
            data={availableSubjects}
            value={formData.subjects}
            onChange={(value) => handleInputChange("subjects", value)}
            searchable
            creatable
            getCreateLabel={(query) => `+ Add ${query}`}
            onCreate={(query) => {
              const item = query;
              return item;
            }}
          /> */}
          
          <Checkbox
            label="Is Admin"
            checked={formData.is_admin}
            onChange={(e) => handleInputChange("is_admin", e.target.checked)}
            mt="xs"
          />
        </Stack>
        
        <Group justify="flex-end" mt="xl">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isLoading}>Update</Button>
        </Group>
      </form>
    </Modal>
  );
};

const TeacherActions = ({ teacher, onEdit }) => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray">
          <BiDotsVerticalRounded size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<BiEdit size={14} />} onClick={() => onEdit(teacher)}>
          Edit
        </Menu.Item>
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

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
          phone: teacher.phone || "N/A", // Add phone if available
          subjects: teacher.subjects || [], // Add subjects if available
          department: teacher.is_admin ? "Admin" : "Staff",
          status: "active", // Adjust status if available
          joiningDate: teacher.joining_date || "N/A", // Add joining date if available
          avatar: null,
        }));
        setTeacherData(data);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const handleTeacherUpdated = (id, updatedTeacher) => {
    setTeacherData(teacherData.map(teacher => 
      teacher.id === id ? updatedTeacher : teacher
    ));
  };

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
            {row.original.subjects && row.original.subjects.length > 0 ? (
              row.original.subjects.map((subject, index) => (
                <Badge key={index} color="primary" variant="light" size="sm">
                  {subject}
                </Badge>
              ))
            ) : (
              <Text size="xs" c="dimmed">No subjects assigned</Text>
            )}
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
        cell: ({ row }) => (
          <TeacherActions 
            teacher={row.original} 
            onEdit={handleEditTeacher}
          />
        ),
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

      <TeacherEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teacher={selectedTeacher}
        onTeacherUpdated={handleTeacherUpdated}
      />
    </Box>
  );
};

export default TeacherList;