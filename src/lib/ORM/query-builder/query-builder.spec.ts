/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryBuilderClass } from './query-builder.class';

describe('QueryBuilderClass', () => {
	const ql = new QueryBuilderClass({ createQueryBuilder: jasmine.createSpy() } as any, [
		{
			name: 'Test',
			props: { prop_one: 'number', prop_two: 'number' },
		},
	]);
	let complexStatement: string;
	let simpleStatement: string;

	describe('Simple Statement', () => {
		beforeEach(() => {
			simpleStatement = '(Test prop_one = 1)';
		});
		it('QueryBuilder instance should exists', () => {
			expect(ql).toBeDefined();
		});

		it('BuildQuery should return a valid (simple) query', () => {
			const sqlSelectStatement = ql.buildQuery(simpleStatement).sqlSelectStatement;
			const expected = 'SELECT * FROM Test WHERE Test.prop_one=1';
			expect(sqlSelectStatement).toEqual(expected);
		});
	});
	describe('Complex Statement', () => {
		describe('Or', () => {
			beforeEach(() => {
				complexStatement = "(Test prop_one = '1') OR (Test prop_two = '1')";
			});

			it('buildQuery should return a valid query', () => {
				const sqlSelectStatement = ql.buildQuery(complexStatement).sqlSelectStatement;
				const expected = 'SELECT * FROM Test WHERE Test.prop_one=1 OR Test.prop_two=1';
				expect(sqlSelectStatement).toEqual(expected);
			});
		});

		describe('And', () => {
			describe('Complex Statement', () => {
				beforeEach(() => {
					complexStatement = "(Test prop_one = '1') And (Test prop_two = '1')";
				});

				it('buildQuery should return a valid query', () => {
					const sqlSelectStatement = ql.buildQuery(complexStatement).sqlSelectStatement;
					const expected = 'SELECT * FROM Test WHERE Test.prop_one=1 And Test.prop_two=1';
					expect(sqlSelectStatement).toEqual(expected);
				});

				describe('With two different entities', () => {
					beforeEach(() => {
						complexStatement = "(Test prop_one = '1') And (Test prop_two = '1')";
					});

					it('BuildQuery method should return a valid query', () => {
						const sqlSelectStatement = ql.buildQuery(complexStatement).sqlSelectStatement;
						const expected = 'SELECT * FROM Test WHERE Test.prop_one=1 And Test.prop_two=1';
						expect(sqlSelectStatement).toEqual(expected);
					});
				});
			});
		});
	});
});
