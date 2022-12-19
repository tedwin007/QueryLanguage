import {
    allTokens,
    Identifier,
    And,
    EndStatement,
    Equal,
    GreaterThan,
    LessThan,
    NumberLiteral,
    Or,
    StartStatement,
    In
} from "./lexer";
import { CstParser, Lexer } from "chevrotain";
export class QlParser extends CstParser {

    constructor(options?: any) {
        super(allTokens, options);
        this.performSelfAnalysis();
    }

    statement$ = this.RULE("statement$", () => {
        this.CONSUME(StartStatement);
        this.CONSUME(Identifier);
        this.SUBRULE(this.subQuery$);
        this.CONSUME(EndStatement);
    });

    subQuery$ = this.RULE("subQuery$", () => {
        this.CONSUME(Identifier);
        this.SUBRULE1(this.propValidationSign$);
        this.CONSUME(NumberLiteral);
    });
    query$ = this.RULE("query$", () => {
        this.SUBRULE(this.statement$);
        this.OPTION(() => {
            this.SUBRULE1(this.logicalOperators$);
            this.SUBRULE2(this.statement$);
        });
    });

    propValidationSign$ = this.RULE("propValidationSign$", () => {
        this.OR([
            { ALT: () => this.CONSUME(GreaterThan) },
            { ALT: () => this.CONSUME(LessThan) },
            { ALT: () => this.CONSUME(Equal) },
            { ALT: () => this.CONSUME(In) }

        ]);
    });

    logicalOperators$ = this.RULE("logicalOperators$", () => {
        this.OR([
            { ALT: () => this.CONSUME(And) },
            { ALT: () => this.CONSUME(Or) },
        ]);
    });

}

export const parser = new QlParser()

// "input" is a setter which will reset the parser's state.
export function parseInput(text: string, lexer: Lexer) {
    const lexingResult = lexer.tokenize(text);
    parser.input = lexingResult.tokens;
    parser.query$();

    if (parser.errors.length > 0) {
        console.error(parser.errors);
        throw new Error("Failed to parse the input");
    }

    return true;
}

