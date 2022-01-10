import React from "react";
import { Text, Box } from "native-base";
import manifest from "./manifest";
import Menu from "../components/Menu";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";

// Start editing here, save and see your changes.
export default function Home() {
  const menus = manifest.menus.main;
  const { t } = useTranslation();
  const firstName = sessionStorage.getItem("firstName");

  return (
    <>
      <Header
        icon="InsertEmoticon"
        heading={t("GOOD_MORNING") + ", " + firstName}
        subHeading={t("THIS_IS_HOW_YOUR_DAY_LOOKS")}
        _box={{ backgroundColor: "lightBlue.100" }}
        _icon={{ color: "black" }}
        _heading={{ color: "black" }}
        _subHeading={{ color: "black" }}
      />
      <Box backgroundColor="white" p={3}>
        <Text color="green.700" bold={true}>
          {t("TODAY")}
        </Text>
        {/* <Stack>
          <VStack>
            <Text>{t("YOU_HAVE_3_CLASSES")}</Text>
            <Text>{t("STUDENT_PROFILE_IN_COMPLETE")}</Text>
            <HStack space={2}>
              <Text>{t("NEW_ACTIVITY_ADDED_TO_SCHOOL")}</Text>
              <Button
                variant="outline"
                colorScheme="default"
                background={"#fff"}
                size="container"
                px={1}
              >
                {t("TIME_TABLE")}
              </Button>
            </HStack>
          </VStack>
        </Stack> */}
      </Box>
      <Box backgroundColor="lightBlue.100" m={3} p={3}>
        <Text color="green.700" bold={true}>
          {t("THIS_WEEK")}
        </Text>
        {/* <HStack space={2}>
          <Text>{t("2_SCHOOL_ACTIVITIES_1_OFFICIAL_VISIT")}</Text>
          <Button
            variant="outline"
            colorScheme="default"
            background={"#fff"}
            size="container"
            px={1}
          >
            {t("TIME_TABLE")}
          </Button>
        </HStack> */}
      </Box>
      <Box backgroundColor="blue.300" p="3">
        <Menu bg="white" items={menus} />
      </Box>
    </>
  );
}
