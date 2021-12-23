import React from "react";
import { HStack, Text, VStack, Button, Stack, Box } from "native-base";
import manifest from "./manifest";
import Menu from "../components/Menu";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";

// Start editing here, save and see your changes.
export default function Home() {
  const menus = manifest.menus.main;
  const { t } = useTranslation();

  return (
    <>
      <Header
        icon="InsertEmoticon"
        heading={t("Good Morning, Sheetal!")}
        subHeading={t("This is how your day looks...")}
        _box={{ backgroundColor: "lightBlue.100" }}
        _icon={{ color: "black" }}
        _heading={{ color: "black" }}
        _subHeading={{ color: "black" }}
      />
      <Box backgroundColor="white" p={3}>
        <Text color="green.700" bold={true}>
          {t("TODAY")}
        </Text>
        <Stack>
          <VStack>
            <Text>{t("you have 3 classes")}</Text>
            <Text>{t("21 student profile in complete")}</Text>
            <HStack space={2}>
              <Text>{t("New 1 activity added to school")}</Text>
              <Button
                variant="outline"
                colorScheme="default"
                background={"#fff"}
                size="container"
                px={1}
              >
                {t("Time table")}
              </Button>
            </HStack>
          </VStack>
        </Stack>
      </Box>
      <Box backgroundColor="lightBlue.100" m={3} p={3}>
        <Text color="green.700" bold={true}>
          {t("THIS WEEK")}
        </Text>
        <HStack space={2}>
          <Text>{t("2 school activities, 1 official visit")}</Text>
          <Button
            variant="outline"
            colorScheme="default"
            background={"#fff"}
            size="container"
            px={1}
          >
            {t("Time table")}
          </Button>
        </HStack>
      </Box>
      <Box backgroundColor="blue.300" p="3">
        <Menu bg="white" items={menus} />
      </Box>
    </>
  );
}
