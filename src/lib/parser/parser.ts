import {
    allTokens,
    And,
    EndStatement,
    Equal,
    False,
    GreaterThan,
    Identifier,
    In,
    LessThan,
    Null,
    NumberLiteral,
    Or,
    StartStatement,
    True
} from "../lexer/lexer";
import { CstParser, Lexer } from "chevrotain";
import { IParserConfig } from "@chevrotain/types";
import { ParserRules } from "./parser.enum";

export class QlParser extends CstParser {

    values$ = this.RULE(ParserRules.values, () => {
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
    propValidationSign$ = this.RULE(ParserRules.propValidationSign, () => {
        this.OR([
            { ALT: () => this.CONSUME(GreaterThan) },
            { ALT: () => this.CONSUME(LessThan) },
            { ALT: () => this.CONSUME(Equal) },
            { ALT: () => this.CONSUME(In) }
        ]);
    });
    subQuery$ = this.RULE(ParserRules.subQuery, () => {
        this.CONSUME(Identifier);
        this.SUBRULE1(this.propValidationSign$, { LABEL: "sign" });
        this.SUBRULE2(this.values$, { LABEL: "value" });
    });
    logicalOperators$ = this.RULE(ParserRules.logicalOperators, () => {
        this.OR([
            { ALT: () => this.CONSUME(And) },
            { ALT: () => this.CONSUME(Or) }
        ]);
    });
    statement$ = this.RULE(ParserRules.statement, () => {
        this.CONSUME(StartStatement);
        this.CONSUME(Identifier);
        this.SUBRULE(this.subQuery$, { LABEL: "subQuery" });
        this.CONSUME(EndStatement);
    });
    query$ = this.RULE(ParserRules.query, () => {
        this.SUBRULE(this.statement$, { LABEL: "statement" });
        this.MANY(() => {
            this.OPTION(() => {
                this.SUBRULE1(this.logicalOperators$, { LABEL: "logicalOperators" });
                this.SUBRULE2(this.statement$, { LABEL: "statement" });
            });
        });
    });

    constructor(options?: IParserConfig) {
        super(allTokens, options);
        this.performSelfAnalysis();
    }
}

export const parser = new QlParser()

// "input" is a setter which will reset the parser's state.
export function parseInput(text: string, lexer: Lexer): boolean {
    const lexingResult = lexer.tokenize(text);
    parser.input = lexingResult.tokens;
    parser.query$();

    if (parser.errors.length > 0) {
        console.error(parser.errors);
        throw new Error("Failed to parse the input");
    }

    return true;
}

