import React from "react";
import { Box, Text, HStack, Center } from "native-base";
import IconByName from "../components/IconByName";
import manifest from "../shiksha-os/manifest.json";
import { useTranslation } from "react-i18next";
import { Link, generatePath } from "react-router-dom";

export default function Footer({ routeDynamics }) {
  const [selected, setSelected] = React.useState(1);
  const { t } = useTranslation();
  const footerMenus = manifest.menus.footer;
  const PressableNew = ({ item, children, ...prop }) => {
    return item?.route ? (
      <Box {...prop}>
        <Link
          style={{ color: "rgb(63, 63, 70)", textDecoration: "none" }}
          to={
            routeDynamics
              ? generatePath(item.route, { ...{ id: item.id } })
              : item.route
          }
        >
          {children}
        </Link>
      </Box>
    ) : (
      <Box {...prop}>{children}</Box>
    );
  };
  return (
    <Box flex={1} safeAreaTop>
      <Center flex={1}></Center>
      <HStack bg="white" alignItems="center" safeAreaBottom shadow={6}>
        {footerMenus.map((item, index) => (
          <PressableNew
            item={item}
            key={index}
            cursor="pointer"
            opacity={selected === 0 ? 1 : 0.5}
            py="3"
            flex={1}
            onPress={() => setSelected(0)}
          >
            <Center>
              <IconByName name={item.icon} />
              <Text fontSize="12">{t(item.title)}</Text>
            </Center>
          </PressableNew>
        ))}
      </HStack>
    </Box>
  );
}
