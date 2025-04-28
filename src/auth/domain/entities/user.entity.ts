import { Email } from "../value-objects/email.value-object";
import { Fullname } from "../value-objects/fullname.value-object";
import { Password } from "../value-objects/hashed-password.value-object";
import { Id } from "../value-objects/id.value-object";

export class User {
  private id: Id;
  private readonly fullname: Fullname;
  private readonly email: Email;
  private readonly password: Password;
  private readonly role: string; // No se si es necesario dejar un rol de "estudiante" por defecto
  private readonly teacherType: string | null = null; // valor defecto es null

  private constructor(
    id: Id,
    fullname: Fullname,
    email: Email,
    password: Password,
    role?: string,
    teacherType?: string | null,
  ) {
    this.id = id;
    this.fullname = fullname;
    this.email = email;
    this.password = password;
    this.role = role || this.role; // Default to "estudiante" if not provided
    this.teacherType = teacherType || this.teacherType; // Default to null if not provided
  }

  static fromPrimitives(props: {
    id: string;
    fullname: string;
    email: string;
    hashedPassword: string;
    role: string;
    teacherType: string | null;
  }): User {
    return new User(
      new Id(props.id),
      new Fullname(props.fullname),
      new Email(props.email),
      new Password(props.hashedPassword),
      props.role,
      props.teacherType,
    );
  }

  toPrimitives(): {
    id: string;
    fullname: string;
    email: string;
    hashedPassword: string;
    role: string;
    teacherType: string | null;
  } {
    return {
      id: this.id?.toPrimitive(),
      fullname: this.fullname.toPrimitive(),
      email: this.email.toPrimitive(),
      hashedPassword: this.password.toPrimitive(),
      role: this.role,
      teacherType: this.teacherType,
    };
  }

  public getRole(): string {
    return this.role;
  }

  public getTeacherType(): string {
    return this.teacherType;
  }
}
