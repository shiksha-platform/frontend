import {
  Actionsheet,
  Avatar,
  Box,
  HStack,
  Stack,
  Text,
  VStack,
} from "native-base";
import React, { useState } from "react";
import Icon from "../IconByName";
import { useTranslation } from "react-i18next";
import Header from "../../layout/Header";
import * as classServiceRegistry from "../../shiksha-os/services/classServiceRegistry";
import { Link } from "react-router-dom";
import IconByName from "../IconByName";

export default function Card({
  item,
  img,
  type,
  href,
  rightComponent,
  hidePopUpButton,
  textTitle,
  textSubTitle,
  _textTitle,
  _textSubTitle,
  _arrow,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handalOpenPoup = async (e) => {
    let classObj = await classServiceRegistry.getOne({
      id: e.currentClassID,
    });
    item.className = classObj.className;
    setOpen(true);
  };

  const PressableNew = ({ item, children, href, ...prop }) => {
    return href ? (
      <Link
        to={href}
        style={{ color: "rgb(63, 63, 70)", textDecoration: "none" }}
      >
        {children}
      </Link>
    ) : (
      <Box {...prop}>{children}</Box>
    );
  };

  return (
    <>
      <HStack justifyContent="space-between" width={"100%"}>
        <PressableNew href={href ? href : null}>
          {type === "veritical" ? (
            <VStack alignItems={"center"}>
              {typeof img === "undefined" || img === true ? (
                <Avatar
                  size="40px"
                  bg={item?.avatarUrl ? "" : "amber.500"}
                  {...(item?.avatarUrl
                    ? { source: { uri: item.avatarUrl } }
                    : {})}
                >
                  {item?.avatarUrl
                    ? ""
                    : item?.fullName?.toUpperCase().substr(0, 2)}
                </Avatar>
              ) : (
                <></>
              )}
              <VStack alignItems={"center"}>
                <Text fontSize={"12px"} color="coolGray.800" {..._textTitle}>
                  {textTitle ? (
                    textTitle
                  ) : item?.fullName ? (
                    item?.fullName
                  ) : (
                    <Text italic>{t("NOT_ENTERD")}</Text>
                  )}
                </Text>
                <Text color="coolGray.400" fontSize={"10px"} {..._textSubTitle}>
                  <HStack space={1}>
                    <Text>{t("ROLL_NUMBER")}:</Text>
                    {item.admissionNo ? (
                      item.admissionNo.toString().padStart(2, "0")
                    ) : (
                      <Text italic>{t("NOT_ENTERD")}</Text>
                    )}
                  </HStack>
                </Text>
              </VStack>
            </VStack>
          ) : (
            <HStack space={typeof img === "undefined" || img === true ? 2 : 0}>
              {typeof img === "undefined" || img === true ? (
                <Avatar
                  size="40px"
                  bg={item?.avatarUrl ? "" : "amber.500"}
                  {...(item?.avatarUrl
                    ? { source: { uri: item.avatarUrl } }
                    : {})}
                >
                  {item?.avatarUrl
                    ? ""
                    : item?.fullName?.toUpperCase().substr(0, 2)}
                </Avatar>
              ) : (
                <></>
              )}
              <VStack>
                <Text
                  _dark={{
                    color: "warmGray.50",
                  }}
                  color="coolGray.800"
                  bold
                  {..._textTitle}
                >
                  {textTitle ? (
                    textTitle
                  ) : item?.fullName ? (
                    <>
                      <HStack alignItems={"center"}>
                        {item.admissionNo ? (
                          item.admissionNo.toString().padStart(2, "0")
                        ) : (
                          <Text italic>{t("NOT_ENTERD")}</Text>
                        )}
                        <Text color={"coolGray.300"}>{" • "}</Text>
                      </HStack>
                      {item?.fullName}
                    </>
                  ) : (
                    <Text italic>{t("NOT_ENTERD")}</Text>
                  )}
                </Text>
                <Text
                  color="coolGray.400"
                  _dark={{
                    color: "warmGray.200",
                  }}
                  fontSize={"xs"}
                  {..._textSubTitle}
                >
                  {textSubTitle ? (
                    textSubTitle
                  ) : (
                    <HStack space={1}>
                      <Text>{t("FATHERS_NAME")}:</Text>
                      {item.fathersName ? (
                        <Text>{item.fathersName}</Text>
                      ) : (
                        <Text italic>{t("NOT_ENTERD")}</Text>
                      )}
                    </HStack>
                  )}
                </Text>
              </VStack>
            </HStack>
          )}
        </PressableNew>
        {rightComponent ? (
          rightComponent
        ) : !hidePopUpButton ? (
          <>
            <Icon
              onPress={(e) => handalOpenPoup(item)}
              size="sm"
              color="gray.900"
              name="angle-double-down"
              {..._arrow}
            />
            <Actionsheet isOpen={open} onClose={(e) => setOpen(false)}>
              <Actionsheet.Content bg="coolGray.500">
                <Header
                  isDisabledAppBar={true}
                  icon="Group"
                  heading={
                    item?.fullName ? (
                      item?.fullName
                    ) : (
                      <Text italic>{t("NOT_ENTERD")}</Text>
                    )
                  }
                  subHeading=""
                  _box={{ bg: "coolGray.500", py: 0 }}
                />
              </Actionsheet.Content>
              <Box bg="coolGray.100" width={"100%"}>
                <Stack space={2} p="4">
                  <VStack>
                    <HStack
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Box borderColor="gray.500">
                        <Text fontSize="md" color="primary.500" bold={true}>
                          {t("DETAILS")}
                        </Text>
                      </Box>
                      <Link to={"/students/" + item.id + "/edit"}>
                        <Icon size="sm" color="gray.900" name="edit" />
                      </Link>
                    </HStack>
                    <Box
                      borderWidth={1}
                      p="2"
                      borderColor="gray.500"
                      bg="gray.50"
                    >
                      <Text>
                        <Text bold>{t("ADDRESS")} </Text>
                        {item.address ? (
                          item.address
                        ) : (
                          <Text italic>{t("NOT_ENTERD")}</Text>
                        )}
                      </Text>
                      <Text>
                        <Text bold>{t("FATHERS_NAME")} </Text>
                        {item.fathersName ? (
                          item.fathersName
                        ) : (
                          <Text italic>{t("NOT_ENTERD")}</Text>
                        )}
                      </Text>
                      <Text>
                        <Text bold>{t("ADMISSION_NO")} </Text>
                        {item.admissionNo ? (
                          item.admissionNo
                        ) : (
                          <Text italic>{t("NOT_ENTERD")}</Text>
                        )}
                      </Text>
                      <Text>
                        <Text bold>{t("STUDYING_IN")} </Text>
                        {item.className ? (
                          item.className
                        ) : item.currentClassID ? (
                          item.currentClassID
                        ) : (
                          <Text italic>{t("NOT_ENTERD")}</Text>
                        )}
                      </Text>
                    </Box>
                  </VStack>
                  <VStack>
                    <HStack
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Box borderColor="gray.500">
                        <Text fontSize="md" color="primary.500" bold={true}>
                          {t("NOTES")}
                        </Text>
                      </Box>
                      <Icon size="sm" color="gray.900" name="edit" />
                    </HStack>
                    <Box
                      borderWidth={1}
                      p="2"
                      borderColor="gray.500"
                      bg="gray.50"
                    >
                      <Text>
                        <Text>{t("STUDENT_IS_GOOD_NEED")} </Text>
                      </Text>
                    </Box>
                  </VStack>
                  <Stack py={2} alignItems={"center"}>
                    <Link
                      to={"/students/" + item.id}
                      style={{
                        color: "rgb(63, 63, 70)",
                        textDecoration: "none",
                      }}
                    >
                      <Box
                        rounded="full"
                        borderColor="coolGray.200"
                        borderWidth="1"
                        bg="coolGray.200"
                        px={6}
                        py={2}
                      >
                        {t("SEE_MORE")}
                      </Box>
                    </Link>
                  </Stack>
                </Stack>
              </Box>
            </Actionsheet>
          </>
        ) : (
          <></>
        )}
      </HStack>
    </>
  );
}
