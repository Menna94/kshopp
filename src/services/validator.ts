import {HttpErrors} from '@loopback/rest';
import * as isEmail from 'isemail';
import {Credentials} from '../repositories/user.repository';

export function validateCreds(creds: Credentials) {
  if (!isEmail.validate(creds.email)) {
    throw new HttpErrors.UnprocessableEntity('invalid email');
  }

  if (creds.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'password has to be more than 8 characters',
    );
  }
}
