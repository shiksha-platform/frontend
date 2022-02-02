import React, { useEffect, useState } from "react";
import {
  HStack,
  Text,
  VStack,
  Button,
  Stack,
  Box,
  FlatList,
  PresenceTransition,
  Pressable,
  StatusBar,
  Center,
  Progress,
} from "native-base";
import * as studentServiceRegistry from "../../services/studentServiceRegistry";
import * as classServiceRegistry from "../../services/classServiceRegistry";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Menu from "../../../components/Menu";
import Card from "../../../components/students/Card";
import Layout from "../../../layout/Layout";
import IconByName from "../../../components/IconByName";
import { TabView, SceneMap } from "react-native-tab-view";
import { Animated, Dimensions } from "react-native-web";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [classObject, setClassObject] = useState({});
  const { classId } = useParams();
  const fullName = sessionStorage.getItem("fullName");

  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      setStudents(
        await studentServiceRegistry.getAll({
          filters: {
            currentClassID: {
              eq: classId,
            },
          },
        })
      );

      let classObj = await classServiceRegistry.getOne({ id: classId });
      if (!ignore) setClassObject(classObj);
    };
    getData();
  }, [classId]);

  const FirstRoute = () => (
    <Box>
      <Box
        borderBottomWidth="1"
        _dark={{
          borderColor: "gray.600",
        }}
        borderColor="coolGray.200"
        pr="1"
        py="4"
      >
        <Stack space={2}>
          <Collapsible header={t("ASSIGNMENTS")} />
        </Stack>
      </Box>
      <Box
        borderBottomWidth="1"
        _dark={{
          borderColor: "gray.600",
        }}
        borderColor="coolGray.200"
        pr="1"
        py="4"
      >
        <Stack space={2}>
          <Collapsible header={t("LESSON_PLANS")} />
        </Stack>
      </Box>
      <Box pr="1" py="4">
        <Stack space={2}>
          <Collapsible header={t("ASSESSMENTS")} />
        </Stack>
      </Box>
    </Box>
  );
  const SecondRoute = () => <Center flex={1}>This is Tab {t("MATHS")}</Center>;
  const ThirdRoute = () => <Center flex={1}>This is Tab {t("ENGLISH")}</Center>;
  const FourthRoute = () => (
    <Center flex={1}>This is Tab {t("HISTORY")} </Center>
  );
  const FiveRoute = () => (
    <Center flex={1}>This is Tab {t("GEOGRAPHY")} </Center>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute,
    five: FiveRoute,
  });

  const initialLayout = { width: Dimensions.get("window").width };
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: t("SCIENCE") },
    { key: "second", title: t("MATHS") },
    { key: "third", title: t("ENGLISH") },
    { key: "fourth", title: t("HISTORY") },
    { key: "five", title: t("GEOGRAPHY") },
  ]);

  const renderTabBar = (props) => {
    return (
      <Box flexDirection="row">
        {props.navigationState.routes.map((route, i) => {
          const color = index === i ? "button.500" : "coolGray.400";
          const borderColor = index === i ? "button.500" : "coolGray.200";

          return (
            <Box
              key={i}
              borderBottomWidth="3"
              borderColor={borderColor}
              flex={1}
              alignItems="center"
              p="3"
              cursor="pointer"
            >
              <Pressable onPress={() => setIndex(i)}>
                <Animated.Text>
                  <Text color={color}>{route.title}</Text>
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
      imageUrl="https://images.freeimages.com/images/large-previews/51b/school-children-in-india-1438445.jpg"
      _header={{
        title: t("MY_CLASSES"),
        fullRightComponent: (
          <Box minH={"150px"}>
            <Box
              position={"absolute"}
              style={{ backgroundColor: "rgba(24, 24, 27, 0.4)" }}
              bottom={0}
              p={5}
              width={"100%"}
            >
              <VStack>
                <Text color="gray.100" fontWeight="700" fontSize="md">
                  {classObject.className}
                </Text>

                <Text color="gray.100" fontWeight="700" fontSize="2xl">
                  {t("CLASS_DETAILS")}
                </Text>
              </VStack>
            </Box>
          </Box>
        ),
      }}
      subHeader={
        <Menu
          routeDynamics={true}
          items={[
            {
              id: classId,
              keyId: 1,
              title: t("TAKE_ATTENDANCE"),
              icon: "certificate",
              route: "/attendance/:id",
              boxMinW: "200px",
            },
            // {
            //   keyId: 3,
            //   id: classId,
            //   title: t("CLASS_TEST"),
            //   icon: "bars",
            // },
          ]}
          type={"veritical"}
        />
      }
      _subHeader={{
        bottom: "15px",
        bg: "classCard.500",
      }}
    >
      <Stack space={1} mb="2" shadow={2}>
        <Box bg="white" p={4}>
          <Stack space={2}>
            <Collapsible
              defaultCollapse={true}
              header={t("CLASS_ATTENDANCE")}
              body={
                <VStack p="2" space={4}>
                  <Box bg={"gray.100"} rounded={"md"} p="4">
                    <VStack space={2}>
                      <HStack
                        justifyContent={"space-between"}
                        alignItems="center"
                      >
                        <Text bold>{t("STATUS")}</Text>
                        <IconByName name="ellipsis-v" />
                      </HStack>
                      <Progress
                        value={17}
                        max={24}
                        my="4"
                        size={"2xl"}
                        colorScheme="green"
                        bg="button.400"
                      />
                      <HStack
                        justifyContent={"space-between"}
                        alignItems="center"
                      >
                        <Text>{t("GRADE") + ": " + t("GOOD")}</Text>
                        <Text>{t("TOTAL") + ": 24"}</Text>
                      </HStack>
                    </VStack>
                  </Box>
                  <Box
                    rounded="xs"
                    borderWidth="1"
                    px={6}
                    py={2}
                    mt="2"
                    textAlign={"center"}
                    borderColor={"button.500"}
                    _text={{ color: "button.500" }}
                  >
                    {t("ATTENDANCE_REGISTER")}
                  </Box>
                </VStack>
              }
            />
          </Stack>
        </Box>
        <Box bg="white" p={4}>
          <Stack space={2}>
            <Collapsible header={t("REPORTS")} />
          </Stack>
        </Box>

        <Box bg="white" p={4}>
          <Stack space={2}>
            <Collapsible header={t("SMS_REPORTS")} />
          </Stack>
        </Box>

        <Box bg="white" p={4}>
          <Stack space={2}>
            <Collapsible
              defaultCollapse={true}
              isHeaderBold={false}
              header={
                <>
                  <VStack>
                    <Text bold fontSize={"md"}>
                      {t("STUDENTS")}
                    </Text>
                    <Text fontSize={"xs"}>
                      {t("TOTAL") + ": " + students?.length}
                    </Text>
                  </VStack>
                </>
              }
              body={
                <VStack space={2} pt="2">
                  <Box>
                    <FlatList
                      data={students}
                      renderItem={({ item }) => (
                        <Box
                          borderBottomWidth="1"
                          _dark={{
                            borderColor: "gray.600",
                          }}
                          borderColor="coolGray.200"
                          pr="1"
                          py="4"
                        >
                          <Card item={item} href={"/students/" + item.id} />
                        </Box>
                      )}
                      keyExtractor={(item) => item.id}
                    />
                  </Box>
                  <Button mt="2" variant="outline" colorScheme="button">
                    {t("SHOW_ALL_STUDENTS")}
                  </Button>
                </VStack>
              }
            />
          </Stack>
        </Box>

        <Box bg="white" p={4}>
          <Stack space={2}>
            <Collapsible
              defaultCollapse={true}
              header={t("SUBJECTS")}
              body={
                <VStack>
                  <Box>
                    <TabView
                      navigationState={{ index, routes }}
                      renderScene={renderScene}
                      renderTabBar={renderTabBar}
                      onIndexChange={setIndex}
                      initialLayout={initialLayout}
                      style={{ marginTop: StatusBar.currentHeight }}
                    />
                  </Box>
                </VStack>
              }
            />
          </Stack>
        </Box>

        <Box bg="white" p={4}>
          <Stack space={2}>
            <Collapsible
              defaultCollapse={true}
              header={t("CLASS_DETAILS")}
              body={
                <Stack space={2}>
                  <Box bg="white" p={4}>
                    <Stack space={2}>
                      <Collapsible
                        defaultCollapse={true}
                        header={t("SUMMARY")}
                        body={
                          <VStack p="2" space={4}>
                            <Box bg={"gray.100"} rounded={"md"} p="4">
                              <VStack space={2}>
                                <HStack
                                  justifyContent={"space-between"}
                                  alignItems="center"
                                >
                                  <Text bold>{t("CLASS_TEACHER")}</Text>
                                  <IconByName name="ellipsis-v" />
                                </HStack>
                                <Text>
                                  {t("CLASS_TEACHER")} {fullName}
                                </Text>
                              </VStack>
                            </Box>
                            <Box bg={"gray.100"} rounded={"md"} p="4">
                              <VStack space={2}>
                                <HStack
                                  justifyContent={"space-between"}
                                  alignItems="center"
                                >
                                  <Text bold>{t("CLASS_STRENGTH")}</Text>
                                  <IconByName name="ellipsis-v" />
                                </HStack>
                                <HStack space={6} alignItems="center">
                                  <VStack>
                                    <HStack alignItems={"center"} space={1}>
                                      <Box
                                        bg={"info.500"}
                                        p="2"
                                        rounded={"full"}
                                      />
                                      <Text bold>{t("GIRLS")}:</Text>
                                      <Text>
                                        {
                                          students.filter(
                                            (e) => e.gender === "Female"
                                          ).length
                                        }
                                      </Text>
                                    </HStack>
                                    <HStack alignItems={"center"} space={1}>
                                      <Box
                                        bg={"purple.500"}
                                        p="2"
                                        rounded={"full"}
                                      />
                                      <Text bold>{t("BOYS")}:</Text>
                                      <Text>
                                        {
                                          students.filter(
                                            (e) => e.gender === "Male"
                                          ).length
                                        }
                                      </Text>
                                    </HStack>
                                    <Text>
                                      <Text bold>{t("TOTAL")}: </Text>{" "}
                                      {students.length}
                                    </Text>
                                  </VStack>
                                  <Progress
                                    value={
                                      students.filter(
                                        (e) => e.gender === "Male"
                                      ).length
                                    }
                                    max={students.length}
                                    size={"20"}
                                    colorScheme="purple"
                                    bg="info.400"
                                  />
                                </HStack>
                              </VStack>
                            </Box>

                            <Box bg={"gray.100"} rounded={"md"} p="4">
                              <VStack space={2}>
                                <HStack
                                  justifyContent={"space-between"}
                                  alignItems="center"
                                >
                                  <Text bold>{t("AGE_GROUP")}</Text>
                                  <IconByName name="ellipsis-v" />
                                </HStack>
                                <Text>
                                  <Text bold>{t("RANGE")}: </Text>
                                </Text>
                              </VStack>
                            </Box>
                          </VStack>
                        }
                      />
                    </Stack>
                  </Box>

                  <Box bg="white" p={4}>
                    <Stack space={2}>
                      <Collapsible
                        defaultCollapse={true}
                        header={t("CONTACTS_TEACHERS")}
                        body={
                          <VStack p="2" space={4}>
                            <Box bg={"gray.100"} rounded={"md"} p="4">
                              <VStack space={2}>
                                <HStack
                                  justifyContent={"space-between"}
                                  alignItems="center"
                                >
                                  <Text bold>{t("DETAILS")}</Text>
                                  <IconByName name="ellipsis-v" />
                                </HStack>
                                <Text>
                                  <Text bold>{t("MATHS")}: </Text>
                                  {fullName}
                                </Text>
                                <Text>
                                  <Text bold>{t("ENGLISH")}: </Text>
                                  {fullName}
                                </Text>
                                <Text>
                                  <Text bold>{t("SCIENCE")}: </Text>
                                  {fullName}
                                </Text>
                              </VStack>
                            </Box>
                          </VStack>
                        }
                      />
                    </Stack>
                  </Box>

                  <Box bg="white" p={4}>
                    <Stack space={2}>
                      <Collapsible header={t("AWARDS_AND_RECOGNITION")} />
                    </Stack>
                  </Box>

                  <Box bg="white" p={4}>
                    <Stack space={2}>
                      <Collapsible header={t("STUDENT_COMPETENCIES")} />
                    </Stack>
                  </Box>
                </Stack>
              }
            />
          </Stack>
        </Box>
      </Stack>
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
