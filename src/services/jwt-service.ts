import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';

const JWT = require('jsonwebtoken');

export class JWTService {
  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error While genertaing token: userProfile is Null',
      );
    }

    let token = '';
    try {
      token = await JWT.sign(userProfile, 'JWT_SECRET', {expiresIn: '2d'});
    } catch (err) {
      throw new HttpErrors.Unauthorized(`Error While Generating Token. ${err}`);
    }

    return token;
  }

  //Token verification
  async verifyToken(token: string): Promise<UserProfile> {
    return Promise.resolve({
      [securityId]: '1',
      name: 'kk',
    });
  }
}
