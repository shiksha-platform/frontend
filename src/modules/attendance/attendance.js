import React, { useState, useEffect } from "react";
import {
  IconButton,
  HStack,
  Text,
  Stack,
  Box,
  FlatList,
  Checkbox,
  VStack,
  Spacer,
  Button,
  Icon,
  Pressable,
} from "native-base";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import * as studentServiceRegistry from "../../shiksha-os/services/studentServiceRegistry";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import * as attendanceServiceRegistry from "../../services/attendanceServiceRegistry";

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
  const weekDays = weekDates({ except: ["Sun"] });
  const todayDate = new Date();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    getData();
  }, [attendance]);

  const getData = async () => {
    setStudents(
      await studentServiceRegistry.getAll({
        filters: {
          currentClassID: {
            eq: "1",
          },
        },
      })
    );
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
    await attendanceServiceRegistry.create({
      studentId: data.id,
      date: data.date,
      attendance: data.attendance,
      attendanceNote: "Test",
      classId: "CLAS001",
      subjectId: "History",
      teacherId: "5b34b0a8-5209-41b6-8eca-339e7c20993a",
    });
  };

  return (
    <>
      <Stack space={1}>
        <Box p="2" bg="black">
          <HStack
            // bg="gray.600"
            px="1"
            py="3"
            justifyContent="space-between"
            alignItems="center"
          >
            <HStack space="4" alignItems="center">
              <IconButton
                size="sm"
                color="white"
                icon={<AssignmentTurnedInIcon />}
              />

              <VStack>
                <Text color="coolGray.100" bold fontSize="md">
                  Class VI, Sec A, Science
                </Text>
                <Text color="coolGray.50" fontSize="xs">
                  Attendance will automatically submit at end of the day
                </Text>
              </VStack>
            </HStack>
          </HStack>
        </Box>
      </Stack>
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
                This Week
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
                STUDENTS
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
                <Box borderBottomWidth="1" borderColor="coolGray.500" p="2">
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
                        {item.fullName}
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
                          let attendanceItem = attendance.find(
                            (e) =>
                              e.date === dateValue && e.studentId === item.id
                          );
                          let iconColor = "gray.400";
                          if (
                            typeof attendanceItem?.attendance !== "undefined" &&
                            attendanceItem?.attendance === "Present"
                          ) {
                            iconColor = "green.600";
                          }
                          return (
                            <>
                              <VStack alignItems="center">
                                {index === 0 ? (
                                  <Text key={subIndex}>{e.getDate()}</Text>
                                ) : (
                                  <></>
                                )}
                                <IconButton
                                  onPress={(current) => {
                                    markAttendance(current, {
                                      date: dateValue,
                                      attendance: "Present",
                                      id: item.id,
                                    });
                                  }}
                                  size="sm"
                                  color={iconColor}
                                  icon={<CheckCircleIcon />}
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
