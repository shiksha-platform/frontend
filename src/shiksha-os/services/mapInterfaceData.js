export default function interfaceData(element, formate) {
  const data = {};
  for (var [key1, value1] of Object.entries(formate)) {
    data[key1] = element[value1];
  }
  return data;
}
