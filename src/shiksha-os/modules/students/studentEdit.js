import React, { useEffect, useState } from "react";
import {
  Text,
  Button,
  Stack,
  Box,
  FormControl,
  Input,
  useToast,
} from "native-base";
import * as studentServiceRegistry from "../../services/studentServiceRegistry";
import { useTranslation } from "react-i18next";
import Header from "../../../components/Header";
import { useParams } from "react-router-dom";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const [studentObject, setStudentObject] = useState({});
  const { studentId } = useParams();
  const toast = useToast();
  const onlyParameter = [
    "firstName",
    "lastName",
    "address",
    "fathersName",
    "phoneNumber",
    "email",
  ];
  const parameter = {
    firstName: { placeholder: "First name", required: true },
    lastName: { placeholder: "Last name" },
    address: { placeholder: "Address" },
    fathersName: { placeholder: "Parent Name" },
    phoneNumber: { placeholder: "Phone number" },
    email: { placeholder: "Email", type: "email" },
  };
  const formInputs = onlyParameter.map((e) => {
    return {
      placeholder: parameter[e]?.placeholder ? parameter[e].placeholder : e,
      isRequired: parameter[e]?.required ? parameter[e].required : false,
      type: parameter[e]?.type ? parameter[e].type : "text",
      value: studentObject[e] ? studentObject[e] : "",
      onChange: (item) => {
        setStudentObject({ ...studentObject, [e]: item.target.value });
      },
    };
  });

  useEffect(() => {
    let ignore = false;

    const getData = async () => {
      let student = await studentServiceRegistry.getOne({ id: studentId });
      if (!ignore) setStudentObject(student);
    };
    getData();
  }, [studentId]);

  const handalSubmit = async (e) => {
    let result = await studentServiceRegistry.update(studentObject, {
      headers: { Authorization: "Bearer " + sessionStorage.getItem("token") },
      onlyParameter: onlyParameter,
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
    }
  };

  return (
    <>
      <Header
        icon="Group"
        heading={
          (studentObject?.firstName ? studentObject?.firstName : "") +
          " " +
          (studentObject?.lastName ? studentObject?.lastName : "")
        }
        button={
          <Button
            variant="ghost"
            borderRadius="50"
            colorScheme="default"
            background="gray.200"
            onPress={handalSubmit}
          >
            {t("SAVE")}
          </Button>
        }
      />
      <Stack p="4" space={2}>
        <Stack>
          <Box borderColor="gray.500">
            <Text fontSize="md" color="primary.500" bold={true}>
              {t("DETAILS")}
            </Text>
          </Box>
          <FormControl>
            <Stack space={3}>
              {formInputs.map((item, index) => {
                return (
                  <Stack
                    borderWidth={1}
                    borderRadius={5}
                    borderColor={"coolGray.300"}
                    p="2"
                    key={index}
                  >
                    <FormControl.Label>{item.placeholder}</FormControl.Label>
                    <Input variant="unstyled" p={2} {...item} />
                  </Stack>
                );
              })}
            </Stack>
          </FormControl>
        </Stack>
      </Stack>
    </>
  );
}
