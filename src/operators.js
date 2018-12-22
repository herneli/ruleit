import { isArray, filter } from "lodash";

const operators = {
  toLower: {
    call: value => String(value).toLowerCase(),
    allowed: ["string"]
  },
  toUpper: {
    call: value => String(value).toUpperCase(),
    allowed: ["string"]
  },
  substring: {
    call: (value, params) => {
      return String(value).substring(params.start, params.end);
    },
    allowed: ["string"],
    params: {
      start: { allowed: ["number"] },
      end: { allowed: ["number"] }
    }
  },
  contains: {
    call: (value, item) => value.includes(item),
    allowed: ["array"]
  },
  filter: {
    call: (value, predicate) => filter(value, predicate),
    allowed: ["array"]
  },
  in: {
    call: (value, array) => {
      if (isArray(array)) {
        return array.includes(value);
      } else {
        throw new Error("In parameter must be an array");
      }
    }
  },
  equals: {
    call: (value, params) => value === params.value
  }
};

export default operators;
