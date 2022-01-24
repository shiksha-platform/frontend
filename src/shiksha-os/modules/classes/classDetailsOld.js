import React, { useEffect, useState } from "react";
import { HStack, Text, Stack, Box } from "native-base";
import Menu from "../../../components/Menu";
import Icon from "../../../components/IconByName";
import * as classServiceRegistry from "../../services/classServiceRegistry";
import Layout from "../../../layout/Layout";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DayWiesBar from "../../../components/CalendarBar";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const [datePage, setDatePage] = useState(0);
  const [classObject, setClassObject] = useState({});
  const { classId } = useParams();
  const [activeColor, setActiveColor] = useState("primary.500");

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

  return (
    <Layout
      header={{
        title: t("MY_CLASSES"),
        icon: datePage < 0 ? "AssignmentTurnedIn" : "Group",
        // heading:"Science",
        // _heading:{ fontSize: "sm" },
        subHeadingComponent: (
          <Link
            to={"/students/class/" + classId}
            style={{ color: "rgb(63, 63, 70)", textDecoration: "none" }}
          >
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
                <Text fontSize={"lg"}>{classObject?.title ?? ""}</Text>
                <Icon size="sm" name="ArrowForwardIos" />
              </HStack>
            </Box>
          </Link>
        ),
      }}
    >
      <Stack space={1}>
        <DayWiesBar
          {...{
            activeColor,
            setActiveColor,
            page: datePage,
            setPage: setDatePage,
          }}
        />
      </Stack>
      <Menu
        _box={{ p: 3 }}
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
            title: t("ATTENDANCE"),
            icon: datePage < 0 ? "AssignmentTurnedIn" : "EventNote",
            route: "/attendance/:id",
          },
          // {
          //   keyId: 2,
          //   id: classId,
          //   title: t("LESSON_PLAN"),
          //   icon: "AppRegistration",
          // },
          // {
          //   keyId: 3,
          //   id: classId,
          //   title: t("CLASS_TEST"),
          //   icon: "MenuBook",
          // },
        ]}
        type={"veritical"}
      />

      <Box bg="coolGray.200" p="5">
        <Text color={activeColor} bold={true} pb="1">
          {classObject?.title ?? ""}
        </Text>
        <Menu
          _boxMenu={{ bg: "white", mb: 2 }}
          items={[
            {
              title: t("ATTENDANCE_REPORTS"),
            },
            {
              title: t("ATTENDANCE_NOTIFICATIONS"),
            },
          ]}
        />
      </Box>
    </Layout>
  );
}
