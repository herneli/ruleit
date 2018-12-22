import { isObject, get } from "lodash";
import getType from "./getType";

const validateParams = (fn, params) => {
  if (!fn.params) {
    return;
  }

  Object.keys(fn.params).forEach(paramKey => {
    let paramValue = get(params, paramKey, null);
    let paramValueType = getType(paramValue);
    let fnParam = fn.params[paramKey];
    if (fnParam.required && !paramValue) {
      throw new Error(`Parameter ${paramKey} is required`);
    }
    let allowed = fnParam.allowed || [];
    if (allowed.length > 0 && !allowed.includes(paramValueType)) {
      throw new Error(
        `Parameter "${paramKey}" of type "${paramValueType}" not expected. Allowed (${allowed.join(
          ","
        )})`
      );
    }
  });
};
const getValueOperator = (object, path, operators) => {
  let fn = operators[path.op];
  if (fn) {
    let allowed = fn.allowed || [];
    if (allowed.length > 0) {
      let currentObjectType = getType(object);
      if (!allowed.includes(currentObjectType)) {
        throw new Error(
          `Operator "${
            path.op
          }" not allowed with object type "${currentObjectType}"`
        );
      }
    }
    // If pathItem function is passed with options, pass them thorug the function call
    validateParams(fn, path.params);
    if (path.params) {
      return fn.call(object, path.params);
      // Simply call the function
    } else {
      return fn.call(object);
    }
  } else {
    throw new Error(`Function "${path.op}" passed in path is not allowed`);
  }
};

export default getValueOperator;
