import jasmine from "jasmine";
import { QlParser, parseInput } from "./parser";
import { lexer } from "./lexer";

// TBD
// <StartStatement><Entity>: <Prop><NumericOperators | LexicalOperators><Value><EndStatement>
// (Asset: createDate > "1/1/1998")  And (Asset: createDate < "1/1/2003")

describe("Parser", () => {
    let parser: QlParser;

    beforeEach(() => {
        parser = new QlParser();
    });

    it("should create QlParser instance", () => {
        expect(parser).toBeDefined();
    });

    describe("simple statement", () => {
        it("should parse successfully", () => {
            const statement = "(Asset prop > 10)";
            expect(parseInput(statement, lexer)).toBeTrue();
        });

        it("should fail parsing numeric prop", () => {
            const statement = "(Asset 1 > 10)";
            try {
                expect(parseInput(statement, lexer)).not.toBeTrue();
            } catch (err: any) {
                expect(err.message).toEqual("Failed to parse the input");
            }
        });
    })

    describe("complex statement", () => {
        it("should parse an \"And\" statement successfully", () => {
            const statement = "(Asset prop > 10) And ( Asset age < 2)";
            expect(parseInput(statement, lexer)).toBeTrue();
        });

        it("should parse lower-case \"and\" statement successfully", () => {
            const statement = "(Asset prop > 10) and ( Asset age < 2)";
            expect(parseInput(statement, lexer)).toBeTrue();
        });
    })
});

// 
