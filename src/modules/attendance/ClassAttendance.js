import moment from "moment";
import {
  Actionsheet,
  Box,
  Center,
  FlatList,
  Heading,
  HStack,
  Pressable,
  Spinner,
  Stack,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AttendanceComponent, {
  GetAttendance,
  MultipalAttendance,
} from "../../components/attendance/AttendanceComponent";
import Layout from "../../layout/Layout";
import IconByName from "../../components/IconByName";
import * as classServiceRegistry from "../../shiksha-os/services/classServiceRegistry";
import * as studentServiceRegistry from "../../shiksha-os/services/studentServiceRegistry";

export default function ClassAttendance() {
  const { t } = useTranslation();
  const [calsses, setClasses] = useState([]);
  const [classObject, setClassObject] = useState({});
  const [students, setStudents] = useState([]);
  const attendanceTypes = ["Morning", "Mid day meal"];
  const [attendanceType, setAttendanceType] = useState();
  const teacherId = localStorage.getItem("id");
  const [showModal, setShowModal] = useState(true);
  const [showType, setShowType] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [loding, setLoding] = useState(false);
  const [allAttendanceStatus, setAllAttendanceStatus] = useState({});
  const [isEditDisabled, setIsEditDisabled] = useState(true);

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
    const getData = async () => {
      if (classObject.id) {
        let data = await studentServiceRegistry.getAll({
          classId: classObject.id,
        });
        if (!ignore) {
          setStudents(data);
          await getAttendance();
        }
      }
    };
    getData();
  }, [classObject]);

  const getAttendance = async (e) => {
    let params = {
      fromDate: moment().format("Y-MM-DD"),
      toDate: moment().format("Y-MM-DD"),
    };
    const attendanceData = await GetAttendance(params);

    setAttendance(attendanceData);
  };

  const PopupActionSheet = () => {
    return (
      <Actionsheet
        isOpen={showModal}
        _backdrop={{ opacity: "0.9", bg: "gray.500" }}
      >
        <Actionsheet.Content
          bg="classCard.500"
          alignItems="inherit"
          px="0"
          pb="0"
        >
          <Box p="5" pt="2">
            <Text fontSize="16" color="gray.500" textTransform={"inherit"}>
              {!showType ? (
                <Text>{t("SELECT_SUBJECT")}</Text>
              ) : (
                <Text>{t("SELECT_CLASS_MARK_ATTENDANCE")}</Text>
              )}
            </Text>
          </Box>
        </Actionsheet.Content>

        <Box w="100%" bg="white" p="5">
          {!showType
            ? attendanceTypes.map((item, index) => {
                return (
                  <Pressable
                    p="5"
                    borderBottomWidth={1}
                    borderBottomColor="coolGray.100"
                    key={index}
                    onPress={(e) => {
                      setAttendanceType(item);
                      if (!classObject) {
                        setShowType(true);
                      } else {
                        setShowModal(false);
                      }
                    }}
                  >
                    {attendanceType === item ? (
                      <HStack alignItems="center">
                        <Text color={"button.500"}>{item}</Text>
                      </HStack>
                    ) : (
                      <Text>{item}</Text>
                    )}
                  </Pressable>
                );
              })
            : calsses.map((item, index) => {
                return (
                  <Pressable
                    p="5"
                    borderBottomWidth={1}
                    borderBottomColor="coolGray.100"
                    key={index}
                    onPress={(e) => {
                      setClassObject(item);
                      if (!attendanceType) {
                        setShowType(false);
                      } else {
                        setShowModal(false);
                      }
                    }}
                  >
                    {classObject.name === item.name ? (
                      <HStack alignItems="center">
                        <Text color={"button.500"}>{item.name}</Text>
                      </HStack>
                    ) : (
                      <Text>{item.name}</Text>
                    )}
                  </Pressable>
                );
              })}
        </Box>
      </Actionsheet>
    );
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
    <>
      {showModal ? (
        <PopupActionSheet />
      ) : (
        <Layout
          title={t("MY_CLASSES")}
          _header={{
            fullRightComponent: (
              <Stack bg="black" px="10" py="3">
                <HStack space={3} justifyContent={"space-between"}>
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
                      <HStack
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <IconByName
                          size="sm"
                          name="Group"
                          isDisabled={true}
                          px={1}
                        />
                        <Text fontSize={"lg"}>
                          {classObject?.name
                            ? classObject?.name
                            : t("SELECT_CLASS")}
                        </Text>
                        <IconByName
                          size="sm"
                          name="angle-right"
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
                    <IconByName
                      size="sm"
                      name="edit"
                      color={"coolGray.100"}
                      pl={1}
                      onPress={(e) => {
                        setShowType(false);
                        setShowModal(true);
                      }}
                    />
                    <IconByName
                      size="sm"
                      name="edit"
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
            ),
          }}
        >
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
                        type={"day"}
                        student={item}
                        withDate={1}
                        isEditDisabled={isEditDisabled}
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
          <MultipalAttendance
            {...{
              students,
              attendance,
              getAttendance,
              setLoding,
              setAllAttendanceStatus,
              allAttendanceStatus,
              classObject,
              isEditDisabled,
              setIsEditDisabled,
            }}
          />
        </Layout>
      )}
    </>
  );
}
