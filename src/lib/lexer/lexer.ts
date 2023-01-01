import { createToken, Lexer } from "chevrotain";
import { LexerToken } from "./lexer.enum";

export const Identifier = createToken({
    name: LexerToken.Identifier,
    pattern: /[a-zA-Z]\w*/
});
export const StartStatement = createToken({
    name: LexerToken.StartStatement,
    pattern: /\(/
});
export const EndStatement = createToken({
    name: LexerToken.EndStatement,
    pattern: /\)/
});
export const GreaterThan = createToken({
    name: LexerToken.GreaterThan,
    pattern: /\>/
});
export const LessThan = createToken({
    name: LexerToken.LessThan,
    pattern: /\</
});
export const Equal = createToken({
    name: LexerToken.Equal,
    pattern: /=/
});
export const And = createToken({
    name: LexerToken.And,
    pattern: /And/i
});
export const Or = createToken({
    name: LexerToken.Or,
    pattern: /Or/i
});
export const In = createToken({
    name: LexerToken.In,
    pattern: /In/i
});
export const True = createToken({
    name: LexerToken.True,
    pattern: /true/i
});
export const False = createToken({
    name: LexerToken.False,
    pattern: /false/i
});
export const Null = createToken({
    name: LexerToken.Null,
    pattern: /Null/i
});
export const WhiteSpace = createToken({
    name: LexerToken.WhiteSpace,
    pattern: /\s+/,
    group: Lexer.SKIPPED
});
export const NumberLiteral = createToken({
    name: LexerToken.NumberLiteral,
    pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
});

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

// todo : remove once the service is ready
export const lexer = new Lexer(allTokens);
