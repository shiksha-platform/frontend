import React, { useState } from "react";
import {
  HStack,
  Text,
  VStack,
  Box,
  StatusBar,
  Pressable,
  Select,
  CheckIcon,
  Input,
  Button,
} from "native-base";
import manifest from "./manifest";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/IconByName";
import { useTranslation } from "react-i18next";

export default function AppBar({
  isEnableHamburgerMenuButton,
  isEnableLanguageMenu,
  isEnableSearchBtn,
  setSearch,
  ...props
}) {
  const { t } = useTranslation();
  const token = sessionStorage.getItem("token");
  const [searchInput, setSearchInput] = useState(false);

  const navigate = useNavigate();
  const setLang = (e) => {
    if (e === "logout") {
      sessionStorage.setItem("token", "");
    } else {
      localStorage.setItem("lang", e);
    }
    window.location.reload();
  };

  return (
    <>
      <StatusBar backgroundColor="gray.600" barStyle="light-content" />
      <Box safeAreaTop backgroundColor="gray.600" />
      <HStack
        bg="lightBlue.900"
        px="1"
        py="3"
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack space="4" alignItems="center">
          {isEnableHamburgerMenuButton ? (
            <Icon size="sm" color="white" name="Menu" />
          ) : (
            <Icon
              size="sm"
              color="white"
              name="KeyboardBackspace"
              onPress={() => navigate(-1)}
            />
          )}
          {searchInput ? (
            <Input
              bg={"coolGray.100"}
              size={"full"}
              InputRightElement={
                <Icon
                  size="sm"
                  color="coolGray.500"
                  w="1/8"
                  name="Close"
                  pl="0"
                  onPress={(e) => setSearchInput(false)}
                />
              }
              placeholder="search"
              onChange={(e) => setSearch(e.target.value)}
            />
          ) : (
            <Text color="white" fontSize="20" fontWeight="bold">
              {props.title ?? manifest.name}
            </Text>
          )}
        </HStack>
        <HStack>
          {!searchInput && isEnableSearchBtn ? (
            <Icon
              size="sm"
              color="white"
              name="Search"
              onPress={(e) => setSearchInput(true)}
            />
          ) : (
            <></>
          )}
          <Link to="/">
            <Icon size="sm" color="white" name="Home" />
          </Link>
          <Icon size="sm" color="white" name="MoreVert" />
          {isEnableLanguageMenu ? (
            <Select
              selectedValue={localStorage.getItem("lang")}
              minWidth="75"
              maxWidth="75"
              borderWidth="0"
              accessibilityLabel="Lang"
              placeholder="Lang"
              bgColor="white"
              _selectedItem={{
                bg: "white",
                endIcon: <CheckIcon size="5" />,
              }}
              onValueChange={(itemValue) => setLang(itemValue)}
            >
              {manifest.languages.map((e, index) => (
                <Select.Item key={index} label={e.title} value={e.code} />
              ))}
              {token ? (
                <Select.Item label={"Logout"} value={"logout"} />
              ) : (
                <></>
              )}
            </Select>
          ) : (
            <></>
          )}
        </HStack>
      </HStack>
    </>
  );
}

export const CustomDrawerContent = (props) => {
  const menus = manifest.menus.hamburger;
  return (
    <>
      <VStack space="6" my="2" mx="1">
        {/* <Box px="4">
          <Text bold color="gray.700">
            Mail
          </Text>
          <Text fontSize="14" mt="1" color="gray.500" fontWeight="500">
            john_doe@gmail.com
          </Text>
        </Box> */}
        <VStack space="4">
          <VStack space="5">
            <VStack space="3">
              {menus.map((value, index) => {
                return (
                  <Pressable px="5" py="3">
                    {/* <Link href={value.route}> */}
                    <HStack space="7" alignItems="center">
                      <Icon size="sm" name="ios-home" color="white" />
                      <Text color="gray.700" fontWeight="500">
                        {value.title}
                      </Text>
                    </HStack>
                    {/* </Link> */}
                  </Pressable>
                );
              })}
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </>
  );
};
