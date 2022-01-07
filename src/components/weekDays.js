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
  Modal,
  Pressable,
} from "native-base";
import * as attendanceServiceRegistry from "../services/attendanceServiceRegistry";
import manifest from "../modules/attendance/manifest.json";
import { useTranslation } from "react-i18next";
import { TouchableHighlight } from "react-native-web";
import CircularProgress from "@mui/material/CircularProgress";
import WatchLaterIcon from "@mui/icons-material/WatchLater";

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
  const { t } = useTranslation();
  const todayDate = new Date();
  const teacherId = sessionStorage.getItem("id");
  const [attendance, setAttendance] = useState([]);
  const [attendanceObject, setAttendanceObject] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loding, setLoding] = useState({});
  const status = manifest?.status ? manifest?.status : [];

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
    setLoding({});
  };

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
    attendanceServiceRegistry
      .create({
        studentId: data.id ? data.id : attendanceObject.id,
        date: data.date ? data.date : attendanceObject.date,
        attendance: data.attendance
          ? data.attendance
          : attendanceObject.attendance,
        attendanceNote: "Test",
        classId: student.currentClassID,
        subjectId: "History",
        teacherId: teacherId,
      })
      .then((e) => {
        setTimeout(getAttendance, 900);
      });
    setShowModal(false);
  };

  const GetIcon = ({ status, _box, color }) => {
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

  const PopupModal = () => {
    return (
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        avoidKeyboard
      >
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>{t("HOW_YOU_WANT_TO_MARK")}?</Modal.Header>
          <Modal.Body>
            {status.map((item) => {
              return (
                <Pressable
                  key={item}
                  onPress={(e) => markAttendance({ attendance: item })}
                >
                  <Box
                    rounded="full"
                    borderColor="coolGray.200"
                    borderWidth="1"
                    mb={1}
                  >
                    <HStack alignItems="center">
                      <GetIcon status={item} _box={{ p: 2 }} />
                      <Text color="coolGray.800" bold fontSize="lg">
                        {t(item)}
                      </Text>
                    </HStack>
                  </Box>
                </Pressable>
              );
            })}
            <Pressable onPress={(e) => setShowModal(false)}>
              <Box
                rounded="full"
                borderColor="coolGray.200"
                borderWidth="1"
                mb={1}
              >
                <HStack alignItems="center">
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
              </Box>
            </Pressable>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    );
  };

  return (
    <>
      <Box borderColor="coolGray.300" borderBottomWidth={1} pb="1">
        <VStack>
          <HStack justifyContent="space-between" alignItems="center">
            <Text color="coolGray.800" bold fontSize="lg">
              {student.fullName}
            </Text>
            <ArrowDropDownIcon fontSize="large" />
          </HStack>
          <HStack space={1}>
            <Text color="coolGray.500">
              {t("ROLL_NUMBER") + " : " + student.admissionNo}
            </Text>
            <Text color="coolGray.500">
              {t("FATHERS_NAME") + " : " + student.fathersName}
            </Text>
          </HStack>
        </VStack>
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
                    {day.getDate()}
                  </Text>
                ) : (
                  <></>
                )}
                <TouchableHighlight
                  onPress={(event) => {
                    if (formatDate(day) === formatDate(todayDate)) {
                      markAttendance({
                        date: dateValue,
                        attendance: attendanceType,
                        id: student.id,
                      });
                    }
                  }}
                  onLongPress={(event) => {
                    if (formatDate(day) === formatDate(todayDate)) {
                      setAttendanceObject({
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
      <PopupModal />
    </>
  );
};

export default AttendanceComponent;
