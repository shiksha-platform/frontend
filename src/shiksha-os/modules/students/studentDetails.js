import React, { useEffect, useState } from "react";
import { Text, Button, Stack, Box } from "native-base";
import * as studentServiceRegistry from "../../services/studentServiceRegistry";
import { useTranslation } from "react-i18next";
import Header from "../../../components/Header";
import { useParams } from "react-router-dom";
import AttendanceComponent from "../../../components/weekDays";
import Menu from "../../../components/Menu";

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
      <Stack p="4" space={2}>
        <Stack>
          <Box borderColor="gray.500">
            <Text fontSize="md" color="primary.500" bold={true}>
              {t("DETAILS")}
            </Text>
          </Box>
          <Box borderWidth={1} p="2" borderColor="gray.500" bg="gray.50">
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
              background="gray.200"
            >
              {t("SEE_MORE")}
            </Button>
          </Box>
        </Stack>

        <Stack>
          <Box borderColor="gray.500">
            <Text fontSize="md" color="primary.500" bold={true}>
              {t("CLASS")}
            </Text>
          </Box>
          <Box borderWidth={1} p="2" borderColor="gray.500" bg="gray.50">
            {studentObject && studentObject?.id ? (
              <AttendanceComponent
                weekPage={0}
                student={studentObject}
                withDate={true}
              />
            ) : (
              <></>
            )}
            <Button
              variant="ghost"
              borderRadius="50"
              colorScheme="default"
              background="gray.200"
            >
              {t("FULL_CLASS_ATTENDANCE")}
            </Button>
          </Box>
        </Stack>

        <Stack>
          <Box>
            <Text fontSize="md" color="primary.500" bold={true}>
              {t("LEARNING")}
            </Text>
          </Box>
          <Menu
            _boxMenu={{ bg: "gray.100", mb: 2 }}
            items={[
              {
                title: t("RESULTS"),
              },
              {
                title: t("COMPETENCY"),
              },
              {
                title: t("AWARDS"),
              },
            ]}
          />
        </Stack>
        <Stack>
          <Box>
            <Text fontSize="md" color="primary.500" bold={true}>
              {t("NOTES")}
            </Text>
          </Box>
          <Menu
            _boxMenu={{ bg: "gray.100", mb: 2 }}
            items={[
              {
                title: t("NOTES_FEEDBACK_ON_STUDENT"),
              },
            ]}
          />
        </Stack>
      </Stack>
    </>
  );
}
