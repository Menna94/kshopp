import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {User} from './models';
import {Credentials} from './repositories';
import {PasswordHasher} from './services/hash.password';

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<Credentials, User>>(
    'services.user.service',
  );
}

export namespace PasswordHashingBindings {
  export const PASS_HASHER =
    BindingKey.create<PasswordHasher>('service.hasher');
}

export namespace TokenBindings {
  export const TOKEN_SERVICE = BindingKey.create<TokenService>('services.jwt');
}
