import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// The property "name" sets the table name. This is usually implied from the
// class name, however this can be overridden if needed.
@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  email?: string;

  @Column()
  encrypted_password?: string;

  @Column({ name: "created_at" })
  created_at?: Date;

  @Column({ name: "updated_at" })
  updated_at?: Date;

  @Column()
  first_name?: string;

  @Column()
  last_name?: string;

  @Column()
  last_name_2?: string;

  @Column()
  accepts?: boolean;

  @Column()
  status?: number;

  @Column({ name: "benefit_start_date" })
  benefit_start_date?: Date;

  @Column({ name: "bday" })
  bday: Date;

  @Column()
  dni?: string;

  @Column()
  gender?: number;

  @Column()
  phone?: string;

  @Column()
  accepts_policies?: boolean;

  @Column()
  registration_token?: string;

  @Column()
  benefit_end_date?: Date;

  @Column()
  card_bin?: string;

  @Column()
  card_brand?: string;

  @Column()
  role?: string;

  @Column()
  dni_type?: number;

  @Column()
  address?: string;

  @Column()
  latitude?: string;

  @Column()
  longitude?: string;

  @Column()
  postal_code?: string;

  @Column()
  deleted_at?: Date;

  @Column()
  department?: string;

  @Column()
  address_number?: string;

  @Column()
  address_street?: string;

  @Column()
  city?: string;

  @Column()
  card_last_digits?: string;

  @Column()
  merchant_transaction_id?: string;
}
