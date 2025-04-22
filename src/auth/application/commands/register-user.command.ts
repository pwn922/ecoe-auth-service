

export class RegisterUserCommand {
  constructor(
    public readonly fullname: string,
    public readonly email: string,
    public readonly password: string
  ) {}
}
