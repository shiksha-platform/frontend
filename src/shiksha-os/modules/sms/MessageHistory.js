import moment from "moment";
import { Box, HStack, Menu, Pressable, Text, VStack } from "native-base";
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
  const [calendarView, setCalendarView] = useState("T");
  const { studentId } = useParams();
  const [studentObject, setStudentObject] = useState({});
  const [search, setSearch] = useState();
  const [searchSms, setSearchSms] = useState([]);

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
          <Menu
            w="120"
            trigger={(triggerProps) => {
              return (
                <Pressable
                  accessibilityLabel="More options menu"
                  {...triggerProps}
                >
                  <Box
                    rounded={"full"}
                    px="5"
                    py="2"
                    bg="button.100"
                    borderWidth={1}
                    borderColor="button.500"
                  >
                    <HStack space="2">
                      <Text color="button.500" fontSize="14" fontWeight="500">
                        {calendarView === "M"
                          ? t("MONTH_VIEW")
                          : calendarView === "W"
                          ? t("WEEK_VIEW")
                          : t("TODAY_VIEW")}
                      </Text>
                      <IconByName
                        color="button.500"
                        name="ArrowDownSLineIcon"
                        isDisabled
                      />
                    </HStack>
                  </Box>
                </Pressable>
              );
            }}
          >
            <Menu.Item onPress={(item) => setCalendarView("T")}>
              {t("TODAY_VIEW")}
            </Menu.Item>
            <Menu.Item onPress={(item) => setCalendarView("W")}>
              {t("WEEK_VIEW")}
            </Menu.Item>
            <Menu.Item onPress={(item) => setCalendarView("M")}>
              {t("MONTH_VIEW")}
            </Menu.Item>
          </Menu>
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
              <VStack>
                <Box p="5">
                  <HStack space="1">
                    <IconByName
                      isDisabled
                      name="CheckDoubleLineIcon"
                      color="present.500"
                    />
                    <Text fontSize="14px" fontWeight="500">
                      {t("SENT")}
                    </Text>
                  </HStack>
                  <Text fontSize="12px" fontWeight="500" color="#B5B5C8">
                    {item.date}
                  </Text>
                  <Text fontSize="14px" fontWeight="400">
                    {item.message}
                  </Text>
                </Box>
              </VStack>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Layout>
  );
}
