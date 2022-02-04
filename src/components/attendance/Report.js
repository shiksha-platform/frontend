import { Box, FlatList, HStack, Progress, Text, VStack } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import IconByName from "../IconByName";
import manifest from "../../modules/attendance/manifest.json";
import moment from "moment";

export default function Report({ students, attendance }) {
  const { t } = useTranslation();
  const fullName = sessionStorage.getItem("fullName");
  const status = manifest?.status ? manifest?.status : [];

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
    } else if (attendanceType === "Unmarked" && gender === t("TOTAL")) {
      let studentIds1 = attendanceAll.filter(
        (e) =>
          studentIds.includes(e.studentId) && e.attendance !== attendanceType
      );
      return Math.abs(studentIds.length - studentIds1.length);
    } else if (type === "Unmarked" || attendanceType === "Unmarked") {
      let studentIds1 = attendanceAll.filter((e) =>
        studentIds.includes(e.studentId)
      );

      if (attendanceType === "Unmarked") {
        studentIds1 = attendanceAll.filter(
          (e) =>
            studentIds.includes(e?.studentId) && e.attendance !== attendanceType
        );
      }
      return Math.abs(studentIds.length - studentIds1.length);
    } else {
      return attendanceAll.filter(
        (e) =>
          studentIds.includes(e?.studentId) && e.attendance === attendanceType
      ).length;
    }
  };

  return (
    <Box
      borderWidth={1}
      borderColor="coolGray.200"
      rounded={"xl"}
      bg={"coolGray.50"}
    >
      <Box
        borderWidth={1}
        borderColor="button.500"
        roundedTop={"xl"}
        p="5"
        bg={"button.500"}
      >
        <HStack alignItems={"center"} space={2}>
          <IconByName name="smile" isDisabled color="white" />
          <Text color="white" textTransform={"inherit"}>
            {t("ABSENT_TODAY_POOR_LAST_WEEK")}
          </Text>
        </HStack>
      </Box>
      <FlatList
        data={[t("BOYS"), t("GIRLS"), t("TOTAL")]}
        renderItem={({ item, index }) => (
          <HStack
            alignItems={"center"}
            space={2}
            justifyContent={"space-around"}
            py="5"
            px="2"
          >
            <Text px="2" fontSize="12px" textAlign={"center"}>
              {item}
            </Text>
            <VStack flex="auto" alignContent={"center"}>
              {status.map((subItem, index) => {
                let statusCount = countReport({
                  gender: item,
                  attendanceType: subItem,
                });
                let totalCount = countReport({
                  gender: t("TOTAL"),
                  type: "Total",
                });
                return statusCount > 0 ? (
                  <HStack alignItems="center" space={2} mb="2">
                    <Progress
                      flex="auto"
                      max={totalCount}
                      value={statusCount}
                      size="md"
                      colorScheme={
                        subItem === "Present"
                          ? "attendancePresent"
                          : subItem === "Absent"
                          ? "attendanceAbsent"
                          : subItem === "Unmarked"
                          ? "attendanceUnmarked"
                          : "coolGray"
                      }
                      bg="transparent"
                    >
                      <Text
                        fontSize="10px"
                        fontWeight="700"
                        color="coolGray.500"
                        position="absolute"
                        left={statusCount === totalCount ? "99%" : "100%"}
                      >
                        {statusCount}
                      </Text>
                    </Progress>
                  </HStack>
                ) : (
                  <></>
                );
              })}
            </VStack>
          </HStack>
        )}
        keyExtractor={(item, index) => index}
      />
      <Box
        borderWidth={1}
        borderColor="coolGray.200"
        roundedBottom={"xl"}
        p="5"
        bg={"coolGray.200"}
      >
        <HStack justifyContent={"space-between"}>
          <Text>{t("ATTENDANCE_TAKEN_BY")}</Text>
          <Text>{fullName}</Text>
        </HStack>
      </Box>
    </Box>
  );
}
