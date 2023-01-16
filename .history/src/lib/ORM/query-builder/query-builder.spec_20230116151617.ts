import { DataSource } from "typeorm";
import { Test } from "../../../output/entities/Test";
import { lexer } from "../../lexer/lexer";
import { parser } from "../../parser/parser";
import { createDataSource, DSOptions } from "../db-connector/db-connector";
import { QueryBuilderClass } from "./query-builder.class";
describe('QueryBuilderClass', () => {

  let DS: Promise<DataSource | unknown>;
  DataSource.prototype.initialize = jasmine.createSpy();

  beforeEach(() => {
    jasmine.createSpy("createDataSource", createDataSource).and.returnValue({
      initialize: () => Promise.resolve()
    } as any);
    DS = createDataSource(DSConnectionMock);
  }); SelectQueryBuilder
  it('buildQuery should return "select * from Test where prop_one=1"', (done) => {
    const ql = new QueryBuilderClass<Test>({} as any, Test)
    const simpleStatement = "(Test prop_one = '1') And (Test prop_two = '1')";
    const lexingResult = lexer.tokenize(simpleStatement);
    parser.input = lexingResult.tokens;
    const queryResult = ql.visit(parser.query$());
    expect(ql.buildQuery(queryResult).sqlSelectStatement).toEqual("select * from Test where prop_one=1")
    done()

  })

});
const DSConnectionMock: DSOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test"
};
