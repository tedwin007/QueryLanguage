import { Column, Entity } from "typeorm";

@Entity("test", { schema: "playground" })
export class Test {
  @Column("varchar", { primary: true, name: "prop_one", length: 255 })
  propOne: string;

  @Column("int", { name: "prop_two", nullable: true })
  propTwo: number | null;
}
