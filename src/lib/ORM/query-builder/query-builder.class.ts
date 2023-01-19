import { DataSource, EntityTarget } from 'typeorm';
import { VisitedStatement } from "../../visitor/visitor.interfaces";
import { AbstractQueryBuilder } from './abstract-query-builder.class';
export interface BuildQueryResponse {
  execute: () => Promise<any>;
  sqlSelectStatement: string;
};

// This is a simple example for implement the QueryBuilder layer 
// this component mitigates between the data (DB) layer and the QueryLanguage (tokenizer-> parser -> visit) 
// the output  of this layer is a query/result from the DB based on visitor output (VisitedStatement)
// this layer support typeORM to be used for query validation and for encapsulation..
// also possible to auto-generate typeScript (ORM) types inferred from you DB 
// Ideas for later development :
//    - use the FilterManger package with typeORM to validate entities props (some issues are open on typeORM's github) 
export class QueryBuilderClass extends AbstractQueryBuilder<BuildQueryResponse> {

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

  private getSqlQuery(statementList: VisitedStatement[]): string {
    let sqlSelectStatement = `SELECT * FROM `;
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
    return `${entity.image} WHERE ${entity.image}.${prop.image}${operator.image}${values.image}`;;
  }

  private hasConjunctionOpt(statementList: VisitedStatement[], i: number): boolean {
    return (statementList.length > (i + 1)) && (statementList.length % 2 !== 0) && (i % 2 !== 0);
  }

  private getExpandedQuery(item: VisitedStatement): string {
    const entity = item.entity;
    const prop = item.prop;
    const operator = item.operator;
    const values = item.values;
    return ` ${entity.image}.${prop.image}${operator.image}${values.image}`;
  }
}


