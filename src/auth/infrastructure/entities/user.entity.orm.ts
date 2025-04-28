import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { IsEmail, IsString, MinLength } from "class-validator";

@Entity('users')
@Unique(["email"])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullname: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @MinLength(6)
  password: string;

  @Column()
  role: string;

  @Column()
  teacherType: string | null;
}
