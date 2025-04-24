import { lazy } from "react";
const TeacherIndex = lazy(() => import("../_pages/_teacher/Index"));
const TeacherAdd = lazy(() => import("../_pages/_teacher/pages/TeacherAdd"));
const TeacherList = lazy(() => import("../_pages/_teacher/pages/TeacherList"));
const CourseIndex = lazy(() => import("../_pages/_course/Index"));
const CourseAdd = lazy(() => import("../_pages/_course/pages/AddCourse"));
const CourseList = lazy(() => import("../_pages/_course/pages/GetCourse"));
const StudentIndex = lazy(() => import("../_pages/_student/Index"));
const StudentAdd = lazy(() => import("../_pages/_student/pages/StudentAdd"));
const StudentList = lazy(() => import("../_pages/_student/pages/StudentList"));
const StudentUpgrade = lazy(() => import("../_pages/_student/pages/StudentUpgrade"));
const SemesterIndex = lazy(() => import("../_pages/_semester/Index"));
const SemesterAdd = lazy(() => import("../_pages/_semester/pages/SemesterAdd"));
const SemesterList = lazy(() => import("../_pages/_semester/pages/SemesterList"));
const SubjectIndex = lazy(() => import("../_pages/_subject/Index"));
const SubjectAdd = lazy(() => import("../_pages/_subject/pages/SubjectAdd"));
const SubjectList = lazy(() => import("../_pages/_subject/pages/SubjectList"));
const SlotIndex = lazy(() => import("../_pages/_timeslot/Index"));
const SlotAdd = lazy(() => import("../_pages/_timeslot/pages/SlotAdd"));
const SlotList = lazy(() => import("../_pages/_timeslot/pages/SlotList"));
const AttendanceIndex = lazy(() => import("../_pages/_attendance/Index"));
const AttendanceSheet = lazy(() => import("../_pages/_attendance/pages/AttendanceSheet"));

export const FindRoute = (path) => {
  // Helper function to format route object
  const formatRoute = (route) => {
    if (!route) return null;
    const { element, path, name, icon, children } = route;
    return {
      path,
      name,
      icon,
      children: children
        ? children.map((child) => ({
            path: child.path,
            name: child.name,
          }))
        : undefined,
    };
  };

  // Find top-level route
  let route = RouterData.find((route) => route.path === path);
  if (!route) {
    // Search through children of each route
    for (let i = 0; i < RouterData.length; i++) {
      const childRoute = RouterData[i].children?.find(
        (child) => child.path === path
      );
      if (childRoute) {
        // Return the parent route if a child is matched, to include its metadata
        route = RouterData[i];
        break;
      }
    }
  }

  return formatRoute(route);
};

const RouterData = [
  {
    path: "/teacher",
    name: "Teacher",
    icon: "/assets/teacher.png",
    element: <TeacherIndex />,
    children: [
      {
        path: "/teacher/add",
        name: "Add Teacher",
        element: <TeacherAdd />,
      },
      {
        path: "/teacher/list",
        name: "List Teacher",
        element: <TeacherList />,
      },
    ],
  },
  {
    path: "/course",
    name: "Course",
    icon: "/assets/certificate.png",
    element: <CourseIndex />,
    children: [
      {
        path: "/course/add",
        name: "Add Course",
        element: <CourseAdd />,
      },
      {
        path: "/course/list",
        name: "List Course",
        element: <CourseList />,
      }
    ],
  },
  {
    path: "/students",
    name: "Students",
    icon: "/assets/graduates.png",
    element: <StudentIndex />,
    children: [
      {
        path: "/students/add",
        name: "Add Students",
        element: <StudentAdd />,
      },
      {
        path: "/students/list",
        name: "List Students",
        element: <StudentList />,
      },
      {
        path: "/students/upgrade",
        name: "Upgrade Students",
        element: <StudentUpgrade />,
      },
    ],
  },
  {
    path: "/semesters",
    name: "Semester",
    icon: "/assets/semester.png",
    element: <SemesterIndex />,
    children: [
      {
        path: "/semesters/add",
        name: "Add Semester",
        element: <SemesterAdd />,
      },
      {
        path: "/semesters/list",
        name: "List Semester",
        element: <SemesterList />,
      },
    ],
  },
  {
    path: "/subjects",
    name: "Subjects",
    icon: "/assets/elearning.png",
    element: <SubjectIndex />,
    children: [
      {
        path: "/subjects/add",
        name: "Add Subjects",
        element: <SubjectAdd />,
      },
      {
        path: "/subjects/list",
        name: "List Subjects",
        element: <SubjectList />,
      },
    ],
  },
  {
    path: "/slots",
    name: "Slots",
    icon: "/assets/timetable.png",
    element: <SlotIndex />,
    children: [
      {
        path: "/slots/add",
        name: "Add Slots",
        element: <SlotAdd />,
      },
      {
        path: "/slots/list",
        name: "List Slots",
        element: <SlotList />,
      },
    ],
  },
  {
    path: "/attendance",
    name: "Attendance",
    icon: "/assets/attendance.png",
    element: <AttendanceIndex />,
    children: [
      {
        path: "/attendance/sheet",
        name: "Add Attendance",
        element: <AttendanceSheet />,
      }
    ],
  }
];

export default RouterData;
