import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {TokenBindings} from '../keys';
import {JWTService} from '../services/jwt-service';

export class JWTStrategy implements AuthenticationStrategy {
  //inject JWTService: generateToken() && verifyToken()
  constructor(@inject(TokenBindings.TOKEN_SERVICE) public jwt: JWTService) {}

  //Name of the strategy
  name = 'jwt';

  //The 'authenticate' method takes in a given request and returns a user profile
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = this.extractCredentials(request);
    //userProfile ={securityId: id , name:name}
    const userProfile = await this.jwt.verifyToken(token);
    return Promise.resolve(userProfile);
  }

  extractCredentials(request: Request): string {
    //make sure there are Bearer request headers to continue accessing the route
    if (
      !request.headers.authorization ||
      !request.headers.authorization.startsWith('Brearer ')
    ) {
      throw new HttpErrors.Unauthorized(
        'Sorry, You Are Not Authorized To Access This Route!',
      );
    }
    const token = request.headers.authorization.split(' ')[1];

    return token;
  }
}
