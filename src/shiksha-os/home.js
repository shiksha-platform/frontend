import React, { useEffect, useState } from "react";
import { Text, Box, Stack, VStack, HStack } from "native-base";
import manifest from "./manifest";
import Menu from "../components/Menu";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import * as classServiceRegistry from "../shiksha-os/services/classServiceRegistry";
// import * as studentServiceRegistry from "../shiksha-os/services/studentServiceRegistry";
// import * as attendanceServiceRegistry from "../services/attendanceServiceRegistry";

// Start editing here, save and see your changes.
export default function Home() {
  const menus = manifest.menus.main;
  const { t } = useTranslation();
  const firstName = sessionStorage.getItem("firstName");
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const authId = sessionStorage.getItem("id");
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      if (!ignore) {
        let resultClasses = await classServiceRegistry.getAll({
          filters: {
            teacherId: {
              eq: authId,
            },
          },
        });
        setClasses(resultClasses);
        // let redultStudents = await studentServiceRegistry.getAll({
        //   filters: {
        //     currentClassID: {
        //       in: resultClasses.map((e) => e.id),
        //     },
        //   },
        // });
        // setStudents(redultStudents);
        // const attendanceData = await attendanceServiceRegistry.getAll({
        //   classId: {
        //     in: redultStudents.map((e) => e.id),
        //   },
        // });
        // console.log({ attendanceData });
        // setAttendance(attendanceData);
      }
    };
    getData();
  }, [authId]);

  return (
    <>
      <Header
        title={t("MY_SCHOOL_APP")}
        isEnableHamburgerMenuButton={true}
        isEnableLanguageMenu={true}
        icon="InsertEmoticon"
        heading={t("GOOD_MORNING") + ", " + firstName}
        subHeading={t("THIS_IS_HOW_YOUR_DAY_LOOKS")}
        _box={{ backgroundColor: "lightBlue.100" }}
        _icon={{ color: "black" }}
        _heading={{ color: "black" }}
        _subHeading={{ color: "black" }}
      />
      <Box backgroundColor="lightBlue.100" m={3} p={3}>
        <Stack space={3}>
          <VStack>
            <HStack justifyContent={"space-between"}>
              <Text color="green.700" bold={true}>
                {t("TODAY")}
              </Text>
            </HStack>
            <Stack>
              <VStack>
                <Text>
                  {t("YOU_HAVE_3_CLASSES").replace(
                    "3",
                    classes?.length ? classes?.length : "3"
                  )}
                </Text>
                <Text>{t("STUDENT_PROFILE_IN_COMPLETE")}</Text>
                <Text>{t("NEW_ACTIVITY_ADDED_TO_SCHOOL")}</Text>
              </VStack>
            </Stack>
          </VStack>
          <VStack>
            <HStack justifyContent={"space-between"}>
              <Text color="green.700" bold={true}>
                {t("THIS_WEEK")}
              </Text>
            </HStack>
            <HStack space={2}>
              <Text>{t("2_SCHOOL_ACTIVITIES_1_OFFICIAL_VISIT")}</Text>
            </HStack>
          </VStack>
        </Stack>
      </Box>
      <Box backgroundColor="blue.300" p="3">
        <Menu bg="white" items={menus} />
      </Box>
    </>
  );
}
