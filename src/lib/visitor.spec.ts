import { lexer } from "./lexer";
import { visitInput, Visitor } from "./visitor";

describe("Visitor", () => {
  let visitor: Visitor;

  beforeEach(() => {
    visitor = new Visitor();
  });

  it("should create Visitor instance", () => {
    expect(visitor).toBeDefined();
  });

  describe("Given a Query", () => {
    const simpleStatement = "should transform (Asset prop > 10) successfully";

    it("should transform " + simpleStatement + " successfully", () => {
      const statement = "(Asset prop > 10)";
      const expected: any[] = [{
        entity: { image: "Asset", sign: "Identifier" },
        prop: { image: "prop", sign: "Identifier" },
        sign: { image: ">", sign: "GreaterThan" },
        value: { image: "10", sign: "NumberLiteral" }
      }];
      expect(visitInput(statement, lexer)).toEqual(expected);
    });
  });
});
