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
  Button,
  Spinner,
  Heading,
  Actionsheet,
} from "native-base";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import * as studentServiceRegistry from "../../shiksha-os/services/studentServiceRegistry";
import * as classServiceRegistry from "../../shiksha-os/services/classServiceRegistry";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import AttendanceComponent, {
  GetAttendance,
  GetIcon,
} from "../../components/attendance/AttendanceComponent";
import manifest from "./manifest.json";
import { WeekWiesBar } from "../../components/CalendarBar";
import Icon from "../../components/IconByName";
import * as attendanceServiceRegistry from "../../services/attendanceServiceRegistry";
import moment from "moment";

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
  const [showModal, setShowModal] = useState(false);
  const status = manifest?.status ? manifest?.status : [];
  const [search, setSearch] = useState();

  useEffect(() => {
    const filterStudent = students.filter((e) =>
      e.fullName.toLowerCase().match(search.toLowerCase())
    );
    setSearchStudents(filterStudent);
  }, [search]);

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
                  setTimeout(getAttendance, 900);
                }
              });
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
          if (result) {
            setAllAttendanceStatus({
              ...allAttendanceStatus,
              succes: parseInt(index + 1) + " succes",
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
    } else if (type === "Unmarked") {
      let studentIds1 = attendanceAll.filter((e) =>
        studentIds.includes(e.studentId)
      );
      return Math.abs(studentIds.length - studentIds1.length);
    } else {
      return attendanceAll.filter(
        (e) =>
          studentIds.includes(e?.studentId) && e.attendance === attendanceType
      ).length;
    }
  };

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
              {allAttendanceStatus.succes ? allAttendanceStatus.succes : ""}
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
                      <Text fontSize={"lg"}>{classObject?.title ?? ""}</Text>
                      <Icon size="sm" name="ArrowForwardIos" />
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
                            <GetIcon
                              status={"Today"}
                              _box={{ p: 2, minW: "55", maxW: "55" }}
                            />
                            <Text fontSize="2xl" minW={"55"} maxW={"55"}>
                              {t("TOTAL")}
                            </Text>
                          </HStack>
                        ) : (
                          <HStack alignItems={"center"} space={2}>
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
                      <Text>100% {t("THIS_WEEK")}:</Text>
                      {students.map((e) => (
                        <Text pr={1}>{e.fullName}</Text>
                      ))}
                    </Text>
                  </Box>
                </VStack>
                <VStack space={4} width={"100%"} alignItems={"center"}>
                  <Link href={"/classes/" + classId}>
                    <Button
                      borderRadius="50"
                      colorScheme="default"
                      background="coolGray.600"
                      px={6}
                    >
                      {t("SEE_FULL_REPORT")}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    borderRadius="50"
                    colorScheme="default"
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
    <>
      <Header
        title={t("ATTENDANCE_REGISTER")}
        isEnableSearchBtn={true}
        setSearch={setSearch}
        icon="AssignmentTurnedIn"
        heading={t("ATTENDANCE")}
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
            parseInt(-manifest.attendancePastDays / manifest.weekDays?.length) >
            parseInt(weekPage - 1)
          }
          nextDisabled={weekPage >= 0}
        />
      </Stack>
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
                />
              </VStack>
            </Box>
          )}
          keyExtractor={(item) => item.id}
        />
      </Box>
      <Stack>
        <Box p="2" bg="coolGray.400">
          <VStack space={3} alignItems={"center"}>
            <Text textAlign={"center"}>
              {t("ATTENDANCE_WILL_AUTOMATICALLY_SUBMIT")}
            </Text>
            <HStack alignItems={"center"} space={4}>
              <Button
                variant="ghost"
                borderRadius="50"
                colorScheme="default"
                background="coolGray.200"
                px={4}
                onPress={markAllAttendance}
              >
                {t("MARK_ALL_PRESENT")}
              </Button>
              <Button
                borderRadius="50"
                colorScheme="default"
                background="coolGray.600"
                px={6}
                onPress={(e) => setShowModal(true)}
              >
                {t("DONE")}
              </Button>
            </HStack>
            <></>
          </VStack>
        </Box>
      </Stack>
      <PopupActionSheet />
    </>
  );
}
