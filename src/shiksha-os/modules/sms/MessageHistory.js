import moment from "moment";
import {
  Actionsheet,
  Box,
  Button,
  HStack,
  Pressable,
  Stack,
  Text,
  VStack,
} from "native-base";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { WeekWiesBar } from "../../../components/CalendarBar";
import IconByName from "../../../components/IconByName";
import Layout from "../../../layout/Layout";
import * as studentServiceRegistry from "../../services/studentServiceRegistry";

export default function App() {
  const { t } = useTranslation();
  const [weekPage, setWeekPage] = useState(0);
  const [calendarView, setCalendarView] = useState();
  const { studentId } = useParams();
  const [studentObject, setStudentObject] = useState({});
  const [search, setSearch] = useState();
  const [searchSms, setSearchSms] = useState([]);
  const [smsObject, setSmsObject] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let ignore = false;

    const getData = async () => {
      let student = await studentServiceRegistry.getOne({ id: studentId });
      if (!ignore) {
        setStudentObject(student);
        setSearchSms([
          {
            status: "Send",
            date: moment().format("Do MMM, hh:ssa"),
            message:
              "Hello Mr. " +
              student.fathersName +
              ", this is to inform you that your ward " +
              student.firstName +
              " is present in school on Wednesday, 12th of January 2022.",
          },
          {
            status: "Failed",
            date: moment().format("Do MMM, hh:ssa"),
            message:
              "Hello Mr. " +
              student.fathersName +
              ", this is to inform you that your ward " +
              student.firstName +
              " is absent in school on Wednesday, 12th of January 2022.",
          },
          {
            status: "Failed",
            date: moment().format("Do MMM, hh:ssa"),
            message:
              "Hello Mr. " +
              student.fathersName +
              ", this is to inform you that your ward " +
              student.firstName +
              " is absent in school on Wednesday, 12th of January 2022.",
          },
          {
            status: "Send",
            date: moment().format("Do MMM, hh:ssa"),
            message:
              "Hello Mr. " +
              student.fathersName +
              ", this is to inform you that your ward " +
              student.firstName +
              " is present in school on Wednesday, 12th of January 2022.",
          },
        ]);
      }
    };
    getData();
  }, [studentId]);

  return (
    <Layout
      _appBar={{
        isEnableSearchBtn: true,
        setSearch: setSearch,
      }}
      _header={{
        title: t("MESSAGE_HISTORY"),
      }}
      subHeader={
        <HStack space="4" justifyContent="space-between" alignItems="center">
          <WeekWiesBar
            activeColor="gray.900"
            setPage={setWeekPage}
            page={weekPage}
            _box={{ p: 0, bg: "transparent" }}
          />
          <Stack>
            <Button
              rounded={"full"}
              colorScheme="button"
              variant="outline"
              bg="button.100"
              rightIcon={
                <IconByName
                  color="button.500"
                  name="ArrowDownSLineIcon"
                  isDisabled
                />
              }
              onPress={(e) => setShowModal(true)}
            >
              <Text color="button.500" fontSize="14" fontWeight="500">
                {calendarView === "month"
                  ? t("MONTH_VIEW")
                  : calendarView === "week"
                  ? t("WEEK_VIEW")
                  : t("TODAY_VIEW")}
              </Text>
            </Button>
            <Actionsheet
              isOpen={showModal}
              _backdrop={{ opacity: "0.9", bg: "gray.500" }}
            >
              <Actionsheet.Content
                p="0"
                alignItems={"left"}
                bg="studentCard.500"
              >
                <HStack justifyContent={"space-between"}>
                  <Stack p={5} pt={2} pb="25px">
                    <Text fontSize="16px" fontWeight={"600"}>
                      {t("SELECT_VIEW")}
                    </Text>
                  </Stack>
                  <IconByName
                    name="CloseCircleLineIcon"
                    onPress={(e) => setShowModal(false)}
                  />
                </HStack>
              </Actionsheet.Content>

              <Box w="100%" bg="white">
                {[
                  { name: t("TODAY_VIEW"), value: "day" },
                  { name: t("WEEK_VIEW"), value: "week" },
                  { name: t("MONTH_VIEW"), value: "month" },
                  { name: t("CHOOSE_DATE"), value: "date" },
                ].map((item, index) => {
                  return (
                    <Pressable
                      p="5"
                      borderBottomWidth={1}
                      borderBottomColor="coolGray.100"
                      key={index}
                      onPress={(e) => {
                        setCalendarView(item.value);
                        setShowModal(false);
                      }}
                    >
                      <Text>{item.name}</Text>
                    </Pressable>
                  );
                })}
              </Box>
            </Actionsheet>
          </Stack>
        </HStack>
      }
      _subHeader={{ bg: "studentCard.500" }}
    >
      <VStack space="1">
        <Box bg="white" p="5" py="30">
          <HStack space="4" justifyContent="space-between" alignItems="center">
            <Text fontSize="16" fontWeight="600">
              {studentObject.fullName}
            </Text>
          </HStack>
        </Box>
        <Box bg="white">
          <HStack space="4" justifyContent="space-between" alignItems="center">
            <Box p="5">
              <Text fontSize="16" fontWeight="600">
                {t("SEND_MESSAGE")}
              </Text>
            </Box>
          </HStack>
          <VStack>
            {searchSms.map((item, index) => (
              <Pressable onPress={(e) => setSmsObject(item)}>
                <Massage item={item} key={index} />
              </Pressable>
            ))}
          </VStack>
          <Actionsheet
            isOpen={smsObject?.status}
            _backdrop={{ opacity: "0.9", bg: "gray.500" }}
          >
            <Actionsheet.Content p="0" alignItems={"left"} bg="studentCard.500">
              <HStack justifyContent={"space-between"}>
                <Stack p={5} pt={2} pb="25px">
                  <Text fontSize="16px" fontWeight={"600"}>
                    {smsObject?.status === "Send"
                      ? t("MESSAGE_SENT")
                      : t("MESSAGE_FAILED")}
                  </Text>
                  <Text fontSize="12px" fontWeight="500" color="#5B7E5F">
                    {smsObject?.date}
                  </Text>
                </Stack>
                <IconByName
                  name="CloseCircleLineIcon"
                  onPress={(e) => setSmsObject({})}
                />
              </HStack>
            </Actionsheet.Content>
            <Box bg="white" w="100%">
              <Massage item={smsObject} isDisableRetry />
              <Button.Group p="5">
                <Button
                  flex={1}
                  variant="outline"
                  colorScheme="button"
                  onPress={(e) => setShowModal(true)}
                >
                  {smsObject?.status === "Send" ? t("RESEND") : t("RETRY")}
                </Button>
                <Button
                  flex={1}
                  colorScheme="button"
                  onPress={(e) => {
                    console.log(e);
                  }}
                  _text={{ color: "white" }}
                >
                  {t("DONE")}
                </Button>
              </Button.Group>
            </Box>
          </Actionsheet>
        </Box>
      </VStack>
    </Layout>
  );
}

const Massage = ({ item, isDisableRetry }) => {
  const { t } = useTranslation();

  return (
    <Box p="5" borderBottomWidth="1" borderBottomColor="gray.100">
      <VStack space="2">
        <HStack space="1" justifyContent="space-between">
          <HStack space="1">
            <IconByName
              isDisabled
              name={
                item.status === "Send" ? "CheckDoubleLineIcon" : "SpamLineIcon"
              }
              color={item.status === "Send" ? "present.500" : "absent.500"}
            />
            <Text fontSize="14px" fontWeight="500">
              {item.status === "Send" ? t("SENT") : t("FAILED")}
            </Text>
          </HStack>
          {item.status !== "Send" && !isDisableRetry ? (
            <Button variant="ghost" colorScheme="button">
              {t("RETRY")}
            </Button>
          ) : (
            ""
          )}
        </HStack>
        <Text fontSize="12px" fontWeight="500" color="#B5B5C8">
          {item.date}
        </Text>
        <Text fontSize="14px" fontWeight="400">
          {item.message}
        </Text>
      </VStack>
    </Box>
  );
};
