import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { RoleEntity } from './role.entity.orm';

@Entity('usuarios')
@Unique(['email'])
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullname: string;

    @Column()
    email: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => RoleEntity, role => role.users)
    @JoinColumn({ name: 'role_id' })
    role: RoleEntity;

    @Column({ default: false })
    isProtected: boolean;
}
