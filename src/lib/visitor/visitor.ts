import { parser } from "../parser/parser";
import { CstNode } from "chevrotain";
import { ValueSignTypeMap } from "./visitor.consts";
import { IToken } from "@chevrotain/types";
import { LexerToken } from "../lexer/lexer.enum";
import { QLNode, TokenNodeKey, VisitedNode, VisitedStatement } from "./visitor.interfaces";

const BaseVisitor = parser.getBaseCstVisitorConstructor();

export class Visitor extends BaseVisitor {

  constructor() {
    super();
    this.validateVisitor();
  }

  /**
   * Select * from Assets where prop > 10
   * query$
   * return an array in the following struct
   * [ VisitedStatement    , VisitedNode, VisitedStatement] | [VisitedStatement]
   * [ (Asset prop > 10)   ,     and    , (User age > 1)]  | [(Asset prop > 10)]
   * @param ctx
   */
  query$(ctx: QLNode): (QLNode | VisitedNode)[] {
    return ctx.statement.reduce(
      (current: QLNode[], next: CstNode, index: number) => {
        current.push(this.visit(next));
        if (ctx.conjunctionOpt?.[index])
          current.push(this.visit(ctx.conjunctionOpt[index]));
        return current;
      }, []);
  }

  statement$(ctx: QLNode): VisitedStatement {
    const { image } = ctx.Identifier[0];
    return this.visit(ctx.subQuery, { image, sign: LexerToken.Identifier });
  }

  subQuery$(ctx: QLNode, entity: VisitedNode): VisitedStatement {
    const prop = ctx.Identifier[0];
    const visitedSign = this.visit(ctx.operator);
    const visitedValues = this.visit(ctx.values);

    if (!this.isValidValueSign(visitedSign.sign, visitedValues.sign)) {
      throw new Error("isValidValueSign");
    }

    return {
      entity,
      prop: this.visitEntityProp(prop),
      operator: visitedSign,
      values: visitedValues
    };
  }

  /**
   * ## isValidValueSign
   * // todo: improve types
   * check if the "input sign" [> | < | = | in | ...] exist
   * and valid |(by the "value type" [NumberLiteral | ])
   * @param sign
   * @param value
   * @private
   */
  private isValidValueSign = (sign: LexerToken, value: LexerToken): boolean => !!ValueSignTypeMap.get(value)?.includes(sign);
  private visitEntityProp = (prop: IToken): VisitedNode => ({ image: prop.image, sign: prop.tokenType.name });
  private conjunctionOpt$ = (ctx: QLNode): VisitedNode => this.visitQLNode(ctx);
  private operator$ = (ctx: QLNode): VisitedNode => this.visitQLNode(ctx);
  private values$ = (ctx: any): VisitedNode => this.visitQLNode(ctx);

  private visitQLNode = (node: QLNode): VisitedNode => {
    const sign = Object.keys(node)[0] as TokenNodeKey;
    const image = node[sign][0].image;
    return { image, sign };
  };
}

export const visitor = new Visitor();


