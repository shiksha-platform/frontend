import React from "react";
import { IconButton as IconButtonCustom } from "native-base";
import {
  ArrowCircleLeftOutlined,
  ArrowCircleRightOutlined,
  AssignmentTurnedIn,
  CalendarToday,
  Email,
  EventNote,
  Group,
  Home,
  InsertEmoticon,
  Login,
  MoreVert,
  Person,
  Menu,
  ArrowForwardIos,
  AppRegistration,
  MenuBook,
  CameraAlt,
  ArrowDropDown,
  ArrowDropUp,
} from "@mui/icons-material";

function IconButton({ icon, ...props }) {
  return (
    <IconButtonCustom {...props} icon={React.cloneElement(icon, props._icon)} />
  );
}

export default function IconByName(props) {
  let icon = <></>;

  switch (props.name) {
    case "Home":
      icon = <IconButton {...props} icon={<Home />} />;
      break;
    case "Group":
      icon = <IconButton {...props} icon={<Group />} />;
      break;
    case "EventNote":
      icon = <IconButton {...props} icon={<EventNote />} />;
      break;
    case "CalendarToday":
      icon = <IconButton {...props} icon={<CalendarToday />} />;
      break;
    case "Person":
      icon = <IconButton {...props} icon={<Person />} />;
      break;
    case "Email":
      icon = <IconButton {...props} icon={<Email />} />;
      break;
    case "AssignmentTurnedIn":
      icon = <IconButton {...props} icon={<AssignmentTurnedIn />} />;
      break;
    case "ArrowCircleLeftOutlined":
      icon = <IconButton {...props} icon={<ArrowCircleLeftOutlined />} />;
      break;
    case "ArrowCircleRightOutlined":
      icon = <IconButton {...props} icon={<ArrowCircleRightOutlined />} />;
      break;
    case "InsertEmoticon":
      icon = <IconButton {...props} icon={<InsertEmoticon />} />;
      break;
    case "Menu":
      icon = <IconButton {...props} icon={<Menu />} />;
      break;
    case "MoreVert":
      icon = <IconButton {...props} icon={<MoreVert />} />;
      break;
    case "Login":
      icon = <IconButton {...props} icon={<Login />} />;
      break;
    case "ArrowForwardIos":
      icon = <IconButton {...props} icon={<ArrowForwardIos />} />;
      break;
    case "AppRegistration":
      icon = <IconButton {...props} icon={<AppRegistration />} />;
      break;
    case "MenuBook":
      icon = <IconButton {...props} icon={<MenuBook />} />;
      break;
    case "CameraAlt":
      icon = <IconButton {...props} icon={<CameraAlt />} />;
      break;
    case "ArrowDropDown":
      icon = <IconButton {...props} icon={<ArrowDropDown />} />;
      break;
    case "ArrowDropUp":
      icon = <IconButton {...props} icon={<ArrowDropUp />} />;
      break;
    default:
      icon = <IconButton {...props} icon={<Home />} />;
      break;
  }
  return icon;
}
