import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

export type DSOptions = Exclude<DataSourceOptions, "MongoConnectionOptions">;

export function createDataSource(options: DSOptions): Promise<void | DataSource> {
  const ds = new DataSource(options);
  console.log(ds);

  return (ds.initialize()).catch((err) => {
    throw new Error(`Error init DS: ${err.message}`);
  }).then((ds: void | DataSource) => ds);
}