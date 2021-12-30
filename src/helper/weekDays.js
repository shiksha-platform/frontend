import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import CircleIcon from "@mui/icons-material/Circle";
import { IconButton, VStack, Text } from "native-base";
import * as attendanceServiceRegistry from "../services/attendanceServiceRegistry";
import manifest from "../modules/attendance/manifest.json";

export function weekDaysPageWise(weekPage) {
  let date = new Date();
  date.setDate(date.getDate() - weekPage * 7);
  return weekDates({ only: manifest.weekDays }, date);
}

export const weekDates = (filter = {}, current = new Date()) => {
  var week = [];
  function getIntday(data = [], type = "except") {
    let weekName = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let shortWeekName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let resultWeek = weekName.reduce(function (a, e, i) {
      if (
        (type === "except" && !data.includes(e)) ||
        (type === "only" && data.includes(e))
      )
        a.push(i);
      return a;
    }, []);
    let resultShort = shortWeekName.reduce(function (a, e, i) {
      if (
        (type === "except" && !data.includes(e)) ||
        (type === "only" && data.includes(e))
      )
        a.push(i);
      return a;
    }, []);
    if (
      type === "except" &&
      resultWeek &&
      resultWeek.length > 0 &&
      resultShort &&
      resultShort.length > 0
    ) {
      return resultWeek.filter((e) => resultShort.includes(e));
    } else if (
      type === "only" &&
      resultWeek &&
      resultWeek.length > 0 &&
      resultShort &&
      resultShort.length > 0
    ) {
      return resultWeek.concat(resultShort);
    } else if (resultWeek && resultWeek.length > 0) {
      return resultWeek;
    } else if (resultShort && resultShort.length > 0) {
      return resultShort;
    }
  }
  // Starting Monday not Sunday
  let weekInt = [];
  const only = filter.only;
  const except = filter.except;

  if (only) {
    weekInt = getIntday(only, "only");
  } else if (except) {
    weekInt = getIntday(except, "except");
  } else {
    weekInt = getIntday();
  }
  current.setDate(current.getDate() - current.getDay());

  for (var i = 0; i < 7; i++) {
    if (weekInt.includes(current.getDay())) {
      week.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
    // console.log("current", current, "week", weekInt, current.getDay());
  }
  return week;
};

const AttendanceComponent = ({ weekPage, student, withDate }) => {
  const todayDate = new Date();
  const teacherId = sessionStorage.getItem("id");
  const [attendance, setAttendance] = useState([]);
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    setWeekDays(weekDaysPageWise(weekPage));
    getAttendance();
  }, [weekPage]);

  const getAttendance = async () => {
    setAttendance(
      await attendanceServiceRegistry.getAll({
        filters: {
          classId: {
            eq: student.currentClassID,
          },
          teacherId: {
            eq: teacherId,
          },
        },
      })
    );
  };

  const markAttendance = async (e, data) => {
    attendanceServiceRegistry
      .create({
        studentId: data.id,
        date: data.date,
        attendance: data.attendance,
        attendanceNote: "Test",
        classId: student.currentClassID,
        subjectId: "History",
        teacherId: teacherId,
      })
      .then((e) => {
        setTimeout(getAttendance, 900);
      });
  };

  return weekDays.map((e, subIndex) => {
    let dateValue =
      e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate();
    let attendanceItem = attendance
      .slice()
      .reverse()
      .find((e) => e.date === dateValue && e.studentId === student.id);
    let iconColor = "gray.400";
    let circleIcon = <CircleIcon />;
    let attendanceType = "Present";
    if (
      typeof attendanceItem?.attendance !== "undefined" &&
      attendanceItem?.attendance === "Present"
    ) {
      iconColor = "green.600";
      circleIcon = <CheckCircleIcon />;
      attendanceType = "Absent";
    } else if (
      typeof attendanceItem?.attendance !== "undefined" &&
      attendanceItem?.attendance === "Absent"
    ) {
      iconColor = "danger.600";
      circleIcon = <HdrAutoIcon />;
      attendanceType = "Present";
    }
    if (e > todayDate) {
      iconColor = "gray.100";
    }
    return (
      <div key={subIndex}>
        <VStack
          alignItems="center"
          bgColor={e.getDate() === todayDate.getDate() ? "white" : ""}
        >
          {withDate ? (
            <Text
              key={subIndex}
              py={1}
              color={e.getDate() === todayDate.getDate() ? "primary.500" : ""}
            >
              {e.getDate()}
            </Text>
          ) : (
            <></>
          )}
          <IconButton
            onPress={(current) => {
              if (e.getDate() === todayDate.getDate()) {
                markAttendance(current, {
                  date: dateValue,
                  attendance: attendanceType,
                  id: student.id,
                });
              }
            }}
            size="sm"
            py="3"
            color={iconColor}
            icon={circleIcon}
          />
        </VStack>
      </div>
    );
  });
};

export default AttendanceComponent;
