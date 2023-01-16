import { DSOptions, createDataSource } from "./db-connector";
import { DataSource } from "typeorm";

describe("db-connector", () => {
  let DS: Promise<DataSource | unknown>;
  DataSource.prototype.initialize = jasmine.createSpy();

  beforeEach(() => {
    jasmine.createSpy("createDataSource", createDataSource).and.returnValue({
      initialize: () => Promise.resolve({})
    } as any);
    DS = createDataSource(DSConnectionMock);
  });

  it("should call initialize in createDataSource ", () => {
    expect(DataSource.prototype.initialize).toHaveBeenCalled();
  });

  fit("should create DataSource instance", () => {
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

