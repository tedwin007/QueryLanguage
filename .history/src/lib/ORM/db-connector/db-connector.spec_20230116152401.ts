import { DSOptions, createDataSource } from "./db-connector";
import { DataSource } from "typeorm";

describe("db-connector", () => {
  let DS: Promise<DataSource | unknown>;

  beforeEach(() => {
    DataSource.prototype.initialize = jasmine.createSpy().and.resolveTo({});
    DS = createDataSource(DSConnectionMock);
  });

  it("should call initialize in createDataSource ", () => {
    expect(DataSource.prototype.initialize).toHaveBeenCalled();
  });

  it("should create DataSource instance", () => {
    expect(DS).toBeDefined();
  });
});


const DSConnectionMock: DSOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test"
};

