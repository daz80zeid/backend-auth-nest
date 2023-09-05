import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'original_name', nullable: true })
  originalName: string;

  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ name: 'type', nullable: true })
  type: string;

  @Column({ name: 'path', nullable: false })
  path: string;

  @Column({ name: 'firebase_path', nullable: false })
  firebasePath: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;
}
