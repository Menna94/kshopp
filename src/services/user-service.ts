import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories/user.repository';
import {BcryptHasher} from './hash.password';

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    public userRepository: UserRepository,
    @inject('service.hasher') public passwordHasher: BcryptHasher,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    //(1) make sure the user exists
    const foundUser = await this.userRepository.findOne({
      where: {
        email: credentials.email,
      },
    });
    if (!foundUser) {
      throw new HttpErrors.NotFound(
        `There's No User With The Provided Email: ${credentials.email}`,
      );
    }

    //(2) make sure passwords match
    const passwordMatch = await this.passwordHasher.matchPass(
      credentials.password,
      foundUser.password,
    );
    if (!passwordMatch) {
      throw new HttpErrors.Unauthorized('Password Is Not Valid');
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: `${user.id}`,
      name: user.name,
    };
  }
}
