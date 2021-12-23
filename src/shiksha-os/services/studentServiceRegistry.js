import * as generalServices from "./generalServices";
import mapInterfaceData from "./mapInterfaceData";
import manifest from "../manifest.json";

const interfaceData = {
  id: "osid",
  fullName: "studentFullName",
  firstName: "studentFirstName",
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
