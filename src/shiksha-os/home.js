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
          title: "Time Table",
          subTitle: "2 Free Periods",
          _box: {
            style: {
              background:
                "linear-gradient(281.03deg, #FC5858 -21.15%, #F8AF5A 100.04%)",
            },
          },
        },
        {
          title: "Calendar",
          subTitle: "8 Holidays",
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
      title: t("TODAY"),
      data: [
        {
          title: "Classes",
          subTitle: "3 Remaining",
          icon: "users",
          _box: {
            bg: "violet.200",
          },
          _text: { color: "warmGray.700" },
        },
        {
          title: "Activity",
          subTitle: "1 activity to perform",
          icon: "theater-masks",
          _box: {
            bg: "orange.200",
          },
          _text: { color: "warmGray.700" },
        },
        {
          title: "Holidays",
          subTitle: "2 This week",
          icon: "volleyball-ball",
          _box: {
            bg: "blue.200",
          },
          _text: {
            color: "warmGray.700",
          },
        },
        {
          title: "Attendance",
          subTitle: "12 Remaining",
          icon: "suitcase-rolling",
          _box: {
            bg: "green.200",
          },
          _text: { color: "warmGray.700" },
        },
      ],
    },
    {
      title: t("THIS_WEEK"),
      data: [
        {
          title: "Inspection",
          subTitle: "1 Offical visit",
          icon: "award",
          _box: {
            bg: "orange.200",
          },
          _text: { color: "warmGray.700" },
        },
        {
          title: "Activity",
          subTitle: "2 School Activity",
          icon: "theater-masks",
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
        title: t("MY_SCHOOL_APP"),
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
    >
      <Box bg="white" roundedTop={"2xl"} py={6} px={4} shadow={3}>
        <Stack>
          <VStack space={6}>
            <Text>{t("THIS_IS_HOW_YOUR_DAY_LOOKS")}</Text>
            {widgetData.map((item, index) => {
              return <Widget {...item} key={index} />;
            })}
          </VStack>
        </Stack>
      </Box>
    </Layout>
  );
}
