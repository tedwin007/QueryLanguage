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
import { CstParser } from "chevrotain";
import { IParserConfig } from "@chevrotain/types";
import { ParserRules } from "./parser.enum";

export class QlParser extends CstParser {

    values$ = this.RULE(ParserRules.values, () => {
        this.OR([
            { ALT: () => this.CONSUME(NumberLiteral) },
            { ALT: () => this.CONSUME(Identifier) },
            { ALT: () => this.CONSUME(True) },
            { ALT: () => this.CONSUME(False) },
            { ALT: () => this.CONSUME(Null) }
        ]);
    });

    operator$ = this.RULE(ParserRules.operator, () => {
        this.OR([
            { ALT: () => this.CONSUME(GreaterThan) },
            { ALT: () => this.CONSUME(LessThan) },
            { ALT: () => this.CONSUME(Equal) },
            { ALT: () => this.CONSUME(In) }
        ]);
    });

    subQuery$ = this.RULE(ParserRules.subQuery, () => {
        this.CONSUME(Identifier);
        this.SUBRULE1(this.operator$, { LABEL: "operator" });
        this.SUBRULE2(this.values$, { LABEL: "values" });
    });

    conjunctionOpt$ = this.RULE(ParserRules.conjunctionOpt, () => {
        this.OR([
            { ALT: () => this.CONSUME(And) },
            { ALT: () => this.CONSUME(Or) },
            { ALT: () => this.CONSUME(In) }
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
                this.SUBRULE1(this.conjunctionOpt$, { LABEL: "conjunctionOpt" });
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


