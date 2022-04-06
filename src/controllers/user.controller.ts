/* eslint-disable @typescript-eslint/naming-convention */
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {PasswordHashingBindings} from '../keys';
import {User} from '../models';
import {UserRepository} from '../repositories/user.repository';
import {BcryptHasher} from '../services/hash.password';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    @inject(PasswordHashingBindings.PASS_HASHER) public passHash: BcryptHasher,
  ) {}

  //==   Fetch All Users   ==//
  //@access => protected => @admin
  @get('/users')
  @authenticate('jwt')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  //==   Fetch User   ==//
  //@access => protected => @admin/@user
  @get('/users/{id}')
  @authenticate('jwt')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  //==   Update User   ==//
  //@access => protected => @admin/@user
  @put('/users/{id}')
  @authenticate('jwt')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  //==   Delete User   ==//
  //@access => protected => @admin
  @del('/users/{id}')
  @authenticate('jwt')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
