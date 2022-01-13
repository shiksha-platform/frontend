import * as generalServices from "../shiksha-os/services/generalServices";
import mapInterfaceData from "../shiksha-os/services/mapInterfaceData";
import manifest from "../shiksha-os/manifest.json";

const interfaceData = {
  id: "osid",
  studentId: "studentId",
  attendance: "attendance",
  date: "date",
  classId: "classId",
  teacherId: "teacherId",
  admissionNo: "admissionNo",
  currentClassID: "currentClassID",
  email: "email",
  osOwner: "osOwner",
};

export const getAll = async (
  filters = {
    filters: {
      filters: {
        classId: {
          eq: "CLAS001",
        },
      },
    },
  }
) => {
  const result = await generalServices.post(
    manifest.api_url + "Attendance/search",
    filters
  );
  if (result.data) {
    return result.data.map((e) => mapInterfaceData(e, interfaceData));
  } else {
    return [];
  }
};

export const create = async (parameters, headers = {}) => {
  const result = await generalServices.post(
    manifest.api_url + "Attendance",
    parameters,
    {
      headers: headers?.headers ? headers?.headers : {},
    }
  );
  if (result.data) {
    return true;
    // return result.data.map((e) => mapInterfaceData(e, interfaceData));
  } else {
    return false;
  }
};

export const update = async (data = {}, headers = {}) => {
  let newInterfaceData = interfaceData;
  if (headers?.removeParameter || headers?.onlyParameter) {
    newInterfaceData = {
      ...interfaceData,
      removeParameter: headers?.removeParameter ? headers?.removeParameter : [],
      onlyParameter: headers?.onlyParameter ? headers?.onlyParameter : [],
    };
  }
  let newData = mapInterfaceData(data, newInterfaceData, true);

  const result = await generalServices.update(
    manifest.api_url + "Attendance/" + data.id,
    newData,
    {
      headers: headers?.headers ? headers?.headers : {},
    }
  );
  if (result.data) {
    return result;
  } else {
    return {};
  }
};
