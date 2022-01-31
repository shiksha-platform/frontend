import {
  Actionsheet,
  Avatar,
  Box,
  Button,
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

const SubCard = ({
  item,
  type,
  img,
  textTitle,
  textSubTitle,
  _textTitle,
  _textSubTitle,
}) => {
  const { t } = useTranslation();
  return type === "veritical" ? (
    <VStack alignItems={"center"}>
      {typeof img === "undefined" || img === true ? (
        <Avatar
          size="40px"
          bg={item?.avatarUrl ? "" : "amber.500"}
          {...(item?.avatarUrl ? { source: { uri: item.avatarUrl } } : {})}
        >
          {item?.avatarUrl ? "" : item?.fullName?.toUpperCase().substr(0, 2)}
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
          {...(item?.avatarUrl ? { source: { uri: item.avatarUrl } } : {})}
        >
          {item?.avatarUrl ? "" : item?.fullName?.toUpperCase().substr(0, 2)}
        </Avatar>
      ) : (
        <></>
      )}
      <VStack>
        <Text color="coolGray.800" bold {..._textTitle}>
          {textTitle ? (
            textTitle
          ) : item?.fullName ? (
            <>
              {type !== "card" ? (
                <HStack alignItems={"center"}>
                  {item.admissionNo ? (
                    item.admissionNo.toString().padStart(2, "0")
                  ) : (
                    <Text italic>{t("NOT_ENTERD")}</Text>
                  )}
                  <Text color={"coolGray.300"}>{" • "}</Text>
                </HStack>
              ) : (
                <></>
              )}
              {item?.fullName}
            </>
          ) : (
            <Text italic>{t("NOT_ENTERD")}</Text>
          )}
        </Text>
        {type === "card" ? (
          <HStack alignItems={"center"}>
            {item?.className ? (
              item?.className
            ) : (
              <Text italic>{t("NOT_ENTERD")}</Text>
            )}
            <Text color={"coolGray.400"}>{" • "}</Text>
            <Text>{t("ROLL_NUMBER") + "."} </Text>
            {item.admissionNo ? (
              <Text>{item.admissionNo.toString().padStart(2, "0")}</Text>
            ) : (
              <Text italic>{t("NOT_ENTERD")}</Text>
            )}
          </HStack>
        ) : (
          <Text color="coolGray.400" fontSize={"xs"} {..._textSubTitle}>
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
        )}
      </VStack>
    </HStack>
  );
};

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
          <SubCard
            {...{
              item,
              img,
              type,
              textTitle,
              textSubTitle,
              _textTitle,
              _textSubTitle,
            }}
          />
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
              <Actionsheet.Content bg="studentCard.500" alignItems="inherit">
                <Box px="3" py="4" pt="0">
                  <SubCard
                    {...{
                      item,
                      img,
                      type,
                      textTitle,
                      textSubTitle,
                      _textTitle,
                      _textSubTitle,
                      type: "card",
                    }}
                  />
                </Box>
              </Actionsheet.Content>
              <Box bg="white" width={"100%"}>
                <Stack space={5}>
                  <VStack>
                    <Box px="5" pt="5">
                      <HStack
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        <Text fontSize="16px" fontWeight="500">
                          {t("DETAILS")}
                        </Text>
                        <Button
                          variant="ghost"
                          colorScheme="button"
                          endIcon={
                            <IconByName name={"pencil-alt"} isDisabled />
                          }
                          _text={{ fontWeight: "400" }}
                        >
                          {t("EDIT")}
                        </Button>
                      </HStack>
                      {[
                        {
                          title: t("ADDRESS"),
                          value: item.address,
                        },
                        {
                          title: t("FATHERS_NAME"),
                          value: item.fathersName,
                        },
                        {
                          title: t("ADMISSION_NO"),
                          value: item.admissionNo,
                        },
                        {
                          title: t("STUDYING_IN"),
                          value: item.className
                            ? item.className
                            : item.currentClassID,
                        },
                      ].map((item, index) => {
                        return (
                          <VStack
                            space="3"
                            p="5"
                            borderBottomWidth={"1"}
                            borderColor={"coolGray.200"}
                            key={index}
                          >
                            <Text
                              fontSize={"14px"}
                              fontWeight="500"
                              color={"coolGray.400"}
                            >
                              {item.title}
                            </Text>
                            {item.value ? (
                              <Text>{item.value}</Text>
                            ) : (
                              <Text italic>{t("NOT_ENTERD")}</Text>
                            )}
                          </VStack>
                        );
                      })}
                    </Box>
                  </VStack>
                  <VStack>
                    <Box px="5">
                      <HStack
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        <Text fontSize="16px" fontWeight="500">
                          {t("NOTES")}
                        </Text>
                        <Button
                          variant="ghost"
                          colorScheme="button"
                          endIcon={
                            <IconByName name={"pencil-alt"} isDisabled />
                          }
                          _text={{ fontWeight: "400" }}
                        >
                          {t("EDIT")}
                        </Button>
                      </HStack>
                      <Box bg={"gray.100"} rounded={"md"} p="4">
                        <HStack
                          justifyContent={"space-between"}
                          alignItems="center"
                        >
                          <Text>{t("STUDENT_IS_GOOD_NEED")}</Text>
                        </HStack>
                      </Box>
                    </Box>
                  </VStack>
                  <Stack pb={5} alignItems={"center"}>
                    <Link
                      to={"/students/" + item.id}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <Box
                        rounded="lg"
                        borderColor="button.500"
                        borderWidth="1"
                        _text={{ color: "button.500" }}
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
