import React from "react";
import { IconButton as IconButtonCustom, Stack } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

import UsersClass from "../assets/icons/UsersClass";
import BackPack from "../assets/icons/BackPack";
import BadgeCheck from "../assets/icons/BadgeCheck";

library.add(fas);

function IconButton({ icon, isDisabled, prefix, ...props }) {
  if (!isDisabled) {
    return (
      <IconButtonCustom
        {...props}
        icon={
          typeof icon === "string" ? (
            <FontAwesomeIcon icon={[prefix ? prefix : "fas", icon]} />
          ) : (
            icon
          )
        }
      />
    );
  } else {
    return (
      <Stack {...props}>
        {typeof icon === "string" ? (
          <FontAwesomeIcon icon={[prefix ? prefix : "fas", icon]} />
        ) : (
          icon
        )}
      </Stack>
    );
  }
}

export default function IconByName(props) {
  let icon = <></>;
  switch (props.name) {
    case "users-class":
      icon = <IconButton {...props} icon={<UsersClass {...props} />} />;
      break;
    case "backpack":
      icon = <IconButton {...props} icon={<BackPack {...props} />} />;
      break;
    case "badge-check":
      icon = <IconButton {...props} icon={<BadgeCheck {...props} />} />;
      break;
    default:
      icon = <IconButton {...props} icon={props.name} />;
      break;
  }
  return icon;
}
