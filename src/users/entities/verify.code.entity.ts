import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class VerifyCode extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  code: string;

  @Column()
  expire_at: string;

  @OneToOne(() => User, (user) => user.verify_code)
  user?: User;
}
