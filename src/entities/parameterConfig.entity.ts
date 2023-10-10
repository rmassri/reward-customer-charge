import { Json } from "aws-sdk/clients/robomaker";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "parameters_config" })
export class ParametersConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  code: string;

  @Column()
  reference: string;

  @Column()
  config: Json;

  @Column()
  groupConfigId: number;
}
