import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// The property "name" sets the table name. This is usually implied from the
// class name, however this can be overridden if needed.
@Entity({ name: "users" })
export class UserCore {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  email?: string;

  @Column()
  country?: string;

  @Column()
  status?: string;
}
