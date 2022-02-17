import * as generalServices from "./generalServices";
import mapInterfaceData from "./mapInterfaceData";
import manifest from "../manifest.json";

const interfaceData = {
  id: "osid",
  fullName: "teacherFullName",
  refId: "teacherRefId",
  highestQualification: "highestQualification",
  firstName: "teacherFirstName",
  lastName: "teacherLastName",
  currentServiceType: "currentServiceType",
  email: "email",
  mergeParameterWithValue: {
    title: "teacherFullName",
  },
};

export const getAll = async (
  filters = {
    filters: {},
  }
) => {
  const result = await generalServices.post(
    manifest.api_url + "Teacher/search",
    filters
  );
  if (result.data) {
    return result.data.map((e) => mapInterfaceData(e, interfaceData));
  } else {
    return [];
  }
};

export const getOne = async (filters = {}, headers = {}) => {
  const result = await generalServices
    .get(manifest.api_url + "Teacher/edccc63f-fcc7-4529-80b7-feea3fee0f3c", {
      headers: headers,
    })
    .catch((error) => error);
  if (result.data) {
    return mapInterfaceData(result.data, interfaceData);
  } else {
    return {};
  }
};
