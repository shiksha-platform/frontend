import React, { useEffect, useState } from "react";
import { Text, Box, Stack, VStack, HStack } from "native-base";
// import manifest from "./manifest";
import { useTranslation } from "react-i18next";
import * as classServiceRegistry from "../shiksha-os/services/classServiceRegistry";
import Layout from "../layout/Layout";
import IconByName from "../components/IconByName";
// import * as studentServiceRegistry from "../shiksha-os/services/studentServiceRegistry";
// import * as attendanceServiceRegistry from "../services/attendanceServiceRegistry";

// Start editing here, save and see your changes.
export default function Home() {
  // const menus = manifest.menus.main;
  const { t } = useTranslation();
  const firstName = sessionStorage.getItem("firstName");
  // const fullName = sessionStorage.getItem("fullName");
  const [classes, setClasses] = useState([]);
  // const [students, setStudents] = useState([]);
  const authId = sessionStorage.getItem("id");
  // const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      if (!ignore) {
        let resultClasses = await classServiceRegistry.getAll({
          filters: {
            teacherId: {
              eq: authId,
            },
          },
        });
        setClasses(resultClasses);
      }
    };
    getData();
  }, [authId]);

  const chunk = (array, chunk) => {
    return [].concat.apply(
      [],
      array.map(function (elem, i) {
        return i % chunk ? [] : [array.slice(i, i + chunk)];
      })
    );
  };

  const Widget = ({ data, title }) => {
    const newData = chunk(data ? data : [], 2);
    const rotate = {
      bottom: "0px",
      right: 0,
      position: "absolute",
      bottum: "0",
      style: { transform: "rotateZ(316deg)" },
    };
    return (
      <Stack space={2}>
        <Text fontSize={"lg"}>{title}</Text>
        <VStack space={3}>
          {newData.map((subData, index) => (
            <HStack key={index} space={3} width={"100%"}>
              {subData.map((item, subIndex) => (
                <Box
                  key={subIndex}
                  rounded="xl"
                  shadow={3}
                  p={4}
                  width="48%"
                  overflow={"hidden"}
                  {...item?._box}
                >
                  <Text
                    {...{
                      fontSize: "md",
                      fontWeight: "medium",
                      color: "coolGray.50",
                    }}
                    {...item?._text}
                  >
                    <VStack>
                      <Text bold>{item?.title}</Text>
                      <Text fontSize={"xs"}>{item?.subTitle}</Text>
                    </VStack>
                  </Text>
                  {item.icon ? (
                    <>
                      <Box
                        {...{
                          ...rotate,
                          bg: "coolGray.700",
                          roundedTop: "20px",
                          minW: "50px",
                          minH: "50px",
                          right: "-10px",
                          bottom: "-10px",
                          opacity: "0.2",
                        }}
                      />
                      <IconByName
                        name={item.icon}
                        {...{
                          color: "coolGray.700",
                          opacity: "0.5",
                          ...rotate,
                          ...item?._icon,
                        }}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </Box>
              ))}
            </HStack>
          ))}
        </VStack>
      </Stack>
    );
  };

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
          icon: "users-class",
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
          icon: "backpack",
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
      header={{
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
