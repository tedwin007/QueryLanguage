import { LexerToken } from "../lexer/lexer.enum";

export const ValueSignTypeMap = new Map<LexerToken, LexerToken[]>([
  [
    LexerToken.NumberLiteral, [
    LexerToken.GreaterThan,
    LexerToken.LessThan,
    LexerToken.Equal
  ]
  ],
  [
    LexerToken.Identifier, [
    LexerToken.In,
    LexerToken.Equal
  ]]
]);
