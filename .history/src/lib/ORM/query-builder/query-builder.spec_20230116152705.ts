import { Test } from "../../../output/entities/Test";
import { lexer } from "../../lexer/lexer";
import { parser } from "../../parser/parser";
import { QueryBuilderClass } from "./query-builder.class";
describe('QueryBuilderClass', () => {
  describe('simpleStatement', () => {
    let ql: QueryBuilderClass<Test>
    let simpleStatement: string
    let lexingResult
    let queryResult

    beforeEach(() => {
      ql = new QueryBuilderClass<Test>({ createQueryBuilder: jasmine.createSpy() } as any, Test)
      simpleStatement = "(Test prop_one = '1') And (Test prop_two = '1')";
      lexingResult = lexer.tokenize(simpleStatement);
      parser.input = lexingResult.tokens;
      queryResult = ql.visit(parser.query$());
    })

    it('buildQuery should return "select * from Test where prop_one=1"', function () {
      const sqlSelectStatement = ql.buildQuery(queryResult).sqlSelectStatement;
      expect(sqlSelectStatement).toEqual("select * from Test where prop_one=1")
    })
  })
});
