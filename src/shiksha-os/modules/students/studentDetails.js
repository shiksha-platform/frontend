import React, { useEffect, useState } from "react";
import {
  HStack,
  Text,
  VStack,
  Button,
  Stack,
  Box,
  ScrollView,
} from "native-base";
import * as studentServiceRegistry from "../../services/studentServiceRegistry";
import { useTranslation } from "react-i18next";
import Header from "../../../components/Header";
import { useParams } from "react-router-dom";
import AttendanceComponent from "../../../helper/weekDays";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const [studentObject, setStudentObject] = useState({});
  const { studentId } = useParams();

  useEffect(() => {
    let ignore = false;

    const getData = async () => {
      let student = await studentServiceRegistry.getOne({ id: studentId });
      if (!ignore) setStudentObject(student);
    };
    getData();
  }, [studentId]);

  return (
    <>
      <Header
        icon="Group"
        heading={studentObject?.fullName ?? ""}
        subHeading=""
      />
      <Stack p="4" space={1}>
        <Stack space={2}>
          <Text color="primary.500" bold={true}>
            {t("DETAILS")}
          </Text>
        </Stack>
        <Text>
          <Text bold>{t("ADDRESS")} </Text>
        </Text>

        <Text>
          <Text bold>{t("FATHERS_NAME")} </Text>
          {studentObject.fathersName}
        </Text>
        <Text>
          <Text bold>{t("ADMISSION_NO")} </Text>
          {studentObject.admissionNo}
        </Text>
        <Text>
          <Text bold>{t("STUDYING_IN")} </Text>
          {studentObject.currentClassID}
        </Text>
        <Button
          variant="ghost"
          borderRadius="50"
          colorScheme="default"
          background="gray.100"
          position="absolute"
          bottom="2"
          right="2"
        >
          {t("SEE_MORE")}
        </Button>
      </Stack>
      <Stack p="4" space={1}>
        <Stack space={2}>
          <Text color="primary.500" bold={true}>
            {t("CLASS")}
          </Text>
        </Stack>
        <Box borderWidth={1} p="2" borderColor="gray.500" bg="gray.50">
          <ScrollView horizontal={true} _contentContainerStyle={{ mb: "4" }}>
            <HStack
              space={3}
              justifyContent="space-between"
              alignItems="center"
            >
              <VStack>
                <Text> </Text>
                <Text color="coolGray.800" bold>
                  {t("WEEK_ATTENDANCE")}
                </Text>
              </VStack>
              <VStack space="2">
                <HStack>
                  {studentObject && studentObject?.id ? (
                    <AttendanceComponent
                      weekPage={0}
                      student={studentObject}
                      withDate={true}
                    />
                  ) : (
                    <></>
                  )}
                </HStack>
              </VStack>
            </HStack>
          </ScrollView>
          <Button
            variant="ghost"
            borderRadius="50"
            colorScheme="default"
            background="gray.100"
          >
            {t("FULL_CLASS_ATTENDANCE")}
          </Button>
        </Box>
      </Stack>
    </>
  );
}
