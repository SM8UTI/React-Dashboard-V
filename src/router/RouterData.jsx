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
    ],
  },
];

export default RouterData;
