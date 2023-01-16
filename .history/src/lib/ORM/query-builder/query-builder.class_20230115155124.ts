import { Visitor } from "../../visitor/visitor";
import { DataSource, ObjectLiteral, SelectQueryBuilder, Entity, EntityTarget } from "typeorm";
import { VisitedStatement } from "../../visitor/visitor.interfaces";
import { Test } from "../../../../output/entities/Test"

// Concept Only! - checking if this could be a valid solution
export class QueryBuilderClass<T extends ObjectLiteral> extends Visitor {
  private queryBuilder: SelectQueryBuilder<T>;

  constructor(private dataSource: DataSource, private entity: Entity) {
    super();
    if (!dataSource) {
      throw "You need create a valid DataSource instance";
    }
    this.validateVisitor();
    this.queryBuilder = this.dataSource.createQueryBuilder();
  }

  async buildQuery(statements: VisitedStatement[]): Promise<{ execute: () => Promise<any> }> {
    const query: SelectQueryBuilder<T> = this.dataSource.createQueryBuilder().select();
    statements.map((statement: VisitedStatement, index: number) => {
      if (index > 0) {
        query.addSelect((query: SelectQueryBuilder<T>) => this.transform(query, statement));
      } else {
        this.transform(query, statement, this.entity);
      }
    });

    return {
      execute: (): Promise<any> => this.queryBuilder.execute()
    };
  }

  private transform(query: SelectQueryBuilder<T>, statement: VisitedStatement, entityTarget: T): SelectQueryBuilder<ObjectLiteral> {
    return query.from((qb: SelectQueryBuilder<any>) => entityTarget, statement.entity.image)
      .where(
        `${statement.entity.image}.${statement.prop.image} ${statement.operator.image}:values`,
        { values: statement.values.image }
      );
  }
}