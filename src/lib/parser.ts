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
    In, True, False, Null
} from "./lexer";
import { CstParser, Lexer } from "chevrotain";

export class QlParser extends CstParser {

    constructor(options?: any) {
        super(allTokens, options);
        this.performSelfAnalysis();
    }

    query$ = this.RULE("query$", () => {
        this.SUBRULE(this.statement$, { LABEL: "statement" });
        this.MANY(() => {
            this.OPTION(() => {
                this.SUBRULE1(this.logicalOperators$, { LABEL: "logicalOperators" });
                this.SUBRULE2(this.statement$, { LABEL: "statement" });
            });
        });
    });
    values$ = this.RULE("values$", () => {
        this.OR([
            { ALT: () => this.CONSUME(NumberLiteral) },
            { ALT: () => this.CONSUME(Identifier) },
            { ALT: () => this.CONSUME(True) },
            { ALT: () => this.CONSUME(False) },
            { ALT: () => this.CONSUME(Null) },
            { ALT: () => this.CONSUME(And) },
            { ALT: () => this.CONSUME(Or) },
            { ALT: () => this.CONSUME(In) }
        ]);
    });
    subQuery$ = this.RULE("subQuery$", () => {
        this.CONSUME(Identifier);
        this.SUBRULE1(this.propValidationSign$, { LABEL: "sign" });
        this.SUBRULE2(this.values$, { LABEL: "value" });
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
            { ALT: () => this.CONSUME(Or) }
        ]);
    });
    statement$ = this.RULE("statement$", () => {
        this.CONSUME(StartStatement);
        this.CONSUME(Identifier);
        this.SUBRULE(this.subQuery$, { LABEL: "subQuery" });
        this.CONSUME(EndStatement);
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

