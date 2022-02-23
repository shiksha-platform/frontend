import React, { useState, useEffect } from "react";
import {
  HStack,
  Text,
  Box,
  VStack,
  Avatar,
  Actionsheet,
  Stack,
  Pressable,
  Button,
} from "native-base";
import { useTranslation } from "react-i18next";
import IconByName from "../components/IconByName";
import { Link } from "react-router-dom";

export default function Header({
  iconComponent,
  headingComponent,
  subHeadingComponent,
  avatar,
  heading,
  subHeading,
  _box,
  _heading,
  _subHeading,
  title,
  isDisabledHeader,
  fullRightComponent,
}) {
  let newAvatar = sessionStorage.getItem("firstName");
  const [showModal, setShowModal] = useState(false);
  let selfAttendance = localStorage.getItem("selfAttendance");
  return !isDisabledHeader ? (
    !fullRightComponent ? (
      <Box {..._box} py={7} px={5}>
        <HStack justifyContent="space-between" alignItems="center">
          <VStack>
            {subHeadingComponent ? (
              subHeadingComponent
            ) : (
              <Text fontSize="12px" {..._subHeading}>
                {subHeading}
              </Text>
            )}
            {headingComponent ? (
              headingComponent
            ) : (
              <Text bold fontSize="24px" {..._heading}>
                {title ? title : heading}
              </Text>
            )}
          </VStack>
          {iconComponent ? (
            iconComponent
          ) : avatar ? (
            <>
              <Pressable onPress={(e) => setShowModal(true)}>
                <Avatar bg="amber.500" rounded="lg">
                  {newAvatar?.toUpperCase().substr(0, 2)}
                  {selfAttendance ? (
                    <IconByName
                      name="CheckboxCircleFillIcon"
                      isDisabled
                      color="present.500"
                      position="absolute"
                      bottom="-5px"
                      right="-5px"
                      bg="white"
                      rounded="full"
                    />
                  ) : (
                    ""
                  )}
                </Avatar>
              </Pressable>
              <AttendanceMarkSheet
                {...{ showModal, setShowModal, selfAttendance }}
              />
            </>
          ) : (
            <></>
          )}
        </HStack>
      </Box>
    ) : (
      fullRightComponent
    )
  ) : (
    <></>
  );
}

const AttendanceMarkSheet = ({ showModal, setShowModal, selfAttendance }) => {
  const { t } = useTranslation();
  const [specialDutyModal, setSpecialDutyModal] = useState(false);
  const [markAttendance, setMarkAttendance] = useState(selfAttendance);
  const [markList, setMarkList] = useState([]);
  const [specialDutyList, setSpecialDutyList] = useState([]);

  const markSelfAttendance = () => {
    if (markAttendance) {
      localStorage.setItem("selfAttendance", markAttendance);
    } else {
      localStorage.removeItem("selfAttendance");
    }
    setShowModal(false);
  };

  useEffect(() => {
    let newMarkList = [
      {
        icon: "CheckboxCircleLineIcon",
        name: "MARK_PRESENT",
        color: "present",
      },
      {
        icon: "AwardLineIcon",
        name: "MARK_SPECIAL_DUTY",
        rightIcon: "ArrowRightSLineIcon",
        color: "special_duty",
      },
      {
        icon: "CloseCircleLineIcon",
        name: "MARK_ABSENT",
        color: "absent",
      },
    ];
    let newSpecialDutyList = [
      { icon: "UserStarLineIcon", name: "ELECTION", color: "special_duty" },
      { icon: "BookMarkLineIcon", name: "EVALUATION", color: "special_duty" },
      { icon: "SearchEyeLineIcon", name: "INTERVIEW", color: "special_duty" },
      { icon: "StarLineIcon", name: "INVIGILITION", color: "special_duty" },
      { icon: "SpyLineIcon", name: "INSPECTION", color: "special_duty" },
      { icon: "StarLineIcon", name: "TRAINING", color: "special_duty" },
    ];
    if (markAttendance) {
      newMarkList = [
        ...newMarkList,
        {
          icon: "RefreshLineIcon",
          name: "RESET_TO_UNMARK",
          color: "gray",
        },
      ];
      newSpecialDutyList = [
        ...newSpecialDutyList,
        {
          icon: "RefreshLineIcon",
          name: "RESET_TO_UNMARK",
          color: "gray",
        },
      ];
    }
    setMarkList(newMarkList);
    setSpecialDutyList(newSpecialDutyList);
  }, [markAttendance]);

  return (
    <>
      <Actionsheet isOpen={showModal} onClose={() => setShowModal(false)}>
        <Actionsheet.Content alignItems={"left"} bg="classCard.500">
          <HStack justifyContent={"space-between"}>
            <Stack p={5} pt={2} pb="25px">
              <Text fontSize="16px" fontWeight={"600"}>
                {t("ATTENDANCE")}
              </Text>
            </Stack>
            <IconByName
              name="CloseCircleLineIcon"
              onPress={(e) => setShowModal(false)}
            />
          </HStack>
        </Actionsheet.Content>
        <Box w="100%" justifyContent="center" bg="white">
          {markList.map((item, index) => (
            <Pressable
              key={index}
              p={5}
              onPress={(e) => {
                if (item.name === "RESET_TO_UNMARK") {
                  setMarkAttendance();
                } else if (item.name === "MARK_SPECIAL_DUTY") {
                  setSpecialDutyModal(true);
                } else {
                  setMarkAttendance(item.name);
                }
              }}
            >
              <HStack
                alignItems="center"
                space={2}
                width="100%"
                justifyContent={"space-between"}
              >
                <HStack alignItems="center" space={2}>
                  <IconByName
                    name={item.icon}
                    isDisabled
                    mt="1"
                    p="5px"
                    rounded="full"
                    bg={
                      markAttendance === item.name ||
                      (specialDutyList.some((e) => e.name === markAttendance) &&
                        item.color === "special_duty")
                        ? item.color + ".500"
                        : "gray.100"
                    }
                    colorScheme={
                      markAttendance === item.name ||
                      (specialDutyList.some((e) => e.name === markAttendance) &&
                        item.color === "special_duty")
                        ? item.color
                        : "gray"
                    }
                    color={
                      markAttendance === item.name ||
                      (specialDutyList.some((e) => e.name === markAttendance) &&
                        item.color === "special_duty")
                        ? "white"
                        : "gray.500"
                    }
                    _icon={{ size: "18" }}
                  />
                  <Text fontSize="14px" fontWeight={500}>
                    {t(item.name)}
                  </Text>
                </HStack>

                {item.rightIcon ? (
                  <IconByName name={item.rightIcon} isDisabled />
                ) : (
                  ""
                )}
              </HStack>
            </Pressable>
          ))}

          <Button.Group m="5">
            <Link
              style={{
                textDecoration: "none",
                flex: "1",
              }}
              to={"/profile"}
            >
              <Button colorScheme="button" variant={"outline"}>
                {t("GO_TO_PROFILE")}
              </Button>
            </Link>
            <Button
              flex="1"
              colorScheme={markAttendance ? "button" : "gray"}
              _text={{ color: "white" }}
              onPress={(e) => markSelfAttendance()}
            >
              {t("MARK")}
            </Button>
          </Button.Group>
        </Box>
      </Actionsheet>
      <Actionsheet
        isOpen={specialDutyModal}
        onClose={() => setSpecialDutyModal(false)}
      >
        <Actionsheet.Content alignItems={"left"} bg="classCard.500">
          <HStack justifyContent={"space-between"}>
            <Stack p={5} pt={2} pb="25px">
              <Text fontSize="16px" fontWeight={"600"}>
                {t("SELECT_DUTY_TYPE")}
              </Text>
            </Stack>
            <IconByName
              name="CloseCircleLineIcon"
              onPress={(e) => setSpecialDutyModal(false)}
            />
          </HStack>
        </Actionsheet.Content>
        <Box w="100%" justifyContent="center" bg="white">
          {specialDutyList.map((item, index) => (
            <Pressable
              key={index}
              p={5}
              onPress={(e) => {
                if (item.name === "RESET_TO_UNMARK") {
                  setMarkAttendance();
                } else {
                  setMarkAttendance(item.name);
                }
              }}
            >
              <HStack
                alignItems="center"
                space={2}
                width="100%"
                justifyContent={"space-between"}
              >
                <HStack alignItems="center" space={2}>
                  <IconByName
                    name={item.icon}
                    isDisabled
                    mt="1"
                    p="5px"
                    rounded="full"
                    bg={
                      markAttendance === item.name
                        ? item.color + ".500"
                        : "gray.100"
                    }
                    colorScheme={
                      markAttendance === item.name ? item.color : "gray"
                    }
                    color={markAttendance === item.name ? "white" : "gray.500"}
                    _icon={{ size: "18" }}
                  />
                  <Text fontSize="14px" fontWeight={500}>
                    {t(item.name)}
                  </Text>
                </HStack>

                {item.rightIcon ? (
                  <IconByName name={item.rightIcon} isDisabled />
                ) : (
                  ""
                )}
              </HStack>
            </Pressable>
          ))}

          <Button.Group m="5">
            <Link
              style={{
                textDecoration: "none",
                flex: "1",
              }}
              to={"/profile"}
            >
              <Button colorScheme="button" variant={"outline"}>
                {t("GO_TO_PROFILE")}
              </Button>
            </Link>
            <Button
              flex="1"
              colorScheme="button"
              _text={{ color: "white" }}
              onPress={(e) => setSpecialDutyModal(false)}
            >
              {t("MARK")}
            </Button>
          </Button.Group>
        </Box>
      </Actionsheet>
    </>
  );
};
