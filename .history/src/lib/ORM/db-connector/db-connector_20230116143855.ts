import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

export type DSOptions = Exclude<DataSourceOptions, "MongoConnectionOptions">;

export async function createDataSource(options: DSOptions): Promise<void | DataSource> {
  return await (new DataSource(options).initialize())
}