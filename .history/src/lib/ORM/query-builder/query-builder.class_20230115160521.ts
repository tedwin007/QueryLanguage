import { Visitor } from "../../visitor/visitor";
import { DataSource, ObjectLiteral, SelectQueryBuilder, Entity, EntityTarget } from "typeorm";
import { VisitedStatement } from "../../visitor/visitor.interfaces";
import { Test } from "../../../../output/entities/Test"
import { createDataSource } from "../db-connector/db-connector"
import { lexer } from "../../lexer/lexer";
import { parser } from "../../parser/parser";

// Concept Only! - checking if this could be a valid solution
export class QueryBuilderClass<T extends ObjectLiteral> extends Visitor {
  private queryBuilder: SelectQueryBuilder<T>;

  constructor(private dataSource: DataSource, private entity: EntityTarget<any>) {
    super();
    if (!dataSource) {
      throw "You need create a valid DataSource instance";
    }
    this.validateVisitor();
    this.queryBuilder = this.dataSource.createQueryBuilder();
  }

  async buildQuery(statements: VisitedStatement[]): Promise<{ execute: () => Promise<any> }> {
    this.dataSource.createQueryBuilder().select().from((qb: SelectQueryBuilder<any>) => this.entity, statements[0].entity.image)
      .where(
        `${statements[0].entity.image}.${statements[0].prop.image} ${statements[0].operator.image}:values`,
        { values: statements[0].values.image }
      ).execute()

    // statements.map((statement: VisitedStatement, index: number) => {
    //   if (index > 0) {
    //     query.addSelect((query: SelectQueryBuilder<T>) => this.transform(query, statement));
    //   } else {
    //     this.transform(query, statement);
    //   }
    // });

    return {
      execute: (): Promise<any> => this.queryBuilder.execute()
    };
  }

  private transform(query: SelectQueryBuilder<T>, statement: VisitedStatement): SelectQueryBuilder<ObjectLiteral> {
    return query.from((qb: SelectQueryBuilder<any>) => this.entity, statement.entity.image)
      .where(
        `${statement.entity.image}.${statement.prop.image} ${statement.operator.image}:values`,
        { values: statement.values.image }
      );
  }
}

createDataSource({
  "name": "default",
  "type": "mysql",
  "host": "",
  "port": 3306,
  "username": "root",
  "password": "!QAZ2wsx",
  "database": "playground",
  "synchronize": false,
  "entities": ["entities/*.js"]
}).then((DS: any) => {
  const ql = new QueryBuilderClass<Test>(DS, Test)
  const simpleStatement = "(Asset prop > 10)";

  const lexingResult = lexer.tokenize(simpleStatement);
  parser.input = lexingResult.tokens;
  const queryResult = ql.visit(parser.query$());
  if (parser.errors.length > 0) {
    console.error(parser.errors);
    throw new Error("Failed to parse the input");
  }
  ql.buildQuery(queryResult)
})

