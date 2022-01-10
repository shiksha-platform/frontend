import React, { useEffect, useState } from "react";
import {
  IconButton,
  Image,
  HStack,
  Text,
  VStack,
  Button,
  Stack,
  AspectRatio,
  Box,
  FlatList,
  Avatar,
  Spacer,
  Link,
} from "native-base";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PersonIcon from "@mui/icons-material/Person";
import * as studentServiceRegistry from "../../services/studentServiceRegistry";
import * as classServiceRegistry from "../../services/classServiceRegistry";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [classObject, setClassObject] = useState({});
  const { classId } = useParams();
  const fullName = sessionStorage.getItem("fullName");

  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      setStudents(
        await studentServiceRegistry.getAll({
          filters: {
            currentClassID: {
              startsWith: classId,
            },
          },
        })
      );

      let classObj = await classServiceRegistry.getOne({ id: classId });
      if (!ignore) setClassObject(classObj);
    };
    getData();
  }, [classId]);

  return (
    <>
      <Box>
        <Box>
          <AspectRatio w="100%" ratio={16 / 9}>
            <Image
              source={{
                uri: "https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg",
              }}
              alt="image"
            />
          </AspectRatio>

          <Box position="absolute" top="2" left="2">
            <IconButton color="white" icon={<CameraAltIcon />} />
          </Box>
          <Box position="absolute" bottom="2" px={3}>
            <HStack space={7} alignItems="center">
              <IconButton color="white" icon={<PersonIcon />} />
              <Text color="gray.100" fontWeight="700" fontSize="lg">
                {classObject.className}
              </Text>
            </HStack>
          </Box>
          <Button
            variant="ghost"
            borderRadius="50"
            colorScheme="default"
            background="gray.100"
            position="absolute"
            bottom="2"
            right="2"
          >
            {t("SHARE")}
          </Button>
        </Box>
        <Stack p="4" space={1}>
          <Stack space={2}>
            <Text color="green.700" bold={true}>
              {t("SUMMARY")}
            </Text>
          </Stack>
          <Box borderWidth={1} p="2" borderColor="gray.500" bg="gray.50">
            <HStack space={3}>
              <Text>
                <Text bold>{t("STUDENTS")}:</Text> {students.length}
              </Text>
              <Text>
                <Text bold>{t("GIRLS")}:</Text>
              </Text>
              <Text>
                <Text bold>{t("BOYS")}:</Text>
              </Text>
            </HStack>

            <Text>
              <Text bold>{t("AGE_GROUP")}:</Text>
            </Text>
            <Text>
              <Text bold>{t("CLASS_TEACHER")}:</Text> {fullName}
            </Text>
          </Box>
        </Stack>

        <Stack pt="0" p="4" space={1}>
          <Stack space={2}>
            <Text color="green.700" bold={true}>
              {t("STUDENTS")}
            </Text>
          </Stack>

          <Box borderWidth={1} p="2" borderColor="gray.500" bg="gray.50">
            <FlatList
              data={students}
              renderItem={({ item }) => (
                <Link href={"/students/" + item.id}>
                  <Box
                    borderBottomWidth="1"
                    _dark={{
                      borderColor: "gray.600",
                    }}
                    borderColor="coolGray.200"
                    pl="4"
                    pr="5"
                    py="2"
                  >
                    <HStack space={3} justifyContent="space-between">
                      <Avatar
                        size="48px"
                        source={{
                          uri: item.avatarUrl,
                        }}
                      />
                      <VStack>
                        <Text
                          _dark={{
                            color: "warmGray.50",
                          }}
                          color="coolGray.800"
                          bold
                        >
                          {item.fullName}
                        </Text>
                        <Text
                          color="coolGray.600"
                          _dark={{
                            color: "warmGray.200",
                          }}
                        >
                          {item.email}
                        </Text>
                      </VStack>
                      <Spacer />
                      <Text
                        fontSize="xs"
                        _dark={{
                          color: "warmGray.50",
                        }}
                        color="coolGray.800"
                        alignSelf="flex-start"
                      >
                        {item.timeStamp}
                      </Text>
                    </HStack>
                  </Box>
                </Link>
              )}
              keyExtractor={(item) => item.id}
            />
          </Box>
        </Stack>
      </Box>
    </>
  );
}
