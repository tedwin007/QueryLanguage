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
    console.log(statements);

    let i = 0;
    const newLocal = `select * from ${statements[i].entity.image} where ${statements[i].prop.image}${[statements[i].operator.image]}${statements[i].values.image} ${statements.length > 1 ? statements[i + 1].conjunctionOpt.image : ''}`;
    const newLocal_1 = newLocal + ` ${statements[i + 2].prop.image}${[statements[i + 2].operator.image]}${statements[i + 2].values.image}`;
    console.log(newLocal_1);

    return await this.dataSource.manager.getRepository(this.entity).query(
      newLocal_1
    )


    // (qb: SelectQueryBuilder<any>) => this.entity,)
    // .where(
    // `${statements[i].entity.image}.${statements[i].prop.image } ${statements[i].operator.image}:values`,
    // { values: statements[i].values.image }
    // ).execute().then(res => console.log(res))

    // statements.map((statement: VisitedStatement, index: number) => {
    //   if (index > 0) {
    //     query.addSelect((query: SelectQueryBuilder<T>) => this.transform(query, statement));
    //   } else {
    //     this.transform(query, statement);
    //   }
    // });

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
  const simpleStatement = "(Test prop_one = '1') And (Test prop_two = '1')";

  const lexingResult = lexer.tokenize(simpleStatement);
  parser.input = lexingResult.tokens;
  const queryResult = ql.visit(parser.query$());
  if (parser.errors.length > 0) {
    console.error(parser.errors);
    throw new Error("Failed to parse the input");
  }
  ql.buildQuery(queryResult)
    .then(res => console.log(res))
    .catch(console.error)
})

