import { isDate, isArray, isBoolean, isRegExp, isError } from "lodash";

const getType = obj => {
  let type = typeof obj;
  if (obj === null) {
    return "null";
  }
  if (type !== "object") {
    return type;
  } else {
    if (isDate(obj)) {
      return "date";
    } else if (isArray(obj)) {
      return "array";
    } else if (isBoolean(obj)) {
      return "boolean";
    } else if (isRegExp(obj)) {
      return "regexp";
    } else if (isError(obj)) {
      return "error";
    } else {
      return type;
    }
  }
};

export default getType;
