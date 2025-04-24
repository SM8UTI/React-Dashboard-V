import React, { useMemo, useEffect, useState } from "react";
import {
  Box,
  Text,
  Badge,
  Group,
  ActionIcon,
  Menu,
} from "@mantine/core";
import {
  BiEdit,
  BiTrash,
  BiDotsVerticalRounded,
} from "react-icons/bi";
import DynamicDataTable from "../../../components/DynamicDataTable";
import axios from "axios";
import { API_URL } from "../../../../utils/Constant";

const SlotActions = ({ slot }) => {
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

const SlotList = () => {
  const [slotData, setSlotData] = useState([]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          throw new Error("Token not found in cookies");
        }

        const response = await axios.get(`${API_URL}/time-slots`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Slot Data:", response.data);
        const data = response.data.map((slot) => ({
          id: slot.id,
          name: slot.name,
          startTime: slot.start_time,
          endTime: slot.end_time,
          status: slot.is_active ? "active" : "inactive",
        }));
        setSlotData(data);
      } catch (error) {
        console.error("Error fetching slot data:", error);
      }
    };

    fetchSlots();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Slot Name",
        cell: ({ row }) => (
          <Text size="sm" fw={500}>
            {row.original.name}
          </Text>
        ),
      },
      {
        accessorKey: "startTime",
        header: "Start Time",
        cell: ({ row }) => (
          <Text size="sm">{row.original.startTime}</Text>
        ),
      },
      {
        accessorKey: "endTime",
        header: "End Time",
        cell: ({ row }) => (
          <Text size="sm">{row.original.endTime}</Text>
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
        cell: ({ row }) => <SlotActions slot={row.original} />,
      },
    ],
    []
  );

  return (
    <Box p="md">
      <Group justify="space-between" mb="xl">
        <Box>
          <Text size="xl" fw={700} c="primary.5">
            Time Slot Management
          </Text>
          <Text size="sm" c="dimmed">
            Manage and view all time slot information
          </Text>
        </Box>
        {/* Add additional actions here if needed, like "Add Slot" button */}
      </Group>

      <DynamicDataTable
        data={slotData}
        columns={columns}
        enableSorting
        enableFiltering
        enablePagination
      />
    </Box>
  );
};

export default SlotList;