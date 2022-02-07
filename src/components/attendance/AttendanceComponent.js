import React, { useState, useEffect } from "react";
import {
  VStack,
  Text,
  HStack,
  Box,
  Pressable,
  Actionsheet,
  Stack,
  Button,
} from "native-base";
import * as attendanceServiceRegistry from "../../services/attendanceServiceRegistry";
import manifest from "../../modules/attendance/manifest.json";
import { useTranslation } from "react-i18next";
import { TouchableHighlight } from "react-native-web";
import moment from "moment";
import Card from "../students/Card";
import IconByName from "../IconByName";
import Report from "./Report";

export function weekDaysPageWise(weekPage, today) {
  let date = moment();
  date.add(weekPage * 7, "days");
  return weekDates({ today: today }, date);
}

export const weekDates = (filter = {}, currentDate = moment()) => {
  if (filter.today) {
    return [moment()];
  }
  let weekStart = currentDate.clone().startOf("isoWeek");
  let days = [];
  for (let i = 0; i <= 6; i++) {
    days.push(moment(weekStart).add(i, "days"));
  }
  return days;
};

export const GetAttendance = async (filters) => {
  return await attendanceServiceRegistry.getAll({
    filters: filters,
  });
};

export const GetIcon = ({ status, _box, color, _icon }) => {
  let icon = <></>;
  let iconProps = { fontSize: "xl", isDisabled: true, ..._icon };
  switch (status) {
    case "Present":
      icon = (
        <Box {..._box} color={color ? color : "attendancePresent.500"}>
          <IconByName name="CheckboxCircleLineIcon" {...iconProps} />
        </Box>
      );
      break;
    case "Absent":
      icon = (
        <Box {..._box} color={color ? color : "attendanceAbsent.500"}>
          <IconByName name="CloseCircleLineIcon" {...iconProps} />
        </Box>
      );
      break;
    case "Late":
      icon = (
        <Box {..._box} color={color ? color : "yellow.500"}>
          <IconByName name="CheckboxBlankCircleLineIcon" {...iconProps} />
        </Box>
      );
      break;
    case "Holiday":
      icon = (
        <Box {..._box} color={color ? color : "attendanceUnmarked.500"}>
          <IconByName name="CheckboxBlankCircleLineIcon" {...iconProps} />
        </Box>
      );
      break;
    case "Unmarked":
      icon = (
        <Box {..._box} color={color ? color : "attendanceUnmarked.500"}>
          <IconByName name="CheckboxBlankCircleLineIcon" {...iconProps} />
        </Box>
      );
      break;
    case "Today":
      icon = (
        <Box {..._box} color={color ? color : "attendanceUnmarked.100"}>
          <IconByName name="CheckboxBlankCircleLineIcon" {...iconProps} />
        </Box>
      );
      break;
    default:
      icon = (
        <Box {..._box} color={color ? color : "attendanceUnmarked.100"}>
          <IconByName name={status} {...iconProps} />
        </Box>
      );
      break;
  }
  return icon;
};

export const MultipalAttendance = ({
  students,
  attendance,
  getAttendance,
  setLoding,
  setAllAttendanceStatus,
  allAttendanceStatus,
  classObject,
  isEditDisabled,
  setIsEditDisabled,
  isWithEditButton,
}) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const teacherId = sessionStorage.getItem("id");

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
                  getAttendance();
                }
              });
          } else {
            result = "alreadyPresent";
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
          if (result && result === "alreadyPresent") {
            setAllAttendanceStatus({
              ...allAttendanceStatus,
              success: parseInt(index + 1) + " Already Present",
            });
          } else if (result) {
            setAllAttendanceStatus({
              ...allAttendanceStatus,
              success: parseInt(index + 1) + " success",
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

  const PopupActionSheet = () => {
    return (
      <Actionsheet isOpen={showModal} onClose={() => setShowModal(false)}>
        <Actionsheet.Content alignItems={"left"} bg="attendanceCard.500">
          <HStack justifyContent={"space-between"}>
            <Stack p={5} pt={2} pb="25px">
              <Text color={"white"} fontSize="16px" fontWeight={"600"}>
                {t("ATTENDANCE_SUMMARY_REPORT")}
              </Text>
              <Text color={"white"} fontSize="12px" fontWeight={"400"}>
                {classObject?.title ?? ""}
              </Text>
            </Stack>
            <IconByName
              name="CloseCircleLineIcon"
              color="white"
              onPress={(e) => setShowModal(false)}
            />
          </HStack>
        </Actionsheet.Content>
        <Stack width={"100%"} space="1" bg={"gray.200"}>
          <Box bg="white" p={5}>
            <HStack justifyContent="space-between" alignItems="center" pb={5}>
              <Text fontSize={"16px"} fontWeight={"600"}>
                {t("ATTENDANCE_SUMMARY")}
              </Text>
              <Text fontSize={"14px"}>
                {t("TODAY") + ": "}
                <Text fontWeight={"600"}>{moment().format("DD MMM, Y")}</Text>
              </Text>
            </HStack>
            <Report {...{ students, attendance }} />
          </Box>
          <Box bg="white" p={5}>
            <Box bg={"gray.100"} rounded={"md"} p="4">
              <VStack space={5}>
                <HStack justifyContent={"space-between"} alignItems="center">
                  <Text bold>
                    100% {t("ATTENDANCE") + " " + t("THIS_WEEK")}
                  </Text>
                  <IconByName name="More2LineIcon" isDisabled />
                </HStack>
                <HStack alignItems="center" justifyContent={"space-around"}>
                  {students.map((student, index) =>
                    index < 3 ? (
                      <Stack key={index}>
                        <Card
                          item={student}
                          hidePopUpButton={true}
                          type="veritical"
                        />
                      </Stack>
                    ) : (
                      <div key={index}></div>
                    )
                  )}
                </HStack>
                <Button colorScheme="button" variant="outline">
                  {(students?.length > 3 ? "+ " + (students.length - 3) : "") +
                    " " +
                    t("MORE")}
                </Button>
              </VStack>
            </Box>
          </Box>
          <Box p="2" py="5" bg="white">
            <VStack space={"15px"} alignItems={"center"}>
              <Text textAlign={"center"} fontSize="10px">
                {t("ATTENDANCE_WILL_AUTOMATICALLY_SUBMIT")}
              </Text>
              <HStack alignItems={"center"} space={4}>
                <Button
                  variant="outline"
                  colorScheme="button"
                  onPress={(e) => setShowModal(false)}
                >
                  {t("CLOSE")}
                </Button>
                <Button colorScheme="button" _text={{ color: "white" }}>
                  {t("SEE_FULL_REPORT")}
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Stack>
      </Actionsheet>
    );
  };

  return (
    <>
      {isWithEditButton || !isEditDisabled ? (
        <Stack
          position={"sticky"}
          bottom={74}
          width={"100%"}
          style={{ boxShadow: "rgb(0 0 0 / 22%) 0px -2px 10px" }}
        >
          <Box p="2" py="5" bg="white">
            <VStack space={"15px"} alignItems={"center"}>
              <Text
                textAlign={"center"}
                fontSize="10px"
                textTransform={"inherit"}
              >
                {t("ATTENDANCE_WILL_AUTOMATICALLY_SUBMIT")}
              </Text>
              {!isEditDisabled ? (
                <Button.Group>
                  <Button
                    variant="outline"
                    colorScheme="button"
                    onPress={(e) => setShowModal(true)}
                  >
                    {t("SAVE")}
                  </Button>
                  <Button
                    colorScheme="button"
                    onPress={markAllAttendance}
                    _text={{ color: "white" }}
                  >
                    {t("MARK_ALL_PRESENT")}
                  </Button>
                </Button.Group>
              ) : (
                <HStack alignItems={"center"} space={4}>
                  <Button
                    variant="outline"
                    colorScheme="button"
                    onPress={(e) => setIsEditDisabled(false)}
                  >
                    {t("EDIT")}
                  </Button>
                </HStack>
              )}
            </VStack>
          </Box>
        </Stack>
      ) : (
        <></>
      )}
      <PopupActionSheet />
    </>
  );
};

const AttendanceComponent = ({
  today,
  weekPage,
  student,
  attendanceProp,
  hidePopUpButton,
  getAttendance,
  _card,
  isEditDisabled,
}) => {
  const { t } = useTranslation();
  const teacherId = sessionStorage.getItem("id");
  const [attendance, setAttendance] = useState([]);
  const [attendanceObject, setAttendanceObject] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loding, setLoding] = useState({});
  const status = manifest?.status ? manifest?.status : [];

  useEffect(() => {
    setWeekDays(weekDaysPageWise(weekPage, today));
    async function getData() {
      if (attendanceProp) {
        setAttendance(attendanceProp);
      }
      setLoding({});
    }
    getData();
  }, [weekPage, attendanceProp, today]);

  const markAttendance = async (dataObject) => {
    setLoding({
      [dataObject.date + dataObject.id]: true,
    });

    if (dataObject.attendanceId) {
      attendanceServiceRegistry
        .update(
          {
            id: dataObject.attendanceId,
            attendance: dataObject.attendance,
          },
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            onlyParameter: ["attendance", "id", "date"],
          }
        )
        .then((e) => {
          if (getAttendance) {
            setTimeout(getAttendance, 900);
          }
          setShowModal(false);
        });
    } else {
      attendanceServiceRegistry
        .create(
          {
            studentId: student.id,
            date: dataObject.date,
            attendance: dataObject.attendance,
            attendanceNote: "Test",
            classId: student.currentClassID,
            subjectId: "History",
            teacherId: teacherId,
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
          setShowModal(false);
        });
    }
  };

  const PopupActionSheet = () => {
    return (
      <Actionsheet isOpen={showModal} onClose={() => setShowModal(false)}>
        <Actionsheet.Content alignItems={"left"} bg="purple.500">
          <HStack justifyContent={"space-between"}>
            <Stack p={5} pt={2} pb="25px">
              <Text color={"white"} fontSize="16px" fontWeight={"600"}>
                {t("MARK_ATTENDANCE")}
              </Text>
            </Stack>
            <IconByName
              name="CloseCircleLineIcon"
              color={"white"}
              onPress={(e) => setShowModal(false)}
            />
          </HStack>
        </Actionsheet.Content>
        <Box w="100%" p={4} justifyContent="center" bg="white">
          {status.map((item) => {
            return (
              <Pressable
                key={item}
                p={3}
                onPress={(e) => {
                  if (attendanceObject.attendance !== item) {
                    markAttendance({
                      ...attendanceObject,
                      attendance: item,
                    });
                  } else {
                    setShowModal(false);
                  }
                }}
              >
                <HStack alignItems="center" space={2}>
                  <GetIcon status={item} _box={{ p: 2 }} />
                  <Text color="coolGray.800" bold fontSize="lg">
                    {t(item)}
                  </Text>
                </HStack>
              </Pressable>
            );
          })}
        </Box>
      </Actionsheet>
    );
  };

  const WeekDaysComponent = ({
    weekDays,
    isIconSizeSmall,
    isEditDisabled,
    isShowDate,
    isShowAttendance,
  }) => {
    return weekDays.map((day, subIndex) => {
      let isToday = moment().format("Y-MM-DD") === day.format("Y-MM-DD");
      let dateValue = day.format("Y-MM-DD");
      let attendanceItem = attendance
        .slice()
        .reverse()
        .find((e) => e.date === dateValue && e.studentId === student.id);
      let attendanceIconProp = !isIconSizeSmall
        ? {
            _box: { py: 2, minW: "46px", alignItems: "center" },
            status: "CheckboxBlankCircleLineIcon",
          }
        : {};
      let attendanceType = "Present";
      if (
        attendanceItem?.attendance &&
        attendanceItem?.attendance === "Present"
      ) {
        attendanceIconProp = {
          ...attendanceIconProp,
          status: attendanceItem?.attendance,
        };
      } else if (
        attendanceItem?.attendance &&
        attendanceItem?.attendance === "Absent"
      ) {
        attendanceIconProp = {
          ...attendanceIconProp,
          status: attendanceItem?.attendance,
        };
      } else if (
        attendanceItem?.attendance &&
        attendanceItem?.attendance === "Late"
      ) {
        attendanceIconProp = {
          ...attendanceIconProp,
          status: attendanceItem?.attendance,
        };
      } else if (day.day() === 0) {
        attendanceIconProp = { ...attendanceIconProp, status: "Holiday" };
      } else if (isToday) {
        attendanceIconProp = { ...attendanceIconProp, status: "Today" };
      } else if (moment().diff(day, "days") > 0) {
        attendanceIconProp = { ...attendanceIconProp, color: "gray.100" };
      }

      if (manifest.status) {
        const arr = manifest.status;
        const i = arr.indexOf(attendanceItem?.attendance);
        if (i === -1) {
          attendanceType = arr[0];
        } else {
          attendanceType = arr[(i + 1) % arr.length];
        }
      }

      return (
        <VStack
          key={subIndex}
          alignItems="center"
          borderWidth={isToday ? "1" : ""}
          borderTopWidth={isToday && isShowDate ? "1" : "0"}
          borderBottomWidth={isToday && isShowAttendance ? "1" : "0"}
          borderColor={isToday ? "button.500" : ""}
        >
          {isShowDate ? (
            <Text
              key={subIndex}
              py={!isIconSizeSmall ? 2 : 0}
              minW={"46px"}
              textAlign="center"
              color={day.day() === 0 ? "button.500" : ""}
            >
              {!isIconSizeSmall ? (
                <VStack alignItems={"center"}>
                  <Text>{day.format("ddd")}</Text>
                  <Text color={"coolGray.400"}>{day.format("DD")}</Text>
                </VStack>
              ) : (
                <HStack alignItems={"center"} space={1}>
                  <Text>{day.format("dd")}</Text>
                  <Text>{day.format("D")}</Text>
                </HStack>
              )}
            </Text>
          ) : (
            <></>
          )}
          {isShowAttendance ? (
            <TouchableHighlight
              onPress={(e) => {
                if (!isEditDisabled) {
                  markAttendance({
                    attendanceId: attendanceItem?.id ? attendanceItem.id : null,
                    date: dateValue,
                    attendance: attendanceType,
                    id: student.id,
                  });
                }
              }}
              onLongPress={(event) => {
                if (!isEditDisabled) {
                  setAttendanceObject({
                    attendanceId: attendanceItem?.id ? attendanceItem.id : null,
                    date: dateValue,
                    attendance: attendanceItem?.attendance,
                    id: student.id,
                  });
                  setShowModal(true);
                }
              }}
            >
              {loding[dateValue + student.id] ? (
                <GetIcon
                  {...attendanceIconProp}
                  status="Loader4LineIcon"
                  color={"button.500"}
                  isDisabled
                  _icon={{ _fontawesome: { spin: true } }}
                />
              ) : (
                <GetIcon {...attendanceIconProp} />
              )}
            </TouchableHighlight>
          ) : (
            <></>
          )}
        </VStack>
      );
    });
  };

  return (
    <Stack space={!today ? "15px" : ""}>
      <VStack space={!today ? "15px" : ""}>
        <Card
          item={student}
          _arrow={{ _icon: { fontSize: "large" } }}
          type="attendance"
          hidePopUpButton={hidePopUpButton}
          {...(today ? { _textTitle: { fontSize: "xl" } } : {})}
          {..._card}
          rightComponent={
            today ? (
              <WeekDaysComponent
                isShowDate
                isShowAttendance
                weekDays={weekDays}
                isIconSizeSmall={true}
                isEditDisabled={isEditDisabled}
              />
            ) : (
              false
            )
          }
        />
        {!today ? (
          <Box borderWidth={1} borderColor={"coolGray.200"} rounded="xl">
            <Box roundedTop="xl" bg={"coolGray.50"}>
              <HStack justifyContent="space-around" alignItems="center">
                <WeekDaysComponent
                  isShowDate={true}
                  weekDays={weekDays}
                  isEditDisabled={isEditDisabled}
                />
              </HStack>
            </Box>
            <Box>
              <HStack justifyContent="space-around" alignItems="center">
                <WeekDaysComponent
                  isShowAttendance={true}
                  weekDays={weekDays}
                  isEditDisabled={isEditDisabled}
                />
              </HStack>
            </Box>
          </Box>
        ) : (
          <></>
        )}
        <PopupActionSheet />
      </VStack>
      <></>
    </Stack>
  );
};

export default AttendanceComponent;
