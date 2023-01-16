import { cwd } from "process";
import "reflect-metadata";
export { lexer } from "./lib/lexer/lexer";
export { parser } from "./lib/parser/parser";
export { QueryBuilderClass } from "./lib/ORM/query-builder/query-builder.class";

const fs = require('fs');
console.log(cwd);

// let rawdata = fs.readFileSync();
// let student = JSON.parse(rawdata);
// console.log(student);