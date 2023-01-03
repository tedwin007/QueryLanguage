import { lexer } from "../lexer/lexer";
import { visitor, Visitor } from "./visitor";
import { LexerToken } from "../lexer/lexer.enum";
import { Lexer } from "chevrotain";
import { parser } from "../parser/parser";
import { VisitedStatement } from "./visitor.interfaces";

describe("Visitor", () => {
  let visitor: Visitor;

  beforeEach(() => {
    visitor = new Visitor();
  });

  it("should create Visitor instance", () => {
    expect(visitor).toBeDefined();
  });

  describe("Given a Query", () => {
    const simpleStatement = "(Asset prop > 10)";
    const complexStatement = "(Asset prop > 10) and (User age > 1)";

    it("should transform " + simpleStatement + " successfully", () => {
      expect(visitInput(simpleStatement, lexer)).toEqual(expectedSimpleStatement);
    });

    it("should transform " + complexStatement + " successfully", () => {
      expect(visitInput(complexStatement, lexer)).toEqual(expectedComplexStatement);
    });
  });
});

//  ==== utils =====
export function visitInput(text: string, lexer: Lexer) {
  const lexingResult = lexer.tokenize(text);
  parser.input = lexingResult.tokens;
  const queryResult = visitor.visit(parser.query$());
  if (parser.errors.length > 0) {
    console.error(parser.errors);
    throw new Error("Failed to parse the input");
  }

  return queryResult;
}

//  ==== Mocks &  Const =====
const expectedSimpleStatement: VisitedStatement[] = [{
  entity: { image: "Asset", sign: LexerToken.Identifier },
  prop: { image: "prop", sign: LexerToken.Identifier },
  propValidationSign: { image: ">", sign: LexerToken.GreaterThan },
  values: { image: "10", sign: LexerToken.NumberLiteral }
}];

const expectedComplexStatement = [{
  entity: { image: "Asset", sign: "Identifier" },
  prop: { image: "prop", sign: "Identifier" },
  propValidationSign: { image: ">", sign: "GreaterThan" },
  values: { image: "10", sign: "NumberLiteral" }
},
  { image: "and", sign: "And" },
  {
    entity: { image: "User", sign: "Identifier" },
    prop: { image: "age", sign: "Identifier" },
    propValidationSign: { image: ">", sign: "GreaterThan" },
    values: { image: "1", sign: "NumberLiteral" }
  }
];