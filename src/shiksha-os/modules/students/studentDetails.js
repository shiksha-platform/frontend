import React, { useEffect, useState } from "react";
import { Text, Button, Stack, Box, Link, VStack, HStack } from "native-base";
import * as studentServiceRegistry from "../../services/studentServiceRegistry";
import * as classServiceRegistry from "../../services/classServiceRegistry";
import { useTranslation } from "react-i18next";
import Header from "../../../components/Header";
import { useParams } from "react-router-dom";
import AttendanceComponent from "../../../components/attendance/AttendanceComponent";
import Menu from "../../../components/Menu";
import Icon from "../../../components/IconByName";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const [studentObject, setStudentObject] = useState({});
  const [classObject, setClassObject] = useState({});
  const { studentId } = useParams();

  useEffect(() => {
    let ignore = false;

    const getData = async () => {
      let student = await studentServiceRegistry.getOne({ id: studentId });

      let classObj = await classServiceRegistry.getOne({
        id: student.currentClassID,
      });
      if (!ignore) {
        setStudentObject({ ...student, className: classObj.className });
        setClassObject(classObj);
      }
    };
    getData();
  }, [studentId]);

  return (
    <>
      <Header
        title={t("STUDENTS_DETAIL")}
        icon="Group"
        heading={
          studentObject?.fullName ? (
            studentObject?.fullName
          ) : (
            <Text italic>{t("NOT_ENTERD")}</Text>
          )
        }
        subHeading=""
      />
      <Stack p="4" space={2}>
        <Stack>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Box borderColor="gray.500">
              <Text fontSize="md" color="primary.500" bold={true}>
                {t("DETAILS")}
              </Text>
            </Box>
            <Link href={"/students/" + studentObject.id + "/edit"}>
              <Icon size="sm" color="gray.900" name="Edit" />
            </Link>
          </HStack>
          <Box borderWidth={1} p="2" borderColor="gray.500" bg="gray.50">
            <Text>
              <Text bold>{t("ADDRESS")} </Text>
              {studentObject.address ? (
                studentObject.address
              ) : (
                <Text italic>{t("NOT_ENTERD")}</Text>
              )}
            </Text>
            <Text>
              <Text bold>{t("FATHERS_NAME")} </Text>
              {studentObject.fathersName ? (
                studentObject.fathersName
              ) : (
                <Text italic>{t("NOT_ENTERD")}</Text>
              )}
            </Text>
            <Text>
              <Text bold>{t("ADMISSION_NO")} </Text>
              {studentObject.admissionNo ? (
                studentObject.admissionNo
              ) : (
                <Text italic>{t("NOT_ENTERD")}</Text>
              )}
            </Text>
            <Text>
              <Text bold>{t("STUDYING_IN")} </Text>
              {studentObject.className ? (
                studentObject.className
              ) : studentObject.currentClassID ? (
                studentObject.currentClassID
              ) : (
                <Text italic>{t("NOT_ENTERD")}</Text>
              )}
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
              {t("CLASS")} {classObject.className}
            </Text>
          </Box>
          <Box borderWidth={1} p="2" borderColor="gray.500" bg="gray.50">
            <VStack space={2}>
              {studentObject && studentObject?.id ? (
                <AttendanceComponent
                  weekPage={0}
                  student={studentObject}
                  withDate={true}
                  hidePopUpButton={true}
                  withApigetAttendance={true}
                  _card={{
                    textTitle: (
                      <Text fontSize={"lg"}>{t("WEEK_ATTENDANCE")}</Text>
                    ),
                    _textSubTitle: { display: "none" },
                  }}
                />
              ) : (
                <></>
              )}
              <Box alignItems={"center"}>
                <Link href={"/attendance/" + studentObject.currentClassID}>
                  <Button
                    variant="ghost"
                    borderRadius="50"
                    colorScheme="default"
                    background="gray.200"
                  >
                    {t("FULL_CLASS_ATTENDANCE")}
                  </Button>
                </Link>
              </Box>
            </VStack>
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
