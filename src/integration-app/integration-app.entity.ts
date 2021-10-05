import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class IntegrationApp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: '' })
  uid: string;

  @Column({ nullable: true, default: '' })
  name: string;

  @Column({ nullable: true, default: '' })
  key: string;

  @Column({ nullable: true, default: '' })
  version: string;

  @Column({ nullable: true, default: '' })
  utm_source: string;
}