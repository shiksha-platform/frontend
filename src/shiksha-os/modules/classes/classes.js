import React, { useEffect, useState } from "react";
import { Text, Button, Box, HStack, VStack, Stack } from "native-base";
import Menu from "../../../components/Menu";
import * as classServiceRegistry from "../../services/classServiceRegistry";
import Header from "../../../components/Header";
import { useTranslation } from "react-i18next";
import DayWiesBar from "../../../components/CalendarBar";
import { Link } from "react-router-dom";

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
      leftText: "08:30",
      title: "Class V, Sec B, Maths",
      _boxMenu: { bg: "coolGray.200" },
    },
    {
      id: "2",
      leftText: "09:30",
      title: "Class V, Sec C, Maths",
      _boxMenu: { bg: "coolGray.200" },
    },
    {
      id: "3",
      leftText: "10:30",
      title: "Special dance Mid group",
      rightIcon: "MoreVert",
      _boxMenu: { bg: "coolGray.200" },
    },
    {
      id: "4",
      leftText: "11:30",
      title: "Free",
      rightIcon: "MoreVert",
      _boxMenu: { bg: "coolGray.200" },
    },
    {
      id: "5",
      leftText: "12:30",
      title: "Class VI, Sec A, Science",
      activeMenu: true,
    },
    {
      id: "6",
      leftText: "01:30",
      title: "Substitution",
      rightIcon: "MoreVert",
    },
    { id: "7", leftText: "02:30", title: "Free", rightIcon: "MoreVert" },
    { id: "8", leftText: "03:30", title: "Class VI, Sec A, Maths" },
  ];

  return (
    <>
      <Header
        title={t("MY_CLASSES")}
        icon="Group"
        subHeading={t("THE_CLASSES_YOU_TAKE")}
        button={
          <Button
            variant="outline"
            rounded={"full"}
            colorScheme="gray"
            background={"coolGray.50"}
            size="container"
            px={3}
            mr="3"
          >
            {t("TIME_TABLE")}
          </Button>
        }
      />
      <Box backgroundColor="gray.100" p="1">
        <DayWiesBar
          _box={{ bg: "gray.100", p: 0 }}
          activeColor="primary.500"
          {...{ page: datePage, setPage: setDatePage }}
        />
        <Box backgroundColor="gray.100" p={1}>
          <Menu items={timeTables} routeDynamics="true" bg={"white"} />
        </Box>
      </Box>
      <Box backgroundColor="gray.100" px={2} pb={4}>
        <VStack space={2}>
          <Box alignItems="center">
            <Text color="primary.500" bold={true}>
              {t("YOUR_CLASSES")}
            </Text>
          </Box>
          <Stack>
            <Menu items={classes} routeDynamics="true" bg={"white"} />
          </Stack>
          <HStack space={2} justifyContent={"center"}>
            <Link
              to={"/classes/attendance/group"}
              style={{ textDecoration: "none" }}
            >
              <Box
                rounded="full"
                borderColor="coolGray.200"
                borderWidth="1"
                bg="white"
                px={4}
                py={2}
              >
                {t("MARK_ATTENDANCE")}
              </Box>
            </Link>
          </HStack>
        </VStack>
      </Box>
    </>
  );
}
