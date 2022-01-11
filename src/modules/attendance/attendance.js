import React, { useState, useEffect } from "react";
import {
  HStack,
  Stack,
  Box,
  FlatList,
  VStack,
  Center,
  Link,
  Text,
} from "native-base";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import * as studentServiceRegistry from "../../shiksha-os/services/studentServiceRegistry";
import * as classServiceRegistry from "../../shiksha-os/services/classServiceRegistry";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import AttendanceComponent from "../../components/weekDays";
import manifest from "./manifest.json";
import { WeekWiesBar } from "../../components/CalendarBar";
import Icon from "../../components/IconByName";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const [weekPage, setWeekPage] = useState(0);
  const [students, setStudents] = useState([]);
  const [classObject, setClassObject] = useState({});
  const { classId } = useParams();

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
        _heading={{ fontSize: "xl" }}
        subHeadingComponent={
          <Link href={"/students/class/" + classId}>
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
                <Icon size="sm" name="Group" />
                {classObject?.title ?? ""}
                <Icon size="sm" name="ArrowForwardIos" />
              </HStack>
            </Box>
          </Link>
        }
      />
      <Stack space={1}>
        <WeekWiesBar
          setPage={setWeekPage}
          page={weekPage}
          previousDisabled={
            parseInt(-manifest.attendancePastDays / manifest.weekDays?.length) >
            parseInt(weekPage - 1)
          }
          nextDisabled={weekPage >= 0}
        />
      </Stack>
      <Box bg="gray.100" p="2">
        <FlatList
          data={students}
          renderItem={({ item, index }) => (
            <Box
              bg={weekPage < 0 ? "green.100" : "white"}
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
      <Stack>
        <Box p="2" bg="coolGray.400">
          <VStack space={2} alignItems={"center"}>
            <Text>{t("ATTENDANCE_WILL_AUTOMATICALLY_SUBMIT")}</Text>
            <Link href={"/classes/" + classId}>
              <Box
                rounded="full"
                borderColor="coolGray.200"
                borderWidth="1"
                bg="coolGray.100"
                px={6}
              >
                {t("DONE")}
              </Box>
            </Link>
          </VStack>
        </Box>
      </Stack>
    </>
  );
}
