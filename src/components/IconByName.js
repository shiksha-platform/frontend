import React from "react";
import { IconButton as IconButtonCustom, Stack } from "native-base";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

function IconButton({ icon, isDisabled, prefix, _fontawesome, ...props }) {
  if (!isDisabled) {
    return (
      <IconButtonCustom
        {...props}
        icon={
          typeof icon === "string" ? (
            <FontAwesomeIcon
              icon={[prefix ? prefix : "fas", icon]}
              {..._fontawesome}
            />
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
          <FontAwesomeIcon
            icon={[prefix ? prefix : "fas", icon]}
            {..._fontawesome}
          />
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
    // case "users-class":
    //   icon = <IconButton {...props} icon={<UsersClass {...props} />} />;
    //   break;
    // case "backpack":
    //   icon = <IconButton {...props} icon={<BackPack {...props} />} />;
    //   break;
    // case "badge-check":
    //   icon = <IconButton {...props} icon={<BadgeCheck {...props} />} />;
    //   break;
    default:
      icon = <IconButton {...props} icon={props.name} />;
      break;
  }
  return icon;
}
