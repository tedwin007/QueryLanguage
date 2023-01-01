import { LexicalToken, NumberLiteralToken, TokenType } from "./visitor.enum";

// todo:improve type - need to be more strict
export const ValueSignTypeMap = new Map<TokenType, (NumberLiteralToken | LexicalToken)[]>([
  [
    TokenType.NumberLiteral, [
    NumberLiteralToken.GreaterThan,
    NumberLiteralToken.LessThan,
    NumberLiteralToken.Equal]
  ],
  [
    TokenType.Identifier, [
    LexicalToken.In
  ]]
]);
