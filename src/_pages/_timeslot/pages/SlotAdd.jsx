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

const AddTimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState([
    { name: "", start_time: "", end_time: "" }
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index][field] = value;
    setTimeSlots(updatedSlots);
  };

  const handleAddSlot = () => {
    setTimeSlots([...timeSlots, { name: "", start_time: "", end_time: "" }]);
  };

  const handleRemoveSlot = (index) => {
    const updatedSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(updatedSlots);
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

      const response = await axios.post(`${API_URL}/time-slots`, { time_slots: timeSlots }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notifications.show({
        title: "Time Slots Added",
        message: "Time slots added successfully!",
        color: "green",
      });
      setTimeSlots([{ name: "", start_time: "", end_time: "" }]);
    } catch (error) {
      console.error("Error adding time slots:", error);
      notifications.show({
        title: "Addition Failed",
        message: error.response?.data?.message || "An error occurred while adding the time slots.",
        color: "red",
      });
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="md" radius="md">
        <Title order={2} mb="md" ta="center">Add Time Slots</Title>

        <form onSubmit={handleSubmit}>
          <Stack>
            {timeSlots.map((slot, index) => (
              <Paper key={index} shadow="xs" p="md" radius="sm" withBorder>
                <TextInput
                  label="Slot Name"
                  placeholder="Enter slot name"
                  value={slot.name}
                  onChange={(e) => handleInputChange(index, "name", e.target.value)}
                  required
                />
                <TextInput
                  label="Start Time"
                  placeholder="Enter start time (e.g., 09:00 AM)"
                  value={slot.start_time}
                  onChange={(e) => handleInputChange(index, "start_time", e.target.value)}
                  required
                />
                <TextInput
                  label="End Time"
                  placeholder="Enter end time (e.g., 10:00 AM)"
                  value={slot.end_time}
                  onChange={(e) => handleInputChange(index, "end_time", e.target.value)}
                  required
                />
                <Group justify="flex-end" mt="sm">
                  {timeSlots.length > 1 && (
                    <Button
                      variant="outline"
                      color="red"
                      onClick={() => handleRemoveSlot(index)}
                    >
                      Remove Slot
                    </Button>
                  )}
                </Group>
              </Paper>
            ))}
          </Stack>

          <Group justify="center" mt="xl">
            <Button
              variant="outline"
              onClick={handleAddSlot}
            >
              Add Another Slot
            </Button>
          </Group>

          <Group justify="center" mt="xl">
            <Button
              type="submit"
              variant="filled"
              size="md"
              leftSection={<RiAddCircleLine size={16} />}
            >
              Add Time Slots
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default AddTimeSlots;