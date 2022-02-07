import React, { useEffect, useState } from "react";
import { HStack, Text, Stack, Box, VStack, Button } from "native-base";
import Menu from "../../../components/Menu";
import Icon from "../../../components/IconByName";
import * as classServiceRegistry from "../../services/classServiceRegistry";
import Layout from "../../../layout/Layout";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DayWiesBar from "../../../components/CalendarBar";
import IconByName from "../../../components/IconByName";

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
      imageUrl={window.location.origin + "/class.png"}
      _header={{
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
                  {"Class VI • Sec A"}
                </Text>

                <Text color="gray.100" fontWeight="700" fontSize="2xl">
                  {t("MY_CLASSES")}
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
              icon: "CalendarCheckLineIcon",
              _text: { fontSize: 12, lineHeight: 15 },
              // route: "/attendance/:id",
            },
            {
              keyId: 2,
              id: classId,
              title: t("LESSON_PLAN"),
              icon: "paste",
              _text: { fontSize: 12, lineHeight: 15 },
            },
            {
              keyId: 3,
              id: classId,
              title: t("CLASS_TEST"),
              icon: "brain",
              _text: { fontSize: 12, lineHeight: 15 },
            },
          ]}
          type={"veritical"}
        />
      }
      _subHeader={{
        bottom: "15px",
        bg: "classCard.500",
      }}
    >
      <Box bg="white" p="5" pt="30" pb={"25"} roundedBottom="2xl" shadow={3}>
        <VStack space={2}>
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
                endIcon={<IconByName name="ArrowDownSLineIcon" isDisabled />}
              >
                {t("SCIENCE")}
              </Button>
            </Stack>
          </HStack>
          <Text color={activeColor} bold={true} pb="1">
            {classObject?.title ?? ""}
          </Text>
          <Menu
            _boxMenu={{ bg: "white", mb: 2, p: "5" }}
            items={[
              {
                title: t("ASSIGNMENTS"),
              },
              {
                title: t("LESSON_PLANS"),
              },
              {
                title: t("NOTES"),
              },
            ]}
          />
        </VStack>
      </Box>
    </Layout>
  );
}
