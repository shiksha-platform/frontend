import {
  Actionsheet,
  Avatar,
  Box,
  Button,
  HStack,
  Link,
  Stack,
  Text,
  useDisclose,
  VStack,
} from "native-base";
import React from "react";
import Icon from "../IconByName";
import { useTranslation } from "react-i18next";
import Header from "../Header";

export default function Card({
  item,
  img,
  type,
  href,
  hidePopUpButton,
  _textTitle,
  _textSubTitle,
  _arrow,
}) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclose();

  const PopupActionSheet = ({ item }) => {
    return (
      <>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content bg="coolGray.500">
            <Header
              icon="Group"
              heading={
                (item?.firstName ? item?.firstName : "") +
                " " +
                (item?.lastName ? item?.lastName : "")
              }
              subHeading=""
              _box={{ bg: "coolGray.500", py: 0 }}
            />
          </Actionsheet.Content>
          <Box bg="coolGray.100" width={"100%"}>
            <Stack space={2} p="4">
              <VStack>
                <HStack alignItems={"center"} justifyContent={"space-between"}>
                  <Box borderColor="gray.500">
                    <Text fontSize="md" color="primary.500" bold={true}>
                      {t("DETAILS")}
                    </Text>
                  </Box>
                  <Link href={"/students/" + item.id + "/edit"}>
                    <Icon size="sm" color="gray.900" name="Edit" />
                  </Link>
                </HStack>
                <Box borderWidth={1} p="2" borderColor="gray.500" bg="gray.50">
                  <Text>
                    <Text bold>{t("ADDRESS")} </Text>
                  </Text>
                  <Text>
                    <Text bold>{t("FATHERS_NAME")} </Text>
                    {item.fathersName}
                  </Text>
                  <Text>
                    <Text bold>{t("ADMISSION_NO")} </Text>
                    {item.admissionNo}
                  </Text>
                  <Text>
                    <Text bold>{t("STUDYING_IN")} </Text>
                    {item.className ? item.className : item.currentClassID}
                  </Text>
                </Box>
              </VStack>
              <VStack>
                <HStack alignItems={"center"} justifyContent={"space-between"}>
                  <Box borderColor="gray.500">
                    <Text fontSize="md" color="primary.500" bold={true}>
                      {t("NOTES")}
                    </Text>
                  </Box>
                  <Icon size="sm" color="gray.900" name="Edit" />
                </HStack>
                <Box borderWidth={1} p="2" borderColor="gray.500" bg="gray.50">
                  <Text>
                    <Text>{t("STUDENT_IS_GOOD_NEED")} </Text>
                  </Text>
                </Box>
              </VStack>
              <Stack py={2} alignItems={"center"}>
                <Link href={"/students/" + item.id}>
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
    );
  };

  return (
    <>
      <HStack space={3} justifyContent="space-between" width={"100%"}>
        <Link href={href ? href : ""}>
          <HStack space={typeof img === "undefined" || img === true ? 3 : 0}>
            {typeof img === "undefined" || img === true ? (
              <Avatar
                size="40px"
                source={{
                  uri: item.avatarUrl,
                }}
              />
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
                {(item?.firstName ? item?.firstName : "") +
                  " " +
                  (item?.lastName ? item?.lastName : "")}
              </Text>
              <Text
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
                {..._textSubTitle}
              >
                {type && type === "attendance" ? (
                  <HStack space={1}>
                    <Text>{t("ROLL_NUMBER") + " : " + item.admissionNo}</Text>
                    <Text>{t("FATHERS_NAME") + " : " + item.fathersName}</Text>
                  </HStack>
                ) : (
                  item.email
                )}
              </Text>
            </VStack>
          </HStack>
        </Link>
        {!hidePopUpButton ? (
          <Icon
            onPress={onOpen}
            size="sm"
            color="gray.900"
            name="ArrowDropDown"
            {..._arrow}
          />
        ) : (
          <></>
        )}
      </HStack>
      <PopupActionSheet item={item} />
    </>
  );
}
