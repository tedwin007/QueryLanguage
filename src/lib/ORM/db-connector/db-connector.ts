/* eslint-disable @typescript-eslint/no-var-requires */
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
require('dotenv').config();
const { HOST = '', DB_NAME = '', USER_NAME = '', PASSWORD = '', DB_TYPE = '' } = process.env;

const defaultOptions = {
	type: <any>DB_TYPE,
	host: HOST,
	port: 3306,
	username: USER_NAME,
	password: PASSWORD,
	database: DB_NAME,
};
export function createDataSource(options: Partial<DataSourceOptions> = defaultOptions): Promise<void | DataSource> {
	return new DataSource({
		...defaultOptions,
		...options,
	} as DataSourceOptions).initialize();
}
