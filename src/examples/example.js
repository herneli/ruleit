/* eslint-disable no-console */
import { getValue } from "..";

let user = {
  name: "Jordi",
  addresses: [{ city: "Terrassa" }, { city: "Barcelona" }]
};

let path = ["addresses", -1];

let result = getValue(user, path);

console.log(result);
