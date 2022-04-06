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
    if (!token) {
      throw new HttpErrors.Unauthorized(
        'Error in Verifying Token: Token is Null',
      );
    }
    let userProfile: UserProfile;
    try {
      const decode = await JWT.verify(token, 'secret');
      if (!decode) {
        throw new HttpErrors.Unauthorized(
          'Sorry, Not Authorized to Access This Route!',
        );
      }
      userProfile = Object.assign({id: decode.id, name: decode.name});
    } catch (err) {
      throw new HttpErrors.Unauthorized(
        `Error Verifying Token! ${err.message}`,
      );
    }
    return userProfile;
  }
}
