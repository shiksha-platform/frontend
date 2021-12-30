import React, { useState } from "react";
import {
  HStack,
  Text,
  Button,
  Stack,
  Box,
  FormControl,
  Input,
} from "native-base";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import axios from "axios";
import * as teacherServiceRegistry from "../shiksha-os/services/teacherServiceRegistry";

// Start editing here, save and see your changes.
export default function Home() {
  const [credentials, setCredentials] = useState();
  const { t } = useTranslation();

  const handleLogin = async () => {
    const params = new URLSearchParams();
    params.append("client_id", "registry-frontend");
    params.append("username", credentials.username);
    params.append("password", credentials.password);
    params.append("grant_type", "password");

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    let url =
      "https://dev-shiksha.uniteframework.io/auth/realms/sunbird-rc/protocol/openid-connect/token";

    const result = await axios.post(url, params, config);
    if (result.data) {
      sessionStorage.setItem("token", result.data.access_token);
      const resultTeacher = await teacherServiceRegistry.getOne(
        {},
        { Authorization: "Bearer " + result.data.access_token }
      );

      if (resultTeacher) {
        let id = resultTeacher.id.replace("1-", "");
        sessionStorage.setItem("id", id);
        sessionStorage.setItem("fullName", resultTeacher.fullName);
        sessionStorage.setItem("firstName", resultTeacher.firstName);
        sessionStorage.setItem("lastName", resultTeacher.lastName);
        window.location.reload();
      }
    } else {
      sessionStorage.setItem("token", "");
    }
  };

  return (
    <>
      <Header
        icon="Login"
        heading={t("LOGIN")}
        _box={{ backgroundColor: "lightBlue.100" }}
        _icon={{ color: "black" }}
        _heading={{ color: "black" }}
        _subHeading={{ color: "black" }}
      />
      <Box backgroundColor="gray.100" m={3} p={3}>
        <Text color="green.700" bold={true}>
          {t("LOGIN")}
        </Text>
        <HStack space={2}>
          <FormControl>
            <Stack space={5}>
              <Stack>
                <FormControl.Label>{t("USERNAME")}</FormControl.Label>
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
              </Stack>
              <Stack>
                <FormControl.Label>{t("PASSWORD")}</FormControl.Label>
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
              </Stack>
              <Stack>
                <Button
                  backgroundColor="lightBlue.900"
                  type="submit"
                  p={2}
                  onPress={handleLogin}
                >
                  {t("Submit")}
                </Button>
              </Stack>
            </Stack>
          </FormControl>
        </HStack>
      </Box>
    </>
  );
}
