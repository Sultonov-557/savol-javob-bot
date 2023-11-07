import * as fs from "fs";
import { join } from "path";

export const quentions = JSON.parse(
  fs.readFileSync(join(__dirname, "../../savollar.json")).toLocaleString()
);
