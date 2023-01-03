// @ts-ignore
import * as jasmin from "jasmine";
import { Lexer } from "chevrotain";
import { allTokens } from "./lexer";

describe("Lexer", () => {
    let lexer: Lexer;
    let simpleQuery = "(Asset prop > 10)";

    beforeEach(() => {
        lexer = new Lexer(allTokens);
    });

    it("should create Lexer instance", () => {
        expect(lexer).toBeDefined();
    });

    describe("Given a simpleQuery (" + simpleQuery + ")", () => {
        it("should identify all tokens", () => {
            let actual = lexer.tokenize(simpleQuery).tokens.map(node => node.image);
            expect(actual).toEqual(["(", "Asset", "prop", ">", "10", ")"]);
        });

        // TBD ...
    });
});




