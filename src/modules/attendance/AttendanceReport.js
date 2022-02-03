import moment from "moment";
import {
  Box,
  FlatList,
  HStack,
  PresenceTransition,
  Pressable,
  Progress,
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

export default function AttendanceReport() {
  const { t } = useTranslation();
  const [datePage, setDatePage] = useState(0);
  const [calsses, setClasses] = useState([]);
  const teacherId = sessionStorage.getItem("id");
  const status = manifest?.status ? manifest?.status : [];

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
            p="5"
            borderBottomWidth={1}
            borderBottomColor="coolGray.200"
          >
            <Collapsible
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
              body={
                <Box bg="white">
                  <Box
                    borderWidth={1}
                    borderColor="coolGray.200"
                    rounded={"xl"}
                    bg={"coolGray.50"}
                  >
                    <Box
                      borderWidth={1}
                      borderColor="coolGray.200"
                      roundedTop={"xl"}
                      p="5"
                      bg={"yellow.500"}
                    >
                      <HStack alignItems={"center"} space={2}>
                        <IconByName name="smile" isDisabled color="white" />
                        <Text color="white">
                          {t("absent_today_Poor_last_week")}
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
                          <VStack space={2} flex="auto">
                            {status.map((subItem, index) => {
                              let value = Math.floor(Math.random() * 11);
                              return (
                                <HStack alignItems="center" space={2}>
                                  {value ? (
                                    <Progress
                                      flex="auto"
                                      max={10}
                                      value={value}
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
                                      {value}
                                    </Progress>
                                  ) : (
                                    <></>
                                  )}
                                </HStack>
                              );
                            })}
                          </VStack>
                        </HStack>
                      )}
                      keyExtractor={(item, index) => index}
                    />
                  </Box>
                </Box>
              }
            />
          </Box>
        ))}
      </Box>
    </Layout>
  );
}

const Collapsible = ({ header, body, defaultCollapse, isHeaderBold }) => {
  const [collaps, setCollaps] = useState(defaultCollapse);

  return (
    <>
      <Pressable onPress={() => setCollaps(!collaps)}>
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
              name={!collaps ? "angle-double-down" : "angle-double-up"}
            />
          </HStack>
        </Box>
      </Pressable>
      <PresenceTransition visible={collaps}>{body}</PresenceTransition>
    </>
  );
};
