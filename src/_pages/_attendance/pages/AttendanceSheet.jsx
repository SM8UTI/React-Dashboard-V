import React, { useEffect, useState } from "react";
import {
    Box,
    Text,
    Group,
    Select,
    Button,
    Checkbox,
    Table,
    Stack,
    Paper,
    Container,
    Title,
    Radio,
    Card,
    ScrollArea,
} from "@mantine/core";
import { DatesProvider, DateTimePicker } from "@mantine/dates";
import axios from "axios";
import { API_URL } from "../../../../utils/Constant";
import { RiCalendarLine, RiCheckLine, RiSearchLine, RiCloseLine } from "react-icons/ri";

const AttendanceSheet = () => {
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [attendanceStatus, setAttendanceStatus] = useState({});
    const [loading, setLoading] = useState(false);

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
                    response.data.map((course) => ({
                        value: course.id.toString(),
                        label: course.name,
                    }))
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
                    response.data.map((semester) => ({
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

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("token="))
                    ?.split("=")[1];
                const response = await axios.get(`${API_URL}/assigned/subjects`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSubjects(
                    response.data.map((subject) => ({
                        value: subject.id.toString(),
                        label: subject.name,
                    }))
                );
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };

        fetchSubjects();
    }, []);

    const fetchAttendanceSheet = async () => {
        if (!selectedCourse || !selectedSemester || !selectedSubject || !selectedTimeSlot || !selectedDate) {
            alert("Please select all fields.");
            return;
        }

        setLoading(true);
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];
            const response = await axios.get(
                `${API_URL}/attendance-sheet?courseId=${selectedCourse}&semesterId=${selectedSemester}&subjectId=${selectedSubject}&slotId=${selectedTimeSlot}&date=${selectedDate.toISOString().split("T")[0]}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAttendanceData(response.data);
            setAttendanceStatus(
                response.data.reduce((acc, student) => {
                    acc[student.student_id] = "Not Marked";
                    return acc;
                }, {})
            );
        } catch (error) {
            console.error("Error fetching attendance sheet:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendanceStatus((prev) => ({
            ...prev,
            [studentId]: status,
        }));
    };

    const handleMarkAttendance = async () => {
        const payload = {
            subject_id: parseInt(selectedSubject),
            time_slot_id: parseInt(selectedTimeSlot),
            attendance: Object.entries(attendanceStatus)
                .filter(([_, status]) => status !== "Not Marked")
                .map(([studentId, status]) => ({
                    student_id: parseInt(studentId),
                    status: status,
                })),
        };

        setLoading(true);
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];
            await axios.post(`${API_URL}/attendance/bulk`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Attendance marked successfully!");
        } catch (error) {
            console.error("Error marking attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAllAs = (status) => {
        const newStatus = {};
        attendanceData.forEach((student) => {
            newStatus[student.student_id] = status;
        });
        setAttendanceStatus(newStatus);
    };

    return (
        <DatesProvider settings={{ timezone: "America/New_York" }}>
            <Box>
                <Group position="apart" mb="xl">
                    <Text size="xl" fw={700} c="primary.5">
                        Attendance Management
                    </Text>
                </Group>

                <Group mb="md" align="flex-end" spacing="md" grow>
                    <Select
                        label="Course"
                        placeholder="Select Course"
                        data={courses}
                        value={selectedCourse}
                        onChange={setSelectedCourse}
                        searchable
                        nothingFound="No courses found"
                    />
                    <Select
                        label="Semester"
                        placeholder="Select Semester"
                        data={semesters}
                        value={selectedSemester}
                        onChange={setSelectedSemester}
                        disabled={!selectedCourse}
                        searchable
                        nothingFound="No semesters found"
                    />
                    <Select
                        label="Subject"
                        placeholder="Select Subject"
                        data={subjects}
                        value={selectedSubject}
                        onChange={setSelectedSubject}
                        searchable
                        nothingFound="No subjects found"
                    />
                    <Select
                        label="Time Slot"
                        placeholder="Select Time Slot"
                        data={[
                            { value: "1", label: "Morning Slots" },
                            { value: "2", label: "Afternoon Slots" },
                        ]}
                        value={selectedTimeSlot}
                        onChange={setSelectedTimeSlot}
                    />
                    <DateTimePicker
                        label="Date"
                        placeholder="Pick a Date"
                        value={selectedDate}
                        onChange={setSelectedDate}
                        defaultValue={new Date("2000-10-03 02:10:00Z")}
                        clearable
                    />
                    <Button 
                        onClick={fetchAttendanceSheet} 
                        loading={loading} 
                        leftSection={<RiSearchLine size={16} />}
                        sx={{ alignSelf: "flex-end" }}
                    >
                        Fetch Attendance
                    </Button>
                </Group>

                {attendanceData.length > 0 && (
                    <Paper shadow="sm" radius="md" p="md" withBorder mt="md">
                        <Group position="apart" mb="md">
                            <Text fw={500}>Student Attendance ({attendanceData.length} students)</Text>
                            <Group>
                                <Button 
                                    variant="outline" 
                                    color="green" 
                                    compact 
                                    leftSection={<RiCheckLine size={16} />}
                                    onClick={() => markAllAs("Present")}
                                >
                                    Mark All Present
                                </Button>
                                <Button 
                                    variant="outline" 
                                    color="red" 
                                    compact 
                                    leftSection={<RiCloseLine size={16} />}
                                    onClick={() => markAllAs("Absent")}
                                >
                                    Mark All Absent
                                </Button>
                            </Group>
                        </Group>

                        <ScrollArea>
                            <Table striped highlightOnHover>
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Attendance Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.map((student) => (
                                        <tr key={student.student_id}>
                                            <td>{student.student_name}</td>
                                            <td>
                                                <Radio.Group
                                                    value={attendanceStatus[student.student_id]}
                                                    onChange={(value) => handleAttendanceChange(student.student_id, value)}
                                                >
                                                    <Group>
                                                        <Radio value="Present" label="Present" color="green" />
                                                        <Radio value="Absent" label="Absent" color="red" />
                                                    </Group>
                                                </Radio.Group>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </ScrollArea>

                        <Group position="right" mt="md">
                            <Button 
                                onClick={handleMarkAttendance} 
                                loading={loading}
                                color="blue"
                                leftSection={<RiCheckLine size={16} />}
                            >
                                Submit Attendance
                            </Button>
                        </Group>
                    </Paper>
                )}
            </Box>
        </DatesProvider>
    );
};

export default AttendanceSheet;