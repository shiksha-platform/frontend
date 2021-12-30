import AppBar from "./shiksha-os/menu";
import { Center, NativeBaseProvider } from "native-base";
import Home from "./shiksha-os/home";
import Students from "./shiksha-os/modules/students/student";
import StudentDetails from "./shiksha-os/modules/students/studentDetails";
import Classes from "./shiksha-os/modules/classes/classes";
import ClassDetails from "./shiksha-os/modules/classes/classDetails";
import Attendance from "./modules/attendance/attendance";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import init from "./shiksha-os/lang/init";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./shiksha-os/Login";
i18n.use(initReactI18next).init(init);

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
              <SubApp title={t("MY_SCHOOL_APP")}>
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
            <SubApp title={t("MY_SCHOOL_APP")}>
              <Home />
            </SubApp>
          }
        />
        <Route
          path="/classes"
          element={
            <SubApp title={t("MY_CLASSES")}>
              <Classes />
            </SubApp>
          }
        />
        <Route
          path="/classes/:classId"
          element={
            <SubApp title={t("MY_CLASSES")}>
              <ClassDetails />
            </SubApp>
          }
        />
        <Route
          path="/students/class/:classId"
          element={
            <SubApp title={t("MY_STUDENTS")}>
              <Students />
            </SubApp>
          }
        />
        <Route
          path="/students/:studentId"
          element={
            <SubApp title={t("Students detail")}>
              <StudentDetails />
            </SubApp>
          }
        />
        <Route
          path="/attendance/:classId"
          element={
            <SubApp title={t("ATTENDANCE_SHEET")}>
              <Attendance />
            </SubApp>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export function SubApp({ children, title }) {
  return (
    <NativeBaseProvider>
      <AppBar title={title} />
      {children}
    </NativeBaseProvider>
  );
}
