import React, { useEffect, useState } from "react";
import {
  Text,
  Box,
  HStack,
  VStack,
  Stack,
  Pressable,
  StatusBar,
  Button,
  ScrollView,
} from "native-base";
import * as classServiceRegistry from "../../services/classServiceRegistry";
import Layout from "../../../layout/Layout";
import { useTranslation } from "react-i18next";
import DayWiesBar from "../../../components/CalendarBar";
import { generatePath, Link } from "react-router-dom";
import moment from "moment";
import { TabView, SceneMap } from "react-native-tab-view";
import { Animated, Dimensions } from "react-native-web";
import Widget from "../../../components/Widget";
import IconByName from "../../../components/IconByName";
import { weekDates } from "../../../components/attendance/AttendanceComponent";

const timeTables = [
  {
    id: "1",
    from: "08:30 AM",
    to: "09:25 AM",
    title: "MATHS",
    subTitle: "Class V, Sec B",
    _boxMenu: {
      bg: "timeTableCardOrange.500",
      borderWidth: 1,
      borderColor: "timeTableCardOrange.500",
    },
  },
  {
    id: "2",
    from: "09:30 AM",
    to: "10:25 AM",
    title: "MATHS",
    subTitle: "Class V, Sec C",
    _boxMenu: {
      bg: "timeTableCardOrange.500",
      borderWidth: 1,
      borderColor: "timeTableCardOrange.500",
    },
  },
  {
    id: "3",
    from: "10:30 AM",
    to: "11:25 AM",
    title: "SPECIAL_DANCE_MID_DROUP",
    subTitle: "N/A",
    rightIcon: "ellipsis-v",
    _boxMenu: {
      bg: "timeTableCardOrange.500",
      borderWidth: 1,
      borderColor: "timeTableCardOrange.500",
    },
  },
  {
    id: "4",
    from: "11:30 AM",
    to: "12:25 PM",
    title: "FREE_PERIOD",
    subTitle: "N/A",
    rightIcon: "ellipsis-v",
    _boxMenu: {
      bg: "timeTableCardOrange.500",
      borderWidth: 1,
      borderColor: "timeTableCardOrange.500",
    },
  },
  {
    id: "5",
    from: "12:30 PM",
    to: "01:25 PM",
    title: "SCIENCE",
    subTitle: "Class VI, Sec A",
    activeMenu: true,
    _boxMenu: {
      bg: "emerald.400",
      borderWidth: 1,
      borderColor: "green.100",
    },
    _text: { color: "white" },
  },
  {
    id: "6",
    from: "01:30 PM",
    to: "02:25 PM",
    title: "SUBSTITUTION",
    subTitle: "N/A",
    rightIcon: "ellipsis-v",
  },
  {
    id: "7",
    from: "02:30 PM",
    to: "03:25 PM",
    title: "FREE_PERIOD",
    subTitle: "N/A",
    rightIcon: "ellipsis-v",
  },
  {
    id: "8",
    from: "03:30 PM",
    to: "04:25 PM",
    title: "MATHS",
    subTitle: "Class VI, Sec A",
  },
];

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();

  const renderScene = SceneMap({
    first: MyClassRoute,
    second: TimeTableRoute,
  });

  const initialLayout = { width: Dimensions.get("window").width };
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: t("MY_CLASSES") },
    { key: "second", title: t("TIME_TABLE") },
  ]);

  const renderTabBar = ({ navigationState }) => {
    return (
      <Box flexDirection="row">
        {navigationState.routes.map((route, i) => {
          return (
            <Pressable key={i} flex={1} onPress={() => setIndex(i)}>
              <Box
                borderBottomWidth="3"
                borderColor={index === i ? "button.500" : "coolGray.200"}
                alignItems="center"
                p="3"
                cursor="pointer"
              >
                <Animated.Text>
                  <Text {...{ color: index === i ? "button.500" : "#a1a1aa" }}>
                    {route.title}
                  </Text>
                </Animated.Text>
              </Box>
            </Pressable>
          );
        })}
      </Box>
    );
  };

  return (
    <Layout
      _header={{
        title: t("MY_CLASSES"),
        icon: "Group",
        subHeading: moment().format("hh:mm a"),
        _subHeading: { fontWeight: 500, textTransform: "uppercase" },
        avatar: true,
      }}
      subHeader={
        <HStack space="4" justifyContent="space-between">
          <VStack>
            <Text fontSize={"16px"} fontWeight="600">
              {t("THE_CLASSES_YOU_TAKE")}
            </Text>
          </VStack>
        </HStack>
      }
      _subHeader={{ bg: "classCard.500" }}
    >
      <Box bg="white" p="5" mb="4" roundedBottom={"xl"} shadow={2}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          style={{ marginTop: StatusBar.currentHeight }}
        />
      </Box>
    </Layout>
  );
}

const TimeTableRoute = () => {
  const { t } = useTranslation();
  const [dayView, setDayView] = useState(false);
  const [datePage, setDatePage] = useState(0);
  const [weekdays, setWeekdays] = useState([]);

  useEffect(() => {
    if (dayView) {
      setWeekdays([moment()]);
    } else {
      setWeekdays(weekDates());
    }
  }, [dayView]);

  return (
    <Stack space={1}>
      <Box bg="white" pt="30" pb={"25"}>
        <HStack space="4" justifyContent="space-between">
          <DayWiesBar
            _box={{ p: 0 }}
            {...{ page: datePage, setPage: setDatePage }}
          />
          <Stack>
            <Button
              variant="outline"
              colorScheme="button"
              rounded={"full"}
              px="6"
              endIcon={<IconByName name="caret-down" isDisabled />}
              onPress={(e) => setDayView(!dayView)}
            >
              {dayView ? t("TODAY") : t("THIS_WEEK")}
            </Button>
          </Stack>
        </HStack>
      </Box>
      <Box bg={"white"}>
        <HStack space={"7"}>
          <VStack space={"7"} mb="3">
            <Text color="coolGray.400" fontSize="14" fontWeight="700">
              {t("TIME")}
            </Text>
            {timeTables.map((item, index) => (
              <VStack
                space={2}
                key={index}
                justifySelf="center"
                minHeight="100"
              >
                <Text color="gray.800" fontWeight="500" fontSize="16px">
                  {item.from}
                </Text>
                <Text color="coolGray.400" fontWeight="500">
                  {item.to}
                </Text>
              </VStack>
            ))}
          </VStack>
          <ScrollView horizontal={true}>
            <HStack space={"7"}>
              {weekdays.map((date, index1) => (
                <VStack space={"7"} mb="3" key={index1}>
                  <Text color="coolGray.400" fontSize="14" fontWeight="700">
                    {date.format("dddd")}
                  </Text>
                  {timeTables.map((item, index) => (
                    <Box
                      key={index}
                      rounded={"10px"}
                      p="5"
                      {...{
                        ...item._boxMenu,
                        bg: index1
                          ? "gray.100"
                          : item._boxMenu?.bg
                          ? item._boxMenu?.bg
                          : "gray.100",
                      }}
                      minHeight="100"
                    >
                      <Link
                        style={{
                          color: "rgb(63, 63, 70)",
                          textDecoration: "none",
                        }}
                        to={"/subject/subjectId"}
                      >
                        <VStack space={"8px"}>
                          <HStack
                            justifyContent={"space-between"}
                            space="2"
                            alignItems={"center"}
                          >
                            <Text
                              fontSize="16px"
                              fontWeight="600"
                              {...{
                                ...item._text,
                                color: index1 ? "" : item._text?.color,
                              }}
                            >
                              {t(item.title)}
                            </Text>
                            <IconByName
                              name={
                                item?.rightIcon
                                  ? item?.rightIcon
                                  : "angle-double-up"
                              }
                              isDisabled
                              {...{
                                ...item._text,
                                color: index1 ? "" : item._text?.color,
                              }}
                            />
                          </HStack>
                          <Text
                            fontSize="12px"
                            fontWeight="500"
                            {...{
                              ...item._text,
                              color: index1 ? "" : item._text?.color,
                            }}
                          >
                            {t(item?.subTitle)}
                          </Text>
                        </VStack>
                      </Link>
                    </Box>
                  ))}
                </VStack>
              ))}
            </HStack>
          </ScrollView>
        </HStack>
      </Box>
    </Stack>
  );
};

const MyClassRoute = () => {
  const { t } = useTranslation();
  const [classes, setClasses] = useState([]);
  const authId = sessionStorage.getItem("id");

  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      if (!ignore) {
        setClasses(
          await classServiceRegistry.getAll({
            filters: {
              teacherId: {
                eq: authId,
              },
            },
          })
        );
      }
    };
    getData();
  }, [authId]);

  return (
    <Box pb={4} pt="30">
      <VStack space={10}>
        <Widget
          data={classes.map((item, index) => {
            return {
              title: item.className,
              subTitle: t("CLASS_TEACHER"),
              link: generatePath(item.route, { ...{ id: item.id } }),
              _box: {
                style: {
                  background:
                    index % 2 === 0
                      ? "linear-gradient(281.03deg, #FC5858 -21.15%, #F8AF5A 100.04%)"
                      : "linear-gradient(102.88deg, #D7BEE6 -5.88%, #B143F3 116.6%)",
                },
              },
            };
          })}
        />
        <HStack space={2} justifyContent={"center"}>
          <Link
            to={"/classes/attendance/group"}
            style={{
              textDecoration: "none",
              flex: "1",
              textAlign: "center",
            }}
          >
            <Box
              rounded="lg"
              borderColor="button.500"
              borderWidth="1"
              _text={{ color: "button.500" }}
              px={4}
              py={2}
              style={{ textTransform: "uppercase" }}
            >
              {t("CHOOSE_ANOTHER_CLASS")}
            </Box>
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};
