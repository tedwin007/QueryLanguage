import { DataSource, ObjectLiteral, SelectQueryBuilder, EntityTarget } from "typeorm";
import { VisitedStatement } from "../../visitor/visitor.interfaces";
import { AbstractQueryBuilder } from './abstract-query-builder.class';
export interface BuildQueryResponse {
  execute: () => Promise<any>;
  sqlSelectStatement: string;
};

export class QueryBuilderClass<T extends ObjectLiteral> extends AbstractQueryBuilder {

  constructor(dataSource: DataSource, private entity: EntityTarget<any>) {
    super(dataSource);
  }

  buildQuery(statements: VisitedStatement[]): BuildQueryResponse {
    let sqlSelectStatement = this.getSqlQuery(statements)
    return {
      execute: () => this.dataSource.manager.getRepository(this.entity).query(sqlSelectStatement),
      sqlSelectStatement
    } 
  }

  private getSqlQuery(statementList: VisitedStatement[]) {
    let sqlSelectStatement = `select * from `;
    statementList.forEach((item, i) => {
      if (i == 0) {
        sqlSelectStatement += this.getInitialSelectQuery(item);
      } else if (this.hasConjunctionOpt(statementList, i)) {
        sqlSelectStatement += ' ' + statementList[i].conjunctionOpt.image + this.getExpandedQuery(statementList[i + 1]);
      }
    })
    return sqlSelectStatement
  }

  private getInitialSelectQuery(item: VisitedStatement): string {
    const entity = item.entity;
    const prop = item.prop;
    const operator = item.operator;
    const values = item.values;
    return `${entity.image} where ${prop.image}${operator.image}${values.image}`;;
  }

  private hasConjunctionOpt(statementList: VisitedStatement[], i: number): boolean {
    return (statementList.length > (i + 1)) && (statementList.length % 2 !== 0) && (i % 2 !== 0);
  }

  private getExpandedQuery(item: VisitedStatement): string {
    const prop = item.prop;
    const operator = item.operator;
    const values = item.values;
    return ` ${prop.image}${operator.image}${values.image}`;
  }
}


