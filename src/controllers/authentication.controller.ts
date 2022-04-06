/* eslint-disable @typescript-eslint/naming-convention */
// Uncomment these imports to begin using these cool features!

import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {
  PasswordHashingBindings,
  TokenBindings,
  UserServiceBindings,
} from '../keys';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {BcryptHasher} from '../services/hash.password';
import {JWTService} from '../services/jwt-service';
import {MyUserService} from '../services/user-service';
import {validateCreds} from '../services/validator';
import {CredentialsRequestBody} from './specs/user.controller.specs';

const _ = require('lodash');

export class AuthenticationController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHashingBindings.PASS_HASHER) public passHash: BcryptHasher,
    @inject(UserServiceBindings.USER_SERVICE) public userService: MyUserService,
    @inject(TokenBindings.TOKEN_SERVICE) public jwt: JWTService,
  ) {}

  //==   Get Current User   ==//
  //@access => protected => @admin/user
  @get('/auth/current-user')
  @authenticate('jwt')
  async me(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
  ): Promise<UserProfile> {
    return Promise.resolve(currentUser);
  }
  @response(200, {
    description: 'User Me',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })

  //==   Signup   ==//
  //@access => public
  @post('/auth/signup')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async signup(@requestBody() user: User): Promise<User> {
    //validate user inputs
    validateCreds(_.pick(user, ['email', 'password']));
    //hash password with bcrypt
    user.password = await this.passHash.hashPassword(user.password);
    //create a new user
    let newUser = await this.userRepository.create(user);
    //return the user created but eliminate password
    newUser = _.pick(newUser, ['name', 'email']);

    return newUser;
  }

  //==   Login   ==//
  //@access => public
  @post('/auth/login')
  @response(200, {
    description: 'Token',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    //make sure user exists && password is valid
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    //generate a json web token
    const token = await this.jwt.generateToken(userProfile);
    console.log(process.env.TEST);

    //return token
    return Promise.resolve({token});
  }

  //==   Logout   ==//
  //@access => protected => @user
  @get('/auth/logout')
  @response(204, {
    description: 'Logging Out User',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User),
      },
    },
  })
  @authenticate('jwt')
  async logout(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<void> {
    await this.userRepository.updateById(currentUser.id, {
      id: undefined,
    });
  }
}
