import { Box, Center, extendTheme, NativeBaseProvider } from "native-base";
import Home from "./shiksha-os/home";
import ClassDetails from "./shiksha-os/modules/classes/classDetails";
import StudentDetails from "./shiksha-os/modules/students/studentDetails";
import Classes from "./shiksha-os/modules/classes/classes";
import Attendance from "./modules/attendance/Attendance";
import ClassAttendance from "./modules/attendance/ClassAttendance";
import SubjectDetails from "./shiksha-os/modules/classes/subjectDetais";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import init from "./shiksha-os/lang/init";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./shiksha-os/Login";
import { useLayoutEffect, useState } from "react";
import manifest from "./shiksha-os/manifest.json";
import ClassReport from "./shiksha-os/modules/reports/ClassReport";
import ClassReportDetail from "./shiksha-os/modules/reports/ClassReportDetail";
import CompareReport from "./shiksha-os/modules/reports/CompareReport";
import SendSMS from "./shiksha-os/modules/sms/SendSMS";
import MessageHistory from "./shiksha-os/modules/sms/MessageHistory";

i18n.use(initReactI18next).init(init);

const maxWidth = manifest?.maxWidth ? manifest?.maxWidth : "414";
const fontFamily =
  localStorage.getItem("lang") === "hi" ? "'Baloo 2'" : "Inter";
const fontSize = localStorage.getItem("lang") === "hi" ? "20px" : "";

let red = {
  50: "rgba(245, 123, 123, 0.05)",
  100: "rgba(245, 123, 123, 0.20)",
  150: "rgba(245, 123, 123, 0.30)",
  200: "rgba(245, 123, 123, 0.40)",
  250: "rgba(245, 123, 123, 0.50)",
  300: "rgba(245, 123, 123, 0.60)",
  350: "rgba(245, 123, 123, 0.70)",
  400: "rgba(245, 123, 123, 0.80)",
  450: "rgba(245, 123, 123, 0.90)",
  500: "rgba(245, 123, 123, 1)",
  550: "rgba(245, 123, 123, 1.10)",
  600: "rgba(245, 123, 123, 1.20)",
  650: "rgba(245, 123, 123, 1.30)",
  700: "rgba(245, 123, 123, 1.40)",
  750: "rgba(245, 123, 123, 1.50)",
  800: "rgba(245, 123, 123, 1.60)",
  850: "rgba(245, 123, 123, 1.70)",
  900: "rgba(245, 123, 123, 1.80)",
  950: "rgba(245, 123, 123, 1.90)",
};

let green = {
  50: "rgba(13, 146, 27, 0.05)",
  100: "rgba(13, 146, 27, 0.20)",
  150: "rgba(13, 146, 27, 0.30)",
  200: "rgba(13, 146, 27, 0.40)",
  250: "rgba(13, 146, 27, 0.50)",
  300: "rgba(13, 146, 27, 0.60)",
  350: "rgba(13, 146, 27, 0.70)",
  400: "rgba(13, 146, 27, 0.80)",
  450: "rgba(13, 146, 27, 0.90)",
  500: "rgba(13, 146, 27, 1)",
  550: "rgba(13, 146, 27, 1.10)",
  600: "rgba(13, 146, 27, 1.20)",
  650: "rgba(13, 146, 27, 1.30)",
  700: "rgba(13, 146, 27, 1.40)",
  750: "rgba(13, 146, 27, 1.50)",
  800: "rgba(13, 146, 27, 1.60)",
  850: "rgba(13, 146, 27, 1.70)",
  900: "rgba(13, 146, 27, 1.80)",
  950: "rgba(13, 146, 27, 1.90)",
};

const theme = extendTheme({
  fonts: {
    heading: fontFamily,
    body: fontFamily,
    mono: fontFamily,
  },
  components: {
    Text: {
      baseStyle: {
        textTransform: "capitalize",
        fontFamily: fontFamily,
        fontSize: fontSize,
      },
    },
    Actionsheet: {
      baseStyle: {
        maxW: maxWidth,
        alignSelf: "center",
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
    attendanceCardText: {
      400: "#9C9EA0",
      500: "#373839",
    },
    reportCard: {
      500: "#FFCAAC",
    },
    present: green,
    presentCardBg: {
      500: "#DFFDE2",
      600: "#cae3ce",
    },
    presentCardCompareBg: {
      500: "#ECFBF2",
      600: "#cae3ce",
    },
    presentCardText: {
      500: "#07C71B",
    },
    presentCardCompareText: {
      500: "#FA8129",
    },
    absent: red,
    absentCardBg: {
      500: "#FDE7E7",
      600: "#dfcbcb",
    },
    absentCardCompareBg: {
      500: "#FFF6F6",
      600: "#dfcbcb",
    },
    absentCardText: red,
    absentCardCompareText: {
      500: "#FA8129",
    },
    weekCardCompareBg: {
      500: "#FFF8F7",
    },
    reportBoxBg: {
      400: "#FFF8F7",
      500: "#FEF1EE",
      600: "#ede7e6",
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
    attendanceAbsent: red,
    attendanceUnmarked: {
      600: "#C4C4D4",
      500: "#C4C4D4",
      400: "#d3d3e5",
      100: "#F0F0F4",
    },
    timeTableCardOrange: {
      500: "#FFF7F5",
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
          path="/students/sendSms/:studentId"
          element={
            <SubApp>
              <MessageHistory />
            </SubApp>
          }
        />
        <Route
          path="/subject/:classId"
          element={
            <SubApp>
              <SubjectDetails />
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

        <Route
          path="/classes/attendance/report"
          element={
            <SubApp>
              <ClassReport />
            </SubApp>
          }
        />
        <Route
          path="/classes/attendance/report/:classId"
          element={
            <SubApp>
              <ClassReportDetail />
            </SubApp>
          }
        />
        <Route
          path="/classes/attendance/reportCompare/:classId"
          element={
            <SubApp>
              <CompareReport />
            </SubApp>
          }
        />
        <Route
          path="/classes/attendance/sendSms/:classId"
          element={
            <SubApp>
              <SendSMS />
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
  const [width] = useWindowSize();

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
