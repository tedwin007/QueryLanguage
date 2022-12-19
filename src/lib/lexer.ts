
// <StartStatement><Entity>: <Prop><NumericOperators | LexicalOperators><Value><EndStatement>

import { Lexer, createToken } from "chevrotain";

// (Asset: createDate > "1/1/1998")  And (Asset: createDate < "1/1/2003")
export const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ })
export const StartStatement = createToken({ name: 'StartStatement', pattern: /\(/ });
export const EndStatement = createToken({ name: 'EndStatement', pattern: /\)/ });
export const Comma = createToken({ name: "Comma", pattern: /\,/ });
// const Colon = createToken({ name: "Colon", pattern: /:/ });
export const GreaterThan = createToken({ name: "GreaterThan", pattern: /\>/ });
export const LessThan = createToken({ name: "LessThan", pattern: /\</ });
export const Equal = createToken({ name: "Equal", pattern: /=/ });
export const And = createToken({ name: "And", pattern: /And/ });
export const Or = createToken({ name: "Or", pattern: /Or/ });
export const In = createToken({ name: "In", pattern: /in/ })
export const True = createToken({ name: "True", pattern: /true/ });
export const False = createToken({ name: "False", pattern: /false/ });
export const Null = createToken({ name: "Null", pattern: /null/ });
export const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED
})
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
