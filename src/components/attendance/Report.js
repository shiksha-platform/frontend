import { Box, FlatList, HStack, Text, VStack } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import IconByName from "../IconByName";
import manifest from "../../modules/attendance/manifest.json";
import moment from "moment";
import ProgressBar from "../ProgressBar";
import { calendar } from "./AttendanceComponent";

export default function Report({
  students,
  attendance,
  title,
  page,
  calendarView,
}) {
  const { t } = useTranslation();
  const fullName = localStorage.getItem("fullName");
  const status = manifest?.status ? manifest?.status : [];
  let studentIds = students.map((e) => e.id);
  let withoutHolidays = calendar(
    page ? page : 0,
    calendarView ? calendarView : "days"
  ).filter((e) => e.day()).length;
  let per = ["week", "weeks", "month", "months", "monthInDays"].includes(
    calendarView
  );

  const getStudentsAttendance = (attendance) => {
    return attendance
      .slice()
      .reverse()
      .filter(
        (value, index, self) =>
          self.findIndex(
            (m) => value?.studentId === m?.studentId && value?.date === m?.date
          ) === index
      )
      .filter((e) => e);
  };

  const countReport = ({
    gender,
    attendance,
    attendanceType,
    type,
    studentIds,
  }) => {
    let attendanceAll = getStudentsAttendance(attendance);
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

    if (attendanceType === "Unmarked" && gender === t("TOTAL")) {
      let studentIds1 = attendanceAll.filter(
        (e) =>
          studentIds.includes(e.studentId) && e.attendance !== attendanceType
      );
      let val = studentIds.length * withoutHolidays - studentIds1.length;
      if (per) {
        return Math.round((val * 100) / withoutHolidays);
      } else {
        return Math.round(val);
      }
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
      let val = studentIds.length * withoutHolidays - studentIds1.length;
      if (per) {
        return Math.round((val * 100) / withoutHolidays);
      } else {
        return Math.round(val);
      }
    } else {
      let val = attendanceAll.filter(
        (e) =>
          studentIds.includes(e?.studentId) && e.attendance === attendanceType
      ).length;

      if (per) {
        return Math.round((val * 100) / withoutHolidays);
      } else {
        return Math.round(val);
      }
    }
  };

  return (
    <Box rounded={"xl"}>
      <Box roundedTop={"xl"} p="5" bg={"button.500"}>
        <HStack alignItems={"center"} space={2}>
          <IconByName name="EmotionUnhappyLineIcon" isDisabled color="white" />
          <Text color="white" textTransform={"inherit"}>
            {t("ABSENT_TODAY_POOR_LAST_WEEK")}
          </Text>
        </HStack>
      </Box>
      <Box bg={"reportBoxBg.400"}>
        {attendance && attendance.length ? (
          <FlatList
            data={[t("BOYS"), t("GIRLS"), t("TOTAL")]}
            renderItem={({ item, index }) => (
              <VStack
                p="5"
                space={3}
                borderBottomWidth="1"
                borderBottomColor={"reportBoxBg.600"}
              >
                {attendance.length > 1 ? (
                  <Text fontSize="12px" fontWeight="600">
                    {item}
                  </Text>
                ) : (
                  ""
                )}
                <VStack space={3}>
                  {attendance.map((itemAttendance, index) => (
                    <HStack key={index} alignItems={"center"} space={3}>
                      <VStack alignItems={"center"}>
                        {title && title.length && title[index] ? (
                          title[index].name.split(" ").map((item, subIndex) => (
                            <Text
                              key={subIndex}
                              fontSize="10px"
                              fontWeight="400"
                              {...title[index]?._text}
                            >
                              {item}
                            </Text>
                          ))
                        ) : (
                          <Text fontSize="12px" fontWeight="400">
                            {item}
                          </Text>
                        )}
                      </VStack>
                      <VStack flex="auto" alignContent={"center"}>
                        <ProgressBar
                          sufix={per ? "%" : ""}
                          data={status.map((subItem, index) => {
                            let statusCount = countReport({
                              gender: item,
                              attendanceType: subItem,
                              attendance: itemAttendance,
                              studentIds,
                            });
                            return {
                              name: subItem,
                              color:
                                subItem === "Present"
                                  ? "attendancePresent.500"
                                  : subItem === "Absent"
                                  ? "attendanceAbsent.500"
                                  : subItem === "Unmarked"
                                  ? "attendanceUnmarked.500"
                                  : "coolGray.500",
                              value: statusCount,
                            };
                          })}
                        />
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            )}
            keyExtractor={(item, index) => index}
          />
        ) : (
          ""
        )}
      </Box>
      <Box roundedBottom={"xl"} p="5" bg={"reportBoxBg.500"}>
        <HStack justifyContent={"space-between"}>
          <Text>{t("ATTENDANCE_TAKEN_BY")}</Text>
          <Text>{fullName}</Text>
        </HStack>
      </Box>
    </Box>
  );
}
