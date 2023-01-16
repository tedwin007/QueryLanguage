import { Visitor } from "../../visitor/visitor";
import { DataSource, ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { VisitedStatement } from "../../visitor/visitor.interfaces";
import { Test } from "../../../../output/entities/Test"

// Concept Only! - checking if this could be a valid solution
export class QueryBuilderClass extends Visitor {
  private queryBuilder: SelectQueryBuilder<ObjectLiteral>;

  constructor(private dataSource: DataSource) {
    super();
    if (!dataSource) {
      throw "You need create a valid DataSource instance";
    }
    this.validateVisitor();
    this.queryBuilder = this.dataSource.createQueryBuilder();
  }

  async buildQuery(statements: VisitedStatement[]): Promise<{ execute: () => Promise<any> }> {
    const query: SelectQueryBuilder<any> = this.dataSource.createQueryBuilder().select();
    statements.map((statement: VisitedStatement, index: number) => {
      if (index > 0) {
        query.addSelect((query: SelectQueryBuilder<any>) => this.transform(query, statement));
      } else {
        this.transform(query, statement);
      }
    });

    return {
      execute: (): Promise<any> => this.queryBuilder.execute()
    };
  }

  private transform(query: SelectQueryBuilder<any>, statement: VisitedStatement): SelectQueryBuilder<ObjectLiteral> {
    return query.from(Test, statement.entity.image)
      .where(
        `${statement.entity.image}.${statement.prop.image} ${statement.operator.image}:values`,
        { values: statement.values.image }
      );
  }
}