import "reflect-metadata";
const dotenv = require('dotenv')
export { lexer } from "./lib/lexer/lexer";
export { parser } from "./lib/parser/parser";
export { QueryBuilderClass } from "./lib/ORM/query-builder/query-builder.class";
dotenv.config()
