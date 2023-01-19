import { ILexingResult } from "chevrotain";
import { lexer } from "../../lexer/lexer";
import { parser } from "../../parser/parser";
import { Test } from "../entities/Test";
import { QueryBuilderClass } from "./query-builder.class";
import { VisitedStatement } from './../../visitor/visitor.interfaces'

describe('QueryBuilderClass', () => {
  let ql: QueryBuilderClass;
  let complexStatement: string;
  let simpleStatement: string;
  let lexingResult: ILexingResult;
  let queryResult: VisitedStatement[];

  describe('Simple Statement', () => {
    simpleStatement = "(Test prop_one = 1)";
    beforeEach(() => {
      ({ ql, queryResult } = init(ql, simpleStatement, lexingResult, queryResult));
    })

    it('QueryBuilder instance should exists', () => {
      expect(ql).toBeDefined();
    })

    it('BuildQuery should return a valid (simple) query', () => {
      const sqlSelectStatement = ql.buildQuery(queryResult).sqlSelectStatement;
      const expected = "SELECT * FROM Test WHERE Test.prop_one=1";
      expect(sqlSelectStatement).toEqual(expected)
    })
  })

  describe('Complex Statement', () => {
    beforeEach(() => {
      complexStatement = "(Test prop_one = '1') And (Test prop_two = '1')";
      ({ ql, queryResult } = init(ql, complexStatement, lexingResult, queryResult));
    })

    it('buildQuery should return a valid query', () => {
      const sqlSelectStatement = ql.buildQuery(queryResult).sqlSelectStatement;
      const expected = 'SELECT * FROM Test WHERE Test.prop_one=1 And Test.prop_two=1';
      expect(sqlSelectStatement).toEqual(expected);
    })
  })

  describe('Complex statement with two different entities', () => {
    beforeEach(() => {
      complexStatement = "(Test prop_one = '1') And (User prop_two = '1')";
      ({ ql, queryResult } = init(ql, complexStatement, lexingResult, queryResult));
    })

    it('BuildQuery method should return a valid query', () => {
      const sqlSelectStatement = ql.buildQuery(queryResult).sqlSelectStatement;
      const expected = 'SELECT * FROM Test WHERE Test.prop_one=1 And User.prop_two=1';
      expect(sqlSelectStatement).toEqual(expected);
    })
  })
});

function init(ql: QueryBuilderClass, statement: string, lexingResult: ILexingResult, queryResult: VisitedStatement[]) {
  ql = new QueryBuilderClass({ createQueryBuilder: jasmine.createSpy() } as any, Test);
  lexingResult = lexer.tokenize(statement);
  parser.input = lexingResult.tokens;
  queryResult = ql.visit(parser.query$());
  return { ql, lexingResult, queryResult };
}

