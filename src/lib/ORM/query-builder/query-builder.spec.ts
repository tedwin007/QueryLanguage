import { lexer } from "../../lexer/lexer";
import { parser } from "../../parser/parser";
import { Test } from "../entities/Test";
import { QueryBuilderClass } from "./query-builder.class";
describe('QueryBuilderClass', () => {
  let ql: QueryBuilderClass;
  let complexStatement: string;
  let simpleStatement: string;
  let lexingResult;
  let queryResult;

  describe('Simple Statement', () => {
    beforeEach(() => {
      ql = new QueryBuilderClass({ createQueryBuilder: jasmine.createSpy() } as any, Test)
      simpleStatement = "(Test prop_one = '1')";
      lexingResult = lexer.tokenize(simpleStatement);
      parser.input = lexingResult.tokens;
      queryResult = ql.visit(parser.query$());
    })

    it('buildQuery should return a valid (simple) query', function () {
      const sqlSelectStatement = ql.buildQuery(queryResult).sqlSelectStatement;
      expect(sqlSelectStatement).toEqual("SELECT * FROM Test WHERE Test.prop_one=1")
    })
  })

  describe('Complex Statement', () => {
    beforeEach(() => {
      ql = new QueryBuilderClass({ createQueryBuilder: jasmine.createSpy() } as any, Test)
      complexStatement = "(Test prop_one = '1') And (Test prop_two = '1')";
      lexingResult = lexer.tokenize(complexStatement);
      parser.input = lexingResult.tokens;
      queryResult = ql.visit(parser.query$());
    })

    it('buildQuery should return a valid query', function () {
      const sqlSelectStatement = ql.buildQuery(queryResult).sqlSelectStatement;
      expect(sqlSelectStatement).toEqual('SELECT * FROM Test WHERE Test.prop_one=1 And Test.prop_two=1')
    })
  })
});
