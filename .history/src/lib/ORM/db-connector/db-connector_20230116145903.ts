import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

export type DSOptions = Exclude<DataSourceOptions, "MongoConnectionOptions">;

export function createDataSource(options: DSOptions): Promise<void | DataSource> {
  return new DataSource(options).initialize()
}