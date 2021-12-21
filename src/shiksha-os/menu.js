import React from "react";
import {
  IconButton,
  HStack,
  Text,
  VStack,
  Icon,
  Box,
  StatusBar,
  Pressable,
} from "native-base";
import manifest from "./manifest";
import { Link } from "react-router-dom";
import Menu from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";

export default function AppBar() {
  return (
    <>
      <StatusBar backgroundColor="gray.600" barStyle="light-content" />
      <Box safeAreaTop backgroundColor="gray.600" />
      <HStack
        // bg="gray.600"
        bg="lightBlue.900"
        px="1"
        py="3"
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack space="4" alignItems="center">
          <IconButton size="sm" color="white" icon={<Menu />} />
          <Text color="white" fontSize="20" fontWeight="bold">
            {manifest.name}
          </Text>
        </HStack>
        <HStack space="2">
          <Link to="/">
            <IconButton size="sm" color="white" icon={<HomeIcon />} />
          </Link>
          {/* <IconButton
            icon={
              <Icon
                as={<MaterialIcons name="search" />}
                color="white"
                size="sm"
              />
            }
          />
          <IconButton
            icon={
              <Icon
                as={<MaterialIcons name="more-vert" />}
                size="sm"
                color="white"
              />
            }
          /> */}
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
