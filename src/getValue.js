import { isObject, isString, get, isInteger, isArray } from "lodash";
import defaultOperators from "./operators";
import getValueOperator from "./getValueOperator";

const getValue = (object, path = null, operators = {}) => {
  operators = Object.assign({}, defaultOperators, operators);
  // Validate object
  if (!isObject(object)) {
    throw new Error("First parameter must be an object");
  }

  // If path variable is a String
  if (isString(path)) {
    return get(object, path);

    // If path variable is an Array
  } else if (isArray(path)) {
    // Set current object from parameter
    let currentObject = object;

    // Traverse each item in path
    path.forEach(pathItem => {
      // If current item is string, search it with lodash.get
      if (isString(pathItem)) {
        currentObject = get(currentObject, pathItem);
        // If current path item is an object, validate it...
      } else if (isObject(pathItem)) {
        if (pathItem.op && isString(pathItem.op)) {
          currentObject = getValueOperator(currentObject, pathItem, operators);
        } else {
          throw new Error("Path item object type not recognized");
        }
      } else if (isInteger(pathItem)) {
        if (pathItem >= 0) {
          currentObject = currentObject[pathItem];
        } else {
          currentObject = currentObject[currentObject.length + pathItem];
        }
      } else {
        throw new Error("Path type not valid");
      }
    });
    return currentObject;
  } else {
    throw new Error("Wrong path object type");
  }
};

export default getValue;
