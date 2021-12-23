import * as generalServices from "./generalServices";
import mapInterfaceData from "./mapInterfaceData";
import manifest from "../manifest.json";

const interfaceData = {
  id: "osid",
  classID: "classID",
  schoolID: "schoolID",
  class: "class",
  section: "section",
  className: "className",
  osCreatedAt: "osCreatedAt",
  osUpdatedAt: "osUpdatedAt",
  osCreatedBy: "osCreatedBy",
  osUpdatedBy: "osUpdatedBy",
  mergeParameterWithValue: {
    title: "className",
  },
  mergeParameterWithDefaultValue: {
    icon: "CalendarToday",
    route: "/classes/:id",
  },
};

export const getAll = async (
  filters = {
    filters: {},
  }
) => {
  const result = await generalServices.post(
    manifest.api_url + "Class/search",
    filters
  );
  if (result.data) {
    return result.data.map((e) => mapInterfaceData(e, interfaceData));
  } else {
    return [];
  }
};
