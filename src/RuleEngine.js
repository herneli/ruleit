import { isObject, isArray } from "lodash";
import getValue from "./getValue";
import defaultOperators from "./operators";
import getValueOperator from "./getValueOperator";
const defaultOptions = {};

export default class RuleEngine {
  constructor(options = {}) {
    this.options = Object.assign({}, defaultOptions, options);
    this.operators = Object.assign({}, defaultOperators, options.operators);
  }

  /**
   * Run engine to evaluate conditions
   */
  run(facts) {
    return this.checkCondition(facts, this.options.condition);
  }

  /**
   * Check condition
   */
  checkCondition(facts, condition) {
    return new Promise((resolve, reject) => {
      if (!isObject(condition)) {
        reject(new Error(`Options: "condition" must be an object`));
      }
      // Condition all must be an array
      if (condition.all) {
        if (!isArray(condition.all)) {
          reject(
            new Error(`Options: "condition.any" must be an array of conditions`)
          );
        }

        let conditionPromises = condition.all.map(conditionItem => {
          let promise = this.checkCondition(facts, conditionItem);
          return promise;
        });
        Promise.all(conditionPromises)
          .then(values => {
            if (values.includes(false)) {
              resolve(false);
            } else {
              resolve(true);
            }
          })
          .catch(reason => reject(reason));

        // Condition any must be an array
      } else if (condition.any) {
        if (!isArray(condition.any)) {
          reject(
            new Error(`Options: "condition.any" must be an array of conditions`)
          );
        }
        let conditionPromises = condition.any.map(conditionItem => {
          return this.checkCondition(facts, conditionItem);
        });
        Promise.all(conditionPromises)
          .then(values => {
            if (values.includes(true)) {
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(reason => reject(reason));

        // Condition is a "fact" rule
      } else if (condition.fact) {
        // Condition type not valid
        let factValue = getValue(facts, condition.fact, this.operators);
        if (condition.op) {
          // Resolve params
          let paramsResolved = {};
          if (condition.params) {
            if (!isObject(condition.params)) {
              reject(new Error(`Params must be an object`));
            }
            Object.keys(condition.params).forEach(paramKey => {
              if (
                isObject(condition.params[paramKey]) &&
                condition.params[paramKey].fact
              ) {
                paramsResolved[paramKey] = getValue(
                  facts,
                  condition.params[paramKey].fact,
                  this.operators
                );
              } else {
                paramsResolved[paramKey] = condition.params[paramKey];
              }
            });
          }
          let value = getValueOperator(
            factValue,
            {
              op: condition.op,
              params: paramsResolved
            },
            this.operators
          );
          if (value) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          reject(new Error("Condition type not valid"));
        }
      } else {
        reject(new Error("Condition type not valid"));
      }
    });
  }
}
