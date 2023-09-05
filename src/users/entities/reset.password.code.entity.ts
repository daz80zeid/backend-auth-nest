import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ResetPasswordCode extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  code: string;

  @Column()
  expire_at: string;

  @OneToOne(() => User, (user) => user.reset_password_code)
  user?: User;
}
