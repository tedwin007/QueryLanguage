import { Lexer, createToken } from "chevrotain";

export const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });
export const StartStatement = createToken({ name: "StartStatement", pattern: /\(/ });
export const EndStatement = createToken({ name: "EndStatement", pattern: /\)/ });
export const GreaterThan = createToken({ name: "GreaterThan", pattern: /\>/ });
export const LessThan = createToken({ name: "LessThan", pattern: /\</ });
export const Equal = createToken({ name: "Equal", pattern: /=/ });
export const And = createToken({ name: "And", pattern: /And/i });
export const Or = createToken({ name: "Or", pattern: /Or/i });
export const In = createToken({ name: "In", pattern: /In/i });
export const True = createToken({ name: "True", pattern: /true/i });
export const False = createToken({ name: "False", pattern: /false/i });
export const Null = createToken({ name: "Null", pattern: /Null/i });
export const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED
});
export const NumberLiteral = createToken({ name: "NumberLiteral", pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/ });

export const allTokens = [
    True,
    False,
    Null,
    And,
    Or,
    In,
    Identifier,
    StartStatement,
    EndStatement,
    WhiteSpace,
    NumberLiteral,
    GreaterThan,
    LessThan,
    Equal
]

export const lexer = new Lexer(allTokens);
