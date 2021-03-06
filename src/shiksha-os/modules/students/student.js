import React, { useEffect, useState } from "react";
import {
  Text,
  Button,
  Stack,
  Box,
  VStack,
  HStack,
  Pressable,
  PresenceTransition,
  FlatList,
} from "native-base";
import * as studentServiceRegistry from "../../services/studentServiceRegistry";
import * as classServiceRegistry from "../../services/classServiceRegistry";
import { useTranslation } from "react-i18next";
import Layout from "../../../layout/Layout";
import { useParams } from "react-router-dom";
import Card from "../../../components/students/Card";
import IconByName from "../../../components/IconByName";

// Start editing here, save and see your changes.
export default function App() {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [classObject, setClassObject] = useState({});
  const { classId } = useParams();

  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      setStudents(
        await studentServiceRegistry.getAll({
          filters: {
            currentClassID: {
              eq: classId,
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
    <Layout
      _header={{
        title: classObject.className,
        subHeading: t("CLASS_DETAILS"),
        avatar: true,
      }}
      subHeader={
        <Text fontWeight="400" fontSize="16px">
          {t("VIEW_ALL_STUDENTS")}
        </Text>
      }
      _subHeader={{ bg: "classCard.500" }}
    >
      <Box bg="white" p={4}>
        <Stack space={2}>
          <Collapsible
            defaultCollapse={true}
            isHeaderBold={false}
            header={
              <>
                <VStack>
                  <Text fontWeight="600" fontSize={"16px"} color="gray.800">
                    {t("STUDENTS_LIST")}
                  </Text>
                  <Text fontSize={"xs"}>
                    {t("TOTAL") + ": " + students?.length}
                  </Text>
                </VStack>
              </>
            }
            body={
              <VStack space={2} pt="2">
                <Box>
                  <FlatList
                    data={students}
                    renderItem={({ item }) => (
                      <Box
                        borderBottomWidth="1"
                        _dark={{
                          borderColor: "gray.600",
                        }}
                        borderColor="coolGray.200"
                        pr="1"
                        py="4"
                      >
                        <Card item={item} href={"/students/" + item.id} />
                      </Box>
                    )}
                    keyExtractor={(item) => item.id}
                  />
                </Box>
                <Button mt="2" variant="outline" colorScheme="button">
                  {t("SEE_ALL_STUDENTS")}
                </Button>
              </VStack>
            }
          />
        </Stack>
      </Box>
    </Layout>
  );
}

const Collapsible = ({
  header,
  body,
  defaultCollapse,
  isHeaderBold,
  isDisableCollapse,
  onPressFuction,
  collapsButton,
  _header,
  _icon,
  _box,
}) => {
  const [collaps, setCollaps] = useState(defaultCollapse);

  return (
    <>
      <Pressable
        onPress={() => {
          if (onPressFuction) {
            onPressFuction();
          }
          if (!isDisableCollapse) {
            setCollaps(!collaps);
          }
        }}
      >
        <Box>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Text
              fontSize={typeof isHeaderBold === "undefined" ? "14px" : ""}
              color="coolGray.400"
              fontWeight="500"
            >
              {header}
            </Text>
            <IconByName
              size="sm"
              isDisabled={true}
              color={
                !collaps || collapsButton ? "coolGray.400" : "coolGray.600"
              }
              name={
                !collaps || collapsButton
                  ? "ArrowDownSLineIcon"
                  : "ArrowUpSLineIcon"
              }
              {..._icon}
            />
          </HStack>
        </Box>
      </Pressable>
      <PresenceTransition visible={collaps}>{body}</PresenceTransition>
    </>
  );
};
