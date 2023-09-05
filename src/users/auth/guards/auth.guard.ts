import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { User } from '../../entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { env } from 'process';

@Injectable()
export class AuthGuard implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const extractedToken = request.headers.authorization.replace('Bearer ', '');

    if (isEmpty(extractedToken)) {
      throw new Error('Unable to find valid Auth header');
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(extractedToken, env.SECRET_KEY_JWT);
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        throw new Error('JWT Expired');
      }
      throw new Error('Not valid Bearer token');
    }

    const user = await User.findOne({ where: { id: decodedToken.id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    request.user = user;

    return true;
  }
}
