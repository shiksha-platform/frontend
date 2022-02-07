import React from "react";
import { Text, Box, Stack, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import Layout from "../layout/Layout";
import Widget from "../components/Widget";

export default function Home() {
  const { t } = useTranslation();
  const firstName = sessionStorage.getItem("firstName");

  const widgetData = [
    {
      title: t("QUICK_CHECK"),
      data: [
        {
          title: t("TIME_TABLE"),
          subTitle: "2 " + t("FREE_PERIODS"),
          _box: {
            style: {
              background:
                "linear-gradient(281.03deg, #FC5858 -21.15%, #F8AF5A 100.04%)",
            },
          },
        },
        {
          title: t("CALENDAR"),
          subTitle: "8 " + t("HOLIDAYS"),
          _box: {
            style: {
              background:
                "linear-gradient(102.88deg, #D7BEE6 -5.88%, #B143F3 116.6%)",
            },
          },
        },
      ],
    },
    {
      title: t("TODAY_TASKS"),
      data: [
        {
          title: t("CLASSES"),
          subTitle: "3 " + t("REMAINING"),
          icon: "ParentLineIcon",
          _box: {
            bg: "violet.200",
          },
          _text: { color: "warmGray.700" },
        },
        {
          title: t("ACTIVITY"),
          subTitle: "1 " + t("REMAINING"),
          icon: "LightbulbFlashLineIcon",
          _box: {
            bg: "orange.200",
          },
          _text: { color: "warmGray.700" },
        },
        {
          title: t("HOLIDAYS"),
          subTitle: "2 " + t("THIS_WEEK"),
          icon: "FootballLineIcon",
          _box: {
            bg: "blue.200",
          },
          _text: {
            color: "warmGray.700",
          },
        },
        {
          title: t("ATTENDANCE"),
          subTitle: "12 " + t("REMAINING"),
          icon: "UserFollowLineIcon",
          _box: {
            bg: "green.200",
          },
          _text: { color: "warmGray.700" },
        },
      ],
    },
    {
      title: t("THIS_WEEK_TASKS"),
      data: [
        {
          title: t("INSPECTION"),
          subTitle: "1 " + t("OFFICAL_VISIT"),
          icon: "Medal2LineIcon",
          _box: {
            bg: "orange.200",
          },
          _text: { color: "warmGray.700" },
        },
        {
          title: t("ACTIVITY"),
          subTitle: "1 " + t("SCHOOL_ACTIVITY"),
          icon: "LightbulbFlashLineIcon",
          _box: {
            bg: "violet.200",
          },
          _text: { color: "warmGray.700" },
        },
      ],
    },
  ];

  return (
    <Layout
      _header={{
        title: firstName,
        isEnableHamburgerMenuButton: true,
        isEnableLanguageMenu: true,
        avatar: firstName,
        heading: firstName,
        subHeading: t("GOOD_MORNING"),
        _box: { backgroundColor: "transparent" },
        _icon: { color: "black" },
        _heading: { color: "black" },
        _subHeading: { color: "black" },
      }}
      subHeader={t("THIS_IS_HOW_YOUR_DAY_LOOKS")}
      _subHeader={{ bg: "white" }}
    >
      <Box bg="white" roundedBottom={"2xl"} py={6} px={4} shadow={3}>
        <Stack>
          <VStack space={6}>
            {widgetData.map((item, index) => {
              return <Widget {...item} key={index} />;
            })}
          </VStack>
        </Stack>
      </Box>
    </Layout>
  );
}
