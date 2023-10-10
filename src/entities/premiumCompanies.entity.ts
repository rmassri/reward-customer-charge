import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// The property "name" sets the table name. This is usually implied from the
// class name, however this can be overridden if needed.
@Entity({ name: "premium_companies" })
export class PremiumCompanies {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "name" })
  name?: string;

  @Column({ name: "description" })
  description?: string;

  @Column({ name: "message" })
  message?: Date;

  @Column({ name: "start_date" })
  start_date?: Date;

  @Column({ name: "end_date" })
  end_date?: Date;

  @Column({ name: "benefit_value" })
  benefit_value?: number;

  @Column({ name: "deleted_at" })
  deleted_at?: Date;

  @Column({ name: "created_at" })
  created_at?: Date;

  @Column({ name: "updated_at" })
  updated_at?: Date;
}
