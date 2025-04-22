import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordHasherOutputPort } from '../../application/ports/out/password-hasher.output-port';

@Injectable()
export class BcryptServiceAdapter implements IPasswordHasherOutputPort {
  async hash(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}