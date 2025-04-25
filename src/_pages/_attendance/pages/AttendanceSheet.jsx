// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Text,
//     Group,
//     Select,
//     Button,
//     Checkbox,
//     Table,
//     Stack,
//     Paper,
//     Container,
//     Title,
//     Radio,
//     Card,
//     ScrollArea,
// } from "@mantine/core";
// import { DatesProvider, DateTimePicker } from "@mantine/dates";
// import axios from "axios";
// import { API_URL } from "../../../../utils/Constant";
// import { RiCalendarLine, RiCheckLine, RiSearchLine, RiCloseLine } from "react-icons/ri";

// const AttendanceSheet = () => {
//     const [courses, setCourses] = useState([]);
//     const [semesters, setSemesters] = useState([]);
//     const [subjects, setSubjects] = useState([]);
//     const [timeSlots, setTimeSlots] = useState([]);
//     const [attendanceData, setAttendanceData] = useState([]);
//     const [selectedCourse, setSelectedCourse] = useState(null);
//     const [selectedSemester, setSelectedSemester] = useState(null);
//     const [selectedSubject, setSelectedSubject] = useState(null);
//     const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [attendanceStatus, setAttendanceStatus] = useState({});
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const fetchCourses = async () => {
//             try {
//                 const token = document.cookie
//                     .split("; ")
//                     .find((row) => row.startsWith("token="))
//                     ?.split("=")[1];
//                 const response = await axios.get(`${API_URL}/courses`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setCourses(
//                     response.data.map((course) => ({
//                         value: course.id.toString(),
//                         label: course.name,
//                     }))
//                 );
//             } catch (error) {
//                 console.error("Error fetching courses:", error);
//             }
//         };

//         fetchCourses();
//     }, []);

//     useEffect(() => {
//         const fetchSemesters = async () => {
//             if (!selectedCourse) return;
//             try {
//                 const token = document.cookie
//                     .split("; ")
//                     .find((row) => row.startsWith("token="))
//                     ?.split("=")[1];
//                 const response = await axios.get(`${API_URL}/semesters?courseId=${selectedCourse}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setSemesters(
//                     response.data.map((semester) => ({
//                         value: semester.id.toString(),
//                         label: semester.sem_name,
//                     }))
//                 );
//             } catch (error) {
//                 console.error("Error fetching semesters:", error);
//             }
//         };

//         fetchSemesters();
//     }, [selectedCourse]);

//     useEffect(() => {
//         const fetchSubjects = async () => {
//             try {
//                 const token = document.cookie
//                     .split("; ")
//                     .find((row) => row.startsWith("token="))
//                     ?.split("=")[1];
//                 const response = await axios.get(`${API_URL}/assigned/subjects`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setSubjects(
//                     response.data.map((subject) => ({
//                         value: subject.id.toString(),
//                         label: subject.name,
//                     }))
//                 );
//             } catch (error) {
//                 console.error("Error fetching subjects:", error);
//             }
//         };

//         fetchSubjects();
//     }, []);

//     const fetchAttendanceSheet = async () => {
//         if (!selectedCourse || !selectedSemester || !selectedSubject || !selectedTimeSlot || !selectedDate) {
//             alert("Please select all fields.");
//             return;
//         }

//         setLoading(true);
//         try {
//             const token = document.cookie
//                 .split("; ")
//                 .find((row) => row.startsWith("token="))
//                 ?.split("=")[1];
//             const response = await axios.get(
//                 `${API_URL}/attendance-sheet?courseId=${selectedCourse}&semesterId=${selectedSemester}&subjectId=${selectedSubject}&slotId=${selectedTimeSlot}&date=${selectedDate.toISOString().split("T")[0]}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             setAttendanceData(response.data);
//             setAttendanceStatus(
//                 response.data.reduce((acc, student) => {
//                     acc[student.student_id] = "Not Marked";
//                     return acc;
//                 }, {})
//             );
//         } catch (error) {
//             console.error("Error fetching attendance sheet:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAttendanceChange = (studentId, status) => {
//         setAttendanceStatus((prev) => ({
//             ...prev,
//             [studentId]: status,
//         }));
//     };

//     const handleMarkAttendance = async () => {
//         const payload = {
//             subject_id: parseInt(selectedSubject),
//             time_slot_id: parseInt(selectedTimeSlot),
//             attendance: Object.entries(attendanceStatus)
//                 .filter(([_, status]) => status !== "Not Marked")
//                 .map(([studentId, status]) => ({
//                     student_id: parseInt(studentId),
//                     status: status,
//                 })),
//         };

//         setLoading(true);
//         try {
//             const token = document.cookie
//                 .split("; ")
//                 .find((row) => row.startsWith("token="))
//                 ?.split("=")[1];
//             await axios.post(`${API_URL}/attendance/bulk`, payload, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             alert("Attendance marked successfully!");
//         } catch (error) {
//             console.error("Error marking attendance:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const markAllAs = (status) => {
//         const newStatus = {};
//         attendanceData.forEach((student) => {
//             newStatus[student.student_id] = status;
//         });
//         setAttendanceStatus(newStatus);
//     };

//     return (
//         <DatesProvider settings={{ timezone: "America/New_York" }}>
//             <Box>
//                 <Group position="apart" mb="xl">
//                     <Text size="xl" fw={700} c="primary.5">
//                         Attendance Management
//                     </Text>
//                 </Group>

//                 <Group mb="md" align="flex-end" spacing="md" grow>
//                     <Select
//                         label="Course"
//                         placeholder="Select Course"
//                         data={courses}
//                         value={selectedCourse}
//                         onChange={setSelectedCourse}
//                         searchable
//                         nothingFound="No courses found"
//                     />
//                     <Select
//                         label="Semester"
//                         placeholder="Select Semester"
//                         data={semesters}
//                         value={selectedSemester}
//                         onChange={setSelectedSemester}
//                         disabled={!selectedCourse}
//                         searchable
//                         nothingFound="No semesters found"
//                     />
//                     <Select
//                         label="Subject"
//                         placeholder="Select Subject"
//                         data={subjects}
//                         value={selectedSubject}
//                         onChange={setSelectedSubject}
//                         searchable
//                         nothingFound="No subjects found"
//                     />
//                     <Select
//                         label="Time Slot"
//                         placeholder="Select Time Slot"
//                         data={[
//                             { value: "1", label: "Morning Slots" },
//                             { value: "2", label: "Afternoon Slots" },
//                         ]}
//                         value={selectedTimeSlot}
//                         onChange={setSelectedTimeSlot}
//                     />
//                     <DateTimePicker
//                         label="Date"
//                         placeholder="Pick a Date"
//                         value={selectedDate}
//                         onChange={setSelectedDate}
//                         defaultValue={new Date("2000-10-03 02:10:00Z")}
//                         clearable
//                     />
//                     <Button 
//                         onClick={fetchAttendanceSheet} 
//                         loading={loading} 
//                         leftSection={<RiSearchLine size={16} />}
//                         sx={{ alignSelf: "flex-end" }}
//                     >
//                         Fetch Attendance
//                     </Button>
//                 </Group>

//                 {attendanceData.length > 0 && (
//                     <Paper shadow="sm" radius="md" p="md" withBorder mt="md">
//                         <Group position="apart" mb="md">
//                             <Text fw={500}>Student Attendance ({attendanceData.length} students)</Text>
//                             <Group>
//                                 <Button 
//                                     variant="outline" 
//                                     color="green" 
//                                     compact 
//                                     leftSection={<RiCheckLine size={16} />}
//                                     onClick={() => markAllAs("Present")}
//                                 >
//                                     Mark All Present
//                                 </Button>
//                                 <Button 
//                                     variant="outline" 
//                                     color="red" 
//                                     compact 
//                                     leftSection={<RiCloseLine size={16} />}
//                                     onClick={() => markAllAs("Absent")}
//                                 >
//                                     Mark All Absent
//                                 </Button>
//                             </Group>
//                         </Group>

//                         <ScrollArea>
//                             <Table striped highlightOnHover>
//                                 <thead>
//                                     <tr>
//                                         <th>Student Name</th>
//                                         <th>Attendance Status</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {attendanceData.map((student) => (
//                                         <tr key={student.student_id}>
//                                             <td>{student.student_name}</td>
//                                             <td>
//                                                 {student.attendance_status === "Present" || student.attendance_status === "Absent" ? (
//                                                     <Text>{student.attendance_status}</Text>
//                                                 ) : (
//                                                     <Radio.Group
//                                                         value={attendanceStatus[student.student_id]}
//                                                         onChange={(value) => handleAttendanceChange(student.student_id, value)}
//                                                     >
//                                                         <Group>
//                                                             <Radio value="Present" label="Present" color="green" />
//                                                             <Radio value="Absent" label="Absent" color="red" />
//                                                         </Group>
//                                                     </Radio.Group>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </Table>
//                         </ScrollArea>

//                         <Group position="right" mt="md">
//                             <Button 
//                                 onClick={handleMarkAttendance} 
//                                 loading={loading}
//                                 color="blue"
//                                 leftSection={<RiCheckLine size={16} />}
//                             >
//                                 Submit Attendance
//                             </Button>
//                         </Group>
//                     </Paper>
//                 )}
//             </Box>
//         </DatesProvider>
//     );
// };

// export default AttendanceSheet;

import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Group,
  Select,
  Button,
  Table,
  Paper,
  ScrollArea,
  Divider,
  Title,
  Radio,
  Badge,
  Tooltip,
  ActionIcon,
  Flex,
  Card,
  Transition,
  Loader,
} from "@mantine/core";
import { DatesProvider, DateTimePicker } from "@mantine/dates";
import axios from "axios";
import { API_URL } from "../../../../utils/Constant";
import {
  RiCalendarLine,
  RiCheckLine,
  RiSearchLine,
  RiUserLine,
  RiBookLine,
  RiTimeLine,
  RiBookmarkLine,
  RiFileList3Line,
  RiRefreshLine,
  RiCloseCircleLine,
  RiUserSearchLine,
  RiListCheck,
  RiCheckboxCircleLine 
} from "react-icons/ri";

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
  const [showAttendance, setShowAttendance] = useState(false);

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
      setShowAttendance(true);
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

const getAttendanceStats = () => {
    const total = attendanceData.length;
    const present = attendanceData.filter(student => student.attendance_status === "Present").length;
    const absent = attendanceData.filter(student => student.attendance_status === "Absent").length;
    const notMarked = total - present - absent;

    return { total, present, absent, notMarked };
};

  return (
    <DatesProvider settings={{ timezone: "America/New_York" }}>
      <Box>
        <Group position="apart" mb="lg">
          <Group>
            <RiListCheck size={28} color="#4263eb" />
            <Title order={3} color="primary">Attendance Management</Title>
          </Group>
        </Group>

        <Card shadow="sm" withBorder p="md" radius="md" mb="lg">
          <Card.Section withBorder py="xs" px="md" bg="blue.0">
            <Group position="left">
              <RiFileList3Line size={18} />
              <Text weight={600}>Filter Attendance Records</Text>
            </Group>
          </Card.Section>
          
          <Box pt="md">
            <Group align="flex-end" spacing="md" grow>
              <Select
                label="Course"
                placeholder="Select Course"
                data={courses}
                value={selectedCourse}
                onChange={setSelectedCourse}
                searchable
                nothingFound="No courses found"
                icon={<RiBookmarkLine size={16} />}
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
                icon={<RiBookLine size={16} />}
              />
              <Select
                label="Subject"
                placeholder="Select Subject"
                data={subjects}
                value={selectedSubject}
                onChange={setSelectedSubject}
                searchable
                nothingFound="No subjects found"
                icon={<RiBookmarkLine size={16} />}
              />
            </Group>
            
            <Group align="flex-end" spacing="md" grow mt="md">
              <Select
                label="Time Slot"
                placeholder="Select Time Slot"
                data={[
                  { value: "1", label: "Morning Slots" },
                  { value: "2", label: "Afternoon Slots" },
                ]}
                value={selectedTimeSlot}
                onChange={setSelectedTimeSlot}
                icon={<RiTimeLine size={16} />}
              />
              <DateTimePicker
                label="Date"
                placeholder="Pick a Date"
                value={selectedDate}
                onChange={setSelectedDate}
                clearable
                icon={<RiCalendarLine size={16} />}
              />
              <Button
                onClick={fetchAttendanceSheet}
                loading={loading}
                leftSection={<RiSearchLine size={16} />}
                sx={{ alignSelf: "flex-end" }}
                fullWidth
              >
                Fetch Attendance
              </Button>
            </Group>
          </Box>
        </Card>

        {loading && (
          <Flex justify="center" align="center" direction="column" p="xl">
            <Loader size="md" variant="dots" />
            <Text mt="md" color="dimmed">Loading attendance data...</Text>
          </Flex>
        )}

        {showAttendance && attendanceData.length > 0 && !loading && (
          <Transition mounted={showAttendance} transition="fade" duration={400} timingFunction="ease">
            {(styles) => (
              <Paper shadow="md" radius="md" withBorder style={styles}>
                <Box p="md">
                  <Group position="apart" mb="md">
                    <Group>
                      <RiUserSearchLine size={20} color="#4263eb" />
                      <Text weight={600} size="lg">Student Attendance</Text>
                    </Group>
                    
                    <Group>
                      {getAttendanceStats().total > 0 && (
                        <Group spacing="xs">
                          <Badge color="blue" size="lg" radius="sm">
                            Total: {getAttendanceStats().total}
                          </Badge>
                          <Badge color="green" size="lg" radius="sm">
                            Present: {getAttendanceStats().present}
                          </Badge>
                          <Badge color="red" size="lg" radius="sm">
                            Absent: {getAttendanceStats().absent}
                          </Badge>
                          <Badge color="gray" size="lg" radius="sm">
                            Not Marked: {getAttendanceStats().notMarked}
                          </Badge>
                        </Group>
                      )}
                    </Group>
                  </Group>
                  
                  <Divider mb="md" />
                  
                  <Group position="apart" mb="md">
                    <Text size="sm" color="dimmed">
                      Select attendance status for each student or use bulk actions
                    </Text>
                    <Group>
                      <Tooltip label="Mark All Present">
                        <Button
                          variant="light"
                          color="green"
                          compact
                          leftSection={<RiCheckboxCircleLine size={16} />}
                          onClick={() => markAllAs("Present")}
                        >
                          Mark All Present
                        </Button>
                      </Tooltip>
                      <Tooltip label="Mark All Absent">
                        <Button
                          variant="light"
                          color="red"
                          compact
                          leftSection={<RiCloseCircleLine size={16} />}
                          onClick={() => markAllAs("Absent")}
                        >
                          Mark All Absent
                        </Button>
                      </Tooltip>
                    </Group>
                  </Group>

                  <Paper withBorder radius="md">
                    <ScrollArea h={350}>
                      <Table striped highlightOnHover>
                        <thead>
                          <tr>
                            <th style={{ width: "10%" }}>#</th>
                            <th style={{ width: "50%" }}>
                              <Group spacing="xs">
                                <RiUserLine size={16} />
                                <Text>Student Name</Text>
                              </Group>
                            </th>
                            <th style={{ width: "40%" }}>
                              <Group spacing="xs">
                                <RiCheckLine size={16} />
                                <Text>Attendance Status</Text>
                              </Group>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceData.map((student, index) => (
                            <tr key={student.student_id}>
                              <td>{index + 1}</td>
                              <td>
                                <Group>
                                  <RiUserLine size={16} color="#4263eb" />
                                  <Text>{student.student_name}</Text>
                                </Group>
                              </td>
                              <td>
                                {student.attendance_status === "Present" || 
                                student.attendance_status === "Absent" ? (
                                  <Badge 
                                    color={student.attendance_status === "Present" ? "green" : "red"}
                                    variant="light"
                                    size="lg"
                                  >
                                    {student.attendance_status}
                                  </Badge>
                                ) : (
                                  <Radio.Group
                                    value={attendanceStatus[student.student_id]}
                                    onChange={(value) => handleAttendanceChange(student.student_id, value)}
                                  >
                                    <Group>
                                      <Radio 
                                        value="Present" 
                                        label="Present" 
                                        color="green" 
                                        icon={RiCheckboxCircleLine}
                                      />
                                      <Radio 
                                        value="Absent" 
                                        label="Absent" 
                                        color="red" 
                                        icon={RiCloseCircleLine}
                                      />
                                    </Group>
                                  </Radio.Group>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </ScrollArea>
                  </Paper>

                  <Group position="right" mt="lg">
                    <Button
                      onClick={() => setShowAttendance(false)}
                      variant="subtle"
                      leftSection={<RiRefreshLine size={16} />}
                    >
                      Reset Form
                    </Button>
                    <Button
                      onClick={handleMarkAttendance}
                      loading={loading}
                      color="blue"
                      leftSection={<RiCheckLine size={16} />}
                    >
                      Submit Attendance
                    </Button>
                  </Group>
                </Box>
              </Paper>
            )}
          </Transition>
        )}
      </Box>
    </DatesProvider>
  );
};

export default AttendanceSheet;