import { Box, Center, extendTheme, NativeBaseProvider } from "native-base";
import Home from "./shiksha-os/home";
import ClassDetails from "./shiksha-os/modules/classes/classDetails";
import StudentDetails from "./shiksha-os/modules/students/studentDetails";
import Student from "./shiksha-os/modules/students/student";
import Classes from "./shiksha-os/modules/classes/classes";
import Attendance from "./modules/attendance/Attendance";
import ClassAttendance from "./modules/attendance/ClassAttendance";
import SubjectDetails from "./shiksha-os/modules/classes/subjectDetais";
import Profile from "./shiksha-os/modules/teachers/Profile";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import init from "./shiksha-os/lang/init";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./shiksha-os/Login";
import ClassReport from "./shiksha-os/modules/reports/ClassReport";
import ClassReportDetail from "./shiksha-os/modules/reports/ClassReportDetail";
import CompareReport from "./shiksha-os/modules/reports/CompareReport";
import SendSMS from "./shiksha-os/modules/sms/SendSMS";
import MessageHistory from "./shiksha-os/modules/sms/MessageHistory";
import TeacherAttendance from "./shiksha-os/modules/teachers/Attendance";
import { useWindowSize, maxWidth } from "./components/helper";

i18n.use(initReactI18next).init(init);

const fontFamily =
  localStorage.getItem("lang") === "hi" ? "'Baloo 2'" : "Inter";
const fontSize = localStorage.getItem("lang") === "hi" ? "20px" : "";

let red = {
  50: "#fef2f2",
  100: "#fde5e5",
  150: "#fcd7d7",
  200: "#fbcaca",
  250: "#fabdbd",
  300: "#f9b0b0",
  350: "#f8a3a3",
  400: "#f79595",
  450: "#f68888",
  500: "#f57b7b",
  550: "#dd6f6f",
  600: "#c46262",
  650: "#ac5656",
  700: "#934a4a",
  750: "#7b3e3e",
  800: "#623131",
  850: "#492525",
  900: "#311919",
  950: "#180c0c",
};

let green = {
  50: "#e7f4e8",
  100: "#cfe9d1",
  150: "#b6debb",
  200: "#9ed3a4",
  250: "#86c98d",
  300: "#6ebe76",
  350: "#56b35f",
  400: "#3da849",
  450: "#259d32",
  500: "#0d921b",
  550: "#0c8318",
  600: "#0a7516",
  650: "#096613",
  700: "#085810",
  750: "#07490e",
  800: "#053a0b",
  850: "#042c08",
  900: "#031d05",
  950: "#010f03",
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
    Button: {
      baseStyle: {
        rounded: "lg",
      },
      defaultProps: {
        colorScheme: "button",
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
      400: "#CEEED1",
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
    special_duty: { 500: "#06D6A0" },
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
      100: "#F0F0F4",
      300: "#B5B5C8",
      400: "#d3d3e5",
      500: "#C4C4D4",
      600: "#C4C4D4",
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
  const token = localStorage.getItem("token");
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
          path="/profile"
          element={
            <SubApp>
              <Profile />
            </SubApp>
          }
        />
        <Route
          path="/profile/attendance"
          element={
            <SubApp>
              <TeacherAttendance />
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
          path="/class/students/:classId"
          element={
            <SubApp>
              <Student />
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
          path="/students/class/:classId"
          element={
            <SubApp>
              <ClassDetails />
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
          path="/classes/attendance/report/:classId/:view"
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

export function SubApp({ children }) {
  const [width, Height] = useWindowSize();
  return (
    <NativeBaseProvider theme={theme}>
      <Center>
        <Box minH={Height} w={width}>
          {children}
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}
