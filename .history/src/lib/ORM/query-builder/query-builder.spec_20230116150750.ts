import { DataSource } from "typeorm";
import { Test } from "../../../output/entities/Test";
import { lexer } from "../../lexer/lexer";
import { parser } from "../../parser/parser";
import { createDataSource } from "../db-connector/db-connector";
import { QueryBuilderClass } from "./query-builder.class";

describe('QueryBuilderClass', () => {
  it('buildQuery should return "select * from Test where prop_one=1"', (done) => {
    DataSource.prototype.initialize = jasmine.createSpy().and.returnValue(Promise.resolve({ createQueryBuilder: () => jasmine.createSpy() }));
    createDataSource({} as any).then((DS: any) => {
      const ql = new QueryBuilderClass<Test>(DS, Test)
      const simpleStatement = "(Test prop_one = '1') And (Test prop_two = '1')";
      const lexingResult = lexer.tokenize(simpleStatement);
      parser.input = lexingResult.tokens;
      const queryResult = ql.visit(parser.query$());
      expect(ql.buildQuery(queryResult).sqlSelectStatement).toEqual("select * from Test where prop_one=1")
      done()
    })
  })

});