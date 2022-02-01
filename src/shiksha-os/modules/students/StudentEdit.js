import React, { useEffect, useState } from "react";
import {
  Text,
  Button,
  Stack,
  Box,
  FormControl,
  Input,
  useToast,
  HStack,
  VStack,
} from "native-base";
import * as studentServiceRegistry from "../../services/studentServiceRegistry";
import { useTranslation } from "react-i18next";
import IconByName from "../../../components/IconByName";

// Start editing here, save and see your changes.
export default function App({
  studentObject,
  setStudentObject,
  onlyParameterProp,
}) {
  const { t } = useTranslation();
  const [editState, setEditState] = useState(false);
  const [editChangeState, setEditChangeState] = useState(false);
  const toast = useToast();
  const onlyParameter =
    onlyParameterProp?.length > "0"
      ? onlyParameterProp
      : [
          "firstName",
          "lastName",
          "address",
          "fathersName",
          "phoneNumber",
          "email",
          "gender",
        ];
  const parameter = {
    firstName: { placeholder: t("FIRST_NAME"), required: true },
    lastName: { placeholder: t("LAST_NAME") },
    address: { placeholder: t("ADDRESS") },
    fathersName: { placeholder: t("FATHERS_NAME") },
    phoneNumber: { placeholder: t("PHONE_NUMBER") },
    email: { placeholder: t("EMAIL"), type: "email" },
  };
  const formInputs = onlyParameter.map((e) => {
    return {
      placeholder: parameter[e]?.placeholder ? parameter[e].placeholder : e,
      isRequired: parameter[e]?.required ? parameter[e].required : false,
      type: parameter[e]?.type ? parameter[e].type : "text",
      value: studentObject[e] ? studentObject[e] : "",
      onChange: (item) => {
        setEditChangeState(true);
        if (e === "firstName") {
          setStudentObject({
            ...studentObject,
            [e]: item.target.value,
            fullName: item.target.value + " " + studentObject.lastName,
          });
        } else if (e === "lastName") {
          setStudentObject({
            ...studentObject,
            [e]: item.target.value,
            fullName: studentObject.firstName + " " + item.target.value,
          });
        } else {
          setStudentObject({ ...studentObject, [e]: item.target.value });
        }
      },
    };
  });

  const handalSubmit = async (e) => {
    if (editChangeState) {
      let result = await studentServiceRegistry.update(studentObject, {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("token") },
        onlyParameter: [...onlyParameter, "fullName"],
      });
      if (result.data) {
        toast.show({
          render: () => {
            return (
              <Box bg="emerald.500" px="3" py="2" rounded="sm" mb={5}>
                <Text fontSize={"lg"} color="coolGray.100">
                  {result.data?.params?.status
                    ? result.data?.params?.status
                    : "successful"}
                </Text>
              </Box>
            );
          },
          placement: "top",
        });
        setEditState(false);
      }
    } else {
      setEditState(false);
    }
    setEditChangeState(false);
  };

  return (
    <Section
      title={t("DETAILS")}
      button={
        editState ? (
          <Button
            colorScheme="button"
            _text={{ fontWeight: "400", color: "white" }}
            py={1}
            px={2}
            onPress={handalSubmit}
          >
            {t("SAVE")}
          </Button>
        ) : (
          <Button
            variant="ghost"
            colorScheme="button"
            endIcon={<IconByName name={"pencil-alt"} isDisabled />}
            _text={{ fontWeight: "400" }}
            py={1}
            px={2}
            onPress={(e) => setEditState(true)}
          >
            {t("EDIT")}
          </Button>
        )
      }
    >
      <VStack>
        {formInputs.map((item, index) => {
          return (
            <Stack
              p="5"
              borderBottomWidth={formInputs.length - 1 !== index ? "1" : "0"}
              borderColor={"coolGray.200"}
              key={index}
            >
              {editState ? (
                <FormControl>
                  <FormControl.Label>
                    <Text
                      fontSize={"14px"}
                      fontWeight="500"
                      color={"coolGray.400"}
                    >
                      {item.placeholder}
                    </Text>
                  </FormControl.Label>
                  <Input key={index} variant="filled" p={2} {...item} />
                </FormControl>
              ) : (
                <>
                  <Text
                    fontSize={"14px"}
                    fontWeight="500"
                    color={"coolGray.400"}
                    pb={2}
                  >
                    {item.placeholder}
                  </Text>
                  {item.value ? (
                    <Text p={2}>{item.value}</Text>
                  ) : (
                    <Text italic p={2}>
                      {t("NOT_ENTERD")}
                    </Text>
                  )}
                </>
              )}
            </Stack>
          );
        })}
      </VStack>
    </Section>
  );
}

const Section = ({ title, button, children, _box }) => (
  <Box bg={"white"} p="5" {..._box}>
    <HStack alignItems={"center"} justifyContent={"space-between"}>
      <Text fontSize="16px" fontWeight="500">
        {title}
      </Text>
      {button}
    </HStack>
    {children}
  </Box>
);
