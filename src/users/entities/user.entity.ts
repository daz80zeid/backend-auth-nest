import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VerifyCode } from './verify.code.entity';
import { ResetPasswordCode } from './reset.password.code.entity';
import { Provider } from '../enums/provider.enum';
import { AuthMethodsEnum } from '../enums/auth.methods.enum';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ length: 128, nullable: true })
  uid: string;

  @Column({ length: 500, nullable: true })
  last_name: string;

  @Column({ length: 500, nullable: true })
  first_name: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ length: 500, nullable: true })
  password: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @Column({ default: false })
  verify: boolean;

  @Column({ name: 'raw_provider_data', nullable: true, type: 'text' })
  rawProviderData: any;

  @Column({ name: 'provider', nullable: true, enum: Provider })
  provider: Provider;

  @Column({ name: 'auth_Method', nullable: true, enum: AuthMethodsEnum })
  authMethod: AuthMethodsEnum;

  @Column({ name: 'display_name', nullable: true })
  displayName?: string;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'banned', default: false })
  banned?: boolean;

  @Column({ name: 'date_banned', nullable: true })
  dateBanned?: Date;

  @Column({ name: 'banned_period', nullable: true })
  bannedPeriod?: number;

  @Column({ name: 'status', nullable: true })
  status?: string;

  @Column({ name: 'photo_url', nullable: true })
  photoURL?: string;

  @OneToOne(() => VerifyCode, (verifyCode) => verifyCode.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'id_verify_code' })
  verify_code?: VerifyCode;

  @OneToOne(
    () => ResetPasswordCode,
    (resetPasswordCode) => resetPasswordCode.user,
    {
      cascade: true,
      eager: true,
    },
  )
  @JoinColumn({ name: 'id_reset_password_code' })
  reset_password_code?: ResetPasswordCode;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  public readonly isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  public readonly createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public readonly updatedAt: Date;

  constructor(data?: Partial<User>) {
    super();
    Object.assign(this, data);
  }
}
