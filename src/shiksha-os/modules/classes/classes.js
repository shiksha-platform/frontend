import React, { useEffect, useState } from "react";
import {
  Text,
  Box,
  HStack,
  VStack,
  Stack,
  Pressable,
  StatusBar,
  FlatList,
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

// Start editing here, save and see your changes.
export default function App() {
  const [classes, setClasses] = useState([]);
  const { t } = useTranslation();
  const authId = sessionStorage.getItem("id");
  const [datePage, setDatePage] = useState(0);

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

  const timeTables = [
    {
      id: "1",
      from: "08:30",
      to: "09:25",
      title: "Mathematics",
      subTitle: "Class V, Sec B",
      _boxMenu: { bg: "red.50", borderWidth: 1, borderColor: "red.100" },
    },
    {
      id: "2",
      from: "09:30",
      to: "10:25",
      title: "Mathematics",
      subTitle: "Class V, Sec C",
      _boxMenu: { bg: "red.50", borderWidth: 1, borderColor: "red.100" },
    },
    {
      id: "3",
      from: "10:30",
      to: "11:25",
      title: "Special dance Mid group",
      subTitle: "N/A",
      rightIcon: "ellipsis-v",
      _boxMenu: { bg: "red.50", borderWidth: 1, borderColor: "red.100" },
    },
    {
      id: "4",
      from: "11:30",
      to: "12:25",
      title: "Free",
      subTitle: "N/A",
      rightIcon: "ellipsis-v",
      _boxMenu: { bg: "red.50", borderWidth: 1, borderColor: "red.100" },
    },
    {
      id: "5",
      from: "12:30",
      to: "01:25",
      title: "Science",
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
      from: "01:30",
      to: "02:25",
      title: "Substitution",
      subTitle: "N/A",
      rightIcon: "ellipsis-v",
    },
    {
      id: "7",
      from: "02:30",
      to: "03:25",
      title: "Free",
      subTitle: "N/A",
      rightIcon: "ellipsis-v",
    },
    {
      id: "8",
      from: "03:30",
      to: "04:25",
      title: "Mathematics",
      subTitle: "Class VI, Sec A",
    },
  ];

  const timeTableRoute = () => (
    <Stack space={1}>
      <Box bg="white" pt="30" pb={"25"}>
        <HStack space="4" justifyContent="space-between">
          <DayWiesBar
            _box={{ p: 0 }}
            {...{ page: datePage, setPage: setDatePage }}
          />
          <Stack>
            <Box
              variant="rounded"
              borderWidth={1}
              py={2}
              px={4}
              borderColor={"red.400"}
              _text={{ color: "red.400" }}
              rounded={"full"}
            >
              {t("TODAY")}
            </Box>
          </Stack>
        </HStack>
      </Box>
      <Box bg={"white"}>
        <FlatList
          data={timeTables}
          renderItem={({ item }) => (
            <HStack space={"7"} mb="3">
              <VStack space={2}>
                <Text color="gray.800" fontWeight="500" fontSize="16px">
                  {item.from}
                </Text>
                <Text color="coolGray.400" fontWeight="500">
                  {item.to}
                </Text>
              </VStack>
              <Box
                bg={"gray.100"}
                rounded={"10px"}
                p="5"
                flex={"auto"}
                {...item._boxMenu}
              >
                <VStack space={"8px"}>
                  <HStack justifyContent={"space-between"}>
                    <Text fontSize="16px" fontWeight="600" {...item._text}>
                      {item.title}
                    </Text>
                    <IconByName
                      name={
                        item?.rightIcon ? item?.rightIcon : "angle-double-up"
                      }
                      isDisabled
                      {...item._text}
                    />
                  </HStack>
                  <Text fontSize="12px" fontWeight="500" {...item._text}>
                    {t(item?.subTitle)}
                  </Text>
                </VStack>
              </Box>
            </HStack>
          )}
          keyExtractor={(item, index) => (item.id ? item.id : index)}
        />
      </Box>
    </Stack>
  );

  const myClassRoute = () => (
    <Box pb={4} pt="30">
      <VStack space={10}>
        <Widget
          key={index}
          data={classes.map((item, index) => {
            return {
              title: item.className,
              subTitle: "Class Teacher",
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
              flex: "auto",
              textAlign: "center",
            }}
          >
            <Box
              rounded="lg"
              borderColor="red.500"
              borderWidth="1"
              _text={{ color: "red.500" }}
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

  const renderScene = SceneMap({
    first: myClassRoute,
    second: timeTableRoute,
  });

  const initialLayout = { width: Dimensions.get("window").width };
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: t("MY_CLASSES") },
    { key: "second", title: t("TIME_TABLE") },
  ]);

  const renderTabBar = (props) => {
    return (
      <Box flexDirection="row">
        {props.navigationState.routes.map((route, i) => {
          return (
            <Box
              borderBottomWidth="3"
              borderColor={index === i ? "red.500" : "coolGray.200"}
              flex={1}
              alignItems="center"
              p="3"
              cursor="pointer"
              key={i}
            >
              <Pressable onPress={() => setIndex(i)}>
                <Animated.Text
                  style={{ color: index === i ? "red" : "#a1a1aa" }}
                >
                  {route.title}
                </Animated.Text>
              </Pressable>
            </Box>
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
        _subHeading: { fontWeight: 500 },
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
      _subHeader={{ bg: "lightBlue.200" }}
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
