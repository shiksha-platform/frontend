import React from "react";

import {
  HStack,
  Text,
  Link,
  VStack,
  Box,
  FlatList,
  Pressable,
} from "native-base";
import Icon from "./IconByName";
import { generatePath } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Menu({ items, type, routeDynamics, bg }) {
  const { t } = useTranslation();

  const PressableNew = ({ item, children, ...prop }) => {
    return item?.route ? (
      <Pressable {...prop}>
        <Link
          href={
            routeDynamics
              ? generatePath(item.route, { ...{ id: item.id } })
              : item.route
          }
        >
          {children}
        </Link>
      </Pressable>
    ) : (
      <Box {...prop}>{children}</Box>
    );
  };

  if (type === "veritical") {
    return (
      <Box bg={bg} p={5}>
        <HStack justifyContent="center">
          {items.map((item) => (
            <PressableNew
              px="5"
              py="3"
              key={item.keyId ? item.keyId : item.id}
              item={item}
            >
              <VStack space="4" my="2" mx="1" alignItems="center">
                <Icon
                  name={item.icon}
                  p="0"
                  color="primary.500"
                  _icon={{
                    style: {
                      fontSize: "45px",
                      border: "2px solid #54b8d4",
                      borderRadius: "50%",
                      padding: "20px",
                    },
                  }}
                />
                <Text color="gray.700" fontWeight="500">
                  {item.title}
                </Text>
              </VStack>
            </PressableNew>
          ))}
        </HStack>
      </Box>
    );
  } else {
    return (
      <Box bg={bg}>
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <Box
              borderBottomWidth="1"
              _dark={{
                borderColor: "gray.600",
              }}
              borderLeftWidth={item.activeMenu ? "5" : ""}
              borderLeftColor={item.activeMenu ? "primary.500" : ""}
              borderColor={"coolGray.200"}
            >
              <VStack space="6" my="2" mx="1">
                <PressableNew px="5" py="1" item={item}>
                  <HStack space={3}>
                    <HStack space="7" alignItems="center">
                      {item.leftText ? (
                        <Text color="gray.700" fontWeight="500">
                          {item.leftText}
                        </Text>
                      ) : (
                        <Icon name={item.icon} p="0" />
                      )}
                      <Text color="gray.700" fontWeight="500">
                        {t(item.title)}
                      </Text>
                    </HStack>
                  </HStack>
                </PressableNew>
              </VStack>
            </Box>
          )}
          keyExtractor={(item, index) => (item.id ? item.id : index)}
        />
      </Box>
    );
  }
}
