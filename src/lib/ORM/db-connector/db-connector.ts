/* eslint-disable @typescript-eslint/no-var-requires */
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
require('dotenv').config();
const { HOST = 'localhost', DB_NAME = 'dbName', USER_NAME = 'admin', PASSWORD = 'psw', DB_TYPE = 'mysql' } = process.env;

const defaultOptions = {
	// todo: fix dbType
	type: DB_TYPE,
	host: HOST,
	port: 3306,
	username: USER_NAME,
	password: PASSWORD,
	database: DB_NAME,
} as DataSourceOptions;

export function createDataSource(options: DataSourceOptions = defaultOptions): Promise<void | DataSource> {
	return new DataSource({
		...defaultOptions,
		...options,
	} as DataSourceOptions).initialize();
}
