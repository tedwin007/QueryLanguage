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
    let sqlSelectStatement = this.getSqlQuery(statements)
    return await this.dataSource.manager.getRepository(this.entity).query(sqlSelectStatement)
  }

  private getSqlQuery(statementList: VisitedStatement[]) {
    let sqlSelectStatement = `select * from `;
    statementList.forEach((item, i) => {
      if (i === 0) {
        const entity = item.entity;
        const prop = item.prop;
        const operator = item.operator;
        const values = item.values;
        sqlSelectStatement += `${entity.image} where ${prop.image}${operator.image}${values.image}`
      } else if (statementList.length < i + 1 && (statementList.length % 2 !== 0) && i % 2 !== 0) {
        sqlSelectStatement += this.getExpandedQuery(statementList[i + 1]);
      }
    })
    return sqlSelectStatement
  }

  getExpandedQuery(item: VisitedStatement): string {
    const prop = item.prop;
    const operator = item.operator;
    const values = item.values;
    return ` ${prop.image}${operator.image}${values.image}`;
  }
}

const config: any = {
  "name": "default",
  "type": "mysql",
  "host": "",
  "port": 3306,
  "username": "root",
  "password": "!QAZ2wsx",
  "database": "playground",
  "synchronize": false,
  'entities': [Test],
}

createDataSource(config).then((DS: any) => {
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

