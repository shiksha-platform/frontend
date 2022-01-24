import React from "react";
import { IconButton as IconButtonCustom, Stack } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

import UsersClass from "../assets/icons/UsersClass";
import BackPack from "../assets/icons/BackPack";

library.add(fas);

function IconButton({ icon, isDisabled, ...props }) {
  if (!isDisabled) {
    return (
      <IconButtonCustom
        {...props}
        icon={
          typeof icon === "string" ? (
            <FontAwesomeIcon icon={["fas", icon]} />
          ) : (
            icon
          )
        }
      />
    );
  } else {
    return <Stack {...props}>{<FontAwesomeIcon icon={["fas", icon]} />}</Stack>;
  }
}

export default function IconByName(props) {
  let icon = <></>;
  switch (props.name) {
    case "users-class":
      icon = <IconButton {...props} icon={<UsersClass />} />;
      break;
    case "backpack":
      icon = <IconButton {...props} icon={<BackPack />} />;
      break;
    default:
      icon = <IconButton {...props} icon={props.name} />;
      break;
  }
  return icon;
}
