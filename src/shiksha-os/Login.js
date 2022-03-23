import React, { useState } from "react";
import {
  HStack,
  Text,
  Button,
  Box,
  FormControl,
  Input,
  VStack,
  Alert,
  IconButton,
  CloseIcon,
} from "native-base";
import Header from "../layout/Header";
import { useTranslation } from "react-i18next";
import axios from "axios";
import * as teacherServiceRegistry from "../shiksha-os/services/teacherServiceRegistry";
import manifest from "../shiksha-os/manifest.json";

// Start editing here, save and see your changes.
export default function Home() {
  const [credentials, setCredentials] = useState();
  const [errors, setErrors] = React.useState({});
  const { t } = useTranslation();

  const validate = () => {
    let arr = {};
    if (
      typeof credentials?.username === "undefined" ||
      credentials?.username === ""
    ) {
      arr = { ...arr, username: "Username is required" };
    }

    if (
      typeof credentials?.password === "undefined" ||
      credentials?.password === ""
    ) {
      arr = { ...arr, password: "Password is required" };
    }

    setErrors(arr);
    if (arr.username || arr.password) {
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validate()) {
      const params = new URLSearchParams();
      params.append("client_id", "registry-frontend");
      params.append("username", credentials.username);
      params.append("password", credentials.password);
      params.append("grant_type", "password");

      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Access-Control-Allow-Origin": "*",
        },
      };

      const result = await axios
        .post(manifest.auth_url, params, config)
        .catch((e) => e);
      if (result?.data) {
        let token = result.data.access_token;
        localStorage.setItem("token", token);
        const resultTeacher = await teacherServiceRegistry.getOne(
          {},
          { Authorization: "Bearer " + token }
        );
        if (resultTeacher?.id) {
          let id = resultTeacher.id?.startsWith("1-")
            ? resultTeacher.id?.replace("1-", "")
            : resultTeacher.id;
          localStorage.setItem("id", id);
          localStorage.setItem("fullName", resultTeacher.fullName);
          localStorage.setItem("firstName", resultTeacher.firstName);
          localStorage.setItem("lastName", resultTeacher.lastName);
          window.location.reload();
        } else {
          localStorage.removeItem("token");
          setErrors({ alert: "data not found" });
        }
      } else {
        localStorage.removeItem("token");
        setErrors({ alert: "Please enter valid credentials" });
      }
    }
  };

  return (
    <>
      <Header
        title={t("MY_SCHOOL_APP")}
        icon="sign-in-alt"
        heading={t("LOGIN")}
        _box={{ backgroundColor: "lightBlue.100" }}
        _icon={{ color: "black" }}
        _heading={{ color: "black" }}
        _subHeading={{ color: "black" }}
      />
      <Box backgroundColor="gray.100" m={3} p={3}>
        <Text fontSize="lg" color="primary.500" bold={true}>
          {t("LOGIN")}
        </Text>
        <VStack space={2}>
          {"alert" in errors ? (
            <Alert w="100%" status={"error"}>
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="md" color="coolGray.800">
                      {errors.alert}
                    </Text>
                  </HStack>
                  <IconButton
                    variant="unstyled"
                    icon={<CloseIcon size="3" color="coolGray.600" />}
                    onPress={(e) => setErrors({})}
                  />
                </HStack>
              </VStack>
            </Alert>
          ) : (
            <></>
          )}
          <FormControl isRequired isInvalid={"username" in errors}>
            <FormControl.Label _text={{ bold: true }}>
              {t("USERNAME")}
            </FormControl.Label>
            <Input
              variant="underlined"
              p={2}
              placeholder={t("USERNAME")}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  username: e.target.value,
                })
              }
            />
            {"username" in errors ? (
              <FormControl.ErrorMessage
                _text={{
                  fontSize: "xs",
                  color: "error.500",
                  fontWeight: 500,
                }}
              >
                {errors.username}
              </FormControl.ErrorMessage>
            ) : (
              <></>
            )}
          </FormControl>
          <FormControl isRequired isInvalid={"password" in errors}>
            <FormControl.Label _text={{ bold: true }}>
              {t("PASSWORD")}
            </FormControl.Label>
            <Input
              variant="underlined"
              p={2}
              placeholder={t("PASSWORD")}
              type="password"
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  password: e.target.value,
                })
              }
            />
            {"password" in errors ? (
              <FormControl.ErrorMessage
                _text={{
                  fontSize: "xs",
                  color: "error.500",
                  fontWeight: 500,
                }}
              >
                {errors.password}
              </FormControl.ErrorMessage>
            ) : (
              <></>
            )}
          </FormControl>
          <Button
            backgroundColor="lightBlue.900"
            type="submit"
            p={2}
            onPress={handleLogin}
          >
            {t("SUBMIT")}
          </Button>
        </VStack>
      </Box>
    </>
  );
}
