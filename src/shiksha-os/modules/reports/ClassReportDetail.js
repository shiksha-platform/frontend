import moment from "moment";
import {
  Actionsheet,
  Box,
  Button,
  FlatList,
  HStack,
  PresenceTransition,
  Pressable,
  Stack,
  Text,
  VStack,
} from "native-base";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DayWiesBar from "../../../components/CalendarBar";
import IconByName from "../../../components/IconByName";
import Layout from "../../../layout/Layout";
import * as classServiceRegistry from "../../services/classServiceRegistry";
import AttendanceComponent, {
  GetAttendance,
} from "../../../components/attendance/AttendanceComponent";
import * as studentServiceRegistry from "../../services/studentServiceRegistry";
import Report from "../../../components/attendance/Report";
import { Link, useParams } from "react-router-dom";
import Card from "../../../components/students/Card";

export default function ClassReportDetail() {
  const { t } = useTranslation();
  const [datePage, setDatePage] = useState(0);
  const { classId } = useParams();
  const [classObject, setClassObject] = useState({});
  const teacherId = sessionStorage.getItem("id");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    let ignore = false;

    const getData = async () => {
      let classObj = await classServiceRegistry.getOne({ id: classId });
      if (!ignore) setClassObject(classObj);
      const studentData = await studentServiceRegistry.getAll({
        filters: {
          currentClassID: {
            eq: classId,
          },
        },
      });
      setStudents(studentData);
      await getAttendance();
    };
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

  return (
    <Layout
      _header={{
        title: t("MY_CLASSES"),
        icon: "Group",
        subHeading: moment().format("hh:mm a"),
        _subHeading: { fontWeight: 500 },
        iconComponent: (
          <Link
            to={"/classes/attendance/reportCompare/" + classId}
            style={{ textDecoration: "none" }}
          >
            <Box
              rounded={"full"}
              px="5"
              py="2"
              borderColor="button.500"
              borderWidth={1}
            >
              <HStack space="2">
                <Text color="button.500" fontSize="14" fontWeight="500">
                  {t("COMPARE")}
                </Text>
                <IconByName
                  color="button.500"
                  name="ArrowDownSLineIcon"
                  isDisabled
                />
              </HStack>
            </Box>
          </Link>
        ),
      }}
      subHeader={
        <Stack>
          <Text fontSize="16" fontWeight="600">
            {classObject.className}
          </Text>
          <Text fontSize="10" fontWeight="300">
            {t("TOTAL")}: {students.length} {t("PRESENT")}:
            {attendance.filter((e) => e.attendance === "Present").length}
          </Text>
        </Stack>
      }
      _subHeader={{ bg: "reportCard.500", mb: 1 }}
    >
      <VStack space="1">
        <Box bg="white" p="5">
          <HStack space="4" justifyContent="space-between" alignItems="center">
            <DayWiesBar
              _box={{ p: 0 }}
              {...{ page: datePage, setPage: setDatePage }}
            />
            <IconByName name={"ListUnorderedIcon"} isDisabled />
          </HStack>
        </Box>
        <Box bg="white" p="5">
          <Box borderBottomWidth={1} borderBottomColor="coolGray.200">
            <Collapsible
              defaultCollapse={true}
              header={
                <VStack>
                  <Text fontSize="16" fontWeight="600">
                    {t("SUMMARY")}
                  </Text>
                  <Text fontSize="10" fontWeight="300">
                    {t("TOTAL")}: {students.length} {t("PRESENT")}:
                    {
                      attendance.filter((e) => e.attendance === "Present")
                        .length
                    }
                  </Text>
                </VStack>
              }
              body={
                <VStack pt="5">
                  <Report {...{ students, attendance }} />
                  <Text py="5" px="10px" fontSize={12} color={"gray.400"}>
                    <Text bold color={"gray.700"}>
                      {t("NOTES")}
                      {": "}
                    </Text>
                    {t("MONTHLY_REPORT_WILL_GENRRATED_LAST_DAY_EVERY_MONTH")}
                  </Text>
                </VStack>
              }
            />
          </Box>
        </Box>
        <Box bg="white" p={4}>
          <Stack space={2}>
            <Collapsible
              defaultCollapse={true}
              isHeaderBold={false}
              header={
                <>
                  <VStack>
                    <Text bold fontSize={"md"}>
                      100% {t("THIS_WEEK")}
                    </Text>
                    <Text fontSize={"xs"}>
                      {students?.length + " " + t("STUDENTS")}
                    </Text>
                  </VStack>
                </>
              }
              body={
                <VStack space={2} pt="2">
                  <Box>
                    <FlatList
                      data={students}
                      renderItem={({ item }) => (
                        <Box
                          borderWidth="1"
                          borderColor="presentCardBg.600"
                          bg="presentCardBg.500"
                          p="10px"
                          rounded="lg"
                          my="10px"
                        >
                          <Card
                            item={item}
                            type="rollFather"
                            textTitle={
                              <VStack alignItems="center">
                                <Text fontSize="14" fontWeight="500">
                                  <Text>{item.fullName}</Text>
                                  <Text color="gray.300"> • </Text>
                                  <Text color="presentCardText.500">100%</Text>
                                </Text>
                              </VStack>
                            }
                            href={"/students/" + item.id}
                            hidePopUpButton
                          />
                        </Box>
                      )}
                      keyExtractor={(item) => item.id}
                    />
                  </Box>
                  <Button
                    mt="2"
                    variant="outline"
                    colorScheme="button"
                    rounded="lg"
                  >
                    {t("SEE_MORE")}
                  </Button>
                </VStack>
              }
            />
          </Stack>
        </Box>

        <Box bg="white" p={4}>
          <Stack space={2}>
            <Collapsible
              defaultCollapse={true}
              isHeaderBold={false}
              header={
                <>
                  <VStack>
                    <Text bold fontSize={"md"}>
                      {t("ABSENT_CONSECUTIVE_3_DAYS")}
                    </Text>
                    <Text fontSize={"xs"}>
                      {students?.length + " " + t("STUDENTS")}
                    </Text>
                  </VStack>
                </>
              }
              body={
                <VStack space={2} pt="2">
                  <Box>
                    <FlatList
                      data={students}
                      renderItem={({ item }) => (
                        <Box
                          borderWidth="1"
                          borderColor="apsentCardBg.600"
                          bg="apsentCardBg.500"
                          p="10px"
                          rounded="lg"
                          my="10px"
                        >
                          <Card
                            item={item}
                            type="rollFather"
                            textTitle={
                              <VStack alignItems="center">
                                <Text fontSize="14" fontWeight="500">
                                  <Text>{item.fullName}</Text>
                                  <Text color="gray.300"> • </Text>
                                  <Text color="apsentCardText.500">
                                    3 {t("DAYS")}
                                  </Text>
                                </Text>
                              </VStack>
                            }
                            href={"/students/" + item.id}
                            hidePopUpButton
                          />
                        </Box>
                      )}
                      keyExtractor={(item) => item.id}
                    />
                  </Box>
                  <Button
                    mt="2"
                    variant="outline"
                    colorScheme="button"
                    rounded="lg"
                  >
                    {t("SEE_MORE")}
                  </Button>
                </VStack>
              }
            />
          </Stack>
        </Box>

        <Box bg="white" p={4}>
          <Stack space={2}>
            <Collapsible
              defaultCollapse={true}
              isHeaderBold={false}
              header={
                <>
                  <VStack>
                    <Text bold fontSize={"md"}>
                      {t("STUDENT_WISE_ATTENDANCE")}
                    </Text>
                    <Text fontSize={"xs"}>
                      {students?.length + " " + t("STUDENTS")}
                    </Text>
                  </VStack>
                </>
              }
              body={
                <FlatList
                  data={students}
                  renderItem={({ item, index }) => (
                    <AttendanceComponent
                      weekPage={0}
                      student={item}
                      withDate={1}
                      attendanceProp={attendance}
                      getAttendance={getAttendance}
                      _card={{ hidePopUpButton: true }}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                />
              }
            />
          </Stack>
        </Box>
      </VStack>
    </Layout>
  );
}

const Collapsible = ({
  header,
  body,
  defaultCollapse,
  isHeaderBold,
  onPressFuction,
}) => {
  const [collaps, setCollaps] = useState(defaultCollapse);

  return (
    <>
      <Pressable
        onPress={() => {
          setCollaps(!collaps);
          onPressFuction();
        }}
      >
        <Box px={2} py={1}>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Text
              bold={typeof isHeaderBold === "undefined" ? true : isHeaderBold}
              fontSize={typeof isHeaderBold === "undefined" ? "md" : ""}
            >
              {header}
            </Text>
            <IconByName
              size="sm"
              isDisabled={true}
              color={!collaps ? "coolGray.400" : "coolGray.600"}
              name={!collaps ? "ArrowDownSLineIcon" : "ArrowUpSLineIcon"}
            />
          </HStack>
        </Box>
      </Pressable>
      <PresenceTransition visible={collaps}>{body}</PresenceTransition>
    </>
  );
};
