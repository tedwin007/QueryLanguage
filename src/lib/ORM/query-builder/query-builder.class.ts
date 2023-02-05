import { LexerToken } from './../../lexer/lexer.enum';
import { DataSource } from 'typeorm';
import { ValueSignTypeMap } from '../../visitor/visitor.constants';
import { VisitedNode, VisitedStatement } from '../../visitor/visitor.interfaces';
import { AbstractQueryBuilder } from './abstract-query-builder.class';
import { BuildQueryResponse, SimpleEntityDefinition } from './models/interfaces';
import { parser } from '../../parser/parser';
import { lexer } from '../../lexer/lexer';
import { ParserRules } from '../../parser/parser.enum';

export class QueryBuilderClass extends AbstractQueryBuilder<BuildQueryResponse> {
	private readonly SQLSelect = `SELECT * FROM`;
	private readonly SQLWhere = `WHERE`;

	constructor(dataSource: DataSource, entitiesMetaData: SimpleEntityDefinition[]) {
		super(dataSource, entitiesMetaData);
	}

	buildQuery(statement: string): BuildQueryResponse {
		const { tokens } = lexer.tokenize(statement);
		parser.input = tokens;
		const queryResult = this.visit(parser.query$());
		const sqlSelectStatement = this.toSqlQuery(queryResult);
		return {
			execute: () => this.dataSource.query(sqlSelectStatement),
			getAutoCompleteOptions: () => parser.computeContentAssist(ParserRules.statement, tokens),
			sqlSelectStatement,
		};
	}

	private toSqlQuery(statementList: VisitedStatement[], sqlSelectStatement = ''): string {
		const firstStatement = statementList[0];
		const entity = this.getEntityName(firstStatement);
		sqlSelectStatement = `${this.SQLSelect} ${entity} ${this.SQLWhere} ${this.getQueryCondition(firstStatement, entity)}`;

		for (let i = 1; i < statementList.length; i++) {
			const currentItem = statementList[i];
			sqlSelectStatement +=	' ' +
				(this.hasConjunction(statementList, i) ? currentItem?.conjunctionOpt?.image : this.getQueryCondition(currentItem, currentItem.entity.image));
		}
		return sqlSelectStatement;
	}

	private getQueryCondition(item: VisitedStatement, entity: string): string {
		const prop = this.getPropName(entity, item.prop);
		const operator = this.getOperatorName(entity, prop, item.operator);
		const values = this.getValues(entity, prop, item.values);
		return `${entity}.${prop}${operator}${values}`;
	}

	private getValues(entityName: string, propName: string, values: VisitedNode): string {
		this.validateValues(values, entityName, propName);
		return values.image;
	}

	private validateValues(values: VisitedNode, entityName: string, propName: string): never | void {
		if (!values?.image) throw new Error('getValues method failed (bad input ' + JSON.stringify(values) + ')');
		switch (this.getPropType(entityName, propName)) {
			case 'number':
				if (Number.isNaN(Number(values.image))) throw new Error(values.image + ' should be of type number ');
		}
	}

	private getEntityName(item: VisitedStatement): string {
		const entityName = item.entity.image;
		if (!entityName || !(entityName in this.entitiesMetaData))
			throw new Error('getEntityName method failed, ' + entityName + ' was not found in the known entities list ');
		return entityName;
	}

	private getPropName(entityName: string, item: VisitedNode): string {
		const propName = item?.image;
		if (!propName || !(propName in this.entitiesMetaData[entityName]?.props))
			throw new Error('getPropName method failed,' + propName + 'does not exists in' + entityName);
		return propName;
	}

	private getOperatorName(entityName: string, propName: string, item: VisitedNode): string {
		const operatorName = item?.image;
		this.validateOperator(operatorName, entityName, propName, item);
		return operatorName;
	}

	private validateOperator(operatorName: string, entityName: string, propName: string, item: VisitedNode): never | void {
		if (!operatorName) throw new Error('getOperatorName failed, please provide a valid operator name');
		const propType = this.getPropType(entityName, propName);
		const lexerPropType = this.toLexerToken(propType);
		const validOperatorsList = ValueSignTypeMap.get(lexerPropType);
		if (!validOperatorsList?.includes(item.sign))
			throw new Error(
				'getOperatorName failed, the operator (' + operatorName + ') is not valid to the give propType (' + propName + ':' + propType + ') '
			);
	}

	private getPropType(entityName: string, propName: string): 'string' | 'number' | 'object' {
		return this.entitiesMetaData[entityName]?.props?.[propName];
	}

	// todo: fix null
	private toLexerToken(propType: string): LexerToken {
		const PrimitiveTypeMapper = {
			string: LexerToken.Identifier,
			number: LexerToken.NumberLiteral,
			object: LexerToken.Null,
		};
		return PrimitiveTypeMapper[propType] || LexerToken.Null;
	}

	private hasConjunction(statementList: VisitedStatement[], i: number): boolean {
		return statementList.length > i + 1 && statementList.length % 2 !== 0 && i % 2 !== 0;
	}
}
