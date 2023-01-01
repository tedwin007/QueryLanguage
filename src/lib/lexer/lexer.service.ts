import { Lexer, TokenType } from "chevrotain";
import { allTokens } from "./lexer";

// todo : this is a placeholder need to add error handling logic and much more
type FilterManger = string

export class LexerService {
  readonly lexerInstance: Lexer;
  allTokens: TokenType[] = [];

  constructor(FM: FilterManger) {
    this.allTokens = this.toLexerTokens(FM);
    this.lexerInstance = new Lexer(allTokens);
  }

  tokenize(text: string) {
    return this.lexerInstance.tokenize(text);
  }

  private toLexerTokens(fm: FilterManger): TokenType[] {
    return [] as any;
    //return  createToken{
    //   name: LexerToken.Identifier,
    //     pattern: /[a-zA-Z]\w*/
    // }
  }

}