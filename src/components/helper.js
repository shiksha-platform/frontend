import React from "react";
import manifest from "../shiksha-os/manifest.json";

export const maxWidth = manifest?.maxWidth ? manifest?.maxWidth : "414";
export function useWindowSize() {
  const [size, setSize] = React.useState([0, 0]);
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize([
        window.innerWidth > maxWidth ? maxWidth : "100%",
        window.innerHeight,
      ]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

export const getUniqAttendance = (attendances, status, students = []) => {
  let studentIds = students.map((e) => e.id);
  return attendances
    .slice()
    .reverse()
    .filter((value, index, self) => {
      return (
        self.findIndex(
          (m) =>
            value?.studentId === m?.studentId &&
            value?.date === m?.date &&
            value?.attendance === status
        ) === index
      );
    })
    .filter(
      (e) =>
        studentIds.includes(e.studentId) &&
        e.studentId &&
        e.date &&
        e.attendance &&
        e.id
    );
};
export const getStudentsPresentAbsent = (
  attendances,
  students,
  count,
  status = "Present"
) => {
  const newPresent = getUniqAttendance(attendances, status, students);
  return students
    .map((value) => {
      let newCount = newPresent.filter((e) => e.studentId === value.id).length;
      if (newCount >= count) {
        return {
          count,
          id: value.id,
        };
      }
    })
    .filter((e) => e?.id);
};
