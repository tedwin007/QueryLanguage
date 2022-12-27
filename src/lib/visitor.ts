import { parser } from "./parser";
import { Lexer } from "chevrotain";
import { Equal, GreaterThan, LessThan, lexer } from "./lexer";

const BaseVisitor = parser.getBaseCstVisitorConstructor();

export class Visitor extends BaseVisitor {

  constructor() {
    super();
    this.validateVisitor();
  }

  query$(ctx: any) {
    return ctx.statement.reduce((current: any, next: any, index: number, arr: any[]) => {
      current.push(this.visit(next));
      if (ctx.logicalOperators?.[index]) {
        current.push(this.visit(ctx.logicalOperators[index]));
      }
      return current;
    }, []);
  }

  statement$(ctx: any) {
    const entity = ctx.Identifier[0].image;
    // todo: validate entity existence
    return this.visit(ctx?.subQuery, { image: entity, sign: "Identifier" });
  }

  subQuery$(ctx: any, entity: { sign: string, image: string }) {
    // todo: validate prop existence (in "entity")
    const prop: any = ctx.Identifier[0];
    const sign = this.visit(ctx.sign);
    const value = this.visit(ctx.value);

    if (!this.isValidValueSign(sign.sign, value.sign))
      throw new Error("isValidValueSign");

    return {
      entity,
      prop: this.transportProp(prop),
      sign,
      value
    };
  }

  propValidationSign$(ctx: any) {
    return this.nodeTransformer(ctx);
  }

  logicalOperators$(ctx: any) {
    return this.nodeTransformer(ctx);
  }

  values$(ctx: any) {
    return this.nodeTransformer(ctx);
  }

  private transportProp(prop: any) {
    return {
      image: prop.image,
      sign: prop.tokenType.name
    };
  }

  private nodeTransformer(node: { [key: string]: { image: string }[] }) {
    const sign = Object.keys(node)[0];
    const image = node[sign][0].image;
    return { image, sign };

  }

  /**
   * ## isValidValueSign
   * check if the "input sign" [> | < | = | in | ...] exist
   * and valid |(by the "value type" [NumberLiteral | ])
   * @param sign
   * @param value
   * @private
   */
  private isValidValueSign(sign: string, value: string) {
    const optValidation: any = {
      "NumberLiteral": ["GreaterThan", "LessThan", "Equal"],
      "Identifier": ["In"]
    };
    return optValidation[value]?.includes(sign);
  }
}

export const visitor = new Visitor();

// "input" is a setter which will reset the parser's state.
export function visitInput(text: string, lexer: Lexer) {
  const lexingResult = lexer.tokenize(text);
  parser.input = lexingResult.tokens;
  const queryResult = visitor.visit(parser.query$());

  if (parser.errors.length > 0) {
    console.error(parser.errors);
    throw new Error("Failed to parse the input");
  }

  return queryResult;
}
