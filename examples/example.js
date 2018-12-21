/* eslint-disable no-console */
const defaultRuleItFunction = require("../lib").default;
const { ruleItFunction } = require("../lib");

const defaultVal = defaultRuleItFunction();
const val = ruleItFunction();

// defaultVal
console.log(defaultVal);
// val
console.log(val);
