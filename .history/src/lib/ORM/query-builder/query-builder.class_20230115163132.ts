import { Visitor } from "../../visitor/visitor";
import { DataSource, ObjectLiteral, SelectQueryBuilder, Entity, EntityTarget } from "typeorm";
import { VisitedStatement } from "../../visitor/visitor.interfaces";
import { createDataSource } from "../db-connector/db-connector"
import { lexer } from "../../lexer/lexer";
import { parser } from "../../parser/parser";

import { Column } from "typeorm";

@Entity("test", { schema: "playground" })
export class Test {
  @Column("varchar", { name: "prop_one", nullable: true, length: 255, primary: true })
  propOne: string | null;

  @Column("int", { name: "prop_two", nullable: true })
  propTwo: number | null;
}




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

  async buildQuery(statements: VisitedStatement[]) {


    console.log(await this.dataSource.manager.getRepository(this.entity).query(
      `select * from ${[statements[0].entity.image]} where ${statements[0].prop.image}${[statements[0].operator.image]}${statements[0].values.image}`
    ))




      // (qb: SelectQueryBuilder<any>) => this.entity,)
      // .where(
        // `${statements[0].entity.image}.${statements[0].prop.image } ${statements[0].operator.image}:values`,
        // { values: statements[0].values.image }
      // ).execute().then(res => console.log(res))

    // statements.map((statement: VisitedStatement, index: number) => {
    //   if (index > 0) {
    //     query.addSelect((query: SelectQueryBuilder<T>) => this.transform(query, statement));
    //   } else {
    //     this.transform(query, statement);
    //   }
    // });

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
  'entities': [Test],
}).then((DS: any) => {
  const ql = new QueryBuilderClass<Test>(DS, Test)
  const simpleStatement = "(Test prop_1 = '1')";

  const lexingResult = lexer.tokenize(simpleStatement);
  parser.input = lexingResult.tokens;
  const queryResult = ql.visit(parser.query$());
  if (parser.errors.length > 0) {
    console.error(parser.errors);
    throw new Error("Failed to parse the input");
  }
  ql.buildQuery(queryResult)
})

