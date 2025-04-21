import React, { useMemo } from "react";
import {
  Box,
  Text,
  Badge,
  Group,
  ActionIcon,
  Avatar,
  Menu,
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

// Mock teacher data
const teacherData = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@school.edu",
    phone: "+1 (555) 123-4567",
    subjects: ["Mathematics", "Physics"],
    department: "Science",
    status: "active",
    joiningDate: "2020-08-15",
    avatar: null,
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@school.edu",
    phone: "+1 (555) 234-5678",
    subjects: ["Chemistry", "Biology"],
    department: "Science",
    status: "active",
    joiningDate: "2019-09-01",
    avatar: null,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@school.edu",
    phone: "+1 (555) 345-6789",
    subjects: ["English Literature", "Creative Writing"],
    department: "English",
    status: "on_leave",
    joiningDate: "2021-01-10",
    avatar: null,
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@school.edu",
    phone: "+1 (555) 456-7890",
    subjects: ["History", "Geography"],
    department: "Social Studies",
    status: "active",
    joiningDate: "2018-07-20",
    avatar: null,
  },
];

const TeacherActions = ({ teacher }) => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray">
          <BiDotsVerticalRounded size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<BiEdit size={14} />}>Edit</Menu.Item>
        <Menu.Item leftSection={<BiMailSend size={14} />}>Send Email</Menu.Item>
        <Menu.Item leftSection={<BiCalendarEvent size={14} />}>
          View Schedule
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
            {row.original.subjects.map((subject, index) => (
              <Badge key={index} color="primary" variant="light" size="sm">
                {subject}
              </Badge>
            ))}
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
            {new Date(row.original.joiningDate).toLocaleDateString()}
          </Text>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <TeacherActions teacher={row.original} />,
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
    </Box>
  );
};

export default TeacherList;
