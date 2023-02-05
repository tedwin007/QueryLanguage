import { ISyntacticContentAssistPath } from "chevrotain";
export interface BuildQueryResponse {
  execute: () => Promise<any>;
  sqlSelectStatement: string;
  getAutoCompleteOptions: () => ISyntacticContentAssistPath[];
}
export interface SimpleEntityDefinition<T = any> {
  name: string;
  props: {
    [k in keyof T]: "string" | "number" | "object";
  };
}

export type MappedEntitiesDefinition = {
  [k in SimpleEntityDefinition["name"]]: {
    props: SimpleEntityDefinition["props"];
  };
} & object;
