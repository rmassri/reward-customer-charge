import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
// The property "name" sets the table name. This is usually implied from the
// class name, however this can be overridden if needed.
@Entity({ name: "transaction_fiserv" })
export class TransactionFiserv {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  user_id?: number;

  @Column()
  merchant_transaction_id?: string;

  @Column({ name: "created_at" })
  created_at?: Date;

  @Column({ name: "updated_at" })
  updated_at?: Date;

  @Column()
  store?: string;

  @Column()
  status?: number;
}
