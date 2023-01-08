import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

export type DSOptions = Exclude<DataSourceOptions, "MongoConnectionOptions">;
export const createDataSource = (options: DSOptions) => {
  const result = new DataSource(options);
  return new Promise((resolve, reject) => {
    result.initialize().catch((err) => {
      reject(`Error init DS: ${err.message}`);
    }).then(() => result);
  });

};

