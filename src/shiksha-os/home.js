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
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import EventNoteIcon from "@mui/icons-material/EventNote";
import manifest from "./manifest";

const Icon = (props) => {
  if (props.type === "email") return <EmailIcon className={props.className} />;
  if (props.type === "person") return <GroupIcon className={props.className} />;
  if (props.type === "calendar")
    return <EventNoteIcon className={props.className} />;
  return <></>;
};

// Start editing here, save and see your changes.
export default function Home() {
  const menus = manifest.menus.main;

  return (
    <>
      <Box backgroundColor="gray.200" p={3}>
        <Text>Good Morning, Sheetal! This is how your day looks...</Text>
      </Box>
      <Box backgroundColor="gray.100" p={3}>
        <Text color="green.700" bold={true}>
          TODAY
        </Text>
        <Stack>
          <VStack>
            <Text>you have 3 classes</Text>
            <Text>21 student profile in complate</Text>
            <HStack space={2}>
              <Text>New 1 activity added to school</Text>
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
      <Box backgroundColor="gray.100" p={3}>
        <Text color="green.700" bold={true}>
          THIS WEEK
        </Text>
        <HStack space={2}>
          <Text>2 school activities, 1 offical visit</Text>
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
      </Box>
      <Box>
        <FlatList
          data={menus}
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
                        <Icon type={item.icon} />
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
    </>
  );
}
