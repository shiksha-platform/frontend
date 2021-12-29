import React, { useEffect, useState } from "react";
import {
  IconButton,
  Image,
  HStack,
  Text,
  VStack,
  Button,
  Stack,
  AspectRatio,
  Box,
  FlatList,
  Avatar,
  Spacer,
  Link,
  ScrollView,
} from "native-base";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PersonIcon from "@mui/icons-material/Person";
import * as studentServiceRegistry from "../../services/studentServiceRegistry";
import { useTranslation } from "react-i18next";
import Header from "../../../components/Header";
import { useParams } from "react-router-dom";
import weekDates from "../../../helper/weekDays";
import * as attendanceServiceRegistry from "../../../services/attendanceServiceRegistry";
import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HdrAutoIcon from "@mui/icons-material/HdrAuto";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const [studentObject, setStudentObject] = useState({});
  const { studentId } = useParams();
  const [attendance, setAttendance] = useState([]);
  const todayDate = new Date();
  const weekDays = weekDates();

  useEffect(() => {
    let ignore = false;

    const getData = async () => {
      let students = await studentServiceRegistry.getAll();
      if (!ignore) setStudentObject(students.find((e) => e.id === studentId));
    };
    getData();
    getAttendance();
  }, [studentId]);

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
  return (
    <>
      <Header
        icon="Group"
        heading={studentObject?.fullName ?? ""}
        subHeading=""
      />
      <Stack p="4" space={1}>
        <Stack space={2}>
          <Text color="primary.500" bold={true}>
            {t("DETAILS")}
          </Text>
        </Stack>
        <Text>
          <Text bold>{t("Address")}:</Text>
        </Text>

        <Text>
          <Text bold>{t("Parent name")}:</Text>
        </Text>
        <Text>
          <Text bold>{t("Phone number")}:</Text>
        </Text>
        <Text>
          <Text bold>{t("Joining year/date")}:</Text>
        </Text>
        <Button
          variant="ghost"
          borderRadius="50"
          colorScheme="default"
          background="gray.100"
          position="absolute"
          bottom="2"
          right="2"
        >
          {t("See more")}
        </Button>
      </Stack>
      <Stack p="4" space={1}>
        <Stack space={2}>
          <Text color="primary.500" bold={true}>
            {t("Class")}
          </Text>
        </Stack>
        <Box borderWidth={1} p="2" borderColor="gray.500" bg="gray.50">
          <ScrollView horizontal={true} _contentContainerStyle={{ mb: "4" }}>
            <HStack
              space={3}
              justifyContent="space-between"
              alignItems="center"
            >
              <VStack>
                <Text> </Text>
                <Text color="coolGray.800" bold>
                  {t("Week attendance")}
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
                        (e) => e.date === dateValue && e.studentId === studentId
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
                      circleIcon = <HdrAutoIcon />;
                      attendanceType = "Present";
                    }
                    return (
                      <div key={subIndex}>
                        <VStack
                          alignItems="center"
                          bgColor={
                            e.getDate() === todayDate.getDate() ? "white" : ""
                          }
                        >
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
                          <IconButton
                            onPress={(current) => {
                              console.log(current);
                              if (e.getDate() === todayDate.getDate()) {
                                markAttendance(current, {
                                  date: dateValue,
                                  attendance: attendanceType,
                                  id: studentId,
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
          </ScrollView>
          <Button
            variant="ghost"
            borderRadius="50"
            colorScheme="default"
            background="gray.100"
          >
            {t("Full class attendance")}
          </Button>
        </Box>
      </Stack>
    </>
  );
}
