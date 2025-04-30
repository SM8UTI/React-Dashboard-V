// import React, { useMemo, useEffect, useState } from "react";
// import {
//   Box,
//   Text,
//   Badge,
//   Group,
//   ActionIcon,
//   Menu,
// } from "@mantine/core";
// import {
//   BiEdit,
//   BiTrash,
//   BiDotsVerticalRounded,
// } from "react-icons/bi";
// import DynamicDataTable from "../../../components/DynamicDataTable";
// import axios from "axios";
// import { API_URL } from "../../../../utils/Constant";

// const CourseActions = ({ course }) => {
//   return (
//     <Menu shadow="md" width={200}>
//       <Menu.Target>
//         <ActionIcon variant="subtle" color="gray">
//           <BiDotsVerticalRounded size={16} />
//         </ActionIcon>
//       </Menu.Target>

//       <Menu.Dropdown>
//         <Menu.Item leftSection={<BiEdit size={14} />}>Edit</Menu.Item>
//         <Menu.Divider />
//         <Menu.Item color="red" leftSection={<BiTrash size={14} />}>
//           Delete
//         </Menu.Item>
//       </Menu.Dropdown>
//     </Menu>
//   );
// };

// const CourseList = () => {
//   const [courseData, setCourseData] = useState([]);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const token = document.cookie
//           .split("; ")
//           .find((row) => row.startsWith("token="))
//           ?.split("=")[1];

//         if (!token) {
//           throw new Error("Token not found in cookies");
//         }

//         const response = await axios.get(`${API_URL}/courses`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log("Course Data:", response.data);
//         const data = response.data.map((course) => ({
//           id: course.id,
//           name: course.name,
//           status: course.is_active ? "active" : "inactive",
//         }));
//         setCourseData(data);
//       } catch (error) {
//         console.error("Error fetching course data:", error);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "name",
//         header: "Course Name",
//         cell: ({ row }) => (
//           <Text size="sm" fw={500}>
//             {row.original.name}
//           </Text>
//         ),
//       },
//       {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ row }) => {
//           const status = row.original.status;
//           const color = status === "active" ? "green" : "red";
//           return (
//             <Badge color={color} variant="light">
//               {status.toUpperCase()}
//             </Badge>
//           );
//         },
//       },
//       {
//         id: "actions",
//         header: "Actions",
//         cell: ({ row }) => <CourseActions course={row.original} />,
//       },
//     ],
//     []
//   );

//   return (
//     <Box p="md">
//       <Group justify="space-between" mb="xl">
//         <Box>
//           <Text size="xl" fw={700} c="primary.5">
//             Course Management
//           </Text>
//           <Text size="sm" c="dimmed">
//             Manage and view all course information
//           </Text>
//         </Box>
//         {/* Add additional actions here if needed, like "Add Course" button */}
//       </Group>

//       <DynamicDataTable
//         data={courseData}
//         columns={columns}
//         enableSorting
//         enableFiltering
//         enablePagination
//       />
//     </Box>
//   );
// };

// export default CourseList;

import React, { useMemo, useEffect, useState } from "react";
import {
  Box,
  Text,
  Badge,
  Group,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Button,
  Stack,
} from "@mantine/core";
import {
  BiEdit,
  BiTrash,
  BiDotsVerticalRounded,
} from "react-icons/bi";
import DynamicDataTable from "../../../components/DynamicDataTable";
import axios from "axios";
import { API_URL } from "../../../../utils/Constant";
import { notifications } from "@mantine/notifications";

const CourseEditModal = ({ isOpen, onClose, course, onCourseUpdated }) => {
  const [formData, setFormData] = useState({
    course_name: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        course_name: course.name || "",
      });
    }
  }, [course]);

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

      const response = await axios.put(`${API_URL}/courses/${course.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      notifications.show({
        title: "Success",
        message: "Course information updated successfully",
        color: "green",
      });
      
      onCourseUpdated(course.id, {
        ...course,
        name: formData.course_name,
      });
      
      onClose();
    } catch (error) {
      console.error("Error updating course:", error);
      notifications.show({
        title: "Update Failed",
        message: error.response?.data?.message || "An error occurred while updating course information.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit Course Information" size="md">
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Course Name"
            placeholder="Enter course name"
            value={formData.course_name}
            onChange={(e) => handleInputChange("course_name", e.target.value)}
            required
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

const CourseActions = ({ course, onEdit }) => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray">
          <BiDotsVerticalRounded size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<BiEdit size={14} />} onClick={() => onEdit(course)}>
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

const CourseList = () => {
  const [courseData, setCourseData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
        console.log("Course Data:", response.data);
        const data = response.data.map((course) => ({
          id: course.id,
          name: course.name,
          status: course.is_active ? "active" : "inactive",
        }));
        setCourseData(data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleCourseUpdated = (id, updatedCourse) => {
    setCourseData(courseData.map(course => 
      course.id === id ? updatedCourse : course
    ));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Course Name",
        cell: ({ row }) => (
          <Text size="sm" fw={500}>
            {row.original.name}
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
        cell: ({ row }) => (
          <CourseActions 
            course={row.original} 
            onEdit={handleEditCourse}
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
            Course Management
          </Text>
          <Text size="sm" c="dimmed">
            Manage and view all course information
          </Text>
        </Box>
        {/* Add additional actions here if needed, like "Add Course" button */}
      </Group>

      <DynamicDataTable
        data={courseData}
        columns={columns}
        enableSorting
        enableFiltering
        enablePagination
      />

      <CourseEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        course={selectedCourse}
        onCourseUpdated={handleCourseUpdated}
      />
    </Box>
  );
};

export default CourseList;