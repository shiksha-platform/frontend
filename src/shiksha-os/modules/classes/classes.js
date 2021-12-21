import React from "react";
import {
  IconButton,
  HStack,
  Text,
  Link,
  VStack,
  Button,
  Stack,
  Box,
  FlatList,
  Pressable,
} from "native-base";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// Start editing here, save and see your changes.
export default function App() {
  const classes = [
    {
      title: "Class V, Sec B, Maths",
      icon: "card-account-details-outline",
      route: "/students",
    },
    {
      title: "Class V, Sec C, Maths",
      icon: "card-account-details-outline",
      route: "/students",
    },
    {
      title: "Class VI, Sec A, Science",
      icon: "card-account-details-outline",
      route: "/students",
    },
    {
      title: "Class VI, Sec A, Maths",
      icon: "card-account-details-outline",
      route: "/students",
    },
  ];

  return (
    <>
      <Box>
        <Stack space={1}>
          <Box p="2" bg="gray.100">
            <HStack space={7} p="4" py="3" alignItems="center">
              <IconButton
                color="gray.600"
                size="lg"
                icon={<CalendarTodayIcon />}
              />
              <VStack>
                <Text
                  _dark={{
                    color: "warmGray.50",
                  }}
                  color="coolGray.800"
                  bold
                >
                  The page shows
                </Text>
                <Text
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                >
                  the classes you take
                </Text>
              </VStack>
            </HStack>
          </Box>
        </Stack>
      </Box>
      <Box backgroundColor="gray.100" p={3}>
        <Text color="primary.500" bold={true}>
          TODAY'S CLASSES
        </Text>
        <Stack>
          <VStack>
            <Text>
              10:30-11:20 Maths, VI A <Text bold>NOW</Text>
            </Text>
            <Text>
              1:30-2:40 Substitution, V B <Text bold>NEW</Text>
            </Text>
            <HStack space={2} justifyContent={"right"}>
              <Button
                variant="outline"
                colorScheme="default"
                background={"#fff"}
                size="container"
                px={1}
              >
                Time table
              </Button>
            </HStack>
          </VStack>
        </Stack>
      </Box>
      <Box>
        <FlatList
          data={classes}
          renderItem={({ item }) => (
            <Box
              borderBottomWidth="1"
              _dark={{
                borderColor: "gray.600",
              }}
              borderColor="coolGray.200"
            >
              <HStack space={3} justifyContent="space-between">
                <VStack space="6" my="2" mx="1">
                  <Pressable px="5" py="3">
                    <Link href={item.route}>
                      <HStack space="7" alignItems="center">
                        <IconButton
                          color="gray.600"
                          size="lg"
                          icon={<CalendarTodayIcon />}
                        />
                        <Text color="gray.700" fontWeight="500">
                          {item.title}
                        </Text>
                      </HStack>
                    </Link>
                  </Pressable>
                </VStack>
              </HStack>
            </Box>
          )}
          keyExtractor={(item) => item.id}
        />
      </Box>
      <Box>
        <HStack space={2} justifyContent={"right"}>
          <Button
            variant="outline"
            colorScheme="default"
            background={"#fff"}
            size="container"
            px={1}
            m="3"
          >
            Show subject wise
          </Button>
        </HStack>
      </Box>
    </>
  );
}
