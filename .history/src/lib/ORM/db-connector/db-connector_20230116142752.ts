import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

export type DSOptions = Exclude<DataSourceOptions, "MongoConnectionOptions">;

export function createDataSource(options: DSOptions): DataSource {

  const ds = new DataSource(options);
  ds.initialize()
  return ds
}