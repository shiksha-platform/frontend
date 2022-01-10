import React, { useEffect, useState } from "react";
import { HStack, Text, Stack, Box, Link } from "native-base";
import Menu from "../../../components/Menu";
import Icon from "../../../components/IconByName";
import * as classServiceRegistry from "../../services/classServiceRegistry";
import Header from "../../../components/Header";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const todayDate = new Date();
  const [date, setDate] = useState();
  const [datePage, setDatePage] = useState(0);
  const [classObject, setClassObject] = useState({});
  const { classId } = useParams();
  const [activeColor, setActiveColor] = useState("primary.500");

  const formatDate = (date, type) => {
    if (type === "Today") {
      return (
        moment(date).format("Do MMM, ddd, HH:MM") + " (" + t("TODAY") + ")"
      );
    } else if (type === "Tomorrow") {
      return moment(date).format("Do MMM, ddd") + " (" + t("TOMORROW") + ")";
    } else if (type === "Yesterday") {
      return moment(date).format("Do MMM, ddd") + " (" + t("YESTERDAY") + ")";
    } else {
      return moment(date).format("Do MMM, ddd");
    }
  };

  useEffect(() => {
    let ignore = false;

    const getData = async () => {
      let classObj = await classServiceRegistry.getOne({ id: classId });
      if (!ignore) setClassObject(classObj);
    };
    getData();
    return () => {
      ignore = true;
    };
  }, [classId]);

  useEffect(() => {
    setDate(new Date(todayDate.setDate(todayDate.getDate() + datePage)));
    setActiveColor(datePage === 0 ? "primary.500" : "coolGray.500");
  }, [datePage]);

  return (
    <>
      <Header
        icon="Group"
        heading={"Science"}
        _heading={{ fontSize: "xl" }}
        subHeadingComponent={
          <Link href={"/students/class/" + classId}>
            <Box
              rounded="full"
              borderColor="coolGray.200"
              borderWidth="1"
              bg="white"
              px={1}
            >
              <HStack
                space="4"
                justifyContent="space-between"
                alignItems="center"
              >
                <Icon size="sm" name="Group" />
                {classObject?.title ?? ""}
                <Icon size="sm" name="ArrowForwardIos" />
              </HStack>
            </Box>
          </Link>
        }
      />
      <Stack space={1}>
        <Box bg="white" p="1">
          <HStack justifyContent="space-between" alignItems="center">
            <HStack space="4" alignItems="center">
              <Icon
                size="sm"
                color={activeColor}
                name="ArrowCircleLeftOutlined"
                onPress={(e) => setDatePage(datePage - 1)}
              />
            </HStack>
            <HStack space="4" alignItems="center">
              <Text fontSize="md" bold>
                {formatDate(
                  date,
                  datePage === 0
                    ? "Today"
                    : datePage === 1
                    ? "Tomorrow"
                    : datePage === -1
                    ? "Yesterday"
                    : ""
                )}
              </Text>
            </HStack>
            <HStack space="2">
              <Icon
                size="sm"
                color={activeColor}
                name="ArrowCircleRightOutlined"
                onPress={(e) => setDatePage(datePage + 1)}
              />
            </HStack>
          </HStack>
        </Box>
      </Stack>
      <Menu
        _box={{ p: 5 }}
        _icon={{
          color: activeColor,
          _icon: {
            style: {
              fontSize: "35px",
              border: "2px solid",
              borderColor: activeColor,
              borderRadius: "50%",
              padding: "20px",
            },
          },
        }}
        routeDynamics={true}
        items={[
          {
            id: classId,
            keyId: 1,
            title: t("MARK_ATTENDANCE"),
            icon: "EventNote",
            route: "/attendance/:id",
          },
          {
            keyId: 2,
            id: classId,
            title: t("LESSON_PLAN"),
            icon: "AppRegistration",
          },
          {
            keyId: 3,
            id: classId,
            title: t("CLASS_TEST"),
            icon: "MenuBook",
          },
        ]}
        type={"veritical"}
      />

      <Box bg="coolGray.200" p="5">
        <Text color={activeColor} bold={true} pb="1">
          {classObject?.title ?? ""}
        </Text>
        <Menu
          _boxMenu={{ bg: "white", mb: 2 }}
          routeDynamics={true}
          items={[
            {
              title: t("PREVIOUS_ASSIGNMENTS"),
            },
            {
              title: t("LESSON_PLAN"),
            },
            {
              title: t("COURSE_MATERIAL"),
            },
            {
              title: t("MY_NOTES"),
            },
          ]}
        />
      </Box>
    </>
  );
}
