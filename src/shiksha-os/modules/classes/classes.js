import React, { useEffect, useState } from "react";
import { HStack, Text, Button, Stack, Box, IconButton } from "native-base";
import Menu from "../../../components/Menu";
import * as classServiceRegistry from "../../services/classServiceRegistry";
import Header from "../../../components/Header";
import { useTranslation } from "react-i18next";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";

// Start editing here, save and see your changes.
export default function App() {
  const [classes, setClasses] = useState([]);
  const { t } = useTranslation();
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

  const timeTables = [
    { id: "1", leftText: "08:30", title: "Class V, Sec B, Maths" },
    { id: "2", leftText: "09:30", title: "Class V, Sec C, Maths" },
    { id: "3", leftText: "10:30", title: "Free" },
    { id: "4", leftText: "11:30", title: "Free" },
    {
      id: "5",
      leftText: "12:30",
      title: "Class VI, Sec A, Science",
      activeMenu: true,
    },
    { id: "6", leftText: "01:30", title: "Substitution" },
    { id: "7", leftText: "02:30", title: "Free" },
    { id: "8", leftText: "03:30", title: "Class VI, Sec A, Maths" },
  ];

  return (
    <>
      <Header
        icon="Group"
        subHeading={t("THE_CLASSES_YOU_TAKE")}
        button={
          <Button
            variant="outline"
            colorScheme="default"
            background={"#fff"}
            size="container"
            px={1}
            m="3"
          >
            {t("TIME_TABLE")}
          </Button>
        }
      />
      <Stack space={1}>
        <Box backgroundColor="gray.100" p="1">
          <HStack justifyContent="space-between" alignItems="center">
            <HStack space="4" alignItems="center">
              <IconButton
                onPress={(current) => {}}
                size="sm"
                color="primary.500"
                icon={<ArrowCircleLeftOutlinedIcon />}
              />
            </HStack>
            <HStack space="4" alignItems="center">
              <Text color="primary.500" bold={true}>
                {t("TODAYS")}
              </Text>
            </HStack>
            <HStack space="2">
              <IconButton
                onPress={(current) => {}}
                size="sm"
                color={"primary.500"}
                icon={<ArrowCircleRightOutlinedIcon />}
              />
            </HStack>
          </HStack>
          <Box backgroundColor="gray.100" p={1}>
            <Menu items={timeTables} routeDynamics="true" bg={"white"} />
          </Box>
        </Box>
      </Stack>
      <Box backgroundColor="gray.100" p={3}>
        <Box alignItems="center" p={2}>
          <Text color="primary.500" bold={true} textTransform="uppercase">
            {t("YOUR_CLASSES")}
          </Text>
        </Box>
        <Menu items={classes} routeDynamics="true" bg={"white"} />
      </Box>
      {/* <Box>
        <HStack space={2} justifyContent={"right"}>
          <Button
            variant="outline"
            colorScheme="default"
            background={"#fff"}
            size="container"
            px={1}
            m="3"
          >
            {t("SHOW_SUBJECT_WISE")}
          </Button>
        </HStack>
      </Box> */}
    </>
  );
}
