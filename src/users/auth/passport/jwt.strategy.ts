import * as passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { env } from 'process';

@Injectable()
export class JwtStrategy extends Strategy {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: env.SECRET_KEY_JWT,
    });
    passport.use(this);
  }
}
