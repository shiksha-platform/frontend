import React, { useEffect, useState } from "react";
import {
  Text,
  Button,
  Stack,
  Box,
  VStack,
  HStack,
  Pressable,
  PresenceTransition,
} from "native-base";
import * as teacherServiceRegistry from "../../services/teacherServiceRegistry";
import { useTranslation } from "react-i18next";
import Layout from "../../../layout/Layout";
import { Link } from "react-router-dom";
import StudentEdit from "./../students/StudentEdit";
import IconByName from "../../../components/IconByName";
import Menu from "../../../components/Menu";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const [teacherObject, setTeacherObject] = useState({});
  const teacherId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = React.useState(false);

  useEffect(() => {
    let ignore = false;

    const getData = async () => {
      const resultTeacher = await teacherServiceRegistry.getOne(
        {},
        { Authorization: "Bearer " + token }
      );
      if (!ignore) {
        setTeacherObject(resultTeacher);
      }
    };
    getData();
  }, [teacherId, token]);

  return (
    <Layout
      {...{ showModal, setShowModal }}
      imageUrl={window.location.origin + "/class.png"}
      _header={{
        title: t("MY_CLASSES"),
        fullRightComponent: (
          <Box minH={"150px"}>
            <Box
              position={"absolute"}
              style={{ backgroundColor: "rgba(24, 24, 27, 0.4)" }}
              bottom={0}
              p={5}
              width={"100%"}
            >
              <HStack alignItems="center" justifyContent="space-between">
                <VStack>
                  <Text color="gray.100" fontWeight="700" fontSize="md">
                    {t("MY_PROFILE")}
                  </Text>

                  <Text color="gray.100" fontWeight="700" fontSize="2xl">
                    {teacherObject.fullName}
                  </Text>
                </VStack>
                <HStack>
                  <IconByName color="white" name="CameraLineIcon" />
                  <IconByName color="white" name="ShareLineIcon" />
                </HStack>
              </HStack>
            </Box>
          </Box>
        ),
      }}
      subHeader={
        <Menu
          routeDynamics={true}
          items={[
            {
              keyId: 1,
              title: t("TAKE_ATTENDANCE"),
              icon: "CalendarCheckLineIcon",
              boxMinW: "200px",
              onPress: (e) => setShowModal(!showModal),
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
      <Stack space={2}>
        <Section title={t("ATTENDANCE")} />
        <Section>
          <Stack space={5}>
            <VStack>
              <Box bg="presentCardBg.400" roundedTop={"xl"} py="10px" px="15px">
                <HStack alignItems={"center"}>
                  <IconByName name="EmotionHappyLineIcon" color="present.500" />
                  <Text
                    textTransform="ingerit"
                    fontSize="12px"
                    fontWeight="500"
                    color="present.500"
                  >
                    {t("YOU_HAVE_BEEN_PRESENT_ALL_DAYS_THIS_MONTH")}
                  </Text>
                </HStack>
              </Box>
              <Box bg="weekCardCompareBg.500" p="5">
                <HStack alignItems={"center"} justifyContent="space-around">
                  <VStack alignItems="center">
                    <Text fontSize="24px" fontWeight="600" color="present.500">
                      100%
                    </Text>
                    <Text fontSize="14px" fontWeight="400" color="gray.500">
                      {t("THIS_MONTH")}
                    </Text>
                  </VStack>
                  <VStack alignItems="center">
                    <Text
                      fontSize="24px"
                      fontWeight="600"
                      color="presentCardCompareText.500"
                    >
                      98%
                    </Text>
                    <Text fontSize="14px" fontWeight="400" color="gray.500">
                      {t("LAST_MONTH")}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </VStack>
            <Link
              to={"/profile/attendance"}
              style={{
                textDecoration: "none",
              }}
            >
              <Button variant="outline">{t("ATTENDANCE_REPORTS")}</Button>
            </Link>
          </Stack>
        </Section>
        <StudentEdit
          {...{
            studentObject: teacherObject,
            setStudentObject: setTeacherObject,
          }}
          onlyParameterProp={["firstName", "lastName", "email"]}
        />
        <Section
          title={t("CAREER")}
          _title={{
            borderBottomWidth: "1",
            borderBottomColor: "coolGray.200",
            py: "5",
          }}
          _box={{ mb: "4", roundedBottom: "xl", shadow: 2 }}
        >
          <Stack
            py="5"
            space={2}
            borderBottomWidth="1"
            borderBottomColor={"coolGray.200"}
          >
            <Collapsible
              header={t("MY_CLASS_RESULT")}
              _icon={{ color: "gray.700", name: "ArrowRightSLineIcon" }}
              _text={{ color: "gray.700" }}
            />
          </Stack>
          <Stack
            py="5"
            space={2}
            borderBottomWidth="1"
            borderBottomColor={"coolGray.200"}
          >
            <Collapsible
              header={t("COMPETENCY")}
              _icon={{ color: "gray.700", name: "ArrowRightSLineIcon" }}
              _text={{ color: "gray.700" }}
            />
          </Stack>
          <Stack py="5" space={2}>
            <Collapsible
              header={t("AWARDS")}
              _icon={{ color: "gray.700", name: "ArrowRightSLineIcon" }}
              _text={{ color: "gray.700" }}
            />
          </Stack>
        </Section>
      </Stack>
    </Layout>
  );
}

const Section = ({ title, button, children, _box, _title }) => (
  <Box bg={"white"} p="5" {..._box}>
    <HStack alignItems={"center"} justifyContent={"space-between"} {..._title}>
      <Text fontSize="16px" fontWeight="500">
        {title}
      </Text>
      {button}
    </HStack>
    {children}
  </Box>
);

const Collapsible = ({
  header,
  body,
  defaultCollapse,
  isHeaderBold,
  isDisableCollapse,
  onPressFuction,
  collapsButton,
  _text,
  _icon,
  _box,
}) => {
  const [collaps, setCollaps] = useState(defaultCollapse);

  return (
    <>
      <Pressable
        onPress={() => {
          if (onPressFuction) {
            onPressFuction();
          }
          if (!isDisableCollapse) {
            setCollaps(!collaps);
          }
        }}
      >
        <Box {..._box}>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Text
              fontSize={typeof isHeaderBold === "undefined" ? "14px" : ""}
              color="coolGray.400"
              fontWeight="500"
              {..._text}
            >
              {header}
            </Text>
            <IconByName
              size="sm"
              isDisabled={true}
              color={
                !collaps || collapsButton ? "coolGray.400" : "coolGray.600"
              }
              name={
                !collaps || collapsButton
                  ? "ArrowDownSLineIcon"
                  : "ArrowUpSLineIcon"
              }
              {..._icon}
            />
          </HStack>
        </Box>
      </Pressable>
      <PresenceTransition visible={collaps}>{body}</PresenceTransition>
    </>
  );
};
