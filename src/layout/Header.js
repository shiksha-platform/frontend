import React from "react";
import { HStack, Text, Stack, Box, VStack, Avatar } from "native-base";
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
  return (
    <Stack
      width={"100%"}
      style={{
        backgroundImage: imageUrl
          ? "url(" + imageUrl + ")"
          : "url(headerBg.png)",
        backgroundColor: "transparent",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      space={5}
    >
      {!isDisabledAppBar ? (
        <AppBar
          title={title}
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
                  <Text color="coolGray.50" fontSize="xs" {..._subHeading}>
                    {subHeading}
                  </Text>
                )}
                {headingComponent ? (
                  headingComponent
                ) : (
                  <Text color="coolGray.100" bold fontSize="lg" {..._heading}>
                    {heading}
                  </Text>
                )}
              </VStack>
              {iconComponent ? (
                iconComponent
              ) : icon ? (
                <Icon
                  p="0"
                  name={icon}
                  color="white"
                  {..._icon}
                  _icon={{
                    style: { fontSize: "45px" },
                  }}
                />
              ) : (
                <Avatar bg="green.500">
                  {avatar?.toUpperCase().substr(0, 2)}
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
