import AppBar from "./shiksha-os/menu";
import { Box, Center, extendTheme, NativeBaseProvider } from "native-base";
import Home from "./shiksha-os/home";
import ClassDetails from "./shiksha-os/modules/classes/classDetails";
import StudentDetails from "./shiksha-os/modules/students/studentDetails";
import StudentEdit from "./shiksha-os/modules/students/studentEdit";
import Classes from "./shiksha-os/modules/classes/classes";
import Attendance from "./modules/attendance/Attendance";
import ClassAttendance from "./modules/attendance/ClassAttendance";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import init from "./shiksha-os/lang/init";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./shiksha-os/Login";
i18n.use(initReactI18next).init(init);

const theme = extendTheme({
  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: "Inter",
    body: "Inter",
    mono: "Inter",
  },
});

function NotFound() {
  const { t } = useTranslation();
  return (
    <SubApp title={t("404")}>
      <Center flex={1} px="3">
        <Center>
          <h1>404</h1>
        </Center>
      </Center>
    </SubApp>
  );
}

export default function App() {
  const { t } = useTranslation();
  const token = sessionStorage.getItem("token");
  if (!token) {
    return (
      <Router>
        <Routes>
          <Route
            path="*"
            element={
              <SubApp>
                <Login />
              </SubApp>
            }
          />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <SubApp>
              <Home />
            </SubApp>
          }
        />
        <Route
          path="/classes"
          element={
            <SubApp>
              <Classes />
            </SubApp>
          }
        />
        <Route
          path="/classes/:classId"
          element={
            <SubApp>
              <ClassDetails />
            </SubApp>
          }
        />
        <Route
          path="/students/class/:classId"
          element={
            <SubApp>
              <ClassDetails />
            </SubApp>
          }
        />
        <Route
          path="/students/:studentId"
          element={
            <SubApp>
              <StudentDetails />
            </SubApp>
          }
        />
        <Route
          path="/students/:studentId/edit"
          element={
            <SubApp>
              <StudentEdit />
            </SubApp>
          }
        />
        <Route
          path="/attendance/:classId"
          element={
            <SubApp>
              <Attendance />
            </SubApp>
          }
        />
        <Route
          path="/classes/attendance/group"
          element={
            <SubApp>
              <ClassAttendance />
            </SubApp>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export function SubApp({ children }) {
  return (
    <NativeBaseProvider theme={theme}>
      <Box minH={window.outerHeight}>{children}</Box>
    </NativeBaseProvider>
  );
}
