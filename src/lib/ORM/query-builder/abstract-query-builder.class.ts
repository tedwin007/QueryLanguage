import { DataSource } from "typeorm";
import { Visitor } from "../../visitor/visitor";
import { VisitedStatement } from "../../visitor/visitor.interfaces";

export abstract class AbstractQueryBuilder<OUT> extends Visitor {
    abstract buildQuery(statements: VisitedStatement[]): OUT

    constructor(protected dataSource: DataSource) {
        super();
        if (!dataSource) {
            throw "You need create a valid DataSource instance";
        }
        this.validateVisitor();
    }
}