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
  const [compare, setCompare] = useState();
  const [compareAttendance, setCompareAttendance] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const presentCount = attendance.filter(
    (e) => e.attendance === "Present"
  ).length;

  useEffect(() => {
    let ignore = false;

    const getData = async () => {
      let classObj = await classServiceRegistry.getOne({ id: classId });
      const studentData = await studentServiceRegistry.getAll({
        filters: {
          currentClassID: {
            eq: classId,
          },
        },
      });
      if (!ignore) {
        setClassObject(classObj);
        setStudents(studentData);
        const newAttendance = await getAttendance();
        setCompareAttendance(newAttendance);
        setAttendance(newAttendance);
      }
    };
    getData();
    return () => {
      ignore = true;
    };
  }, [classId]);

  const getAttendance = async () => {
    return await GetAttendance({
      classId: {
        eq: classId,
      },
      teacherId: {
        eq: teacherId,
      },
    });
  };

  return (
    <Layout
      _header={{
        title: t("MY_CLASSES"),
        icon: "Group",
        subHeading: moment().format("hh:mm a"),
        _subHeading: { fontWeight: 500 },
        iconComponent: (
          <Box rounded={"full"} px="5" py="2" bg="button.500">
            <HStack space="2">
              <Text color="white" fontSize="14" fontWeight="500">
                {t("LAST_WEEK")}
              </Text>
              <IconByName color="white" name="ArrowDownSLineIcon" isDisabled />
            </HStack>
          </Box>
        ),
      }}
      subHeader={
        <Stack>
          <Text fontSize="16" fontWeight="600">
            {classObject.className}
          </Text>
          <Text fontSize="10" fontWeight="300">
            {t("TOTAL")}: {students.length} {t("PRESENT")}:{presentCount}
          </Text>
        </Stack>
      }
      _subHeader={{ bg: "reportCard.500", mb: 1 }}
    >
      {compare ? (
        <VStack space="1">
          <Box bg="white" p="5">
            <HStack
              space="4"
              justifyContent="space-between"
              alignItems="center"
            >
              <DayWiesBar
                _box={{ p: 0 }}
                {...{ page: datePage, setPage: setDatePage }}
              />
              <IconByName name={"ListUnorderedIcon"} isDisabled />
            </HStack>
          </Box>
          <Box bg="white" p="5">
            <Box>
              <Collapsible
                defaultCollapse={true}
                header={
                  <VStack>
                    <Text fontSize="16" fontWeight="600">
                      {t("SUMMARY")}
                    </Text>
                    <Text fontSize="10" fontWeight="300">
                      {t("TOTAL")}: {students.length} {t("PRESENT")}:
                      {presentCount}
                    </Text>
                  </VStack>
                }
                body={
                  <VStack pt="5">
                    <Report
                      {...{
                        students,
                        attendance,
                        compareAttendance,
                      }}
                    />
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
                            borderColor="presentCardCompareBg.600"
                            bg="presentCardCompareBg.500"
                            p="10px"
                            rounded="lg"
                            my="10px"
                          >
                            <Card
                              item={item}
                              href={"/students/" + item.id}
                              hidePopUpButton
                              rightComponent={
                                <HStack space="2">
                                  <VStack alignItems="center">
                                    <Text
                                      fontSize="14"
                                      fontWeight="500"
                                      color="presentCardText.500"
                                    >
                                      100%
                                    </Text>
                                    <Text
                                      fontSize="10"
                                      fontWeight="400"
                                      color="presentCardText.500"
                                    >
                                      {t("THIS_WEEK")}
                                    </Text>
                                  </VStack>
                                  <VStack alignItems="center">
                                    <Text
                                      fontSize="14"
                                      fontWeight="500"
                                      color="presentCardCompareText.500"
                                    >
                                      97%
                                    </Text>
                                    <Text
                                      fontSize="10"
                                      fontWeight="400"
                                      color="presentCardCompareText.500"
                                    >
                                      {t("LAST_WEEK")}
                                    </Text>
                                  </VStack>
                                </HStack>
                              }
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
                            borderColor="apsentCardCompareBg.600"
                            bg="apsentCardCompareBg.500"
                            p="10px"
                            rounded="lg"
                            my="10px"
                          >
                            <Card
                              item={item}
                              href={"/students/" + item.id}
                              hidePopUpButton
                              rightComponent={
                                <HStack space="2">
                                  <VStack alignItems="center">
                                    <Text
                                      fontSize="14"
                                      fontWeight="500"
                                      color="apsentCardText.500"
                                    >
                                      100%
                                    </Text>
                                    <Text
                                      fontSize="10"
                                      fontWeight="400"
                                      color="apsentCardText.500"
                                    >
                                      {t("THIS_WEEK")}
                                    </Text>
                                  </VStack>
                                  <VStack alignItems="center">
                                    <Text
                                      fontSize="14"
                                      fontWeight="500"
                                      color="apsentCardCompareText.500"
                                    >
                                      97%
                                    </Text>
                                    <Text
                                      fontSize="10"
                                      fontWeight="400"
                                      color="apsentCardCompareText.500"
                                    >
                                      {t("LAST_WEEK")}
                                    </Text>
                                  </VStack>
                                </HStack>
                              }
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
                        type="weeks"
                        weekPage={0}
                        student={item}
                        withDate={1}
                        attendanceProp={attendance}
                        getAttendance={getAttendance}
                        _card={{ hidePopUpButton: true }}
                        _weekNameText={{ pb: "1" }}
                      />
                    )}
                    keyExtractor={(item) => item.id}
                  />
                }
              />
            </Stack>
          </Box>
        </VStack>
      ) : (
        <Actionsheet
          isOpen={showModal}
          _backdrop={{ opacity: "0.9", bg: "gray.500" }}
        >
          <Actionsheet.Content p="0" alignItems={"left"} bg="reportCard.500">
            <HStack justifyContent={"space-between"}>
              <Stack p={5} pt={2} pb="25px">
                <Text color={"white"} fontSize="16px" fontWeight={"600"}>
                  {t("SELECT_CLASS_MARK_ATTENDANCE")}
                </Text>
              </Stack>
              <IconByName
                name="CloseCircleLineIcon"
                color="white"
                onPress={(e) => setShowModal(false)}
              />
            </HStack>
          </Actionsheet.Content>

          <Box w="100%" bg="white">
            {[
              { name: t("PREVIOUS_WEEK"), value: "week" },
              { name: t("PREVIOUS_MONTH"), value: "month" },
              { name: t("BEST_PERFORMANCE"), value: "best-performance" },
              { name: t("ANOTHER_SCHOOL"), value: "another-school" },
              {
                name: t("DONT_SHOW_COMPARISON"),
                value: "dont-show-comparison",
              },
            ].map((item, index) => {
              return (
                <Pressable
                  p="5"
                  borderBottomWidth={1}
                  borderBottomColor="coolGray.100"
                  key={index}
                  onPress={(e) => {
                    setCompare(item.value);
                    setShowModal(false);
                  }}
                >
                  <Text>{item.name}</Text>
                </Pressable>
              );
            })}
          </Box>
        </Actionsheet>
      )}
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
