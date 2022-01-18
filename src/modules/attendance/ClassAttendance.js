import moment from "moment";
import {
  Actionsheet,
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  Pressable,
  Stack,
  Text,
  Divider,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AttendanceComponent, {
  GetAttendance,
} from "../../components/attendance/AttendanceComponent";
import Header from "../../components/Header";
import IconByName from "../../components/IconByName";
import Icon from "../../components/IconByName";
import * as classServiceRegistry from "../../shiksha-os/services/classServiceRegistry";
import * as studentServiceRegistry from "../../shiksha-os/services/studentServiceRegistry";

export default function ClassAttendance() {
  const { t } = useTranslation();
  const [calsses, setClasses] = useState([]);
  const [classObject, setClassObject] = useState({});
  const [students, setStudents] = useState([]);
  const [attendanceTypes, setAttendanceTypes] = useState([
    "Morning",
    "Mid day meal",
  ]);
  const [attendanceType, setAttendanceType] = useState();
  const teacherId = sessionStorage.getItem("id");
  const [showModal, setShowModal] = useState(false);
  const [showType, setShowType] = useState(false);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    let ignore = false;

    const getData = async () => {
      let responceClass = await classServiceRegistry.getAll({
        filters: {
          teacherId: { eq: teacherId },
        },
      });
      if (!ignore) setClasses(responceClass);
    };
    getData();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      if (classObject.id) {
        setStudents(
          await studentServiceRegistry.getAll({
            filters: {
              currentClassID: {
                startsWith: classObject.id,
              },
            },
          })
        );
        await getAttendance();
      }
    };
    getData();
  }, [classObject]);

  const getAttendance = async (e) => {
    const attendanceData = await GetAttendance({
      classId: {
        eq: classObject.id,
      },
      teacherId: {
        eq: teacherId,
      },
    });

    setAttendance(attendanceData);
  };

  const PopupActionSheet = () => {
    return (
      <Actionsheet isOpen={showModal} onClose={() => setShowModal(false)}>
        <Actionsheet.Content>
          {!showType ? (
            <Box w="100%" px={4}>
              <Text
                fontSize="16"
                color="gray.500"
                _dark={{
                  color: "gray.300",
                }}
              >
                {t("SELECT_SUBJECT")}
              </Text>
              {attendanceTypes.map((item) => {
                return (
                  <Actionsheet.Item
                    key={item}
                    onPress={(e) => {
                      setAttendanceType(item);
                      setShowModal(false);
                    }}
                  >
                    {attendanceType === item ? (
                      <HStack alignItems="center">
                        <Text>{item}</Text>
                        <IconByName isDisabled={false} name={"Check"} />
                      </HStack>
                    ) : (
                      item
                    )}
                  </Actionsheet.Item>
                );
              })}
            </Box>
          ) : (
            <Box w="100%" px={4}>
              <Text
                fontSize="16"
                color="gray.500"
                _dark={{
                  color: "gray.300",
                }}
              >
                {t("SELECT_CLASS")}
              </Text>
              {calsses.map((item) => {
                return (
                  <Actionsheet.Item
                    key={item.id}
                    onPress={(e) => {
                      setClassObject(item);
                      setShowModal(false);
                    }}
                  >
                    {classObject.className === item.className ? (
                      <HStack alignItems="center">
                        <Text>{item.className}</Text>
                        <IconByName isDisabled={false} name={"Check"} />
                      </HStack>
                    ) : (
                      item.className
                    )}
                  </Actionsheet.Item>
                );
              })}
            </Box>
          )}
        </Actionsheet.Content>
      </Actionsheet>
    );
  };

  return (
    <>
      <PopupActionSheet />
      <Header
        title={t("MY_CLASSES")}
        fullRightComponent={
          <Stack bg="black" p="2">
            <HStack justifyContent="space-between">
              <IconByName
                p="0"
                isDisabled={true}
                name={"Group"}
                color="white"
                _icon={{
                  style: { fontSize: "45px" },
                }}
              />
              <VStack space={1}>
                <Text fontSize={"lg"} color={"coolGray.100"} bold>
                  {attendanceType ? attendanceType : t("SELECT_SUBJECT")}
                </Text>
                <Box
                  rounded="full"
                  borderColor="coolGray.200"
                  borderWidth="1"
                  bg="coolGray.100"
                  px={1}
                  minW={200}
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <Icon size="sm" name="Group" isDisabled={true} px={1} />
                    <Text fontSize={"lg"}>
                      {classObject?.className
                        ? classObject?.className
                        : t("SELECT_CLASS")}
                    </Text>
                    <Icon
                      size="sm"
                      name="ArrowForwardIos"
                      isDisabled={true}
                      pl={1}
                    />
                  </HStack>
                </Box>
                <Text fontSize={"xl"} color={"coolGray.50"}>
                  {moment().format("dddd Do MMM")}
                </Text>
              </VStack>
              <VStack>
                <Icon
                  size="sm"
                  name="Edit"
                  color={"coolGray.100"}
                  pl={1}
                  onPress={(e) => {
                    setShowType(false);
                    setShowModal(true);
                  }}
                />
                <Icon
                  size="sm"
                  name="Edit"
                  color={"coolGray.50"}
                  pl={1}
                  onPress={(e) => {
                    setShowType(true);
                    setShowModal(true);
                  }}
                />
              </VStack>
            </HStack>
          </Stack>
        }
      />
      {students.length === 0 ? (
        <Box p={6} minH={300}>
          <Center flex={1} px="3">
            <Text bold fontSize={"lg"}>
              {t("CLASS_CHOOE_ATTENDANCE")}
            </Text>
          </Center>
        </Box>
      ) : (
        <Box bg="gray.100" p="2">
          <FlatList
            data={students}
            renderItem={({ item, index }) => (
              <Box
                bg={"white"}
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
                    weekPage={0}
                    today={true}
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
      )}
    </>
  );
}
