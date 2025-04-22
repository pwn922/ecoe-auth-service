import { LoginUserCommand } from "../../commands/login-user.command";

export interface LoginUserInputPort {
  execute(command: LoginUserCommand): Promise<string>;
}