import { ILexingResult } from "chevrotain";
import { lexer } from "../../lexer/lexer";
import { parser } from "../../parser/parser";
import { Test } from "../entities/Test";
import { QueryBuilderClass } from "./query-builder.class";
import { VisitedStatement } from './../../visitor/visitor.interfaces'
import { ParserRules } from "../../parser/parser.enum";

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

    describe('Or', () => {
      beforeEach(() => {
        complexStatement = "(Test prop_one = '1') OR (Test prop_two = '1')";
        ({ ql, queryResult } = init(ql, complexStatement, lexingResult, queryResult));
      })

      it('buildQuery should return a valid query', () => {
        const sqlSelectStatement = ql.buildQuery(queryResult).sqlSelectStatement;
        const expected = 'SELECT * FROM Test WHERE Test.prop_one=1 OR Test.prop_two=1';
        expect(sqlSelectStatement).toEqual(expected);
      })
    })

    describe('And', () => {
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

      describe('With two different entities', () => {
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
    })
    })
  });

  describe('getAutoCompleteOptions', () => {
    beforeEach(() => {
      ({ ql, queryResult } = init(ql, simpleStatement, lexingResult, queryResult));
    })

    it('Should return ' + ParserRules.values + ' options', () => {
      const actual = ql.getAutoCompleteOptions("(Test prop_one = ");
      const expected = ['NumberLiteral', '<EntitiesNameList>', 'True', 'False', 'Null'];
      expect(actual).toEqual(expected)
    })

    it('Should return ' + ParserRules.operator + ' options', () => {
      const actual = ql.getAutoCompleteOptions("(Test prop_one ");
      const expected = ['GreaterThan', 'LessThan', 'Equal', 'In'];
      expect(actual).toEqual(expected)
    })

    it('Should return "< EntitiesNameList >" token ', () => {
      const actual = ql.getAutoCompleteOptions("(");
      expect(actual).toEqual(['<EntitiesNameList>'])
    })

    it('Should return starting statement token "("', () => {
      const actual = ql.getAutoCompleteOptions(" ");
      expect(actual).toEqual(['('])
    })

    it('Should return closing statement token ")"', () => {
      const actual = ql.getAutoCompleteOptions("(Test prop_one = 2 ");
      expect(actual).toEqual([')'])
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

