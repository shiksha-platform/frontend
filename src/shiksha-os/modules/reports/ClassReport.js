import moment from "moment";
import {
  Box,
  HStack,
  Menu,
  PresenceTransition,
  Pressable,
  Text,
  VStack,
} from "native-base";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CalendarBar from "../../../components/CalendarBar";
import IconByName from "../../../components/IconByName";
import Layout from "../../../layout/Layout";
import * as classServiceRegistry from "../../services/classServiceRegistry";
import {
  calendar,
  GetAttendance,
} from "../../../components/attendance/AttendanceComponent";
import * as studentServiceRegistry from "../../services/studentServiceRegistry";
import Report from "../../../components/attendance/Report";
import { Link } from "react-router-dom";

export default function ClassReport() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [calsses, setClasses] = useState([]);
  const teacherId = localStorage.getItem("id");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [calendarView, setCalendarView] = useState("days");
  const [makeDefaultCollapse, setMakeDefaultCollapse] = useState();

  useEffect(() => {
    let ignore = false;

    const getData = async () => {
      let responceClass = await classServiceRegistry.getAll({
        teacherId: teacherId,
        type: "class",
        role: "teacher",
      });
      if (!ignore) setClasses(responceClass);
    };
    getData();
    return () => {
      ignore = true;
    };
  }, [teacherId]);

  useEffect(() => {
    let ignore = false;
    if (!ignore) setMakeDefaultCollapse(makeDefaultCollapse ? undefined : true);
    return () => {
      ignore = true;
    };
  }, [page, calendarView]);

  const getAttendance = async (classId) => {
    let weekdays = calendar(page, calendarView);
    let params = {
      fromDate: weekdays?.[0]?.format("Y-MM-DD"),
      toDate: weekdays?.[weekdays.length - 1]?.format("Y-MM-DD"),
    };
    const attendanceData = await GetAttendance(params);
    setAttendance({ ...attendance, [classId]: attendanceData });
    const studentData = await studentServiceRegistry.getAll({ classId });
    setStudents({ ...students, [classId]: studentData });
  };

  return (
    <Layout
      _header={{
        title: t("MY_CLASSES"),
        icon: "Group",
        subHeading: moment().format("hh:mm a"),
        _subHeading: { fontWeight: 500 },
        iconComponent: (
          <Menu
            w="120"
            trigger={(triggerProps) => {
              return (
                <Pressable
                  accessibilityLabel="More options menu"
                  {...triggerProps}
                >
                  <Box rounded={"full"} px="5" py="2" bg="button.500">
                    <HStack space="2">
                      <Text color="white" fontSize="14" fontWeight="500">
                        {calendarView === "monthInDays"
                          ? t("MONTH_VIEW")
                          : calendarView === "week"
                          ? t("WEEK_VIEW")
                          : t("TODAY_VIEW")}
                      </Text>
                      <IconByName
                        color="white"
                        name="ArrowDownSLineIcon"
                        isDisabled
                      />
                    </HStack>
                  </Box>
                </Pressable>
              );
            }}
          >
            <Menu.Item onPress={(item) => setCalendarView("days")}>
              {t("TODAY_VIEW")}
            </Menu.Item>
            <Menu.Item onPress={(item) => setCalendarView("week")}>
              {t("WEEK_VIEW")}
            </Menu.Item>
            <Menu.Item onPress={(item) => setCalendarView("monthInDays")}>
              {t("MONTH_VIEW")}
            </Menu.Item>
          </Menu>
        ),
      }}
      subHeader={
        <CalendarBar
          view={calendarView}
          activeColor="gray.900"
          _box={{ p: 0, bg: "transparent" }}
          {...{ page, setPage }}
        />
      }
      _subHeader={{ bg: "reportCard.500" }}
    >
      <Box bg="white" p="5" mb="4" roundedBottom={"xl"} shadow={2}>
        {calsses.map((item, index) => (
          <Box
            key={index}
            py="5"
            borderBottomWidth={1}
            borderBottomColor="coolGray.200"
          >
            <Collapsible
              makeDefaultCollapse={makeDefaultCollapse}
              onPressFuction={(e) => getAttendance(item.id)}
              header={
                <VStack>
                  <Text fontSize="16" fontWeight="600">
                    {item.name}
                  </Text>
                  <Text fontSize="10" fontWeight="400">
                    {index % 2 === 0 ? t("MORNING") : t("MID_DAY_MEAL")}
                  </Text>
                </VStack>
              }
              body={
                <VStack>
                  <Report
                    {...{
                      page,
                      calendarView,
                      students: students[item.id] ? students[item.id] : [],
                      attendance: attendance[item.id]
                        ? [attendance[item.id]]
                        : [],
                    }}
                  />
                  <Text py="5" px="10px" fontSize={12} color={"gray.400"}>
                    <Text bold color={"gray.700"}>
                      {t("NOTES")}
                      {": "}
                    </Text>
                    {t("MONTHLY_REPORT_WILL_GENRRATED_LAST_DAY_EVERY_MONTH")}
                  </Text>
                  <Link
                    style={{
                      color: "rgb(63, 63, 70)",
                      textDecoration: "none",
                    }}
                    to={
                      "/classes/attendance/report/" +
                      (item.id.startsWith("1-")
                        ? item.id.replace("1-", "")
                        : item.id) +
                      "/" +
                      calendarView
                    }
                  >
                    <Box
                      rounded="lg"
                      borderWidth="1"
                      px={6}
                      py={2}
                      mt="2"
                      textAlign={"center"}
                      borderColor={"button.500"}
                      _text={{ color: "button.500" }}
                    >
                      {t("SEE_FULL_REPORT")}
                    </Box>
                  </Link>
                </VStack>
              }
            />
          </Box>
        ))}
      </Box>
    </Layout>
  );
}

const Collapsible = ({
  header,
  body,
  makeDefaultCollapse,
  defaultCollapse,
  isHeaderBold,
  onPressFuction,
}) => {
  const [collaps, setCollaps] = useState(defaultCollapse);

  useEffect(() => {
    let ignore = false;
    if (!ignore) setCollaps(defaultCollapse);
    return () => {
      ignore = true;
    };
  }, [makeDefaultCollapse, defaultCollapse]);

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
