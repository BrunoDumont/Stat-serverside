import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {IntegrationUser} from "../integrtion-user/integration-user.entity";

@Entity()
export class IntegrationCabinet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: '' })
  uid: string;

  @Column({ nullable: true, default: '' })
  name: string;

  @Column({ nullable: true, default: true })
  access_get_statistic: boolean;

  @Column({ nullable: true, default: 1, type: 'float' })
  factor: number;

  @ManyToOne(() => IntegrationUser, { onDelete: 'CASCADE' })
  account: IntegrationUser;
}