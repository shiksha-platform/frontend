import React, { useEffect, useState } from "react";
import { HStack, Text, Stack, Box } from "native-base";
import Menu from "../../../components/Menu";
import Icon from "../../../components/IconByName";
import * as classServiceRegistry from "../../services/classServiceRegistry";
import Header from "../../../components/Header";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const todayDate = new Date();
  const [classObject, setClassObject] = useState({});
  const { classId } = useParams();

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
    <>
      <Header icon="Group" heading={classObject?.title ?? ""} />
      <Stack space={1}>
        <Box bg="white" p="1">
          <HStack justifyContent="space-between" alignItems="center">
            <HStack space="4" alignItems="center">
              <Icon
                size="sm"
                color="primary.500"
                name="ArrowCircleLeftOutlined"
              />
            </HStack>
            <HStack space="4" alignItems="center">
              <Text fontSize="md" bold textTransform="uppercase">
                {t("TODAY")}{" "}
                {(todayDate.getHours() > 12
                  ? todayDate.getHours() - 12
                  : todayDate.getHours()) +
                  ":" +
                  todayDate.getMinutes()}{" "}
                ({t("NOW")})
              </Text>
            </HStack>
            <HStack space="2">
              <Icon
                size="sm"
                color="primary.500"
                name="ArrowCircleRightOutlined"
              />
            </HStack>
          </HStack>
        </Box>
      </Stack>
      <Menu
        routeDynamics={true}
        items={[
          {
            id: classId,
            title: t("MARK_ATTENDANCE"),
            icon: "EventNote",
            route: "/attendance/:id",
          },
          {
            id: classId,
            title: t("STUDENTS_LIST"),
            icon: "Person",
            route: "/students/class/:id",
          },
        ]}
        type={"veritical"}
      />
    </>
  );
}
