import { Entity } from "typeorm";
import { createDataSource } from "../db-connector/db-connector"
import { lexer } from "../../lexer/lexer";
import { parser } from "../../parser/parser";
import { Column } from "typeorm";
import { QueryBuilderClass } from "./query-builder.class";
describe("Visitor", () => {
  let config: any;
  let DS: any;

  beforeEach(async () => {
    config = {
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
  });

  xdescribe('Simple Statement', () => {
    beforeEach(async () => {
      DS = await runExample("(Test prop_one = '1') And (Test prop_two = '1')", config);
    })
    it('', () => {
      console.log(DS);

    })
  })
})





function runExample(statement: string, config: any) {
  return createDataSource(config).then((DS: any) => {
    const ql = new QueryBuilderClass<Test>(DS, Test)
    const lexingResult = lexer.tokenize(statement);
    parser.input = lexingResult.tokens;
    const queryResult = ql.visit(parser.query$());
    if (parser.errors.length > 0) {
      console.error(parser.errors);
      throw new Error("Failed to parse the input");
    }
    return ql.buildQuery(queryResult)
      .then(res => console.log(res))
      .catch(console.error)
  })
}


@Entity("test", { schema: "playground" })
export class Test {
  @Column("varchar", { name: "prop_one", nullable: true, length: 255, primary: true })
  propOne: string | null;

  @Column("int", { name: "prop_two", nullable: true })
  propTwo: number | null;
}
