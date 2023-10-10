import { Json } from "aws-sdk/clients/robomaker";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
// The property "name" sets the table name. This is usually implied from the
// class name, however this can be overridden if needed.
@Entity({ name: "cards" })
export class Card {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  cardId?: number;

  @Column()
  fkUserId?: number;

  @Column()
  isActive?: string;

  @Column()
  isFavorite?: string;

  @Column()
  responseConnect?: Json;
}
