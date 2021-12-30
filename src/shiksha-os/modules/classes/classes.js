import React, { useEffect, useState } from "react";
import { HStack, Text, VStack, Button, Stack, Box } from "native-base";
import Menu from "../../../components/Menu";
import * as classServiceRegistry from "../../services/classServiceRegistry";
import Header from "../../../components/Header";
import { useTranslation } from "react-i18next";

// Start editing here, save and see your changes.
export default function App() {
  const [classes, setClasses] = useState([]);
  const { t } = useTranslation();
  const authId = sessionStorage.getItem("id");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setClasses(
      await classServiceRegistry.getAll({
        filters: {
          teacherId: {
            eq: authId,
          },
        },
      })
    );
  };

  return (
    <>
      <Header
        icon="Group"
        heading={t("THE_PAGE_SHOWS")}
        subHeading={t("THE_CLASSES_YOU_TAKE")}
      />
      <Box backgroundColor="gray.100" p={3}>
        <Text color="primary.500" bold={true} textTransform="uppercase">
          {t("TODAYS_CLASSES")}
        </Text>
        {/* <Stack>
          <VStack>
            <Text>
              10:30-11:20 Maths, VI A <Text bold>NOW</Text>
            </Text>
            <Text>
              1:30-2:40 Substitution, V B <Text bold>NEW</Text>
            </Text>
            <HStack space={2} justifyContent={"right"}>
              <Button
                variant="outline"
                colorScheme="default"
                background={"#fff"}
                size="container"
                px={1}
              >
                {t("MY_CLASSES")}
              </Button>
            </HStack>
          </VStack>
        </Stack> */}
      </Box>
      <Menu items={classes} routeDynamics="true" />
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
