import { Email } from "../value-objects/email.value-object";
import { Fullname } from "../value-objects/fullname.value-object";
import { Password } from "../value-objects/hashed-password.value-object";
import { Id } from "../value-objects/id.value-object";

export class User {
  private id: Id;
  private readonly fullname: Fullname;
  private readonly email: Email;
  private readonly password: Password;

  private constructor(
    id: Id,
    fullname: Fullname,
    email: Email,
    password: Password,
  ) {
    this.id = id;
    this.fullname = fullname;
    this.email = email;
    this.password = password;
  }

  static fromPrimitives(props: {
    id: string;
    fullname: string;
    email: string;
    hashedPassword: string;
  }): User {
    return new User(
      new Id(props.id),
      new Fullname(props.fullname),
      new Email(props.email),
      new Password(props.hashedPassword),
    );
  }

  toPrimitives(): {
    id: string;
    fullname: string;
    email: string;
    hashedPassword: string;
  } {
    return {
      id: this.id?.toPrimitive(),
      fullname: this.fullname.toPrimitive(),
      email: this.email.toPrimitive(),
      hashedPassword: this.password.toPrimitive(),
    };
  }
}
