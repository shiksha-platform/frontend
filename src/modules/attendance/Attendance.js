import React, { useState, useEffect } from "react";
import {
  HStack,
  Stack,
  Box,
  FlatList,
  VStack,
  Center,
  Text,
  Spinner,
  Heading,
} from "native-base";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import * as studentServiceRegistry from "../../shiksha-os/services/studentServiceRegistry";
import * as classServiceRegistry from "../../shiksha-os/services/classServiceRegistry";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import AttendanceComponent, {
  GetAttendance,
  MultipalAttendance,
} from "../../components/attendance/AttendanceComponent";
import manifest from "./manifest.json";
import { WeekWiesBar } from "../../components/CalendarBar";
import Icon from "../../components/IconByName";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const [weekPage, setWeekPage] = useState(0);
  const [allAttendanceStatus, setAllAttendanceStatus] = useState({});
  const [students, setStudents] = useState([]);
  const [searchStudents, setSearchStudents] = useState([]);
  const [classObject, setClassObject] = useState({});
  const { classId } = useParams();
  const [loding, setLoding] = useState(false);
  const teacherId = sessionStorage.getItem("id");
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState();
  const [isEditDisabled, setIsEditDisabled] = useState(true);

  useEffect(() => {
    const filterStudent = students.filter((e) =>
      e?.fullName.toLowerCase().match(search?.toLowerCase())
    );
    setSearchStudents(filterStudent);
  }, [search, students]);

  useEffect(() => {
    let ignore = false;
    async function getData() {
      const studentData = await studentServiceRegistry.getAll({
        filters: {
          currentClassID: {
            eq: classId,
          },
        },
      });
      setStudents(studentData);
      setSearchStudents(studentData);
      await getAttendance();
      if (!ignore)
        setClassObject(await classServiceRegistry.getOne({ id: classId }));
    }
    getData();
    return () => {
      ignore = true;
    };
  }, [classId]);

  const getAttendance = async (e) => {
    const attendanceData = await GetAttendance({
      classId: {
        eq: classId,
      },
      teacherId: {
        eq: teacherId,
      },
    });

    setAttendance(attendanceData);
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

  if (loding) {
    return (
      <Center flex={1} px="3">
        <Center
          _text={{
            color: "white",
            fontWeight: "bold",
          }}
          height={200}
          width={{
            base: 200,
            lg: 400,
          }}
        >
          <VStack space={2} alignItems={"center"}>
            <Text>
              {allAttendanceStatus.success ? allAttendanceStatus.success : ""}
            </Text>
            <Text>
              {allAttendanceStatus.fail ? allAttendanceStatus.fail : ""}
            </Text>
            <HStack space={2} alignItems="center">
              <Spinner accessibilityLabel="Loading posts" />
              <Heading color="primary.500" fontSize="md">
                Loading
              </Heading>
            </HStack>
          </VStack>
        </Center>
      </Center>
    );
  }

  return (
    <>
      <Box position={"sticky"} top={0} zIndex={"10"} width={"100%"}>
        <Header
          title={t("ATTENDANCE_REGISTER")}
          isEnableSearchBtn={true}
          setSearch={setSearch}
          icon="AssignmentTurnedIn"
          heading={t("ATTENDANCE")}
          _heading={{ fontSize: "xl" }}
          subHeadingComponent={
            <Link
              to={"/students/class/" + classId}
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
                  <Icon size="sm" name="Group" />
                  <Text fontSize={"lg"}>{classObject?.title ?? ""}</Text>
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
              parseInt(
                -manifest.attendancePastDays / manifest.weekDays?.length
              ) > parseInt(weekPage - 1)
            }
            nextDisabled={weekPage >= 0}
            leftErrorText={
              !isEditDisabled
                ? {
                    title:
                      "Please click on save before moving to the previous page.",
                    status: "error",
                    placement: "top",
                  }
                : false
            }
            rightErrorText={
              !isEditDisabled
                ? {
                    title:
                      "Please click on save before moving to the next page.",
                    status: "error",
                    placement: "top",
                  }
                : false
            }
          />
        </Stack>
      </Box>
      <Box bg="gray.100" p="2">
        <FlatList
          data={searchStudents}
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
                  withApigetAttendance={false}
                  attendanceProp={attendance}
                  getAttendance={getAttendance}
                  isEditDisabled={isEditDisabled}
                />
              </VStack>
            </Box>
          )}
          keyExtractor={(item) => item.id}
        />
      </Box>
      <MultipalAttendance
        {...{
          students,
          attendance,
          getAttendance,
          setLoding,
          setAllAttendanceStatus,
          allAttendanceStatus,
          classId,
          classObject,
          isEditDisabled,
          setIsEditDisabled,
        }}
      />
    </>
  );
}
