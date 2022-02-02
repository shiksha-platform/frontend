import { Box, Center, extendTheme, NativeBaseProvider } from "native-base";
import Home from "./shiksha-os/home";
import ClassDetails from "./shiksha-os/modules/classes/classDetails";
import StudentDetails from "./shiksha-os/modules/students/studentDetails";
import Classes from "./shiksha-os/modules/classes/classes";
import Attendance from "./modules/attendance/Attendance";
import ClassAttendance from "./modules/attendance/ClassAttendance";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import init from "./shiksha-os/lang/init";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./shiksha-os/Login";
import { useLayoutEffect, useState } from "react";
import manifest from "./shiksha-os/manifest.json";
i18n.use(initReactI18next).init(init);

const theme = extendTheme({
  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: "Inter",
    body: "Inter",
    mono: "Inter",
  },
  components: {
    Text: {
      baseStyle: {
        textTransform: "capitalize",
        fontFamily: "Inter",
      },
    },
  },
  colors: {
    studentCard: {
      500: "#B9FBC0",
    },
    classCard: {
      500: "#D9F0FC",
    },
    attendanceCard: {
      500: "#C9AFF4",
    },
    button: {
      50: "#fcf1ee",
      100: "#fae2dd",
      200: "#f5c8bc",
      300: "#f2ab99",
      400: "#ee8e78",
      500: "#F87558",
      600: "#d9654c",
    },
    attendancePresent: {
      600: "#2BB639",
      500: "#2BB639",
    },
    attendanceAbsent: {
      600: "#F57B7B",
      500: "#F57B7B",
    },
    attendanceUnmarked: {
      600: "#C4C4D4",
      500: "#C4C4D4",
      100: "#F0F0F4",
    },
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

export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  const maxWidth = manifest?.maxWidth ? manifest?.maxWidth : "414";
  useLayoutEffect(() => {
    function updateSize() {
      setSize([
        window.outerWidth > maxWidth ? maxWidth : window.outerWidth,
        window.innerHeight,
      ]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

export function SubApp({ children }) {
  const [width, height] = useWindowSize();

  return (
    <NativeBaseProvider theme={theme}>
      <Center>
        <Box minH={window.outerHeight} w={width}>
          {children}
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}
