import { Test } from "../../../output/entities/Test";
import { lexer } from "../../lexer/lexer";
import { parser } from "../../parser/parser";
import { createDataSource } from "../db-connector/db-connector";
import { QueryBuilderClass } from "./query-builder.class";

const config: any = {
  "name": "default",
  "type": "mysql",
  "host": "",
  "port": 3306,
  "username": "root",
  "password": "!QAZ2wsx",
  "database": "playground",
  "synchronize": false,
  'entities': [Test],
}

createDataSource(config).then((DS: any) => {

})

describe('Description', () => {
  it('', () => {
    const ql = new QueryBuilderClass<Test>(DS, Test)
    const simpleStatement = "(Test prop_one = '1') And (Test prop_two = '1')";
    const lexingResult = lexer.tokenize(simpleStatement);
    parser.input = lexingResult.tokens;
    const queryResult = ql.visit(parser.query$());
    if (parser.errors.length > 0) {
      console.error(parser.errors);
      throw new Error("Failed to parse the input");
    }
    ql.buildQuery(queryResult)
      .then(res => console.log(res))
      .catch(console.error)
  })
});