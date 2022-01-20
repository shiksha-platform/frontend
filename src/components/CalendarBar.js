import moment from "moment";
import { Box, HStack, Text, useToast } from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "./IconByName";
import { weekDaysPageWise } from "./attendance/AttendanceComponent";

const FormatDate = ({ date, type }) => {
  const { t } = useTranslation();
  if (type === "Week") {
    return (
      moment(date[0]).format("Do MMM") +
      " - " +
      moment(date[date.length - 1]).format("Do MMM")
    );
  } else if (type === "Today") {
    return moment(date).format("Do MMM, ddd, HH:MM") + " (" + t("TODAY") + ")";
  } else if (type === "Tomorrow") {
    return moment(date).format("Do MMM, ddd") + " (" + t("TOMORROW") + ")";
  } else if (type === "Yesterday") {
    return moment(date).format("Do MMM, ddd") + " (" + t("YESTERDAY") + ")";
  } else {
    return moment(date).format("Do MMM, ddd");
  }
};

export default function DayWiesBar({
  activeColor,
  setActiveColor,
  page,
  setPage,
  _box,
}) {
  const todayDate = new Date();
  const [date, setDate] = useState();

  useEffect(() => {
    setDate(new Date(todayDate.setDate(todayDate.getDate() + page)));
    if (setActiveColor) {
      setActiveColor(page === 0 ? "primary.500" : "coolGray.500");
    }
  }, [page]);

  return (
    <Display
      {...{
        activeColor,
        setActiveColor,
        page,
        setPage,
        _box,
      }}
    >
      <FormatDate
        date={date}
        type={
          page === 0
            ? "Today"
            : page === 1
            ? "Tomorrow"
            : page === -1
            ? "Yesterday"
            : ""
        }
      />
    </Display>
  );
}

export function WeekWiesBar({
  activeColor,
  setActiveColor,
  page,
  setPage,
  _box,
  nextDisabled,
  previousDisabled,
  rightErrorText,
  leftErrorText,
}) {
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    setWeekDays(weekDaysPageWise(page));
    if (setActiveColor) {
      setActiveColor(page === 0 ? "primary.500" : "coolGray.500");
    }
  }, [page]);

  return (
    <Display
      {...{
        activeColor,
        setActiveColor,
        page,
        setPage,
        _box,
        nextDisabled,
        previousDisabled,
        rightErrorText,
        leftErrorText,
      }}
    >
      <FormatDate date={weekDays} type="Week" />
    </Display>
  );
}

const Display = ({
  children,
  activeColor,
  page,
  setPage,
  nextDisabled,
  previousDisabled,
  rightErrorText,
  leftErrorText,
  _box,
}) => {
  const toast = useToast();
  return (
    <Box bg="white" p="1" {..._box}>
      <HStack justifyContent="space-between" alignItems="center">
        <HStack space="4" alignItems="center">
          <Icon
            size="sm"
            color={
              typeof previousDisabled === "undefined" ||
              previousDisabled === false
                ? activeColor
                  ? activeColor
                  : "primary.500"
                : "gray.400"
            }
            name="ArrowCircleLeftOutlined"
            onPress={(e) => {
              if (leftErrorText) {
                toast.show(leftErrorText);
              } else if (
                typeof previousDisabled === "undefined" ||
                previousDisabled === false
              ) {
                setPage(page - 1);
              }
            }}
          />
        </HStack>
        <HStack space="4" alignItems="center">
          <Text fontSize="md" bold>
            {children}
          </Text>
        </HStack>
        <HStack space="2">
          <Icon
            size="sm"
            color={
              typeof nextDisabled === "undefined" || nextDisabled === false
                ? activeColor
                  ? activeColor
                  : "primary.500"
                : "gray.400"
            }
            name="ArrowCircleRightOutlined"
            onPress={(e) => {
              if (rightErrorText) {
                toast.show(rightErrorText);
              } else if (
                typeof nextDisabled === "undefined" ||
                nextDisabled === false
              ) {
                setPage(page + 1);
              }
            }}
          />
        </HStack>
      </HStack>
    </Box>
  );
};
