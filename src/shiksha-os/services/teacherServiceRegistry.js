import * as generalServices from "./generalServices";
import mapInterfaceData from "./mapInterfaceData";
import manifest from "../manifest.json";

const interfaceData = {
  id: "teacherId",
  firstName: "firstName",
  lastName: "lastName",
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
    manifest.api_url + "/teacher/search",
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
    .get(manifest.api_url + "/teacher/ebecc2ee-4f56-43bf-8cc8-d4847a12762e", {
      headers: headers,
    })
    .catch((error) => error);
  if (result.data) {
    return mapInterfaceData(result.data.data, interfaceData);
  } else {
    return;
  }
};
