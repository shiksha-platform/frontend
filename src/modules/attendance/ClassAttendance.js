import moment from "moment";
import {
  Actionsheet,
  Box,
  Center,
  FlatList,
  Heading,
  HStack,
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
  const teacherId = sessionStorage.getItem("id");
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
  }, [teacherId]);

  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      if (classObject.id) {
        let data = await studentServiceRegistry.getAll({
          filters: {
            currentClassID: {
              eq: classObject.id,
            },
          },
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
      <Actionsheet
        isOpen={showModal}
        hideDragIndicator
        _backdrop={{ opacity: "0.9", bg: "gray.500" }}
      >
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
                      if (!classObject) {
                        setShowType(true);
                      } else {
                        setShowModal(false);
                      }
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
                      if (!attendanceType) {
                        setShowType(false);
                      } else {
                        setShowModal(false);
                      }
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
          fullRightComponent={
            <Stack bg="black" p="2">
              <HStack space={4}>
                <IconByName
                  p="0"
                  isDisabled={true}
                  name={"Group"}
                  color="white"
                  _icon={{
                    style: { fontSize: "45px" },
                  }}
                />
                <HStack
                  space={3}
                  justifyContent={"space-between"}
                  width={"80%"}
                >
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
                          {classObject?.className
                            ? classObject?.className
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
              </HStack>
            </Stack>
          }
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
                        today={true}
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
