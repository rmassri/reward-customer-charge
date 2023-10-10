import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// The property "name" sets the table name. This is usually implied from the
// class name, however this can be overridden if needed.
@Entity({ name: "premium_users" })
export class PremiumUser {
  static some(arg0: (element: any) => boolean): unknown {
    throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "email" })
  email?: string;

  @Column({ name: "dni" })
  dni?: string;

  @Column({ name: "created_at" })
  created_at?: Date;

  @Column({ name: "updated_at" })
  updated_at?: Date;

  @Column()
  first_name?: string;

  @Column()
  last_name?: string;

  @Column()
  bday?: string;

  @Column({ name: "user_id" })
  user_id?: number;

  @Column({ name: "promotion_company_id" })
  promotion_company_id?: number;

  @Column({ name: "siebel_id" })
  siebel_id?: number;

  @Column()
  phone?: string;

  @Column()
  dni_type?: number;

  @Column()
  address?: string;

  @Column()
  gender?: number;
}
