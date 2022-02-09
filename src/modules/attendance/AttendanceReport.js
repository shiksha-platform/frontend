import moment from "moment";
import {
  Box,
  FlatList,
  HStack,
  PresenceTransition,
  Pressable,
  Text,
  VStack,
} from "native-base";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DayWiesBar from "../../components/CalendarBar";
import IconByName from "../../components/IconByName";
import Layout from "../../layout/Layout";
import * as classServiceRegistry from "../../shiksha-os/services/classServiceRegistry";
import manifest from "../../modules/attendance/manifest.json";
import ProgressBar from "../../components/ProgressBar";
import { GetAttendance } from "../../components/attendance/AttendanceComponent";
import * as studentServiceRegistry from "../../shiksha-os/services/studentServiceRegistry";
import Report from "../../components/attendance/Report";

export default function AttendanceReport() {
  const { t } = useTranslation();
  const [datePage, setDatePage] = useState(0);
  const [calsses, setClasses] = useState([]);
  const [calssObject, setClassObject] = useState({});
  const teacherId = sessionStorage.getItem("id");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  console.log({ calssObject });
  useEffect(() => {
    let ignore = false;

    const getData = async () => {
      let responceClass = await classServiceRegistry.getAll({
        filters: {
          teacherId: { eq: teacherId },
        },
      });
      if (!ignore) setClasses(responceClass);
      const studentData = await studentServiceRegistry.getAll({
        filters: {
          currentClassID: {
            eq: calssObject.id,
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
  }, [teacherId, calssObject]);

  const getAttendance = async (e) => {
    const attendanceData = await GetAttendance({
      classId: {
        eq: calssObject.id,
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
        avatar: true,
      }}
      subHeader={
        <DayWiesBar
          activeColor="gray.900"
          _box={{ p: 0, bg: "transparent" }}
          {...{ page: datePage, setPage: setDatePage }}
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
              onPressFuction={(e) => setClassObject(item)}
              header={
                <VStack>
                  <Text fontSize="16" fontWeight="600">
                    {item.className}
                  </Text>
                  <Text fontSize="10" fontWeight="400">
                    {index % 2 === 0 ? t("MORNING") : t("MID_DAY_MEAL")}
                  </Text>
                </VStack>
              }
              body={<Report {...{ students, attendance }} />}
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
