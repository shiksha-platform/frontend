import React, { useState } from "react";
import {
  HStack,
  Text,
  VStack,
  Box,
  StatusBar,
  Pressable,
  Input,
  Menu,
  Center,
} from "native-base";
import manifest from "./manifest";
import { useNavigate } from "react-router-dom";
import IconByName from "../components/IconByName";

export default function AppBar({
  isEnableHamburgerMenuButton,
  isEnableLanguageMenu,
  isEnableSearchBtn,
  setSearch,
  color,
  ...props
}) {
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
    <Box pt={7} px={5}>
      <StatusBar backgroundColor="gray.600" barStyle="light-content" />
      <Box safeAreaTop backgroundColor="gray.600" />
      <HStack
        bg="transparent"
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack space="4" alignItems="center">
          {isEnableHamburgerMenuButton ? (
            <IconByName size="sm" name="bars" color={color ? color : ""} />
          ) : (
            <IconByName
              size="sm"
              name="chevron-left"
              color={color ? color : ""}
              onPress={() => navigate(-1)}
            />
          )}
          {searchInput ? (
            <Input
              bg={"coolGray.100"}
              size={"full"}
              InputRightElement={
                <IconByName
                  size="sm"
                  color="coolGray.500"
                  w="1/8"
                  name="times"
                  pl="0"
                  onPress={(e) => setSearchInput(false)}
                />
              }
              placeholder="search"
              onChange={(e) => setSearch(e.target.value)}
            />
          ) : (
            <></>
            // <Text fontSize="20" fontWeight="bold">
            //   {props.title ?? manifest.name}
            // </Text>
          )}
        </HStack>
        <HStack alignItems={"center"}>
          {!searchInput && isEnableSearchBtn ? (
            <IconByName
              color={color ? color : ""}
              size="sm"
              name="search"
              onPress={(e) => setSearchInput(true)}
            />
          ) : (
            <></>
          )}
          <Center flex={1} px="3">
            <Menu
              w="190"
              trigger={(triggerProps) => {
                return (
                  <Pressable
                    accessibilityLabel="More options menu"
                    {...triggerProps}
                  >
                    <IconByName
                      size="sm"
                      name="ellipsis-v"
                      isDisabled={true}
                      color={color ? color : ""}
                    />
                  </Pressable>
                );
              }}
            >
              {manifest.languages.map((e, index) => (
                <Menu.Item
                  key={index}
                  label={e.title}
                  textValue={e.code}
                  onPress={(item) => setLang(e.code)}
                >
                  {e.title}
                </Menu.Item>
              ))}
              <Menu.Item onPress={(item) => setLang("logout")}>
                Logout
              </Menu.Item>
            </Menu>
          </Center>
        </HStack>
      </HStack>
    </Box>
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
                      <IconByName size="sm" name="ios-home" color="white" />
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
