import { Test } from "../../../output/entities/Test";
import { lexer } from "../../lexer/lexer";
import { parser } from "../../parser/parser";
import { QueryBuilderClass } from "./query-builder.class";
describe('QueryBuilderClass', () => {
  let ql: QueryBuilderClass
  let simpleStatement: string
  beforeEach(() => {
    ql = new QueryBuilderClass<Test>({ createQueryBuilder: jasmine.createSpy() } as any, Test)
    simpleStatement = "(Test prop_one = '1') And (Test prop_two = '1')";

  })
  it('buildQuery should return "select * from Test where prop_one=1"', function () {
    const lexingResult = lexer.tokenize(simpleStatement);
    parser.input = lexingResult.tokens;
    const queryResult = ql.visit(parser.query$());
    const sqlSelectStatement = ql.buildQuery(queryResult).sqlSelectStatement;
    expect(sqlSelectStatement).toEqual("select * from Test where prop_one=1")
  })
});
