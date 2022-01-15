import React, { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import CircleIcon from "@mui/icons-material/Circle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  IconButton,
  VStack,
  Text,
  HStack,
  Box,
  Pressable,
  Actionsheet,
} from "native-base";
import * as attendanceServiceRegistry from "../../services/attendanceServiceRegistry";
import manifest from "../../modules/attendance/manifest.json";
import { useTranslation } from "react-i18next";
import { TouchableHighlight } from "react-native-web";
import CircularProgress from "@mui/material/CircularProgress";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import moment from "moment";
import Card from "../students/Card";
import { CircleOutlined } from "@mui/icons-material";

export function weekDaysPageWise(weekPage) {
  let date = new Date();
  date.setDate(date.getDate() + weekPage * 7);
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

export const GetAttendance = async (filters) => {
  return await attendanceServiceRegistry.getAll({
    filters: filters,
  });
};

export const GetIcon = ({ status, _box, color }) => {
  let icon = <></>;
  switch (status) {
    case "Present":
      icon = (
        <Box py="2" {..._box} color={color ? color : "green.600"}>
          <CheckCircleIcon fontSize="large" />
        </Box>
      );
      break;
    case "Absent":
      icon = (
        <Box py="2" {..._box} color={color ? color : "danger.600"}>
          <HdrAutoIcon fontSize="large" />
        </Box>
      );
      break;
    case "Late":
      icon = (
        <Box py="2" {..._box} color={color ? color : "yellow.600"}>
          <WatchLaterIcon fontSize="large" />
        </Box>
      );
      break;
    case "Today":
      icon = (
        <Box py="2" {..._box} color={color ? color : "gray.400"}>
          <CircleOutlined fontSize="large" />
        </Box>
      );
      break;
    default:
      icon = (
        <Box py="2" {..._box} color={color ? color : "gray.400"}>
          <CircleIcon fontSize="large" />
        </Box>
      );
      break;
  }
  return icon;
};

const AttendanceComponent = ({
  weekPage,
  student,
  withDate,
  attendanceProp,
  hidePopUpButton,
  withApigetAttendance,
  getAttendance,
}) => {
  const { t } = useTranslation();
  const todayDate = new Date();
  const teacherId = sessionStorage.getItem("id");
  const [attendance, setAttendance] = useState([]);
  const [attendanceObject, setAttendanceObject] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loding, setLoding] = useState({});
  const status = manifest?.status ? manifest?.status : [];

  useEffect(async () => {
    setWeekDays(weekDaysPageWise(weekPage));
    if (withApigetAttendance) {
      setAttendance(
        await GetAttendance({
          studentId: {
            eq: student.id,
          },
          classId: {
            eq: student.currentClassID,
          },
          teacherId: {
            eq: teacherId,
          },
        })
      );
    } else if (attendanceProp) {
      setAttendance(attendanceProp);
    }
    setLoding({});
  }, [weekPage, attendanceProp]);

  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const markAttendance = async (data) => {
    setLoding({
      [(data.date ? data.date : attendanceObject.date) +
      (data.id ? data.id : attendanceObject.id)]: true,
    });
    if (attendanceObject.attendanceId) {
      attendanceServiceRegistry
        .update(
          {
            id: attendanceObject.attendanceId,
            attendance: data.attendance
              ? data.attendance
              : attendanceObject.attendance,
          },
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        )
        .then((e) => {
          if (getAttendance) {
            setTimeout(getAttendance, 900);
          }
        });
    } else {
      attendanceServiceRegistry
        .create(
          {
            studentId: data.id ? data.id : attendanceObject.id,
            date: data.date ? data.date : attendanceObject.date,
            attendance: data.attendance
              ? data.attendance
              : attendanceObject.attendance,
            attendanceNote: "Test",
            classId: student.currentClassID,
            subjectId: "History",
            teacherId: teacherId,
          },
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        )
        .then((e) => {
          if (getAttendance) {
            setTimeout(getAttendance, 900);
          }
        });
    }
    setShowModal(false);
  };

  const PopupActionSheet = () => {
    return (
      <>
        <Actionsheet isOpen={showModal} onClose={() => setShowModal(false)}>
          <Actionsheet.Content>
            <Box w="100%" h={60} px={4} justifyContent="center">
              <Text
                fontSize="16"
                color="gray.500"
                _dark={{
                  color: "gray.300",
                }}
              >
                {t("MARK_ATTENDANCE")}
              </Text>
            </Box>
            {status.map((item) => {
              return (
                <Actionsheet.Item key={item} p={1}>
                  <Pressable
                    onPress={(e) => markAttendance({ attendance: item })}
                  >
                    <HStack alignItems="center" space={2}>
                      <GetIcon status={item} _box={{ p: 2 }} />
                      <Text color="coolGray.800" bold fontSize="lg">
                        {t(item)}
                      </Text>
                    </HStack>
                  </Pressable>
                </Actionsheet.Item>
              );
            })}
            <Actionsheet.Item p={1}>
              <Pressable onPress={(e) => setShowModal(false)}>
                <HStack alignItems="center" space={2}>
                  <IconButton
                    size="md"
                    py="2"
                    color={"gray.400"}
                    icon={<CircleIcon fontSize="large" />}
                  />
                  <Text color="coolGray.800" bold fontSize="lg">
                    {t("Unmarked")}
                  </Text>
                </HStack>
              </Pressable>
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
      </>
    );
  };

  return (
    <>
      <Box borderColor="coolGray.300" borderBottomWidth={1} pb="1">
        <Text fontSize={"lg"}>{t("WEEK_ATTENDANCE")}</Text>
        <Card
          item={student}
          img="fasle"
          _textTitle={{ display: "none" }}
          _textSubTitle={{ display: "none" }}
          _arrow={{ _icon: { fontSize: "large" } }}
          type="attendance"
          hidePopUpButton={hidePopUpButton}
        />
      </Box>
      <HStack justifyContent="space-between" alignItems="center">
        {weekDays.map((day, subIndex) => {
          let dateValue = formatDate(day);
          let attendanceItem = attendance
            .slice()
            .reverse()
            .find((e) => e.date === dateValue && e.studentId === student.id);
          let attendanceIcon = <GetIcon />;
          let attendanceType = "Present";
          if (
            typeof attendanceItem?.attendance !== "undefined" &&
            attendanceItem?.attendance === "Present"
          ) {
            attendanceIcon = <GetIcon status={attendanceItem?.attendance} />;
            attendanceType = "Absent";
          } else if (
            typeof attendanceItem?.attendance !== "undefined" &&
            attendanceItem?.attendance === "Absent"
          ) {
            attendanceIcon = <GetIcon status={attendanceItem?.attendance} />;
            attendanceType = "Present";
          } else if (
            typeof attendanceItem?.attendance !== "undefined" &&
            attendanceItem?.attendance === "Late"
          ) {
            attendanceIcon = <GetIcon status={attendanceItem?.attendance} />;
            attendanceType = "Present";
          } else if (formatDate(day) === formatDate(todayDate)) {
            attendanceIcon = <GetIcon status="Today" />;
          }
          if (day > todayDate) {
            attendanceIcon = <GetIcon color="gray.100" />;
          }

          return (
            <div key={subIndex}>
              <VStack
                alignItems="center"
                bgColor={
                  formatDate(day) === formatDate(todayDate) ? "white" : ""
                }
              >
                {withDate ? (
                  <Text
                    key={subIndex}
                    py={1}
                    color={
                      formatDate(day) === formatDate(todayDate)
                        ? "primary.500"
                        : ""
                    }
                  >
                    <VStack alignItems={"center"}>
                      <Text>{moment(day).format("DD")}</Text>
                      <Text>{moment(day).format("ddd")}</Text>
                    </VStack>
                  </Text>
                ) : (
                  <></>
                )}
                <TouchableHighlight
                  onPress={(event) => {
                    if (formatDate(day) === formatDate(todayDate)) {
                      setAttendanceObject({
                        attendanceId: attendanceItem?.id
                          ? attendanceItem.id
                          : null,
                        date: dateValue,
                        attendance: attendanceType,
                        id: student.id,
                      });
                      setShowModal(true);
                    }
                  }}
                >
                  {loding[dateValue + student.id] ? (
                    <Box py="2" color="primary.500">
                      <CircularProgress />
                    </Box>
                  ) : (
                    attendanceIcon
                  )}
                </TouchableHighlight>
              </VStack>
            </div>
          );
        })}
      </HStack>
      <PopupActionSheet />
    </>
  );
};

export default AttendanceComponent;