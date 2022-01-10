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
import * as classServiceRegistry from "../../shiksha-os/services/classServiceRegistry";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import AttendanceComponent, {
  weekDaysPageWise,
} from "../../components/weekDays";
import manifest from "./manifest.json";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
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
        subHeading={t("ATTENDANCE_WILL_AUTOMATICALLY_SUBMIT")}
      />
      <Stack space={1}>
        <Box bg="gray.500" p="1">
          <HStack justifyContent="space-between" alignItems="center">
            <HStack space="4" alignItems="center">
              <IconButton
                onPress={(current) => {
                  if (
                    manifest.attendancePastDays / manifest.weekDays?.length >
                    weekPage + 1
                  ) {
                    changeWeek("1");
                  }
                }}
                size="sm"
                color={
                  manifest.attendancePastDays / manifest.weekDays?.length >
                  weekPage + 1
                    ? "gray.100"
                    : "gray.400"
                }
                icon={<ArrowCircleLeftOutlinedIcon />}
              />
            </HStack>
            <HStack space="4" alignItems="center">
              <Text fontSize="md" bold color={"gray.100"}>
                {weekPage === 0 ? (
                  <>{t("THIS_WEEK")}</>
                ) : (
                  <>
                    {t("WEEK_STARTING")} {weekDays[0].getDate()}
                    {"/"}
                    {weekDays[0].getMonth() + 1}
                  </>
                )}
              </Text>
            </HStack>
            <HStack space="2">
              <IconButton
                onPress={(current) => {
                  if (weekPage > 0) changeWeek("-1");
                }}
                size="sm"
                color={weekPage > 0 ? "gray.100" : "gray.400"}
                icon={<ArrowCircleRightOutlinedIcon />}
              />
            </HStack>
          </HStack>
        </Box>
      </Stack>
      <Box bg="gray.100" p="2">
        <FlatList
          data={students}
          renderItem={({ item, index }) => (
            <Box
              bg={"white"}
              p="2"
              mb="2"
              borderColor="coolGray.300"
              borderWidth="1"
              _web={{
                shadow: 2,
              }}
            >
              <VStack space="2">
                <AttendanceComponent
                  weekPage={weekPage}
                  student={item}
                  withDate={1}
                />
              </VStack>
            </Box>
          )}
          keyExtractor={(item) => item.id}
        />
      </Box>
    </>
  );
}
