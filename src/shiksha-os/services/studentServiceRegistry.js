import * as generalServices from "./generalServices";
import mapInterfaceData from "./mapInterfaceData";
import manifest from "../manifest.json";

const interfaceData = {
  id: "osid",
  fullName: "studentFullName",
  firstName: "studentFirstName",
  fathersName: "studentFathersName",
  lastName: "studentLastName",
  refId: "studentRefId",
  admissionNo: "admissionNo",
  currentClassID: "currentClassID",
  email: "email",
  osOwner: "osOwner",
};

export const getAll = async (
  filters = {
    limit: 5,
    filters: {
      currentClassID: {
        startsWith: "1",
      },
    },
  }
) => {
  const result = await generalServices.post(
    manifest.api_url + "Student/search",
    filters
  );
  if (result.data) {
    return result.data.map((e) => mapInterfaceData(e, interfaceData));
  } else {
    return [];
  }
};

export const getOne = async (filters = {}, headers = {}) => {
  const result = await generalServices.get(
    manifest.api_url + "Student/" + filters.id,
    {
      headers: headers,
    }
  );
  if (result.data) {
    let resultStudent = mapInterfaceData(result.data, interfaceData);
    resultStudent.id = resultStudent.id.replace("1-", "");
    return resultStudent;
  } else {
    return {};
  }
};
