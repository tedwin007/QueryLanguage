import { DataSource, Entity } from "typeorm";
import { createDataSource, DSOptions } from "../db-connector/db-connector"
import { lexer } from "../../lexer/lexer";
import { parser } from "../../parser/parser";
import { Column } from "typeorm";
import { QueryBuilderClass } from "./query-builder.class";

@Entity("test", { schema: "playground" })
export class Test {
  @Column("varchar", { name: "prop_one", nullable: true, length: 255, primary: true })
  propOne: string | null;

  @Column("int", { name: "prop_two", nullable: true })
  propTwo: number | null;
}
describe("sdf", () => {


  const config: DSOptions = {
    "name": "default",
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "!QAZ2wsx",
    "database": "playground",
    "synchronize": false,
    'entities': [Test],
  };
  describe('Simple Statement', () => {
    fit('Blas', (done) => {
      const ds = createDataSource(config).then((ds) => {
        setTimeout(() => {
          const ql = new QueryBuilderClass<Test>(DS, Test)
          const lexingResult = lexer.tokenize("(Test prop_one = '1') And (Test prop_two = '1')");
          parser.input = lexingResult.tokens;
          const queryResult = ql.visit(parser.query$());
          if (parser.errors.length > 0) {
            console.error(parser.errors);
            throw new Error("Failed to parse the input");
          }
          console.log(ql.buildQuery(queryResult));

          expect(true).toBeTruthy()
          done()
        }, 1000)
      })
    })
  })

})

