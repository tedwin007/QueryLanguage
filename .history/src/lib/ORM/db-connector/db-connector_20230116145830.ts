import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

export type DSOptions = Exclude<DataSourceOptions, "MongoConnectionOptions">;

export function createDataSource(options: DSOptions): Promise<void | DataSource> {
  const dataS = new DataSource(options).initialize()
  return dataS.then((ds: void | DataSource) => { ds || dataS }).catch(() => dataS);
}