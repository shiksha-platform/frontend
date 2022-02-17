import * as generalServices from "./generalServices";
import mapInterfaceData from "./mapInterfaceData";
import manifest from "../manifest.json";

const interfaceData = {
  id: "osid",
  refId: "teacherRefId",
  highestQualification: "highestQualification",
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  mergeParameterWithValue: {
    title: "firstName",
  },
};

export const getAll = async (
  filters = {
    filters: {},
  }
) => {
  const result = await generalServices.post(
    manifest.api_url + "teacher/search",
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
    .get(manifest.api_url + "Teacher/" + filters.id, {
      headers: headers,
    })
    .catch((error) => error);
  if (result.data) {
    return mapInterfaceData(result.data, interfaceData);
  } else {
    return {};
  }
};
