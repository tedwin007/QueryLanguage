import { DataSource } from "typeorm";
import { Test } from "../../../output/entities/Test";
import { lexer } from "../../lexer/lexer";
import { parser } from "../../parser/parser";
import { createDataSource, DSOptions } from "../db-connector/db-connector";
import { QueryBuilderClass } from "./query-builder.class";
fdescribe('QueryBuilderClass', () => {

  DataSource.prototype.initialize = jasmine.createSpy();

  it('buildQuery should return "select * from Test where prop_one=1"', function () {
    const ql = new QueryBuilderClass<Test>({ createQueryBuilder: jasmine.createSpy() } as any, Test)
    const simpleStatement = "(Test prop_one = '1') And (Test prop_two = '1')";
    const lexingResult = lexer.tokenize(simpleStatement);
    parser.input = lexingResult.tokens;
    const queryResult = ql.visit(parser.query$());
    const sqlSelectStatement = ql.buildQuery(queryResult).sqlSelectStatement;
    console.log(sqlSelectStatement);
    expect(sqlSelectStatement).toEqual("select * from Test where prop_one=1")
  })

});
