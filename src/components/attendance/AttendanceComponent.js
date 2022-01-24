import React, { useState, useEffect } from "react";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import HdrAutoIcon from "@mui/icons-material/HdrAuto";
// import CircleIcon from "@mui/icons-material/Circle";
import {
  VStack,
  Text,
  HStack,
  Box,
  Pressable,
  Actionsheet,
  Stack,
  FlatList,
  Button,
} from "native-base";
import * as attendanceServiceRegistry from "../../services/attendanceServiceRegistry";
import manifest from "../../modules/attendance/manifest.json";
import { useTranslation } from "react-i18next";
import { TouchableHighlight } from "react-native-web";
// import CircularProgress from "@mui/material/CircularProgress";
// import WatchLaterIcon from "@mui/icons-material/WatchLater";
import moment from "moment";
import Card from "../students/Card";
// import { CircleOutlined } from "@mui/icons-material";
import Header from "../../layout/Header";
import { Link } from "react-router-dom";
import IconByName from "../IconByName";

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
          {/* <CheckCircleIcon fontSize="large" /> */}
        </Box>
      );
      break;
    case "Absent":
      icon = (
        <Box {..._box} color={color ? color : "danger.600"}>
          {/* <HdrAutoIcon fontSize="large" /> */}
        </Box>
      );
      break;
    case "Late":
      icon = (
        <Box {..._box} color={color ? color : "yellow.600"}>
          {/* <WatchLaterIcon fontSize="large" /> */}
        </Box>
      );
      break;
    case "Today":
    case "Unmarked":
      icon = (
        <Box {..._box} color={color ? color : "gray.400"}>
          {/* <CircleOutlined fontSize="large" /> */}
        </Box>
      );
      break;
    default:
      icon = (
        <Box {..._box} color={color ? color : "gray.400"}>
          {/* <CircleIcon fontSize="large" /> */}
        </Box>
      );
      break;
  }
  return icon;
};

export const MultipalAttendance = ({
  students,
  attendance,
  getAttendance,
  setLoding,
  setAllAttendanceStatus,
  allAttendanceStatus,
  classObject,
  isEditDisabled,
  setIsEditDisabled,
}) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const teacherId = sessionStorage.getItem("id");
  const status = manifest?.status ? manifest?.status : [];

  const getStudentsAttendance = (e) => {
    return students
      .map((item) => {
        return attendance
          .slice()
          .reverse()
          .find(
            (e) =>
              e.date === moment().format("Y-MM-DD") && e.studentId === item.id
          );
      })
      .filter((e) => e);
  };

  const countReport = ({ gender, attendanceType, type }) => {
    let attendanceAll = getStudentsAttendance();

    let studentIds = students.map((e) => e.id);
    if (gender && [t("BOYS"), t("GIRLS")].includes(gender)) {
      studentIds = students
        .filter(
          (e) =>
            e.gender ===
            (gender === t("BOYS")
              ? "Male"
              : gender === t("GIRLS")
              ? "Female"
              : "")
        )
        .map((e) => e.id);
    }
    if (type === "Total" && gender === t("TOTAL")) {
      return studentIds.length;
    } else if (type === "Total" && [t("BOYS"), t("GIRLS")].includes(gender)) {
      let studentIds1 = studentIds.filter(
        (e) =>
          !attendanceAll
            .filter((e) => studentIds.includes(e?.studentId))
            .map((e) => e.studentId)
            .includes(e)
      );

      return (
        attendanceAll.filter((e) => studentIds.includes(e?.studentId)).length +
        studentIds1.length
      );
    } else if (attendanceType === "Unmarked" && gender === t("TOTAL")) {
      let studentIds1 = attendanceAll.filter(
        (e) =>
          studentIds.includes(e.studentId) && e.attendance !== attendanceType
      );
      return Math.abs(studentIds.length - studentIds1.length);
    } else if (type === "Unmarked" || attendanceType === "Unmarked") {
      let studentIds1 = attendanceAll.filter((e) =>
        studentIds.includes(e.studentId)
      );

      if (attendanceType === "Unmarked") {
        studentIds1 = attendanceAll.filter(
          (e) =>
            studentIds.includes(e?.studentId) && e.attendance !== attendanceType
        );
      }
      return Math.abs(studentIds.length - studentIds1.length);
    } else {
      return attendanceAll.filter(
        (e) =>
          studentIds.includes(e?.studentId) && e.attendance === attendanceType
      ).length;
    }
  };

  const markAllAttendance = async () => {
    setLoding(true);
    if (typeof students === "object") {
      let ctr = 0;
      let attendanceAll = getStudentsAttendance();

      students.forEach((item, index) => {
        let attendanceObject = attendanceAll.find(
          (e) => item.id === e.studentId
        );
        let result = null;
        if (attendanceObject?.id) {
          if (attendanceObject.attendance !== "Present") {
            result = attendanceServiceRegistry
              .update(
                {
                  id: attendanceObject.id,
                  attendance: "Present",
                },
                {
                  headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                  },
                }
              )
              .then((e) => {
                if (getAttendance) {
                  getAttendance();
                }
              });
          } else {
            result = "alreadyPresent";
          }
        } else {
          result = attendanceServiceRegistry.create(
            {
              studentId: item.id,
              date: moment().format("Y-MM-DD"),
              attendance: "Present",
              attendanceNote: "Test",
              classId: item.currentClassID,
              subjectId: "History",
              teacherId: teacherId,
            },
            {
              headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
              },
            }
          );
        }

        setTimeout(async (e) => {
          if (result && result === "alreadyPresent") {
            setAllAttendanceStatus({
              ...allAttendanceStatus,
              success: parseInt(index + 1) + " Already Present",
            });
          } else if (result) {
            setAllAttendanceStatus({
              ...allAttendanceStatus,
              success: parseInt(index + 1) + " success",
            });
          } else {
            setAllAttendanceStatus({
              ...allAttendanceStatus,
              fail: parseInt(index + 1) + " fail",
            });
          }
          ctr++;
          if (ctr === students.length) {
            setAllAttendanceStatus({});
            setLoding(false);
            await getAttendance();
          }
        }, index * 900);
      });
    }
  };

  const PopupActionSheet = () => {
    return (
      <>
        <Actionsheet isOpen={showModal} onClose={() => setShowModal(false)}>
          <Actionsheet.Content bg="coolGray.500">
            <Header
              isDisabledAppBar={true}
              _box={{ bg: "coolGray.500", py: 0 }}
              icon="AssignmentTurnedIn"
              heading={t("ATTENDANCE")}
              _heading={{ fontSize: "xl" }}
              subHeadingComponent={
                <Link
                  to={"/students/class/" + classObject.id}
                  style={{ color: "rgb(63, 63, 70)", textDecoration: "none" }}
                >
                  <Box
                    rounded="full"
                    borderColor="coolGray.200"
                    borderWidth="1"
                    bg="white"
                    px={1}
                  >
                    <HStack
                      space="4"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <IconByName size="sm" name="Group" />
                      <Text fontSize={"lg"}>{classObject?.title ?? ""}</Text>
                      <IconByName size="sm" name="ArrowForwardIos" />
                    </HStack>
                  </Box>
                </Link>
              }
            />
          </Actionsheet.Content>
          <Box bg="coolGray.100" width={"100%"}>
            <Box bg="white" p="2">
              <HStack justifyContent="space-between" alignItems="center">
                <Text>{t("ATTENDANCE_SUMMARY")}</Text>
                <Text>
                  {t("TODAY")}: {moment().format("ddd DD, MMM")}
                </Text>
              </HStack>
            </Box>
            <Box p={4}>
              <Stack space={3}>
                <Box borderWidth={1} p="2" borderColor="gray.500" bg="gray.50">
                  <FlatList
                    data={["heade", t("BOYS"), t("GIRLS"), t("TOTAL")]}
                    renderItem={({ item, index }) => (
                      <HStack
                        alignItems={"center"}
                        space={2}
                        justifyContent={"space-between"}
                      >
                        {item === "heade" ? (
                          <Text></Text>
                        ) : (
                          <Text fontSize="2xl">{item}</Text>
                        )}
                        {item === "heade" ? (
                          <HStack alignItems={"center"} space={2}>
                            {status.map((item, index) => {
                              return (
                                <GetIcon
                                  key={index}
                                  status={item}
                                  _box={{ p: 2, minW: "55", maxW: "55" }}
                                />
                              );
                            })}
                            {!status.includes("Unmarked") ? (
                              <GetIcon
                                status={"Today"}
                                _box={{ p: 2, minW: "55", maxW: "55" }}
                              />
                            ) : (
                              <></>
                            )}
                            <Text fontSize="2xl" minW={"55"} maxW={"55"}>
                              {t("TOTAL")}
                            </Text>
                          </HStack>
                        ) : (
                          <HStack
                            alignItems={"center"}
                            space={2}
                            width={"252px"}
                          >
                            {status.map((subItem, index) => {
                              return (
                                <Text
                                  key={index}
                                  fontSize="2xl"
                                  minW={"55"}
                                  maxW={"55"}
                                  textAlign={"center"}
                                >
                                  {countReport({
                                    gender: item,
                                    attendanceType: subItem,
                                  })}
                                </Text>
                              );
                            })}
                            {!status.includes("Unmarked") ? (
                              <Text
                                fontSize="2xl"
                                minW={"55"}
                                maxW={"55"}
                                textAlign={"center"}
                              >
                                {countReport({
                                  type: "Unmarked",
                                  gender: item,
                                })}
                              </Text>
                            ) : (
                              <></>
                            )}
                            <Text
                              fontSize="2xl"
                              minW={"55"}
                              maxW={"55"}
                              textAlign={"center"}
                            >
                              {countReport({
                                type: "Total",
                                gender: item,
                              })}
                            </Text>
                          </HStack>
                        )}
                      </HStack>
                    )}
                    keyExtractor={(item, index) => index}
                  />
                </Box>
                <VStack>
                  <Box
                    borderWidth={1}
                    p="2"
                    borderColor="gray.500"
                    bg="gray.50"
                  >
                    <Text>
                      <Text>100% {t("THIS_WEEK")}: </Text>
                      <Text pr={1}>
                        {students.map((e) => e.fullName).join(", ")}
                      </Text>
                    </Text>
                  </Box>
                </VStack>
                <VStack space={4} width={"100%"} alignItems={"center"}>
                  <Link
                    to={"/classes/" + classObject.id}
                    style={{ color: "rgb(63, 63, 70)", textDecoration: "none" }}
                  >
                    <Box
                      rounded={"full"}
                      background="coolGray.600"
                      px={6}
                      py={2}
                    >
                      <Text color="coolGray.50">{t("SEE_FULL_REPORT")}</Text>
                    </Box>
                  </Link>
                  <Button
                    variant="ghost"
                    rounded={"full"}
                    colorScheme="gray"
                    background="coolGray.300"
                    px={6}
                    width={"100%"}
                    onPress={(e) => setShowModal(false)}
                  >
                    {t("CLOSE")}
                  </Button>
                </VStack>
              </Stack>
            </Box>
          </Box>
        </Actionsheet>
      </>
    );
  };

  return (
    <Stack position={"sticky"} bottom={0} width={"100%"}>
      <Box p="2" bg="coolGray.400">
        <VStack space={3} alignItems={"center"}>
          <Text textAlign={"center"}>
            {t("ATTENDANCE_WILL_AUTOMATICALLY_SUBMIT")}
          </Text>
          {!isEditDisabled ? (
            <HStack alignItems={"center"} space={4}>
              <Button
                variant="ghost"
                rounded={"full"}
                colorScheme="gray"
                background="coolGray.200"
                px={4}
                onPress={markAllAttendance}
              >
                {t("MARK_ALL_PRESENT")}
              </Button>
              <Button
                borderRadius="50"
                colorScheme="gray"
                background="coolGray.600"
                px={6}
                onPress={(e) => setShowModal(true)}
              >
                {t("SAVE")}
              </Button>
            </HStack>
          ) : (
            <HStack alignItems={"center"} space={4}>
              <Button
                variant="ghost"
                rounded={"full"}
                colorScheme="gray"
                background="coolGray.200"
                px={4}
                onPress={(e) => setIsEditDisabled(false)}
              >
                {t("EDIT")}
              </Button>
            </HStack>
          )}
        </VStack>
      </Box>
      <PopupActionSheet />
    </Stack>
  );
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
  isEditDisabled,
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

  useEffect(() => {
    setWeekDays(weekDaysPageWise(weekPage, today));
    async function getData() {
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
    }
    getData();
  }, [
    weekPage,
    attendanceProp,
    withApigetAttendance && !showModal,
    student.id,
    student.currentClassID,
    teacherId,
    today,
  ]);

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
          </Actionsheet.Content>
        </Actionsheet>
      </>
    );
  };

  const WeekDaysComponent = ({ weekDays, isIconSizeSmall, isEditDisabled }) => {
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
                if (!isEditDisabled) {
                  markAttendance({
                    attendanceId: attendanceItem?.id ? attendanceItem.id : null,
                    date: dateValue,
                    attendance: attendanceType,
                    id: student.id,
                  });
                }
              }}
              onLongPress={(event) => {
                if (!isEditDisabled) {
                  setAttendanceObject({
                    attendanceId: attendanceItem?.id ? attendanceItem.id : null,
                    date: dateValue,
                    attendance: attendanceItem?.attendance,
                    id: student.id,
                  });
                  setShowModal(true);
                }
              }}
            >
              {loding[dateValue + student.id] ? (
                <Box py="2" color="primary.500">
                  {/* <CircularProgress /> */}
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
              <WeekDaysComponent
                weekDays={weekDays}
                isIconSizeSmall={true}
                isEditDisabled={isEditDisabled}
              />
            ) : (
              false
            )
          }
        />
      </Box>
      {!today ? (
        <HStack justifyContent="space-between" alignItems="center">
          <WeekDaysComponent
            weekDays={weekDays}
            isEditDisabled={isEditDisabled}
          />
        </HStack>
      ) : (
        <></>
      )}
      <PopupActionSheet />
    </>
  );
};

export default AttendanceComponent;
