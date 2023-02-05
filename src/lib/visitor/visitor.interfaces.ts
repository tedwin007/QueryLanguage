import { ParserRules } from "../parser/parser.enum";
import { CstNode } from "chevrotain";
import { LexerToken } from "../lexer/lexer.enum";
import { IToken } from "@chevrotain/types";

export type RuleNodeKey = keyof typeof ParserRules;
export type RuleNode = { [k in RuleNodeKey]: CstNode[] };
export type TokenNodeKey = keyof typeof LexerToken;
export type TokenNode = { [k in keyof typeof LexerToken]: IToken[] };
export type QLNode = RuleNode & TokenNode;

export interface VisitedNode {
  sign: LexerToken;
  image: string;
}

export interface VisitedStatement {
  prop: VisitedNode;
  operator: VisitedNode;
  values: VisitedNode;
  entity: VisitedNode;
  conjunctionOpt?: VisitedNode;
}
