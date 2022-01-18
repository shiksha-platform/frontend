import React, { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import CircleIcon from "@mui/icons-material/Circle";
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

export function weekDaysPageWise(weekPage, today) {
  let date = new Date();
  date.setDate(date.getDate() + weekPage * 7);
  return weekDates({ only: manifest.weekDays, today: today }, date);
}

export const weekDates = (filter = {}, current = new Date()) => {
  let week = [];
  if (filter.today) {
    return [new Date()];
  }
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
        <Box {..._box} color={color ? color : "green.600"}>
          <CheckCircleIcon fontSize="large" />
        </Box>
      );
      break;
    case "Absent":
      icon = (
        <Box {..._box} color={color ? color : "danger.600"}>
          <HdrAutoIcon fontSize="large" />
        </Box>
      );
      break;
    case "Late":
      icon = (
        <Box {..._box} color={color ? color : "yellow.600"}>
          <WatchLaterIcon fontSize="large" />
        </Box>
      );
      break;
    case "Today":
    case "Unmarked":
      icon = (
        <Box {..._box} color={color ? color : "gray.400"}>
          <CircleOutlined fontSize="large" />
        </Box>
      );
      break;
    default:
      icon = (
        <Box {..._box} color={color ? color : "gray.400"}>
          <CircleIcon fontSize="large" />
        </Box>
      );
      break;
  }
  return icon;
};

const AttendanceComponent = ({
  today,
  weekPage,
  student,
  withDate,
  attendanceProp,
  hidePopUpButton,
  withApigetAttendance,
  getAttendance,
  _card,
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
    setWeekDays(weekDaysPageWise(weekPage, today));
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
  }, [weekPage, attendanceProp, withApigetAttendance && !showModal]);

  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const markAttendance = async (dataObject) => {
    setLoding({
      [dataObject.date + dataObject.id]: true,
    });

    if (dataObject.attendanceId) {
      attendanceServiceRegistry
        .update(
          {
            id: dataObject.attendanceId,
            attendance: dataObject.attendance,
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
          setShowModal(false);
        });
    } else {
      attendanceServiceRegistry
        .create(
          {
            studentId: student.id,
            date: dataObject.date,
            attendance: dataObject.attendance,
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
          setShowModal(false);
        });
    }
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
                    onPress={(e) => {
                      if (attendanceObject.attendance !== item) {
                        markAttendance({
                          ...attendanceObject,
                          attendance: item,
                        });
                      } else {
                        setShowModal(false);
                      }
                    }}
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
            {/* <Actionsheet.Item p={1}>
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
            </Actionsheet.Item> */}
          </Actionsheet.Content>
        </Actionsheet>
      </>
    );
  };

  const WeekDaysComponent = ({ weekDays, isIconSizeSmall }) => {
    return weekDays.map((day, subIndex) => {
      let dateValue = formatDate(day);
      let attendanceItem = attendance
        .slice()
        .reverse()
        .find((e) => e.date === dateValue && e.studentId === student.id);
      let attendanceIconProp = !isIconSizeSmall ? { _box: { py: 2 } } : {};
      let attendanceType = "Present";
      if (
        attendanceItem?.attendance &&
        attendanceItem?.attendance === "Present"
      ) {
        attendanceIconProp = {
          ...attendanceIconProp,
          status: attendanceItem?.attendance,
        };
      } else if (
        attendanceItem?.attendance &&
        attendanceItem?.attendance === "Absent"
      ) {
        attendanceIconProp = {
          ...attendanceIconProp,
          status: attendanceItem?.attendance,
        };
      } else if (
        attendanceItem?.attendance &&
        attendanceItem?.attendance === "Late"
      ) {
        attendanceIconProp = {
          ...attendanceIconProp,
          status: attendanceItem?.attendance,
        };
      } else if (formatDate(day) === formatDate(todayDate)) {
        attendanceIconProp = { ...attendanceIconProp, status: "Today" };
      }
      if (day > todayDate) {
        attendanceIconProp = { ...attendanceIconProp, color: "gray.100" };
      }

      if (manifest.status) {
        const arr = manifest.status;
        const i = arr.indexOf(attendanceItem?.attendance);
        if (i === -1) {
          attendanceType = arr[0];
        } else {
          attendanceType = arr[(i + 1) % arr.length];
        }
      }

      return (
        <div key={subIndex}>
          <VStack
            alignItems="center"
            bgColor={formatDate(day) === formatDate(todayDate) ? "white" : ""}
          >
            {withDate ? (
              <Text
                key={subIndex}
                py={!isIconSizeSmall ? 1 : 0}
                color={
                  formatDate(day) === formatDate(todayDate) ? "primary.500" : ""
                }
              >
                {!isIconSizeSmall ? (
                  <VStack alignItems={"center"}>
                    <Text>{moment(day).format("DD")}</Text>
                    <Text>{moment(day).format("ddd")}</Text>
                  </VStack>
                ) : (
                  <HStack alignItems={"center"} space={1}>
                    <Text>{moment(day).format("dd")}</Text>
                    <Text>{moment(day).format("D")}</Text>
                  </HStack>
                )}
              </Text>
            ) : (
              <></>
            )}
            <TouchableHighlight
              onPress={(e) => {
                markAttendance({
                  attendanceId: attendanceItem?.id ? attendanceItem.id : null,
                  date: dateValue,
                  attendance: attendanceType,
                  id: student.id,
                });
              }}
              onLongPress={(event) => {
                if (formatDate(day) === formatDate(todayDate)) {
                  setAttendanceObject({
                    attendanceId: attendanceItem?.id ? attendanceItem.id : null,
                    date: dateValue,
                    attendance: attendanceItem.attendance,
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
                <GetIcon {...attendanceIconProp} />
              )}
            </TouchableHighlight>
          </VStack>
        </div>
      );
    });
  };

  return (
    <>
      <Box pb="1">
        <Card
          item={student}
          img="fasle"
          _arrow={{ _icon: { fontSize: "large" } }}
          type="attendance"
          hidePopUpButton={hidePopUpButton}
          {...(today ? { _textTitle: { fontSize: "xl" } } : {})}
          {..._card}
          rightComponent={
            today ? (
              <WeekDaysComponent weekDays={weekDays} isIconSizeSmall={true} />
            ) : (
              false
            )
          }
        />
      </Box>
      {!today ? (
        <HStack justifyContent="space-between" alignItems="center">
          <WeekDaysComponent weekDays={weekDays} />
        </HStack>
      ) : (
        <></>
      )}
      <PopupActionSheet />
    </>
  );
};

export default AttendanceComponent;
