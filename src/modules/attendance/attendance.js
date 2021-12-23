import React, { useState, useEffect } from "react";
import {
  IconButton,
  HStack,
  Text,
  Stack,
  Box,
  FlatList,
  VStack,
  Center,
} from "native-base";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import * as studentServiceRegistry from "../../shiksha-os/services/studentServiceRegistry";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CircleIcon from "@mui/icons-material/Circle";
import * as attendanceServiceRegistry from "../../services/attendanceServiceRegistry";
import * as classServiceRegistry from "../../shiksha-os/services/classServiceRegistry";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const weekDates = (
  filter = { only: ["Sun", "Sat", "Monday"] },
  current = new Date()
) => {
  var week = [];
  function getIntday(data, type = "only") {
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
  }
  current.setDate(current.getDate() - current.getDay() + 1);
  for (var i = 0; i < 7; i++) {
    if (weekInt.includes(current.getDay())) {
      week.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
    // console.log("current", current, "week", weekInt, current.getDay());
  }
  return week;
};

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const weekDays = weekDates({ except: ["Sun", "Sat"] });
  const todayDate = new Date();
  const [students, setStudents] = useState([]);
  const [classObject, setClassObject] = useState({});
  const [attendance, setAttendance] = useState([]);
  const { classId } = useParams();

  useEffect(() => {
    getData();
    getAttendance();
  }, []);

  async function getData() {
    setStudents(
      await studentServiceRegistry.getAll({
        filters: {
          currentClassID: {
            eq: "1",
          },
        },
      })
    );
    let classes = await classServiceRegistry.getAll();
    setClassObject(classes.find((e) => e.id === classId));
  }

  const getAttendance = async () => {
    setAttendance(
      await attendanceServiceRegistry.getAll({
        filters: {
          classId: {
            eq: "CLAS001",
          },
          teacherId: {
            eq: "5b34b0a8-5209-41b6-8eca-339e7c20993a",
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
        classId: "CLAS001",
        subjectId: "History",
        teacherId: "5b34b0a8-5209-41b6-8eca-339e7c20993a",
      })
      .then((e) => {
        setTimeout(getAttendance, 900);
      });
  };

  if (!classObject && !classObject?.className) {
    return (
      <Center flex={1} px="3">
        <Center
          height={200}
          width={{
            base: 200,
            lg: 400,
          }}
        >
          404
        </Center>
      </Center>
    );
  }

  return (
    <>
      <Header
        icon="AssignmentTurnedIn"
        heading={classObject.className}
        subHeading="Attendance will automatically submit at end of the day"
      />
      <Stack space={1}>
        <Box bg="white" p="1">
          <HStack justifyContent="space-between" alignItems="center">
            <HStack space="4" alignItems="center">
              <IconButton
                size="sm"
                color="primary.500"
                icon={<ArrowCircleLeftOutlinedIcon />}
              />
            </HStack>
            <HStack space="4" alignItems="center">
              <Text fontSize="md" bold>
                {t("This Week")}
              </Text>
            </HStack>
            <HStack space="2">
              <IconButton
                size="sm"
                color="primary.500"
                icon={<ArrowCircleRightOutlinedIcon />}
              />
            </HStack>
          </HStack>
        </Box>
      </Stack>
      <Box bg="gray.100">
        <Stack p="2" space={1}>
          <HStack space={3} justifyContent="space-between">
            <Stack space={2}>
              <Text color="primary.500" bold={true}>
                {t("Students")}
              </Text>
            </Stack>
            <Stack space={2}>
              <Text color="gray.500" bold={true}>
                {todayDate.getMonth() + 1 + " - " + todayDate.getFullYear()}
              </Text>
            </Stack>
          </HStack>
          <Box>
            <FlatList
              data={students}
              renderItem={({ item, index }) => (
                <Box borderBottomWidth="1" borderColor="coolGray.500">
                  <HStack
                    space={3}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <VStack>
                      {index === 0 ? <Text> </Text> : <></>}
                      <Text color="coolGray.800" bold>
                        {item.fullName}
                      </Text>
                      <Text color="coolGray.500" fontSize="xs">
                        {t("Roll Number") + " " + item.admissionNo}
                      </Text>
                    </VStack>
                    <VStack space="2">
                      <HStack>
                        {weekDays.map((e, subIndex) => {
                          let dateValue =
                            e.getFullYear() +
                            "-" +
                            (e.getMonth() + 1) +
                            "-" +
                            e.getDate();
                          let attendanceItem = attendance
                            .slice()
                            .reverse()
                            .find(
                              (e) =>
                                e.date === dateValue && e.studentId === item.id
                            );
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
                            circleIcon = <CancelIcon />;
                            attendanceType = "Present";
                          }
                          return (
                            <>
                              <VStack
                                alignItems="center"
                                bgColor={
                                  e.getDate() === todayDate.getDate()
                                    ? "white"
                                    : ""
                                }
                              >
                                {index === 0 ? (
                                  <Text key={subIndex}>{e.getDate()}</Text>
                                ) : (
                                  <></>
                                )}
                                <IconButton
                                  onPress={(current) => {
                                    if (e.getDate() === todayDate.getDate()) {
                                      markAttendance(current, {
                                        date: dateValue,
                                        attendance: attendanceType,
                                        id: item.id,
                                      });
                                    }
                                  }}
                                  size="sm"
                                  py="3"
                                  color={iconColor}
                                  icon={circleIcon}
                                />
                              </VStack>
                            </>
                          );
                        })}
                      </HStack>
                    </VStack>
                  </HStack>
                </Box>
              )}
              keyExtractor={(item) => item.id}
            />
          </Box>
        </Stack>
      </Box>
    </>
  );
}
