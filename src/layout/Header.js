import React from "react";
import { HStack, Text, Stack, Box, VStack, Avatar, Badge } from "native-base";
import Icon from "../components/IconByName";
import AppBar from "../shiksha-os/menu";

export default function Header({
  iconComponent,
  headingComponent,
  subHeadingComponent,
  icon,
  avatar,
  heading,
  subHeading,
  button,
  _box,
  _heading,
  _subHeading,
  _icon,
  title,
  isEnableHamburgerMenuButton,
  isEnableLanguageMenu,
  isEnableSearchBtn,
  setSearch,
  isDisabledHeader,
  isDisabledAppBar,
  fullRightComponent,
  imageUrl,
}) {
  let newAvatar = avatar ? avatar : sessionStorage.getItem("firstName");
  return (
    <Stack
      width={"100%"}
      style={{
        backgroundImage: imageUrl
          ? "url(" + imageUrl + ")"
          : "url(" + window.location.origin + "/headerBg.png)",
        backgroundColor: "transparent",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      space={5}
    >
      {!isDisabledAppBar ? (
        <AppBar
          isEnableHamburgerMenuButton={isEnableHamburgerMenuButton}
          isEnableLanguageMenu={isEnableLanguageMenu}
          isEnableSearchBtn={isEnableSearchBtn}
          setSearch={setSearch}
          imageUrl={imageUrl}
        />
      ) : (
        <></>
      )}
      {!isDisabledHeader ? (
        !fullRightComponent ? (
          <Box {..._box} py={7} px={5}>
            <HStack justifyContent="space-between" alignItems="center">
              <VStack>
                {subHeadingComponent ? (
                  subHeadingComponent
                ) : (
                  <Text fontSize="xs" {..._subHeading}>
                    {subHeading}
                  </Text>
                )}
                {headingComponent ? (
                  headingComponent
                ) : (
                  <Text bold fontSize="lg" {..._heading}>
                    {title ? title : heading}
                  </Text>
                )}
              </VStack>
              {iconComponent ? (
                iconComponent
              ) : (
                <Avatar bg="amber.500">
                  {newAvatar?.toUpperCase().substr(0, 2)}
                  <Avatar.Badge bg="green.500" top="0" />
                </Avatar>
              )}
              {button}
            </HStack>
          </Box>
        ) : (
          fullRightComponent
        )
      ) : (
        <></>
      )}
    </Stack>
  );
}
