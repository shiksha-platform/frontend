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
  Button,
} from "native-base";
import * as studentServiceRegistry from "../../shiksha-os/services/studentServiceRegistry";
import * as classServiceRegistry from "../../shiksha-os/services/classServiceRegistry";
import Layout from "../../layout/Layout";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import AttendanceComponent, {
  GetAttendance,
  MultipalAttendance,
} from "../../components/attendance/AttendanceComponent";
import manifest from "./manifest.json";
import { WeekWiesBar } from "../../components/CalendarBar";
import IconByName from "../../components/IconByName";

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
    <Layout
      _header={{
        title: classObject?.title ? classObject?.title : "",
        isEnableSearchBtn: true,
        setSearch: setSearch,
        subHeading: t("ATTENDANCE_REGISTER"),
        iconComponent: (
          <Link
            to="/classes/attendance/report"
            style={{ color: "rgb(63, 63, 70)", textDecoration: "none" }}
          >
            <Box
              rounded="full"
              borderColor="button.500"
              borderWidth="1"
              _text={{ color: "button.500" }}
              px={6}
              py={2}
            >
              {t("REPORT")}
            </Box>
          </Link>
        ),
      }}
      subHeader={
        <Link
          to={"/students/class/" + classId}
          style={{ color: "rgb(63, 63, 70)", textDecoration: "none" }}
        >
          <HStack space="4" justifyContent="space-between">
            <VStack>
              <Text fontSize={"lg"}>
                {classObject?.title ? classObject?.title : ""}
              </Text>
              <Text fontSize={"sm"}>
                {t("TOTAL") + " " + students.length + " " + t("STUDENTS")}
              </Text>
            </VStack>
            <IconByName size="sm" name="ArrowRightSLineIcon" />
          </HStack>
        </Link>
      }
      _subHeader={{ bg: "attendanceCard.500" }}
    >
      <Stack space={1}>
        <Box bg="white" px="5" py="30">
          <HStack space="4" justifyContent="space-between" alignItems="center">
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
            <Button
              variant="ghost"
              colorScheme="button"
              endIcon={
                <IconByName
                  name={isEditDisabled ? "PencilLineIcon" : "CheckLineIcon"}
                  isDisabled
                />
              }
              _text={{ fontWeight: "400" }}
              onPress={(e) => setIsEditDisabled(!isEditDisabled)}
            >
              {isEditDisabled ? t("EDIT") : t("DONE")}
            </Button>
          </HStack>
        </Box>
      </Stack>
      <Box bg="white" py="10px" px="5">
        <FlatList
          data={searchStudents}
          renderItem={({ item, index }) => (
            <AttendanceComponent
              weekPage={weekPage}
              student={item}
              withDate={1}
              attendanceProp={attendance}
              getAttendance={getAttendance}
              isEditDisabled={isEditDisabled}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </Box>
      <MultipalAttendance
        isWithEditButton={false}
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
    </Layout>
  );
}
