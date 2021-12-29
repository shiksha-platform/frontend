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
  ScrollView,
} from "native-base";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import * as studentServiceRegistry from "../../shiksha-os/services/studentServiceRegistry";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import CircleIcon from "@mui/icons-material/Circle";
import * as attendanceServiceRegistry from "../../services/attendanceServiceRegistry";
import * as classServiceRegistry from "../../shiksha-os/services/classServiceRegistry";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import weekDates from "../../helper/weekDays";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const weekDays = weekDates();
  const todayDate = new Date();
  const [students, setStudents] = useState([]);
  const [classObject, setClassObject] = useState({});
  const [attendance, setAttendance] = useState([]);
  const { classId } = useParams();

  useEffect(() => {
    let ignore = false;
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
      if (!ignore) setClassObject(classes.find((e) => e.id === classId));
    }
    getData();
    getAttendance();
    return () => {
      ignore = true;
    };
  }, [classId]);

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
      <Box bg="gray.200">
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
          <ScrollView horizontal={true} _contentContainerStyle={{ mb: "4" }}>
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
                                  e.date === dateValue &&
                                  e.studentId === item.id
                              );
                            let iconColor = "gray.400";
                            let circleIcon = <CircleIcon />;
                            let attendanceType = "Present";
                            if (
                              typeof attendanceItem?.attendance !==
                                "undefined" &&
                              attendanceItem?.attendance === "Present"
                            ) {
                              iconColor = "green.600";
                              circleIcon = <CheckCircleIcon />;
                              attendanceType = "Absent";
                            } else if (
                              typeof attendanceItem?.attendance !==
                                "undefined" &&
                              attendanceItem?.attendance === "Absent"
                            ) {
                              iconColor = "danger.600";
                              circleIcon = <HdrAutoIcon />;
                              attendanceType = "Present";
                            }
                            return (
                              <div key={subIndex}>
                                <VStack
                                  alignItems="center"
                                  bgColor={
                                    e.getDate() === todayDate.getDate()
                                      ? "white"
                                      : ""
                                  }
                                >
                                  {index === 0 ? (
                                    <Text
                                      key={subIndex}
                                      py={1}
                                      color={
                                        e.getDate() === todayDate.getDate()
                                          ? "primary.500"
                                          : ""
                                      }
                                    >
                                      {e.getDate()}
                                    </Text>
                                  ) : (
                                    <></>
                                  )}
                                  <IconButton
                                    onPress={(current) => {
                                      console.log(current);
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
                              </div>
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
          </ScrollView>
        </Stack>
      </Box>
    </>
  );
}
