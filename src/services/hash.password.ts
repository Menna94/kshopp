import {inject} from '@loopback/core';
import * as bcrypt from 'bcryptjs';

interface PasswordHasher<T = string> {
  hashPassword(password: T): Promise<T>;

  matchPass(enteredPass: T, password: T): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher<string> {
  @inject('rounds') public readonly rounds: number;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.rounds);
  }

  async matchPass(enteredPass: string, password: string): Promise<boolean> {
    return bcrypt.compare(enteredPass, password);
  }
}
