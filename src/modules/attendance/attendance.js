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
import * as classServiceRegistry from "../../shiksha-os/services/classServiceRegistry";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import AttendanceComponent, { weekDaysPageWise } from "../../helper/weekDays";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const todayDate = new Date();
  const [weekPage, setWeekPage] = useState(0);
  const [weekDays, setWeekDays] = useState([]);
  const [students, setStudents] = useState([]);
  const [classObject, setClassObject] = useState({});
  const { classId } = useParams();

  useEffect(() => {
    setWeekDays(weekDaysPageWise(weekPage));
  }, [weekPage]);

  useEffect(() => {
    let ignore = false;
    async function getData() {
      setStudents(
        await studentServiceRegistry.getAll({
          filters: {
            currentClassID: {
              eq: classId,
            },
          },
        })
      );
      let classes = await classServiceRegistry.getAll();
      if (!ignore) setClassObject(classes.find((e) => e.id === classId));
    }
    getData();
    return () => {
      ignore = true;
    };
  }, [classId]);

  const changeWeek = (e) => {
    let result = parseInt(weekPage) + parseInt(e);
    setWeekPage(result);
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
                onPress={(current) => {
                  changeWeek("1");
                }}
                size="sm"
                color="primary.500"
                icon={<ArrowCircleLeftOutlinedIcon />}
              />
            </HStack>
            <HStack space="4" alignItems="center">
              {weekPage == 0 ? (
                <Text fontSize="md" bold>
                  {t("THIS_WEEK")}
                </Text>
              ) : (
                <Text fontSize="md" bold>
                  {t("WEEK_STARTING")} {weekDays[0].getDate()}
                  {"/"}
                  {weekDays[0].getMonth() + 1}
                </Text>
              )}
            </HStack>
            <HStack space="2">
              <IconButton
                onPress={(current) => {
                  if (weekPage > 0) changeWeek("-1");
                }}
                size="sm"
                color={weekPage > 0 ? "primary.500" : "gray.500"}
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
                {t("STUDENTS")}
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
                        {t("ROLL_NUMBER") + " : " + item.admissionNo}
                      </Text>
                      <Text color="coolGray.500" fontSize="xs">
                        {t("FATHERS_NAME") + " : " + item.fathersName}
                      </Text>
                    </VStack>
                    <VStack space="2">
                      <HStack>
                        <AttendanceComponent
                          weekPage={weekPage}
                          student={item}
                          withDate={index === 0}
                        />
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
