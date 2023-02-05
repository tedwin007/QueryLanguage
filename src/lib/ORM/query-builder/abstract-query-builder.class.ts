import _ = require('lodash');
import { DataSource } from 'typeorm';
import { Visitor } from "../../visitor/visitor";
import { SimpleEntityDefinition, MappedEntitiesDefinition } from './models/interfaces';

export abstract class AbstractQueryBuilder<OUT> extends Visitor {
    abstract buildQuery(statements: string): OUT
    protected entitiesMetaData: MappedEntitiesDefinition;

    constructor(protected dataSource: DataSource, entitiesDefinition: SimpleEntityDefinition[]) {
        super();
        if (!dataSource) {
            throw "You need create a valid DataSource instance";
        }
        this.validateVisitor();
        this.entitiesMetaData = _.keyBy(entitiesDefinition, 'name') as MappedEntitiesDefinition
    }
}