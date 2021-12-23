export default function interfaceData(element, formate) {
  const data = {};
  for (var [key1, value1] of Object.entries(formate)) {
    if (key1 === "mergeParameterWithDefaultValue") {
      for (var [mKey1, mValue1] of Object.entries(value1)) {
        data[mKey1] = mValue1;
      }
    } else if (key1 === "mergeParameterWithValue") {
      for (var [mvKey1, mvValue1] of Object.entries(value1)) {
        data[mvKey1] = element[mvValue1];
      }
    } else {
      data[key1] = element[value1];
    }
  }
  return data;
}
